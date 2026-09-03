"""Test cho metrics.py — pure functions, dễ kiểm thử."""

from __future__ import annotations

from research.model_eval.metrics import (
    cohen_kappa,
    confusion_matrix,
    exact_match_ratio,
    fleiss_kappa,
    macro_f1,
    majority_vote,
)


def test_cohen_kappa_perfect_agreement() -> None:
    assert cohen_kappa(["a", "b", "c"], ["a", "b", "c"]) == 1.0


def test_cohen_kappa_random_agreement() -> None:
    # Phân bố cân bằng → κ ≈ 0
    k = cohen_kappa(["a", "b"] * 10, ["b", "a"] * 10)
    # Với phân bố cân bằng hoàn toàn và đảo nhãn, κ phải âm (do agreement < chance).
    assert k < 0


def test_cohen_kappa_empty() -> None:
    assert cohen_kappa([], []) == 0.0


def test_fleiss_kappa_3_raters() -> None:
    # 3 rater đồng ý hoàn toàn → κ = 1.0
    rater_labels = [
        {"a": "X", "b": "Y", "c": "X"},
        {"a": "X", "b": "Y", "c": "X"},
        {"a": "X", "b": "Y", "c": "X"},
    ]
    k = fleiss_kappa(rater_labels, labels=["X", "Y"])
    assert abs(k - 1.0) < 1e-9


def test_fleiss_kappa_partial_agreement() -> None:
    rater_labels = [
        {"a": "X", "b": "Y"},
        {"a": "X", "b": "X"},
        {"a": "Y", "b": "Y"},
    ]
    k = fleiss_kappa(rater_labels, labels=["X", "Y"])
    assert 0.0 <= k <= 1.0


def test_majority_vote_basic() -> None:
    rater_labels = [
        {"a": "X", "b": "Y"},
        {"a": "X", "b": "Y"},
        {"a": "Y", "b": "Y"},
    ]
    consensus = majority_vote(rater_labels)
    assert consensus == {"a": "X", "b": "Y"}


def test_majority_vote_tie_alphabet_first() -> None:
    rater_labels = [
        {"a": "X"},
        {"a": "Y"},
    ]
    consensus = majority_vote(rater_labels)
    assert consensus == {"a": "X"}  # tie → alphabet


def test_macro_f1_perfect() -> None:
    assert macro_f1(["a", "b", "c"], ["a", "b", "c"]) == 1.0


def test_macro_f1_zero() -> None:
    assert macro_f1(["a", "b", "c"], ["x", "y", "z"]) == 0.0


def test_macro_f1_partial() -> None:
    f1 = macro_f1(["a", "b", "a"], ["a", "a", "a"])
    assert 0.0 < f1 < 1.0


def test_exact_match_ratio() -> None:
    assert exact_match_ratio(["a", "b", "c"], ["a", "b", "x"]) == 2 / 3


def test_confusion_matrix() -> None:
    cm = confusion_matrix(["a", "a", "b"], ["a", "b", "b"])
    assert cm == {"a": {"a": 1, "b": 1}, "b": {"b": 1}}