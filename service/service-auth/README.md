# service-auth

Authentication Service cho VERVEAI — quản lý Login, JWT, và Users.

## 🎯 Mục đích

Service này chịu trách nhiệm:
- ✅ **VP-221**: Login + JWT issue
- ✅ **VP-222**: Logout + token invalidation
- ✅ **VP-223**: Session check
- ✅ **VP-224**: Get current user (từ Gateway headers)
- ✅ **VP-225**: User CRUD (GET/POST/PUT/DELETE `/api/users/*`)
- ✅ **VP-226**: Password hash với bcrypt (cost factor ≥ 12)
- ✅ **VP-227**: Refresh token rotation
- ✅ **VP-228**: Seed admin/teacher/student users

## 🚀 Quick Start

```bash
# Install dependencies (từ root workspace)
pnpm install

# Generate Prisma client
npm run db:generate

# Run migrations (nếu cần)
npm run db:migrate

# Seed data (admin + teacher + student)
npm run db:seed

# Development
npm run dev

# Production
npm run build
npm start
```

## 📋 Routes

### Auth Routes (`/api/auth`)

| Endpoint | Method | Mô tả | Auth |
|----------|--------|-------|------|
| `/api/auth/login` | POST | Login → trả JWT + refreshToken | ❌ |
| `/api/auth/logout` | POST | Logout + invalidate token | ✅ |
| `/api/auth/session` | GET | Check session | ✅ |
| `/api/auth/me` | GET | Get current user | ✅ |
| `/api/auth/refresh` | POST | Refresh token rotation | ❌ |

### User Routes (`/api/users`)

| Endpoint | Method | Mô tả | Auth |
|----------|--------|-------|------|
| `/api/users` | GET | List users (pagination) | ✅ |
| `/api/users/:id` | GET | Get user by ID | ✅ |
| `/api/users/:id` | PUT | Update user | ✅ |
| `/api/users/:id` | DELETE | Delete user | ✅ |

## 🔐 Security

- **Bcrypt**: cost factor = 12
- **JWT**: exp = 24h, refresh = 7d
- **Headers từ Gateway**:
  - `X-User-Id`: User ID (Gateway đã verify JWT)
  - `X-User-Role`: User role
  - Service tin tưởng headers từ Gateway (KHÔNG re-verify JWT)

## 🗄️ Database Schema

```prisma
model user {
  id           String    @id @default(uuid())
  email        String    @unique
  password     String    // bcrypt hashed
  role         user_role
  name         String
  is_active    Boolean   @default(true)
  created_at   DateTime  @default(now())
  updated_at   DateTime  @updatedAt

  sessions        session[]
  teacher_classes teacher_class[]
  notes           teacher_note[]

  @@map("users")
  @@schema("auth")
}

enum user_role {
  TEACHER
  ADMIN
  SUPERVISOR
  
  @@schema("auth")
}

model session {
  id            String    @id @default(uuid())
  user_id       String
  token         String    @unique
  refresh_token String?   @unique
  expires_at    DateTime
  created_at    DateTime  @default(now())
  revoked_at    DateTime?

  user user @relation(fields: [user_id], references: [id], onDelete: Cascade)

  @@map("sessions")
  @@schema("auth")
}
```

## 🧪 Testing

```bash
# Unit tests
npm run test:unit

# Coverage (≥ 80% required)
npm run test:cov

# Integration tests (với Consul + Postgres containers)
npm run test:integration
```

### Coverage Current Status

| Layer | Coverage | Target |
|-------|----------|--------|
| Services | **97%** ✅ | 80% |
| Routes | 0% | 70% |
| Middleware | 0% | 90% |

## 🛠️ Development

### Environment Variables

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/verveai?schema=auth
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_ISSUER=verveai
JWT_EXPIRES_IN=24h
CONSUL_HOST=localhost
CONSUL_PORT=8500
```

### Seed Data (VP-228)

```bash
npm run db:seed
```

Tạo 3 users:
1. **Admin**: `admin@verveai.vn` / `Admin@123` (role: ADMIN)
2. **Teacher**: `teacher@school.vn` / `Teacher@123` (role: TEACHER)
3. **Supervisor**: `supervisor@school.vn` / `Supervisor@123` (role: SUPERVISOR)

## 📊 Metrics

Service expose `/metrics` cho Prometheus:
- `http_request_duration_seconds`
- `http_requests_total`
- `circuit_breaker_state` (cho inter-service calls)

## 🔗 Dependencies

- `express`: HTTP server
- `bcrypt`: Password hashing (cost factor 12)
- `jsonwebtoken`: JWT sign/verify
- `@prisma/client`: PostgreSQL ORM
- `@verveai/common-node`: Common utilities
- `@verveai/error-types`: Domain errors
- `@verveai/consul-client`: Service Discovery
- `@verveai/circuit-breaker`: Circuit breaker (opossum)
- `@verveai/tracing`: OpenTelemetry tracing

## 📝 Notes

- Service đăng ký với Consul khi khởi động (port 3001)
- Graceful shutdown: SIGTERM → deregister Consul → close Prisma
- JWT verify TẠI GATEWAY, service chỉ nhận headers `X-User-Id`, `X-User-Role`
- Password phải ≥ 8 ký tự
- Email phải unique

## 🚨 Sprint 2.2 Completed ✅

- [x] **VP-220**: Prisma schema cho auth
- [x] **VP-221**: Login + JWT issue
- [x] **VP-222**: Logout
- [x] **VP-223**: Session check
- [x] **VP-224**: Get current user
- [x] **VP-225**: User CRUD
- [x] **VP-226**: Password hash bcrypt cost 12
- [x] **VP-227**: Refresh token rotation
- [x] **VP-228**: Seed admin/teacher/supervisor users

**Coverage:** Services 97% (target: 80%) ✅

## 📚 Next Steps

- Sprint 2.3: BKT Service (VP-230 đến VP-240)
- Add integration tests cho routes
- Add e2e tests qua Gateway
