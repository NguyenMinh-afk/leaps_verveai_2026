# VERVEAI Backend - Microservice Architecture

> **5 Microservices + API Gateway + Service Discovery**  
> Node.js/TypeScript • PostgreSQL • Express • Consul • JWT

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Quick Start](#quick-start)
3. [Services](#services)
4. [API Documentation](#api-documentation)
5. [Development](#development)
6. [Testing](#testing)
7. [Deployment](#deployment)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client (Browser/App)                      │
│                  http://localhost:8080/api/...               │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│             Gateway (Express - Port 8080)                    │
│  • JWT Verification  • Rate Limiting  • CORS  • Routing     │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────┬───────┼───────┬────────┬────────┐
        ▼        ▼       ▼       ▼        ▼        ▼
    ┌────────┐┌────────┐┌────────┐┌────────┐┌────────┐
    │svc-auth││svc-bkt ││svc-class││svc-  ││svc-sync│
    │:3001   ││:3002   ││:3003   ││content││:3005   │
    │        ││        ││        ││:3004   ││        │
    └───┬────┘└───┬────┘└───┬────┘└───┬────┘└───┬────┘
        │         │         │         │         │
        └─────────┴─────────┴─────────┴─────────┘
                         │
                ┌────────┴────────┐
                ▼                 ▼
        ┌──────────────┐  ┌──────────────┐
        │ PostgreSQL   │  │ Logs         │
        │ (5 schemas)  │  │ (JSON files) │
        └──────────────┘  └──────────────┘
```

### Services

| Service | Port | Responsibility | Schema |
|---------|------|----------------|--------|
| **gateway** | 8080 | API Gateway, JWT verify, Rate limit | - |
| **service-auth** | 3001 | Authentication, Users, JWT | `auth` |
| **service-bkt** | 3002 | BKT engine, Diagnosis, Evidence, Interventions, Skills | `bkt` |
| **service-class** | 3003 | Classes, Students, Progress tracking | `class` |
| **service-content** | 3004 | Content, Bundles, Review, Reports | `content` |
| **service-sync** | 3005 | Sync, Devices, Conflict resolution | `sync` |

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 20.x
- **PostgreSQL** ≥ 15.x
- **npm** or **pnpm** (recommended)

### 1. Clone & Install

```bash
git clone <repo-url>
cd leaps_verveai_2026/service

# Install all dependencies
npm install
# or
pnpm install
```

### 2. Setup Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE verveai_db;"
psql -U postgres -c "CREATE USER verveai_user WITH PASSWORD 'verveai_password_2026';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE verveai_db TO verveai_user;"
```

### 3. Configure Environment

```bash
# Copy .env.example for each service
cd service-auth && cp .env.example .env && cd ..
cd service-bkt && cp .env.example .env && cd ..
cd service-class && cp .env.example .env && cd ..
cd service-content && cp .env.example .env && cd ..
cd service-sync && cp .env.example .env && cd ..
cd gateway && cp .env.example .env && cd ..

# Update DATABASE_URL in each .env file
```

### 4. Run Migrations

```bash
# Migrate all services
cd service-auth && npx prisma migrate dev && npx prisma generate && cd ..
cd service-bkt && npx prisma migrate dev && npx prisma generate && cd ..
cd service-class && npx prisma migrate dev && npx prisma generate && cd ..
cd service-content && npx prisma migrate dev && npx prisma generate && cd ..
cd service-sync && npx prisma migrate dev && npx prisma generate && cd ..
```

### 5. Seed Database

```bash
cd service-auth
npm run seed
# Creates test user: test@example.com / password
```

### 6. Start Services

```bash
# From root: /leaps_verveai_2026
./scripts/dev-start-all.sh

# Or manually (6 terminals):
# Terminal 1: cd service/gateway && npm run dev
# Terminal 2: cd service/service-auth && npm run dev
# Terminal 3: cd service/service-bkt && npm run dev
# Terminal 4: cd service/service-class && npm run dev
# Terminal 5: cd service/service-content && npm run dev
# Terminal 6: cd service/service-sync && npm run dev
```

### 7. Verify

```bash
# Check all services
curl http://localhost:8080/health  # Gateway
curl http://localhost:3001/health  # Auth
curl http://localhost:3002/health  # BKT
curl http://localhost:3003/health  # Class
curl http://localhost:3004/health  # Content
curl http://localhost:3005/health  # Sync
```

---

## Services

### 1. Gateway (Port 8080)

**Responsibility:** API Gateway, JWT verification, Rate limiting, CORS, Routing

**Key Features:**
- Single entry point for all API requests
- JWT verification (no need to re-verify in services)
- Rate limiting: 100 req/min for auth, 1000 req/min for API
- CORS policy management
- Request/response logging

**Routes:**
- `/api/auth/*` → service-auth:3001
- `/api/bkt/*` → service-bkt:3002
- `/api/class/*` → service-class:3003
- `/api/content/*` → service-content:3004
- `/api/sync/*` → service-sync:3005

**Environment Variables:**
```env
PORT=8080
JWT_SECRET=your-secret-key
SVC_AUTH_URL=http://localhost:3001
SVC_BKT_URL=http://localhost:3002
SVC_CLASS_URL=http://localhost:3003
SVC_CONTENT_URL=http://localhost:3004
SVC_SYNC_URL=http://localhost:3005
```

---

### 2. Service-Auth (Port 3001)

**Responsibility:** Authentication, User management, JWT generation

**Database Schema:** `auth`

**Key Endpoints:**
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/users` - List users (admin only)

**Environment Variables:**
```env
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/verveai_db?schema=auth
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

**Tech Stack:**
- Express.js
- Prisma ORM
- bcrypt (password hashing)
- jsonwebtoken (JWT)
- Zod (validation)

---

### 3. Service-BKT (Port 3002)

**Responsibility:** Bayesian Knowledge Tracing, Diagnosis, Evidence, Interventions, Skills

**Database Schema:** `bkt`

**Key Endpoints:**
- `POST /api/bkt/diagnosis/run` - Run BKT diagnosis
- `GET /api/bkt/diagnosis/student/:id` - Get student diagnosis
- `POST /api/bkt/evidence` - Record evidence
- `GET /api/bkt/evidence/student/:id` - Get student evidence
- `GET /api/bkt/interventions` - List interventions
- `GET /api/bkt/skills` - List skills
- `GET /api/bkt/skills/tree` - Get skill tree

**Environment Variables:**
```env
PORT=3002
DATABASE_URL=postgresql://user:pass@localhost:5432/verveai_db?schema=bkt
```

**Tech Stack:**
- Express.js
- Prisma ORM
- BKT algorithm (deterministic)
- Zod (validation)

---

### 4. Service-Class (Port 3003)

**Responsibility:** Class management, Student management, Progress tracking

**Database Schema:** `class`

**Key Endpoints:**
- `GET /api/class/classes` - List classes
- `POST /api/class/classes` - Create class
- `GET /api/class/classes/:id` - Get class
- `GET /api/class/students/:id` - Get student
- `GET /api/class/progress/:studentId` - Get student progress

**Environment Variables:**
```env
PORT=3003
DATABASE_URL=postgresql://user:pass@localhost:5432/verveai_db?schema=class
```

---

### 5. Service-Content (Port 3004)

**Responsibility:** Content management, Bundles, Review, Reports

**Database Schema:** `content`

**Key Endpoints:**
- `GET /api/content` - List content
- `POST /api/content` - Create content
- `GET /api/content/bundles` - List bundles
- `POST /api/content/bundles/build` - Build bundle
- `POST /api/content/bundles/:id/sign` - Sign bundle (Ed25519)
- `GET /api/content/review` - Get review queue
- `GET /api/content/reports/aggregate` - Get aggregate reports

**Environment Variables:**
```env
PORT=3004
DATABASE_URL=postgresql://user:pass@localhost:5432/verveai_db?schema=content
```

---

### 6. Service-Sync (Port 3005)

**Responsibility:** Sync management, Device management, Conflict resolution

**Database Schema:** `sync`

**Key Endpoints:**
- `GET /api/sync/status` - Get sync status
- `POST /api/sync/push` - Push data
- `GET /api/sync/pull` - Pull data
- `POST /api/sync/resolve` - Resolve conflicts
- `GET /api/sync/devices` - List devices

**Environment Variables:**
```env
PORT=3005
DATABASE_URL=postgresql://user:pass@localhost:5432/verveai_db?schema=sync
```

---

## API Documentation

### Authentication Flow

#### 1. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2026-09-12T01:17:45.636Z",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "test@example.com",
      "name": "Test User",
      "role": "TEACHER"
    }
  }
}
```

#### 2. Use Token

```bash
curl http://localhost:8080/api/bkt/skills \
  -H "Authorization: Bearer <your-token>"
```

### Standard Response Format

All endpoints return consistent JSON format:

```json
{
  "success": true,
  "data": { /* your data */ },
  "error": null
}
```

Error response:
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": { /* validation errors */ }
  }
}
```

### Pagination

List endpoints support pagination:

```bash
curl "http://localhost:8080/api/bkt/skills?page=1&pageSize=20" \
  -H "Authorization: Bearer <token>"
```

Response includes metadata:
```json
{
  "success": true,
  "data": [ /* items */ ],
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Development

### Project Structure (Per Service)

```
service-{name}/
├── src/
│   ├── routes/              # Express routes
│   │   └── {entity}.routes.ts
│   ├── services/            # Business logic
│   │   └── {entity}.service.ts
│   ├── prisma/              # Prisma client
│   │   └── client.ts
│   ├── middleware/          # Express middleware
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── validators/          # Zod schemas
│   │   └── {entity}.validator.ts
│   ├── utils/               # Utilities
│   │   ├── logger.ts
│   │   └── response.ts
│   └── index.ts             # Entry point
├── prisma/
│   └── schema.prisma        # Database schema
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── package.json
└── tsconfig.json
```

### Coding Standards

#### Naming Conventions

- **Files:** kebab-case (`auth-service.ts`)
- **Classes:** PascalCase (`AuthService`)
- **Functions/Variables:** camelCase (`createUser`)
- **Constants:** UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Database tables:** snake_case plural (`users`, `student_classes`)

#### TypeScript

- **Strict mode:** enabled
- **No `any`:** use `unknown` + type guards
- **Interfaces:** no `I` prefix (use `User`, not `IUser`)

#### Error Handling

```typescript
// Use custom error classes
import { ValidationError, NotFoundError } from '../utils/errors';

if (!user) {
  throw new NotFoundError('User not found');
}

if (!isValidEmail(email)) {
  throw new ValidationError('Invalid email format');
}
```

#### Logging

```typescript
import { logger } from '../utils/logger';

logger.info('User logged in', { userId: user.id });
logger.error('Login failed', { email, error: err.message });
```

### Adding a New Endpoint

#### 1. Define Validator (Zod)

```typescript
// src/validators/skill.validator.ts
import { z } from 'zod';

export const createSkillSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(255),
    description: z.string().optional(),
    prerequisites: z.array(z.string().uuid()).optional(),
  }),
});
```

#### 2. Create Service

```typescript
// src/services/skill.service.ts
import { prisma } from '../prisma/client';

