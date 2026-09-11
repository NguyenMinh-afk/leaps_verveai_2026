# 🧱 System Overview — LEAPS (VerveAI)

> **Phiên bản:** 1.4.5
> **Ngày:** 09/09/2026
> **Căn cứ:** BA v1.4.5 + ADRs 0001, 0002, 0003, **0004, 0005, 0006**

---

## 🎯 Đặc tính cốt lõi

- **Ưu tiên: `web-portal/` (Next.js)** — **ƯU TIÊN CAO NHẤT**. Xem [web-portal-architecture.md](./web-portal-architecture.md) để biết chi tiết.
- **Ưu tiên: `service/` (Microservice)** — **ƯU TIÊN CAO** (Phase 2). 5 service + Gateway + Consul.
- **`app/` (Flutter PWA)** — triển khai sau khi web-portal + service hoàn thành.
- **100% offline cho thiết bị HS** — không phụ thuộc cloud (AS-01..12).
- **Engine tất định** (Lớp 2 — TS-07) — chạy độc lập với LLM.
- **LLM cục bộ** (Lớp 1 & 3) — `[A]`, chờ Bài kiểm A & B.
- **Sync qua hub cục bộ** (SC-05 — chính) + **USB dự phòng** (SC-06 — bắt buộc).
- **Privacy-first**: ẩn danh tại hub (DR-08), chú thích GV là nguồn chuẩn (BR-17).

---

## 🌐 Sơ đồ kiến trúc tổng quan

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                    LEAPS (VerveAI) — 4 module độc lập                                   │
│                                                                                       │
│   ┌────────────────────────────────────┐   ┌──────────────────────────────────────┐  │
│   │   web-portal/ (Next.js/TS)         │   │  content-pipeline/ (TS)              │  │
│   │   ───────────────────────────      │   │  ────────────────────────────        │  │
│   │   ƯU TIÊN CAO NHẤT               │   │  • Online                          │  │
│   │   • Dashboard GV, quản lý lớp     │   │  • Tác giả nội dung                │  │
│   │   • Gọi Gateway (8080)            │   │  • Kiểm duyệt (NFR-23)            │  │
│   └────────────────────────────────────┘   │  • Ký Ed25519 (TS-19/20)            │  │
│                                            └──────────────────────────────────────┘  │
│   ┌────────────────────────────────────┐   ┌──────────────────────────────────────┐  │
│   │   service/ (Node.js Microservice)   │   │  research/ (Python)                 │  │
│   │   ────────────────────────────────  │   │  ────────────────────────────      │  │
│   │   ⭐ MỚI — Phase 2                 │   │  • Bài kiểm A & B                  │  │
│   │   • Gateway (8080)                  │   │  • Kappa analysis                   │  │
│   │   • Consul (8500)                  │   │  • BKT validation                   │  │
│   │   • 5 service (3001-3005)         │   │                                    │  │
│   │   • PostgreSQL (5 schema)          │   │                                    │  │
│   └────────────────────────────────────┘   └──────────────────────────────────────┘  │
│                                                                                       │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│   │  app/ (Flutter/Dart)                                                               │ │
│   │  ─────────────────────────────────────────────────────────────────────────────── │ │
│   │  (ưu tiên sau web-portal + service)                                              │ │
│   │  • Offline 100% cho HS                                                            │ │
│   │  • Hub SC-05 + USB SC-06                                                         │ │
│   └──────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                       │
│   ┌──────────────────────────────────────────────────────────────────────────────────┐ │
│   │  USB (TS-19) — phân phối bundle nội dung + model                                  │ │
│   │  • .verveai-bundle.zip (ký Ed25519)                                              │ │
│   │  • model-*.gguf (lượng tử 4-bit, Gemma)                                          │ │
│   └──────────────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌐 service/ — Microservice Architecture ⭐ MỚI

### Sơ đồ chi tiết

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  web-portal/ (Next.js)                                                                  │
│  Browser → http://gateway:8080/api/...                                                   │
└────────────────────────────────┬───────────────────────────────────────────────────────┘
                                 │
┌────────────────────────────────▼───────────────────────────────────────────────────────┐
│  gateway/ (Express Gateway - port 8080)                                                  │
│  ───────────────────────────────────────────────────────────────────────────────────── │
│  • JWT verify (single point)                                                             │
│  • Rate limit (100 req/min auth, 1000 req/min API)                                       │
│  • CORS whitelist                                                                       │
│  • Metrics → Prometheus                                                                 │
│  • Tracing → OpenTelemetry → Jaeger                                                      │
└────────────────────────────────┬───────────────────────────────────────────────────────┘
                                 │
                        Consul DNS (port 8500)
                        ─────────────────────────────
                        • Service registration
                        • Health check (every 10s)
                        • DNS-based discovery (svc-*.local)
                                 │
        ┌──────────┬──────────────┼──────────────┬──────────┐
        │          │              │              │          │
