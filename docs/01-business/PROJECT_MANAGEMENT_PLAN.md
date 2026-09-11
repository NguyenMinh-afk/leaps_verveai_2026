# 📅 PROJECT MANAGEMENT PLAN
# LEAPS — Local Educational Adaptive Personalization System

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản:** 1.4.5
> **Ngày:** 09/09/2026
> **Căn cứ:** BA Document v1.4.5 + ADRs 0001, 0002, 0003, **0004, 0005, 0006**

---

## 🎯 TỔNG QUAN

**LEAPS (VerveAI)** được triển khai theo **ưu tiên sau**:
1. **`web-portal/` (Next.js/TypeScript)** — **ƯU TIÊN CAO NHẤT**: web portal cho giáo viên
2. **`service/` (Node.js Microservices)** — **ƯU TIÊN CAO**: 5 microservice + Gateway + Consul
3. **`app/` (Flutter PWA)** — làm sau khi web-portal + service hoàn thành

---

## 🗺️ LỘ TRÌNH ƯU TIÊN

```
Ưu tiên CAO NHẤT           Ưu tiên CAO                    Ưu tiên sau
══════════════════════       ════════════════════════        ════════════════════════
web-portal/ (Next.js)       service/ (5 microservice)       app/ (Flutter PWA)
├── Dashboard GV            ├── Gateway (8080)              ├── Phase 1: Bài kiểm mỏng nhất
├── Quản lý lớp           ├── Consul (8500)              ├── Phase 2: Lớp 2 tất định
├── Theo dõi tiến độ      ├── svc-auth (3001) Dev 1       ├── Phase 3: Storage + Hub
└── Triển khai nhanh      ├── svc-bkt (3002) Dev 2        ├── Phase 4: UI GV + Admin
                            ├── svc-class (3003) Dev 3     └── Phase 5: Lớp 1 & 3 — sau A&B
                            ├── svc-content (3004) Dev 1
                            └── svc-sync (3005) Dev 3
```

---

## 🗺️ LỘ TRÌNH PHASE — service/ (Microservice) ⭐ MỚI

```
Phase 2.1              Phase 2.2               Phase 2.3               Phase 2.4
[Infrastructure]       [Core Services]          [Integration]           [Polishing]
═══════════════        ════════════════         ════════════════         ════════════════
Docker compose          svc-auth + svc-bkt       Gateway routing          Full stack test
+ Consul               + svc-class             + Auth flow             + Load test
+ Jaeger               + svc-content           + Consul DNS             + Documentation
+ Prometheus           + svc-sync             + Circuit breaker
```

---

## 🗺️ LỘ TRÌNH PHASE — app/ (Flutter)

```
Phase 1 (F.7)         Phase 2              Phase 3              Phase 4          Phase 5
[Bài kiểm mỏng nhất]  [Lớp 2 tất định]    [Storage + Hub]       [UI GV + Admin]  [Lớp 1 & 3 — sau A&B]
═══════════════       ════════════════      ════════════════     ════════════════  ════════════════
Flutter               BKT                  SQLite               CO-T-01..09       inference/ ra [A]
+ llama.cpp FFI       + diagnose           append-only          + data_governance cỡ model:
+ 1 model 4-bit       + item_selection     + hub mDNS           + UI admin        4B → 2B → 1B
đo thiết bị thật:     + grouping           + USB exchange                          (AS-61)
- thời gian           + knowledge_graph    + Ed25519 verify
- RAM đỉnh            + versioning
- dung lượng          + transfer (FR-26)
- pin
```

---

## 📋 PHASE 2 — Microservice Backend ⭐ MỚI

### Phase 2.1 — Infrastructure (Tuần 1)

**Mục tiêu:** Setup môi trường dev cho 5 service.

### Deliverables
- [ ] `infra/docker-compose.yml` — PostgreSQL + Consul + Jaeger + Prometheus
- [ ] `service/shared/` — 6 shared packages (consul-client, circuit-breaker, jwt-utils, prisma-schema, tracing, error-types)
- [ ] `service/gateway/` — Express Gateway skeleton
- [ ] CI pipeline cho shared code
- [ ] Database schema design — 5 schema (auth, bkt, class, content, sync)

### Phase 2.2 — Core Services (Tuần 2-3)

**Mục tiêu:** Implement 5 microservice theo WORK_SPLIT.md.

### Deliverables
- [ ] `service/service-auth/` — Auth + Users CRUD + JWT (Dev 1)
- [ ] `service/service-bkt/` — BKT engine + Diagnosis + Evidence + Interventions + Skills (Dev 2)
- [ ] `service/service-class/` — Classes + Students + Progress (Dev 3)
- [ ] `service/service-content/` — Content + Bundles + Review + Reports (Dev 1)
- [ ] `service/service-sync/` — Sync + Devices + Conflict resolution (Dev 3)
- [ ] Mỗi service đăng ký với Consul tự động
- [ ] Mỗi service có `/health` endpoint cho Consul health check

