# 📁 CẤU TRÚC DỰ ÁN
# LEAPS — Local Educational Adaptive Personalization System

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản:** 1.4.5
> **Ngày:** 09/09/2026
> **Căn cứ:** BA Document v1.4.5 (Phụ lục F & G) + Project Management Plan v1.4.5 + WORK_SPLIT.md v1.1

---

## 🎯 TỔNG QUAN

**LEAPS (VerveAI)** — Monorepo 4 module độc lập — không có backend cloud, **100% offline** cho thiết bị học sinh:

| Module | Ngôn ngữ | Vai trò | Môi trường | Ưu tiên |
|--------|----------|---------|------------|---------|
| `app/` | Flutter/Dart | L0 — App học sinh + giáo viên + admin | **Offline 100%** | Pilot |
| `web-portal/` | Next.js/TypeScript | L0 — Web portal cho giáo viên (dashboard, quản lý lớp) | Online | **Ưu tiên cao nhất** |
| `service/` ⭐ MỚI | Node.js/TypeScript | 5 microservice + Gateway + Consul | Online | **Ưu tiên cao** (Phase 2) |
| `content-pipeline/` | TypeScript | Tác giả nội dung + kiểm duyệt + đóng gói USB | Online (chạy trước triển khai) | - |
| `research/` | Python | Bài kiểm A & B + BKT validation | Online hoặc offline | - |
| `review-console/` | React/TypeScript | Rà soát nội dung (FR-20, SN-SC-03) | Online | - |

> **Lộ trình:** `web-portal/` ưu tiên hoàn thành trước. `service/` (Phase 2) phát triển song song. `app/` (Flutter PWA) sẽ phát triển sau khi có thời gian.

---

## 🌳 CÂY THƯ MỤC

```
verveai/
│
├── README.md                                # Tổng quan dự án
├── .gitignore
├── .env.example                             # TS-19/20: khoá Ed25519 (KHÔNG commit khoá thật)
├── LICENSE
│
├── .cursor/
│   └── rules/                               # Quy tắc AI assistant (00 → 07)
│       ├── 00-project-overview.mdc          # BẮT BUỘC — Golden Rules
│       ├── 01-folder-structure.mdc          # ⭐ Cấu trúc microservice mới
│       ├── 02-backend.mdc                   # ⭐ Microservice rules
│       ├── 03-frontend.mdc                  # Flutter/Dart
│       ├── 04-python.mdc                    # Python research
│       ├── 05-git-workflow.mdc              # ⭐ Git với microservice scopes
│       ├── 06-architecture.mdc              # ⭐ Architecture với Gateway
│       └── 07-testing.mdc                   # ⭐ Testing với microservices
│
├── docs/                                    # 📚 Tài liệu (xem docs/README.md)
│   ├── README.md
│   ├── 01-business/                         # BA, PMP, structure, stakeholders
│   ├── 02-architecture/                     # ADRs + diagrams + privacy
│   │   └── adr/
│   │       ├── 0001-tech-stack-selection.md
│   │       ├── 0002-sync-strategy.md
│   │       ├── 0003-local-ai-architecture.md
│   │       ├── 0004-microservices-architecture.md ⭐ MỚI
│   │       ├── 0005-service-discovery.md     ⭐ MỚI
│   │       └── 0006-api-gateway.md           ⭐ MỚI
│   ├── 03-development/                      # coding-standards, git, testing
│   ├── 04-operations/                       # build, USB distribution, runbook
│   ├── 05-research/                         # Bài kiểm A & B, kappa
│   └── 06-user/                             # hướng dẫn GV/HS/Admin
│
├── service/                                 # ⭐ MỚI — Node.js Microservices — Phase 2
│   ├── README.md                            # Tổng quan 5 service
│   ├── WORK_SPLIT.md                        # ⭐ Canonical — Phân chia 5 microservice
│   ├── shared/                              # Code dùng chung
│   │   ├── consul-client/                   # Service discovery
│   │   ├── circuit-breaker/                 # opossum wrapper
│   │   ├── jwt-utils/                       # JWT verify (gateway-side)
│   │   ├── prisma-schema/                   # 5 schema gốc
│   │   ├── tracing/                         # OpenTelemetry init
│   │   └── error-types/                     # Domain errors chuẩn
│   ├── service-auth/                        # Dev 1 — port 3001
│   ├── service-bkt/                         # Dev 2 — port 3002
│   ├── service-class/                       # Dev 3 — port 3003
│   ├── service-content/                     # Dev 1 — port 3004
│   ├── service-sync/                        # Dev 3 — port 3005
│   └── gateway/                             # ⭐ Express Gateway — port 8080
│
├── app/                                     # 📱 Flutter app — CHẠY OFFLINE 100% (ưu tiên sau)
│   ├── README.md
│   ├── pubspec.yaml
│   ├── analysis_options.yaml
│   ├── lib/                                 # Xem § "app/lib structure"
│   ├── android/                             # Flutter create
│   ├── windows/                             # Flutter create
│   └── test/                                # unit/, acceptance/, e2e/
│
├── web-portal/                              # 🌐 Next.js/TS — Web portal (ưu tiên CAO NHẤT)
│   ├── README.md
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── src/
│       ├── app/                             # Next.js App Router
│       ├── styles/
│       ├── middleware.ts
│       └── lib/api/                         # ⭐ API client → Gateway (port 8080)
│
├── content-pipeline/                         # 🌐 TypeScript — chạy online
│   ├── README.md
│   ├── package.json
│   └── src/
│
├── review-console/                          # 🌐 React/TS — rà soát
│   ├── README.md
│   └── src/
│
├── research/                                 # 🐍 Python — bài kiểm quyết định
│   ├── README.md
│   ├── pyproject.toml
│   └── ...
│
├── infra/                                    # ⭐ docker-compose cho 5 service + Consul + Jaeger
│   ├── docker-compose.yml                   # ⭐ MỚI — 5 service + Gateway + Consul + Jaeger
│   ├── prometheus.yml                       # ⭐ MỚI
│   └── consul/                              # ⭐ MỚI — Consul config
│
├── database/                                 # ⭐ MỚI — Schema SQL gốc, ERD, migrations
│   ├── migrations/                          # Prisma migrations gốc
│   ├── diagrams/                            # ERD
│   └── seeds/                              # Data mẫu cho dev
│
├── scripts/                                  # Build/deploy
│   └── build-bundle.sh                      # Ký Ed25519
│
└── pnpm-workspace.yaml                      # KHÔNG bao gồm app/ và research/
```

