# 🧱 System Overview — LEAPS (VerveAI)

> **Phiên bản:** 1.4.5
> **Ngày:** 05/09/2026
> **Căn cứ:** BA v1.4.5 + ADR-0001, 0002, 0003

---

## 🎯 Đặc tính cốt lõi

- **Ưu tiên: `web-portal/` (Next.js)** — **ƯU TIÊN CAO NHẤT**. Xem [web-portal-architecture.md](./web-portal-architecture.md) để biết chi tiết.
- **`app/` (Flutter PWA)** — triển khai sau khi web-portal hoàn thành.
- **100% offline cho thiết bị HS** — không phụ thuộc cloud (AS-01..12).
- **Engine tất định** (Lớp 2 — TS-07) — chạy độc lập với LLM.
- **LLM cục bộ** (Lớp 1 & 3) — `[A]`, chờ Bài kiểm A & B.
- **Sync qua hub cục bộ** (SC-05 — chính) + **USB dự phòng** (SC-06 — bắt buộc).
- **Privacy-first**: ẩn danh tại hub (DR-08), chú thích GV là nguồn chuẩn (BR-17).

---

## 🌐 web-portal/ — Next.js (ƯU TIÊN CAO NHẤT)

> Chi tiết: [web-portal-architecture.md](./web-portal-architecture.md)

### Vai trò
- **Giao diện chính cho giáo viên** truy cập thông tin chẩn đoán.
- Dashboard, quản lý lớp, theo dõi tiến độ HS.
- **Ưu tiên Phase 1**: Frontend với mock data → kiểm chứng UX nhanh.

### Screens chính

| Screen | Route | FR liên quan |
|--------|-------|--------------|
| Dashboard GV | `/dashboard` | FR-15, FR-18 |
| Chi tiết lớp | `/class/[id]` | FR-01, FR-02 |
| Trang HS | `/student/[id]` | FR-03, FR-16 |
| **Bảng can thiệp** | `/interventions` | **FR-15, FR-16, FR-17** — cốt lõi |
| Chi tiết bằng chứng | `/evidence/[id]` | FR-07, FR-16 |
| Quản lý nội dung | `/content` | FR-19, FR-20 |
| Cài đặt | `/settings` | — |

### Admin Portal

| Screen | Route | SR liên quan |
|--------|-------|--------------|
| Dashboard Admin | `/admin` | SR-12, SR-15 |
| Quản lý người dùng | `/admin/users` | SR-14 |
| Quản lý lớp | `/admin/classes` | SR-12 |
| Báo cáo ẩn danh | `/admin/reports` | SR-15, SN-G-01 |
| Quản lý thiết bị | `/admin/devices` | NFR-18 |
| Cài đặt hệ thống | `/admin/settings` | — |

### Thứ tự phát triển (theo F.7)
1. **Frontend**: Dashboard + mock data → kiểm chứng UX
2. **Backend**: Node.js API, Prisma, NextAuth
3. **PWA offline**: Service Worker, IndexedDB

---

## 🗺️ Sơ đồ tổng quan

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    LEAPS (VerveAI) — 4 module độc lập                        │
│                                                                           │
│   ┌────────────────────────────────────┐   ┌──────────────────────────┐  │
│   │   web-portal/ (Next.js/TS)         │   │  content-pipeline/ (TS)  │  │
│   │   ───────────────────────────      │   │  ────────────────────    │  │
│   │   ƯU TIÊN CAO NHẤT               │   │  • Online               │  │
│   │   • Web portal cho GV             │   │  • Tác giả nội dung     │  │
│   │   • Dashboard, quản lý lớp       │   │  • Kiểm duyệt (NFR-23) │  │
│   │   • Online                       │   │  • Ký Ed25519 (TS-19/20)│  │
│   └────────────────────────────────────┘   └──────────┬───────────────┘  │
│                                                       │                 │
│   ┌────────────────────────────────────┐              │                 │
│   │   app/ (Flutter/Dart)              │              │                 │
│   │   ────────────────────────         │              │                 │
│   │   (ưu tiên sau web-portal)        │              │                 │
│   │   • Offline 100% cho HS            │              │                 │
│   │   • Có LLM cục bộ (qua FFI)      │              │                 │
│   └─────────────┬──────────────────────┘              │                 │
│                 │                                        │                 │
│                 │   ┌──────────────────────────┐        │                 │
│                 │   │  research/ (Python)     │        │                 │
│                 │   │  ────────────────────    │        │                 │
│                 │   │  • Bài kiểm A & B       │        │                 │
│                 │   │  • Kappa analysis        │        │                 │
│                 │   │  • BKT validation       │        │                 │
│                 │   └──────────────────────────┘        │                 │
│                 │                                        │                 │
│                 ▼                                        ▼                 │
│   ┌─────────────────────────────────────────────────────────────┐       │
│   │  USB (TS-19) — phân phối bundle nội dung + model            │       │
│   │  • .verveai-bundle.zip (ký Ed25519)                        │       │
│   │  • model-*.gguf (lượng tử 4-bit, Gemma)                    │       │
│   └─────────────────────────────────────────────────────────────┘       │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 app/ — App Flutter (L0)

### Kiến trúc 3 lớp (xem [ai-architecture.md](./ai-architecture.md))

