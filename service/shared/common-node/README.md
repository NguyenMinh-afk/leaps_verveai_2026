# @verveai/common-node

> Common utilities for VERVEAI backend microservices.

**Phạm vi:** Các module dùng chung cho tất cả service (`svc-auth`, `svc-bkt`, `svc-class`, `svc-content`, `svc-sync`) và Gateway.

**Không bao gồm:** Các module có heavy dependencies riêng — xem bảng dưới.

---

## 📦 Modules

| Module | Mô tả | Khi nào dùng |
|--------|--------|--------------|
| [`logger`](./src/logger/) | Pino logger + OpenTelemetry correlation | Mọi service — thay `console.log` |
| [`response`](./src/response/) | `success()` / `error()` / `paginate()` | Mọi route handler |
| [`error`](./src/error/) | `DomainError`, `ErrorCode`, `errorToResponse()` | Khi throw custom error |
| [`validation`](./src/validation/) | Zod schemas + `validate()` | Validate request body/query |
| [`middleware`](./src/middleware/) | `errorHandler`, `validateMiddleware`, `asyncHandler` | Trong Express app |
| [`notification`](./src/notification/) | `ConsoleNotifier`, `EmailNotifier`, `WebhookNotifier` | Gửi alert, email |
| [`crypto`](./src/crypto/) | `hashPassword`, `verifyPassword`, `signJwt`, `verifyJwt` | Auth service |
| [`pagination`](./src/pagination/) | `paginate()`, `buildPrismaOffset()`, cursor helpers | List endpoints |
| [`http`](./src/http/) | `HttpClient` với retry + timeout | Inter-service call |
| [`constants`](./src/constants/) | `Role`, `AuditAction`, `MAGIC`, enums | Code dùng chung |
| [`config`](./src/config/) | `loadConfig()` — Zod-based env loader | Startup config |
| [`utils`](./src/utils/) | Date, string, uuid, json helpers | Helpers rải rác |

---

## 🚀 Quick Start

### 1. Cài đặt trong service

```bash
# Trong service/service-auth/package.json
{
  "dependencies": {
    "@verveai/common-node": "workspace:*"
  }
}
```

### 2. Import tất cả

```typescript
// src/index.ts
import {
  logger,
  success,
  error,
  paginate,
  validateMiddleware,
  asyncHandler,
  errorHandler,
  notFoundHandler,
  requestIdMiddleware,
  Notifier,
  hashPassword,
  verifyPassword,
  signJwt,
  verifyJwt,
  Role,
  AuditAction,
  loadConfig,
  NotificationType,
  notify,
} from '@verveai/common-node';
```

### 3. Sử dụng trong service

```typescript
// src/index.ts — Express app setup
import express from 'express';
import {
  errorHandler,
  notFoundHandler,
  requestIdMiddleware,
  auditMiddleware,
} from '@verveai/common-node';

const app = express();

// Middleware
app.use(express.json());
app.use(requestIdMiddleware);
app.use(auditMiddleware);

// Routes...
app.use(notFoundHandler);
app.use(errorHandler);
```

```typescript
// src/routes/auth.routes.ts
import { Router } from 'express';
import { z } from 'zod';
import {
  validateMiddleware,
  asyncHandler,
  success,
  error,
  ErrorCode,
} from '@verveai/common-node';

const router = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

router.post(
  '/login',
  validateMiddleware(LoginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await userService.findByEmail(email);
    if (!user) {
      throw new (await import('@verveai/common-node')).AuthError(
        ErrorCode.INVALID_TOKEN,
        'Invalid credentials',
      );
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      throw new (await import('@verveai/common-node')).AuthError(
        ErrorCode.INVALID_TOKEN,
        'Invalid credentials',
      );
    }

    const token = signJwt({ sub: user.id, role: user.role, email: user.email });
    res.json(success({ token }));
  }),
);
```

```typescript
// src/services/auth.service.ts
import {
  hashPassword,
  verifyPassword,
  signJwt,
  verifyJwt,
  logger,
} from '@verveai/common-node';

const log = logger.child({ service: 'svc-auth' });

export class AuthService {
  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AuthError(ErrorCode.INVALID_TOKEN, 'Invalid credentials');
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      log.warn({ userId: user.id }, 'Failed login attempt');
      throw new AuthError(ErrorCode.INVALID_TOKEN, 'Invalid credentials');
    }

    const token = signJwt({ sub: user.id, role: user.role, email: user.email });
    log.info({ userId: user.id }, 'Login success');
    return { token };
  }
}
```

