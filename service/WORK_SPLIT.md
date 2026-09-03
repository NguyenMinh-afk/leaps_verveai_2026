# LEAPS (VerveAI) — Phân Chia Backend

> **Phiên bản:** 1.1  
> **Ngày:** 09/09/2026  
> **Phạm vi:** 5 Service Backend — FE do user tự làm

---

## 📦 CẤU TRÚC

```
leaps_verveai_2026/
├── service-auth/       # Dev 1: Auth + Users
├── service-bkt/        # Dev 2: BKT Engine + Diagnosis + Evidence + Interventions
├── service-class/      # Dev 3: Classes + Students + Progress
├── service-content/    # Dev 1: Content + Reports + Bundles
└── service-sync/       # Dev 3: Sync + Devices
```

---

## 👥 PHÂN CÔNG 3 DEV

| Dev | Services | Port |
|-----|----------|------|
| **Dev 1** | `service-auth` + `service-content` | 3001 + 3004 |
| **Dev 2** | `service-bkt` | 3002 |
| **Dev 3** | `service-class` + `service-sync` | 3003 + 3005 |

---

## 🔧 DEV 1: service-auth (Port 3001)

### Cấu trúc
```
service-auth/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── routes/
│   │   ├── auth.ts          # /api/auth/*
│   │   └── users.ts         # /api/users/*
│   ├── middleware/
│   │   └── auth.ts          # JWT verify
│   ├── services/
│   │   └── authService.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

### Routes
```
POST   /api/auth/login          # Login → JWT
POST   /api/auth/logout         # Logout
GET    /api/auth/session        # Get current user
GET    /api/auth/me             # Get profile

GET    /api/users               # List users (admin)
POST   /api/users              # Create user
GET    /api/users/:id           # Get user
PUT    /api/users/:id           # Update user
DELETE /api/users/:id           # Delete user
```

### Prisma Schema
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(TEACHER)
  schoolId  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  TEACHER
  SUPERVISOR
}
```

---

## 🔧 DEV 1: service-content (Port 3004)

### Cấu trúc
```
service-content/
├── src/
│   ├── routes/
│   │   ├── content.ts         # /api/content/*
│   │   ├── bundles.ts         # /api/bundles/*
│   │   ├── review.ts          # /api/review/*
│   │   └── reports.ts         # /api/reports/*
│   ├── services/
│   │   ├── contentService.ts
│   │   ├── bundleBuilder.ts
│   │   └── reportGenerator.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

### Routes
```
# Content
GET    /api/content                    # List content
POST   /api/content                    # Create content
GET    /api/content/:id               # Get content
PUT    /api/content/:id                # Update content
DELETE /api/content/:id                # Delete content

# Bundles
GET    /api/bundles                    # List bundles
GET    /api/bundles/:id                # Get bundle
POST   /api/bundles/build              # Build bundle
POST   /api/bundles/:id/sign           # Sign bundle (Ed25519)
POST   /api/bundles/:id/publish        # Publish bundle

# Review
GET    /api/review                     # Review queue
POST   /api/review/:id/approve         # Approve content
POST   /api/review/:id/reject          # Reject content
GET    /api/review/stats               # Review stats

