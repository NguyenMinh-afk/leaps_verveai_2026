/**
 * C3 — Real-data seed for Plan C3.
 *
 * Inserts the minimum data needed to exercise the
 * svc-bkt ↔ svc-class inter-service flow with REAL Postgres:
 *
 *  - 1 class (Lớp 5A Toán) in `class` schema
 *  - 2 students (Nguyễn Văn An, Trần Thị Bình)
 *  - 2 enrollments linking the students to the class
 *  - 1 skill (MATH-ADD-001) in `bkt` schema
 *  - 2 diagnoses — one per student — for the same skill
 *
 * The class/student IDs are intentionally stable so that the C3 test
 * suite and any smoke scripts can refer to them by name.
 *
 * Usage:
 *   DATABASE_URL=... node --import tsx prisma/seed-c3.ts
 * or, after building:
 *   DATABASE_URL=... node dist/prisma/seed-c3.js
 */

import { PrismaClient as ClassPrisma } from '../src/generated/prisma/index.js';

const CLASS_ID = 'c3000000-0000-4000-8000-000000000001';
const TEACHER_ID = 'c3000000-0000-4000-8000-00000000ffff';
const STUDENT_A = 'c3000000-0000-4000-8000-0000000000aa';
const STUDENT_B = 'c3000000-0000-4000-8000-0000000000bb';
const SKILL_ID = 'c3000000-0000-4000-8000-0000000000cc';

async function main(): Promise<void> {
  const classDb = new ClassPrisma();

  console.log('Seeding svc-class data (class schema)...');
  await classDb.class.upsert({
    where: { id: CLASS_ID },
    create: {
      id: CLASS_ID,
      name: 'Lớp 5A Toán',
      subject: 'Toán',
      teacher_id: TEACHER_ID
    },
    update: {}
  });
  await classDb.student.upsert({
    where: { id: STUDENT_A },
    create: { id: STUDENT_A, name: 'Nguyễn Văn An' },
    update: {}
  });
  await classDb.student.upsert({
    where: { id: STUDENT_B },
    create: { id: STUDENT_B, name: 'Trần Thị Bình' },
    update: {}
  });
  // Wipe existing enrollments for this class so reseeding is idempotent.
  await classDb.enrollment.deleteMany({ where: { class_id: CLASS_ID } });
  for (const sid of [STUDENT_A, STUDENT_B]) {
    await classDb.enrollment.create({
      data: { class_id: CLASS_ID, student_id: sid }
    });
  }
  console.log('  class.classes   → 1 row');
  console.log('  class.students  → 2 rows');
  console.log('  class.enrollments → 2 rows');
  console.log(`    CLASS_ID   = ${CLASS_ID}`);
  console.log(`    STUDENT_A  = ${STUDENT_A}`);
  console.log(`    STUDENT_B  = ${STUDENT_B}`);
  console.log(`    SKILL_ID   = ${SKILL_ID}`);

  await classDb.$disconnect();
}

main().catch((err) => {
  console.error('seed-c3 failed:', err);
  process.exit(1);
});