┌───────▼──┐ ┌────▼─────┐ ┌──────▼────┐ ┌─────▼─────┐ ┌──▼─────────┐
│svc-auth   │ │svc-bkt    │ │svc-class   │ │svc-content│ │svc-sync    │
│:3001      │ │:3002      │ │:3003       │ │:3004      │ │:3005       │
│Dev 1      │ │Dev 2      │ │Dev 3       │ │Dev 1      │ │Dev 3       │
│           │ │           │ │           │ │           │ │           │
│• Login    │ │• BKT      │ │• Classes  │ │• Content │ │• Sync     │
│• Users    │ │• Diagnose │ │• Students│ │• Bundles │ │• Devices │
│• JWT      │ │• Evidence │ │• Progress│ │• Review  │ │• Conflicts│
│           │ │• Interven │ │           │ │• Reports │ │           │
└─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
      │             │             │             │             │
      └─────────────┴─────────────┴─────────────┴─────────────┘
                                │
              ┌─────────────────┴─────────────────┐
              │                                   │
      ┌───────▼───────┐                 ┌───────▼───────┐
      │ PostgreSQL     │                 │ Jaeger         │
      │ (5 schema)    │                 │ (tracing)      │
      │ • auth        │                 │ port 16686     │
      │ • bkt         │                 └────────────────┘
      │ • class       │
      │ • content     │
      │ • sync        │
      └───────────────┘
```

### 5 Service — Chi tiết

| Service | Port | Dev | Schema | Routes |
|---------|------|-----|--------|--------|
| `svc-auth` | 3001 | Dev 1 | `auth` | `/api/auth/*`, `/api/users/*` |
| `svc-bkt` | 3002 | Dev 2 | `bkt` | `/api/bkt/*` |
| `svc-class` | 3003 | Dev 3 | `class` | `/api/class/*` |
| `svc-content` | 3004 | Dev 1 | `content` | `/api/content/*` |
| `svc-sync` | 3005 | Dev 3 | `sync` | `/api/sync/*` |

→ Xem chi tiết tại [`service/WORK_SPLIT.md`](../../service/WORK_SPLIT.md)

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
|------|--------|----------|
| **UI** | `app/lib/ui/` | Material 3, i18n, a11y |
| **Lớp 3 — Diễn đạt** | `app/lib/inference/expression/` | Luôn qua `fact_check_guard` (AIR-24); HS dùng template đóng (BR-13) |
| **Lớp 2 — Tổng hợp & Quyết định** | `app/lib/engine/*.dart` | Tất định; Dart thuần; chạy độc lập với LLM |
| **Lớp 1 — Trích xuất** | `app/lib/inference/extraction/` | GBNF (TS-04); AIR-25; **[A]** |
| **Storage** | `app/lib/storage/` | SQLite, append-only, integrity check (NFR-18) |
| **Sync** | `app/lib/hub/` + `app/lib/sync/` | Hub chính + USB dự phòng |

---

## 🌐 content-pipeline/ — TypeScript (online)

### Vai trò
- Tác giả nội dung (câu hỏi, kịch bản chẩn đoán)
- Kiểm duyệt tự động (auto-verify, age-appropriateness NFR-23)
- Đóng gói + ký Ed25519 để phân phối qua USB

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
- **Bài kiểm A**: chất lượng trích xuất bằng chứng (Fleiss/Cohen kappa)
- **Bài kiểm B**: hiệu năng thiết bị (latency, RAM, pin)
- **Quyết định [A]**: PASS → `inference/` ra khỏi [A]; FAIL → điều chỉnh

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
1. service/ (Phase 2) — Setup 5 microservice + Gateway + Consul
   ├── svc-auth (3001) — Auth + Users
   ├── svc-bkt (3002) — BKT + Diagnosis + Evidence
   ├── svc-class (3003) — Classes + Students + Progress
   ├── svc-content (3004) — Content + Bundles + Review + Reports
   └── svc-sync (3005) — Sync + Devices
       ↓
2. web-portal/ (Phase 1) — Dashboard GV + mock data → Gateway (8080)
   ↓
3. content-pipeline/ — authoring → auto-verify → review → buildContentBundle → signBundle (Ed25519)
   ↓
4. USB distribution — Copy .verveai-bundle.zip + model-*.gguf sang USB
   ↓
5. app/ bootstrap — content_installer.dart + model_installer.dart cài từ USB
   ↓
6. app/ xác minh — signature_verify.dart từ chối nội dung không hợp lệ
   ↓
7. HS làm bài → evidence append-only → sync qua hub (hoặc USB)
   ↓
8. GV xem báo cáo qua web-portal (→ Gateway → service/)
   ↓
9. Pilot xong → chạy Bài kiểm A & B → quyết định cỡ model
```

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA Document v1.4.5](../VerveAI_BA_Document_v1.4.md)
- [`service/WORK_SPLIT.md`](../../service/WORK_SPLIT.md) — ⭐ Phân chia 5 microservice (canonical)
- [WEB-PORTAL Architecture](./web-portal-architecture.md) — **MỚI** — Chi tiết đầy đủ về màn hình, tính năng, API, components
- [ADR-0001 Tech Stack](./adr/0001-tech-stack-selection.md)
- [ADR-0002 Sync](./adr/0002-sync-strategy.md)
- [ADR-0003 AI 3 lớp](./adr/0003-local-ai-architecture.md)
- [ADR-0004 Microservices Architecture](./adr/0004-microservices-architecture.md) ⭐ MỚI
- [ADR-0005 Service Discovery (Consul)](./adr/0005-service-discovery.md) ⭐ MỚI
- [ADR-0006 API Gateway (Express Gateway)](./adr/0006-api-gateway.md) ⭐ MỚI
- [AI Architecture](./ai-architecture.md)
- [Privacy Architecture](./privacy-architecture.md)
- [Sync Architecture](./sync-architecture.md)
- [Teacher Guide](../06-user/teacher-guide.md)
- [Admin Guide](../06-user/admin-guide.md)

---

**END OF DOCUMENT**
