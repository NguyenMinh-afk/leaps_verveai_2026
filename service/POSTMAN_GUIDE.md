# VERVEAI Backend - Postman Testing Guide

> **Collection:** `service/postman_collection.json`  
> **Gateway URL:** `http://localhost:8080`

---

## 📥 Import Collection

### Option 1: Import File

1. Mở Postman
2. Click **Import** (góc trên bên trái)
3. Chọn **Upload Files**
4. Chọn file `service/postman_collection.json`
5. Click **Import**

### Option 2: Import từ URL (nếu có Git hosting)

1. Mở Postman
2. Click **Import**
3. Chọn **Link**
4. Paste URL raw của file JSON
5. Click **Continue** → **Import**

---

## 🔧 Setup Variables

Collection đã có sẵn các biến:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `gateway_url` | `http://localhost:8080` | API Gateway endpoint |
| `auth_url` | `http://localhost:3001` | Service-Auth direct (for debug) |
| `bkt_url` | `http://localhost:3002` | Service-BKT direct (for debug) |
| `class_url` | `http://localhost:3003` | Service-Class direct (for debug) |
| `content_url` | `http://localhost:3004` | Service-Content direct (for debug) |
| `sync_url` | `http://localhost:3005` | Service-Sync direct (for debug) |
| `access_token` | *(auto-filled)* | JWT access token |
| `refresh_token` | *(auto-filled)* | JWT refresh token |
| `user_id` | *(auto-filled)* | Current user ID |

**Lưu ý:** 
- **Luôn sử dụng `gateway_url`** cho production testing
- Direct service URLs chỉ dùng để debug khi Gateway gặp vấn đề

---

## 🚀 Quick Start - Full Flow Test

### Step 1: Start All Services

```bash
# Terminal 1: Start Docker services
cd /home/minhdao/projects/team/Aiproject2/leaps_verveai_2026
docker compose up -d

# Terminal 2: Start Gateway
cd service/gateway
npm run dev

# Terminal 3: Start Service-Auth
cd service/service-auth
npm run dev

# Terminal 4: Start Service-BKT
cd service/service-bkt
npm run dev

# Terminal 5: Start Service-Class
cd service/service-class
npm run dev

# Terminal 6: Start Service-Content
cd service/service-content
npm run dev

# Terminal 7: Start Service-Sync
cd service/service-sync
npm run dev
```

### Step 2: Verify Services

Trong Postman, chạy các request theo thứ tự:

#### 2.1. Check Gateway
```
GET {{gateway_url}}/health
```
Expected: `200 OK`

#### 2.2. Check All Services
```
GET {{gateway_url}}/api/auth/health
GET {{gateway_url}}/api/bkt/health
GET {{gateway_url}}/api/class/health
GET {{gateway_url}}/api/content/health
GET {{gateway_url}}/api/sync/health
```
Expected: All return `200 OK`

---

## 🔐 Authentication Flow

### 1. Register New User

**Request:**
```
POST {{gateway_url}}/api/auth/register
Content-Type: application/json

{
  "email": "newteacher@verveai.edu.vn",
  "password": "SecurePass123!",
  "name": "Nguyễn Văn A",
  "role": "TEACHER"
}
```

**Expected Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "newteacher@verveai.edu.vn",
    "name": "Nguyễn Văn A",
    "role": "TEACHER",
    "createdAt": "2026-09-11T02:30:00.000Z"
  }
}
```

**Auto-saved:** `user_id` variable

---

### 2. Login

**Request:**
```
POST {{gateway_url}}/api/auth/login
Content-Type: application/json

{
  "email": "teacher@school.vn",
  "password": "SecurePass123!"
}
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2026-09-12T02:30:00.000Z",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "teacher@school.vn",
      "name": "Nguyễn Văn A",
      "role": "TEACHER"
    }
  }
}
```

**Auto-saved:** 
- `access_token`
- `refresh_token`
- `user_id`

✅ **Bạn đã sẵn sàng test các API khác!**

---

### 3. Get Current User

**Request:**
```
GET {{gateway_url}}/api/auth/me
Authorization: Bearer {{access_token}}
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "teacher@school.vn",
    "name": "Nguyễn Văn A",
    "role": "TEACHER"
  }
}
```

---

### 4. Check Session

**Request:**
```
GET {{gateway_url}}/api/auth/session
Authorization: Bearer {{access_token}}
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "teacher@school.vn",
      "role": "TEACHER"
    }
  }
}
```

---

### 5. Refresh Token

**Request:**
```
POST {{gateway_url}}/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "{{refresh_token}}"
}
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresAt": "2026-09-12T03:00:00.000Z"
  }
}
```

**Auto-saved:** `access_token` (updated)

---

### 6. Logout

**Request:**
```
POST {{gateway_url}}/api/auth/logout
Authorization: Bearer {{access_token}}
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👥 User Management

