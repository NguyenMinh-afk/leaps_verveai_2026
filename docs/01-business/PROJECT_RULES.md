# 📜 PROJECT RULES — LEAPS
# Quy tắc bắt buộc tuân thủ cho toàn bộ team

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản:** 1.4.5
> **Ngày:** 09/09/2026
> **Trạng thái:** 🔴 BẮT BUỘC — Mọi thành viên phải đọc và tuân thủ
> **Owner:** Tech Lead + Project Manager
> **Căn cứ:** BA Document v1.4.5 + WORK_SPLIT.md v1.1

---

## 🚨 NGUYÊN TẮC VÀNG (Golden Rules)

### Rule 1: TUÂN THỦ BA DOCUMENT ĐÃ PHÊ DUYỆT
> **Mọi thứ phải theo đúng tài liệu đã được phê duyệt**

| Tài liệu gốc | Mục đích | Không tự ý |
|--------------|----------|-----------|
| `VerveAI_BA_Document_v1.4.md` | Business logic, requirements, assumptions | Thêm/sửa yêu cầu business |
| `PROJECT_MANAGEMENT_PLAN.md` | Sprint, deadline, phases | Thay đổi scope/timeline |
| `PROJECT_STRUCTURE.md` | Cấu trúc thư mục, module | Tạo thư mục ngoài cấu trúc |
| `PROJECT_RULES.md` | Quy tắc code | Bỏ qua coding standards |

### Rule 2: MỌI THAY ĐỔI KIẾN TRÚC PHẢI CÓ ADR
- Mọi thay đổi kiến trúc **PHẢI** được tạo **ADR** (Architecture Decision Record) trong `docs/02-architecture/adr/`
- Mọi thay đổi **PHẢI** được **Tech Lead review** trước khi code
- Mọi thay đổi breaking **PHẢI** thông báo **PO + PM**

### Rule 3: LUÔN CÓ TEST
- Không PR nào được merge nếu thiếu test
- Coverage tối thiểu **80%** cho engine logic
- Critical paths (auth, storage, sync) **PHẢI** đạt **90%+**

---

## 📂 I. CẤU TRÚC THƯ MỤC — BẮT BUỘC

### 1.1 Monorepo Structure

```
verveai/
├── app/                    # Flutter app — OFFLINE 100% (ưu tiên sau web-portal + service)
│   ├── lib/
│   │   ├── engine/         # Lớp 2 TẤT ĐỊNH — Dart thuần
│   │   ├── inference/      # [A] Lớp 1 & 3 — chờ Bài kiểm A & B
│   │   ├── storage/        # SQLite append-only
│   │   ├── hub/            # SC-05 Hub cục bộ
│   │   ├── sync/          # SC-06 USB exchange
│   │   ├── bootstrap/      # AS-28, TS-19/20
│   │   ├── privacy/        # DR-08, FR-21
│   │   └── ui/            # CO-T-01..09, CO-A-01..05
│   └── test/
│
├── service/                # ⭐ MỚI — Node.js Microservices — Phase 2
│   ├── WORK_SPLIT.md      # ⭐ Canonical — Phân chia 5 microservice
│   ├── shared/            # Code dùng chung
│   ├── service-auth/      # Dev 1 — port 3001
│   ├── service-bkt/       # Dev 2 — port 3002
│   ├── service-class/     # Dev 3 — port 3003
│   ├── service-content/    # Dev 1 — port 3004
│   ├── service-sync/       # Dev 3 — port 3005
│   └── gateway/           # Express Gateway — port 8080
│
├── web-portal/             # Next.js/TypeScript — Web portal cho GV (ƯU TIÊN CAO NHẤT)
│   └── src/
│       ├── app/            # Next.js App Router
│       ├── styles/         # Tailwind + CSS variables
│       ├── lib/api/        # ⭐ API client → Gateway (port 8080)
│       └── middleware.ts   # Auth/routing
│
├── content-pipeline/        # TypeScript — chạy online trước triển khai
│   └── src/
│       ├── authoring/
│       ├── auto-verify/
│       ├── review/         # FR-20, SN-SC-03
│       └── export/         # Ed25519 signed bundles
│
├── research/               # Python — Bài kiểm A & B
│   └── src/research/
│       ├── expert_agreement/
│       ├── simulation/
│       └── model_eval/     # Bảng F.5
│
├── review-console/         # React/TS — rà soát nội dung
│
├── infra/                  # ⭐ docker-compose cho 5 service + Consul + Jaeger
│   ├── docker-compose.yml
│   └── prometheus.yml
│
└── docs/                  # Tài liệu BA, architecture, operations
```

