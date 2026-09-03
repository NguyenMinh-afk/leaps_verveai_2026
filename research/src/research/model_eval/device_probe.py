"""Probe + aggregate cho Bài kiểm B.

Tổng hợp measurements theo từng cỡ model:
  * Latency: median, p95, max.
  * RAM: peak trung bình + max.
  * Pin: tụt % trung bình (sau N lượt).
  * Dung lượng model trên đĩa (chỉ lấy 1 giá trị đại diện).

Pure functions, deterministic.
"""

from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass
from statistics import median

from research.model_eval.csv_loader_b import MeasurementRow


def _percentile(values: list[int | float], p: float) -> float:
    """Phần tư p (0..100) bằng linear interpolation — giống numpy default.

    Idempotent, deterministic.
    """
    if not values:
        return 0.0
    s = sorted(values)
    if p <= 0:
        return float(s[0])
    if p >= 100:
        return float(s[-1])
    rank = (p / 100) * (len(s) - 1)
    lo = int(rank)
    hi = min(lo + 1, len(s) - 1)
    frac = rank - lo
    return float(s[lo] + (s[hi] - s[lo]) * frac)


@dataclass(frozen=True)
class SizeSummary:
    model_size: str
    n_runs: int
    latency_median_ms: float
    latency_p95_ms: float
    latency_max_ms: float
    peak_rss_mb_max: float
    battery_drop_pct: float  # trung bình giữa các batch
    model_size_on_disk_mb: float


def aggregate_by_size(
    measurements: list[MeasurementRow],
    runs_per_size: int,
) -> list[dict[str, object]]:
    """Gom theo model_size, trả về list các summary dạng dict (JSON-friendly).

    Mỗi batch gồm `runs_per_size` lượt liên tiếp; battery_drop_pct là trung bình
    các batch trong nhóm.
    """
    if runs_per_size <= 0:
        raise ValueError("runs_per_size phải > 0")
    grouped: dict[str, list[MeasurementRow]] = defaultdict(list)
    for m in measurements:
        grouped[m.model_size].append(m)

    out: list[dict[str, object]] = []
    for size in ("4B", "2B", "1B"):  # thứ tự cố định → deterministic
        rows = grouped.get(size, [])
        if not rows:
            out.append({
                "model_size": size,
                "n_runs": 0,
                "latency_median_ms": None,
                "latency_p95_ms": None,
                "latency_max_ms": None,
                "peak_rss_mb_max": None,
                "battery_drop_pct": None,
                "model_size_on_disk_mb": None,
            })
            continue

        latencies = [m.latency_ms for m in rows]
        rss = [m.peak_rss_mb for m in rows]
        disk_sizes = [m.model_size_on_disk_mb for m in rows]

        # Battery drop: chia thành batch `runs_per_size`, mỗi batch tính drop.
        drops: list[float] = []
        for i in range(0, len(rows), runs_per_size):
            batch = rows[i : i + runs_per_size]
            if len(batch) < 2:
                continue
            drop = batch[0].battery_pct_before - batch[-1].battery_pct_after
            drops.append(max(drop, 0.0))
        avg_drop = (sum(drops) / len(drops)) if drops else 0.0

        out.append({
            "model_size": size,
            "n_runs": len(rows),
            "latency_median_ms": float(median(latencies)),
            "latency_p95_ms": _percentile(latencies, 95),
            "latency_max_ms": float(max(latencies)),
            "peak_rss_mb_max": float(max(rss)),
            "battery_drop_pct": float(avg_drop),
            "model_size_on_disk_mb": float(median(disk_sizes)),
        })
    return out