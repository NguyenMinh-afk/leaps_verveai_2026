"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.seed = seed;
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
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
/** Seed hash configuration — must match `service-auth` policy (cost ≥ 12). */
const BCRYPT_COST = 12;
/** Default seeded credentials. Change before any non-dev deployment. */
const SEED_USERS = [
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
async function seed(prisma) {
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
async function main() {
    const prisma = new client_1.PrismaClient();
    try {
        await seed(prisma);
        // eslint-disable-next-line no-console
        console.log('[prisma-schema] Seed complete:', SEED_USERS.map((u) => u.email).join(', '));
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error('[prisma-schema] Seed failed:', e);
        process.exitCode = 1;
    }
    finally {
        await prisma.$disconnect();
    }
}
// Only run `main()` when invoked directly (e.g. `tsx seed.ts`). When imported
// elsewhere, callers should use `seed(prisma)` directly.
if (require.main === module) {
    void main();
}
//# sourceMappingURL=seed.js.map