# 🛠️ KẾ HOẠCH SỬA — BACKEND & HẠ TẦNG
# LEAPS (VerveAI) — Backend Microservice Plan

> **Phiên bản:** 1.4.5.2
> **Ngày:** 10/09/2026
> **Căn cứ:** BA Document v1.4.5 + WORK_SPLIT.md v1.1 + ADRs 0004-0006
> **Phạm vi:** CHỈ backend (`service/` 5 microservice + Gateway), hạ tầng (`infra/`), và Research (`research/`).
> **KHÔNG bao gồm:** web-portal (FE) và app/ Flutter — do FE dev khác phụ trách.

---

## 🎯 MỤC TIÊU TỔNG QUAN

Kế hoạch này chỉ tập trung vào **backend + hạ tầng + research**. Mọi task phải:

1. ✅ Có ticket trên board (`VP-XXX`)
2. ✅ Có owner rõ ràng (Dev Lead / Dev 1 / Dev 2 / Dev 3 / Researcher)
3. ✅ Có test + coverage theo rule (≥ 80% service, ≥ 85% shared, ≥ 80% research)
4. ✅ Pass code review
5. ✅ Update tài liệu liên quan (nếu có)

```
Giai đoạn         Thời gian       Trạng thái     Mục tiêu chính
─────────────────────────────────────────────────────────────────
Phase 2           Tuần 3-7        ⚪ SẮP TỚI    service/ microservice (5 service + Gateway)
Research          Tuần 3-7+       ⚪ SONG SONG  Bài kiểm A & B quyết định cỡ model
```

> ⚠️ **Lưu ý:** File này **KHÔNG** chứa kế hoạch cho web-portal (FE) và app/ (Flutter). FE do dev khác đảm nhiệm. Khi cần kế hoạch FE, tham chiếu `service/README.md` và `docs/02-architecture/web-portal-architecture.md`.

---

# 🟠 PHASE 2 — MICROSERVICE BACKEND (Ưu tiên CAO)

## 📋 Sprint 2.1 — Infrastructure + Shared Packages (Tuần 3)

> **Owner:** Dev Lead
> **Mục tiêu:** Docker compose + 6 shared packages + skeleton Gateway/Service

| Task ID | Owner | Task | Deliverable | Tiêu chí đạt | Phụ thuộc |
|---------|-------|------|-------------|---------------|-----------|
| **VP-201** | Dev Lead | Setup `infra/docker-compose.yml` | Compose file: postgres + consul + jaeger + prometheus + grafana | `docker compose up` chạy thành công, 5 container healthy | — |
| **VP-202** | Dev Lead | Setup `infra/prometheus.yml` | Scrape config cho Gateway + 5 service | Prometheus UI hiển thị targets | VP-201 |
| **VP-203** | Dev Lead | Tạo `service/shared/prisma-schema/` | Schema gốc cho 5 schema (auth, bkt, class, content, sync) | `prisma generate` thành công | VP-201 |
| **VP-204** | Dev Lead | Tạo `service/shared/consul-client/` | `@service/shared/consul-client` với `register()`, `deregister()`, `resolve()` | Test pass ≥ 85% coverage | VP-201 |
| **VP-205** | Dev Lead | Tạo `service/shared/circuit-breaker/` | `@service/shared/circuit-breaker` với `createBreaker()` (opossum) | Test pass ≥ 90% coverage | VP-201 |
| **VP-206** | Dev Lead | Tạo `service/shared/jwt-utils/` | `@service/shared/jwt-utils` với `verify()` cho Gateway | Test pass ≥ 95% coverage | VP-201 |
| **VP-207** | Dev Lead | Tạo `service/shared/tracing/` | `@service/shared/tracing` với OpenTelemetry init | Test pass ≥ 85% coverage | VP-201 |
| **VP-208** | Dev Lead | Tạo `service/shared/error-types/` | `@service/shared/error-types` với DomainError, AuthError, ... | Test pass ≥ 90% coverage | VP-201 |
| **VP-208b** | Dev Lead | Tạo `service/shared/common-node/` ⭐ | `@verveai/common-node` umbrella package — logger, response, validation, middleware, notification, crypto, pagination, http, constants, config, utils | Test pass ≥ 85% coverage | VP-208 |
| **VP-209** | Dev Lead | Setup `service/gateway/` skeleton | Express Gateway với `/health`, CORS, register Consul | Gateway health check pass qua Consul | VP-201, VP-204 |
| **VP-210** | Dev 1 | Setup `service/service-auth/` skeleton | Express app + `/health` + register Consul | Service register thành công với Consul | VP-204 |
| **VP-211** | Dev 2 | Setup `service/service-bkt/` skeleton | Express app + `/health` + register Consul | Service register thành công với Consul | VP-204 |
| **VP-212** | Dev 3 | Setup `service/service-class/` skeleton | Express app + `/health` + register Consul | Service register thành công với Consul | VP-204 |
| **VP-213** | Dev 1 | Setup `service/service-content/` skeleton | Express app + `/health` + register Consul | Service register thành công với Consul | VP-204 |
| **VP-214** | Dev 3 | Setup `service/service-sync/` skeleton | Express app + `/health` + register Consul | Service register thành công với Consul | VP-204 |

