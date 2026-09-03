# Python Style Guide — LEAPS / VerveAI (research)

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản:** 1.4.5
> **Bản đồng bộ với `.cursor/rules/03-python.mdc`.**

---

## 📐 Naming (PEP 8)

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Module / file | snake_case | `kappa_analysis.py` |
| Class | PascalCase | `KappaResult`, `TestAConfig` |
| Function / variable | snake_case | `compute_cohens_kappa` |
| Constant | UPPER_SNAKE_CASE | `SYNTHETIC_SAMPLE_SIZE` |
| Private | prefix `_` | `_validate_schema` |
| Boolean | prefix `is/has/should/can` | `is_valid` |

---

## ✅ MUST

- Python ≥ 3.11.
- Type hints **EVERYWHERE** — kể cả hàm private và biến nội bộ.
- `pydantic` cho mọi data validation (input từ CSV/JSON, schema đầu ra).
- `pytest` + `pytest-asyncio` cho test.
- `pytest-cov` cho coverage (≥ 80% cho `research/`).
- Virtual environment (`python -m venv .venv`).
- `logging` module thay cho `print`.
- Docstring cho mỗi script ngay đầu file.
- Mọi script production phải **idempotent + deterministic**.

## ❌ NEVER

- `print()` trong production — dùng `logging`.
- Missing type hints.
- Mutable default arguments (`def f(x=[]): ...`).
- Bare `except:` — luôn chỉ rõ loại exception.
- Wildcard imports (`from module import *`).
- Commit dữ liệu PII thô — phải ẩn danh trước (DR-08).
- `random.seed(None)` — luôn seed cố định cho test.

---

## 📁 Module structure

```
research/src/research/
├── expert_agreement/
│   └── kappa_analysis.py
├── simulation/
│   └── self_consistency_check.py     # TS-07
├── reproducibility/
│   └── exportForIndependentReview.py
└── model_eval/                       # ⭐ Bảng F.5
    ├── __init__.py
    ├── __main__.py
    ├── test_a_extraction_quality.py
    ├── test_b_device_performance.py
    ├── csv_loader.py / csv_loader_b.py
    ├── metrics.py / device_probe.py
    └── verdict.py / verdict_b.py
```

---

## 🧪 Test

- `pytest` + `pytest-asyncio` — file `tests/test_*.py`.
- `pytest-cov` — coverage ≥ 80% cho `src/research/`.
- Dữ liệu giả deterministic — KHÔNG `random.seed(None)`.

---

## 🧠 Research Scripts

### `expert_agreement/kappa_analysis.py`
- Input: CSV nhiều cột chấm GV.
- Output: Cohen's / Fleiss' kappa.

### `simulation/self_consistency_check.py`
- Validate BKT parameters — **TS-07**.

### `reproducibility/export_for_independent_review.py`
- Ẩn danh dữ liệu (BR-06, DR-08) cho third-party validation.

### ⭐ `model-eval/test_a_extraction_quality.py` — **Bài kiểm A (Bảng F.5)**
- Quyết định có đưa `inference/` ra khỏi [A].
- Ngưỡng: Fleiss ≥ 0.70; Cohen TB ≥ 0.60; Macro F1 ≥ 0.65; exact ≥ 0.50.

### ⭐ `model-eval/test_b_device_performance.py` — **Bài kiểm B (Bảng F.5)**
- Quyết định cỡ model (4B → 2B → 1B theo AS-61).
- Ngưỡng: latency p95 ≤ 2s; RAM ≤ 1.5GB; disk ≤ 2.5GB; pin ≤ 5%/30 lượt.

---

## 📚 TÀI LIỆU LIÊN QUAN
- [`.cursor/rules/03-python.mdc`](../../.cursor/rules/03-python.mdc) — Phiên bản rule.
- [Testing Strategy](../testing-strategy.md).
- [Bài kiểm A & B](../../05-research/).