### 1.2 Ưu tiên phát triển

| Ưu tiên | Module | Trạng thái |
|---------|--------|------------|
| **CAO NHẤT** | `web-portal/` | Đang phát triển |
| **CAO** | `service/` ⭐ MỚI | Phase 2 — đang phát triển |
| Pilot | `app/` | Chờ web-portal + service hoàn thành |

### 1.3 Cấm
- ❌ KHÔNG tạo thư mục ngoài cấu trúc trên
- ❌ KHÔNG dùng `backend/` — đã lỗi thời, dùng `service/service-*`
- ❌ KHÔNG tạo file `.ts`/`.tsx` trong `app/lib/`
- ❌ KHÔNG tạo file `.dart` trong `content-pipeline/`, `review-console/`, hoặc `service/`
- ❌ KHÔNG commit `.gguf`, `*.verveai-bundle.zip`, khoá riêng Ed25519
- ❌ KHÔNG hardcode URL service — dùng Consul DNS
- ❌ Backend cloud — LEAPS chạy **100% offline** cho app

---

## 🌿 II. GIT WORKFLOW — BẮT BUỘC

### 2.1 Branch Naming

```bash
# Format: <type>/VP-<id>-<short-desc>

feature/VP-123-add-bkt-mastery      # Feature mới
feature/VP-124-add-svc-auth         # ⭐ Microservice feature
bugfix/VP-456-fix-sync-conflict     # Bug fix
hotfix/VP-789-critical-fix          # Critical fix
refactor/VP-234-cleanup-engine      # Refactor code
docs/VP-345-update-adr             # Documentation / ADR
test/VP-456-add-engine-tests        # Test only
chore/VP-567-update-deps            # Build/tooling
```

❌ **SAI:** `feature/login`, `my-branch`, `fix`, `test-branch`

### 2.2 Commit Message — Conventional Commits

```bash
# Format: <type>(<scope>): <subject>

# web-portal
feat(web-portal): add teacher dashboard

# Microservice
feat(svc-auth): add JWT refresh token
feat(svc-bkt): add BKT diagnosis endpoint
feat(gateway): add JWT verification policy
feat(infra): update docker-compose for 5 services

# Flutter
feat(engine): add BKT mastery tracking
docs(adr): add ADR-0004 microservice architecture
```

**Types:**
| Type | Mục đích |
|------|----------|
| `feat` | Tính năng mới |
| `fix` | Bug fix |
| `docs` | Tài liệu |
| `style` | Format code (không thay đổi logic) |
| `refactor` | Refactor code |
| `perf` | Performance improvement |
| `test` | Thêm/sửa test |
| `chore` | Build, tools, deps |

**Rules:**
- Subject ≤ 72 ký tự
- Không viết hoa chữ cái đầu subject
- Không có dấu chấm cuối subject
- Imperative mood ("add" không phải "added")

### 2.3 Pull Request Rules

```bash
# Mỗi PR PHẢI:
- [ ] Title theo format: [VP-XXX] feat(scope): subject
- [ ] Mô tả đầy đủ (template)
- [ ] Liên kết ticket
- [ ] Tests pass (CI xanh)
- [ ] Lint pass (CI xanh)
- [ ] Coverage không giảm
- [ ] Có ít nhất 1 approval từ reviewer
- [ ] Không có conflict với develop/main
```

---

## 💻 III. CODING STANDARDS

### 3.1 Dart / Flutter (app/)

**Naming:**
```dart
// ✅ Class/Enum - PascalCase
class EvidenceEvent {}
enum DiagnosticStatus { confirmed, uncertain, abstained }

// ✅ File - snake_case
evidence_event.dart
hypothesis_ranking.dart

// ✅ Constant - lowerCamelCase hoặc k prefix
const kMasteryThreshold = 0.85;
final defaultWindowSize = 10;

// ✅ Private - _ prefix
final _internalState = _computeState();
```

**Structure:**
```dart
// ✅ Import order: dart → package → relative
import 'dart:async';
import 'package:flutter/material.dart';
import '../storage/db.dart';
import '../../engine/mastery/bkt.dart';

// ✅ Class structure
class DiagnoseEngine {
  // Constants first
  static const kMinEvidence = 3;
  
  // Fields
  final KnowledgeGraph _graph;
  
  // Constructor
  DiagnoseEngine(this._graph);
  
  // Public methods
  DiagnosisResult diagnose(Evidence evidence) { ... }
  
  // Private methods
  List<Hypothesis> _rankHypotheses(...) { ... }
}
```

