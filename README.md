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

### 1.1 Yêu cầu hệ thống

| Tool | Phiên bản | Cài đặt |
|---|---|---|
| Flutter SDK | ≥ 3.22 | [flutter.dev](https://flutter.dev) |
| Dart | ≥ 3.4 | (đi kèm Flutter) |
| Node.js | ≥ 20.x | [nodejs.org](https://nodejs.org) |
| pnpm | ≥ 9.x | `npm install -g pnpm` |
| Python | 3.11.x | [pyenv](https://github.com/pyenv/pyenv) |
| Android SDK | API 34 | (qua Android Studio) |
| Visual Studio | 2022 | (để build Windows EXE) |

### 1.2 Chạy lần đầu

#### A. Clone/Download project

```bash
# Nếu clone từ git
git clone <repo-url> leaps_verveai_2026
cd leaps_verveai_2026

# Nếu download zip → giải nén vào thư mục leaps_verveai_2026
```

#### B. Tạo Flutter app (nếu chưa có thư mục app/)

```bash
# Tạo Flutter project với tên verveai_app
flutter create --org com.ioes --project-name verveai_app app

# Sau đó cài dependencies
cd app && flutter pub get && cd ..
```

#### C. Tạo web-portal (Next.js, nếu chưa có)

```bash
# Tạo Next.js app mới
npx create-next-app@latest web-portal \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git \
  --use-pnpm

# Di chuyển vào workspace
cd web-portal && cd ..
```

#### D. Tạo review-console (React/Vite, nếu chưa có)

```bash
# Tạo React + Vite app
npm create vite@latest review-console -- --template react-ts

# Chuyển sang pnpm
cd review-console
pnpm install
cd ..
```

#### E. Setup Python venv cho research (nếu chưa có)

```bash
# Tạo virtual environment
python -m venv .venv

# Kích hoạt:
# - Windows PowerShell:
. .venv\Scripts\activate
# - Windows CMD:
.venv\Scripts\activate.bat

# Cài dependencies
cd research
pip install -e .
cd ..
```

#### F. Bootstrap nội dung + model qua USB

```bash
# Xem app/lib/bootstrap/first_run_wizard.dart để hiểu luồng bootstrap
# Copy model.gguf và content-bundle vào thư mục app/assets/
```

#### G. Cài tất cả dependencies cho monorepo

```bash
# Cài dependencies cho monorepo (content-pipeline + review-console + research deps)
pnpm install

# Cài dependencies cho Flutter app (đảm bảo đã có app/)
cd app && flutter pub get && cd ..

# Verify tất cả packages
pnpm list --depth 0
```

#### H. Checklist verify setup thành công

```bash
# 1. Kiểm tra Flutter app tồn tại và chạy được
cd app && flutter doctor
# → "✓ Flutter is ready" và "✓ Android toolchain"

# 2. Kiểm tra web-portal tồn tại
ls web-portal/package.json
# → file tồn tại

# 3. Kiểm tra review-console tồn tại
ls review-console/package.json
# → file tồn tại

# 4. Kiểm tra Python venv
ls .venv/Scripts/python.exe  # Windows
# → file tồn tại

# 5. Kiểm tra pnpm workspaces
cat pnpm-workspace.yaml
# → chứa 'app/', 'web-portal/', 'review-console/', 'content-pipeline/'

# 6. Build thử Flutter (không cần thiết bị)
cd app && flutter build web --debug
# → tạo build/web/index.html
cd ..
```

---

### 1.3 Chạy app Flutter (offline dev)

```bash
# Android thiết bị thật (TS-17)
cd app && flutter run -d <device-id>

# Windows desktop (TS-18)
cd app && flutter run -d windows

# Hot reload: nhấn 'r' trong terminal
```

### 1.4 Build app release

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

### 1.5 Chạy content pipeline (online — trước khi release)

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

### 1.6 Chạy research (Python)

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

### 1.7 Chạy web-portal (Next.js)

```bash
cd web-portal

# Development
pnpm dev
# → http://localhost:3000

# Build production
pnpm build

# Preview production build
pnpm start

# Lint + typecheck
pnpm lint
pnpm typecheck

# Chạy tests
pnpm test
```

### 1.8 Chạy review-console (React/Vite)

```bash
cd review-console

# Development
pnpm dev
# → http://localhost:5173

# Build production
pnpm build

# Preview production build
pnpm preview

# Lint
pnpm lint

# Chạy tests
pnpm test
```

### 1.9 Common commands

```bash
# App Flutter
cd app && flutter analyze                  # Lint + typecheck Dart
cd app && flutter test                     # Unit tests (engine/, ...)
cd app && flutter test integration_test/   # E2E trên thiết bị thật

# Content pipeline
pnpm --filter @verveai/content-pipeline test

# Research
cd research && pytest

# Web-portal (Next.js)
cd web-portal && pnpm lint
cd web-portal && pnpm typecheck

# Review-console (React/Vite)
cd review-console && pnpm lint

# Tất cả (từ root)
pnpm app:test          # cd app && flutter test
pnpm app:e2e           # cd app && flutter test integration_test
pnpm app:build:android # cd app && flutter build apk --release
pnpm app:build:windows # cd app && flutter build windows --release
pnpm web:test          # cd web-portal && pnpm test
pnpm review:test       # cd review-console && pnpm test
pnpm research:test     # cd research && pytest
pnpm lint              # pnpm -r lint
pnpm typecheck         # pnpm -r typecheck
```

### 1.10 Verify mọi thứ OK

```bash
# App analyze sạch
cd app && flutter analyze
# → "No issues found!"

# Unit tests pass (trừ 3 test BKT/logLikelihood có lỗi logic test từ trước)
cd app && flutter test

# Content bundle đã ký
ls -la content-pipeline/dist/*.sig

# Research chạy được
cd research && pytest tests/ --collect-only
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

## LEAPS — Local Educational Adaptive Personalization System

*Tên mã nguồn: VerveAI · App: Verve*

<div align="center">

**Made with ❤️ by Team Verve Core**

</div>
