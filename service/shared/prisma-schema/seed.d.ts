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
/**
 * Idempotent seed function — re-running will upsert users by email.
 *
 * @param prisma - Prisma client configured for the target schema set.
 */
export declare function seed(prisma: PrismaClient): Promise<void>;
