# VERVEAI Assignment Service

The Assignment service handles teacher-created learning tasks in the VERVE AI platform.

## Overview

The Assignment service provides CRUD operations for managing assignments that teachers create for their classes. Assignments can be in DRAFT, PUBLISHED, or ARCHIVED status.

## Service Details

- **Service Name**: `svc-assignment`
- **Port**: 3006
- **Database Schema**: `assignment`
- **Prisma Model**: `Assignment`

## API Endpoints

### Health Check

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| GET | `/health` | Service health check | No |
| GET | `/health/ready` | Readiness check | No |

### Assignment Management

| Method | Path | Description | Auth Required | Roles |
|--------|------|-------------|---------------|-------|
| GET | `/api/assignment` | List assignments | Yes | TEACHER, ADMIN |
| POST | `/api/assignment` | Create assignment | Yes | TEACHER |
| GET | `/api/assignment/:id` | Get assignment | Yes | TEACHER, ADMIN, STUDENT |
| PUT | `/api/assignment/:id` | Update assignment | Yes | TEACHER (owner), ADMIN |
| DELETE | `/api/assignment/:id` | Delete assignment | Yes | TEACHER (owner), ADMIN |
| GET | `/api/assignment/student` | List student's assignments | Yes | STUDENT |

## Authentication

All API endpoints (except health) require JWT authentication via the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

The gateway injects the following headers for authorization:

- `x-user-id`: The authenticated user's ID
- `x-user-role`: The authenticated user's role (TEACHER, STUDENT, ADMIN)

## Request/Response Formats

### Create Assignment

**Request:**
```json
POST /api/assignment
{
  "title": "Chapter 5 Review",
  "description": "Complete all exercises from Chapter 5",
  "classId": "550e8400-e29b-41d4-a716-446655440000",
  "startsAt": "2026-09-15T09:00:00Z",
  "dueAt": "2026-09-22T23:59:59Z",
  "maxAttempts": 3
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Chapter 5 Review",
    "description": "Complete all exercises from Chapter 5",
    "teacherId": "teacher-123",
    "classId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "DRAFT",
    "dueAt": "2026-09-22T23:59:59.000Z",
    "startsAt": "2026-09-15T09:00:00.000Z",
    "maxAttempts": 3,
    "createdAt": "2026-09-14T01:20:00.000Z",
    "updatedAt": "2026-09-14T01:20:00.000Z"
  }
}
```

### Update Assignment

**Request:**
```json
PUT /api/assignment/:id
{
  "title": "Updated Title",
  "status": "PUBLISHED"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Updated Title",
    "status": "PUBLISHED",
    ...
  }
}
```

### List Assignments

**Request:**
```
GET /api/assignment?skip=0&take=20&classId=<uuid>&status=PUBLISHED
```

**Query Parameters:**
- `skip`: Number of records to skip (default: 0)
- `take`: Number of records to take (default: 20, max: 100)
- `teacherId`: Filter by teacher ID (admin only)
- `classId`: Filter by class ID
- `status`: Filter by status (DRAFT, PUBLISHED, ARCHIVED)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "total": 42,
    "skip": 0,
    "take": 20
  }
}
```

### Get Assignment

**Request:**
```
GET /api/assignment/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "title": "Chapter 5 Review",
    ...
  }
}
```

### Delete Assignment

**Request:**
```
DELETE /api/assignment/:id
```

**Response:** `204 No Content`

### Student Assignments

**Request:**
```
GET /api/assignment/student?skip=0&take=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "...",
        "title": "...",
        "status": "PUBLISHED",
        ...
      }
    ],
    "total": 10,
    "skip": 0,
    "take": 20
  }
}
```

## Authorization Rules

| Action | TEACHER | STUDENT | ADMIN |
|--------|---------|---------|-------|
| Create assignment | ✓ (own) | ✗ | ✗ |
| List assignments | ✓ (own) | ✗ | ✓ (all) |
| View assignment | ✓ (own) | ✓ (published) | ✓ (all) |
| Update assignment | ✓ (own) | ✗ | ✓ (all) |
| Delete assignment | ✓ (own) | ✗ | ✓ (all) |
| List student assignments | ✗ | ✓ | ✗ |

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_FAILED | 400 | Request body/params failed validation |
| FORBIDDEN_ROLE | 403 | User role cannot perform this action |
| FORBIDDEN_NOT_OWNER | 403 | User does not own this resource |
| FORBIDDEN_NOT_ENROLLED | 403 | Student not enrolled in class |
| NOT_FOUND | 404 | Assignment not found |
| INTERNAL_ERROR | 500 | Unexpected server error |

## Database Schema

```prisma
model Assignment {
  id          String           @id @default(uuid())
  title       String
  description String?
  teacher_id  String
  class_id    String
  status      AssignmentStatus @default(DRAFT)
  due_at      DateTime?
  starts_at   DateTime?
  max_attempts Int             @default(1)
  created_at  DateTime        @default(now())
  updated_at  DateTime        @updatedAt
  deleted_at  DateTime?

  @@index([teacher_id])
  @@index([class_id])
  @@index([status])
  @@index([deleted_at])
}

enum AssignmentStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

## Development

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pnpm or npm

### Installation

```bash
cd service/service-assignment
pnpm install
```

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate
```

### Running

```bash
# Development mode
pnpm dev

# Production mode
pnpm build
pnpm start
```

### Testing

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Service port | 3006 |
| SERVICE_NAME | Service name | svc-assignment |
| LOG_LEVEL | Log level | info |
| DATABASE_URL | PostgreSQL connection URL | - |
| CONSUL_HOST | Consul host | localhost |
| CONSUL_PORT | Consul port | 8500 |
| OTEL_SERVICE_NAME | OpenTelemetry service name | svc-assignment |
| OTEL_EXPORTER_OTLP_ENDPOINT | OTLP endpoint | - |

## Gateway Configuration

The service is registered in the gateway at `/api/assignment`. The gateway:

1. Validates JWT tokens
2. Injects `x-user-id` and `x-user-role` headers
3. Rate limits requests
4. Proxies to the assignment service

See `service/gateway/config/gateway.config.yml` for configuration.