### List All Users (Admin Only)

**Request:**
```
GET {{gateway_url}}/api/users?page=1&limit=10
Authorization: Bearer {{access_token}}
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "teacher@school.vn",
      "name": "Nguyễn Văn A",
      "role": "TEACHER",
      "createdAt": "2026-09-11T02:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get User by ID

**Request:**
```
GET {{gateway_url}}/api/users/{{user_id}}
Authorization: Bearer {{access_token}}
```

### Update User

**Request:**
```
PUT {{gateway_url}}/api/users/{{user_id}}
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "Nguyễn Văn A (Updated)"
}
```

### Delete User (Admin Only)

**Request:**
```
DELETE {{gateway_url}}/api/users/{{user_id}}
Authorization: Bearer {{access_token}}
```

---

## 📊 Service-BKT (Bayesian Knowledge Tracing)

### List Skills

**Request:**
```
GET {{gateway_url}}/api/bkt/skills
Authorization: Bearer {{access_token}}
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "skill-123",
      "name": "Giải phương trình bậc 2",
      "description": "Kỹ năng giải phương trình bậc 2 dạng ax²+bx+c=0",
      "prerequisites": []
    }
  ]
}
```

### Get Skill Tree

**Request:**
```
GET {{gateway_url}}/api/bkt/skills/tree
Authorization: Bearer {{access_token}}
```

### Record Evidence

**Request:**
```
POST {{gateway_url}}/api/bkt/evidence
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "studentId": "student-123",
  "itemId": "item-456",
  "response": 1,
  "latencyMs": 5000,
  "contextMode": "in-class"
}
```

**Expected Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "evidence-uuid",
    "studentId": "student-123",
    "itemId": "item-456",
    "response": 1,
    "latencyMs": 5000,
    "contextMode": "in-class",
    "createdAt": "2026-09-11T02:30:00.000Z"
  }
}
```

### Get Student Evidence

**Request:**
```
GET {{gateway_url}}/api/bkt/evidence/student/student-123
Authorization: Bearer {{access_token}}
```

### Run Diagnosis

**Request:**
```
POST {{gateway_url}}/api/bkt/diagnosis/run
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "studentId": "student-123"
}
```

**Expected Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "studentId": "student-123",
    "diagnosis": {
      "skills": [
        {
          "skillId": "skill-123",
          "pKnown": 0.85,
          "confidence": "high"
        }
      ],
      "interventions": []
    }
  }
}
```

### Get Student Diagnosis

**Request:**
```
GET {{gateway_url}}/api/bkt/diagnosis/student/student-123
Authorization: Bearer {{access_token}}
```

### List Interventions

**Request:**
```
GET {{gateway_url}}/api/bkt/interventions
Authorization: Bearer {{access_token}}
```

---

## 🎓 Service-Class (Class Management)

### List Classes

**Request:**
```
GET {{gateway_url}}/api/class/classes
Authorization: Bearer {{access_token}}
```

### Create Class

**Request:**
```
POST {{gateway_url}}/api/class/classes
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "name": "Lớp 10A1",
  "grade": "10",
  "academicYear": "2026-2027"
}
```

### Get Class by ID

**Request:**
```
GET {{gateway_url}}/api/class/classes/class-123
Authorization: Bearer {{access_token}}
```

### List Students

**Request:**
```
GET {{gateway_url}}/api/class/students
Authorization: Bearer {{access_token}}
```

### Get Student Progress

**Request:**
```
GET {{gateway_url}}/api/class/progress/student-123
Authorization: Bearer {{access_token}}
```

---

## 📚 Service-Content (Content Management)

### List Content

**Request:**
```
GET {{gateway_url}}/api/content
Authorization: Bearer {{access_token}}
```

### Get Content by ID

**Request:**
```
GET {{gateway_url}}/api/content/content-123
Authorization: Bearer {{access_token}}
```

### List Bundles

**Request:**
```
GET {{gateway_url}}/api/content/bundles
Authorization: Bearer {{access_token}}
```

### Get Reports

**Request:**
```
GET {{gateway_url}}/api/content/reports/aggregate
Authorization: Bearer {{access_token}}
```

---

## 🔄 Service-Sync (Sync Management)

### Get Sync Status

**Request:**
```
GET {{gateway_url}}/api/sync/status
Authorization: Bearer {{access_token}}
```

### List Devices

**Request:**
```
GET {{gateway_url}}/api/sync/devices
Authorization: Bearer {{access_token}}
```

### Push Data

**Request:**
```
POST {{gateway_url}}/api/sync/push
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
  "deviceId": "device-123",
  "data": {}
}
```

### Pull Data

**Request:**
```
GET {{gateway_url}}/api/sync/pull
Authorization: Bearer {{access_token}}
```

---

## ❌ Error Testing

Collection bao gồm folder **"9. Error Test Cases"** để test các trường hợp lỗi:

### 401 - Missing Token
```
GET {{gateway_url}}/api/auth/me
(No Authorization header)
```

**Expected:** `401 Unauthorized`
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing authorization token"
  }
}
```