```typescript
// src/config/env.ts
import { loadConfig, z } from '@verveai/common-node';

export const config = loadConfig({
  PORT: z.coerce.number().default(3001),
  SERVICE_NAME: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});
```

```typescript
// src/routes/class.routes.ts — paginated list
import { paginate, parsePagination, buildPrismaOffset, buildPrismaTake } from '@verveai/common-node';

router.get('/classes', asyncHandler(async (req, res) => {
  const { page, pageSize } = parsePagination(req.query);
  const skip = buildPrismaOffset(page, pageSize);
  const take = buildPrismaTake(pageSize);

  const [classes, total] = await Promise.all([
    prisma.class.findMany({
      skip,
      take,
      where: { teacherId: req.headers['x-user-id'] },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.class.count({
      where: { teacherId: req.headers['x-user-id'] },
    }),
  ]);

  res.json(paginate(classes, page, pageSize, total));
}));
```

```typescript
// src/services/notification.service.ts — send alerts
import {
  notify,
  NotificationType,
  ConsoleNotifier,
  EmailNotifier,
  WebhookNotifier,
  setNotifier,
} from '@verveai/common-node';

// Setup (gọi 1 lần khi app start)
if (process.env['SMTP_URL']) {
  setNotifier(new EmailNotifier());
} else {
  setNotifier(new ConsoleNotifier());
}

// Sử dụng
await notify({
  type: NotificationType.INTERVENTION_CREATED,
  payload: { studentId, interventionId, priority },
  source: 'svc-bkt',
});
```

---

## 📋 Module chi tiết

### logger

```typescript
import { logger, createLogger } from '@verveai/common-node';

// Default logger — scoped by service name
logger.info({ userId: '123' }, 'Login success');

// Child logger — add context
const log = logger.child({ service: 'svc-auth', requestId: req.requestId });
log.warn({ reason: 'invalid_token' }, 'Auth failed');

// Custom config
const log2 = createLogger({ service: 'svc-bkt', env: 'production', level: 'info' });
```

### error

```typescript
import { DomainError, AuthError, ValidationError, ErrorCode, errorToResponse } from '@verveai/common-node';

// Throw built-in errors
throw new DomainError(ErrorCode.NOT_FOUND, 'Student not found');

// Validation error with Zod issues
throw new ValidationError(zodError.issues, 'Invalid request');

// Convert any error to API response
const response = errorToResponse(err);
res.status(500).json(response);
```

### validation

```typescript
import { z, validate, UUIDSchema, EmailSchema, PasswordSchema } from '@verveai/common-node';

// Validate in service layer
const result = validate(z.object({ name: z.string() }), data);
if (!result.ok) throw new ValidationError(result.error.issues);

// Use predefined schemas
const parsed = UUIDSchema.safeParse(id);
if (!parsed.success) throw new ValidationError(parsed.error.issues, 'Invalid ID');
```

### middleware

```typescript
import {
  errorHandler,
  notFoundHandler,
  validateMiddleware,
  asyncHandler,
  requestIdMiddleware,
  auditMiddleware,
} from '@verveai/common-node';

// Validate request body
router.post('/items', validateMiddleware(ItemSchema), asyncHandler(handler));

// Global middleware
app.use(requestIdMiddleware);
app.use(auditMiddleware);
app.use(notFoundHandler);
app.use(errorHandler);
```

### notification

```typescript
import {
  notify,
  ConsoleNotifier,
  EmailNotifier,
  WebhookNotifier,
  NotificationType,
  setNotifier,
} from '@verveai/common-node';

// Console (dev)
setNotifier(new ConsoleNotifier());

// Email
setNotifier(new EmailNotifier({ smtpUrl: process.env['SMTP_URL'] }));

// Webhook
setNotifier(new WebhookNotifier({ url: process.env['WEBHOOK_URL'], secret: process.env['WEBHOOK_SECRET'] }));

// Send
await notify({
  type: NotificationType.TEACHER_NOTE,
  payload: { studentId: 'uuid', note: 'Cần củng cố phép cộng' },
  source: 'svc-bkt',
});
```

### crypto

```typescript
import { hashPassword, verifyPassword, signJwt, verifyJwt, isJwtExpired } from '@verveai/common-node';

// Password
const hash = await hashPassword(plaintext);
const ok = await verifyPassword(plaintext, hash);

// JWT
const token = signJwt({ sub: userId, role: 'TEACHER', email });
const payload = verifyJwt(token);
const expired = isJwtExpired(token);
```

