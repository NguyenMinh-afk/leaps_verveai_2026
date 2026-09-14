-- Migration: Add BKT idempotency tracking to exam_attempts
-- Purpose: Track when BKT evidence has been sent to prevent duplicate processing

-- Add bkt_evidence_sent_at timestamp to track when BKT evidence was sent
-- This enables idempotent processing of exam attempts
ALTER TABLE "exam"."exam_attempts" ADD COLUMN IF NOT EXISTS "bkt_evidence_sent_at" TIMESTAMP;
