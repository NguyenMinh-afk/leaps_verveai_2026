"""Verdict cho Bài kiểm B — quyết định PASS/FAIL theo budget thiết bị.

Quyết định cỡ model nhỏ nhất (theo AS-61: 1B > 2B > 4B) đạt budget.
"""

from __future__ import annotations

from dataclasses import dataclass

from research.model_eval.test_b_device_performance import TestBConfig


@dataclass(frozen=True)
class Verdict:
    verdict: str  # 'PASS' | 'FAIL'
    reasons: tuple[str, ...]


def _size_meets_budget(summary: dict[str, object], config: TestBConfig) -> tuple[bool, list[str]]:
    reasons: list[str] = []
    ok = True

    if summary["n_runs"] == 0:
        return False, ["no-runs"]

    if summary["latency_p95_ms"] is not None and summary["latency_p95_ms"] > config.max_latency_p95_ms:
        ok = False
        reasons.append(
            f"{summary['model_size']}-latency-p95-{summary['latency_p95_ms']:.0f}ms"
            f">{config.max_latency_p95_ms}ms"
        )

    if summary["peak_rss_mb_max"] is not None and summary["peak_rss_mb_max"] > config.max_peak_rss_mb:
        ok = False
        reasons.append(
            f"{summary['model_size']}-rss-{summary['peak_rss_mb_max']:.0f}MB"
            f">{config.max_peak_rss_mb}MB"
        )

    if summary["model_size_on_disk_mb"] is not None and summary["model_size_on_disk_mb"] > config.max_model_size_mb:
        ok = False
        reasons.append(
            f"{summary['model_size']}-disk-{summary['model_size_on_disk_mb']:.0f}MB"
            f">{config.max_model_size_mb}MB"
        )

    if summary["battery_drop_pct"] is not None and summary["battery_drop_pct"] > config.max_battery_drop_pct:
        ok = False
        reasons.append(
            f"{summary['model_size']}-battery-{summary['battery_drop_pct']:.1f}%>{config.max_battery_drop_pct}%"
        )

    return ok, reasons


def decide(
    config: TestBConfig,
    per_size: list[dict[str, object]],
) -> Verdict:
    """PASS nếu có ≥ 1 cỡ model đạt budget."""
    any_pass = False
    reasons: list[str] = []
    for summary in per_size:
        ok, sub_reasons = _size_meets_budget(summary, config)
        if ok and summary["n_runs"] > 0:
            any_pass = True
        reasons.extend(sub_reasons)

    if any_pass and not reasons:
        reasons.append("at-least-one-model-meets-budget")

    return Verdict(
        verdict="PASS" if any_pass else "FAIL",
        reasons=tuple(reasons),
    )


def choose_best_size(
    per_size: list[dict[str, object]],
    config: TestBConfig,
) -> str | None:
    """Chọn cỡ model nhỏ nhất đạt budget — AS-61 ưu tiên 1B > 2B > 4B."""
    for size in ("1B", "2B", "4B"):  # thứ tự nhỏ → lớn
        for s in per_size:
            if s["model_size"] == size:
                ok, _ = _size_meets_budget(s, config)
                if ok:
                    return size
    return None