/**
 * BKT (Bayesian Knowledge Tracing) Engine
 *
 * Pure, deterministic implementation of the Bayesian Knowledge Tracing
 * update formulas specified in BA v1.4 (TS-07).
 *
 * Per BA v1.4 — TS-07: the BKT algorithm MUST be deterministic. Given the
 * same inputs (P_L, observations), the same outputs are always produced.
 * No randomness, no time-dependence, no environment-dependence.
 *
 * The implementation has NO side effects and NO database access. It is
 * a pure math layer — services call it to compute updated mastery
 * probabilities and classification status.
 *
 * @see docs/01-business/VerveAI_BA_Document_v1.4.md
 */

/**
 * Fixed BKT parameters (per BA v1.4).
 *
 *   P_INIT — Initial probability of mastery (P_L₀)
 *   P_LEARN — Probability of learning on each opportunity (P_T)
 *   P_GUESS — Probability of guessing correctly without skill (P_G)
 *   P_SLIP  — Probability of slipping (wrong despite skill) (P_S)
 *
 * These parameters are FIXED across the system (no per-student tuning).
 */
export const BKT_PARAMS = {
  P_INIT: 0.1,
  P_LEARN: 0.15,
  P_GUESS: 0.2,
  P_SLIP: 0.1,
} as const;

/**
 * Minimum number of attempts before a diagnosis may be flagged as
 * STRUGGLING with confidence. After fewer attempts we cannot reliably
 * distinguish learning from noise.
 */
export const STRUGGLING_MIN_ATTEMPTS = 5;

/**
 * Mastery threshold — once P(L) crosses this value the skill is
 * considered "MASTERED" and no further intervention is required.
 */
export const MASTERY_THRESHOLD = 0.95;

/**
 * Diagnosed threshold — once P(L) crosses this value the diagnosis is
 * considered reliable (DIAGNOSED). Below this the diagnosis remains
 * PENDING.
 */
export const DIAGNOSED_THRESHOLD = 0.5;

/**
 * Mastery status as stored in `diagnosis.status` (Prisma enum).
 */
export type MasteryStatus = 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';

/**
 * Single observation passed through the BKT update rule.
 */
export interface BktObservation {
  /** Whether the student answered correctly. */
  correct: boolean;
}

/**
 * Bounds-check helper for floating-point safety. The BKT formulas are
 * guaranteed to produce values in [0,1] for inputs in [0,1] under the
 * fixed parameters, but floating-point arithmetic can occasionally
 * produce values just outside the interval.
 */
function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/**
 * Update mastery probability for a single observation.
 *
 * @param pKnown  Current P(L) in [0,1].
 * @param correct Whether the student answered the item correctly.
 * @returns       New P(L) in [0,1].
 *
 * Implementation is DETERMINISTIC — same `(pKnown, correct)` always
 * returns the same value.
 */
export function updateMastery(pKnown: number, correct: boolean): number {
  const { P_LEARN, P_GUESS, P_SLIP } = BKT_PARAMS;

  // Guard against out-of-range input.
  const safeP = clamp01(pKnown);
  const oneMinusP = 1 - safeP;

  if (correct) {
    // P(L_n | correct) = [P(L) + (1 - P(L)) * P_LEARN] /
    //                    [P(L) + (1 - P(L)) * P_LEARN + (1 - P_GUESS) * (1 - P(L))]
    const numerator = safeP + oneMinusP * P_LEARN;
    const denominator = numerator + (1 - P_GUESS) * oneMinusP;

    if (denominator === 0) {
      return 0;
    }
    return clamp01(numerator / denominator);
  }

  // P(L_n | incorrect) = [(1 - P_LEARN) * P(L)] /
  //                      [(1 - P_LEARN) * P(L) + P_SLIP * (1 - P(L))]
  const numerator = (1 - P_LEARN) * safeP;
  const denominator = numerator + P_SLIP * oneMinusP;

  if (denominator === 0) {
    return 0;
  }
  return clamp01(numerator / denominator);
}

/**
 * Update P(L) over a sequence of (correctness) observations.
 * Returns the final P(L) and the array of intermediate values.
 */
export function updateMasterySequence(
  pKnown: number,
  observations: readonly boolean[]
): { final: number; trajectory: number[] } {
  let current = clamp01(pKnown);
  const trajectory: number[] = [current];

  for (const obs of observations) {
    current = updateMastery(current, obs);
    trajectory.push(current);
  }

  return { final: current, trajectory };
}

/**
 * Classify P(L) into a diagnosis status.
 *
 * Status semantics (matching Prisma `diagnosis_status` enum):
 *   - MASTERED  — P(L) >= MASTERY_THRESHOLD
 *   - STRUGGLING — `attempts >= STRUGGLING_MIN_ATTEMPTS` AND P(L) < DIAGNOSED_THRESHOLD
 *   - DIAGNOSED  — P(L) >= DIAGNOSED_THRESHOLD (but not yet MASTERED)
 *   - PENDING    — otherwise
 *
 * `attempts` defaults to 0 so callers that only know P(L) get the
 * threshold-only classification.
 */
export function masteryStatus(pKnown: number, attempts: number = 0): MasteryStatus {
  const safeP = clamp01(pKnown);

  if (safeP >= MASTERY_THRESHOLD) {
    return 'MASTERED';
  }

  if (attempts >= STRUGGLING_MIN_ATTEMPTS && safeP < DIAGNOSED_THRESHOLD) {
    return 'STRUGGLING';
  }

  if (safeP >= DIAGNOSED_THRESHOLD) {
    return 'DIAGNOSED';
  }

  return 'PENDING';
}

/**
 * Confidence in the diagnosis. Computed as the absolute distance of
 * P(L) from the indeterminate point P(L) = 0.5.
 *
 * A P(L) very close to 0.5 yields low confidence — there is not yet
 * enough evidence to distinguish a mastery signal from a guess/slip.
 * Values closer to 0 or 1 yield higher confidence.
 *
 * Returns a value in [0, 1].
 */
export function diagnosisConfidence(pKnown: number): number {
  const safeP = clamp01(pKnown);
  return clamp01(Math.abs(safeP - 0.5) * 2);
}

/**
 * Build a new diagnosis record's initial P(L) and confidence.
 * Always uses BKT_PARAMS.P_INIT.
 */
export function initialMastery(): { pKnown: number; confidence: number; status: MasteryStatus } {
  const pKnown = BKT_PARAMS.P_INIT;
  return {
    pKnown,
    confidence: diagnosisConfidence(pKnown),
    status: masteryStatus(pKnown, 0),
  };
}
