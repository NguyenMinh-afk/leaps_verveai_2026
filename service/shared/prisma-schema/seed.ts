/**
 * VERVEAI — Canonical seed script for the multi-schema Prisma database.
 *
 * Seeds the bare minimum needed to bootstrap a local dev environment:
 *   - 1 admin user (email `admin@verveai.local`, password `Admin@123`)
 *   - 1 teacher user (email `teacher@verveai.local`, password `Teacher@123`)
 *
 * All seeded user passwords are hashed with bcrypt (cost 12) before insert.
 *
 * USAGE
 *   ```bash
 *   # From a service directory (service-auth recommended):
 *   pnpm exec tsx ../../shared/prisma-schema/seed.ts
 *   ```
 *
 * NOTE
 *   This file lives in `@verveai/prisma-schema` so it can be run against any
 *   schema subset, but the auth-only paths are the typical entry point.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

/** Seed hash configuration — must match `service-auth` policy (cost ≥ 12). */
const BCRYPT_COST = 12;

/** Default seeded credentials. Change before any non-dev deployment. */
const SEED_USERS: ReadonlyArray<{
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'SUPERVISOR';
}> = [
  {
    email: 'admin@verveai.local',
    password: 'Admin@123',
    name: 'VERVEAI Admin',
    role: 'ADMIN',
  },
  {
    email: 'teacher@verveai.local',
    password: 'Teacher@123',
    name: 'VERVEAI Teacher',
    role: 'TEACHER',
  },
];

/**
 * Idempotent seed function — re-running will upsert users by email.
 *
 * @param prisma - Prisma client configured for the target schema set.
 */
export async function seed(prisma: PrismaClient): Promise<void> {
  for (const u of SEED_USERS) {
    const passwordHash = await bcrypt.hash(u.password, BCRYPT_COST);

    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        role: u.role,
        is_active: true,
      },
      create: {
        email: u.email,
        password: passwordHash,
        role: u.role,
        name: u.name,
        is_active: true,
      },
    });
  }
}

/**
 * CLI entry point.
 *
 * Spawns a Prisma client against `DATABASE_URL`, runs the seed, then exits
 * with the appropriate status code.
 */
async function main(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    await seed(prisma);
    // eslint-disable-next-line no-console
    console.log('[prisma-schema] Seed complete:', SEED_USERS.map((u) => u.email).join(', '));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[prisma-schema] Seed failed:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

// Only run `main()` when invoked directly (e.g. `tsx seed.ts`). When imported
// elsewhere, callers should use `seed(prisma)` directly.
if (require.main === module) {
  void main();
}
