# Result → Evidence System Integration

## Overview

This document describes how the Results domain connects to the existing Evidence system in `svc-bkt`. The Evidence system is the backbone of BKT (Bayesian Knowledge Tracing) and stores per-skill mastery observations.

## Current Evidence System

### EvidenceItem Model

```prisma
model EvidenceItem {
  id               String            @id @default(uuid())
  diagnosis_id     String            // FK to Diagnosis
  item_id          String            // Content item (question) ID
  extracted_answer String?            // LLM-extracted answer
  correct          Boolean           // Binary correctness
  confidence       Float             @default(0.0)
  quality          EvidenceQuality   @default(UNKNOWN)
  created_at       DateTime          @default(now())

  diagnosis        Diagnosis         @relation(...)
}
```

### Evidence Flow

```
EvidenceItem created
       ↓
Diagnosis.recompute() called
       ↓
BKT engine updates p_known
       ↓
Diagnosis.status updated (PENDING → DIAGNOSED → MASTERED)
```

## Result Integration Points

### 1. After Grading: Create Evidence

When `gradeExamAttempt()` completes, it should create evidence items:

```typescript
// In result.service.ts
async function gradeExamAttempt(input: GradeExamInput) {
  // ... grading logic ...
  
  // After grading (only for GRADED status)
  if (newStatus === 'GRADED') {
    await recordResultEvidence(updatedAttempt, questionResults, ctx);
  }
  
  return result;
}
```

### 2. Evidence Creation Contract

```typescript
interface ResultEvidence {
  diagnosisId: string;    // Required: student's diagnosis for a skill
  itemId: string;         // Required: question ID
  correct: boolean;       // Required: is_correct
  confidence: number;     // 0.0-1.0, 1.0 for auto-graded
  quality: EvidenceQuality; // HIGH/MEDIUM/LOW/UNKNOWN
  extractedAnswer?: string; // JSON answer for debugging
}
```

### 3. Quality Levels

| Source | Quality | Confidence |
|--------|---------|------------|
| Auto-graded MCQ/True-False | HIGH | 1.0 |
| Auto-graded Multiple-Select | MEDIUM | 0.9 |
| Manually graded short answer | MEDIUM | 0.7 |
| Partial credit | LOW | 0.5 |

## Integration Requirements

### Current Status: PARTIAL

The Result service has the structure for evidence integration, but the actual BKT calls are commented out pending:

1. **Skill-Question Mapping**: We need to know which skill each question assesses
2. **Diagnosis Lookup**: We need to find/create the student's diagnosis for that skill

### What We Can Do Now

1. ✅ Log evidence preparation (ready for debugging)
2. ✅ Structure evidence objects correctly
3. ✅ Handle graceful degradation (grading succeeds even if BKT fails)

### What Needs Content Service

1. ❌ Question → Skill mapping
2. ❌ Skill metadata (difficulty, etc.)

### What Needs svc-bkt

1. ❌ Endpoint to get/create diagnosis for (student, skill)
2. ❌ Endpoint to record evidence (already exists: `POST /api/bkt/evidence`)

## Integration Sequence

```
1. Student submits exam
       ↓
2. gradeExamAttempt() grades all questions
       ↓
3. For each question with is_correct !== null:
   a. Look up question's skill_id (from content service)
   b. Get student's diagnosis for that skill (from svc-bkt)
   c. Call POST /api/bkt/evidence with correct=true/false
       ↓
4. svc-bkt records evidence and updates diagnosis.p_known
       ↓
5. Diagnosis status changes trigger interventions if needed
```

## API Endpoints

### Record Evidence

```http
POST /api/bkt/evidence
Content-Type: application/json

{
  "diagnosisId": "uuid-of-diagnosis",
  "itemId": "uuid-of-question",
  "correct": true,
  "confidence": 1.0,
  "quality": "HIGH",
  "extractedAnswer": "[\"A\"]"
}
```

### Response

```json
{
  "success": true,
  "data": {
    "evidence": {
      "id": "uuid",
      "diagnosisId": "...",
      "itemId": "...",
      "correct": true,
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "diagnosis": {
      "id": "...",
      "studentId": "...",
      "skillId": "...",
      "pKnown": 0.35,
      "confidence": 0.7,
      "status": "DIAGNOSED",
      "attempts": 5
    }
  }
}
```

## Error Handling

The evidence integration is **non-blocking**:

```typescript
async function recordResultEvidence(attempt, questions, ctx) {
  try {
    // Call svc-bkt
    await callSvcBkt('/api/bkt/evidence', { ... });
  } catch (error) {
    // Log but don't fail the grading
    logger.warn('BKT evidence failed', { attemptId: attempt.id, error });
  }
}
```

This ensures:
- Grading always completes
- Student sees their score immediately
- BKT updates happen asynchronously
- No data loss (evidence can be re-processed)

## Monitoring

Key log events to watch:

```
INFO  gradeExamAttempt - Exam graded { attemptId, score, status }
INFO  recordResultEvidence - Prepared BKT evidence batch { itemCount }
WARN  svc-bkt call failed - BKT evidence recording failed
```

## Future Enhancements

### Batch Evidence Processing

Consider a background job:

```typescript
// New endpoint
POST /api/exam/evidence/batch
{
  "attemptIds": ["uuid1", "uuid2", ...]
}
```

### Retry Logic

```typescript
// Failed evidence can be retried
async function retryFailedEvidence(attemptId: string) {
  const pending = await getPendingEvidence(attemptId);
  for (const item of pending) {
    await callSvcBkt('/api/bkt/evidence', { body: item });
  }
}
```

### Evidence Replay

For debugging or model updates:

```typescript
// Replay evidence chain
async function replayEvidence(diagnosisId: string) {
  const chain = await getEvidenceChain(diagnosisId);
  // Clear and replay to update diagnosis
}
```

## Related Documentation

- BKT Engine: `service/service-bkt/src/services/bkt-engine.ts`
- Evidence Service: `service/service-bkt/src/services/evidence.service.ts`
- Evidence Routes: `service/service-bkt/src/routes/evidence.routes.ts`
- Result BKT Integration: `docs/result-bkt-integration.md`
