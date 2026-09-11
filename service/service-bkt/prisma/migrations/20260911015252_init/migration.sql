-- CreateEnum
CREATE TYPE "bkt"."diagnosis_status" AS ENUM ('PENDING', 'DIAGNOSED', 'MASTERED', 'STRUGGLING');

-- CreateEnum
CREATE TYPE "bkt"."evidence_quality" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "bkt"."intervention_status" AS ENUM ('ACTIVE', 'RESOLVED', 'CANCELLED');

-- CreateTable
CREATE TABLE "bkt"."skills" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "description" TEXT,
    "prereq_skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bkt"."diagnoses" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "p_known" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "bkt"."diagnosis_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnoses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bkt"."evidence_items" (
    "id" TEXT NOT NULL,
    "diagnosis_id" TEXT NOT NULL,
    "item_id" TEXT NOT NULL,
    "extracted_answer" TEXT,
    "correct" BOOLEAN,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "quality" "bkt"."evidence_quality" NOT NULL DEFAULT 'UNKNOWN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bkt"."interventions" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 50,
    "status" "bkt"."intervention_status" NOT NULL DEFAULT 'ACTIVE',
    "teacher_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bkt"."intervention_notes" (
    "id" TEXT NOT NULL,
    "intervention_id" TEXT NOT NULL,
    "teacher_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "intervention_notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skills_code_key" ON "bkt"."skills"("code");

-- AddForeignKey
ALTER TABLE "bkt"."diagnoses" ADD CONSTRAINT "diagnoses_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "bkt"."skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bkt"."evidence_items" ADD CONSTRAINT "evidence_items_diagnosis_id_fkey" FOREIGN KEY ("diagnosis_id") REFERENCES "bkt"."diagnoses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bkt"."interventions" ADD CONSTRAINT "interventions_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "bkt"."skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bkt"."intervention_notes" ADD CONSTRAINT "intervention_notes_intervention_id_fkey" FOREIGN KEY ("intervention_id") REFERENCES "bkt"."interventions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
