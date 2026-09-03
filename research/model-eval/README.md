# Bài kiểm A & B — Tài liệu & dữ liệu pilot (BA v1.4 — Bảng F.5)

> **Lưu ý**: Code chạy 2 bài kiểm nằm ở package `research.model_eval` (xem
> `../src/research/model_eval/`). Thư mục này chỉ chứa **tài liệu + dữ liệu pilot**
> (CSV, JSON, schema).

## Mục đích

Hai bài kiểm quyết định: đưa `app/lib/inference/` (Lớp 1 & 3) ra khỏi **[A]** hay không.

## Bài kiểm A — Chất lượng trích xuất

### Phương pháp
- 30 bài làm thật (lấy từ lớp pilot).
- 3 giáo viên chấm độc lập → 3 tập nhãn `gold_*`.
- LLM cục bộ (Gemma 4B → 2B → 1B, TS-03, AS-61) trích xuất bằng chứng → `llm_*`.
- Đo:
  - Fleiss' **kappa** giữa 3 GV (consistency của GV).
  - Cohen's kappa giữa LLM và từng GV.
  - Macro F1 / exact-match ratio giữa LLM và consensus của 3 GV.
  - Confusion matrix theo từng root-causeId.

### Ngưỡng (xem `TestAConfig` trong code)
| Metric | Ngưỡng tối thiểu |
|---|---|
| Fleiss' kappa giữa 3 GV | ≥ 0.70 |
| Cohen's kappa LLM vs GV (TB) | ≥ 0.60 |
| Macro F1 (LLM vs consensus) | ≥ 0.65 |
| Exact-match ratio | ≥ 0.50 |

Nếu đạt ngưỡng → đưa `inference/` ra kh�i **[A]**, cỡ model theo `best_model` trong report.

### Dữ liệu đầu vào
- `data/attempts.csv` — 30 dòng, schema xem `data/SCHEMA.md`.
- `data/gold/` — `gold_t1.csv`, `gold_t2.csv`, `gold_t3.csv` (chấm GV độc lập).
- `data/llm_predictions.csv` — output của `app/lib/inference/extraction/extract_evidence.dart`
  chạy qua FFI trên cùng 30 bài.

### Chạy
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

### Quyết định
- `verdict: "PASS"` → `inference/` ra khỏi [A], cỡ model theo `best_model` trong report.
- `verdict: "FAIL"` → xem `reasons`, thử prompt/schema khác; nếu vẫn không → bỏ LLM cục bộ.

---

## Bài kiểm B — Hiệu năng thiết bị

### Phương pháp
- Trên thiết bị thật (Android hoặc Windows), chạy `extract_evidence.dart` 30 lần với mỗi cỡ model.
- Đo:
  - Latency p95 / lượt.
  - RAM đỉnh (peak RSS).
  - Dung lượng file GGUF trên ổ.
  - Pin tụt sau 30 lượt.

### Ngưỡng (xem `TestBConfig` trong code)
| Metric | Budget |
|---|---|
| Latency p95 | ≤ 2000 ms |
| RAM đỉnh | ≤ 1500 MB |
| Dung lượng model | ≤ 2500 MB |
| Pin tụt | ≤ 5 % / 30 lượt |
| Cỡ đo | 4B → 2B → 1B (AS-61) |

### Dữ liệu đầu vào
- `data/device.json` — thông tin thiết bị (xem SCHEMA.md).
- `data/measurements.csv` — output từ app Flutter sau pilot, đo trên thiết bị thật.

### Chạy
```bash
cd research
make test-b
```

### Quyết định
- `verdict: "PASS"` → cỡ model `best_model` (nhỏ nhất đạt budget) là chốt.
- `verdict: "FAIL"` → cần giảm cỡ model hoặc nâng cấp thiết bị tối thiểu.

---

## Dữ liệu mẫu (synthetic)

`data/` chỉ chứa `.gitkeep` + schema docs. **KHÔNG commit** dữ liệu thật (DR-08).
Khi pilot, đặt CSV qua USB theo schema đã mô tả trong `data/SCHEMA.md`.