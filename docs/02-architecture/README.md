# 🏗️ Architecture Documentation

# Tài liệu kiến trúc hệ thống **LEAPS (VerveAI)**.

## Cấu trúc

| Thư mục | Nội dung |
|---------|----------|
| [adr/](./adr/) | Architecture Decision Records — lý do & hệ quả |
| [system-overview.md](./system-overview.md) | Sơ đồ tổng quan (4 module: web-portal, app, content-pipeline, research) |
| [privacy-architecture.md](./privacy-architecture.md) | Bảng BR/DR/NFR + cách áp dụng trong code |
| [sync-architecture.md](./sync-architecture.md) | SC-05 hub + SC-06 USB (chi tiết) |
| [ai-architecture.md](./ai-architecture.md) | AI 3 lớp (L1/L2/L3) + GBNF + fact_check_guard |

## Ưu tiên phát triển

| Ưu tiên | Module | Ghi chú |
|---------|--------|---------|
| **CAO NHẤT** | `web-portal/` (Next.js) | Web portal cho giáo viên |
| Sau | `app/` (Flutter) | PWA offline, triển khai sau |

## ADR Index

| ID | Tiêu đề | Status | Ngày |
|----|---------|--------|------|
| [ADR-0001](./adr/0001-tech-stack-selection.md) | Tech Stack Selection (Flutter/Dart) | ✅ [A] Accepted | 25/08/2026 |
| [ADR-0002](./adr/0002-sync-strategy.md) | Sync Strategy (SC-05 + SC-06) | ✅ [A] Accepted | 25/08/2026 |
| [ADR-0003](./adr/0003-local-ai-architecture.md) | Local AI Architecture (3 lớp) | ✅ [A] Accepted | 25/08/2026 |

> **[A]** = chọn tạm cho pilot, chờ Bài kiểm A & B (Bảng F.5) xác nhận.

## Đọc theo vai trò

| Vai trò | File đầu tiên |
|---------|--------------|
| Tech Lead | system-overview.md → ADRs → privacy-architecture.md |
| Backend / Flutter Dev | sync-architecture.md + ai-architecture.md |
| Privacy / Security | privacy-architecture.md |
| Researcher | ai-architecture.md (Lớp 1 & 3) |
