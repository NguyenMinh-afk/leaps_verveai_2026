# 📁 CẤU TRÚC DỰ ÁN
# LEAPS — Local Educational Adaptive Personalization System

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản:** 1.4.5
> **Ngày:** 05/09/2026
> **Căn cứ:** BA Document v1.4.5 (Phụ lục F & G) + Project Management Plan v1.4.5

---

## 🎯 TỔNG QUAN

**LEAPS (VerveAI)** — Monorepo 4 module độc lập — không có backend cloud, **100% offline** cho thiết bị học sinh:

| Module | Ngôn ngữ | Vai trò | Môi trường | Ưu tiên |
|--------|----------|---------|------------|---------|
| `app/` | Flutter/Dart | L0 — App học sinh + giáo viên + admin | **Offline 100%** | Pilot |
| `web-portal/` | Next.js/TypeScript | L0 — Web portal cho giáo viên (dashboard, quản lý lớp) | Online | **Ưu tiên cao nhất** |
| `content-pipeline/` | TypeScript | Tác giả nội dung + kiểm duyệt + đóng gói USB | Online (chạy trước triển khai) | - |
| `research/` | Python | Bài kiểm A & B + BKT validation | Online hoặc offline | - |
| `review-console/` | React/TypeScript | Rà soát nội dung (FR-20, SN-SC-03) | Online | - |

Mỗi module có `README.md` riêng + build/deploy script riêng.

> **Lộ trình:** `web-portal/` ưu tiên hoàn thành trước. `app/` (Flutter PWA) sẽ phát triển sau khi có thời gian.

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
│   └── rules/                               # Quy tắc AI assistant (00 → 06)
│       ├── 00-project-overview.mdc          # BẮT BUỘC — Golden Rules
│       ├── 01-folder-structure.mdc
│       ├── 02-frontend.mdc                  # Dart/Flutter
│       ├── 03-python.mdc
│       ├── 04-testing.mdc
│       ├── 05-git-workflow.mdc
│       └── 06-architecture.mdc
│
├── docs/                                    # 📚 Tài liệu (xem docs/README.md)
│   ├── README.md
│   ├── 01-business/                         # BA, PMP, structure, stakeholders
│   ├── 02-architecture/                     # ADRs + diagrams + privacy
│   ├── 03-development/                      # coding-standards, git, testing
│   ├── 04-operations/                       # build, USB distribution, runbook
│   ├── 05-research/                         # Bài kiểm A & B, kappa
│   └── 06-user/                             # hướng d�n GV/HS/Admin
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
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── error.tsx
│       │   ├── loading.tsx
│       │   └── not-found.tsx
│       ├── styles/
│       │   └── globals.css                  # Tailwind + CSS variables (shadcn/ui)
│       ├── middleware.ts                     # Auth/routing middleware
│       └── css.d.ts                         # CSS module types
│
├── content-pipeline/                        # 🌐 TypeScript — chạy online
│   ├── README.md
│   ├── package.json
│   └── src/
│       ├── authoring/
│       ├── auto-verify/
│       ├── age-appropriateness/             # ⭐ NFR-23 (G.9)
│       ├── review/                          # FR-20, SN-SC-03
│       └── export/
│           ├── buildContentBundle.ts
│           └── signBundle.ts                # ⭐ Ed25519 — TS-19/20
│
├── review-console/                          # 🌐 React/TS — rà soát
│   ├── README.md
│   └── src/
│
├── research/                                # 🐍 Python — bài kiểm quyết định
│   ├── README.md
│   ├── Makefile
│   ├── pyproject.toml
│   ├── .gitignore                           # data/ không commit (DR-08)
│   ├── model-eval/                          # Tài liệu & dữ liệu pilot (A & B)
│   │   ├── README.md
│   │   └── data/SCHEMA.md
│   ├── src/research/
│   │   ├── expert_agreement/kappa_analysis.py
│   │   ├── simulation/self_consistency_check.py
│   │   ├── reproducibility/exportForIndependentReview.py
│   │   └── model_eval/                      # � Bảng F.5
│   │       ├── test_a_extraction_quality.py
│   │       ├── test_b_device_performance.py
│   │       ├── csv_loader.py / csv_loader_b.py
│   │       ├── metrics.py / device_probe.py
│   │       └── verdict.py / verdict_b.py
│   └── tests/                               # Pytest — unit tests
│
├── infra/                                   # docker-compose cho content-pipeline/review-console
│
├── scripts/                                 # Build/deploy
│   ├── README.md
│   ├── build.sh / build.bat
│   ├── build-bundle.sh                      # Ký Ed25519
│   └── deploy.sh                            # USB-deploy
│
└── pnpm-workspace.yaml                      # KHÔNG bao gồm app/ và research/
    package.json