### 401 - Invalid Token
```
GET {{gateway_url}}/api/auth/me
Authorization: Bearer invalid_token_12345
```

**Expected:** `401 Unauthorized`
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid token"
  }
}
```

### 404 - User Not Found
```
GET {{gateway_url}}/api/users/non-existent-id
Authorization: Bearer {{access_token}}
```

**Expected:** `404 Not Found`
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

### 400 - Validation Error
```
POST {{gateway_url}}/api/auth/register
Content-Type: application/json

{
  "email": "invalid-email",
  "password": "short"
}
```

**Expected:** `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 8 characters"
    }
  }
}
```

---

## 🔄 Automated Testing with Collection Runner

### Run Full Test Suite

1. Click **Collection** (VERVEAI - Microservices API)
2. Click **▶ Run**
3. Select requests to run (hoặc chọn tất cả)
4. Click **Run VERVEAI - Microservices API**

### Recommended Test Order

1. **0. Gateway Health** - Verify Gateway is running
2. **1. Service-Auth** - Complete auth flow (Register → Login → Session → Me)
3. **2. Service-BKT** - Test BKT endpoints
4. **3. Service-Class** - Test class management
5. **4. Service-Content** - Test content management
6. **5. Service-Sync** - Test sync operations
7. **9. Error Test Cases** - Verify error handling

---

## 📝 Tips & Best Practices

### 1. Always Test via Gateway

```
✅ CORRECT: {{gateway_url}}/api/auth/login
❌ WRONG: {{auth_url}}/api/auth/login (only for debug)
```

Gateway handles:
- JWT verification
- Rate limiting
- CORS
- Request routing
- Logging

### 2. Token Management

- **Access Token:** Expires in 1 day (configurable)
- **Refresh Token:** Expires in 7 days (configurable)
- Use **Refresh Token** endpoint when access token expires

### 3. Check Variables

Before running requests, verify variables are set:
```
Collection Variables:
- gateway_url: http://localhost:8080 ✅
- access_token: eyJhbGci... ✅
- user_id: 550e8400-... ✅
```

### 4. Debug Tips

If request fails:

1. **Check service is running:**
   ```bash
   curl http://localhost:8080/health
   curl http://localhost:3001/health
   ```

2. **Check Gateway logs:**
   ```bash
   tail -f service/gateway/logs/gateway.log | jq .
   ```

3. **Check service logs:**
   ```bash
   tail -f service/service-auth/logs/auth.log | jq .
   ```

4. **Verify token:**
   - Copy `access_token` from Postman
   - Decode at [jwt.io](https://jwt.io)
   - Check expiry (`exp` field)

---

## 🐛 Common Issues

### Issue: "connect ECONNREFUSED"

**Cause:** Service not running

**Solution:**
```bash
# Check if service is running
lsof -i :8080  # Gateway
lsof -i :3001  # Auth
lsof -i :3002  # BKT
lsof -i :3003  # Class
lsof -i :3004  # Content
lsof -i :3005  # Sync

# Start service
cd service/service-auth
npm run dev
```

### Issue: "401 Unauthorized"

**Cause:** Token expired or missing

**Solution:**
1. Run **Login** request again
2. Verify `access_token` variable is set
3. Check token expiry at jwt.io

### Issue: "404 Not Found"

**Cause:** Wrong endpoint URL

**Solution:**
- Verify `gateway_url` is `http://localhost:8080`
- Check endpoint path matches API documentation

### Issue: "500 Internal Server Error"

**Cause:** Database not running or migration not applied

**Solution:**
```bash
# Check PostgreSQL
docker ps | grep postgres

# Run migrations
cd service/service-auth
npx prisma migrate dev
```

---

## 📚 Resources

- **Quick Start:** [docs/03-development/QUICKSTART.md](../../docs/03-development/QUICKSTART.md)
- **Backend README:** [service/README.md](./README.md)
- **API Documentation:** Gateway exposes all endpoints
- **Architecture:** [docs/02-architecture/adr/0004-microservices-architecture.md](../../docs/02-architecture/adr/0004-microservices-architecture.md)

---

## 🎯 Next Steps

1. **Import Collection:** `service/postman_collection.json`
2. **Start Services:** Follow [QUICKSTART.md](../../docs/03-development/QUICKSTART.md)
3. **Run Health Checks:** Verify all services are running
4. **Complete Auth Flow:** Register → Login → Get User
5. **Test Other Services:** BKT, Class, Content, Sync
6. **Test Error Cases:** Verify error handling

---

**Happy Testing! 🚀**