**❌ CẤM trong Dart:**
- `var` cho typed field (dùng `final` hoặc explicit type)
- `dynamic` (dùng `Object?` + type guards hoặc specify type)
- `print()` trong code production (dùng logger)
- `TODO` không có ticket reference

### 3.2 TypeScript / Node.js (content-pipeline/)

**Naming:**
```typescript
// ✅ File - camelCase hoặc kebab-case
buildContentBundle.ts
review-queue.ts

// ✅ Class - PascalCase
class ContentAuthor {}
class BundleSigner {}

// ✅ Function/Variable - camelCase
function buildBundle(config: BuildConfig): Bundle { ... }
const outputPath = './dist';
```

**Type Safety:**
```typescript
// ✅ BẮT BUỘC - TypeScript strict
interface ContentBundle {
  readonly version: string;
  readonly skills: ReadonlyArray<Skill>;
  readonly signature: string;
}

// ✅ Error handling
function verifyBundle(bundle: ContentBundle): Result<VerifiedBundle, VerificationError> {
  if (!bundle.signature) {
    return Result.err(VerificationError.missingSignature());
  }
  return Result.ok({ ...bundle, verified: true });
}
```

**❌ Cấm:**
- `any` type
- `console.log` trong production (dùng pino logger)
- Không check null/undefined

### 3.3 Python (research/)

**Naming:**
```python
# ✅ File - snake_case
kappa_analysis.py
self_consistency_check.py

# ✅ Class - PascalCase
class KappaAnalyzer:
    pass

# ✅ Function/Variable - snake_case
def compute_fleiss_kappa(responses: list[list[int]]) -> float:
    agreement_score = 0.85
    return agreement_score

# ✅ Constant - UPPER_SNAKE_CASE
MAX_ITERATIONS = 1000
DEFAULT_THRESHOLD = 0.70
```

**Type hints BẮT BUỘC:**
```python
# ✅ Type hints everywhere
from typing import Optional

def load_pilot_data(path: str) -> list[PilotResult]:
    ...

def compute_metrics(results: list[PilotResult], threshold: float) -> Metrics:
    ...
```

**Testing:**
```python
# ✅ pytest conventions
def test_bkt_update_increases_mastery():
    """BKT mastery should increase after correct answer."""
    bkt = BKTModel()
    new_mastery = bkt.update(CORRECT, prior_mastery=0.5)
    assert new_mastery > 0.5

def test_abstention_when_insufficient_evidence():
    """System should abstain when evidence count < minimum."""
    engine = DiagnoseEngine(min_evidence=3)
    result = engine.diagnose([evidence_1, evidence_2])
    assert result.status == DiagnosticStatus.ABSTAINED
```

---

## 🏗️ IV. ARCHITECTURE RULES

### 4.1 Layer Separation

```
┌─────────────────────────────────────────────────┐
│ UI Layer (app/lib/ui/)                         │
│ - Teacher dashboard (CO-T-01..09)              │
│ - Admin panel (CO-A-01..05)                    │
│ - [CHƯA CODE] Student UI (chờ OS-03)           │
├─────────────────────────────────────────────────┤
│ Engine Layer (app/lib/engine/) — LỚP 2 TẤT ĐỊNH │
│ - mastery/bkt.dart                             │
│ - diagnose/ (FR-01..08)                         │
│ - item_selection/ (FR-06)                      │
│ - grouping/cluster_by_root_cause.dart (BR-07)   │
│ - remediation/ (FR-09..13)                     │
│ - knowledge_graph/ (DR-01, TS-06)               │
├─────────────────────────────────────────────────┤
│ Inference Layer (app/lib/inference/) [A]        │
│ - Lớp 1: extraction/extract_evidence.dart      │
│ - Lớp 3: expression/explain_to_teacher.dart     │
│ - CHỜ Bài kiểm A & B đạt ngưỡng               │
├─────────────────────────────────────────────────┤
│ Storage Layer (app/lib/storage/)                │
│ - SQLite append-only (TS-05)                    │
│ - Event log, audit log                          │
├─────────────────────────────────────────────────┤
│ Hub Layer (app/lib/hub/) — SC-05               │
│ - Local server, mDNS discovery                  │
├─────────────────────────────────────────────────┤
│ Sync Layer (app/lib/sync/) — SC-06             │
│ - USB file exchange                            │
│ - Chunked transfer                             │
└─────────────────────────────────────────────────┘
```

### 4.2 Module Boundaries

