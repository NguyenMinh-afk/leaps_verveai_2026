# Result → BKT Evidence Integration

## Overview

Exam results should create evidence items that update BKT (Bayesian Knowledge Tracing) diagnoses. This document describes the integration points and current implementation status.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Student   │────▶│  svc-exam    │────▶│   svc-bkt   │
│   submits   │     │  (grading)   │     │  (evidence) │
└─────────────┘     └──────────────┘     └─────────────┘
                           │                     │
                           ▼                     ▼
                    ┌──────────────┐     ┌─────────────┐
                    │  ExamAttempt │     │  Diagnosis  │
                    │  ExamAnswer  │     │  Evidence   │
                    └──────────────┘     └─────────────┘
```

## Integration Flow

```
Student submits Exam
        ↓
ExamAttempt status → SUBMITTED
        ↓
Auto-grading (result.service.ts:gradeExamAttempt)
        ↓
For each question with is_correct:
        ↓
Create EvidenceItem via svc-bkt /api/bkt/evidence
        ↓
EvidenceItem triggers BKT update
        ↓
Diagnosis.p_known updated with new mastery probability
```

## Current Implementation

### GradeExamAttempt Function

The `gradeExamAttempt` function in `src/services/result.service.ts` performs:

1. Validates grading rules
2. Fetches attempt with answers
3. Grades each answer based on question type
4. Calculates total score and percentage
5. Updates attempt status to GRADED or MANUAL_REVIEW
6. **Calls `recordResultEvidence`** (non-blocking)

### Evidence Recording

The `recordResultEvidence` function:

1. Creates evidence batch from question results
2. Logs the prepared evidence (implementation ready for svc-bkt calls)
3. **TODO**: Look up student-skill diagnosis mappings
4. **TODO**: Call `/api/bkt/evidence` for each question

```typescript
// In result.service.ts after grading
await recordResultEvidence(updatedAttempt, questionResults, ctx);

