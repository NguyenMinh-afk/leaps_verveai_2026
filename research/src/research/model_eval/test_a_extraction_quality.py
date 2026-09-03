"""Bài kiểm A — Chất lượng trích xuất bằng chứng (BA v1.4 — Bảng F.5).

Quyết định: đưa `app/lib/inference/` ra khỏi trạng thái **[A]** hay không.

Quy ước:
- Cùng input → cùng verdict (idempotent).
- KHÔNG gọi cloud.
- KHÔNG commit dữ liệu thật; dữ liệu đã ẩn danh trước khi đưa vào (DR-08).
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Sequence

from research.model_eval import csv_loader, metrics, verdict


@dataclass(frozen=True)
class TestAConfig:
    """Ngưỡng quyết định — theo BA v1.4."""

    min_fleiss_kappa: float = 0.70
    min_cohen_kappa_llm_vs_teacher: float = 0.60
    min_macro_f1: float = 0.65
    min_exact_match_ratio: float = 0.50


@dataclass(frozen=True)
class TestAReport:
    """Báo cáo cuối — JSON-serializable."""

    n_attempts: int
    n_teachers: int
    fleiss_kappa_teachers: float | None
    cohen_kappa_per_teacher: dict[str, float] = field(default_factory=dict)
    cohen_kappa_mean_llm_vs_teacher: float | None = None
    macro_f1_llm_vs_consensus: float | None = None
    exact_match_ratio: float | None = None
    confusion_matrix: dict[str, dict[str, int]] = field(default_factory=dict)
    per_attempt: list[dict[str, str | int | float | None]] = field(default_factory=list)
    thresholds: dict[str, float] = field(default_factory=dict)
    verdict: str = "FAIL"
    reasons: list[str] = field(default_factory=list)
    best_model: str | None = None

    def to_json(self) -> str:
        return json.dumps(self.__dict__, ensure_ascii=False, indent=2)


def run(
    attempts_csv: Path,
    gold_dir: Path,
    llm_csv: Path,
    config: TestAConfig = TestAConfig(),
) -> TestAReport:
    """Chạy Bài kiểm A. Tất cả bước đều deterministic."""
    attempts = csv_loader.load_attempts(attempts_csv)
    gold_tables = csv_loader.load_gold(gold_dir, expected_ids={a.attempt_id for a in attempts})
    llm = csv_loader.load_llm_predictions(llm_csv)

    if len(attempts) < 30:
        # BA yêu cầu 30 bài — không chạy nếu thiếu.
        return TestAReport(
            n_attempts=len(attempts),
            n_teachers=len(gold_tables),
            fleiss_kappa_teachers=None,
            thresholds=config.__dict__,
            verdict="FAIL",
            reasons=[f"need-30-attempts-got-{len(attempts)}"],
        )

    # 1. Fleiss' kappa giữa 3 GV
    fleiss = metrics.fleiss_kappa(
        [g.root_cause_by_attempt for g in gold_tables.values()],
        labels=sorted({rc for g in gold_tables.values() for rc in g.root_cause_by_attempt.values()}),
    )

    # 2. Cohen's kappa LLM vs từng GV
    cohen_per_teacher: dict[str, float] = {}
    for tname, gold in gold_tables.items():
        cohen_per_teacher[tname] = metrics.cohen_kappa(
            [llm.root_cause_by_attempt[a.attempt_id] for a in attempts if a.attempt_id in llm.root_cause_by_attempt],
            [gold.root_cause_by_attempt[a.attempt_id] for a in attempts if a.attempt_id in gold.root_cause_by_attempt],
        )

    cohen_mean = (
        sum(cohen_per_teacher.values()) / len(cohen_per_teacher)
        if cohen_per_teacher
        else None
    )

    # 3. Majority-vote consensus từ 3 GV
    consensus = metrics.majority_vote(
        [g.root_cause_by_attempt for g in gold_tables.values()]
    )

    # 4. Macro F1 + exact match LLM vs consensus
    macro_f1 = metrics.macro_f1(
        y_true=[consensus.get(a.attempt_id, "") for a in attempts],
        y_pred=[llm.root_cause_by_attempt.get(a.attempt_id, "") for a in attempts],
    )
    exact_match = metrics.exact_match_ratio(
        y_true=[consensus.get(a.attempt_id, "") for a in attempts],
        y_pred=[llm.root_cause_by_attempt.get(a.attempt_id, "") for a in attempts],
    )

    # 5. Confusion matrix (LLM × consensus)
    cm = metrics.confusion_matrix(
        y_true=[consensus.get(a.attempt_id, "") for a in attempts],
        y_pred=[llm.root_cause_by_attempt.get(a.attempt_id, "") for a in attempts],
    )

    # 6. Per-attempt chi tiết (debug + audit)
    per_attempt = []
    for a in attempts:
        per_attempt.append({
            "attempt_id": a.attempt_id,
            "consensus": consensus.get(a.attempt_id),
            "llm": llm.root_cause_by_attempt.get(a.attempt_id),
            "model_size": llm.model_size_by_attempt.get(a.attempt_id),
            "gold_t1": gold_tables["t1"].root_cause_by_attempt.get(a.attempt_id) if "t1" in gold_tables else None,
            "gold_t2": gold_tables["t2"].root_cause_by_attempt.get(a.attempt_id) if "t2" in gold_tables else None,
            "gold_t3": gold_tables["t3"].root_cause_by_attempt.get(a.attempt_id) if "t3" in gold_tables else None,
        })

    # 7. Verdict
    v = verdict.decide(
        config=config,
        fleiss=fleiss,
        cohen_mean=cohen_mean,
        macro_f1=macro_f1,
        exact_match=exact_match,
    )

    # 8. Chọn cỡ model tốt nhất — dựa trên latency và macro_f1.
    best = llm.best_model_size(macro_f1=macro_f1, latency_budget_ms=2000)

    return TestAReport(
        n_attempts=len(attempts),
        n_teachers=len(gold_tables),
        fleiss_kappa_teachers=fleiss,
        cohen_kappa_per_teacher=cohen_per_teacher,
        cohen_kappa_mean_llm_vs_teacher=cohen_mean,
        macro_f1_llm_vs_consensus=macro_f1,
        exact_match_ratio=exact_match,
        confusion_matrix=cm,
        per_attempt=per_attempt,
        thresholds=config.__dict__,
        verdict=v.verdict,
        reasons=v.reasons,
        best_model=best,
    )


def _parse_args(argv: Sequence[str]) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        prog="test_a_extraction_quality",
        description="Bài kiểm A — chất lượng trích xuất bằng chứng (Bảng F.5).",
    )
    p.add_argument("--attempts", type=Path, required=True, help="CSV 30 bài làm.")
    p.add_argument("--gold", type=Path, required=True, help="Thư mục chứa gold_tN.csv.")
    p.add_argument("--llm", type=Path, required=True, help="CSV output LLM.")
    p.add_argument("--out", type=Path, required=True, help="File JSON report.")
    return p.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = _parse_args(sys.argv[1:] if argv is None else argv)
    report = run(
        attempts_csv=args.attempts,
        gold_dir=args.gold,
        llm_csv=args.llm,
    )
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(report.to_json(), encoding="utf-8")
    print(f"[Bài kiểm A] verdict={report.verdict}")
    for r in report.reasons:
        print(f"  - {r}")
    print(f"[Bài kiểm A] report → {args.out}")
    return 0 if report.verdict == "PASS" else 2


if __name__ == "__main__":
    raise SystemExit(main())