```

---

## 📐 app/lib structure (Flutter)

```
app/lib/
├── main.dart                                # Entry point
│
├── engine/                                  # Lớp 2 — TẤT ĐỊNH (TS-07) — Dart thuần
│   ├── evidence/
│   │   ├── record_attempt.dart
│   │   └── evidence_context.dart
│   ├── mastery/bkt.dart                     # FR-06 → FR-11 — 4 tham số const
│   ├── diagnose/
│   │   ├── hypothesis_ranking.dart
│   │   ├── abstention.dart
│   │   ├── non_knowledge_detector.dart
│   │   └── language_barrier_detector.dart   # ⭐ FR-25 (G.9)
│   ├── item_selection/
│   │   ├── next_best_item.dart
│   │   └── recent_item_tracker.dart         # FR-24
│   ├── remediation/
│   │   ├── build_plan.dart
│   │   └── hold_out_check.dart
│   ├── grouping/cluster_by_root_cause.dart  # BR-07, BR-08
│   ├── knowledge_graph/                     # TS-06
│   ├── versioning/                          # DR-07
│   └── transfer/student_transfer.dart       # ⭐ FR-26 (G.9)
│
├── inference/                               # [A] — Lớp 1 & 3 — chờ Bài kiểm A & B
│   ├── ffi/llama_bindings.dart              # TS-02
│   ├── model_manager.dart                   # TS-03, AS-61
│   ├── grammar/                             # TS-04: GBNF
│   ├── extraction/extract_evidence.dart     # Lớp 1 — AIR-25
│   └── expression/                          # Lớp 3 — BR-13, AIR-24
│       ├── explain_to_teacher.dart
│       ├── fill_student_template.dart
│       └── fact_check_guard.dart
│
├── content/v1/
│
├── bootstrap/                               # AS-28, TS-19/20
│   ├── content_installer.dart
│   ├── model_installer.dart
│   ├── bundle_verify.dart
│   └── first_run_wizard.dart
│
├── storage/                                 # TS-05 — SQLite append-only
│   ├── db.dart
│   ├── event_log.dart
│   ├── audit_log.dart                       # BR-05
│   ├── integrity_check.dart                 # NFR-18
│   └── recovery.dart
│
├── hub/                                     # SC-05 — chính
│   ├── server.dart
│   ├── discovery.dart
│   ├── crypto.dart
│   ├── logical_clock.dart
│   ├── merge.dart
│   └── backup.dart                          # ⭐ NFR-22
│
├── sync/                                    # SC-06 — dự phòng USB
│   ├── file_exchange.dart
│   ├── chunked_transfer.dart
│   └── sync_strategy_resolver.dart
│
├── privacy/
│   ├── anonymize.dart                       # DR-08
│   ├── export_delete.dart                   # FR-21, DR-09
│   ├── retention_policy.dart                # ⭐ DR-12
│   └── breach_notify.dart                   # ⭐ NFR-21
│
├── content_security/signature_verify.dart   # ⭐ Ed25519
├── auth/profile_gate.dart                   # FR-22
│
└── ui/
    ├── student/                             # ⛔ CHƯA CODE — chờ OS-03
    ├── teacher/                             # CO-T-01 → CO-T-09
    └── admin/data_governance_panel.dart