---

## 📐 service/ structure (Node.js Microservices) ⭐ MỚI

```
service/
├── WORK_SPLIT.md             # ⭐ Canonical — Phân chia 5 microservice
├── README.md                 # Tổng quan, cách chạy
│
├── shared/                   # Code dùng chung (workspace packages)
│   ├── consul-client/        # @service/shared/consul-client
│   ├── circuit-breaker/      # @service/shared/circuit-breaker
│   ├── jwt-utils/            # @service/shared/jwt-utils
│   ├── prisma-schema/        # @service/shared/prisma-schema
│   ├── tracing/              # @service/shared/tracing
│   └── error-types/          # @service/shared/error-types
│
├── service-auth/             # Dev 1 — port 3001
│   ├── src/
│   │   ├── routes/           # Express routes
│   │   ├── services/         # Business logic
│   │   ├── prisma/           # Prisma client riêng
│   │   ├── config/consul.ts  # Đăng ký với Consul
│   │   ├── metrics.ts        # Prometheus client
│   │   ├── tracing.ts        # OpenTelemetry
│   │   └── index.ts          # Express app + register Consul
│   ├── prisma/schema.prisma  # Import từ shared/prisma-schema
│   ├── tests/
│   ├── Dockerfile
│   └── package.json
│
├── service-bkt/              # Dev 2 — port 3002
├── service-class/            # Dev 3 — port 3003
├── service-content/          # Dev 1 — port 3004
├── service-sync/             # Dev 3 — port 3005
│
└── gateway/                  # Express Gateway — port 8080
    ├── config/gateway.config.yml
    ├── src/
    └── package.json
```

---

## 📐 app/lib structure (Flutter)

```
app/lib/
├── main.dart                                # Entry point
│
├── engine/                                  # Lớp 2 — TẤT ĐỊNH (TS-07) — Dart thuần
│   ├── evidence/
│   ├── mastery/bkt.dart                     # FR-06 → FR-11 — 4 tham số const
│   ├── diagnose/
│   ├── item_selection/
│   ├── remediation/
│   ├── grouping/cluster_by_root_cause.dart  # BR-07, BR-08
│   ├── knowledge_graph/                     # TS-06
│   ├── versioning/                          # DR-07
│   └── transfer/student_transfer.dart        # FR-26
│
├── inference/                               # [A] — Lớp 1 & 3 — chờ Bài kiểm A & B
│   ├── ffi/llama_bindings.dart              # TS-02
│   ├── model_manager.dart                   # TS-03, AS-61
│   ├── grammar/                             # TS-04: GBNF
│   ├── extraction/extract_evidence.dart     # Lớp 1 — AIR-25
│   └── expression/                          # Lớp 3 — BR-13, AIR-24
│
├── content/v1/
├── bootstrap/                               # AS-28, TS-19/20
├── storage/                                 # TS-05 — SQLite append-only
├── hub/                                     # SC-05 — chính
├── sync/                                    # SC-06 — dự phòng USB
├── privacy/
├── content_security/signature_verify.dart    # Ed25519
├── auth/profile_gate.dart                   # FR-22
│
└── ui/
    ├── student/                             # ⛔ CHƯA CODE — chờ OS-03
    ├── teacher/                             # CO-T-01 → CO-T-09
    └── admin/
```