### Phase 2.3 — Integration (Tuần 4)

**Mục tiêu:** Kết nối 5 service qua Gateway + Consul DNS.

### Deliverables
- [ ] Gateway routing config — tất cả `/api/*` → service tương ứng
- [ ] JWT verification tại Gateway
- [ ] Rate limiting tại Gateway
- [ ] Inter-service communication qua Consul DNS + Circuit Breaker
- [ ] OpenTelemetry tracing từ Gateway → Service → Database
- [ ] Prometheus metrics từ Gateway + mỗi service
- [ ] Integration test: full auth flow qua Gateway

### Phase 2.4 — Polishing (Tuần 5)

**Mục tiêu:** Test + Documentation.

### Deliverables
- [ ] Load test — 100 concurrent users
- [ ] Chaos test — kill 1 service, verify circuit breaker
- [ ] Full documentation — README cho mỗi service
- [ ] API documentation — OpenAPI/Swagger
- [ ] Runbook cho vận hành

---

## 📋 PHASE 1 — Bài kiểm mỏng nhất (F.7) — 2 tuần

**Mục tiêu**: Đo khả thi trên thiết bị thật **trước khi code UI**.

### Deliverables
- [ ] `app/lib/inference/ffi/llama_bindings.dart` — bind `libllama.so`
- [ ] `app/lib/inference/grammar/extraction_schema.gbnf` — schema nhãn đóng
- [ ] `app/lib/inference/extraction/extract_evidence.dart` — gọi LLM + parse JSON
- [ ] APK thử nghiệm (chỉ đọc 1 bài làm → in kết quả)
- [ ] Bảng đo: thời gian / RAM / dung lượng / pin — cho 30 bài trên 3 thiết bị

### Quyết định
- Nếu latency p95 > 2s hoặc RAM > 1.5GB → hạ cỡ model
- Nếu pin tụt > 5%/30 lượt → cần giảm prompt hoặc cache

---

## 📋 PHASE 2 — Lớp 2 tất định (TS-07) — 6 tuần

**Mục tiêu**: Engine chạy độc lập với LLM, có test idempotent.

### Deliverables
- [ ] `app/lib/engine/mastery/bkt.dart` — BKT với 4 tham số const
- [ ] `app/lib/engine/diagnose/` — hypothesis ranking, abstention, FR-25
- [ ] `app/lib/engine/item_selection/` — next best item, FR-24
- [ ] `app/lib/engine/remediation/` — plan + hold-out check
- [ ] `app/lib/engine/grouping/cluster_by_root_cause.dart` — BR-07/08
- [ ] `app/lib/engine/knowledge_graph/` — TS-06
- [ ] `app/lib/engine/transfer/student_transfer.dart` — FR-26
- [ ] Test ≥ 80% cho `engine/`, ≥ 90% cho `bkt.dart`

---

## 📋 PHASE 3 — Storage + Hub — 4 tuần

**Mục tiêu**: SQLite append-only, hub cục bộ, USB exchange.

### Deliverables
- [ ] `app/lib/storage/` — SQLite, sqflite + sqflite_common_ffi
- [ ] `app/lib/hub/` — server, discovery, crypto, logical clock, backup (NFR-22)
- [ ] `app/lib/sync/` — file exchange, chunked, strategy resolver
- [ ] `app/lib/content_security/signature_verify.dart` — Ed25519
- [ ] `app/lib/bootstrap/` — installer (AS-28, TS-19/20)
- [ ] Test ≥ 85% cho `hub/` + `sync/`, ≥ 80% cho `storage/`

---

## 📋 PHASE 4 — UI GV + Admin — 4 tuần

**Mục tiêu**: UI giáo viên + admin (chưa có UI học sinh — chờ OS-03).

### Deliverables
- [ ] `app/lib/ui/teacher/` — profile switcher, intervention dashboard, printable report (TS-12, SC-08)
- [ ] `app/lib/ui/admin/data_governance_panel.dart` — export/delete (FR-21, DR-09)
- [ ] `app/lib/ui/shared/` — widget dùng chung
- [ ] Test ≥ 70% cho UI components

