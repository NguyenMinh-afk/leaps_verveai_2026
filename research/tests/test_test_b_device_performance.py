"""Test cho Bài kiểm B — aggregate + verdict."""

from __future__ import annotations

import json
import csv
from pathlib import Path

import pytest

from research.model_eval.csv_loader_b import MeasurementRow
from research.model_eval.device_probe import aggregate_by_size
from research.model_eval.test_b_device_performance import TestBConfig, run
from research.model_eval.verdict_b import decide


def _row(size: str, idx: int, latency: int = 1500, rss: float = 900.0,
         disk: float = 1800.0, bat_before: float = 80.0, bat_after: float = 79.5) -> MeasurementRow:
    return MeasurementRow(
        model_size=size,
        attempt_id=f"{size}-{idx:03d}",
        latency_ms=latency,
        peak_rss_mb=rss,
        battery_pct_before=bat_before,
        battery_pct_after=bat_after,
        model_size_on_disk_mb=disk,
    )


def _rows_one_size(size: str, n: int, latency: int = 1500, rss: float = 900.0,
                   disk: float = 1800.0, bat_drop: float = 0.5) -> list[MeasurementRow]:
    rows = []
    for i in range(n):
        rows.append(_row(
            size, i,
            latency=latency,
            rss=rss,
            disk=disk,
            bat_before=80.0 - i * 0.01,
            bat_after=80.0 - i * 0.01 - bat_drop,
        ))
    return rows


def test_aggregate_includes_all_three_sizes_even_if_missing() -> None:
    rows = _rows_one_size("4B", 30)
    out = aggregate_by_size(rows, runs_per_size=30)
    sizes = [s["model_size"] for s in out]
    assert sizes == ["4B", "2B", "1B"]
    assert out[1]["n_runs"] == 0  # 2B không có dữ liệu


def test_aggregate_percentiles_deterministic() -> None:
    rows = _rows_one_size("4B", 30, latency=1000)
    out = aggregate_by_size(rows, runs_per_size=30)
    assert out[0]["latency_median_ms"] == 1000.0
    assert out[0]["latency_max_ms"] == 1000.0


def test_aggregate_battery_drop_one_batch() -> None:
    rows = _rows_one_size("4B", 30, bat_drop=1.5)
    out = aggregate_by_size(rows, runs_per_size=30)
    assert out[0]["battery_drop_pct"] == pytest.approx(1.5, abs=0.05)


def test_decide_pass_when_one_size_meets_budget() -> None:
    rows = (
        _rows_one_size("4B", 30, latency=3000, rss=2000) +  # quá budget
        _rows_one_size("2B", 30, latency=1500, rss=900, bat_drop=2.0) +  # OK
        _rows_one_size("1B", 30, latency=1200, rss=700, bat_drop=1.5)  # OK hơn
    )
    per_size = aggregate_by_size(rows, runs_per_size=30)
    v = decide(TestBConfig(), per_size)
    assert v.verdict == "PASS"


def test_decide_fail_when_all_over_budget() -> None:
    rows = (
        _rows_one_size("4B", 30, latency=5000, rss=3000) +
        _rows_one_size("2B", 30, latency=5000, rss=3000) +
        _rows_one_size("1B", 30, latency=5000, rss=3000)
    )
    per_size = aggregate_by_size(rows, runs_per_size=30)
    v = decide(TestBConfig(), per_size)
    assert v.verdict == "FAIL"


def test_run_returns_json_serializable_report() -> None:
    rows = _rows_one_size("2B", 30, latency=1500, rss=900)
    device = {"device_id": "test-001", "platform": "android"}
    report = run(device_info=device, measurements=rows, config=TestBConfig())
    parsed = json.loads(report.to_json())
    assert parsed["device"]["device_id"] == "test-001"
    assert parsed["verdict"] in {"PASS", "FAIL"}
    assert parsed["best_model"] in {"1B", "2B", "4B", None}


def test_choose_smallest_size_meeting_budget() -> None:
    from research.model_eval.verdict_b import choose_best_size
    rows = (
        _rows_one_size("4B", 30, latency=1500) +
        _rows_one_size("2B", 30, latency=1500) +
        _rows_one_size("1B", 30, latency=1500)
    )
    per_size = aggregate_by_size(rows, runs_per_size=30)
    assert choose_best_size(per_size, TestBConfig()) == "1B"


def test_config_defaults_align_with_ba() -> None:
    cfg = TestBConfig()
    assert cfg.max_latency_p95_ms == 2000
    assert cfg.max_peak_rss_mb == 1500
    assert cfg.max_model_size_mb == 2500
    assert cfg.max_battery_drop_pct == 5.0
    assert cfg.runs_per_size == 30