-- C3 seed SQL for the `bkt` schema.
-- Run after `prisma migrate deploy` for service-bkt:
--   PGPASSWORD=verveai_c3_pass psql -h localhost -U verveai -d verveai -f tests/integration/c3-seed.sql
--
-- Idempotent: every INSERT guards on NOT EXISTS.

-- Skill
INSERT INTO bkt.skills (id, code, name, difficulty, prereq_skills, created_at, updated_at)
SELECT 'c3000000-0000-4000-8000-0000000000cc',
       'MATH-ADD-001',
       'Basic Addition',
       1,
       '{}',
       NOW(),
       NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM bkt.skills WHERE code = 'MATH-ADD-001'
);

-- Diagnosis for student A (DIAGNOSED, p_known=0.65)
INSERT INTO bkt.diagnoses (id, student_id, skill_id, p_known, confidence, status, created_at, updated_at)
SELECT 'c3000000-0000-4000-8000-0000000000d1',
       'c3000000-0000-4000-8000-0000000000aa',
       'c3000000-0000-4000-8000-0000000000cc',
       0.65,
       0.7,
       'DIAGNOSED',
       NOW(),
       NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM bkt.diagnoses
  WHERE student_id = 'c3000000-0000-4000-8000-0000000000aa'
    AND skill_id = 'c3000000-0000-4000-8000-0000000000cc'
);

-- Diagnosis for student B (MASTERED, p_known=0.85)
INSERT INTO bkt.diagnoses (id, student_id, skill_id, p_known, confidence, status, created_at, updated_at)
SELECT 'c3000000-0000-4000-8000-0000000000d2',
       'c3000000-0000-4000-8000-0000000000bb',
       'c3000000-0000-4000-8000-0000000000cc',
       0.85,
       0.9,
       'MASTERED',
       NOW(),
       NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM bkt.diagnoses
  WHERE student_id = 'c3000000-0000-4000-8000-0000000000bb'
    AND skill_id = 'c3000000-0000-4000-8000-0000000000cc'
);
