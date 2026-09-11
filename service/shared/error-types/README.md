# `@verveai/error-types`

Domain error hierarchy shared by every VERVEAI microservice and the Express
Gateway. Provides a small set of typed error classes that map cleanly to HTTP
responses, plus helpers for logging and serialization.

> Part of `service/shared/*` — consumed by `service/service-auth`,
> `service/service-bkt`, `service/service-class`, `service/service-content`,
> `service/service-sync`, and `service/gateway`.

## Purpose

- Standardize how service code signals failures to the gateway and clients.
- Carry enough structured context (`code`, `httpStatus`, `details`) to render
  consistent JSON error responses across the platform.
- Keep error semantics framework-agnostic — no Express, Zod, or HTTP coupling
  inside the classes themselves.

## Installation

This package is part of the VERVEAI `pnpm` workspace and is referenced via
`@verveai/error-types`. No external runtime dependencies.

## Class Hierarchy

```
Error
└── DomainError                         (base — code, message, httpStatus, details)
    ├── ValidationError                 (400 — Zod-like `issues` array)
    ├── AuthError                       (401 — caller-supplied code)
    ├── NotFoundError                   (404 — resource[, id])
    ├── ConflictError                   (409)
    └── InternalError                   (500)
```

| Class | HTTP Status | `code` | When to use |
|-------|-------------|--------|-------------|
| `DomainError` | configurable | caller-supplied | Base class / custom mappings |
| `ValidationError` | 400 | `VALIDATION_FAILED` | Input failed schema validation |
| `AuthError` | 401 | caller-supplied (`AUTH_*`) | Bad credentials, expired token, … |
| `NotFoundError` | 404 | `NOT_FOUND` | Resource not found |
| `ConflictError` | 409 | `CONFLICT` | Duplicate / state conflict |
| `InternalError` | 500 | `INTERNAL` | Unrecoverable server error |

## Usage

### Throwing errors from service code

```typescript
import {
  NotFoundError,
  ValidationError,
  ConflictError,
} from '@verveai/error-types';

export async function getStudent(id: string) {
  const student = await prisma.student.findUnique({ where: { id } });
  if (!student) {
    throw new NotFoundError('Student', id);
  }
  return student;
}

export async function createStudent(input: CreateStudentInput) {
  const parsed = StudentSchema.safeParse(input);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.issues);
  }
  const exists = await prisma.student.findUnique({
    where: { email: parsed.data.email },
  });
  if (exists) {
    throw new ConflictError('Student with this email already exists');
  }
  return prisma.student.create({ data: parsed.data });
}
```

### Translating to HTTP responses (gateway-side middleware)

```typescript
import { isDomainError, formatDomainError } from '@verveai/error-types';

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (isDomainError(err)) {
    const body = formatDomainError(err, {
      requestId: req.id,
      service: 'svc-class',
    });
    res.status(err.httpStatus).json(body);
    return;
  }
  // Unknown error — don't leak internals.
  res.status(500).json({ code: 'INTERNAL', message: 'Internal server error' });
});
```

### Safe logging

```typescript
import { errorToString } from '@verveai/error-types';

logger.error({ err: errorToString(err) }, 'failed to process request');
```

## Exports

### Classes

- `DomainError`
- `ValidationError`
- `AuthError`
- `NotFoundError`
- `ConflictError`
- `InternalError`

### Types / interfaces

- `ErrorContext` — request correlation, user, service, plus arbitrary extras.
- `ValidationIssue` — `{ path, message, code }` (Zod-compatible).

### Helpers

- `errorToString(err: unknown): string` — never throws, never returns `undefined`.
- `formatDomainError(err: DomainError, context?: ErrorContext)` — produces a
  JSON-safe object suitable for API responses or structured logs.
- `isDomainError(err: unknown): err is DomainError` — type guard for catch blocks.

## Testing

```bash
npm test           # vitest run
npm run test:watch # watch mode
npm run test:cov   # coverage report
```

Coverage thresholds (enforced by `vitest.config.ts`):

| Metric | Threshold |
|--------|-----------|
| Lines | 80 % |
| Functions | 80 % |
| Branches | 70 % |
| Statements | 80 % |

## Build

```bash
npm run build      # tsc → dist/
```

Output goes to `dist/` with `.js`, `.d.ts`, and source maps.

## License

UNLICENSED — proprietary to VERVEAI.
