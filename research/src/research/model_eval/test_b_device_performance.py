"""Bài kiểm B — Hiệu năng thiết bị (BA v1.4 — Bảng F.5).

Chạy `extract_evidence.dart` trên thiết bị thật, đo:
  * Latency per call (trung vị, p95, max).
  * RAM đỉnh (peak RSS).
  * Dung lượng model + bundle trên ổ đĩa.
  * Pin tụt sau N lượt gọi.

Quyết định: chốt cỡ model (4B → 2B → 1B, AS-61) đạt budget.

Quy ước:
  * Không gọi cloud.
  * Có thể chạy offline hoàn toàn (khi đã cài model qua USB).
  * Idempotent — chạy lại với cùng input → cùng report (trong sai số đo).
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Sequence

from research.model_eval import csv_loader_b, device_probe, verdict_b


@dataclass(frozen=True)
class TestBConfig:
    """Budget theo BA v1.4."""

    # Latency (ms) — p95 cho 1 lần gọi extract_evidence.
    max_latency_p95_ms: int = 2000
    # RAM đỉnh (MB) — giới hạn thiết bị phổ thông.
    max_peak_rss_mb: int = 1500
    # Dung lượng model + bundle (MB).
    max_model_size_mb: int = 2500
    # Pin tụt tối đa sau 100 lượt (%).
    max_battery_drop_pct: float = 5.0
    # Số lượt chạy mỗi cỡ model.
    runs_per_size: int = 30


@dataclass(frozen=True)
class TestBReport:
    device: dict[str, str]
    per_size: list[dict[str, object]]
    thresholds: dict[str, object]
    verdict: str = "FAIL"
    reasons: list[str] = field(default_factory=list)
    best_model: str | None = None

    def to_json(self) -> str:
        return json.dumps(self.__dict__, ensure_ascii=False, indent=2)


def run(
    device_info: dict[str, str],
    measurements: list[csv_loader_b.MeasurementRow],
    config: TestBConfig = TestBConfig(),
) -> TestBReport:
    """Tổng hợp measurements và quyết định."""
    per_size = device_probe.aggregate_by_size(measurements, config.runs_per_size)
    v = verdict_b.decide(config=config, per_size=per_size)

    best = verdict_b.choose_best_size(per_size, config)
    return TestBReport(
        device=device_info,
        per_size=per_size,
        thresholds=config.__dict__,
        verdict=v.verdict,
        reasons=list(v.reasons),
        best_model=best,
    )


def _parse_args(argv: Sequence[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        prog="test_b_device_performance",
        description="Bài kiểm B — hiệu năng thiết bị (Bảng F.5).",
    )
    p.add_argument("--device", type=Path, required=True, help="JSON thông tin thiết bị.")
    p.add_argument("--measurements", type=Path, required=True, help="CSV measurements từ thiết bị thật.")
    p.add_argument("--out", type=Path, required=True, help="File JSON report.")
    return p.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = _parse_args(sys.argv[1:] if argv is None else argv)
    device = json.loads(args.device.read_text(encoding="utf-8"))
    measurements = csv_loader_b.load_measurements(args.measurements)
    report = run(device_info=device, measurements=measurements)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(report.to_json(), encoding="utf-8")
    print(f"[Bài kiểm B] verdict={report.verdict}")
    for r in report.reasons:
        print(f"  - {r}")
    print(f"[Bài kiểm B] best_model={report.best_model}")
    print(f"[Bài kiểm B] report → {args.out}")
    return 0 if report.verdict == "PASS" else 2


if __name__ == "__main__":
    raise SystemExit(main())