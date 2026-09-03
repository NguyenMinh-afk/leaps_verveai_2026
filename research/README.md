# Research — Mô-đun nghiên cứu Python (BA v1.4.4)

Sinh số liệu cho hai **Bài kiểm quyết định** (Bảng F.5) — quyết định có đưa `app/lib/inference/` ra khỏi trạng thái **[A]** hay không.

## Bố cục

```
research/
├── pyproject.toml             # Package, entry points, pytest config
├── Makefile                   # make install / test / test-a / test-b
├── .gitignore                 # Không commit data thật (DR-08)
│
├── src/research/
│   ├── expert_agreement/
│   │   └── kappa_analysis.py           # Cohen / Fleiss kappa (gốc)
│   ├── simulation/
│   │   └── self_consistency_check.py   # Validate BKT (TS-07)
│   ├── reproducibility/
│   │   └── export_for_independent_review.py  # Ẩn danh + đóng gói
│   └── model_eval/                     # ⭐ Bài kiểm A & B (Bảng F.5)
│       ├── __init__.py
│       ├── __main__.py                 # python -m research.model_eval
│       ├── test_a_extraction_quality.py
│       ├── test_b_device_performance.py
│       ├── csv_loader.py               # Schema validation cho A
│       ├── csv_loader_b.py             # Schema validation cho B
│       ├── metrics.py                  # kappa, macro F1, exact-match, CM
│       ├── device_probe.py             # Aggregate per-size + percentile
│       ├── verdict.py                  # Quyết định PASS/FAIL cho A
│       └── verdict_b.py                # Quyết định PASS/FAIL + chọn size cho B
│
├── model-eval/                          # Tài liệu & dữ liệu pilot
│   ├── README.md                        # Hướng dẫn A & B
│   ├── data/
│   │   ├── SCHEMA.md
│   │   └── .gitkeep
│   └── test_a_extraction_quality.py    # ⭐ Bài kiểm A — entry point tài liệu
│   └── test_b_device_performance.py    # ⭐ Bài kiểm B — entry point tài liệu
│
└── tests/                              # Unit test cho mọi module ở src/
    ├── test_test_a_extraction_quality.py
    ├── test_test_b_device_performance.py
    ├── test_metrics.py
    ├── test_verdict.py
    └── .gitkeep
```

## Cài đặt

```bash
cd research
python -m venv .venv
source .venv/bin/activate        # PowerShell: .venv\Scripts\Activate.ps1
pip install -e ".[dev]"
```

## Chạy test

```bash
make test-unit                   # chỉ unit test (nhanh)
make test                        # tất cả
pytest tests/test_metrics.py -v  # một file
```

## Chạy Bài kiểm A

Yêu cầu: `data/attempts.csv` (30 bài làm), `data/gold/gold_tN.csv`, `data/llm_predictions.csv`.

```bash
make test-a
# hoặc
python -m research.model_eval test_a \
    --attempts data/attempts.csv \
    --gold data/gold \
    --llm data/llm_predictions.csv \
    --out reports/test_a.json
```

Verdict cuối cùng ở `reports/test_a.json`:
- `verdict: "PASS"` → `inference/` ra khỏi **[A]**.
- `verdict: "FAIL"` → xem `reasons`, điều chỉnh prompt/schema, chạy lại.

## Chạy Bài kiểm B

Yêu cầu: `data/device.json` + `data/measurements.csv` (lấy từ thiết bị thật qua USB — TS-19).

```bash
make test-b
```

Verdict cuối + `best_model` ở `reports/test_b.json`.

## Ngưỡng (mặc định, theo BA v1.4)

### Bài kiểm A

| Metric | Ngưỡng |
|---|---|
| Fleiss' kappa (3 GV) | ≥ 0.70 |
| Cohen's kappa TB (LLM vs GV) | ≥ 0.60 |
| Macro F1 (LLM vs consensus) | ≥ 0.65 |
| Exact-match ratio | ≥ 0.50 |

### Bài kiểm B

| Metric | Budget |
|---|---|
| Latency p95 / lượt | ≤ 2000 ms |
| RAM đỉnh | ≤ 1500 MB |
| Dung lượng model | ≤ 2500 MB |
| Pin tụt / 30 lượt | ≤ 5 % |
| Cỡ model đo | 4B → 2B → 1B (AS-61) |

## Quy tắc (xem `.cursor/rules/03-python.mdc`)

- Type hints EVERYWHERE.
- Pydantic cho data validation (khi cần schema phức tạp).
- Tất cả script phải **idempotent + deterministic** (cùng input → cùng output).
- Dữ liệu thật đã ẩn danh (DR-08); không commit.
- Pytest coverage ≥ 80% cho `src/research/`.