### Lưu ý
- ⛔ KHÔNG code `app/lib/ui/student/` cho đến khi **OS-03** (G.9 vùng #1 kèm theo) được chốt

---

## 📋 PHASE 5 — Lớp 1 & 3 — 6 tuần (sau Bài kiểm A & B)

**Mục tiêu**: Đưa `inference/` ra khỏi **[A]**, chốt cỡ model.

### Điều kiện tiên quyết
- ✅ **Bài kiểm A PASS**: Fleiss ≥ 0.70, Cohen ≥ 0.60, Macro F1 ≥ 0.65
- ✅ **Bài kiểm B PASS**: latency p95 ≤ 2s, RAM ≤ 1.5GB, pin ≤ 5%/30 lượt
- ✅ Cỡ model đã chốt (4B → 2B → 1B theo AS-61)

### Deliverables
- [ ] `app/lib/inference/extraction/extract_evidence.dart` — Lớp 1, dùng GBNF
- [ ] `app/lib/inference/expression/` — Lớp 3, qua `fact_check_guard`
- [ ] `app/lib/inference/model_manager.dart` — quản lý GGUF
- [ ] Test ≥ 60% cho `inference/` (mock qua subclass override, **KHÔNG mocktail**)

---

## 📊 MILESTONES

| # | Mốc | Thời điểm (ước lượng) | Tiêu chí đạt |
|---|-----|------------------------|--------------|
| M1 | web-portal Phase 1 | Tuần 2 | Dashboard + mock data, UX validated |
| M2 | service/ Phase 2.1 | Tuần 1 | Docker compose up, Consul + Jaeger running |
| M3 | service/ Phase 2.2 | Tuần 3 | 5 service up, health checks green |
| M4 | service/ Phase 2.3 | Tuần 4 | Gateway routing, full auth flow |
| M5 | service/ Phase 2.4 | Tuần 5 | Load test pass, docs complete |
| M6 | app/ Phase 1 (F.7) | Tuần 6 | Bài kiểm mỏng nhất chạy được trên thiết bị thật |
| M7 | app/ Phase 2 | Tuần 12 | Lớp 2 pass test ≥ 80% |
| M8 | app/ Phase 3 | Tuần 16 | Sync round-trip offline |
| M9 | app/ Phase 4 | Tuần 20 | Pilot GV/HS đầu tiên |
| M10 | app/ Phase 5 | Tuần 26 | Lớp 1 & 3 ra [A], cỡ model đã chốt |

---

## 👥 ROLES VÀ PHÂN CÔNG

| Vai trò | Trách nhiệm | Module |
|---------|-------------|--------|
| **Tech Lead** | ADRs, kiến trúc microservice, review code, Gateway | service/, web-portal/ |
| **Dev 1** | `service-auth/` (3001) + `service-content/` (3004) | service/ |
| **Dev 2** | `service-bkt/` (3002) | service/ |
| **Dev 3** | `service-class/` (3003) + `service-sync/` (3005) | service/ |
| **Web Dev** | `web-portal/` (Next.js/TypeScript) | web-portal/ |
| **Flutter Dev** | `app/lib/engine/`, `app/lib/storage/`, `app/lib/ui/teacher/` | app/ |
| **AI Engineer** | `app/lib/inference/`, Bài kiểm A | app/, research/ |
| **DevOps** | Build, USB distribution, post-mortems, CI/CD | service/, infra/ |
| **Researcher** | `research/`, Bài kiểm A & B, kappa | research/ |
| **PM/PO** | Pilot, stakeholder feedback | - |

---

## 🚫 CẤM trong mọi phase

- ❌ Bỏ qua Phase 2 (service/) — code UI trước khi backend ready
- ❌ Bỏ qua Phase 1 (app/ F.7) — code UI trước khi đo thiết bị thật
- ❌ Đưa `inference/` ra khỏi **[A]** trước khi Bài kiểm A & B đạt ngưỡng
- ❌ Code `app/lib/ui/student/` trước khi OS-03 chốt
- ❌ Backend cloud (LEAPS chạy 100% offline cho app)
- ❌ Coi SC-06 (USB exchange) là tuỳ chọn
- ❌ Dùng `backend/` (monolith) — phải dùng `service/service-*`
- ❌ Hardcode URL service — phải dùng Consul DNS
- ❌ Gọi service trực tiếp từ web-portal — phải qua Gateway

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA Document v1.4.5](../VerveAI_BA_Document_v1.4.md)
- [`service/WORK_SPLIT.md`](../service/WORK_SPLIT.md) — ⭐ Phân chia 5 microservice (canonical)
- [PROJECT_STRUCTURE](./PROJECT_STRUCTURE.md)
- [ADR-0001 Tech Stack](../02-architecture/adr/0001-tech-stack-selection.md)
- [ADR-0002 Sync](../02-architecture/adr/0002-sync-strategy.md)
- [ADR-0003 AI 3 lớp](../02-architecture/adr/0003-local-ai-architecture.md)
- [ADR-0004 Microservices Architecture](../02-architecture/adr/0004-microservices-architecture.md) ⭐ MỚI
- [ADR-0005 Service Discovery (Consul)](../02-architecture/adr/0005-service-discovery.md) ⭐ MỚI
- [ADR-0006 API Gateway (Express Gateway)](../02-architecture/adr/0006-api-gateway.md) ⭐ MỚI

---

**END OF DOCUMENT**
