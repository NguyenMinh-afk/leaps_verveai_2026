"""Verdict cho Bài kiểm A — quyết định PASS/FAIL dựa trên metrics.

Tất cả ngưỡng đến từ `TestAConfig` (BA v1.4 — Bảng F.5).
"""

from __future__ import annotations

from dataclasses import dataclass

from research.model_eval.test_a_extraction_quality import TestAConfig


@dataclass(frozen=True)
class Verdict:
    verdict: str  # 'PASS' | 'FAIL'
    reasons: tuple[str, ...]


def decide(
    config: TestAConfig,
    fleiss: float | None,
    cohen_mean: float | None,
    macro_f1: float | None,
    exact_match: float | None,
) -> Verdict:
    """Đánh giá theo từng ngưỡng; fail-fast nếu thiếu metric."""
    reasons: list[str] = []
    ok = True

    if fleiss is None:
        ok = False
        reasons.append("fleiss-kappa-undefined")
    elif fleiss < config.min_fleiss_kappa:
        ok = False
        reasons.append(f"fleiss-kappa-below-threshold:{fleiss:.3f}<{config.min_fleiss_kappa}")

    if cohen_mean is None:
        ok = False
        reasons.append("cohen-kappa-undefined")
    elif cohen_mean < config.min_cohen_kappa_llm_vs_teacher:
        ok = False
        reasons.append(f"cohen-kappa-below-threshold:{cohen_mean:.3f}<{config.min_cohen_kappa_llm_vs_teacher}")

    if macro_f1 is None:
        ok = False
        reasons.append("macro-f1-undefined")
    elif macro_f1 < config.min_macro_f1:
        ok = False
        reasons.append(f"macro-f1-below-threshold:{macro_f1:.3f}<{config.min_macro_f1}")

    if exact_match is None:
        ok = False
        reasons.append("exact-match-undefined")
    elif exact_match < config.min_exact_match_ratio:
        ok = False
        reasons.append(f"exact-match-below-threshold:{exact_match:.3f}<{config.min_exact_match_ratio}")

    if ok and not reasons:
        reasons.append("all-metrics-meet-threshold")

    return Verdict(
        verdict="PASS" if ok else "FAIL",
        reasons=tuple(reasons),
    )