| Module | Chỉ được phụ thuộc vào |
|--------|------------------------|
| `engine/` | Dart standard library |
| `inference/` | `engine/` (qua interface) |
| `storage/` | `engine/` |
| `hub/` | `storage/` |
| `ui/` | `engine/`, `storage/`, `hub/` |

❌ **Cấm:** `ui/` gọi trực tiếp `inference/` — phải qua `engine/`

### 4.3 [A] — Assumption标注

Mọi code trong `inference/` **PHẢI** có comment `[A]` kèm assumption ID:

```dart
// [A] AS-61: Model size 4B adequate for offline extraction
class LlamaExtractor implements EvidenceExtractor {
  // ...
}

// [A] AS-48: GBNF grammar covers all valid evidence patterns
class GrammarParser {
  // ...
}
```

---

## 🧪 V. TESTING STANDARDS

### 5.1 Coverage Requirements

| Layer | Minimum Coverage |
|-------|-----------------|
| `engine/mastery/bkt.dart` | **90%** |
| `engine/diagnose/` | **85%** |
| `engine/` (toàn bộ) | **80%** |
| `storage/` | **80%** |
| `hub/` + `sync/` | **85%** |
| `inference/` | **60%** (mock via subclass) |
| `ui/` | **70%** |
| **service/ (per service)** ⭐ MỚI | **80%** |
| **gateway/** ⭐ MỚI | **80%** |
| **shared/ (per package)** ⭐ MỚI | **85-95%** |

### 5.2 Test Structure

```bash
# app/test/
├── unit/
│   ├── engine/
│   │   ├── bkt_test.dart
│   │   ├── hypothesis_ranking_test.dart
│   │   └── abstain_test.dart
│   ├── storage/
│   │   └── event_log_test.dart
│   └── hub/
│       └── logical_clock_test.dart
│
├── acceptance/
│   └── diagnostic_flow_test.dart
│
└── integration/
    └── sync_roundtrip_test.dart
```

### 5.3 Test Naming

```dart
// Dart - group by class, describe behavior
group('BKTModel', () {
  test('should increase mastery after correct answer', () { ... });
  test('should decrease mastery after incorrect answer', () { ... });
  test('should not change when abstaining', () { ... });
});

group('DiagnoseEngine', () {
  test('should return CONFIRMED when evidence exceeds threshold', () { ... });
  test('should return UNCERTAIN when evidence below threshold', () { ... });
  test('should return ABSTAINED when evidence insufficient', () { ... });
});
```

### 5.4 Validation Scripts

```bash
# Research validation
cd research
make test-a    # Bài kiểm A: Fleiss ≥ 0.70, Cohen ≥ 0.60
make test-b    # Bài kiểm B: latency ≤ 2s, RAM ≤ 1.5GB

# Self-consistency check
python -m research.simulation.self_consistency_check
```

---

## 🔐 VI. SECURITY RULES

### 6.1 Secrets Management

```bash
# ❌ CẤM
- Commit .env, credentials.json, *.pem, *.key
- Hardcode password, API key trong code
- Lưu secret trong config file

# ✅ ĐÚNG
- Dùng environment variables lúc runtime
- .env.example chỉ chứa tên biến, không giá trị
- Khoá Ed25519 cho content bundle (xem scripts/build-bundle.sh)
```

### 6.2 Content Verification

- Mọi content bundle phải được ký Ed25519 trước khi deploy
- Verify signature trước khi install: `bundle_verify.dart`
- SHA-256 checksum cho integrity check (NFR-18)

### 6.3 Data Privacy

- Dữ liệu HS phải ẩn danh (DR-08) trước khi đưa vào research
- Export/delete qua admin panel (FR-21, DR-09)
- Audit log bất biến cho mọi thao tác admin (BR-05)

---

## 📦 VII. OFFLINE & SYNC RULES

### 7.1 Offline-First Principle

> **Mọi tính năng phải hoạt động 100% khi không có kết nối**

- App không được crash khi wifi/data unavailable
- Fallback sang USB sync khi hub unavailable (SC-06)
- Queue events khi offline, sync khi available

### 7.2 Sync Strategy

| Tình trạng | Hành vi |
|-----------|---------|
| Hub available | Real-time sync qua mDNS (SC-05) |
| Hub unavailable, USB connected | File exchange (SC-06) |
| USB removed mid-transfer | Resume từ chunk cuối |
| Conflict | Last-write-wins với timestamp |

---

## 🚀 VIII. PHASE GATES

### 8.1 Phase 1 Gate (Bài kiểm mỏng nhất)
- ✅ APK chạy được trên 3 thiết bị thật
- ✅ Đo được: thời gian, RAM, dung lượng, pin
- ✅ Latency p95 ≤ 2s hoặc hạ cỡ model

### 8.2 Phase 2 Gate (Lớp 2 tất định)
- ✅ `engine/` coverage ≥ 80%
- ✅ `bkt.dart` coverage ≥ 90%
- ✅ Self-consistency check pass

### 8.3 Phase 3 Gate (Storage + Hub)
- ✅ SQLite append-only hoạt động
- ✅ Hub sync roundtrip test pass
- ✅ USB exchange test pass

### 8.4 Phase 4 Gate (UI GV + Admin)
- ✅ UI components coverage ≥ 70%
- ✅ Manual test với giáo viên
- ✅ Admin panel CRUD test pass

### 8.5 Phase 5 Gate (Inference)
- ✅ **Bài kiểm A PASS**: Fleiss ≥ 0.70, Cohen ≥ 0.60
- ✅ **Bài kiểm B PASS**: latency p95 ≤ 2s, RAM ≤ 1.5GB
- ✅ `inference/` coverage ≥ 60%

---

## 📋 IX. VI PHẠM & XỬ LÝ

### 9.1 Severity Levels

| Level | Mô tả | Xử lý |
|-------|--------|-------|
| 🔴 **Critical** | Security breach, data loss | Hotfix ngay, post-mortem |
| 🟠 **High** | Architecture violation, missing critical test | Fix trong sprint |
| 🟡 **Medium** | Convention chưa đúng | Fix trong PR tiếp theo |
| 🟢 **Low** | Style, comment, naming | Note trong review |

---

## 📚 TÀI LIỆU BẮT BUỘC

1. [VerveAI BA Document v1.4.5](../VerveAI_BA_Document_v1.4.md)
2. [Project Management Plan](./PROJECT_MANAGEMENT_PLAN.md)
3. [Project Structure](./PROJECT_STRUCTURE.md)
4. [`service/WORK_SPLIT.md`](../../service/WORK_SPLIT.md) — ⭐ Phân chia 5 microservice
5. [ADR-0001 Tech Stack](../02-architecture/adr/0001-tech-stack-selection.md)
6. [ADR-0003 AI 3 lớp](../02-architecture/adr/0003-local-ai-architecture.md)
7. [ADR-0004 Microservices Architecture](../02-architecture/adr/0004-microservices-architecture.md) ⭐ MỚI
8. [ADR-0005 Service Discovery](../02-architecture/adr/0005-service-discovery.md) ⭐ MỚI
9. [ADR-0006 API Gateway](../02-architecture/adr/0006-api-gateway.md) ⭐ MỚI

### Coding Standards chi tiết
- [.cursor/rules/00-project-overview.mdc](../../.cursor/rules/00-project-overview.mdc) (Project Overview + Golden Rules)
- [.cursor/rules/01-folder-structure.mdc](../../.cursor/rules/01-folder-structure.mdc) (Folder Structure)
- [.cursor/rules/02-backend.mdc](../../.cursor/rules/02-backend.mdc) (Microservice Backend)
- [.cursor/rules/03-frontend.mdc](../../.cursor/rules/03-frontend.mdc) (Dart/Flutter)
- [.cursor/rules/04-python.mdc](../../.cursor/rules/04-python.mdc) (Python)
- [.cursor/rules/05-git-workflow.mdc](../../.cursor/rules/05-git-workflow.mdc) (Git Workflow)
- [.cursor/rules/06-architecture.mdc](../../.cursor/rules/06-architecture.mdc) (Architecture)
- [.cursor/rules/07-testing.mdc](../../.cursor/rules/07-testing.mdc) (Testing)

### Workflow
- [Git Workflow](../03-development/git-workflow.md)
- [Testing Strategy](../03-development/testing-strategy.md)

---

## ✍️ COMMITMENT

Mỗi thành viên khi join dự án **PHẢI:**
1. ✅ Đọc toàn bộ file này
2. ✅ Đọc BA Document v1.4.5
3. ✅ Setup local dev thành công
4. ✅ Pass code review đầu tiên
5. ✅ Sign-off vào Slack #verveai-rules channel

---

**Version Control:**
- v1.4.5.1 (09/09/2026) - ⭐ MỚI: Thêm service/ microservice (WORK_SPLIT.md v1.1), 3 ADR mới (0004-0006), update rules
- v1.4.5 (05/09/2026) - Cập nhật theo BA v1.4.5: đổi tên NEKOPATH → VerveAI → LEAPS, folder leaps_verveai_2026

**END OF DOCUMENT**