```

---

## 📐 research/ structure (Python)

```
research/
├── pyproject.toml                           # Package, entry points, pytest config
├── Makefile                                 # make install / test / test-a / test-b
├── .gitignore                               # Không commit data thật (DR-08)
│
├── src/research/
│   ├── expert_agreement/kappa_analysis.py
│   ├── simulation/self_consistency_check.py       # TS-07
│   ├── reproducibility/exportForIndependentReview.py
│   └── model_eval/                                # ⭐ Bảng F.5
│       ├── __init__.py
│       ├── __main__.py
│       ├── test_a_extraction_quality.py
│       ├── test_b_device_performance.py
│       ├── csv_loader.py / csv_loader_b.py
│       ├── metrics.py / device_probe.py
│       └── verdict.py / verdict_b.py
│
├── model-eval/                              # Tài liệu + dữ liệu pilot
│   ├── README.md
│   └── data/SCHEMA.md
│
└── tests/                                   # Pytest — unit tests
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

# --- App (Flutter) ---
cd app
flutter pub get
flutter test                                # unit + acceptance
flutter test integration_test               # e2e thiết bị thật
flutter build apk --release                 # TS-17
flutter build windows --release             # TS-18

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

# --- USB distribution (TS-19/20) ---
./scripts/build-bundle.sh ./dist 2026.08.25
PRIVATE_KEY_PATH=./keys/content-signing.key ./scripts/deploy.sh staging ./dist
```

---

## 📐 QUY TẮC ĐẶT TÊN

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| **Folder** | kebab-case / snake_case | `language_barrier_detector`, `cluster_by_root_cause` |
| **Dart class / enum** | PascalCase | `EvidenceEvent`, `ContextMode` |
| **Dart file** | snake_case | `record_attempt.dart` |
| **Dart constant** | lowerCamelCase / `k` prefix | `kMasteryThreshold` |
| **Python file** | snake_case | `kappa_analysis.py` |
| **Python class** | PascalCase | `TestAConfig` |
| **TS/TSX file** | camelCase / kebab-case | `buildContentBundle.ts`, `review_queue.ts` |
| **TS component** | PascalCase | `DashboardPage.tsx`, `TeacherPanel.tsx` |
| **Branch** | `type/NEKO-{id}-{desc}` | `feature/NEKO-123-add-bkt-mastery` |
| **Commit** | Conventional Commits | `feat(engine): add BKT mastery tracking` |

Xem chi tiết tại:
- `.cursor/rules/02-frontend.mdc` (Dart/Flutter)
- `.cursor/rules/03-python.mdc` (Python)
- `.cursor/rules/05-git-workflow.mdc` (Branch + Commit)

---

## 🚫 CẤM

- ❌ Backend cloud (LEAPS chạy 100% offline).
- ❌ Tạo thư mục ngoài cấu trúc này.
- ❌ File `.ts`/`.tsx` trong `app/lib/`.
- ❌ File `.dart` trong `content-pipeline/` hoặc `review-console/`.
- ❌ Đặt `inference/` ra khỏi [A] trước khi Bài kiểm A & B đạt ngưỡng.
- ❌ Code `app/lib/ui/student/` trước khi OS-03 chốt.
- ❌ Commit `.gguf`, `*.verveai-bundle.zip`, khoá riêng Ed25519.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA Document v1.4.5](../VerveAI_BA_Document_v1.4.md)
- [Project Management Plan](./PROJECT_MANAGEMENT_PLAN.md)
- [Architecture Overview](../02-architecture/README.md)
- [Development Guide](../03-development/README.md)

---

**END OF DOCUMENT**