// Evidence item structure:
{
  diagnosisId: string;    // From skill mapping
  itemId: string;         // question_id
  correct: boolean;       // is_correct
  confidence: number;     // 1.0 for auto-graded
  quality: 'HIGH';        // Quality level
  extractedAnswer?: string; // JSON serialized answer
}
```

## Integration Point Details

### Evidence API Contract

The svc-bkt `/api/bkt/evidence` endpoint accepts:

```json
{
  "diagnosisId": "uuid",
  "itemId": "uuid",
  "correct": true,
  "confidence": 1.0,
  "quality": "HIGH",
  "extractedAnswer": "optional string"
}
```

### Required Data for Evidence

1. **diagnosisId**: Per-(student, skill) mastery record
   - Lookup: `SELECT id FROM diagnoses WHERE student_id = ? AND skill_id = ?`
   - Requires skill assignment for each question

2. **itemId**: The question being answered
   - Use `question_id` from ExamAnswer

3. **correct**: Binary correctness signal
   - From auto-grading or manual review

4. **confidence**: Evidence quality weight
   - 1.0 for auto-graded objective questions
   - 0.5-0.8 for manually graded

5. **quality**: EvidenceQuality enum
   - HIGH: Auto-graded MCQ/True-False
   - MEDIUM: Manually graded
   - LOW: Partial credit

## Status: PENDING

The BKT integration is **partially implemented** with the following work remaining:

### Completed

- ✅ Result service with grading logic
- ✅ Evidence preparation in `recordResultEvidence`
- ✅ Non-blocking evidence recording (graceful degradation)
- ✅ Logging of evidence batch for debugging

### Pending (Blocked on Content Service)

- ❌ Skill-to-question mapping (requires content service changes)
- ❌ Per-question diagnosis lookup
- ❌ Actual svc-bkt API calls

## Required Future Work

### 1. Add skill_id to content_item/question model

Content service needs to track which skill(s) each question assesses.

```sql
-- In content service schema
ALTER TABLE content_items
ADD COLUMN skill_id UUID REFERENCES skills(id);
```

### 2. Add endpoint to get student's diagnosis

```typescript
// New endpoint in svc-bkt
GET /api/bkt/diagnosis/student/:studentId/skill/:skillId
```

### 3. Implement skill-aware evidence recording

```typescript
async function recordSkillAwareEvidence(
  attempt: ExamAttempt,
  questionResults: QuestionResult[],
  ctx: InterServiceHeaders
): Promise<void> {
  for (const qr of questionResults) {
    // Get skill mapping from content service
    const skillMapping = await callSvcContent(`/api/content/question/${qr.questionId}/skill`);
    
    // Get student's diagnosis for this skill
    const diagnosis = await callSvcBkt(
      `/api/bkt/diagnosis/student/${attempt.student_id}/skill/${skillMapping.skillId}`
    );

    if (diagnosis?.id) {
      await callSvcBkt('/api/bkt/evidence', {
        method: 'POST',
        body: {
          diagnosisId: diagnosis.id,
          itemId: qr.questionId,
          correct: qr.isCorrect,
          confidence: qr.isCorrect !== null ? 1.0 : 0.5,
          quality: qr.isCorrect !== null ? 'HIGH' : 'MEDIUM',
          extractedAnswer: qr.studentAnswer ? JSON.stringify(qr.studentAnswer) : undefined,
        },
        ctx,
      });
    }
  }
}
```

### 4. Batch evidence processing

Consider a background job for evidence processing:

```typescript
// New endpoint for batch processing
POST /api/exam/evidence/process
{
  "attemptId": "uuid",
  "async": true  // Process in background
}
```

## Alternative: Direct Evidence Recording

If exams have fixed skills (e.g., one exam = one skill), we can record evidence directly:

```typescript
// In result.service.ts
async function recordDirectEvidence(
  attempt: ExamAttempt,
  passed: boolean,
  ctx: InterServiceHeaders
): Promise<void> {
  // Get exam's primary skill
  const examSkill = await getExamSkill(attempt.exam_id);
  
  // Get student's diagnosis
  const diagnosis = await getOrCreateDiagnosis(
    attempt.student_id,
    examSkill.id,
    ctx
  );

  // Record overall pass/fail as evidence
  await callSvcBkt('/api/bkt/evidence', {
    method: 'POST',
    body: {
      diagnosisId: diagnosis.id,
      itemId: attempt.exam_id,  // Use exam as item
      correct: passed,
      confidence: 0.8,  // Slightly lower than per-question
      quality: 'MEDIUM',
      extractedAnswer: JSON.stringify({
        attemptId: attempt.id,
        score: attempt.score,
        percentage: attempt.percentage,
      }),
    },
    ctx,
  });
}
```

## Testing the Integration

### Unit Tests

```typescript
// tests/unit/result-bkt.test.ts
describe('Result BKT Integration', () => {
  it('should prepare evidence batch from graded questions', async () => {
    const result = await gradeExamAttempt({
      attemptId: validAttemptId,
      gradingRules: [
        { questionId: q1, correctAnswer: 'A', points: 1, type: 'multiple_choice' },
        { questionId: q2, correctAnswer: 'B', points: 1, type: 'multiple_choice' },
      ],
    });

    // Verify evidence was logged
    expect(logger.info).toHaveBeenCalledWith(
      'Prepared BKT evidence batch',
      expect.objectContaining({ itemCount: 2 })
    );
  });

  it('should not fail grading when BKT call fails', async () => {
    // Mock svc-bkt to fail
    mockSvcBktFailure();

    const result = await gradeExamAttempt({...});

    // Grading should still succeed
    expect(result.status).toBe('GRADED');
  });
});
```

### Integration Tests

```typescript
// tests/integration/result-bkt-flow.test.ts
it('should update diagnosis after exam grading', async () => {
  // Create skill and diagnosis
  const skill = await createSkill('multiplication');
  const diagnosis = await createDiagnosis(studentId, skill.id);

  // Grade exam
  await gradeExamAttempt({...});

  // Check diagnosis updated
  const updatedDiagnosis = await getDiagnosis(diagnosis.id);
  expect(updatedDiagnosis.p_known).toBeGreaterThan(0.1); // P_INIT
});
```

## Monitoring

Log events for evidence recording:

```typescript
log.info('BKT evidence recorded', {
  diagnosisId: item.diagnosisId,
  itemId: item.itemId,
  correct: item.correct,
  newPKnown: updatedDiagnosis.p_known,
});

log.warn('BKT evidence failed', {
  attemptId: attempt.id,
  error: error.message,
  // Don't fail the request
});
```

## Related Documentation

- BKT Engine: `service/service-bkt/src/services/bkt-engine.ts`
- Evidence Service: `service/service-bkt/src/services/evidence.service.ts`
- Result Service: `service/service-exam/src/services/result.service.ts`
- BA Document: `docs/01-business/VerveAI_BA_Document_v1.4.md`
