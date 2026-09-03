# 🎓 LEAPS Documentation

Tài liệu dự án **LEAPS** — *Local Educational Adaptive Personalization System* (Hệ thống hỗ trợ học tập thích ứng cho lớp học đa trình độ).

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản BA:** v1.4.5
> **Ngày cập nhật:** 05/09/2026

---

## 🎯 Ưu tiên phát triển

| Ưu tiên | Module | Mô tả |
|---------|--------|-------|
| **CAO NHẤT** | `web-portal/` | Next.js web portal cho giáo viên (dashboard, quản lý lớp) |
| Pilot | `app/` | Flutter app — phát triển sau khi web-portal hoàn thành |

---

## Cấu trúc

| Thư mục | Nội dung |
|---------|----------|
| [01-business](./01-business/) | BA Document, Project Structure, Project Management Plan, Stakeholders |
| [02-architecture](./02-architecture/) | ADRs, system overview, sync strategy, AI 3 lớp |
| [03-development](./03-development/) | Coding standards (Dart/TS/Python), Git workflow, testing, troubleshooting |
| [04-operations](./04-operations/) | Build & deploy qua USB, integrity check, post-mortems, runbook |
| [05-research](./05-research/) | Bài kiểm A & B (Bảng F.5), kappa analysis, BKT validation |
| [06-user](./06-user/) | Hướng dẫn giáo viên, học sinh, admin; FAQ |

---

## Bắt đầu từ đâu?

| Vai trò | Đọc theo thứ tự |
|---------|-----------------|
| **Developer mới** | [01-business/PROJECT_STRUCTURE.md](./01-business/PROJECT_STRUCTURE.md) → [02-architecture/](./02-architecture/) → [03-development/](./03-development/) |
| **Architect / Tech Lead** | [VerveAI_BA_Document_v1.4.md](../VerveAI_BA_Document_v1.4.md) → [02-architecture/adr/](./02-architecture/adr/) |
| **DevOps / Triển khai** | [04-operations/](./04-operations/) |
| **Researcher / GV chấm pilot** | [05-research/](./05-research/) |
| **PM / PO** | [01-business/PROJECT_MANAGEMENT_PLAN.md](./01-business/PROJECT_MANAGEMENT_PLAN.md) |

---

## Tài liệu bắt buộc (MUST READ)

Mọi contributor **PHẢI** đọc trước khi code:

1. [`VerveAI_BA_Document_v1.4.md`](../VerveAI_BA_Document_v1.4.md) — BA v1.4.5.
2. [`.cursor/rules/00-project-overview.mdc`](../.cursor/rules/00-project-overview.mdc) — Project overview + Golden Rules.
3. [`01-business/PROJECT_STRUCTURE.md`](./01-business/PROJECT_STRUCTURE.md) — Cấu trúc thư mục.
4. [`02-architecture/adr/0001-tech-stack-selection.md`](./02-architecture/adr/0001-tech-stack-selection.md) — Tech stack.

---

## Tài liệu theo nghiệp vụ

| Mã | Tài liệu |
|----|---------|
| **FR-01 → FR-05** | Adaptive item selection — [02-architecture/adr/0001-tech-stack-selection.md](./02-architecture/adr/0001-tech-stack-selection.md) §"Tech-stack quyết định" |
| **FR-06 → FR-11** | BKT mastery — [05-research/BKT-VALIDATION.md](./05-research/BKT-VALIDATION.md) |
| **FR-12 → FR-13** | Root-cause clustering — [02-architecture/adr/0001-tech-stack-selection.md](./02-architecture/adr/0001-tech-stack-selection.md) + `app/lib/engine/grouping/cluster_by_root_cause.dart` |
| **FR-25** | Phát hiện rào cản ngôn ngữ — `app/lib/engine/diagnose/language_barrier_detector.dart` |
| **FR-26** | Chuyển lớp/trường — `app/lib/engine/transfer/student_transfer.dart` |
| **SC-05** | Hub cục bộ — [02-architecture/adr/0002-sync-strategy.md](./02-architecture/adr/0002-sync-strategy.md) §"SC-05" |
| **SC-06** | File exchange USB — [02-architecture/adr/0002-sync-strategy.md](./02-architecture/adr/0002-sync-strategy.md) §"SC-06" |
| **TS-19 / TS-20** | Phân phối model + nội dung qua USB — [04-operations/usb-distribution.md](./04-operations/usb-distribution.md) |
| **AI 3 lớp** | L1/L2/L3 — [02-architecture/adr/0003-local-ai-architecture.md](./02-architecture/adr/0003-local-ai-architecture.md) |
| **Privacy** | BR/DR/NFR — [02-architecture/privacy-architecture.md](./02-architecture/privacy-architecture.md) |

---

## Quy tắc chung khi viết tài liệu

- Tiếng Việt là chính; thuật ngữ kỹ thuật giữ tiếng Anh.
- Mọi file PHẢI có heading 1 và mở đầu 1–2 dòng tóm tắt.
- Bảng biểu dùng markdown table (chuẩn GitHub).
- Sơ đồ ASCII cho kiến trúc (offline-first, không phụ thuộc web).
- Tham chiếu chéo bằng relative link (`./01-business/...`).
- Trạng thái **[A]** = chọn tạm cho pilot, chờ Bài kiểm A & B xác nhận.

---

**END OF DOCUMENT**
