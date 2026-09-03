# Bài kiểm A — Chất lượng trích xuất (Bảng F.5)

> **Phiên bản:** 1.4.5
> **Căn cứ:** BA v1.4.5 — Bảng F.5 + FR-12, FR-13, FR-25

---

## 🎯 Mục đích

Quyết định có đưa `app/lib/inference/` (Lớp 1 — trích xuất bằng chứng) ra khỏi **[A]** hay không.

---

## 📊 Phương pháp

- **30 bài làm thật** (lấy từ lớp pilot).
- **3 giáo viên** chấm độc lập → 3 tập nhãn `gold_*`.
- **LLM cục bộ** (Gemma 4B → 2B → 1B, TS-03, AS-61) trích xuất bằng chứng → `llm_*`.
- Đo:
  - **Fleiss' kappa** giữa 3 GV (consistency của GV).
  - **Cohen's kappa** giữa LLM và từng GV.
  - **Macro F1** / **exact-match ratio** giữa LLM và consensus của 3 GV.
  - **Confusion matrix** theo từng root-causeId.

---

## 📐 Ngưỡng (xem `TestAConfig`)

| Metric | Ngưỡng tối thiểu |
|---|---|
| Fleiss' kappa giữa 3 GV | **≥ 0.70** |
| Cohen's kappa LLM vs GV (TB) | **≥ 0.60** |
| Macro F1 (LLM vs consensus) | **≥ 0.65** |
| Exact-match ratio | **≥ 0.50** |

Nếu đạt **TẤT CẢ** → đưa `inference/` ra khỏi **[A]**, chốt cỡ model theo `best_model`.

---

## 📁 Dữ liệu đầu vào

| File | Mô tả |
|------|-------|
| `data/attempts.csv` | 30 dòng, schema xem `data/SCHEMA.md` |
| `data/gold/gold_tN.csv` | Chấm GV thứ N (N=1,2,3) |
| `data/llm_predictions.csv` | Output từ `extract_evidence.dart` chạy qua FFI trên cùng 30 bài |

---

## 🚀 Chạy

### Bước 1: Chuẩn bị dữ liệu
Đặt 3 file CSV ở `research/model-eval/data/` theo schema đã mô tả.

### Bước 2: Chạy bài kiểm
```bash
cd research
make test-a
# hoặc
python -m research.model_eval test_a \
    --attempts data/attempts.csv \
    --gold data/gold \
    --llm data/llm_predictions.csv \
    --out reports/test_a_$(date +%Y%m%d_%H%M%S).json
```

### Bước 3: Đọc kết quả
- `verdict`: `PASS` hoặc `FAIL`.
- `reasons`: danh sách ngưỡng không đạt.
- `best_model`: cỡ model đề xuất (nếu PASS).
- `cohen_kappa_per_teacher`: kappa riêng từng GV.
- `confusion_matrix`: chi tiết confusion.

---

## 🧪 Unit Test

Trước khi chạy với dữ liệu thật, chạy unit test với dữ liệu giả:

```bash
cd research
pytest tests/test_test_a_extraction_quality.py -v
```

---

## ⚠️ Lưu ý quan trọng

- **Dữ liệu phải ẩn danh** (DR-08) trước khi đưa vào `data/`.
- **30 bài là** yêu cầu cứng — không chạy nếu thiếu.
- **3 GV chấm độc lập** — không thảo luận trước khi chấm.
- **Mỗi pilot** sinh dữ liệu mới → bài kiểm A là điểm so sánh giữa các pilot.

---

## 🔄 Quyết định theo verdict

### `verdict: PASS`
1. `inference/` ra khỏi **[A]**.
2. Chốt cỡ model theo `best_model`.
3. Mở PR cập nhật:
   - `.cursor/rules/00-project-overview.mdc` — bỏ **[A]**.
   - `.cursor/rules/02-frontend.mdc` — bỏ "inference [A]".
   - `app/pubspec.yaml` — chốt version model.

### `verdict: FAIL`
1. Xem `reasons` → biết ngưỡng nào fail.
2. Điều chỉnh prompt hoặc GBNF schema.
3. Chạy lại.
4. Nếu vẫn fail → cân nhắc bỏ LLM cục bộ, dùng Lớp 2 thuần.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA v1.4.5 — Bảng F.5](../VerveAI_BA_Document_v1.4.md)
- [ADR-0003 AI 3 lớp](../02-architecture/adr/0003-local-ai-architecture.md)
- [Kappa analysis](./KAPPA-ANALYSIS.md)
- [Data Anonymization](./DATA-ANONYMIZATION.md)
- Code: `research/src/research/model_eval/test_a_extraction_quality.py`

---

**END OF DOCUMENT**
