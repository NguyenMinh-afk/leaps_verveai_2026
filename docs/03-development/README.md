# 🛠️ Development Documentation

Hướng dẫn phát triển cho contributors **LEAPS (VerveAI)**.

> **Tên mã nguồn:** VerveAI · **App:** Verve

## Ưu tiên phát triển

| Ưu tiên | Module | Ghi chú |
|---------|--------|---------|
| **CAO NHẤT** | `web-portal/` (Next.js/TypeScript) | Web portal cho giáo viên (FE dev khác phụ trách) |
| **CAO** | `service/` (Node.js Microservices) ⭐ | 5 service + Gateway + Consul |
| Sau | `app/` (Flutter PWA) | Flutter dev khác phụ trách |

---

## ⭐ BẮT ĐẦU Ở ĐÂY — KẾ HOẠCH SỬA

### 🔵 Cho Backend / Infrastructure Dev (file này phụ trách)
> **[`BACKEND_IMPLEMENTATION_ROADMAP.md`](./BACKEND_IMPLEMENTATION_ROADMAP.md)** ⭐ — Kế hoạch sửa **backend (service/) + hạ tầng (infra/) + research**. Đây là tài liệu chính để team BE bám theo.

### 🟢 Cho FE Dev (web-portal/) — KHÔNG thuộc file này
> Liên hệ FE dev để có kế hoạch riêng. Tham khảo [`docs/02-architecture/web-portal-architecture.md`](../02-architecture/web-portal-architecture.md).

### 🟡 Cho Flutter Dev (app/) — KHÔNG thuộc file này
> Liên hệ Flutter dev để có kế hoạch riêng. Tham khảo [`docs/02-architecture/adr/0003-local-ai-architecture.md`](../02-architecture/adr/0003-local-ai-architecture.md).

---

## Cấu trúc

| Thư mục / File | Nội dung |
|----------------|----------|
| **[`BACKEND_IMPLEMENTATION_ROADMAP.md`](./BACKEND_IMPLEMENTATION_ROADMAP.md)** ⭐ | **Kế hoạch sửa** (BE + Infra + Research) — Sprint by sprint, owner + DoD |
| [coding-standards/](./coding-standards/) | Style guides: Dart, TypeScript, Python |
| [git-workflow.md](./git-workflow.md) | Branch + Conventional Commits |
| [testing-strategy.md](./testing-strategy.md) | Unit, integration, e2e + Bài kiểm A & B |
| [code-review-checklist.md](./code-review-checklist.md) | PR review checklist |
| [troubleshooting.md](./troubleshooting.md) | Các lỗi thường gặp |

## Quy tắc bắt buộc (MUST READ)

- [`.cursor/rules/00-project-overview.mdc`](../../.cursor/rules/00-project-overview.mdc) — Golden Rules.
- [`.cursor/rules/01-folder-structure.mdc`](../../.cursor/rules/01-folder-structure.mdc) — Đặt file đúng vị trí.
- [`.cursor/rules/02-backend.mdc`](../../.cursor/rules/02-backend.mdc) — ⭐ Microservice backend (Node.js)
- [`.cursor/rules/03-frontend.mdc`](../../.cursor/rules/03-frontend.mdc) — Next.js / Flutter (tham khảo)
- [`.cursor/rules/04-python.mdc`](../../.cursor/rules/04-python.mdc) — Python (research)
- [`.cursor/rules/05-git-workflow.mdc`](../../.cursor/rules/05-git-workflow.mdc) — Branch + commit
- [`.cursor/rules/06-architecture.mdc`](../../.cursor/rules/06-architecture.mdc) — Kiến trúc
- [`.cursor/rules/07-testing.mdc`](../../.cursor/rules/07-testing.mdc) — Test coverage

## Quy trình đóng góp (Backend)

1. **Đọc KẾ HOẠCH SỬA** ([`BACKEND_IMPLEMENTATION_ROADMAP.md`](./BACKEND_IMPLEMENTATION_ROADMAP.md)) để biết task của mình.
2. Đọc BA Document + rule tương ứng (`02-backend.mdc`).
3. Tạo branch: `git checkout -b feature/VP-{id}-{desc}` (scope theo microservice nếu có, vd: `feat/svc-auth`, `feat(svc-bkt)`).
4. Code + test (coverage ≥ 80%).
5. PR theo template.
6. CI pass + review approve → merge.

Xem chi tiết: [git-workflow.md](./git-workflow.md), [code-review-checklist.md](./code-review-checklist.md).

---

## 📅 Quick reference — Sprint theo Owner (Backend only)

### 🟦 Dev Lead — Sprint 2.1, 2.7, 2.8
- Sprint 2.1 — Infrastructure + 6 shared packages + skeleton
- Sprint 2.7 — Gateway routing + JWT verify + rate limit
- Sprint 2.8 — Load test + chaos test + runbook

### 🟩 Dev 1 — Sprint 2.2, 2.5
- Sprint 2.2 — `service-auth` (port 3001) — Auth + JWT + User CRUD
- Sprint 2.5 — `service-content` (port 3004) — Content + Ed25519 sign

### 🟨 Dev 2 — Sprint 2.3
- Sprint 2.3 — `service-bkt` (port 3002) — BKT + Diagnosis + Interventions

### 🟥 Dev 3 — Sprint 2.4, 2.6
- Sprint 2.4 — `service-class` (port 3003) — Classes + Students + Progress
- Sprint 2.6 — `service-sync` (port 3005) — Sync + Devices + Conflicts

### 🟪 Researcher — Research Sprint (song song)
- Bài kiểm A (Extraction quality) + Bài kiểm B (Device performance)
- Kappa analysis + BKT self-consistency + Reproducibility export

### ⛔ KHÔNG thuộc trách nhiệm file này
- **Web Dev (Phase 1 / web-portal/)** → Liên hệ FE dev để có kế hoạch riêng
- **Flutter Dev (Phase 3 / app/)** → Liên hệ Flutter dev để có kế hoạch riêng
