/**
 * Unit tests for the BKT Engine
 *
 * Tests the pure deterministic functions in bkt-engine.ts:
 *   - updateMastery(pKnown, correct) for both true/false
 *   - masteryStatus(pKnown, attempts)
 *   - diagnosisConfidence(pKnown)
 *   - initialMastery()
 *   - updateMasterySequence()
 *
 * These functions have NO side effects and NO database access, so tests
 * are fully deterministic.
 *
 * Per TS-07: the BKT algorithm must be deterministic — same input always
 * produces same output across runs.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  BKT_PARAMS,
  MASTERY_THRESHOLD,
  DIAGNOSED_THRESHOLD,
  STRUGGLING_MIN_ATTEMPTS,
  initialMastery,
  masteryStatus,
  updateMastery,
  updateMasterySequence,
  diagnosisConfidence,
} from '../../src/services/bkt-engine';

describe('BKT Engine — Determinism', () => {
  it('is deterministic: updateMastery is pure (call twice, same result)', () => {
    const p = 0.4;
    const r1 = updateMastery(p, true);
    const r2 = updateMastery(p, true);
    expect(r1).toBeCloseTo(r2, 10);
  });

  it('is deterministic: same trajectory always yields same final P(L)', () => {
    const trajectory1 = [true, false, true, true, false];
    const trajectory2 = [true, false, true, true, false];
    const { final: f1 } = updateMasterySequence(0.1, trajectory1);
    const { final: f2 } = updateMasterySequence(0.1, trajectory2);
    expect(f1).toBeCloseTo(f2, 10);
  });

  it('returns identical output regardless of call order within test session', () => {
    const results = Array.from({ length: 5 }, () => updateMastery(0.3, true));
    results.forEach((r) => expect(r).toBeCloseTo(results[0]!, 10));
  });
});

describe('BKT Engine — updateMastery', () => {
  // All expected values computed from the exact BKT formulas in bkt-engine.ts.

  describe('correct = true', () => {
    it('initial state: P(L₀) = 0.1 → after 1 correct', () => {
      const result = updateMastery(BKT_PARAMS.P_INIT, true);
      // Formula: (0.1 + 0.9*0.15) / (0.1 + 0.9*0.15 + 0.8*0.9)
      // = 0.235 / 0.955 = 0.24607...
      expect(result).toBeCloseTo(0.24607, 4);
    });

    it('after 5 correct attempts from initial state', () => {
      let p = BKT_PARAMS.P_INIT;
      for (let i = 0; i < 5; i++) {
        p = updateMastery(p, true);
      }
      // Approximate: ~0.65 (spec says ~0.6, we accept ±0.1)
      expect(p).toBeGreaterThan(0.55);
      expect(p).toBeLessThan(0.75);
    });

    it('after 10 correct attempts from initial state', () => {
      let p = BKT_PARAMS.P_INIT;
      for (let i = 0; i < 10; i++) {
        p = updateMastery(p, true);
      }
      // Should be approaching mastery (0.95)
      expect(p).toBeGreaterThan(0.70);
      expect(p).toBeLessThan(0.90);
    });

    it('asymptotically approaches 1.0 (but never exceeds)', () => {
      let p = BKT_PARAMS.P_INIT;
      for (let i = 0; i < 100; i++) {
        p = updateMastery(p, true);
      }
      expect(p).toBeLessThanOrEqual(1.0);
      expect(p).toBeGreaterThan(0.95);
    });

    it('starting from 0.5 → correct → expected range', () => {
      const result = updateMastery(0.5, true);
      // Formula: (0.5 + 0.5*0.15) / (0.5 + 0.5*0.15 + 0.8*0.5)
      // = 0.575 / 0.975 = 0.5897
      expect(result).toBeCloseTo(0.5897, 4);
    });
  });

  describe('correct = false', () => {
    it('initial state: P(L₀) = 0.1 → after 1 incorrect', () => {
      const result = updateMastery(BKT_PARAMS.P_INIT, false);
      // Formula: (0.85*0.1) / (0.85*0.1 + 0.1*0.9)
      // = 0.085 / 0.175 = 0.4857
      expect(result).toBeCloseTo(0.4857, 4);
    });

    it('starting from 0.5 → incorrect → expected range', () => {
      const result = updateMastery(0.5, false);
      // Formula: (0.85*0.5) / (0.85*0.5 + 0.1*0.5)
      // = 0.425 / 0.475 = 0.8947
      expect(result).toBeCloseTo(0.8947, 4);
    });

    it('starting from 0.9 → incorrect → not too close to 1', () => {
      const result = updateMastery(0.9, false);
      // Formula: (0.85*0.9) / (0.85*0.9 + 0.1*0.1)
      // = 0.765 / 0.775 = 0.9871
      expect(result).toBeLessThan(1.0);
      expect(result).toBeGreaterThan(0.9);
    });
  });

  describe('edge cases', () => {
    it('handles pKnown = 0', () => {
      const correct = updateMastery(0, true);
      const incorrect = updateMastery(0, false);
      expect(correct).toBeGreaterThanOrEqual(0);
      expect(correct).toBeLessThanOrEqual(1);
      expect(incorrect).toBeGreaterThanOrEqual(0);
      expect(incorrect).toBeLessThanOrEqual(1);
    });

    it('handles pKnown = 1', () => {
      const correct = updateMastery(1, true);
      const incorrect = updateMastery(1, false);
      // When P(L)=1 and incorrect, P_SLIP introduces some uncertainty.
      expect(correct).toBeGreaterThanOrEqual(0);
      expect(correct).toBeLessThanOrEqual(1);
      expect(incorrect).toBeGreaterThanOrEqual(0);
      expect(incorrect).toBeLessThanOrEqual(1);
    });

    it('clamps NaN (theoretical floating-point edge) to 0', () => {
      // Direct call with a NaN-like value
      const result = updateMastery(NaN, true);
      expect(result).toBe(0);
    });
  });
});

describe('BKT Engine — masteryStatus', () => {
  it('P(L) >= MASTERY_THRESHOLD → MASTERED', () => {
    expect(masteryStatus(0.95)).toBe('MASTERED');
    expect(masteryStatus(0.96)).toBe('MASTERED');
    expect(masteryStatus(1.0)).toBe('MASTERED');
  });

  it('P(L) < DIAGNOSED_THRESHOLD with < STRUGGLING_MIN_ATTEMPTS → PENDING', () => {
    expect(masteryStatus(0.3, 2)).toBe('PENDING');
    expect(masteryStatus(0.1, 0)).toBe('PENDING');
  });

  it('P(L) >= DIAGNOSED_THRESHOLD and < MASTERY_THRESHOLD → DIAGNOSED', () => {
    expect(masteryStatus(0.5)).toBe('DIAGNOSED');
    expect(masteryStatus(0.7, 10)).toBe('DIAGNOSED');
  });

  it('P(L) < DIAGNOSED_THRESHOLD with >= STRUGGLING_MIN_ATTEMPTS → STRUGGLING', () => {
    expect(masteryStatus(0.3, 5)).toBe('STRUGGLING');
    expect(masteryStatus(0.1, 10)).toBe('STRUGGLING');
  });

  it('STRUGGLING only when both conditions are met', () => {
    expect(masteryStatus(0.6, 5)).toBe('DIAGNOSED'); // above threshold
    expect(masteryStatus(0.3, 4)).toBe('PENDING');   // not enough attempts
  });

  it('default attempts = 0 → no STRUGGLING regardless of pKnown', () => {
    expect(masteryStatus(0.1)).toBe('PENDING');
    expect(masteryStatus(0.3)).toBe('PENDING');
  });
});

describe('BKT Engine — diagnosisConfidence', () => {
  it('maximum confidence at P(L) = 0 and P(L) = 1', () => {
    expect(diagnosisConfidence(0)).toBeCloseTo(1.0, 4);
    expect(diagnosisConfidence(1)).toBeCloseTo(1.0, 4);
  });

  it('zero confidence at P(L) = 0.5 (indeterminate point)', () => {
    expect(diagnosisConfidence(0.5)).toBeCloseTo(0.0, 4);
  });

  it('P(L) = 0.7 → confidence ~0.4', () => {
    expect(diagnosisConfidence(0.7)).toBeCloseTo(0.4, 4);
  });

  it('P(L) = 0.2 → confidence ~0.6', () => {
    expect(diagnosisConfidence(0.2)).toBeCloseTo(0.6, 4);
  });
});

describe('BKT Engine — initialMastery', () => {
  it('pKnown equals BKT_PARAMS.P_INIT', () => {
    const { pKnown } = initialMastery();
    expect(pKnown).toBe(BKT_PARAMS.P_INIT);
  });

  it('confidence is computed from pKnown = P_INIT', () => {
    const { confidence } = initialMastery();
    expect(confidence).toBeCloseTo(diagnosisConfidence(BKT_PARAMS.P_INIT), 4);
  });

  it('status is PENDING for initial state', () => {
    const { status } = initialMastery();
    expect(status).toBe('PENDING');
  });
});

describe('BKT Engine — updateMasterySequence', () => {
  it('returns the full trajectory including the initial value', () => {
    const { trajectory } = updateMasterySequence(0.1, [true, false]);
    expect(trajectory).toHaveLength(3); // initial + 2 updates
    expect(trajectory[0]).toBeCloseTo(0.1, 10);
  });

  it('final value equals applying updates sequentially', () => {
    const { final, trajectory } = updateMasterySequence(0.1, [true, false, true]);
    const last = trajectory[trajectory.length - 1]!;
    expect(final).toBeCloseTo(last, 10);
  });

  it('empty observations → returns initial P(L) unchanged', () => {
    const { final, trajectory } = updateMasterySequence(0.7, []);
    expect(final).toBeCloseTo(0.7, 10);
    expect(trajectory).toHaveLength(1);
    expect(trajectory[0]).toBeCloseTo(0.7, 10);
  });

  it('all-correct trajectory grows toward mastery', () => {
    const { final } = updateMasterySequence(0.1, [true, true, true, true, true]);
    expect(final).toBeGreaterThan(0.1);
    expect(final).toBeLessThan(1.0);
  });

  it('mixed trajectory produces expected intermediate values', () => {
    // Starting from 0.1, apply correct then incorrect.
    const { trajectory } = updateMasterySequence(0.1, [true, false]);
    // After correct: 0.24607; after incorrect: formula applied to 0.24607
    const afterCorrect = updateMastery(0.1, true);
    const afterIncorrect = updateMastery(afterCorrect, false);
    expect(trajectory[1]).toBeCloseTo(afterCorrect, 10);
    expect(trajectory[2]).toBeCloseTo(afterIncorrect, 10);
  });
});

describe('BKT Engine — constants', () => {
  it('BKT_PARAMS values match BA v1.4 spec', () => {
    expect(BKT_PARAMS.P_INIT).toBeCloseTo(0.1, 4);
    expect(BKT_PARAMS.P_LEARN).toBeCloseTo(0.15, 4);
    expect(BKT_PARAMS.P_GUESS).toBeCloseTo(0.2, 4);
    expect(BKT_PARAMS.P_SLIP).toBeCloseTo(0.1, 4);
  });

  it('MASTERY_THRESHOLD is 0.95', () => {
    expect(MASTERY_THRESHOLD).toBeCloseTo(0.95, 4);
  });

  it('DIAGNOSED_THRESHOLD is 0.5', () => {
    expect(DIAGNOSED_THRESHOLD).toBeCloseTo(0.5, 4);
  });

  it('STRUGGLING_MIN_ATTEMPTS is 5', () => {
    expect(STRUGGLING_MIN_ATTEMPTS).toBe(5);
  });
});
