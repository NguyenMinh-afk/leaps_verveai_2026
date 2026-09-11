# Service Auth - Authentication & User Management

> **Owner:** Dev 1  
> **Port:** 3001  
> **Status:** 🟡 In Development (Coverage: 26% - needs improvement)

## 📋 Overview

Service authentication cung cấp JWT-based authentication và user management cho hệ thống VERVEAI.

**Endpoints:**
- `POST /api/auth/login` - VP-221
- `POST /api/auth/logout` - VP-222
- `GET /api/auth/session` - VP-223
- `GET /api/auth/me` - VP-224
- `POST /api/auth/register` - VP-226
- `POST /api/auth/refresh` - VP-227
- `GET /api/users` - VP-225 (Admin)
- `POST /api/users` - VP-225 (Admin)
- `GET /api/users/:id` - VP-225
- `PUT /api/users/:id` - VP-225
- `DELETE /api/users/:id` - VP-225 (Admin)

## 🚀 Quick Start

### Option 1: Automatic Setup (Recommended)

```bash
# Run setup script - tự động setup tất cả
./setup.sh
```

Script sẽ:
- ✅ Check prerequisites (Node.js, PostgreSQL)
- ✅ Create .env file
- ✅ Install dependencies
- ✅ Setup database & schema
- ✅ Run migrations
- ✅ Start service

### Option 2: Manual Setup

Xem chi tiết tại [QUICKSTART.md](./QUICKSTART.md)

**Prerequisites:**
- Node.js ≥ 20
- PostgreSQL ≥ 15
- Consul (optional for local dev)

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env với database credentials

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start dev server
npm run dev
```

### ⚠️ QUAN TRỌNG: Gateway Requirement

**Tất cả API calls PHẢI qua Gateway (port 8080):**

```bash
❌ WRONG: http://localhost:3001/api/auth/login
✅ RIGHT: http://localhost:8080/api/auth/login
```

Xem [ADR-0006](../../docs/02-architecture/adr/0006-api-gateway.md) để biết thêm chi tiết.

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/verveai?schema=auth"

# JWT
JWT_SECRET="your-secret-key-here-change-in-production"
JWT_EXPIRES_IN="24h"
JWT_ISSUER="verveai-auth"

# Service
PORT=3001
NODE_ENV="development"

# Consul (optional)
CONSUL_HOST="localhost"
CONSUL_PORT=8500
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests only
npm run test:unit

# Integration tests (requires test DB)
npm run test:integration

# All tests with coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### Current Coverage Status

❌ **Coverage: 26.03%** (Target: 80%)

**Needs:**
- Route tests (0% → 70%)
- Middleware tests (0% → 90%)
- Integration tests with real DB
- E2E tests via Gateway

## 📮 Postman Testing

Import `postman_collection.json` vào Postman để test.

**Collection variables:**
- `base_url`: http://localhost:3001
- `gateway_url`: http://localhost:8080
- `access_token`: Auto-saved sau login
- `refresh_token`: Auto-saved sau login
- `user_id`: Auto-saved sau register/login

**Test flow:**
1. **Register** → tạo user mới (VP-226)
2. **Login** → lấy tokens (VP-221)
3. **Session** → check session còn valid (VP-223)
4. **Me** → get user info (VP-224)
5. **Refresh** → refresh access token (VP-227)
6. **Logout** → revoke session (VP-222)

## 🏗️ Architecture

```
Request
  ↓
Route (auth.routes.ts, user.routes.ts)
  ↓ validate (Zod)
Service (auth.service.ts, user.service.ts)
  ↓
Prisma Client
  ↓
PostgreSQL (schema: auth)
```

**Key components:**
- `routes/` - Express route handlers
- `services/` - Business logic
- `middleware/` - Validation, error handling, metrics
- `validators/` - Zod schemas
- `prisma/` - Database client
- `config/` - Environment, Consul registration

## 🔐 Security

- ✅ bcrypt (cost factor: 12) cho password hashing
- ✅ JWT với expiry (24h access, 7d refresh)
- ✅ Session revocation qua database
- ✅ Input validation với Zod
- ✅ SQL injection protection (Prisma ORM)
- ⚠️ Rate limiting (implemented in Gateway)
- ⚠️ CORS (implemented in Gateway)

## 📊 Metrics

Exposed at `/metrics` (Prometheus format):
- `http_request_duration_seconds`
- `http_requests_total`
- `db_query_duration_seconds`

## 🏥 Health Check

```bash
curl http://localhost:3001/health
```

Response:
```json
{
  "status": "ok",
  "service": "svc-auth",
  "version": "1.0.0"
}
```

## 🔗 Integration with Other Services

**Gateway → Auth:**
- Gateway calls `/api/auth/login` để verify credentials
- Gateway caches JWT verification

**Other services → Auth:**
- Không gọi trực tiếp
- Trust `X-User-Id`, `X-User-Role` headers từ Gateway (đã verify)

## 📝 TODO (VP-225)

- [ ] Viết route tests (target: 70%)
- [ ] Viết middleware tests (target: 90%)
- [ ] Viết integration tests với Postgres + Consul containers
- [ ] Clean up duplicate files (`authService.ts`, empty routes)
- [ ] Add E2E tests qua Gateway
- [ ] Implement password reset flow
- [ ] Add email verification

## 🐛 Known Issues

1. Coverage quá thấp (26%) - cần viết thêm tests
2. Duplicate files: `authService.ts` vs `auth.service.ts`
3. Empty route files: `auth.ts`, `users.ts`
4. Chưa có integration tests với Consul

## 📚 References

- [WORK_SPLIT.md](../WORK_SPLIT.md) - Service division
- [ADR-0004](../../docs/02-architecture/adr/0004-microservices-architecture.md) - Microservices
- [ADR-0005](../../docs/02-architecture/adr/0005-service-discovery.md) - Consul
- [Backend Rules](../../.cursor/rules/02-backend.mdc) - Coding standards
