# 🚀 Quick Start - Service Auth (Local Development)

> **Không cần Docker** — Chạy trực tiếp trên máy local

## ⚠️ QUAN TRỌNG: Tất cả API phải qua Gateway

```
❌ KHÔNG: http://localhost:3001/api/auth/login
✅ ĐÚNG:  http://localhost:8080/api/auth/login (qua Gateway)
```

---

## 📋 Prerequisites

### 1. PostgreSQL (phải có)
```bash
# Kiểm tra PostgreSQL đã cài chưa
psql --version

# Nếu chưa có, cài PostgreSQL 15+
# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib

# macOS:
brew install postgresql@15
```

### 2. Node.js (phải có)
```bash
# Kiểm tra Node.js version
node --version  # Phải ≥ 20

# Nếu chưa có hoặc version cũ, cài Node.js 20+
# Ubuntu/Debian:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# macOS:
brew install node@20
```

---

## 🔧 Setup Steps

### Bước 1: Setup Database

```bash
# 1. Start PostgreSQL service
sudo systemctl start postgresql  # Linux
# hoặc
brew services start postgresql@15  # macOS

# 2. Tạo database
sudo -u postgres psql
```

Trong PostgreSQL console:
```sql
-- Tạo database
CREATE DATABASE verveai_auth;

-- Tạo user (nếu chưa có)
CREATE USER verveai_user WITH PASSWORD 'your_secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE verveai_auth TO verveai_user;

-- Tạo schema auth
\c verveai_auth
CREATE SCHEMA IF NOT EXISTS auth;
GRANT ALL ON SCHEMA auth TO verveai_user;

-- Exit
\q
```

### Bước 2: Setup Environment Variables

```bash
cd /home/minhdao/projects/team/Aiproject2/leaps_verveai_2026/service/service-auth

# Copy .env.example → .env
cp .env.example .env

# Edit .env
nano .env
```

**Nội dung `.env`:**
```env
NODE_ENV=development
PORT=3001
LOG_LEVEL=info

# Database - ⚠️ THAY username, password, port nếu khác
DATABASE_URL=postgresql://verveai_user:your_secure_password@localhost:5432/verveai_auth?schema=auth

# JWT - ⚠️ THAY secret key (min 32 ký tự)
JWT_SECRET=change-this-to-random-32-chars-minimum-secret-key
JWT_ISSUER=verveai
JWT_EXPIRES_IN=24h

# Consul - OPTIONAL (có thể bỏ qua trong dev)
# CONSUL_HOST=localhost
# CONSUL_PORT=8500
SERVICE_NAME=svc-auth
SERVICE_PORT=3001
```

### Bước 3: Install Dependencies

```bash
# Trong thư mục service-auth
npm install

# Hoặc nếu dùng pnpm (workspace)
cd /home/minhdao/projects/team/Aiproject2/leaps_verveai_2026
pnpm install
```

### Bước 4: Run Database Migrations

```bash
cd /home/minhdao/projects/team/Aiproject2/leaps_verveai_2026/service/service-auth

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# ⚠️ Nếu lỗi: "Schema not found", chạy:
npx prisma db push
```

### Bước 5: Start Service

```bash
# Development mode (hot reload)
npm run dev

# Production mode
npm run build
npm start
```

**Kết quả thành công:**
```
🚀 Service Auth started on port 3001
📊 Metrics available at http://localhost:3001/metrics
🏥 Health check at http://localhost:3001/health
```

---

## ✅ Test Service (qua Gateway port 8080)

### Nếu CHƯA có Gateway → Test trực tiếp (temporary)

```bash
# 1. Health check
curl http://localhost:3001/health

# 2. Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.vn",
    "password": "SecurePass123!",
    "name": "Teacher Test",
    "role": "TEACHER"
  }'

# 3. Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.vn",
    "password": "SecurePass123!"
  }'
```

