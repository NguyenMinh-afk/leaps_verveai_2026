# Service Exam - VERVE AI Exam Management Service

## Overview

The Exam Service (`svc-exam`) is a microservice responsible for managing exams and exam attempts in the VERVE AI learning platform. It handles the full lifecycle of exams from creation to completion, including question management, attempt tracking, and submission handling.

## Architecture

- **Port**: 3007
- **Database**: PostgreSQL with multi-schema support (`exam` schema)
- **Framework**: Express.js with TypeScript
- **Validation**: Zod for request validation
- **Error Handling**: Custom domain errors with `@verveai/error-types`

## Data Models

### Exam
Represents an exam that students can take.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| assignment_id | UUID (optional) | Link to assignment if exam is part of assignment |
| title | String | Exam title |
| description | String (optional) | Exam description |
| teacher_id | UUID | Owning teacher's ID |
| status | Enum | DRAFT, PUBLISHED, ARCHIVED |
| time_limit_minutes | Int (optional) | Time limit for the exam |
| max_score | Float | Maximum possible score (default: 100) |
| passing_score | Float | Score needed to pass (default: 60) |
| shuffle_questions | Boolean | Whether to shuffle questions |
| show_results_immediately | Boolean | Show results after submission |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |
| deleted_at | DateTime (optional) | Soft delete timestamp |

### ExamQuestion
Junction table linking exams to questions (references external question IDs).

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| exam_id | UUID | Reference to exam |
| question_id | UUID | Reference to content.question |
| points | Float | Points for this question |
| order_index | Int | Display order |

### ExamAttempt
Represents a student's attempt at an exam.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| exam_id | UUID | Reference to exam |
| student_id | UUID | Student's ID |
| status | Enum | NOT_STARTED, IN_PROGRESS, SUBMITTED, GRADED |
| started_at | DateTime (optional) | When attempt started |
| submitted_at | DateTime (optional) | When attempt was submitted |
| score | Float (optional) | Final score |
| max_score | Float (optional) | Maximum possible score |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

### ExamAnswer
Stores student's answers for each question in an attempt.

| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Primary key |
| attempt_id | UUID | Reference to attempt |
| question_id | UUID | Reference to question |
| answer | String (optional) | Student's text answer |
| selected_options | String[] (optional) | Selected options for multiple choice |
| is_correct | Boolean (optional) | Correctness (null until graded) |
| points_earned | Float (optional) | Points earned |
| answered_at | DateTime (optional) | When answered |

## API Endpoints

### Exam Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/exam` | List exams (with filters) |
| POST | `/api/exam` | Create new exam |
| GET | `/api/exam/:id` | Get exam details |
| PUT | `/api/exam/:id` | Update exam |
| DELETE | `/api/exam/:id` | Soft delete exam |
| GET | `/api/exam/:id/questions` | Get exam questions |
| GET | `/api/exam/:id/attempts` | List attempts for exam (teacher) |

### Student Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/exam/student` | List available exams |
| POST | `/api/exam/:id/start` | Start exam attempt |
| GET | `/api/exam/student/attempts` | Get student's attempts |
| GET | `/api/exam/attempt/:attemptId` | Get attempt details |
| POST | `/api/exam/attempt/:attemptId/submit` | Submit attempt |

### Health Check

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service health status |
| GET | `/health/ready` | Readiness check |

## Request/Response Examples

### Create Exam

```bash
POST /api/exam
Content-Type: application/json
x-user-id: teacher-uuid

{
  "title": "Midterm Exam",
  "description": "Comprehensive midterm test",
  "questionIds": ["question-uuid-1", "question-uuid-2"],
  "timeLimitMinutes": 60,
  "maxScore": 100,
  "passingScore": 60,
  "shuffleQuestions": false,
  "showResultsImmediately": true
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": "exam-uuid",
    "title": "Midterm Exam",
    "status": "DRAFT",
    "questions": [
      { "id": "...", "questionId": "question-uuid-1", "points": 1, "orderIndex": 0 },
      { "id": "...", "questionId": "question-uuid-2", "points": 1, "orderIndex": 1 }
    ]
  }
}
```

### Start Attempt

```bash
POST /api/exam/exam-uuid/start
Content-Type: application/json
x-user-id: student-uuid

{
  "examId": "exam-uuid"
}
```

### Submit Attempt

```bash
POST /api/exam/attempt/attempt-uuid/submit
Content-Type: application/json
x-user-id: student-uuid

{
  "attemptId": "attempt-uuid",
  "answers": [
    { "questionId": "question-uuid-1", "answer": "Student's answer" },
    { "questionId": "question-uuid-2", "selectedOptions": ["option-1", "option-2"] }
  ]
}
```

## Attempt Lifecycle

```
NOT_STARTED → IN_PROGRESS → SUBMITTED → GRADED
```

1. **NOT_STARTED**: Initial state when attempt is created
2. **IN_PROGRESS**: Student has started the exam
3. **SUBMITTED**: Student has submitted all answers
4. **GRADED**: Instructor has graded the exam

## Authorization

- **Teachers**: Can create, update, delete, and view exams they own
- **Students**: Can view available exams, start/submit attempts, view their own attempts
- **Admins**: Full access to all exams and attempts

## Integration Points

### With Assignment Service
Exams can optionally be linked to assignments via `assignment_id`:
- When an exam is linked, students access it through the assignment
- Assignment service will add `exam_id` field to Assignment model

### With Content Service
Questions are referenced by external question IDs from `service-content`:
- Exam only stores question IDs, not question data
- Actual question content is fetched from content service when needed

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_FAILED | 400 | Request validation failed |
| NOT_FOUND | 404 | Resource not found |
| FORBIDDEN_NOT_OWNER | 403 | Not authorized to access resource |
| CONFLICT | 409 | Conflict with existing state |
| INTERNAL | 500 | Internal server error |

## Running the Service

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm db:generate

# Run migrations
pnpm db:migrate

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3007 | Service port |
| DATABASE_URL | - | PostgreSQL connection string |
| CONSUL_HOST | localhost | Consul host for service discovery |
| CONSUL_PORT | 8500 | Consul port |
| LOG_LEVEL | info | Log level (error, warn, info, debug) |

## Database Schema

```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["exam"]
}
```

All models use the `exam` schema in the shared PostgreSQL database.
