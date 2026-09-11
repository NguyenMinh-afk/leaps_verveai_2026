# 🎓 VERVEAI — Diagnostic Assessment Engine (Flutter/Dart)

> **Bộ chẩn đoán kiến thức thích ứng, 100% offline, một mã nguồn Android + Windows**

Bộ chẩn đoán kiến thức cho môi trường băng thông hẹp (trường vùng sâu, vùng xa). Kết hợp Bayesian Knowledge Tracing (BKT) với phân cụm nguyên nhân gốc. Đồng bộ qua **hub cục bộ** (HTTP nội bộ + mDNS) hoặc **USB dự phòng**. Tuân thủ FERPA / GDPR / PDPD Việt Nam.

- **Phiên bản:** 1.4 (theo BA v1.4 — Phụ lục F/G)
- **Trạng thái:** ADR-0001/0002/0003 đã chốt khung; nhánh `inference/` (LLM cục bộ) đang **[A] "chọn tạm cho pilot"**, chờ Bài kiểm A & B.

---

## 📑 Mục lục

1. [Cách chạy services](#1-cách-chạy-services) — App Flutter offline + Content pipeline + Research
2. [Cách triển khai logic](#2-cách-triển-khai-logic) — BKT, 3 lớp AI, code skeleton cho mỗi engine
3. [Kết nối & đồng bộ](#3-kết-nối--đồng-bộ) — Hub cục bộ, USB, eventId UUIDv7
4. [Phụ lục](#4-phụ-lục) — Tech stack, cấu trúc thư mục, mã yêu cầu, tài liệu liên quan

---

## 1. Cách chạy services

> **⚠️ QUAN TRỌNG:** Đọc [Quick Start Guide](./docs/03-development/QUICKSTART.md) để setup đầy đủ từ đầu.

### 1.1 Yêu cầu hệ thống

| Tool | Phiên bản | Cài đặt |
|---|---|---|
| **Node.js** | ≥ 20.x | [nodejs.org](https://nodejs.org) |
| **PostgreSQL** | ≥ 15.x | [postgresql.org](https://www.postgresql.org/download/) |
| **npm/pnpm** | ≥ 10.x / ≥ 9.x | `npm install -g pnpm` |
| **Docker** | ≥ 24.x | [docker.com](https://www.docker.com/) (cho Consul, Jaeger, Prometheus) |
| Flutter SDK | ≥ 3.22 | [flutter.dev](https://flutter.dev) (ưu tiên sau) |
| Dart | ≥ 3.4 | (đi kèm Flutter) |
| Python | 3.11.x | [pyenv](https://github.com/pyenv/pyenv) (ưu tiên sau) |
| Android SDK | API 34 | (qua Android Studio) (ưu tiên sau) |
| Visual Studio | 2022 | (để build Windows EXE) (ưu tiên sau) |

### 1.2 Chạy lần đầu - Backend Services (ƯU TIÊN)

> **📖 Hướng dẫn chi tiết:** [docs/03-development/QUICKSTART.md](./docs/03-development/QUICKSTART.md)

#### A. Clone/Download project

```bash
git clone <repo-url> leaps_verveai_2026
cd leaps_verveai_2026
```

#### B. Setup PostgreSQL Database

```bash
# Option 1: PostgreSQL local (port 5433 để tránh conflict)
psql -U postgres -c "CREATE DATABASE verveai_db;"
psql -U postgres -c "CREATE USER verveai_user WITH PASSWORD 'verveai_password_2026';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE verveai_db TO verveai_user;"

# Option 2: Docker
docker run -d \
  --name verveai-postgres \
  -e POSTGRES_DB=verveai_db \
  -e POSTGRES_USER=verveai_user \
  -e POSTGRES_PASSWORD=verveai_password_2026 \
  -p 5433:5432 \
  postgres:15
```

#### C. Install Dependencies cho Backend Services

```bash
# Install dependencies cho 5 services + gateway
cd service/service-auth && npm install && cd ../..
cd service/service-bkt && npm install && cd ../..
cd service/service-class && npm install && cd ../..
cd service/service-content && npm install && cd ../..
cd service/service-sync && npm install && cd ../..
cd service/gateway && npm install && cd ../..
```

#### D. Configure Environment Variables

```bash
# Copy .env.example cho từng service
cd service/service-auth && cp .env.example .env && cd ../..
cd service/service-bkt && cp .env.example .env && cd ../..
cd service/service-class && cp .env.example .env && cd ../..
cd service/service-content && cp .env.example .env && cd ../..
cd service/service-sync && cp .env.example .env && cd ../..
cd service/gateway && cp .env.example .env && cd ../..

# Update DATABASE_URL trong mỗi .env file
# Thay đổi port từ 5432 → 5433 nếu dùng port custom
```

#### E. Run Database Migrations

```bash
# Migrate từng service
cd service/service-auth && npx prisma migrate dev && npx prisma generate && cd ../..
cd service/service-bkt && npx prisma migrate dev && npx prisma generate && cd ../..
cd service/service-class && npx prisma migrate dev && npx prisma generate && cd ../..
cd service/service-content && npx prisma migrate dev && npx prisma generate && cd ../..
cd service/service-sync && npx prisma migrate dev && npx prisma generate && cd ../..
```

#### F. Seed Database (Optional)

```bash
cd service/service-auth
npm run seed  # Tạo user test: test@example.com / password
cd ../..
```

#### G. Start Docker Services (Consul, Jaeger, Prometheus - Optional)

```bash
# Start infrastructure services
docker compose up -d

# Verify
docker ps
# → consul, jaeger, prometheus đang chạy
```

#### H. Start All Backend Services

```bash
# Terminal 1: Gateway
cd service/gateway && npm run dev

# Terminal 2: Service-Auth
cd service/service-auth && npm run dev

# Terminal 3: Service-BKT
cd service/service-bkt && npm run dev

# Terminal 4: Service-Class
cd service/service-class && npm run dev

# Terminal 5: Service-Content
cd service/service-content && npm run dev

# Terminal 6: Service-Sync
cd service/service-sync && npm run dev
```

#### I. Verify Backend Setup

```bash
# Check Gateway
curl http://localhost:8080/health

# Check Services via Gateway
curl http://localhost:8080/api/auth/health
curl http://localhost:8080/api/bkt/health
curl http://localhost:8080/api/class/health
curl http://localhost:8080/api/content/health
curl http://localhost:8080/api/sync/health

# All should return: {"status":"ok","service":"svc-xxx"}
```

#### J. Test API với Postman

1. Import collection: `service/postman_collection.json`
2. Đọc hướng dẫn: `service/POSTMAN_GUIDE.md`
3. Test flow: Register → Login → Get User

---

### 1.2.1 Frontend & Flutter (Ưu tiên sau Backend)

> **⚠️ Chỉ setup sau khi Backend đã chạy ổn định**

#### Web-portal (Next.js)

```bash
# Tạo Next.js app (nếu chưa có)
npx create-next-app@latest web-portal \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git \
  --use-pnpm

cd web-portal
pnpm install
pnpm dev  # → http://localhost:3000
```

#### Flutter App (Ưu tiên sau)

```bash
# Tạo Flutter project (nếu chưa có)
flutter create --org com.ioes --project-name verveai_app app
cd app && flutter pub get && cd ..

# Chạy Flutter app
cd app && flutter run -d <device-id>
```

#### Python Research (Ưu tiên sau)

```bash
# Tạo virtual environment
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# hoặc: .venv\Scripts\activate  # Windows

cd research
pip install -e .
pytest  # Run tests
```

---

### 1.3 Chạy Backend Services (Production-ready)

> **📖 Xem thêm:** [service/README.md](./service/README.md) và [service/POSTMAN_GUIDE.md](./service/POSTMAN_GUIDE.md)

#### Start All Services

```bash
# Option 1: Manual start (6 terminals)
# Terminal 1: Gateway
cd service/gateway && npm run dev

# Terminal 2: Service-Auth
cd service/service-auth && npm run dev

# Terminal 3: Service-BKT
cd service/service-bkt && npm run dev

# Terminal 4: Service-Class
cd service/service-class && npm run dev

# Terminal 5: Service-Content
cd service/service-content && npm run dev

# Terminal 6: Service-Sync
cd service/service-sync && npm run dev

# Option 2: Using scripts (recommended)
./scripts/dev-start-all.sh
```

#### Verify Services

```bash
# Gateway
curl http://localhost:8080/health

# Services via Gateway
curl http://localhost:8080/api/auth/health
curl http://localhost:8080/api/bkt/health
curl http://localhost:8080/api/class/health
curl http://localhost:8080/api/content/health
curl http://localhost:8080/api/sync/health
```

#### Test with Postman

```bash
# 1. Import collection
# File: service/postman_collection.json

# 2. Follow guide
# Read: service/POSTMAN_GUIDE.md

# 3. Test flow
# Register → Login → Get User → Test APIs
```

#### Service Ports

| Service | Port | Status |
|---------|------|--------|
| Gateway | 8080 | ✅ Running |
| Service-Auth | 3001 | ✅ Running |
| Service-BKT | 3002 | ✅ Running |
| Service-Class | 3003 | ✅ Running |
| Service-Content | 3004 | ✅ Running |
| Service-Sync | 3005 | ✅ Running |
| PostgreSQL | 5433 | ✅ Running |

#### Infrastructure Services (Optional)

```bash
# Start with Docker Compose
docker compose up -d

# Services included:
# - Consul (Service Discovery) → http://localhost:8500
# - Jaeger (Tracing) → http://localhost:16686
# - Prometheus (Metrics) → http://localhost:9090
# - Grafana (Dashboard) → http://localhost:3000
```

---

### 1.4 Chạy web-portal (Next.js - ưu tiên sau Backend)

```bash
cd web-portal

# Development
pnpm dev
# → http://localhost:3000

# Build production
pnpm build
pnpm start

# Lint + typecheck
pnpm lint
pnpm typecheck
```

---

### 1.5 Chạy app Flutter (ưu tiên sau Backend + web-portal)

```bash
# Android thiết bị thật (TS-17)
cd app && flutter run -d <device-id>

# Windows desktop (TS-18)
cd app && flutter run -d windows

# Hot reload: nhấn 'r' trong terminal
```

### 1.6 Build app release (Flutter)

```bash
# Android APK release (TS-17)
cd app && flutter build apk --release
# Output: app/build/app/outputs/flutter-apk/app-release.apk

# Windows EXE độc lập (TS-18)
cd app && flutter build windows --release
# Output: app/build/windows/runner/Release/verveai_app.exe

# Cài APK lên thiết bị
adb install app/build/app/outputs/flutter-apk/app-release.apk
```

### 1.7 Chạy content pipeline (TypeScript - online, trước khi release)

```bash
cd content-pipeline

# Lint + typecheck
pnpm typecheck
pnpm lint

# Build content bundle + ký Ed25519
pnpm build:bundle      # src/export/buildContentBundle.ts
pnpm sign:bundle       # src/export/signBundle.ts → ra .sig

# Bundle sau khi ký → copy vào USB để bootstrap vào app
```

### 1.8 Chạy research (Python - ưu tiên sau)

```bash
cd research
pip install -e .

# Bài kiểm A: chất lượng trích xuất evidence (30 bài làm thật)
python -m research.model_eval.test_a_extraction_quality

# Bài kiểm B: hiệu năng thiết bị (thời gian, RAM, pin)
python -m research.model_eval.test_b_device_performance

# Kappa analysis giữa các GV chấm
python -m research.expert_agreement.kappa_analysis

# Test tất cả
pytest tests/ --tb=short
```

---

### 1.9 Common commands - Backend Services

```bash
# Backend Services
cd service/service-auth && npm run dev          # Start auth service
cd service/service-bkt && npm run dev           # Start BKT service
cd service/service-class && npm run dev         # Start class service
cd service/service-content && npm run dev       # Start content service
cd service/service-sync && npm run dev          # Start sync service
cd service/gateway && npm run dev               # Start API gateway

# Tests
cd service/service-auth && npm run test         # Unit tests
cd service/service-auth && npm run test:integration  # Integration tests
cd service/service-auth && npm run test:cov     # Coverage

# Database
cd service/service-auth && npx prisma migrate dev    # Run migrations
cd service/service-auth && npx prisma generate       # Generate client
cd service/service-auth && npx prisma studio         # Open Prisma Studio

# Build
cd service/service-auth && npm run build        # Build for production
cd service/service-auth && npm run start        # Run production build

# Logs
tail -f service/gateway/logs/gateway.log | jq .
tail -f service/service-auth/logs/auth.log | jq .
```

### 1.10 Common commands - Frontend & Flutter

```bash
# Web-portal (Next.js)
cd web-portal && pnpm dev                      # Start dev server
cd web-portal && pnpm build                    # Build production
cd web-portal && pnpm lint                     # Lint
cd web-portal && pnpm typecheck                # TypeScript check
cd web-portal && pnpm test                     # Run tests

# Flutter App
cd app && flutter analyze                      # Lint + typecheck Dart
cd app && flutter test                         # Unit tests (engine/, ...)
cd app && flutter test integration_test/       # E2E trên thiết bị thật
cd app && flutter build apk --release          # Build Android APK
cd app && flutter build windows --release      # Build Windows EXE

# Content pipeline
cd content-pipeline && pnpm test               # Unit tests
cd content-pipeline && pnpm lint               # Lint
cd content-pipeline && pnpm typecheck          # TypeScript check

# Research
cd research && pytest                          # All tests
cd research && pytest --cov                    # With coverage
```

### 1.11 Verify mọi thứ OK - Backend Focus

```bash
# Backend services running
curl http://localhost:8080/health              # Gateway
curl http://localhost:8080/api/auth/health     # Service-Auth
curl http://localhost:8080/api/bkt/health      # Service-BKT
curl http://localhost:8080/api/class/health    # Service-Class
curl http://localhost:8080/api/content/health  # Service-Content
curl http://localhost:8080/api/sync/health     # Service-Sync

# Database connection
psql -h localhost -p 5433 -U verveai_user -d verveai_db -c "\dn"
# → Should show: auth, bkt, class, content, sync schemas

# Test API flow with Postman
# Import: service/postman_collection.json
# Follow: service/POSTMAN_GUIDE.md

# Infrastructure (if using Docker)
curl http://localhost:8500/v1/agent/services  # Consul
curl http://localhost:16686                    # Jaeger UI
curl http://localhost:9090                     # Prometheus UI
```

### 1.12 Verify mọi thứ OK - Full Stack (ưu tiên sau)

```bash
# Flutter App analyze sạch (ưu tiên sau)
cd app && flutter analyze
# → "No issues found!"

# Unit tests pass (trừ 3 test BKT/logLikelihood có lỗi logic test từ trước)
cd app && flutter test

# Content bundle đã ký
ls -la content-pipeline/dist/*.sig

# Research chạy được
cd research && pytest tests/ --collect-only

# Web-portal running
curl http://localhost:3000  # Next.js dev server
```

---

## 2. Cách triển khai logic

### 2.1 Kiến trúc 3 lớp AI (BẮT BUỘC)

> Chi tiết: ADR-0003.

```
┌──────────────────────────────────────────────┐
│ Lớp 3 — Diễn đạt (inference/expression/*)   │
│   • Fill template giáo viên (BR-13)          │
│   • fact_check_guard (AIR-24)                │
│   • explain_to_teacher                       │
├──────────────────────────────────────────────┤
│ Lớp 2 — Tổng hợp & Quyết định (engine/*)   │
│   • BKT mastery (TS-07) — TẤT ĐỊNH          │
│   • Cluster nguyên nhân (BR-07/08)           │
│   • Diagnose: hypothesis, abstain, language  │
│   • KHÔNG phụ thuộc LLM                      │
├──────────────────────────────────────────────┤
│ Lớp 1 — Trích xuất (inference/extraction/*) │
│   • extract_evidence (GBNF)                  │
│   • Epxression_schema                        │
└──────────────────────────────────────────────┘
```

**Quy tắc:**
- Lớp 2 chạy được khi không có Lớp 1 & 3 (deterministic, Dart thuần).
- Lớp 3 LUÔN đi qua `fact_check_guard` trước khi xuất.
- Đang ở **[A]** — chờ Bài kiểm A & B (Bảng F.5).

### 2.2 Flow triển khai 1 engine (ví dụ: Language Barrier Detector)

**Bước 1: Định nghĩa data class (immutable, `const`)**

```dart
// lib/engine/diagnose/language_barrier_detector.dart

class AttemptSignal {
  final bool correct;
  final double itemDifficulty;     // 0.0 (rất dễ) .. 1.0 (rất khó)
  final double wordingComplexity;  // 0.0 (đơn giản) .. 1.0 (phức tạp)
  final int latencyMs;

  const AttemptSignal({
    required this.correct,
    required this.itemDifficulty,
    required this.wordingComplexity,
    required this.latencyMs,
  });
}
```

**Bước 2: Implement engine (tất định, không phụ thuộc Flutter)**

```dart
class LanguageBarrierDetector {
  static const int kWindowSize = 5;
  static const double kFlagThreshold = 0.6;
  const LanguageBarrierDetector();

  LanguageBarrierVerdict detect(List<AttemptSignal> recentAttempts) {
    // Logic tất định — KHÔNG Random, DateTime.now(), processId
    // ...
    return LanguageBarrierVerdict(
      probability: clamped,
      shouldFlag: clamped >= kFlagThreshold,
      reason: reason,
    );
  }
}
```

**Bước 3: Viết unit test (deterministic, idempotent)**

```dart
// test/unit/engine/diagnose/language_barrier_detector_test.dart
void main() {
  test('TẤT ĐỊNH — cùng input luôn ra cùng verdict', () {
    const det = LanguageBarrierDetector();
    const input = [
      AttemptSignal(correct: false, itemDifficulty: 0.6, wordingComplexity: 0.8, latencyMs: 1500),
      AttemptSignal(correct: true,  itemDifficulty: 0.4, wordingComplexity: 0.2, latencyMs: 1500),
    ];
    final v1 = det.detect(input);
    final v2 = det.detect(input);
    expect(v1.probability, v2.probability);
    expect(v1.shouldFlag,  v2.shouldFlag);
    expect(v1.reason,      v2.reason);
  });
}
```

### 2.3 Template áp dụng cho engine mới

```bash
# 1. Copy skeleton từ engine đã có
cp lib/engine/diagnose/language_barrier_detector.dart lib/engine/<ten_engine>.dart
cp test/unit/engine/diagnose/language_barrier_detector_test.dart test/unit/engine/<ten_engine>_test.dart

# 2. Đổi tên class + tham số:
#    - class LanguageBarrierDetector → class <TenEngine>
#    - const <TenEngine>();
#    - Ký tự đầu của mỗi tham số là `final double` + `const` constructor

# 3. Tuân thủ rule tất định:
#    - KHÔNG Random, DateTime.now(), processId
#    - Tham số là `const` ở compile time
#    - Cùng input → cùng output

# 4. Viết test idempotent + deterministic trước khi implement
```

### 2.4 Triển khai UI (sau khi engine xong)

> ⚠️ **Bài kiểm mỏng nhất (F.7) — BẮT BUỘC TRƯỚC UI.** Dựng Flutter + `llama.cpp` + 1 model 4-bit, đọc 1 bài làm mẫu → xuất evidence. Đo thời gian, RAM đỉnh, pin. Nếu không chạy được → **đừng code UI**.

```dart
// lib/ui/teacher/intervention_dashboard.dart
import 'package:flutter/material.dart';

class InterventionDashboard extends StatelessWidget {
  const InterventionDashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bảng can thiệp')),
      body: Center(
        child: Text('VERVEAI — sẵn sàng code UI'),
      ),
    );
  }
}
```

### 2.5 Triển khai storage (TS-05)

```dart
// lib/storage/db.dart
import 'package:sqflite/sqflite.dart';
import 'package:sqflite_common_ffi/sqflite_ffi.dart';

Future<Database> open({required String path}) async {
  // Mobile: dùng sqflite
  // Desktop (Windows): dùng sqflite_common_ffi
  if (Platform.isWindows || Platform.isLinux || Platform.isMacOS) {
    sqfliteFfiInit();
    databaseFactory = databaseFactoryFfi;
  }
  return openDatabase(path, version: 1, onCreate: (db, _) async {
    await db.execute('''
      CREATE TABLE evidence (
        eventId TEXT PRIMARY KEY,
        studentId TEXT NOT NULL,
        itemId TEXT NOT NULL,
        response INTEGER NOT NULL,
        latencyMs INTEGER NOT NULL,
        contextMode TEXT NOT NULL,
        confidenceWeight REAL NOT NULL,
        logicalTimestamp TEXT NOT NULL,
        deviceId TEXT NOT NULL,
        sessionId TEXT NOT NULL,
        syncStatus TEXT NOT NULL DEFAULT 'pending'
      )
    ''');
  });
}
```

### 2.6 Coding rules áp dụng

| Quy tắc | Chi tiết |
|---|---|
| Branch | `feature/PROJ-123-short-desc` |
| Commit | `feat(engine): add language barrier detector` (Conventional Commits) |
| Package | Dart `package:verveai_app/<layer>/<...>` |
| Lint | `flutter_lints` + custom rules trong `analysis_options.yaml` (strict-casts, strict-inference, avoid_dynamic_calls, avoid_print) |
| Secrets | KHÔNG hardcode URL/credentials — load từ `dotenv` qua `.env` (KHÔNG commit) |
| Coverage | ≥ 80% cho engine/ — 100% cho TS-07 (BKT), BR-01 (decision) |
| Tests | `TẤT ĐỊNH — ...` cho idempotency tests |
| Tất định | Engine KHÔNG dùng `Random`, `DateTime.now()`, `processId` — dùng logical_clock |
| Append-only | Evidence không bao giờ update/delete — chỉ thêm event mới (DR-11) |
| Idempotent | Cùng input → cùng output (TS-07) |

---

## 3. Kết nối & đồng bộ

### 3.1 Communication patterns

> Chi tiết: ADR-0002.

| Pattern | Khi nào dùng | Công cụ |
|---|---|---|
| **Hub HTTP (chính)** | Nhiều thiết bị HS cùng phòng, lớp học | mDNS + HTTP nội bộ, mã 6 số / QR |
| **USB archive (bắt buộc)** | Trường hợp không có WiFi, phân phối nội dung + model | Archive mã hoá (libsodium) |
| **QR pairing** | Ghép nối 1-1 giáo viên ↔ thiết bị HS | mobile_scanner + qr_flutter |
| **❌ Cloud sync** | KHÔNG BAO GIỜ — vi phạm TS-01 (offline-first) | — |
| **❌ Random eventId** | KHÔNG BAO GIỜ — phải UUIDv7 timestamp-sortable (DR-11) | — |

### 3.2 Luồng tổng quan

```
┌─────────────┐     mDNS + mã 6 số / QR      ┌──────────────┐
│ Thiết bị HS │ ◄──────────────────────────► │  GV (Hub)    │
│ (Flutter)   │                                │  HTTP server  │
│             │   ┌──────────────────────┐     │  (port 8080) │
│  engine/    │   │   Lớp 2 (Dart thuần) │     │              │
│  storage/   │   │   BKT + cluster       │     │  hub/        │
│  privacy/   │   │   deterministic       │     │  discovery   │
│  auth/      │   └──────────────────────┘     │  merge       │
│  ui/        │                                │  crypto      │
└──────┬──────┘                                └──────┬───────┘
       │                                              │
       │  USB archive mã hoá (TS-11)                  │
       │  (model + content + evidence backup)          │
       ▼                                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       USB drive                             │
│   • model.gguf (TS-02)     — Gemma 2B 4-bit (Bài kiểm A/B)│
│   • content-bundle.zip     — knowledge-graph + item-bank   │
│   • evidence-archive.enc   — evidence từ thiết bị HS       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │  review-console (React/Vite, online)
                              │  → upload evidence cho GV xem lại
                              ▼
                    ┌──────────────────────┐
                    │ review-console/      │
                    │ (browser, port 5173) │
                    └──────────────────────┘
```

### 3.3 Evidence flow chi tiết

#### Flow 1: Học sinh trả lời câu hỏi

```
1. HS chọn đáp án trên app Flutter
   └─► engine/evidence/record_attempt.dart: EvidenceRecorder.record(...)
       ├─► Sinh eventId UUIDv7 (timestamp-sortable, DR-11)
       ├─► Lấy logicalTimestamp từ hub/logical_clock (KHÔNG DateTime.now())
       ├─► confidenceWeight theo contextMode (BR-16)
       └─► Storage: storage/event_log.dart → INSERT append-only

2. Background sync qua hub (mỗi 5 phút hoặc manual)
   └─► sync/sync_strategy_resolver.dart: chọn SC-05 (WiFi) hoặc SC-06 (USB)
       └─► Hub server nhận event POST /api/evidence
           ├─► Validate Ed25519 signature (content_security)
           ├─► Merge append-only (hub/merge.dart)
           └─► Trả về synced eventIds cho HS
```

#### Flow 2: Giáo viên xem bảng can thiệp

```
1. GV mở app Flutter → ui/teacher/intervention_dashboard.dart
   └─► Đọc evidence từ local DB (storage/event_log.dart)
       └─► Lớp 2 engine chạy:
           ├─► BKT: tính pKnown cho mỗi (HS, skill)
           ├─► Cluster: phân cụm theo root cause (BR-07/08)
           ├─► Diagnose: phát hiện language barrier (FR-25), abstention (FR-12)
           └─► Sort: BR-08 (size giảm dần → severity giảm dần → alphabet)

2. GV in báo cáo → ui/teacher/printable_report.dart (TS-12)
   └─► Xuất PDF trực tiếp trong Flutter (không qua server)
```

#### Flow 3: Chuyển lớp / chuyển trường (FR-26)

```
1. GV chọn "Chuyển lớp cho HS X" trên app
   └─► engine/transfer/student_transfer.dart
       ├─► Sinh transferId (UUIDv7)
       ├─► Lấy logicalTimestamp từ hub/logical_clock
       └─► Tạo TransferredEvidence cho từng evidence cũ (append-only)

2. USB archive: archive mã hoá toàn bộ (sync/file_exchange.ts → archive:^3.6.1)
   └─► Chuyển sang trường mới → import → evidence giữ nguyên eventId
       → KHÔNG xung đột khi merge (UUIDv7 uniqueness)
```

### 3.4 Idempotency & event schema (BẮT BUỘC)

Mọi evidence event PHẢI tuân theo schema:

```dart
class EvidenceEvent {
  final String eventId;          // UUIDv7 — KHÔNG random()
  final String studentId;
  final String itemId;
  final int response;            // 0 sai, 1 đúng
  final int latencyMs;
  final ContextMode contextMode; // in-class | out-of-class
  final double confidenceWeight; // theo BR-16
  final String logicalTimestamp; // BR-17, DR-10 — KHÔNG DateTime ISO
  final String deviceId;
  final String sessionId;
  final String syncStatus;       // pending | synced | conflict
}
```

**Idempotency rules:**
1. **eventId là UUIDv7** — uniqueness constraint trên `evidence.eventId`
2. **Append-only** — KHÔNG update/delete evidence (DR-11, BR-09)
3. **Trùng eventId ≠ payload** → cờ `conflict`, KHÔNG ghi đè, dùng chú thích GV (BR-17)
4. **Logical timestamp** — vector clock lai Lamport, KHÔNG `DateTime.now()` (thiết bị lệch giờ)

### 3.5 Privacy & data ownership

| Rule | Chi tiết |
|---|---|
| **DR-08** | Ẩn danh trước khi export cho research |
| **DR-09** | HS có quyền xóa dữ liệu cá nhân (FR-21) |
| **DR-10** | Timestamp qua logical clock, KHÔNG giờ máy |
| **DR-11** | Evidence append-only |
| **DR-12** | Retention policy (privacy/retention_policy.dart) |
| **NFR-21** | Breach notification flow (privacy/breach_notify.dart) |
| **FERPA / GDPR / PDPD** | Tuân thủ 3 chuẩn — quyền của HS là tối thượng |

### 3.6 Triển khai hub server (SC-05)

```dart
// lib/hub/server.dart
import 'package:http/http.dart' as http;

class HubServer {
  Future<void> start({required String bindHost, required int port}) async {
    final server = await HttpServer.bind(bindHost, port);
    print('Hub listening on $bindHost:$port');

    await for (final req in server) {
      if (req.uri.path == '/api/evidence' && req.method == 'POST') {
        // Validate Ed25519 signature
        // Merge append-only
        // Trả về synced eventIds
      } else if (req.uri.path == '/api/pair' && req.method == 'POST') {
        // Ghép nối 1-1 bằng mã 6 số / QR
      }
    }
  }
}
```

### 3.7 Triển khai USB sync (SC-06)

```dart
// lib/sync/file_exchange.dart
import 'package:archive/archive_io.dart';

class FileExchange {
  Future<void> exportToUsb({
    required String usbMountPoint,
    required List<String> eventIds,
  }) async {
    // 1. Đọc evidence từ local DB
    // 2. Tạo archive (archive:^3.6.1)
    // 3. Mã hoá bằng libsodium (TS-10)
    // 4. Ghi ra USB
  }

  Future<void> importFromUsb({required String usbMountPoint}) async {
    // 1. Đọc archive từ USB
    // 2. Giải mã
    // 3. Merge append-only vào local DB (KHÔNG đè — eventId UUIDv7 unique)
  }
}
```

---

## 4. Phụ lục

### 4.1 Tech stack

| Layer | Technology |
|---|---|
| App framework | Flutter ≥ 3.22, Dart ≥ 3.4, Material 3 |
| Storage | SQLite (sqflite + sqflite_common_ffi), append-only |
| Engine | Dart thuần, tất định (TS-07) |
| Mã hoá kênh | libsodium (cryptography_flutter) — TS-10 |
| Chữ ký nội dung | Ed25519 (pointycastle) |
| Đồ thị tri thức | JSON versioned — TS-06 |
| FFI LLM | llama.cpp — TS-02 |
| Model | Gemma 4B → 2B → 1B 4-bit GGUF (TS-03, AS-61) — chờ Bài kiểm A & B |
| GBNF | grammar-constrained decoding — TS-04 |
| Mạng nội bộ | HTTP + mDNS — TS-08 |
| Ghép nối | Mã 6 số / QR — TS-09 |
| File exchange | archive mã hoá — TS-11 |
| Xuất PDF | Trực tiếp trong Flutter — TS-12 |
| Phân phối Android | APK cài trực tiếp — TS-17 |
| Phân phối Windows | EXE độc lập — TS-18 |
| Phân phối nội dung + model | USB bắt buộc — TS-19, TS-20 |
| Content pipeline | TypeScript, Node ≥ 20, vitest, ESLint |
| Research | Python ≥ 3.11, pytest, scipy, sklearn |
| Review console | React 18 + TypeScript + Vite |
| CI/CD | GitHub Actions (analyze, test, build APK/EXE) |

### 4.2 Cấu trúc thư mục

```
verveai/
├── docs/                                  # 📚 Tài liệu (xem docs/README.md)
│   ├── 01-business/                        # BA v1.4, PMP, structure
│   ├── 02-architecture/                    # ADRs + system + ai + sync + privacy
│   ├── 03-development/                     # coding-standards, git, testing
│   ├── 04-operations/                      # usb-distribution, integrity, runbook
│   ├── 05-research/                        # Bài kiểm A & B, kappa, BKT validation
│   └── 06-user/                            # teacher/student/admin guide + FAQ
│
├── app/                                   # 📱 Flutter — CHẠY 100% OFFLINE
│   ├── pubspec.yaml
│   ├── lib/
│   │   ├── engine/                        # Lớp 2: Tất định, Dart thuần
│   │   │   ├── evidence/                  # DR-11, BR-16
│   │   │   ├── mastery/bkt.dart           # TS-07
│   │   │   ├── diagnose/                  # FR-25, FR-12/13, BR-01
│   │   │   ├── item_selection/            # FR-01→FR-05, FR-24
│   │   │   ├── remediation/               # FR-14→FR-17
│   │   │   ├── grouping/                  # BR-07, BR-08
│   │   │   ├── knowledge_graph/           # TS-06
│   │   │   ├── versioning/                # DR-07
│   │   │   └── transfer/student_transfer.dart  # FR-26
│   │   │
│   │   ├── inference/                     # Lớp 1 & 3: Mô hình ngôn ngữ cục bộ
│   │   │   ├── ffi/llama_bindings.dart    # TS-02
│   │   │   ├── model_manager.dart         # TS-03, AS-61
│   │   │   ├── grammar/                   # TS-04: GBNF
│   │   │   ├── extraction/extract_evidence.dart  # AIR-25
│   │   │   └── expression/                # BR-13, AIR-24
│   │   │
│   │   ├── content/v1/{knowledge-graph.json, item-bank.json}
│   │   ├── bootstrap/                     # AS-28: Nạp qua USB (TS-19)
│   │   ├── storage/                       # TS-05: SQLite, append-only
│   │   ├── hub/                           # SC-05: "điểm trung tâm cục bộ"
│   │   ├── sync/                          # SC-06: USB dự phòng
│   │   ├── privacy/                       # DR-08, FR-21, DR-12, NFR-21
│   │   ├── content_security/              # Ed25519
│   │   ├── auth/profile_gate.dart         # FR-22
│   │   └── ui/{student, teacher, admin, shared}/
│   │
│   └── test/{unit/, acceptance/, e2e/}
│
├── content-pipeline/                      # 🌐 Online (TS-19, FR-20)
│   └── src/
│       ├── authoring/generate_variants.ts
│       ├── auto-verify/check_answer_correctness.ts
│       ├── age-appropriateness/           # NFR-23
│       ├── review/review_queue.ts
│       └── export/{buildContentBundle.ts, signBundle.ts}
│
├── review-console/                        # React/Vite (SC-04, FR-20, SN-SC-03)
│
├── research/                              # 🐍 Python
│   ├── expert_agreement/kappa_analysis.py
│   ├── simulation/self_consistency_check.py
│   ├── model-eval/                        # Bài kiểm A & B (Bảng F.5)
│   │   ├── test_a_extraction_quality.py
│   │   └── test_b_device_performance.py
│   └── reproducibility/export_for_independent_review.py
│
├── database/                               # Schema cho web services (online)
├── infra/                                  # Terraform / Docker cho online services
├── scripts/                                # DevOps scripts
├── .github/workflows/                       # CI/CD (xem .github/workflows/README.md)
├── package.json                            # pnpm workspace root
├── pnpm-workspace.yaml
└── README.md
```

### 4.3 Common debugging commands

```bash
# App Flutter
cd app && flutter clean
cd app && flutter pub get
cd app && flutter analyze
cd app && flutter test
cd app && flutter run -v                   # verbose logs

# Xem evidence trong DB
adb -s <device> shell run-as com.ioes.verveai sqlite3 databases/verveai.db "SELECT * FROM evidence LIMIT 10"

# Xem log realtime trên thiết bị Android
adb logcat | grep -i verveai

# USB debugging
adb devices
adb logcat -d | grep -i "flutter\|verveai"

# Content pipeline debug
cd content-pipeline && tsx src/export/buildContentBundle.ts --verbose

# Research debug
cd research && python -m pdb -m research.model_eval.test_a_extraction_quality
```

### 4.4 Đặc tính chính

| Đặc tính | Yêu cầu | Trạng thái |
|---|---|---|
| Chọn câu hỏi thích ứng | FR-01 → FR-05 | Đang làm |
| BKT mastery | FR-06 → FR-11 | Đang làm |
| Phân cụm nguyên nhân | FR-12, FR-13 | Đang làm |
| Kèm bài | FR-14 → FR-17 | Đang làm |
| Offline 100% | AS-01 → AS-12 | Đang làm |
| Bootstrap cài qua USB | AS-28 | Đang làm |
| Sync hub (SC-05) + USB (SC-06) | SC-05, SC-06 | Đang làm |
| Bảo mật dữ liệu | BR-01 → BR-20 | Đang làm |
| LLM cục bộ | TS-02/03/04 | **[A]** chờ Bài kiểm A & B |
| Phát hiện rào cản ngôn ngữ | FR-25 | Mới (G.9) |
| Chuyển lớp/trường | FR-26 | Mới (G.9) |

### 4.5 Tài liệu liên quan

| Tài liệu | Mục đích |
|---|---|
| [docs/01-business/BA_DOCUMENT_VERVEAI_v1_4.docx](./docs/01-business/BA_DOCUMENT_VERVEAI_v1_4.docx) | **BA v1.4** — Phụ lục F/G |
| [docs/VERVEAI.md](./docs/VERVEAI.md) | Wiki tổng hợp |
| [docs/02-architecture/](./docs/02-architecture/) | ADRs + system + ai + sync + privacy |
| [docs/03-development/git-workflow.md](./docs/03-development/git-workflow.md) | GitFlow + Conventional Commits |
| [docs/06-user/admin-guide.md](./docs/06-user/admin-guide.md) | Hướng dẫn cho admin |
| [app/README.md](./app/README.md) | App Flutter chi tiết |
| [.github/workflows/README.md](./.github/workflows/README.md) | CI/CD workflows |
| [research/README.md](./research/README.md) | Research scripts + Bài kiểm A/B |

### 4.6 Useful adb commands (Android device)

```bash
# Cài APK
adb install app/build/app/outputs/flutter-apk/app-release.apk

# Xem logs realtime
adb logcat -s flutter:V

# Inspect DB
adb shell run-as com.ioes.verveai ls databases/

# Gỡ cài đặt
adb uninstall com.ioes.verveai

# Chuyển file vào thiết bị (cho bootstrap USB)
adb push model.gguf /sdcard/verveai/
```

---

## 📄 License

Proprietary © 2026 Team Verve Core. All rights reserved.

---

## 📚 Documentation Quick Links

### Quick Start & Setup
- **[Quick Start Guide](./docs/03-development/QUICKSTART.md)** — Setup từ đầu đến chạy
- **[Backend README](./service/README.md)** — Microservices overview
- **[Postman Testing Guide](./service/POSTMAN_GUIDE.md)** — Test API với Postman

### Architecture
- **[Microservices Architecture](./docs/02-architecture/adr/0004-microservices-architecture.md)** — 5 services + Gateway
- **[Service Discovery (Consul)](./docs/02-architecture/adr/0005-service-discovery.md)** — Service registry
- **[API Gateway](./docs/02-architecture/adr/0006-api-gateway.md)** — Express Gateway
- **[System Overview](./docs/02-architecture/system-overview.md)** — Tổng quan hệ thống
- **[Web Portal Architecture](./docs/02-architecture/web-portal-architecture.md)** — Next.js architecture

### Development
- **[API Documentation](./docs/03-development/API.md)** — All endpoints
- **[Testing Strategy](./docs/03-development/testing-strategy.md)** — Unit, integration, E2E
- **[Git Workflow](./docs/03-development/git-workflow.md)** — Branching, commits, PRs

### Business & Planning
- **[BA Document v1.4](./docs/01-business/BA_DOCUMENT_VERVEAI_v1_4.docx)** — Business requirements
- **[Project Structure](./docs/01-business/PROJECT_STRUCTURE.md)** — Folder structure
- **[Project Rules](./docs/01-business/PROJECT_RULES.md)** — Development rules

---

## 🔗 API Endpoints Overview

> **⚠️ All API calls must go through Gateway:** `http://localhost:8080/api/*`

### Authentication (Service-Auth - Port 3001)
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/auth/me` — Get current user
- `GET /api/auth/session` — Check session validity
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Logout
- `GET /api/users` — List users (admin)
- `GET /api/users/:id` — Get user by ID
- `PUT /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user (admin)

### BKT & Diagnosis (Service-BKT - Port 3002)
- `GET /api/bkt/skills` — List skills
- `GET /api/bkt/skills/tree` — Get skill tree
- `POST /api/bkt/evidence` — Record student evidence
- `GET /api/bkt/evidence/student/:id` — Get student evidence
- `POST /api/bkt/diagnosis/run` — Run BKT diagnosis
- `GET /api/bkt/diagnosis/student/:id` — Get student diagnosis
- `GET /api/bkt/interventions` — List interventions

### Class Management (Service-Class - Port 3003)
- `GET /api/class/classes` — List classes
- `POST /api/class/classes` — Create class
- `GET /api/class/classes/:id` — Get class by ID
- `GET /api/class/students` — List students
- `GET /api/class/progress/:studentId` — Get student progress

### Content Management (Service-Content - Port 3004)
- `GET /api/content` — List content
- `GET /api/content/:id` — Get content by ID
- `GET /api/content/bundles` — List bundles
- `GET /api/content/reports/aggregate` — Get reports

### Sync Management (Service-Sync - Port 3005)
- `GET /api/sync/status` — Get sync status
- `GET /api/sync/devices` — List devices
- `POST /api/sync/push` — Push data
- `GET /api/sync/pull` — Pull data

**📖 Full API Documentation:** [docs/03-development/API.md](./docs/03-development/API.md)

---

## 🚀 Development Workflow

### Backend Development
```bash
# 1. Start infrastructure (optional)
docker compose up -d

# 2. Start all services
cd service/gateway && npm run dev       # Terminal 1
cd service/service-auth && npm run dev  # Terminal 2
cd service/service-bkt && npm run dev   # Terminal 3
cd service/service-class && npm run dev # Terminal 4
cd service/service-content && npm run dev # Terminal 5
cd service/service-sync && npm run dev  # Terminal 6

# 3. Test with Postman
# Import: service/postman_collection.json
# Follow: service/POSTMAN_GUIDE.md

# 4. Make changes
# Files auto-reload with nodemon

# 5. Run tests
cd service/service-auth && npm test

# 6. Check coverage
cd service/service-auth && npm run test:cov

# 7. Commit
git add .
git commit -m "feat(svc-auth): add new feature"
git push
```

### Frontend Development (ưu tiên sau)
```bash
# 1. Start web-portal
cd web-portal && pnpm dev

# 2. Make changes
# Files auto-reload with Next.js HMR

# 3. Test
pnpm test

# 4. Commit
git add .
git commit -m "feat(web-portal): add dashboard"
git push
```

---

## 📊 Project Status

### ✅ Completed (Backend Focus - Phase 2)
- [x] 5 Microservices architecture
- [x] API Gateway với Express
- [x] Service-Auth: Authentication & Users
- [x] Service-BKT: Basic structure
- [x] Service-Class: Basic structure
- [x] Service-Content: Basic structure
- [x] Service-Sync: Basic structure
- [x] PostgreSQL với 5 schema riêng biệt
- [x] Prisma ORM integration
- [x] Environment configuration
- [x] Health check endpoints
- [x] Postman collection
- [x] Documentation

### 🚧 In Progress
- [ ] Service Discovery với Consul (optional)
- [ ] Circuit Breaker với opossum
- [ ] Distributed Tracing với Jaeger
- [ ] Metrics với Prometheus
- [ ] Complete BKT implementation
- [ ] Complete Class management
- [ ] Complete Content management
- [ ] Complete Sync logic
- [ ] Integration tests
- [ ] E2E tests

### 📋 Planned (Phase 3+)
- [ ] Web-portal (Next.js) integration
- [ ] Flutter app integration
- [ ] Content pipeline
- [ ] Research scripts
- [ ] Full test coverage (80%+)
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## LEAPS — Local Educational Adaptive Personalization System

*Tên mã nguồn: VerveAI · App: Verve*

<div align="center">

**Made with ❤️ by Team Verve Core**

</div>