---

## 🔧 CÁC LỆNH NHANH

```bash
# --- Web Portal (Next.js) — ƯU TIÊN CAO NHẤT ---
cd web-portal
npm install
npm run dev                                 # Development server
npm run build                               # Production build
npm run lint                                # ESLint check

# --- Microservice Backend (Phase 2) ⭐ MỚI ---
docker compose -f infra/docker-compose.yml up    # Start all services
# Hoặc từng service:
cd service/service-auth
npm install && npm run dev

# Gateway health check:
curl http://localhost:8080/health

# Consul UI:
open http://localhost:8500

# Jaeger UI (tracing):
open http://localhost:16686

# --- App (Flutter) ---
cd app
flutter pub get
flutter test
flutter build apk --release                 # TS-17
flutter build windows --release              # TS-18

# --- Content pipeline (TypeScript) ---
cd content-pipeline
pnpm install
pnpm run build

# --- Research (Python) ---
cd research
pip install -e ".[dev]"
make test-unit                              # pytest tests/
make test-a                                 # Bài kiểm A
make test-b                                 # Bài kiểm B
```

---

## 📐 QUY TẮC ĐẶT TÊN

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| **Service folder** | `service-{name}` | `service-auth`, `service-bkt` |
| **Gateway folder** | `gateway` | `gateway/` |
| **Folder (service)** | kebab-case / snake_case | `consul-client`, `circuit_breaker` |
| **Dart class / enum** | PascalCase | `EvidenceEvent`, `ContextMode` |
| **Dart file** | snake_case | `record_attempt.dart` |
| **Python file** | snake_case | `kappa_analysis.py` |
| **Python class** | PascalCase | `TestAConfig` |
| **TS/TSX file** | camelCase / kebab-case | `buildContentBundle.ts`, `review_queue.ts` |
| **TS component** | PascalCase | `DashboardPage.tsx`, `TeacherPanel.tsx` |
| **Branch** | `type/VP-{id}-{desc}` | `feature/VP-123-add-bkt-mastery` |
| **Commit** | Conventional Commits | `feat(svc-auth): add JWT refresh token` |

---

## 🚫 CẤM

- ❌ **Dùng `backend/`** — đã lỗi thời, dùng `service/service-*`
- ❌ Backend cloud (LEAPS chạy 100% offline cho app)
- ❌ Tạo thư mục ngoài cấu trúc này
- ❌ File `.ts`/`.tsx` trong `app/lib/`
- ❌ File `.dart` trong `web-portal/`, `content-pipeline/`, `service/`
- ❌ Đặt `inference/` ra khỏi [A] trước khi Bài kiểm A & B đạt ngưỡng
- ❌ Code `app/lib/ui/student/` trước khi OS-03 chốt
- ❌ Commit `.gguf`, `*.verveai-bundle.zip`, khoá riêng Ed25519
- ❌ Hardcode URL service trong code — dùng Consul DNS
- ❌ Gọi service trực tiếp từ web-portal — phải qua Gateway
- ❌ Inter-service call không có circuit breaker

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA Document v1.4.5](../VerveAI_BA_Document_v1.4.md)
- [`service/WORK_SPLIT.md`](../service/WORK_SPLIT.md) — ⭐ Phân chia 5 microservice (canonical)
- [ADR-0004 Microservices Architecture](../02-architecture/adr/0004-microservices-architecture.md)
- [ADR-0005 Service Discovery (Consul)](../02-architecture/adr/0005-service-discovery.md)
- [ADR-0006 API Gateway (Express Gateway)](../02-architecture/adr/0006-api-gateway.md)
- [Project Management Plan](./PROJECT_MANAGEMENT_PLAN.md)
- [Development Guide](../03-development/README.md)

---

**END OF DOCUMENT**
