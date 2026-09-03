# ADR-0003: Local AI Architecture — 3 lớp (theo BA v1.4.5 — Phụ lục G.2)

> **Status:** [A] Accepted (chọn tạm cho pilot, chờ Bài kiểm A & B)
> **Date:** 2026-08-25 / 05/09/2026 (cập nhật)
> **Deciders:** Team Verve Core
> **Supersedes:** N/A (ADR mới — Phụ lục G.2 của BA v1.4.5)

---

## Context

LEAPS cần một thành phần AI cục bộ (không gọi cloud) để:

1. **Đọc bài làm** của học sinh → bằng chứng có cấu trúc (tránh phụ thuộc vào cách GV nhập tay).
2. **Diễn giải** kết quả chẩn đoán cho giáo viên và học sinh bằng câu văn tự nhiên.

Đặt trong app Flutter/Dart; chạy 100% offline; đặt dưới ràng buộc của TS-02/03/04/07.

## Decision

Tổ chức AI thành **3 lớp**, với vai trò và ranh giới rõ ràng:

```
┌──────────────────────────────────────────────────────────────┐
│ Lớp 3 — Diễn đạt   (inference/expression/*.dart)            │
│   - explain_to_teacher.dart                                   │
│   - fill_student_template.dart  (BR-13: từ vựng đóng)       │
│   - fact_check_guard.dart          (AIR-24: chặn bịa)        │
├──────────────────────────────────────────────────────────────┤
│ Lớp 2 — Tổng hợp & Quyết định (engine/* — Dart thuần, TS-07) │
│   - Tất định, KHÔNG ngẫu nhiên.                            │
│   - Mức tin cậy do lớp này tính (BR-01, AIR-15).           │
│   - Có thể chạy độc lập khi Lớp 1/Lớp 3 chưa sẵn sàng.   │
├──────────────────────────────────────────────────────────────┤
│ Lớp 1 — Trích xuất (inference/extraction/*.dart)             │
│   - extract_evidence.dart — đọc bài làm → bằng chứng (AIR-25)│
│   - Ép GBNF (TS-04) chỉ chọn nhãn đã thẩm định.          │
└──────────────────────────────────────────────────────────────┘
```

### Lớp 1 — Trích xuất bằng chứng

- Module: `app/lib/inference/extraction/extract_evidence.dart`.
- Đầu vào: bài làm học sinh (text/ảnh).
- Đầu ra: bằng chứng có cấu trúc khớp `extraction_schema.gbnf`.
- Ép schema bằng **GBNF grammar-constrained decoding** (TS-04) → không thể "chế" nhãn ngoài.
- Gọi qua `inference/ffi/llama_bindings.dart` (TS-02) với model tải bởi `inference/model_manager.dart` (TS-03, AS-61: 4B → 2B → 1B theo bậc thiết bị).

### Lớp 2 — Tổng hợp & Quyết định

- Modules: `app/lib/engine/`.
- Tính chất: **tất định** — cập nhật Bayes tham số cố định (BKT, TS-07), KHÔNG có yếu tố ngẫu nhiên trong cùng điều kiện.
- Mức tin cậy / quyết định "không chắc" do lớp này tính (BR-01, AIR-15) — **KHÔNG** để Lớp 3 quyết.
- Một số mô-đun mới (Phụ lục G.9):
  - `engine/diagnose/language_barrier_detector.dart` — **FR-25** (vùng trống #1).
  - `engine/transfer/student_transfer.dart` — **FR-26** (vùng trống #5).

### Lớp 3 — Diễn đạt

- Modules:
  - `inference/expression/explain_to_teacher.dart` — giải thích cho GV.
  - `inference/expression/fill_student_template.dart` — **BR-13**: dùng từ vựng đóng (template) cho HS.
  - `inference/expression/fact_check_guard.dart` — **AIR-24**: đối chiếu đầu ra với bằng chứng gốc, chặn bịa.
- Đầu ra phải luôn đi qua `fact_check_guard` trước khi phát cho người dùng.

## Cờ trạng thái

> ⚠️ Toàn bộ nhánh `inference/` (Lớp 1 & 3) đang ở **[A] "chọn tạm cho pilot"**.
> Chờ kết quả **Bài kiểm A** (chất lượng trích xuất) và **Bài kiểm B** (hiệu năng thiết bị) trong `research/model-eval/` chốt cỡ model.
> Lớp 2 (engine) có thể triển khai và test song song — độc lập với Lớp 1 & 3.

## Tại sao tách 3 lớp

- **An toàn**: lớp quyết định (Lớp 2) không lệ thuộc LLM, vẫn hoạt động khi Lớp 1/Lớp 3 thất bại.
- **Gỡ lỗi**: nếu kết quả sai, biết ngay lỗi ở trích xuất (Lớp 1), tổng hợp (Lớp 2), hay diễn đạt (Lớp 3).
- **Khả thi với thiết bị yếu**: Lớp 2 chạy không cần LLM; có thể bật/tắt Lớp 1 & 3 tuỳ bậc thiết bị (AS-61).
- **Không bịa**: `fact_check_guard` (AIR-24) cùng `extraction_schema.gbnf` (TS-04) ngăn mô hình chọn nhãn ngoài hoặc suy diễn ngoài bằng chứng.

## Consequences

### Tích cực
- Lớp 2 triển khai và kiểm thử trước, không cần LLM cục bộ — chốt đúng-sai độc lập với AI.
- `fact_check_guard` + GBNF bảo vệ khỏi ảo giác.
- `language_barrier_detector` (FR-25) giảm cảnh báo sai do đọc/hiểu đề sai.

### Tiêu cực
- Phụ thuộc kết quả Bài kiểm A & B mới chốt cỡ model — chưa thể đưa `inference/` ra khỏi [A].
- Tách 3 lớp thêm ranh giới module cần định nghĩa hợp đồng rõ ràng giữa các schema.

### Rủi ro & giảm thiểu

| Rủi ro | Giảm thiểu |
|---|---|
| Model 4-bit không đủ chất (A) | Thử prompt/schema; nếu vẫn không → bỏ Lớp 1 cục bộ, dùng Lớp 2 thuần |
| Thiết bị không đủ RAM/pin (B) | Hạ cỡ (4B → 2B → 1B theo AS-61); giới hạn thiết bị tối thiểu |
| Ảo giác | GBNF + `fact_check_guard` |
| Lớp 3 bịa | `fill_student_template` (BR-13) — chỉ từ vựng đóng |

## References

- BA v1.4.5 — Phụ lục G (G.2 — kiến trúc 3 lớp, G.9 — lỗ hổng)
- TS-02, TS-03, TS-04, TS-07
- BR-01, BR-13, BR-14
- AIR-15, AIR-24, AIR-25
- FR-25, FR-26, FR-07
- `app/lib/inference/`, `app/lib/engine/`, `app/lib/inference/grammar/*.gbnf`
- `research/model-eval/test_a_extraction_quality.py`, `research/model-eval/test_b_device_performance.py`
- ADR-0001 (tech stack), ADR-0002 (sync)
