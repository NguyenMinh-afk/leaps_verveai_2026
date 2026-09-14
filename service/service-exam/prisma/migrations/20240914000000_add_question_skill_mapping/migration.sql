-- Migration: Add question_skill_mapping table
-- Purpose: Map content service questions to BKT skills for evidence tracking
-- This enables exam answers to generate BKT evidence for the corresponding skill

-- Create the question_skill_mappings table
CREATE TABLE IF NOT EXISTS "exam"."question_skill_mappings" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "question_id" VARCHAR(36) NOT NULL,
    "skill_id" VARCHAR(36) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
    "created_by" VARCHAR(255),
    CONSTRAINT "question_skill_mappings_question_id_skill_id_unique" UNIQUE ("question_id", "skill_id")
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS "question_skill_mappings_question_id_idx" ON "exam"."question_skill_mappings" ("question_id");
CREATE INDEX IF NOT EXISTS "question_skill_mappings_skill_id_idx" ON "exam"."question_skill_mappings" ("skill_id");

-- Add comments for documentation
COMMENT ON TABLE "exam"."question_skill_mappings" IS 'Maps content service questions to BKT skills for evidence tracking. This allows exam answers to generate BKT evidence for the corresponding skill.';
COMMENT ON COLUMN "exam"."question_skill_mappings"."question_id" IS 'Reference to content service question ID';
COMMENT ON COLUMN "exam"."question_skill_mappings"."skill_id" IS 'Reference to BKT service skill ID';
