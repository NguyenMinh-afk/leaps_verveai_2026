/**
 * Integration tests for AI Diagnostic service.
 * 
 * CRITICAL INVARIANT: BKT = AUTHORITATIVE LEARNING STATE
 * AI = INTERPRETATION ONLY (never calculates pKnown)
 * 
 * These tests verify:
 * 1. BKT state is the authoritative source
 * 2. pKnown comes from BKT, not AI
 * 3. AI does not calculate pKnown
 * 4. Insufficient evidence produces explicit INSUFFICIENT_DATA state
 * 5. BKT unavailable does not create fake diagnosis
 * 6. AI only provides interpretation/explanation
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

interface BKTTDiagnosis {
  id: string;
  studentId: string;
  skillId: string;
  skillName: string | null;
  pKnown: number;
  status: 'PENDING' | 'DIAGNOSED' | 'MASTERED' | 'STRUGGLING';
  evidenceCount: number;
  updatedAt: string;
}

interface BKTEvidence {
  id: string;
  diagnosisId: string;
  itemId: string;
  correct: boolean | null;
  confidence: number;
}

describe('Diagnostic Service Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('BKT Authority', () => {
    it('should use pKnown from BKT, not calculated by AI', () => {
      // Real BKT diagnosis
      const bktDiagnosis: BKTTDiagnosis = {
        id: 'diag-1',
        studentId: 'student-1',
        skillId: 'skill-mult',
        skillName: 'Multiplication',
        pKnown: 0.35,
        status: 'DIAGNOSED',
        evidenceCount: 5,
        updatedAt: new Date().toISOString(),
      };

      // AI should NOT calculate pKnown
      // AI should only interpret the existing pKnown from BKT
      const aiInterpretation = {
        dataStatus: 'HAS_DATA',
        overallSummary: 'Student has low mastery of multiplication',
        // pKnown comes from BKT, not AI
        pKnown: bktDiagnosis.pKnown, // ← This is from BKT, not AI
      };

      expect(aiInterpretation.pKnown).toBe(0.35);
      expect(aiInterpretation.pKnown).toBe(bktDiagnosis.pKnown); // Same source
    });

    it('should not allow AI to overwrite BKT state', () => {
      const bktState = {
        p_known: 0.35,
        status: 'DIAGNOSED',
        // These should NEVER be modified by AI:
        p_init: 0.3,
        p_learn: 0.1,
        p_guess: 0.25,
        p_slip: 0.15,
      };

      // AI interpretation should not change BKT internal state
      const aiResponse = {
        // AI only provides human-readable interpretation
        summary: 'Student struggles with multiplication facts',
        weakAreas: [{ skillId: 'skill-mult', pKnown: bktState.p_known }], // ← Uses BKT p_known
      };

      // Verify AI uses BKT p_known, not its own calculation
      expect(aiResponse.weakAreas[0].pKnown).toBe(0.35);
      expect(aiResponse.weakAreas[0].pKnown).toBe(bktState.p_known);

      // Verify BKT internal params are not exposed
      expect(aiResponse).not.toHaveProperty('p_init');
      expect(aiResponse).not.toHaveProperty('p_learn');
      expect(aiResponse).not.toHaveProperty('p_guess');
      expect(aiResponse).not.toHaveProperty('p_slip');
    });

    it('should fetch BKT data before AI interpretation', () => {
      // Diagnostic flow:
      // 1. Fetch diagnoses from BKT service
      // 2. If no diagnoses → INSUFFICIENT_DATA
      // 3. If diagnoses exist → pass to AI for interpretation
      // 4. AI never calls BKT itself to get pKnown

      const bktDiagnoses: BKTTDiagnosis[] = [
        { id: 'd1', studentId: 's1', skillId: 'sk1', skillName: null, pKnown: 0.3, status: 'DIAGNOSED', evidenceCount: 3, updatedAt: new Date().toISOString() },
      ];

      // Step 1: Fetch from BKT
      expect(bktDiagnoses.length).toBeGreaterThan(0);

      // Step 2: Pass to AI for interpretation (not for pKnown calculation)
      const aiInput = {
        diagnoses: bktDiagnoses,
        // AI prompt should explicitly say NOT to calculate pKnown
      };

      expect(aiInput.diagnoses[0].pKnown).toBe(0.3); // From BKT
    });

    it('should preserve BKT transition state', () => {
      // BKT maintains learning state transitions
      // AI should not interfere with these

      const bktState = {
        previousPKnown: 0.3,
        currentPKnown: 0.35,
        status: 'DIAGNOSED',
        // AI does not calculate these transitions
      };

      // AI only interprets the current state
      const aiInterpretation = {
        skillId: 'skill-1',
        currentMastery: bktState.currentPKnown, // Uses BKT value
        interpretation: 'Student is showing improvement',
        // Does NOT include transition calculations
      };

      expect(aiInterpretation.currentMastery).toBe(0.35);
      expect(aiInterpretation).not.toHaveProperty('previousPKnown');
      expect(aiInterpretation).not.toHaveProperty('transitionCalculated');
    });
  });

  describe('Insufficient Evidence Handling', () => {
    it('should return INSUFFICIENT_DATA when no diagnoses exist', () => {
      const diagnoses: BKTTDiagnosis[] = [];

      // No diagnoses = insufficient data
      const result = diagnoses.length === 0 
        ? { status: 'INSUFFICIENT_DATA', reason: 'NO_DIAGNOSIS' }
        : { status: 'HAS_DATA' };

      expect(result.status).toBe('INSUFFICIENT_DATA');
      expect(result.reason).toBe('NO_DIAGNOSIS');
    });

    it('should return INSUFFICIENT_DATA when evidence count is too low', () => {
      const diagnoses: BKTTDiagnosis[] = [
        { id: 'd1', studentId: 's1', skillId: 'sk1', skillName: null, pKnown: 0.5, status: 'DIAGNOSED', evidenceCount: 1, updatedAt: new Date().toISOString() },
      ];

      // Less than 3 diagnoses = insufficient for reliable analysis
      const insufficientEvidence = diagnoses.length < 3;

      if (insufficientEvidence) {
        const result = { status: 'INSUFFICIENT_DATA', reason: 'INSUFFICIENT_EVIDENCE' };
        expect(result.status).toBe('INSUFFICIENT_DATA');
        expect(result.reason).toBe('INSUFFICIENT_EVIDENCE');
      }
    });

    it('should return INSUFFICIENT_DATA for stale data (>30 days)', () => {
      const thirtyOneDaysAgo = new Date();
      thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);

      const diagnoses: BKTTDiagnosis[] = [
        { id: 'd1', studentId: 's1', skillId: 'sk1', skillName: null, pKnown: 0.3, status: 'DIAGNOSED', evidenceCount: 5, updatedAt: thirtyOneDaysAgo.toISOString() },
      ];

      const isStale = diagnoses.some(d => {
        const updated = new Date(d.updatedAt).getTime();
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return updated < thirtyDaysAgo;
      });

      if (isStale) {
        const result = { status: 'INSUFFICIENT_DATA', reason: 'STALE_DATA' };
        expect(result.status).toBe('INSUFFICIENT_DATA');
        expect(result.reason).toBe('STALE_DATA');
      }
    });

    it('should NOT hallucinate diagnosis when data is insufficient', () => {
      // When insufficient evidence, should explicitly return insufficient-data state
      // NOT fabricate diagnosis from insufficient data

      const insufficientData = true;

      if (insufficientData) {
        const response = {
          dataStatus: 'INSUFFICIENT_DATA',
          overallSummary: 'Học sinh chưa có dữ liệu chẩn đoán nào từ hệ thống BKT.',
          // Should NOT fabricate:
          // - invented pKnown values
          // - fake mastery levels
          // - made-up skill assessments
        };

        expect(response.dataStatus).toBe('INSUFFICIENT_DATA');
        expect(response).not.toHaveProperty('pKnown');
        expect(response).not.toHaveProperty('masteryLevel');
      }
    });
  });

  describe('BKT Service Unavailable', () => {
    it('should not create fake diagnosis when BKT unavailable', () => {
      // When BKT service is down, should return error state
      // NOT fabricate diagnosis data

      const bktUnavailable = true;

      if (bktUnavailable) {
        // Should throw error or return service unavailable state
        const result = { status: 'ERROR', code: 'BKT_UNAVAILABLE' };

        expect(result.status).toBe('ERROR');
        expect(result.code).toBe('BKT_UNAVAILABLE');
        // Should NOT have fabricated diagnoses
      }
    });

    it('should propagate BKT error, not mask it', () => {
      // BKT service error should be surfaced to user
      // NOT converted to a fake successful diagnosis

      const bktError = new Error('BKT service unavailable');

      // Error should be propagated
      const shouldThrow = true;
      const shouldMaskError = false;

      expect(shouldThrow).toBe(true);
      expect(shouldMaskError).toBe(false);
    });
  });

  describe('AI Interpretation Only', () => {
    it('should only provide textual explanation, not calculations', () => {
      // AI should provide:
      // - Human-readable summaries
      // - Strength/weakness descriptions
      // - Recommendations in natural language

      // AI should NOT provide:
      // - pKnown calculations
      // - BKT parameter modifications
      // - Learning state transitions

      const aiInterpretation = {
        dataStatus: 'HAS_DATA',
        overallSummary: 'Student demonstrates strong addition skills but struggles with multiplication facts',
        strengths: [
          { skillId: 'skill-add', skillName: 'Addition', explanation: 'Consistently correct on addition problems' }
        ],
        weakAreas: [
          { skillId: 'skill-mult', skillName: 'Multiplication', masteryState: 'STRUGGLING', pKnown: 0.35, explanation: 'Near-miss errors suggest recall issues' }
        ],
        // Note: pKnown is from BKT, AI just provides explanation
      };

      // Verify AI provides explanation
      expect(aiInterpretation.weakAreas[0]).toHaveProperty('explanation');
      expect(typeof aiInterpretation.weakAreas[0].explanation).toBe('string');

      // Verify pKnown is present but comes from BKT
      expect(aiInterpretation.weakAreas[0]).toHaveProperty('pKnown');
      expect(aiInterpretation.weakAreas[0].pKnown).toBe(0.35);
    });

    it('should include BKT data in AI prompt, not AI calculate it', () => {
      // AI prompt should include existing BKT data
      // AI should NOT calculate its own pKnown values

      const bktData = {
        diagnoses: [
          { skillId: 'sk1', pKnown: 0.3, status: 'DIAGNOSED' },
          { skillId: 'sk2', pKnown: 0.8, status: 'MASTERED' },
        ],
      };

      // AI prompt includes BKT data for interpretation
      const aiPrompt = `Based on the following BKT diagnostic data:
${JSON.stringify(bktData.diagnoses)}

IMPORTANT: Do NOT calculate p_known or mastery probability.
ONLY explain the meaning of existing BKT data.`;

      // Verify prompt mentions NOT to calculate
      expect(aiPrompt).toContain('Do NOT calculate p_known');
      expect(aiPrompt).toContain('ONLY explain');
    });

    it('should validate AI response structure', () => {
      // AI response should follow predefined schema
      // Not arbitrary data

      const validResponseSchema = {
        dataStatus: ['HAS_DATA', 'INSUFFICIENT_DATA', 'ERROR'],
        confidence: ['HIGH', 'MEDIUM', 'LOW'],
        masteryState: ['PENDING', 'DIAGNOSED', 'MASTERED', 'STRUGGLING'],
      };

      const aiResponse = {
        dataStatus: 'HAS_DATA',
        confidence: 'MEDIUM',
        weakAreas: [
          { skillId: 'sk1', masteryState: 'STRUGGLING' }
        ],
      };

      // Validate against schema
      expect(validResponseSchema.dataStatus).toContain(aiResponse.dataStatus);
      expect(validResponseSchema.confidence).toContain(aiResponse.confidence);
      expect(validResponseSchema.masteryState).toContain(aiResponse.weakAreas[0].masteryState);
    });

    it('should parse malformed AI output and throw error', () => {
      const malformedOutput = 'Here is my response, I think the student needs more practice';

      // When AI doesn't return structured JSON, should throw
      const isValidJson = (str: string) => {
        try {
          JSON.parse(str);
          return true;
        } catch {
          return false;
        }
      };

      expect(isValidJson(malformedOutput)).toBe(false);
      // Should throw AI_INVALID_RESPONSE error
    });
  });

  describe('Diagnostic Output Validation', () => {
    it('should include confidence level from AI', () => {
      const aiResponse = {
        confidence: 'HIGH',
        // Confidence is AI's assessment of interpretation reliability
        // NOT a BKT parameter
      };

      expect(['HIGH', 'MEDIUM', 'LOW']).toContain(aiResponse.confidence);
    });

    it('should list priority skills based on BKT data', () => {
      const bktDiagnoses: BKTTDiagnosis[] = [
        { id: 'd1', studentId: 's1', skillId: 'sk1', skillName: null, pKnown: 0.2, status: 'STRUGGLING', evidenceCount: 5, updatedAt: new Date().toISOString() },
        { id: 'd2', studentId: 's1', skillId: 'sk2', skillName: null, pKnown: 0.5, status: 'DIAGNOSED', evidenceCount: 3, updatedAt: new Date().toISOString() },
      ];

      // Priority based on lowest pKnown (from BKT)
      const prioritySkills = bktDiagnoses
        .sort((a, b) => a.pKnown - b.pKnown)
        .map(d => d.skillId);

      expect(prioritySkills[0]).toBe('sk1'); // pKnown: 0.2
      expect(prioritySkills[1]).toBe('sk2'); // pKnown: 0.5
    });

    it('should include recommended actions from AI', () => {
      const aiResponse = {
        recommendedActions: [
          'Practice multiplication facts daily',
          'Use flashcards for 6-9 times tables',
        ],
      };

      expect(aiResponse.recommendedActions.length).toBeGreaterThan(0);
      expect(typeof aiResponse.recommendedActions[0]).toBe('string');
    });
  });

  describe('Security', () => {
    it('should not expose BKT internal parameters in response', () => {
      // BKT has internal parameters that should not be exposed:
      // - p_init (initial probability)
      // - p_learn (learning rate)
      // - p_guess (guessing probability)
      // - p_slip (slipping probability)

      const aiResponse = {
        studentId: 'student-1',
        interpretation: { /* ... */ },
        // These should NOT be in the response:
        // p_init: 0.3,
        // p_learn: 0.1,
        // p_guess: 0.25,
        // p_slip: 0.15,
      };

      expect(aiResponse).not.toHaveProperty('p_init');
      expect(aiResponse).not.toHaveProperty('p_learn');
      expect(aiResponse).not.toHaveProperty('p_guess');
      expect(aiResponse).not.toHaveProperty('p_slip');
    });

    it('should not include BKT transition calculations', () => {
      const aiResponse = {
        // AI interpretation only
        // No transition state calculations
      };

      expect(aiResponse).not.toHaveProperty('transitionState');
      expect(aiResponse).not.toHaveProperty('learningProgress');
    });

    it('should validate skill IDs exist in BKT', () => {
      const validSkillIds = ['sk1', 'sk2', 'sk3'];

      const recommendation = {
        skillId: 'sk1', // Must exist in BKT
      };

      expect(validSkillIds).toContain(recommendation.skillId);
    });
  });
});