```
┌────────────────────────────────────────────────────────────────┐
│                  LEAPS Flutter App (L0 — offline)             │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐                      │
│   │ Student │   │ Teacher │   │  Admin  │                      │
│   └────┬────┘   └────┬────┘   └────┬────┘                      │
│        └─────────────┼─────────────┘                            │
│                       ▼                                          │
│        Lớp 3 — Diễn đạt  (inference/expression/*.dart)        │
│                       ▼                                          │
│        Lớp 2 — Engine tất định (engine/*.dart — TS-07)        │
│                       ▼                                          │
│        Lớp 1 — Trích xuất (inference/extraction/*.dart)        │
│                       ▼                                          │
│        Storage (SQLite, append-only — TS-05)                    │
│                       ▼                                          │
│        Sync (hub mDNS SC-05 + USB SC-06 — TS-08/11)           │
└────────────────────────────────────────────────────────────────┘
```

### Trách nhiệm từng lớp

| Lớp | Module | Đặc điểm |
|-----|--------|----------|
| **UI** | `app/lib/ui/` | Material 3, i18n, a11y |
| **Lớp 3 — Diễn đạt** | `app/lib/inference/expression/` | Luôn qua `fact_check_guard` (AIR-24); HS dùng template đóng (BR-13) |
| **Lớp 2 — Tổng hợp & Quyết định** | `app/lib/engine/*.dart` | Tất định; Dart thuần; chạy độc lập với LLM |
| **Lớp 1 — Trích xuất** | `app/lib/inference/extraction/` | GBNF (TS-04); AIR-25 |
| **Storage** | `app/lib/storage/` | SQLite, append-only, integrity check (NFR-18) |
| **Sync** | `app/lib/hub/` + `app/lib/sync/` | Hub chính + USB dự phòng |

---

## 🌐 content-pipeline/ — TypeScript (online)

### Vai trò
- Tác giả nội dung (câu hỏi, kịch bản chẩn đoán).
- Kiểm duyệt tự động (auto-verify, age-appropriateness NFR-23).
- Đóng gói + ký Ed25519 để phân phối qua USB.

### Cấu trúc
```
content-pipeline/src/
├── authoring/
│   └── generate_variants.ts
├── auto-verify/
│   └── check_answer_correctness.ts
├── age-appropriateness/             # NFR-23
│   └── age_appropriateness_check.ts
├── review/                          # FR-20, SN-SC-03
│   └── review_queue.ts
└── export/
    ├── buildContentBundle.ts
    └── signBundle.ts                # Ed25519
```

### Quy trình
```
authoring → auto-verify → age-appropriateness → review (GV) → buildContentBundle → signBundle → .verveai-bundle.zip → USB → app/lib/bootstrap/content_installer.dart
```

---

## 🐍 research/ — Python (Bảng F.5)

### Vai trò
- **Bài kiểm A**: chất lượng trích xuất bằng chứng (Fleiss/Cohen kappa).
- **Bài kiểm B**: hiệu năng thiết bị (latency, RAM, pin).
- **Quyết định [A]**: PASS → `inference/` ra khỏi [A]; FAIL → điều chỉnh.

### Cấu trúc
```
research/
├── src/research/
│   ├── expert_agreement/kappa_analysis.py
│   ├── simulation/self_consistency_check.py       # TS-07
│   ├── reproducibility/exportForIndependentReview.py
│   └── model_eval/                                # Bảng F.5
│       ├── test_a_extraction_quality.py
│       ├── test_b_device_performance.py
│       └── ... (csv_loader, metrics, verdict, ...)
├── model-eval/                                    # Tài liệu + dữ liệu pilot
└── tests/                                         # Pytest
```

---

## 🔄 Quy trình tổng thể

```
1. Tác giả tạo nội dung (content-pipeline/authoring/)
2. Auto-verify + age-appropriateness (NFR-23)
3. GV rà soát (review-console/)
4. buildContentBundle + signBundle (Ed25519)
5. Copy .verveai-bundle.zip + model-*.gguf sang USB
6. Cài lên thiết bị HS qua bootstrap/content_installer.dart + model_installer.dart
7. App xác minh chữ ký qua content_security/signature_verify.dart
8. HS làm bài → evidence append-only → sync qua hub (hoặc USB)
9. GV xem báo cáo qua UI teacher (CO-T-01..09)
10. Pilot xong → chạy Bài kiểm A & B → quyết định cỡ model
```

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA Document v1.4.5](../VerveAI_BA_Document_v1.4.md)
- [WEB-PORTAL Architecture](./web-portal-architecture.md) — **MỚI** — Chi tiết đầy đủ về màn hình, tính năng, API, components
- [ADR-0001 Tech Stack](./adr/0001-tech-stack-selection.md)
- [ADR-0002 Sync](./adr/0002-sync-strategy.md)
- [ADR-0003 AI 3 lớp](./adr/0003-local-ai-architecture.md)
- [AI Architecture](./ai-architecture.md)
- [Privacy Architecture](./privacy-architecture.md)
- [Sync Architecture](./sync-architecture.md)
- [Teacher Guide](../06-user/teacher-guide.md)
- [Admin Guide](../06-user/admin-guide.md)

---

**END OF DOCUMENT**
