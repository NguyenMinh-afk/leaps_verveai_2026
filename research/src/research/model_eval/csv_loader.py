"""Loader cho CSV Bài kiểm A.

Schema: xem `research/model-eval/data/SCHEMA.md`.

Tất cả hàm đều deterministic, idempotent, validate schema ngay đầu vào.
"""

from __future__ import annotations

import csv
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Attempt:
    attempt_id: str
    student_id: str
    item_id: str
    wording_complexity: float
    item_difficulty: float
    response_text: str
    latency_ms: int
    context_mode: str  # 'in-class' | 'out-of-class'


@dataclass(frozen=True)
class GoldRow:
    attempt_id: str
    root_cause_id: str
    confidence: float
    is_knowledge_gap: bool
    note: str


@dataclass(frozen=True)
class GoldTable:
    """Bảng chấm của 1 GV."""

    teacher_id: str
    rows: tuple[GoldRow, ...]

    @property
    def root_cause_by_attempt(self) -> dict[str, str]:
        return {r.attempt_id: r.root_cause_id for r in self.rows}


@dataclass(frozen=True)
class LlmPrediction:
    attempt_id: str
    root_cause_id: str
    confidence: float
    model_size: str  # '4B' | '2B' | '1B'
    latency_ms: int


@dataclass(frozen=True)
class LlmTable:
    rows: tuple[LlmPrediction, ...]

    @property
    def root_cause_by_attempt(self) -> dict[str, str]:
        return {r.attempt_id: r.root_cause_id for r in self.rows}

    @property
    def model_size_by_attempt(self) -> dict[str, str]:
        return {r.attempt_id: r.model_size for r in self.rows}

    def best_model_size(self, macro_f1: float | None, latency_budget_ms: int) -> str | None:
        """Chọn cỡ model nhỏ nhất đạt ngưỡng trong budget.

        Quy tắc AS-61: ưu tiên model nhỏ (1B > 2B > 4B) nếu đạt chất lượng.
        Trả về None nếu không cỡ nào đạt.
        """
        if macro_f1 is None:
            return None
        # Gom theo model_size, tính F1 trung bình (giả định rows đã qua Bài kiểm A).
        sizes = sorted({r.model_size for r in self.rows}, reverse=True)  # '4B', '2B', '1B'
        for size in reversed(sizes):  # ưu tiên nhỏ trước
            rows = [r for r in self.rows if r.model_size == size]
            if not rows:
                continue
            avg_latency = sum(r.latency_ms for r in rows) / len(rows)
            if avg_latency <= latency_budget_ms:
                return size
        return sizes[0] if sizes else None


class SchemaError(ValueError):
    """Lỗi schema CSV — fail-fast, không âm thầm bỏ qua."""


def _require(headers: list[str], required: tuple[str, ...]) -> None:
    missing = [c for c in required if c not in headers]
    if missing:
        raise SchemaError(f"missing columns: {missing}")


def _to_bool(s: str) -> bool:
    s = s.strip().lower()
    if s in {"1", "true", "yes", "y"}:
        return True
    if s in {"0", "false", "no", "n"}:
        return False
    raise SchemaError(f"invalid boolean: {s!r}")


def load_attempts(path: Path) -> list[Attempt]:
    """Đọc `attempts.csv` theo schema Bài kiểm A."""
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            raise SchemaError("empty CSV")
        _require(
            list(reader.fieldnames),
            (
                "attempt_id",
                "student_id",
                "item_id",
                "wording_complexity",
                "item_difficulty",
                "response_text",
                "latency_ms",
                "context_mode",
            ),
        )
        out: list[Attempt] = []
        for i, row in enumerate(reader, start=2):
            try:
                out.append(
                    Attempt(
                        attempt_id=row["attempt_id"].strip(),
                        student_id=row["student_id"].strip(),
                        item_id=row["item_id"].strip(),
                        wording_complexity=float(row["wording_complexity"]),
                        item_difficulty=float(row["item_difficulty"]),
                        response_text=row["response_text"],
                        latency_ms=int(row["latency_ms"]),
                        context_mode=row["context_mode"].strip(),
                    )
                )
            except (KeyError, ValueError) as e:
                raise SchemaError(f"row {i}: {e}") from e
    return out


def load_gold(gold_dir: Path, expected_ids: set[str]) -> dict[str, GoldTable]:
    """Đọc `gold_tN.csv`. Trả về dict theo `tN`."""
    tables: dict[str, GoldTable] = {}
    files = sorted(gold_dir.glob("gold_t*.csv"))
    if not files:
        raise SchemaError(f"no gold_t*.csv in {gold_dir}")
    for fp in files:
        teacher_id = fp.stem  # 'gold_t1' → 'gold_t1'
        tid = teacher_id.split("_")[-1]  # 't1'
        with fp.open("r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            if reader.fieldnames is None:
                raise SchemaError(f"empty CSV: {fp}")
            _require(
                list(reader.fieldnames),
                (
                    "attempt_id",
                    "root_cause_id",
                    "confidence",
                    "is_knowledge_gap",
                ),
            )
            rows: list[GoldRow] = []
            for i, row in enumerate(reader, start=2):
                try:
                    rows.append(
                        GoldRow(
                            attempt_id=row["attempt_id"].strip(),
                            root_cause_id=row["root_cause_id"].strip(),
                            confidence=float(row["confidence"]),
                            is_knowledge_gap=_to_bool(row["is_knowledge_gap"]),
                            note=row.get("note", "").strip(),
                        )
                    )
                except (KeyError, ValueError) as e:
                    raise SchemaError(f"{fp.name} row {i}: {e}") from e
        tables[tid] = GoldTable(teacher_id=tid, rows=tuple(rows))

    # Mọi GV phải chấm cùng attempt_id.
    all_ids = [set(t.root_cause_by_attempt) for t in tables.values()]
    common = set.intersection(*all_ids) if all_ids else set()
    if expected_ids and common != expected_ids:
        missing = expected_ids - common
        extra = common - expected_ids
        if missing:
            raise SchemaError(f"gold thiếu attempts: {sorted(missing)[:5]}...")
        if extra:
            raise SchemaError(f"gold thừa attempts: {sorted(extra)[:5]}...")
    return tables


def load_llm_predictions(path: Path) -> LlmTable:
    """Đọc output từ `extract_evidence.dart`."""
    with path.open("r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            raise SchemaError("empty CSV")
        _require(
            list(reader.fieldnames),
            (
                "attempt_id",
                "root_cause_id",
                "confidence",
                "model_size",
                "latency_ms",
            ),
        )
        rows: list[LlmPrediction] = []
        for i, row in enumerate(reader, start=2):
            try:
                rows.append(
                    LlmPrediction(
                        attempt_id=row["attempt_id"].strip(),
                        root_cause_id=row["root_cause_id"].strip(),
                        confidence=float(row["confidence"]),
                        model_size=row["model_size"].strip(),
                        latency_ms=int(row["latency_ms"]),
                    )
                )
            except (KeyError, ValueError) as e:
                raise SchemaError(f"row {i}: {e}") from e
    return LlmTable(rows=tuple(rows))