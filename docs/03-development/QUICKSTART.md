# VERVEAI Backend - Quick Start Guide

> **Microservice Architecture:** 5 services + Gateway + PostgreSQL

---

## 📋 Prerequisites

### Required Software
- **Node.js** ≥ 20.x ([Download](https://nodejs.org/))
- **PostgreSQL** ≥ 15.x ([Download](https://www.postgresql.org/download/))
- **npm** hoặc **pnpm** (recommended)
- **Git** ([Download](https://git-scm.com/))

### Check Versions
```bash
node --version    # Should be >= 20.x
npm --version     # Should be >= 10.x
psql --version    # Should be >= 15.x
```

---

## 🚀 Step 1: Clone Repository

```bash
git clone https://github.com/your-org/leaps_verveai_2026.git
cd leaps_verveai_2026
```

---

## 🗄️ Step 2: Setup PostgreSQL Database

### Option A: Create Database via psql

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE verveai_db;
CREATE USER verveai_user WITH PASSWORD 'verveai_password_2026';
GRANT ALL PRIVILEGES ON DATABASE verveai_db TO verveai_user;

# Exit psql
\q
```

### Option B: Use Docker (Easier)

```bash
docker run -d \
  --name verveai-postgres \
  -e POSTGRES_DB=verveai_db \
  -e POSTGRES_USER=verveai_user \
  -e POSTGRES_PASSWORD=verveai_password_2026 \
  -p 5432:5432 \
  postgres:15
```

### Verify Connection

```bash
psql -h localhost -U verveai_user -d verveai_db -c "SELECT 1;"
```

Expected output:
```
 ?column?
----------
        1
(1 row)
```

---

## 📦 Step 3: Install Dependencies

### Install All Services

```bash
# Root dependencies
npm install

# Install each service
cd service/service-auth && npm install && cd ../..
cd service/service-bkt && npm install && cd ../..
cd service/service-class && npm install && cd ../..
cd service/service-content && npm install && cd ../..
cd service/service-sync && npm install && cd ../..
cd service/gateway && npm install && cd ../..
```

### Quick Install Script

```bash
# Create install script
cat > install-all.sh << 'EOF'
#!/bin/bash
set -e

echo "Installing root dependencies..."
npm install

echo "Installing service-auth..."
cd service/service-auth && npm install && cd ../..

echo "Installing service-bkt..."
cd service/service-bkt && npm install && cd ../..

echo "Installing service-class..."
cd service/service-class && npm install && cd ../..

echo "Installing service-content..."
cd service/service-content && npm install && cd ../..

echo "Installing service-sync..."
cd service/service-sync && npm install && cd ../..

echo "Installing gateway..."
cd service/gateway && npm install && cd ../..

echo "✅ All dependencies installed!"
EOF

chmod +x install-all.sh
./install-all.sh
```

---

## ⚙️ Step 4: Configure Environment Variables

### 1. Service-Auth

```bash
cd service/service-auth
cp .env.example .env
nano .env  # Or use your favorite editor
```

Update `.env`:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://verveai_user:verveai_password_2026@localhost:5432/verveai_db?schema=auth
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-min-32
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

### 2. Service-BKT

```bash
cd ../service-bkt
cp .env.example .env
nano .env
```

Update `.env`:
```env
NODE_ENV=development
PORT=3002
DATABASE_URL=postgresql://verveai_user:verveai_password_2026@localhost:5432/verveai_db?schema=bkt
```

### 3. Service-Class

```bash
cd ../service-class
cp .env.example .env
nano .env
```

Update `.env`:
```env
NODE_ENV=development
PORT=3003
DATABASE_URL=postgresql://verveai_user:verveai_password_2026@localhost:5432/verveai_db?schema=class
```

### 4. Service-Content

```bash
cd ../service-content
cp .env.example .env
nano .env
```

Update `.env`:
```env
NODE_ENV=development
PORT=3004
DATABASE_URL=postgresql://verveai_user:verveai_password_2026@localhost:5432/verveai_db?schema=content
```

### 5. Service-Sync

```bash
cd ../service-sync
cp .env.example .env
nano .env
```

Update `.env`:
```env
NODE_ENV=development
PORT=3005
DATABASE_URL=postgresql://verveai_user:verveai_password_2026@localhost:5432/verveai_db?schema=sync
```

### 6. Gateway

```bash
cd ../gateway
cp .env.example .env
nano .env
```

Update `.env`:
```env
NODE_ENV=development
PORT=8080
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
SVC_AUTH_URL=http://localhost:3001
SVC_BKT_URL=http://localhost:3002
SVC_CLASS_URL=http://localhost:3003
SVC_CONTENT_URL=http://localhost:3004
SVC_SYNC_URL=http://localhost:3005
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=1000
RATE_LIMIT_AUTH_MAX=100
```

---

## 🗃️ Step 5: Run Database Migrations

### Migrate All Schemas

```bash
cd ../../  # Back to root

# Migrate service-auth (schema: auth)
cd service/service-auth
npx prisma migrate dev --name init
npx prisma generate
cd ../..

# Migrate service-bkt (schema: bkt)
cd service/service-bkt
npx prisma migrate dev --name init
npx prisma generate
cd ../..

# Migrate service-class (schema: class)
cd service/service-class
npx prisma migrate dev --name init
npx prisma generate
cd ../..

# Migrate service-content (schema: content)
cd service/service-content
npx prisma migrate dev --name init
npx prisma generate
cd ../..

# Migrate service-sync (schema: sync)
cd service/service-sync
npx prisma migrate dev --name init
npx prisma generate
cd ../..
```

### Verify Migrations

```bash
psql -h localhost -U verveai_user -d verveai_db -c "\dn"
```

Expected output:
```
   List of schemas
   Name    |   Owner
-----------+-------------
 auth      | verveai_user
 bkt       | verveai_user
 class     | verveai_user
 content   | verveai_user
 public    | postgres
 sync      | verveai_user
```

---

## 🌱 Step 6: Seed Database (Optional)

### Seed Test User

```bash
cd service/service-auth
npm run seed  # Or: node prisma/seed.js
cd ../..
```

This creates:
- **Email:** `test@example.com`
- **Password:** `password`
- **Role:** TEACHER

---

## ▶️ Step 7: Start All Services

### Option A: Use Start Script (Recommended)

```bash
./scripts/dev-start-all.sh
```

### Option B: Manual Start (6 terminals)

**Terminal 1 - Gateway:**
```bash
cd service/gateway
npm run dev
```

**Terminal 2 - Service-Auth:**
```bash
cd service/service-auth
npm run dev
```

**Terminal 3 - Service-BKT:**
```bash
cd service/service-bkt
npm run dev
```

**Terminal 4 - Service-Class:**
```bash
cd service/service-class
npm run dev
```

**Terminal 5 - Service-Content:**
```bash
cd service/service-content
npm run dev
```

**Terminal 6 - Service-Sync:**
```bash
cd service/service-sync
npm run dev
```

---

## ✅ Step 8: Verify Installation

### Check All Services

```bash
# Gateway
curl http://localhost:8080/health

# Service-Auth
curl http://localhost:3001/health

# Service-BKT
curl http://localhost:3002/health

# Service-Class
curl http://localhost:3003/health

# Service-Content
curl http://localhost:3004/health

# Service-Sync
curl http://localhost:3005/health
```

All should return:
```json
{"status":"ok","service":"svc-xxx","version":"1.0.0","timestamp":"..."}
```

---

## 🧪 Step 9: Test API Flow

### 1. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password"
  }'
```

Response:
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

### 2. Save Token

```bash
export TOKEN="<paste-token-here>"
```

### 3. Test Protected Endpoints

```bash
# Get current user
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Get skills (BKT service)
curl http://localhost:8080/api/bkt/skills \
  -H "Authorization: Bearer $TOKEN"

# Get classes
curl http://localhost:8080/api/class/classes \
  -H "Authorization: Bearer $TOKEN"

# Get content
curl http://localhost:8080/api/content \
  -H "Authorization: Bearer $TOKEN"

# Get sync status
curl http://localhost:8080/api/sync/status \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Step 10: View Logs

### Service Logs

```bash
# Gateway logs
tail -f logs/gateway.log | jq .

# Service-Auth logs
tail -f logs/svc-auth.log | jq .

# Service-BKT logs
tail -f logs/svc-bkt.log | jq .
```

---

## 🛑 Stop Services

### Using Stop Script

```bash
./scripts/dev-stop-all.sh
```

### Manual Stop

```bash
# Find processes
lsof -i :8080  # Gateway
lsof -i :3001  # svc-auth
lsof -i :3002  # svc-bkt
lsof -i :3003  # svc-class
lsof -i :3004  # svc-content
lsof -i :3005  # svc-sync

# Kill processes
kill <PID>
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill it
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Or for Docker:
docker ps | grep postgres

# Test connection
psql -h localhost -U verveai_user -d verveai_db -c "SELECT 1;"
```

### Migration Errors

```bash
# Reset database (⚠️ DELETES ALL DATA)
cd service/service-auth
npx prisma migrate reset

# Re-run migrations
npx prisma migrate dev
```

### Service Won't Start

```bash
# Check logs
cat logs/svc-auth.log | jq . | tail -20

# Check .env file exists
ls -la service/service-auth/.env

# Check node_modules installed
ls service/service-auth/node_modules
```

---

## 📚 Next Steps

1. **Import Postman Collection:** `service/service-auth/postman_collection.json`
2. **Read API Documentation:** `docs/03-development/API.md`
3. **Setup Tests:** `docs/03-development/testing-strategy.md`
4. **Deploy to Production:** `docs/04-deployment/production-setup.md`

---

## 🎯 Development Workflow

```bash
# 1. Start all services
./scripts/dev-start-all.sh

# 2. Make changes to code
# Files auto-reload with nodemon

# 3. Run tests
cd service/service-auth
npm test

# 4. Stop all services
./scripts/dev-stop-all.sh
```

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/your-org/leaps_verveai_2026/issues)
- **Documentation:** `/docs`
- **Architecture:** `docs/02-architecture/`
- **System Status:** `SYSTEM_STATUS.md`
