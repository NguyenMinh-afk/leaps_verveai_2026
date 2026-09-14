-- Migration: Add diagnosis tables
-- Purpose: Support diagnostic assessment sessions for determining student mastery
-- Created: 2026-09-14
-- 
-- Tables:
--   - diagnosis_sessions: Tracks each diagnostic assessment session
--   - diagnosis_answers: Records each answer submitted during a session

-- Create the diagnosis_sessions table
CREATE TABLE IF NOT EXISTS "exam"."diagnosis_sessions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "student_id" VARCHAR(36) NOT NULL,
    "skill_id" VARCHAR(36) NOT NULL,
    "skill_name" VARCHAR(255) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED',
    "questions_answered" INTEGER NOT NULL DEFAULT 0,
    "total_questions" INTEGER NOT NULL DEFAULT 5,
    "current_p_known" FLOAT NOT NULL DEFAULT 0.1,
    "result" TEXT, -- JSON string of DiagnosisResult
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "diagnosis_sessions_status_check" CHECK ("status" IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'))
);

-- Create the diagnosis_answers table
CREATE TABLE IF NOT EXISTS "exam"."diagnosis_answers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "question_id" VARCHAR(36) NOT NULL,
    "answer" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "diagnosis_answers_session_id_fkey" FOREIGN KEY ("session_id") 
        REFERENCES "exam"."diagnosis_sessions"("id") 
        ON DELETE CASCADE
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS "diagnosis_sessions_student_id_idx" ON "exam"."diagnosis_sessions" ("student_id");
CREATE INDEX IF NOT EXISTS "diagnosis_sessions_skill_id_idx" ON "exam"."diagnosis_sessions" ("skill_id");
CREATE INDEX IF NOT EXISTS "diagnosis_sessions_status_idx" ON "exam"."diagnosis_sessions" ("status");
CREATE INDEX IF NOT EXISTS "diagnosis_answers_session_id_idx" ON "exam"."diagnosis_answers" ("session_id");
CREATE INDEX IF NOT EXISTS "diagnosis_answers_question_id_idx" ON "exam"."diagnosis_answers" ("question_id");

-- Add comments for documentation
COMMENT ON TABLE "exam"."diagnosis_sessions" IS 'Diagnostic assessment sessions for determining student mastery on skills. Each session tracks progress and final results.';
COMMENT ON COLUMN "exam"."diagnosis_sessions"."student_id" IS 'Reference to student who owns this diagnosis session';
COMMENT ON COLUMN "exam"."diagnosis_sessions"."skill_id" IS 'Reference to the BKT skill being diagnosed';
COMMENT ON COLUMN "exam"."diagnosis_sessions"."skill_name" IS 'Denormalized skill name for display purposes';
COMMENT ON COLUMN "exam"."diagnosis_sessions"."status" IS 'Session status: NOT_STARTED, IN_PROGRESS, or COMPLETED';
COMMENT ON COLUMN "exam"."diagnosis_sessions"."current_p_known" IS 'Current mastery probability P(L), synced from service-bkt after each answer';
COMMENT ON COLUMN "exam"."diagnosis_sessions"."result" IS 'JSON string containing final DiagnosisResult: { pKnown, status, confidence, recommendations }';

COMMENT ON TABLE "exam"."diagnosis_answers" IS 'Individual answers submitted during a diagnostic assessment session.';
COMMENT ON COLUMN "exam"."diagnosis_answers"."session_id" IS 'Reference to the parent diagnosis session';
COMMENT ON COLUMN "exam"."diagnosis_answers"."question_id" IS 'Reference to the content service question';
COMMENT ON COLUMN "exam"."diagnosis_answers"."answer" IS 'The answer submitted by the student';
COMMENT ON COLUMN "exam"."diagnosis_answers"."is_correct" IS 'Whether the answer was correct (server-validated)';
