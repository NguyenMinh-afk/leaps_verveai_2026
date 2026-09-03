# 📅 PROJECT MANAGEMENT PLAN
# LEAPS — Local Educational Adaptive Personalization System

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản:** 1.4.5
> **Ngày:** 05/09/2026
> **Căn cứ:** BA Document v1.4.5 + ADRs 0001, 0002, 0003

---

## 🎯 TỔNG QUAN

**LEAPS (VerveAI)** được triển khai theo **ưu tiên sau**:
1. **`web-portal/` (Next.js/TypeScript)** — **ƯU TIÊN CAO NHẤT**: web portal cho giáo viên
2. **`app/` (Flutter PWA)** — làm sau khi web-portal hoàn thành

---

## 🗺️ LỘ TRÌNH ƯU TIÊN

```
Ưu tiên CAO NHẤT           Ưu tiên sau
══════════════════════       ═══════════════════════
web-portal/ (Next.js)       app/ (Flutter PWA)
├── Dashboard GV            ├── Phase 1: Bài kiểm mỏng nhất
├── Quản lý lớp           ├── Phase 2: Lớp 2 tất định
├── Theo dõi tiến độ       ├── Phase 3: Storage + Hub
└── Triển khai nhanh       └── Phase 4: UI GV + Admin
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

## PHASE 1 — Bài kiểm mỏng nhất (F.7) — 2 tuần

**Mục tiêu**: Đo khả thi trên thiết bị thật **trước khi code UI**.

### Deliverables
- [ ] `app/lib/inference/ffi/llama_bindings.dart` — bind `libllama.so`.
- [ ] `app/lib/inference/grammar/extraction_schema.gbnf` — schema nhãn đóng.
- [ ] `app/lib/inference/extraction/extract_evidence.dart` — gọi LLM + parse JSON.
- [ ] APK thử nghiệm (chỉ đọc 1 bài làm → in kết quả).
- [ ] Bảng đo: thời gian / RAM / dung lượng / pin — cho 30 bài trên 3 thiết bị.

### Quyết định
- Nếu latency p95 > 2s hoặc RAM > 1.5GB → hạ cỡ model.
- Nếu pin tụt > 5%/30 lượt → cần giảm prompt hoặc cache.

---

## PHASE 2 — Lớp 2 tất định (TS-07) — 6 tuần

**Mục tiêu**: Engine chạy độc lập với LLM, có test idempotent.

### Deliverables
- [ ] `app/lib/engine/mastery/bkt.dart` — BKT với 4 tham số const.
- [ ] `app/lib/engine/diagnose/` — hypothesis ranking, abstention, FR-25.
- [ ] `app/lib/engine/item_selection/` — next best item, FR-24.
- [ ] `app/lib/engine/remediation/` — plan + hold-out check.
- [ ] `app/lib/engine/grouping/cluster_by_root_cause.dart` — BR-07/08.
- [ ] `app/lib/engine/knowledge_graph/` — TS-06.
- [ ] `app/lib/engine/transfer/student_transfer.dart` — FR-26.
- [ ] Test ≥ 80% cho `engine/`, ≥ 90% cho `bkt.dart`.

### Validation
- `python -m research.simulation.self_consistency_check` — validate BKT.

---

## PHASE 3 — Storage + Hub — 4 tuần

**Mục tiêu**: SQLite append-only, hub cục bộ, USB exchange.

### Deliverables
- [ ] `app/lib/storage/` — SQLite, sqflite + sqflite_common_ffi.
- [ ] `app/lib/hub/` — server, discovery, crypto, logical clock, backup (NFR-22).
- [ ] `app/lib/sync/` — file exchange, chunked, strategy resolver.
- [ ] `app/lib/content_security/signature_verify.dart` — Ed25519.
- [ ] `app/lib/bootstrap/` — installer (AS-28, TS-19/20).
- [ ] Test ≥ 85% cho `hub/` + `sync/`, ≥ 80% cho `storage/`.

---

## PHASE 4 — UI GV + Admin — 4 tuần

**Mục tiêu**: UI giáo viên + admin (chưa có UI học sinh — chờ OS-03).

### Deliverables
- [ ] `app/lib/ui/teacher/` — profile switcher, intervention dashboard, printable report (TS-12, SC-08).
- [ ] `app/lib/ui/admin/data_governance_panel.dart` — export/delete (FR-21, DR-09).
- [ ] `app/lib/ui/shared/` — widget dùng chung.
- [ ] Test ≥ 70% cho UI components.

### Lưu ý
- ⛔ KHÔNG code `app/lib/ui/student/` cho đến khi **OS-03** (G.9 vùng #1 kèm theo) được chốt.

---

## PHASE 5 — Lớp 1 & 3 — 6 tuần (sau Bài kiểm A & B)

**Mục tiêu**: Đưa `inference/` ra khỏi **[A]**, chốt cỡ model.

### Điều kiện tiên quyết
- ✅ **Bài kiểm A PASS**: Fleiss ≥ 0.70, Cohen ≥ 0.60, Macro F1 ≥ 0.65.
- ✅ **Bài kiểm B PASS**: latency p95 ≤ 2s, RAM ≤ 1.5GB, pin ≤ 5%/30 lượt.
- ✅ Cỡ model đã chốt (4B → 2B → 1B theo AS-61).

### Deliverables
- [ ] `app/lib/inference/extraction/extract_evidence.dart` — Lớp 1, dùng GBNF.
- [ ] `app/lib/inference/expression/` — Lớp 3, qua `fact_check_guard`.
- [ ] `app/lib/inference/model_manager.dart` — quản lý GGUF.
- [ ] Test ≥ 60% cho `inference/` (mock qua subclass override, **KHÔNG mocktail**).

---

## 📊 MILESTONES

| # | Mốc | Thời điểm (ước lượng) | Tiêu chí đạt |
|---|-----|------------------------|--------------|
| M1 | Bài kiểm mỏng nhất chạy được | Cuối Phase 1 | Đo được 4 metric trên ≥ 3 thiết bị |
| M2 | Lớp 2 pass test ≥ 80% | Cuối Phase 2 | `flutter test` xanh, idempotent |
| M3 | Sync round-trip offline | Cuối Phase 3 | HS ghi bằng chứng → hub → GV đọc |
| M4 | Pilot GV/HS đầu tiên | Cuối Phase 4 | ≥ 1 lớp thật dùng app 1 tuần |
| M5 | Lớp 1 & 3 ra [A] | Cuối Phase 5 | Bài kiểm A & B PASS, cỡ model đã chốt |

---

## 👥 ROLES

| Vai trò | Trách nhiệm |
|---------|-------------|
| **Tech Lead** | ADRs, kiến trúc, review code |
| **Web Dev** | `web-portal/` (Next.js/TypeScript) — dashboard, quản lý lớp |
| **Flutter Dev** | `app/lib/engine/`, `app/lib/storage/`, `app/lib/ui/teacher/` |
| **AI Engineer** | `app/lib/inference/`, Bài kiểm A |
| **DevOps** | Build, USB distribution, post-mortems |
| **Researcher** | `research/`, Bài kiểm A & B, kappa |
| **PM/PO** | Pilot, stakeholder feedback |

---

## 🚫 CẤM trong mọi phase

- ❌ Bỏ qua Phase 1 — code UI trước khi đo thiết bị thật.
- ❌ Đưa `inference/` ra khỏi **[A]** trước khi Bài kiểm A & B đạt ngưỡng.
- ❌ Code `app/lib/ui/student/` trước khi OS-03 chốt.
- ❌ Backend cloud (LEAPS chạy 100% offline).
- ❌ Coi SC-06 (USB exchange) là tuỳ chọn.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA Document v1.4.5](../VerveAI_BA_Document_v1.4.md)
- [Project Structure](./PROJECT_STRUCTURE.md)
- [ADR-0001 Tech Stack](../02-architecture/adr/0001-tech-stack-selection.md)
- [ADR-0002 Sync](../02-architecture/adr/0002-sync-strategy.md)
- [ADR-0003 AI 3 lớp](../02-architecture/adr/0003-local-ai-architecture.md)

---

**END OF DOCUMENT**
