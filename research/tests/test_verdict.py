"""Test cho verdict — quyết định PASS/FAIL theo ngưỡng."""

from __future__ import annotations

from research.model_eval.test_a_extraction_quality import TestAConfig
from research.model_eval.verdict import decide


def test_pass_when_all_metrics_meet_threshold() -> None:
    cfg = TestAConfig()
    v = decide(
        config=cfg,
        fleiss=0.80,
        cohen_mean=0.70,
        macro_f1=0.75,
        exact_match=0.60,
    )
    assert v.verdict == "PASS"
    assert "all-metrics-meet-threshold" in v.reasons


def test_fail_when_fleiss_below_threshold() -> None:
    cfg = TestAConfig()
    v = decide(
        config=cfg,
        fleiss=0.60,
        cohen_mean=0.70,
        macro_f1=0.75,
        exact_match=0.60,
    )
    assert v.verdict == "FAIL"
    assert any("fleiss-kappa-below-threshold" in r for r in v.reasons)


def test_fail_when_metric_missing() -> None:
    cfg = TestAConfig()
    v = decide(
        config=cfg,
        fleiss=None,
        cohen_mean=0.70,
        macro_f1=0.75,
        exact_match=0.60,
    )
    assert v.verdict == "FAIL"
    assert "fleiss-kappa-undefined" in v.reasons


def test_fail_lists_all_violations() -> None:
    cfg = TestAConfig()
    v = decide(
        config=cfg,
        fleiss=0.50,
        cohen_mean=0.40,
        macro_f1=0.40,
        exact_match=0.30,
    )
    assert v.verdict == "FAIL"
    assert len(v.reasons) >= 4  # 1 PASS không có → 4 reasons