export class SkillService {
  async create(data: { name: string; description?: string }) {
    return prisma.skill.create({ data });
  }

  async findAll(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      prisma.skill.findMany({ skip, take: pageSize }),
      prisma.skill.count(),
    ]);
    return { items, total, page, pageSize };
  }
}
```

#### 3. Create Route

```typescript
// src/routes/skill.routes.ts
import { Router } from 'express';
import { validate } from '../middleware/validate.middleware';
import { createSkillSchema } from '../validators/skill.validator';
import { SkillService } from '../services/skill.service';

const router = Router();
const skillService = new SkillService();

router.post('/', validate(createSkillSchema), async (req, res, next) => {
  try {
    const skill = await skillService.create(req.body);
    res.json({ success: true, data: skill });
  } catch (error) {
    next(error);
  }
});

export default router;
```

#### 4. Register Route

```typescript
// src/index.ts
import skillRoutes from './routes/skill.routes';

app.use('/api/bkt/skills', skillRoutes);
```

---

## Testing

### Unit Tests

```bash
cd service-auth
npm run test:unit
```

**Example:**
```typescript
// tests/unit/auth.service.test.ts
import { describe, it, expect, vi } from 'vitest';
import { AuthService } from '../src/services/auth.service';

describe('AuthService', () => {
  it('should hash password', async () => {
    const service = new AuthService();
    const hashed = await service.hashPassword('password123');
    expect(hashed).not.toBe('password123');
  });
});
```

### Integration Tests

```bash
npm run test:integration
```

**Example:**
```typescript
// tests/integration/auth.integration.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/index';