### ✅ Khi ĐÃ có Gateway → Test qua Gateway (PRODUCTION WAY)

```bash
# 1. Health check qua Gateway
curl http://localhost:8080/api/auth/health

# 2. Register qua Gateway
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.vn",
    "password": "SecurePass123!",
    "name": "Teacher Test",
    "role": "TEACHER"
  }'

# 3. Login qua Gateway
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.vn",
    "password": "SecurePass123!"
  }'
```

---

## 🌐 Setup Gateway (Next Step)

Gateway là **entry point duy nhất** cho tất cả services. Bạn cần setup Gateway trước khi test với Postman.

### Cách chạy Gateway:

```bash
# 1. Đi đến thư mục gateway
cd /home/minhdao/projects/team/Aiproject2/leaps_verveai_2026/service/gateway

# 2. Copy .env.example → .env
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start Gateway
npm run dev
```

**Gateway sẽ chạy ở port 8080** và route requests đến các services:
- `http://localhost:8080/api/auth/*` → `svc-auth:3001`
- `http://localhost:8080/api/bkt/*` → `svc-bkt:3002`
- `http://localhost:8080/api/class/*` → `svc-class:3003`
- `http://localhost:8080/api/content/*` → `svc-content:3004`
- `http://localhost:8080/api/sync/*` → `svc-sync:3005`

---

## 📮 Test với Postman

### Import Collection

1. Mở Postman
2. Import file: `service/service-auth/postman_collection.json`
3. **⚠️ SỬA biến `base_url`:**
   - Nếu **CHƯA có Gateway**: `base_url = http://localhost:3001`
   - Nếu **ĐÃ có Gateway**: `base_url = http://localhost:8080` ✅ (RECOMMENDED)

### Test Flow (qua Gateway):

1. **Health Check** → verify service running
2. **Register** → tạo user
3. **Login** → lấy JWT token (auto-save)
4. **Session** → verify token
5. **Me** → get user info
6. **Refresh** → renew token
7. **Logout** → revoke session

---

## 🐛 Troubleshooting

### Error: "Connection refused" khi connect DB

```bash
# Kiểm tra PostgreSQL running
sudo systemctl status postgresql

# Start nếu chưa chạy
sudo systemctl start postgresql

# Kiểm tra port
sudo netstat -plnt | grep 5432
```

### Error: "Schema 'auth' does not exist"

```bash
# Tạo schema manually
psql -U verveai_user -d verveai_auth
CREATE SCHEMA IF NOT EXISTS auth;
\q

# Hoặc dùng prisma push
npx prisma db push
```

### Error: "JWT_SECRET must be at least 32 characters"

```bash
# Sửa .env, thay JWT_SECRET bằng string dài ≥ 32 ký tự
JWT_SECRET=your-very-long-secret-key-at-least-32-characters-long
```

### Port 3001 đã được dùng

```bash
# Tìm process đang dùng port 3001
sudo lsof -i :3001

# Kill process (thay <PID> bằng process ID)
kill -9 <PID>

# Hoặc đổi port trong .env
PORT=3002
```

---

## 📊 View Logs

```bash
# Xem logs realtime
npm run dev

# Logs sẽ hiển thị:
# - Request/Response
# - Database queries
# - Errors
# - JWT verification
```

---

## 🔗 Next Steps

1. ✅ **Service Auth đang chạy** (port 3001)
2. 🔄 **Setup Gateway** (port 8080) — QUAN TRỌNG
3. 🧪 **Test qua Gateway** với Postman
4. 📝 **Viết tests** để nâng coverage lên 80%

---

## 📚 References

- [README.md](./README.md) - Full documentation
- [postman_collection.json](./postman_collection.json) - Postman collection
- [WORK_SPLIT.md](../WORK_SPLIT.md) - Service division
- [ADR-0006](../../docs/02-architecture/adr/0006-api-gateway.md) - Gateway architecture
