"""Loader cho measurements của Bài kiểm B.

Schema (xem `research/model-eval/data/SCHEMA.md`):

| Cột              | Kiểu           | Mô tả                                |
|------------------|----------------|--------------------------------------|
| model_size       | 4B / 2B / 1B   | Cỡ model                             |
| attempt_id       | string         | Lượt                                 |
| latency_ms       | int            | Thời gian 1 lần gọi                  |
| peak_rss_mb      | float          | RAM đỉnh (MB) — sampling mỗi 100 ms |
| battery_pct_before| float          | % pin trước khi chạy                 |
| battery_pct_after| float          | % pin sau khi chạy                   |
| model_size_on_disk_mb | float     | Dung lượng file GGUF                 |
"""

from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class MeasurementRow:
    model_size: str
    attempt_id: str
    latency_ms: int
    peak_rss_mb: float
    battery_pct_before: float
    battery_pct_after: float
    model_size_on_disk_mb: float


class SchemaError(ValueError):
    pass


_VALID_SIZES = {"4B", "2B", "1B"}


def _require(headers: list[str], required: tuple[str, ...]) -> None:
    missing = [c for c in required if c not in headers]
    if missing:
        raise SchemaError(f"missing columns: {missing}")


def load_measurements(path: Path) -> list[MeasurementRow]:
    """Đọc CSV measurements từ thiết bị thật.

    Validate schema ngay — fail-fast.
    """
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            raise SchemaError("empty CSV")
        _require(
            list(reader.fieldnames),
            (
                "model_size",
                "attempt_id",
                "latency_ms",
                "peak_rss_mb",
                "battery_pct_before",
                "battery_pct_after",
                "model_size_on_disk_mb",
            ),
        )
        out: list[MeasurementRow] = []
        for i, row in enumerate(reader, start=2):
            try:
                size = row["model_size"].strip()
                if size not in _VALID_SIZES:
                    raise SchemaError(f"row {i}: invalid model_size={size!r}")
                out.append(
                    MeasurementRow(
                        model_size=size,
                        attempt_id=row["attempt_id"].strip(),
                        latency_ms=int(row["latency_ms"]),
                        peak_rss_mb=float(row["peak_rss_mb"]),
                        battery_pct_before=float(row["battery_pct_before"]),
                        battery_pct_after=float(row["battery_pct_after"]),
                        model_size_on_disk_mb=float(row["model_size_on_disk_mb"]),
                    )
                )
            except (KeyError, ValueError) as e:
                raise SchemaError(f"row {i}: {e}") from e
    return out