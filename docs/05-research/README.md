# 🧪 Research Documentation

Tài liệu cho **Bài kiểm A & B** (Bảng F.5) — quyết định `[A]` của `app/lib/inference/`.

> **Vai trò**:
> - **Bài kiểm A**: chất lượng trích xuất bằng chứng (Fleiss/Cohen kappa).
> - **Bài kiểm B**: hiệu năng thiết bị (latency, RAM, pin).
> - **Quyết định [A]**: PASS → `inference/` ra khỏi [A]; FAIL → điều chỉnh.

## Cấu trúc

| File | Mô tả |
|------|-------|
| [BKT-VALIDATION.md](./BKT-VALIDATION.md) | Validate BKT qua self_consistency_check |
| [TEST-A-EXTRACTION.md](./TEST-A-EXTRACTION.md) | Bài kiểm A — chất lượng trích xuất |
| [TEST-B-DEVICE-PERFORMANCE.md](./TEST-B-DEVICE-PERFORMANCE.md) | Bài kiểm B — hiệu năng thiết bị |
| [KAPPA-ANALYSIS.md](./KAPPA-ANALYSIS.md) | Kappa analysis giữa các GV chấm |
| [DATA-ANONYMIZATION.md](./DATA-ANONYMIZATION.md) | Quy trình ẩn danh (DR-08) trước khi vào pilot |

## Đọc theo vai trò

| Vai trò | File đầu tiên |
|---------|--------------|
| Researcher | TEST-A-EXTRACTION.md → TEST-B-DEVICE-PERFORMANCE.md |
| GV chấm pilot | KAPPA-ANALYSIS.md |
| AI Engineer | TEST-A-EXTRACTION.md |
| DevOps | TEST-B-DEVICE-PERFORMANCE.md (phần đo trên thiết bị) |

## Đường dẫn đến code

- Code: `research/src/research/model_eval/`
- Test: `research/tests/`
- Dữ liệu pilot: `research/model-eval/data/`

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA v1.4.5 — Bảng F.5](../VerveAI_BA_Document_v1.4.md)
- [ADR-0003 AI 3 lớp](../02-architecture/adr/0003-local-ai-architecture.md)
- [AI Architecture](../02-architecture/ai-architecture.md)
