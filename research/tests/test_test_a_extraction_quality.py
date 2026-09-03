"""Test cho Bài kiểm A — chạy với dữ liệu giả deterministic."""

"""
Đây là test tích hợp cho Bài kiểm A. Sinh dữ liệu giả trong tmpdir,
chạy `run()`, kiểm tra verdict và metrics.

Tất cả đều deterministic — không cần network.
"""

from __future__ import annotations

import json
import csv
from pathlib import Path

import pytest

from research.model_eval.test_a_extraction_quality import TestAConfig, run


def _write_csv(path: Path, rows: list[dict[str, object]], headers: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=headers)
        writer.writeheader()
        writer.writerows(rows)


def _make_attempts(n: int = 30) -> list[dict[str, object]]:
    return [
        {
            "attempt_id": f"a{i:03d}",
            "student_id": f"s{i % 5}",
            "item_id": f"q{i % 10}",
            "wording_complexity": (i % 5) / 5,
            "item_difficulty": ((i + 1) % 5) / 5,
            "response_text": f"response {i}",
            "latency_ms": 1000 + i * 10,
            "context_mode": "in-class" if i % 2 == 0 else "out-of-class",
        }
        for i in range(n)
    ]


def _make_gold(rows_attempts: list[dict[str, object]], seed: int) -> list[dict[str, object]]:
    """Mỗi GV chấm hơi khác nhau (theo seed)."""
    out = []
    for i, a in enumerate(rows_attempts):
        # LLM đúng trong 70% trường hợp — chia đều 3 nhãn.
        base = ["RC-001", "RC-002", "RC-003"][i % 3]
        if seed == 2 and i % 7 == 0:
            base = "RC-002" if base == "RC-001" else "RC-001"
        elif seed == 3 and i % 11 == 0:
            base = "RC-003"
        out.append(
            {
                "attempt_id": a["attempt_id"],
                "root_cause_id": base,
                "confidence": 0.9,
                "is_knowledge_gap": True,
                "note": "",
            }
        )
    return out


def _make_llm(rows_attempts: list[dict[str, object]]) -> list[dict[str, object]]:
    out = []
    for i, a in enumerate(rows_attempts):
        # LLM khớp consensus trong 80% trường hợp.
        if i % 5 == 0:
            pred = "RC-002"
        elif i % 5 == 1:
            pred = "RC-001"
        else:
            pred = ["RC-001", "RC-002", "RC-003"][i % 3]
        out.append(
            {
                "attempt_id": a["attempt_id"],
                "root_cause_id": pred,
                "confidence": 0.85,
                "model_size": "2B",
                "latency_ms": 1500,
            }
        )
    return out


def _setup(tmp_path: Path):
    attempts = _make_attempts(30)
    attempts_csv = tmp_path / "attempts.csv"
    _write_csv(
        attempts_csv,
        attempts,
        [
            "attempt_id", "student_id", "item_id",
            "wording_complexity", "item_difficulty",
            "response_text", "latency_ms", "context_mode",
        ],
    )
    gold_dir = tmp_path / "gold"
    for n in (1, 2, 3):
        _write_csv(
            gold_dir / f"gold_t{n}.csv",
            _make_gold(attempts, seed=n),
            ["attempt_id", "root_cause_id", "confidence", "is_knowledge_gap", "note"],
        )
    llm_csv = tmp_path / "llm_predictions.csv"
    _write_csv(
        llm_csv,
        _make_llm(attempts),
        ["attempt_id", "root_cause_id", "confidence", "model_size", "latency_ms"],
    )
    return attempts_csv, gold_dir, llm_csv


def test_run_produces_report(tmp_path: Path) -> None:
    a, g, l = _setup(tmp_path)
    report = run(attempts_csv=a, gold_dir=g, llm_csv=l)
    assert report.n_attempts == 30
    assert report.n_teachers == 3
    assert report.fleiss_kappa_teachers is not None
    assert 0.0 <= report.fleiss_kappa_teachers <= 1.0
    assert len(report.cohen_kappa_per_teacher) == 3
    assert report.macro_f1_llm_vs_consensus is not None
    assert 0.0 <= report.macro_f1_llm_vs_consensus <= 1.0
    assert report.best_model in {"1B", "2B", "4B"}


def test_run_is_deterministic(tmp_path: Path) -> None:
    a, g, l = _setup(tmp_path)
    r1 = run(attempts_csv=a, gold_dir=g, llm_csv=l)
    r2 = run(attempts_csv=a, gold_dir=g, llm_csv=l)
    assert r1.fleiss_kappa_teachers == r2.fleiss_kappa_teachers
    assert r1.macro_f1_llm_vs_consensus == r2.macro_f1_llm_vs_consensus
    assert r1.verdict == r2.verdict


def test_run_fails_when_attempts_too_few(tmp_path: Path) -> None:
    a, g, l = _setup(tmp_path)
    # Cắt còn 10 attempts.
    rows = list(csv.DictReader(a.open(encoding="utf-8")))[:10]
    a_small = tmp_path / "small.csv"
    with a_small.open("w", encoding="utf-8", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)
    report = run(attempts_csv=a_small, gold_dir=g, llm_csv=l)
    assert report.verdict == "FAIL"
    assert any("need-30-attempts" in r for r in report.reasons)


def test_run_json_serializable(tmp_path: Path) -> None:
    a, g, l = _setup(tmp_path)
    report = run(attempts_csv=a, gold_dir=g, llm_csv=l)
    s = report.to_json()
    parsed = json.loads(s)
    assert parsed["n_attempts"] == 30
    assert "verdict" in parsed


def test_config_defaults_meet_thresholds() -> None:
    """Ngưỡng mặc định khớp BA v1.4 — bảo vệ chống chỉnh sai."""
    cfg = TestAConfig()
    assert cfg.min_fleiss_kappa == 0.70
    assert cfg.min_cohen_kappa_llm_vs_teacher == 0.60
    assert cfg.min_macro_f1 == 0.65
    assert cfg.min_exact_match_ratio == 0.50