# Reports
GET    /api/reports/aggregate          # Anonymous aggregate
GET    /api/reports/class/:id          # Class report
GET    /api/reports/student/:id        # Student report
GET    /api/reports/export/:type        # Export (pdf/csv)
```

### Prisma Schema
```prisma
model Content {
  id          String   @id @default(uuid())
  type        ContentType
  title       String
  body        String
  metadata    Json     @default("{}")
  status      ContentStatus @default(DRAFT)
  authorId    String
  gradeLevel  Int
  chapter     String
  topic       String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum ContentType {
  QUESTION
  EXPLANATION
  SCENARIO
}

enum ContentStatus {
  DRAFT
  PENDING_REVIEW
  APPROVED
  REJECTED
  PUBLISHED
}

model Bundle {
  id          String   @id @default(uuid())
  name        String
  version     String
  contentIds  String[]
  signature   String?
  status      String   @default("draft")
  createdAt   DateTime @default(now())
  publishedAt DateTime?
}

model ReviewRequest {
  id          String   @id @default(uuid())
  contentId   String
  reviewerId  String?
  status      String   @default("pending")
  comment     String?
  createdAt   DateTime @default(now())
}
```

---

## 🔧 DEV 2: service-bkt (Port 3002)

### Cấu trúc
```
service-bkt/
├── src/
│   ├── routes/
│   │   ├── diagnosis.ts        # /api/diagnosis/*
│   │   ├── evidence.ts        # /api/evidence/*
│   │   ├── interventions.ts   # /api/interventions/*
│   │   └── skills.ts          # /api/skills/*
│   ├── services/
│   │   ├── bkt.ts             # Bayesian Knowledge Tracing
│   │   ├── diagnose.ts         # Root cause analysis
│   │   ├── itemSelection.ts    # Next best item
│   │   ├── evidenceChain.ts   # Reasoning chain
│   │   └── interventionBuilder.ts
│   ├── models/
│   │   └── bktTypes.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

### Routes
```
# Diagnosis
POST   /api/diagnosis/run           # Run BKT diagnosis
POST   /api/diagnosis/batch         # Batch diagnosis
GET    /api/diagnosis/student/:id   # Student diagnosis history
GET    /api/diagnosis/class/:id      # Class diagnosis overview

# Evidence
POST   /api/evidence                 # Record attempt
GET    /api/evidence/:id             # Get evidence
GET    /api/evidence/:id/chain       # Get reasoning chain
GET    /api/evidence/student/:id     # Student evidence list

# Interventions
GET    /api/interventions                   # List all intervention groups
GET    /api/interventions/class/:id         # Class interventions
GET    /api/interventions/:id               # Intervention detail
PUT    /api/interventions/:id               # Update intervention
PUT    /api/interventions/:id/override      # Teacher override
POST   /api/interventions/:id/note          # Add teacher note
POST   /api/interventions/:id/resolve       # Mark resolved

# Skills
GET    /api/skills                          # List all skills
GET    /api/skills/:id                     # Skill detail
GET    /api/skills/tree                    # Knowledge graph tree
GET    /api/skills/:id/prerequisites       # Prerequisites
```

### Prisma Schema
```prisma
model Skill {
  id            String   @id @default(uuid())
  code          String   @unique
  name          String
  description   String?
  gradeLevel    Int
  chapter       String
  topic         String
  prerequisites String[]
  items         Item[]
  createdAt     DateTime @default(now())
}

model Item {
  id          String   @id @default(uuid())
  skillId     String
  skill       Skill    @relation(fields: [skillId], references: [id])
  content     String
  answer      Json
  difficulty  Float
  createdAt   DateTime @default(now())
}

model EvidenceEvent {
  id          String   @id @default(uuid())
  studentId   String
  itemId      String
  response    Int
  latencyMs   Int
  context     Json     @default("{}")
  timestamp   DateTime @default(now())
  syncedFrom  String?
}

model Diagnosis {
  id          String   @id @default(uuid())
  studentId   String
  skillId     String
  pKnown      Float
  rootCause   String?
  confidence  Float
  abstain     Boolean  @default(false)
  evidenceIds String[]
  createdAt   DateTime @default(now())
}

model InterventionGroup {
  id            String   @id @default(uuid())
  classId       String
  skillId       String
  rootCause     String
  studentIds    String[]
  severity      Severity @default(MEDIUM)
  status        InterventionStatus @default(PENDING)
  teacherNotes  Json     @default("[]")
  resolvedAt    DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Severity {
  HIGH
  MEDIUM
  LOW
}

enum InterventionStatus {
  PENDING
  IN_PROGRESS
  RESOLVED
  OVERRIDDEN
}
```

### BKT Algorithm (TypeScript)
```typescript
// BKT Parameters
interface BKTParams {
  pL0: number;      // Initial pKnown (0.3 default)
  pT: number;        // Guess probability (0.25 for 4-choice)
  pG: number;        // Slip probability (0.1 default)
  pS: number;        // Learn probability (per attempt)
}

// Update pKnown
function bktUpdate(pKnown: number, correct: boolean, params: BKTParams): number {
  const { pT, pG } = params;
  
  if (correct) {
    // P(Know|Correct) = P(Know) * (1-PG) / [P(Know)*(1-PG) + (1-P(Know))*PT]
    return (pKnown * (1 - pG)) / (pKnown * (1 - pG) + (1 - pKnown) * pT);
  } else {
    // P(Know|Incorrect) = P(Know) * PG / [P(Know)*PG + (1-P(Know))*(1-PT)]
    return (pKnown * pG) / (pKnown * pG + (1 - pKnown) * (1 - pT));
  }
}
```

---

## 🔧 DEV 3: service-class (Port 3003)

### Cấu trúc
```
service-class/
├── src/
│   ├── routes/
│   │   ├── classes.ts          # /api/classes/*
│   │   ├── students.ts         # /api/students/*
│   │   └── progress.ts         # /api/progress/*
│   ├── services/
│   │   ├── classService.ts
│   │   ├── studentService.ts
│   │   └── progressTracker.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

### Routes
```
# Classes
GET    /api/classes                      # List teacher's classes
POST   /api/classes                      # Create class
GET    /api/classes/:id                  # Class detail
PUT    /api/classes/:id                  # Update class
DELETE /api/classes/:id                  # Delete class
GET    /api/classes/:id/stats            # Class statistics

# Students
GET    /api/students/:id                 # Student detail
POST   /api/students                      # Create student
PUT    /api/students/:id                 # Update student
DELETE /api/students/:id                 # Delete student
GET    /api/students/:id/evidence        # Student evidence
GET    /api/students/:id/diagnosis       # Student diagnosis

# Progress
GET    /api/progress/:studentId          # Overall progress
GET    /api/progress/:studentId/history  # pKnown history
GET    /api/progress/:studentId/skills   # Skills breakdown
```

### Prisma Schema
```prisma
model Class {
  id         String    @id @default(uuid())
  name       String
  code       String    @unique
  teacherId  String
  grade      Int
  subject    String    @default("math")
  students   Student[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model Student {
  id          String    @id @default(uuid())
  code        String    @unique
  name        String
  classId     String
  class       Class     @relation(fields: [classId], references: [id])
  pKnown      Json      @default("{}")
  lastActive  DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model ProgressHistory {
  id          String   @id @default(uuid())
  studentId   String
  skillId     String
  pKnown      Float
  eventId     String
  timestamp   DateTime @default(now())
}
```

---

## 🔧 DEV 3: service-sync (Port 3005)

### Cấu trúc
```
service-sync/
├── src/
│   ├── routes/
│   │   ├── sync.ts              # /api/sync/*
│   │   └── devices.ts           # /api/devices/*
│   ├── services/
│   │   ├── syncService.ts
│   │   ├── deviceService.ts
│   │   └── conflictResolver.ts
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

### Routes
```
# Sync
GET    /api/sync/status                  # Overall sync status
POST   /api/sync/push                     # Receive evidence from app
GET    /api/sync/pull                     # Send bundle to app
GET    /api/sync/pull/:since              # Delta sync since timestamp
POST   /api/sync/resolve                  # Resolve conflicts

# Devices
GET    /api/devices                       # List devices
GET    /api/devices/:id                   # Device detail
PUT    /api/devices/:id                   # Update device
DELETE /api/devices/:id                   # Remove device
GET    /api/devices/:id/logs              # Device logs
```

### Prisma Schema
```prisma
model Device {
  id            String   @id @default(uuid())
  code          String   @unique
  type          DeviceType
  schoolId      String
  lastSeen      DateTime
  status        String   @default("online")
  syncLog       Json     @default("[]")
  createdAt     DateTime @default(now())
}

enum DeviceType {
  TEACHER_TABLET
  STUDENT_TABLET
  HUB
}

model SyncLog {
  id          String   @id @default(uuid())
  deviceId    String
  direction   String
  records     Int
  status      String
  errorMsg    String?
  timestamp   DateTime @default(now())
}

model SyncConflict {
  id          String   @id @default(uuid())
  deviceId    String
  recordType  String
  recordId    String
  localData   Json
  serverData  Json
  resolved    Boolean  @default(false)
  resolvedAt  DateTime?
  createdAt   DateTime @default(now())
}
```

---

## 🚀 THỨ TỰ THỰC HIỆN

### **Tuần 1: Foundation**
```
Dev 1: service-auth — Setup + Auth + Users CRUD
Dev 2: service-bkt — Setup + BKT algorithm
Dev 3: service-class — Setup + Classes + Students CRUD
```

### **Tuần 2: Core Logic**
```
Dev 1: service-auth — Done, help others
Dev 2: service-bkt — Diagnosis + Evidence + Interventions
Dev 3: service-class — Progress tracking
```

### **Tuần 3: Integration**
```
Dev 1: service-content — Content + Reports
Dev 2: service-bkt — Done, help Dev 3
Dev 3: service-sync — Sync + Devices
```

### **Tuần 4: Connect all**
```
Dev 1: service-content — Bundles + Review
Dev 2: Bug fixes + optimization
Dev 3: Sync integration + testing
```

---

## 📊 DATABASE (Shared PostgreSQL)

```
Dev 1 setup PostgreSQL, run migrations
All services connect to same DB with different schemas or tables
```

---

## 🔗 INTER-SERVICE COMMUNICATION

```
service-auth → service-bkt: Verify token
service-auth → service-class: Get teacher classes
service-bkt → service-class: Get student data
service-class → service-sync: Receive evidence
service-content → service-sync: Publish bundles
```

---

## 📋 API SUMMARY

```
Auth (3001):
  POST /api/auth/login, logout, session, me
  GET/POST/PUT/DELETE /api/users

Content (3004):
  GET/POST/PUT/DELETE /api/content
  GET/POST /api/bundles
  GET/POST /api/review
  GET /api/reports/*

BKT (3002):
  POST /api/diagnosis/run, batch
  GET /api/diagnosis/student/:id, class/:id
  POST/GET /api/evidence
  GET/PUT /api/interventions
  GET /api/skills

Class (3003):
  GET/POST/PUT/DELETE /api/classes
  GET/POST/PUT/DELETE /api/students
  GET /api/progress/:studentId

Sync (3005):
  GET /api/sync/status
  POST /api/sync/push
  GET /api/sync/pull
  GET/PUT/DELETE /api/devices
```