### pagination

```typescript
import { paginate, parsePagination, buildPrismaOffset, buildPrismaCursor, computePagination } from '@verveai/common-node';

// Offset pagination
const { page, pageSize } = parsePagination(req.query);
const skip = buildPrismaOffset(page, pageSize);
const items = await prisma.user.findMany({ skip, take: pageSize });
const total = await prisma.user.count();
res.json(paginate(items, page, pageSize, total));

// Cursor pagination
const { cursor, skip: cbSkip } = buildPrismaCursor(req.query['cursor'] as string, pageSize);
```

### http

```typescript
import { httpClient, HttpClient } from '@verveai/common-node';

// Simple GET
const res = await httpClient.get<User>('/api/users/123');

// POST with body
const res2 = await httpClient.post('/api/bkt/diagnosis', {
  body: { studentId, skillId },
  headers: { Authorization: `Bearer ${token}` },
  timeout: 3000,
  retries: 3,
});

if (!res2.ok) throw new Error(`HTTP ${res2.status}: ${res2.error}`);
// or use .data safely
const data = res2.data; // TypeScript knows it's User | null
```

### constants

```typescript
import { Role, AuditAction, MAGIC, INTERVENTION_STATUS, NotificationType } from '@verveai/common-node';

if (user.role === Role.TEACHER) { ... }
await logAudit({ action: AuditAction.CREATE, entity: 'intervention' });
const maxSize = MAGIC.MAX_PAGE_SIZE; // 100
```

### config

```typescript
import { loadConfig, z, isProduction } from '@verveai/common-node';

// Validate env on startup
const config = loadConfig({
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.string().url(),
  SERVICE_NAME: z.string(),
  JWT_SECRET: z.string().min(32),
});

// Access typed config
app.listen(config.PORT);

// Production check
if (isProduction()) { require('crypto').randomBytes(32); }
```

### utils

```typescript
import { now, addDays, diffDays, parseDuration, formatDuration } from '@verveai/common-node';
import { slugify, truncate, maskEmail, randomString } from '@verveai/common-node';
import { uuid, isUUID, shortId } from '@verveai/common-node';
import { safeJsonParse, deepClone, omit, pick, deepEqual } from '@verveai/common-node';

// Date
const expiry = addDays(now(), 7);
const daysLeft = diffDays(new Date(), expiry);

// String
const slug = slugify('Bài tập Toán lớp 3!');
const masked = maskEmail('minhdao@school.vn'); // 'mi****@s*****.vn'
const code = randomString(8); // 'A3x9kL2p'

// UUID
const id = uuid(); // '550e8400-...'
isUUID(id); // true
const short = shortId(); // 'a1b2c3d4'

// JSON
const obj = safeJsonParse('{"x":1}'); // { x: 1 } or null
const clean = deepClone(obj);
const partial = omit(obj, ['password']);
const selected = pick(obj, ['id', 'name']);
```

---

## 🧪 Test

```bash
cd service/shared/common-node
npm install
npm run test          # Run tests
npm run test:cov      # Run with coverage
npm run test:watch    # Watch mode
npm run lint
npm run type-check
```

---

## 📁 Cấu trúc

```
service/shared/common-node/
├── src/
│   ├── index.ts              # Main exports
│   ├── logger/
│   ├── response/
│   ├── error/
│   ├── validation/
│   ├── middleware/
│   ├── notification/
│   ├── crypto/
│   ├── pagination/
│   ├── http/
│   ├── constants/
│   ├── config/
│   └── utils/
│       ├── date.ts
│       ├── string.ts
│       ├── uuid.ts
│       └── json.ts
├── vitest.config.ts
├── tsconfig.json
└── package.json
```

---

## 🔗 Tham chiếu

- [service/WORK_SPLIT.md](../../WORK_SPLIT.md) — Phân chia 5 microservice
- [ADR-0004 Microservices Architecture](../../../docs/02-architecture/adr/0004-microservices-architecture.md)
- [Backend Rules (rules/02-backend.mdc)](../../../.cursor/rules/02-backend.mdc)

---

**Lưu ý:** Các module heavy deps (`consul-client`, `circuit-breaker`, `jwt-utils`, `prisma-schema`, `tracing`, `error-types`) sống trong các package riêng bên dưới `service/shared/`, KHÔNG phải trong `common-node`.