describe('POST /api/auth/login', () => {
  it('should return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});
```

### Coverage

```bash
npm run test:cov
```

**Requirements:**
- Services: ≥ 80%
- Routes: ≥ 70%
- Middleware: ≥ 90%

---

## Deployment

### Production Environment Variables

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@db-host:5432/verveai_db?schema=auth
JWT_SECRET=<strong-random-secret-min-32-chars>
JWT_REFRESH_SECRET=<different-strong-secret>
```

### Build

```bash
cd service-auth
npm run build
# Output: dist/
```

### Run Production

```bash
npm run start
# or
node dist/index.js
```

### Docker (Optional)

```bash
# Build
docker build -t verveai-auth:1.0.0 -f service-auth/Dockerfile .

# Run
docker run -d \
  --name verveai-auth \
  -p 3001:3001 \
  --env-file service-auth/.env \
  verveai-auth:1.0.0
```

### Health Checks

All services expose `/health` endpoint:

```bash
curl http://service:port/health
```

Response:
```json
{
  "status": "ok",
  "service": "svc-auth",
  "version": "1.0.0",
  "timestamp": "2026-09-11T01:17:45.636Z"
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process
lsof -i :8080

# Kill process
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U verveai_user -d verveai_db -c "SELECT 1;"
```

### Migration Errors

```bash
# Reset database (⚠️ DELETES ALL DATA)
cd service-auth
npx prisma migrate reset

# Re-run migrations
npx prisma migrate dev
```

### Service Won't Start

```bash
# Check logs
tail -f logs/svc-auth.log | jq .

# Check .env exists
ls -la service-auth/.env

# Check dependencies installed
ls service-auth/node_modules
```

---

## Useful Commands

```bash
# Start all services
./scripts/dev-start-all.sh

# Stop all services
./scripts/dev-stop-all.sh

# Restart specific service
cd service-auth && npm run dev

# View logs
tail -f logs/gateway.log | jq .
tail -f logs/svc-auth.log | jq .

# Database
psql -h localhost -U verveai_user -d verveai_db

# Check all health
for port in 8080 3001 3002 3003 3004 3005; do
  echo "Port $port:" && curl -s http://localhost:$port/health | jq .
done
```

---

## Documentation

- **Quick Start:** [docs/03-development/QUICKSTART.md](../../docs/03-development/QUICKSTART.md)
- **API Reference:** [docs/03-development/API.md](../../docs/03-development/API.md)
- **Architecture:** [docs/02-architecture/adr/0004-microservices-architecture.md](../../docs/02-architecture/adr/0004-microservices-architecture.md)
- **Testing Strategy:** [docs/03-development/testing-strategy.md](../../docs/03-development/testing-strategy.md)
- **System Status:** [SYSTEM_STATUS.md](../../SYSTEM_STATUS.md)

---

## Support

- **Issues:** [GitHub Issues](https://github.com/your-org/leaps_verveai_2026/issues)
- **Documentation:** `/docs`
- **Postman Collection:** `service-auth/postman_collection.json`

---

## License

Proprietary © 2026 Team Verve Core. All rights reserved.