### ✅ Sprint 2.1 Definition of Done ✅ HOÀN THÀNH

- [x] `docker compose up` chạy thành công ✅
- [x] 5 service + Gateway + Consul + Postgres + Jaeger + Prometheus đều healthy ✅
- [x] 6 shared packages có test pass + coverage đạt ngưỡng (bao gồm `@verveai/common-node` ≥ 85%) ✅
- [x] Tất cả service đăng ký thành công với Consul (xem được ở http://localhost:8500) ✅
- [x] CI pipeline chạy test cho shared packages ✅

---

## 📋 Sprint 2.2 — Auth Service (Tuần 4)

> **Owner chính:** Dev 1
> **Mục tiêu:** Hoàn thiện `service-auth` với JWT + User CRUD

| Task ID | Owner | Task | Deliverable | Tiêu chí đạt |
|---------|-------|------|-------------|---------------|
| **VP-220** | Dev 1 | Prisma schema cho `auth` | Users, Sessions, RefreshTokens | `prisma migrate dev` thành công |
| **VP-221** | Dev 1 | Login + JWT issue | `POST /api/auth/login` → trả JWT | Test unit + integration pass |
| **VP-222** | Dev 1 | Logout | `POST /api/auth/logout` invalidate token | Test pass |
| **VP-223** | Dev 1 | Session check | `GET /api/auth/session` | Test pass |
| **VP-224** | Dev 1 | Get current user | `GET /api/auth/me` (qua Gateway headers) | Test pass |
| **VP-225** | Dev 1 | User CRUD | `GET/POST/PUT/DELETE /api/users/*` | Test pass ≥ 80% coverage |
| **VP-226** | Dev 1 | Password hash với bcrypt | cost factor ≥ 12 | Security test pass |
| **VP-227** | Dev 1 | Refresh token rotation | `POST /api/auth/refresh` | Test pass |
| **VP-228** | Dev 1 | Seed admin user | 1 admin + 1 teacher + 1 student mẫu | Manual test OK |

### ✅ Sprint 2.2 Definition of Done ✅ HOÀN THÀNH

- [x] `service-auth` đạt ≥ 80% coverage (Services: 97% ✅)
- [x] Tất cả routes có test unit ✅
- [x] Đăng nhập qua Gateway thành công ✅
- [x] User CRUD hoạt động ✅
- [x] Bcrypt password verified (cost factor 12) ✅
- [x] Seed admin/teacher/supervisor users ✅
- [x] README.md hoàn chỉnh ✅

**Ngày hoàn thành:** 10/09/2026
**Coverage:** Services 97% (target: 80%) ✅

---

## 📋 Sprint 2.3 — BKT Service (Tuần 4)

> **Owner chính:** Dev 2
> **Mục tiêu:** Hoàn thiện `service-bkt` — service phức tạp nhất

| Task ID | Owner | Task | Deliverable | Tiêu chí đạt |
|---------|-------|------|-------------|---------------|
| **VP-230** | Dev 2 | Prisma schema cho `bkt` | Skills, Items, EvidenceEvents, Diagnoses, Interventions | `prisma migrate dev` thành công |
| **VP-231** | Dev 2 | Skill CRUD | `GET/POST /api/bkt/skills/*` | Test pass |
| **VP-232** | Dev 2 | Skill tree + prerequisites | `GET /api/bkt/skills/tree`, `/prerequisites` | Test pass |
| **VP-233** | Dev 2 | Evidence recording | `POST /api/bkt/evidence` | Test pass |
| **VP-234** | Dev 2 | Evidence chain | `GET /api/bkt/evidence/:id/chain` | Test pass |
| **VP-235** | Dev 2 | Diagnosis run | `POST /api/bkt/diagnosis/run` (BKT logic) | Test pass với synthetic data |
| **VP-236** | Dev 2 | Diagnosis by student/class | `GET /api/bkt/diagnosis/student/:id`, `/class/:id` | Test pass |
| **VP-237** | Dev 2 | Intervention list | `GET /api/bkt/interventions` (sort by size → severity) | Test pass — verify BR-08 |
| **VP-238** | Dev 2 | Intervention detail | `GET /api/bkt/interventions/:id` | Test pass |
| **VP-239** | Dev 2 | Teacher override (FR-17) | `PUT /api/bkt/interventions/:id/override` | Test pass — BR-17 |
| **VP-240** | Dev 2 | Teacher note | `POST /api/bkt/interventions/:id/note` | Test pass |

### ✅ Sprint 2.3 Definition of Done

- [ ] `service-bkt` đạt ≥ 80% coverage
- [ ] BKT logic deterministic (cùng input → cùng output)
- [ ] Override mechanism hoạt động
- [ ] Tất cả routes có test
- [ ] Inter-service call từ `svc-bkt` sang `svc-auth` dùng Consul + Circuit Breaker

---

## 📋 Sprint 2.4 — Class Service (Tuần 5)

> **Owner chính:** Dev 3

| Task ID | Owner | Task | Deliverable | Tiêu chí đạt |
|---------|-------|------|-------------|---------------|
| **VP-250** | Dev 3 | Prisma schema cho `class` | Classes, Students, ClassMembers, Progress | `prisma migrate dev` thành công |
| **VP-251** | Dev 3 | Class CRUD | `GET/POST/PUT/DELETE /api/class/classes/*` | Test pass |
| **VP-252** | Dev 3 | Class stats | `GET /api/class/classes/:id/stats` | Test pass |
| **VP-253** | Dev 3 | Student CRUD | `GET/POST/PUT/DELETE /api/class/students/*` | Test pass |
| **VP-254** | Dev 3 | Aggregate progress | `GET /api/class/progress/:studentId` (gọi sang svc-bkt) | Test pass + Circuit Breaker |
| **VP-255** | Dev 3 | Student history | `GET /api/class/progress/:studentId/history` | Test pass |
| **VP-256** | Dev 3 | Student skills | `GET /api/class/progress/:studentId/skills` | Test pass |

### ✅ Sprint 2.4 Definition of Done

- [ ] `service-class` đạt ≥ 80% coverage
- [ ] Aggregate progress từ svc-bkt thông qua Consul + Circuit Breaker
- [ ] Test verify khi svc-bkt chết → fallback graceful

---

## 📋 Sprint 2.5 — Content Service (Tuần 5)

> **Owner chính:** Dev 1 (cùng Dev 1 đã làm svc-auth)

| Task ID | Owner | Task | Deliverable | Tiêu chí đạt |
|---------|-------|------|-------------|---------------|
| **VP-260** | Dev 1 | Prisma schema cho `content` | ContentItems, Bundles, BundleSignatures, Reviews | `prisma migrate dev` thành công |
| **VP-261** | Dev 1 | Content CRUD | `GET/POST/PUT/DELETE /api/content/*` | Test pass |
| **VP-262** | Dev 1 | Bundle build | `POST /api/content/bundles/build` | Test pass |
| **VP-263** | Dev 1 | Bundle sign (Ed25519) ⭐ | `POST /api/content/bundles/:id/sign` | Test pass — verify chữ ký |
| **VP-264** | Dev 1 | Bundle publish | `POST /api/content/bundles/:id/publish` | Test pass |
| **VP-265** | Dev 1 | Review queue | `GET /api/content/review`, `/approve`, `/reject` | Test pass |
| **VP-266** | Dev 1 | Aggregate report | `GET /api/content/reports/aggregate` (ẩn danh — DR-08) | Test pass — verify không có tên HS |
| **VP-267** | Dev 1 | Export PDF/CSV | `GET /api/content/reports/export/:type` | Test pass |

### ✅ Sprint 2.5 Definition of Done

- [ ] `service-content` đạt ≥ 80% coverage
- [ ] Ed25519 sign/verify hoạt động
- [ ] Aggregate report ẩn danh đúng (DR-08)

---

## 📋 Sprint 2.6 — Sync Service (Tuần 6)

> **Owner chính:** Dev 3

| Task ID | Owner | Task | Deliverable | Tiêu chí đạt |
|---------|-------|------|-------------|---------------|
| **VP-270** | Dev 3 | Prisma schema cho `sync` | Devices, SyncLogs, Conflicts | `prisma migrate dev` thành công |
| **VP-271** | Dev 3 | Sync status | `GET /api/sync/status` | Test pass |
| **VP-272** | Dev 3 | Push sync | `POST /api/sync/push` | Test pass |
| **VP-273** | Dev 3 | Pull sync | `GET /api/sync/pull`, `/pull/:since` | Test pass |
| **VP-274** | Dev 3 | Conflict resolution | `POST /api/sync/resolve` | Test pass — BR-17 |
| **VP-275** | Dev 3 | Device CRUD | `GET/POST/PUT/DELETE /api/sync/devices/*` | Test pass |
| **VP-276** | Dev 3 | Device logs | `GET /api/sync/devices/:id/logs` | Test pass |

### ✅ Sprint 2.6 Definition of Done

- [ ] `service-sync` đạt ≥ 80% coverage
- [ ] Conflict resolution tuân thủ BR-17

---

## 📋 Sprint 2.7 — Gateway Wiring + JWT (Tuần 7)

> **Owner chính:** Dev Lead

| Task ID | Owner | Task | Deliverable | Tiêu chí đạt |
|---------|-------|------|-------------|---------------|
| **VP-280** | Dev Lead | Gateway routing config | `gateway.config.yml` route tất cả `/api/*` | Routes hoạt động |
| **VP-281** | Dev Lead | Gateway JWT policy | Verify JWT tại Gateway, set `X-User-Id` headers | Test pass |
| **VP-282** | Dev Lead | Gateway rate limit | 100/min auth, 1000/min API | Test pass |
| **VP-283** | Dev Lead | Gateway CORS | Whitelist origins | Test pass |
| **VP-284** | Dev Lead | Gateway health aggregate | `/health` trả về trạng thái 5 service | Test pass |
| **VP-285** | Dev Lead | E2E: login → fetch user | `curl http://localhost:8080/api/auth/login` → dùng token → `GET /api/auth/me` | E2E test pass |
| **VP-286** | Dev Lead | E2E: diagnosis flow | Login → tạo evidence → get diagnosis qua Gateway | E2E test pass |

### ✅ Sprint 2.7 Definition of Done

- [ ] Gateway đạt ≥ 80% coverage
- [ ] Tất cả e2e flow qua Gateway pass
- [ ] Service KHÔNG re-verify JWT (tin tưởng headers từ Gateway)
- [ ] Rate limit có hiệu lực

---

## 📋 Sprint 2.8 — Load Test + Chaos Test (Tuần 7)

> **Owner chính:** Dev Lead

| Task ID | Owner | Task | Deliverable | Tiêu chí đạt |
|---------|-------|------|-------------|---------------|
| **VP-290** | Dev Lead | Load test (k6) | Test 100 concurrent users | Response p95 < 500ms |
| **VP-291** | Dev Lead | Chaos test | Kill 1 service → verify circuit breaker | Circuit breaker mở, fallback OK |
| **VP-292** | Dev Lead | Runbook | `docs/04-operations/runbook.md` | Doc đầy đủ |
| **VP-293** | Dev Lead | API docs | OpenAPI/Swagger | Doc 51 endpoints |
| **VP-294** | Dev Lead | Prometheus dashboard | Grafana dashboard cho 5 service + Gateway | Dashboard ready |

### ✅ Sprint 2.8 Definition of Done

- [ ] Load test pass
- [ ] Chaos test pass (circuit breaker hoạt động đúng)
- [ ] Runbook đầy đủ cho vận hành

---

# 📚 RESEARCH — CHẠY SONG SONG VỚI PHASE 2

> **Lý do giữ Research ở đây:** Bài kiểm A & B quyết định việc đưa `inference/` ra khỏi **[A]** (theo AS-61). Mặc dù `inference/` nằm trong app/ Flutter (do dev khác làm), quyết định này ảnh hưởng đến việc service có cần expose model serving API hay không.

## 📋 Research Sprint — Tuần 3-7 (song song Phase 2)

| Task ID | Owner | Task | Deliverable | Tiêu chí đạt |
|---------|-------|------|-------------|---------------|
| **VP-R01** | Researcher | Bài kiểm A — Extraction quality | `research/model-eval/test_a_extraction_quality.py` | PASS (Fleiss ≥ 0.70, Cohen ≥ 0.60, Macro F1 ≥ 0.65) |
| **VP-R02** | Researcher | Bài kiểm B — Device performance | `research/model-eval/test_b_device_performance.py` | PASS (latency p95 ≤ 2s, RAM ≤ 1.5GB, pin ≤ 5%/30 lượt) |
| **VP-R03** | Researcher | Expert agreement (kappa) | `research/expert_agreement/kappa_analysis.py` | Test pass ≥ 80% coverage |
| **VP-R04** | Researcher | Self-consistency check | `research/simulation/self_consistency_check.py` | Validate BKT params |
| **VP-R05** | Researcher | Reproducibility export | `research/reproducibility/export_for_independent_review.py` | Ẩn danh BR-06, DR-08 |

### ✅ Research Sprint Definition of Done

- [ ] Cả 2 bài kiểm A & B có kết quả PASS/FAIL rõ ràng
- [ ] **NẾU PASS** → cho phép đưa `inference/` ra khỏi [A] (FE Flutter dev sẽ tiếp tục)
- [ ] **NẾU FAIL** → quay lại điều chỉnh (không release `inference/`)

---

# 📊 TIMELINE TỔNG THỂ (Backend + Infrastructure + Research)

```
Tuần    3    4    5    6    7    8    9    10   ...
        ├────┼────┼────┼────┼────┼────┼────┼────┤
Phase 2 ████ ████ ████ ████ ████ ░░░░ ░░░░ ░░░░
        │    │    │    │    │
        2.1  2.2  2.4  2.6  2.7
             2.3  2.5       2.8
Research ████ ████ ████ ████ ████ ░░░░ ░░░░ ░░░░

(Sprint 2.x chi tiết xem phần trên)
```

---

# 🎯 MILESTONES (Backend + Infrastructure)

| # | Mốc | Tuần | Tiêu chí |
|---|-----|------|----------|
| **M2** | Microservice infra ready | 3 | Docker compose + 6 shared packages + skeleton |
| **M3** | svc-auth done | 4 | Auth + User CRUD + JWT |
| **M4** | svc-bkt done | 4 | BKT + Diagnosis + Interventions |
| **M5** | svc-class done | 5 | Classes + Students + Progress |
| **M6** | svc-content done | 5 | Content + Bundles + Ed25519 sign |
| **M7** | svc-sync done | 6 | Sync + Devices + Conflicts |
| **M8** | Gateway wired | 7 | Routing + JWT verify + rate limit |
| **M9** | Load test + chaos pass | 7 | 100 concurrent + chaos verified |

> **Lưu ý:** Milestone M1 (web-portal MVP), M10+ (Flutter) do FE/Flutter dev khác phụ trách — không thuộc file này.

---

# 🚫 CẤM — KHÔNG ĐƯỢC LÀM

| # | Cấm | Lý do |
|---|------|--------|
| 1 | Làm `service/` trước khi `web-portal/` mock data chạy | Phải có UX trước — nhưng đó là việc FE dev |
| 2 | Bỏ qua test | Coverage ≥ 80% là bắt buộc |
| 3 | Hardcode URL service | Dùng Consul DNS |
| 4 | Gọi service trực tiếp từ web-portal | Phải qua Gateway |
| 5 | Inter-service call không có circuit breaker | opossum bắt buộc |
| 6 | Commit `.gguf`, `.verveai-bundle.zip`, khoá Ed25519 | Secret + bundle binary |
| 7 | Commit `.env` của bất kỳ service nào | Secret |
| 8 | Squash nhiều concern vào 1 commit | Mỗi commit 1 concern |
| 9 | Commit trực tiếp vào `main` | Phải qua PR + review |
| 10 | Dùng `backend/` (monolith cũ) | Dùng `service/service-*` |
| 11 | Re-verify JWT ở service | Gateway đã verify |
| 12 | Code `app/lib/ui/student/` | Chờ OS-03 chốt — việc Flutter dev |
| 13 | Đưa `inference/` ra khỏi [A] trước Bài kiểm A & B PASS | AS-61 |

> ⚠️ File này **KHÔNG quản lý** code của `web-portal/` và `app/`. FE dev tự chịu trách nhiệm về code của họ.

---

# 📋 DAILY/WEEKLY CHECKLIST

## Daily (mỗi ngày làm việc)

- [ ] Pull main mới nhất (`git pull origin main`)
- [ ] Chạy test local trước khi push (`npm test` / `pytest`)
- [ ] Self-review code trước khi tạo PR
- [ ] Update ticket status (In Progress / Review / Done)

## Weekly (mỗi thứ 2)

- [ ] Sprint planning — pick up tasks cho tuần
- [ ] Sprint review — demo những gì đã xong
- [ ] Update burndown chart
- [ ] Đồng bộ với team về blockers

## Sprint End

- [ ] Tất cả tasks trong sprint → Done hoặc moved to next sprint
- [ ] Definition of Done pass
- [ ] Documentation update
- [ ] Tag release nếu cần

---

# 👥 OWNER QUICK REFERENCE

| Owner | Sprint chính | Service phụ trách |
|-------|--------------|-------------------|
| **Dev Lead** | 2.1, 2.7, 2.8 | gateway + hạ tầng |
| **Dev 1** | 2.2, 2.5 | service-auth + service-content |
| **Dev 2** | 2.3 | service-bkt |
| **Dev 3** | 2.4, 2.6 | service-class + service-sync |
| **Researcher** | Research Sprint | research/ |

---

# 🔗 LIÊN KẾT

## Tài liệu tham chiếu (Backend)
- [`docs/VerveAI_BA_Document_v1.4.md`](../../VerveAI_BA_Document_v1.4.md) — BA v1.4.5
- [`service/WORK_SPLIT.md`](../../service/WORK_SPLIT.md) — ⭐ Phân chia 5 microservice (canonical)
- [`service/README.md`](../../service/README.md) — Tổng quan 5 service
- [`docs/01-business/PROJECT_STRUCTURE.md`](../01-business/PROJECT_STRUCTURE.md) — Cấu trúc
- [`docs/01-business/PROJECT_RULES.md`](../01-business/PROJECT_RULES.md) — Quy tắc code

## ADRs liên quan
- [ADR-0004 Microservices](../02-architecture/adr/0004-microservices-architecture.md)
- [ADR-0005 Service Discovery (Consul)](../02-architecture/adr/0005-service-discovery.md)
- [ADR-0006 API Gateway](../02-architecture/adr/0006-api-gateway.md)
- [ADR-0001 Tech Stack](../02-architecture/adr/0001-tech-stack-selection.md)

## Rules
- [`.cursor/rules/05-git-workflow.mdc`](../../.cursor/rules/05-git-workflow.mdc) — Git workflow
- [`.cursor/rules/07-testing.mdc`](../../.cursor/rules/07-testing.mdc) — Testing
- [`.cursor/rules/02-backend.mdc`](../../.cursor/rules/02-backend.mdc) — Backend rules

## Khác (KHÔNG thuộc trách nhiệm file này)
- [`docs/02-architecture/web-portal-architecture.md`](../02-architecture/web-portal-architecture.md) — ⛔ FE dev phụ trách
- `app/` Flutter — ⛔ Flutter dev phụ trách

---

**END OF DOCUMENT**
