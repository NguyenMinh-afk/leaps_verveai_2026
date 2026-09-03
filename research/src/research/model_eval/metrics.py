"""Metrics cho Bài kiểm A — pure functions, deterministic.

Bao gồm:
  * Cohen's kappa (2 rater)
  * Fleiss' kappa (N rater)
  * Macro F1, exact-match ratio
  * Majority-vote consensus
  * Confusion matrix

Không phụ thuộc pandas / numpy để giữ gọn cho pilot. Tốc độ đủ cho 30 attempts.
"""

from __future__ import annotations

from collections import Counter
from typing import Sequence


def cohen_kappa(y1: Sequence[str], y2: Sequence[str]) -> float:
    """Cohen's kappa giữa 2 rater. Trả về None nếu không tính được (đồng nhất 100%)."""
    if len(y1) != len(y2):
        raise ValueError("y1, y2 phải cùng độ dài")
    if not y1:
        return 0.0
    n = len(y1)
    po = sum(1 for a, b in zip(y1, y2) if a == b) / n
    labels = set(y1) | set(y2)
    pe = sum((Counter(y1)[l] / n) * (Counter(y2)[l] / n) for l in labels)
    if pe == 1.0:
        return 1.0  # đồng nhất hoàn toàn
    return (po - pe) / (1 - pe)


def fleiss_kappa(
    rater_labels: Sequence[dict[str, str]],
    labels: Sequence[str],
) -> float:
    """Fleiss' kappa giữa N rater (mỗi rater ánh xạ attempt_id → label).

    Tất cả rater phải chấm cùng attempt_id; danh sách attempt_id lấy từ rater đầu.
    """
    if not rater_labels:
        return 0.0
    if len(rater_labels) < 2:
        raise ValueError("cần ≥ 2 rater")
    keys = list(rater_labels[0].keys())
    for r in rater_labels[1:]:
        if set(r.keys()) != set(keys):
            raise ValueError("rater phải chấm cùng attempt_id")
    N = len(keys)
    n = len(rater_labels)
    label_idx = {l: i for i, l in enumerate(labels)}
    k = len(labels)

    # Ma trận đếm: N attempts × k labels
    matrix = [[0] * k for _ in range(N)]
    for i, attempt_id in enumerate(keys):
        for r in rater_labels:
            lab = r.get(attempt_id, "")
            if lab not in label_idx:
                # Bỏ qua label lạ (không nên xảy ra với GBNF).
                continue
            matrix[i][label_idx[lab]] += 1

    P_i = []
    for row in matrix:
        s = sum(row)
        if s == 0:
            continue
        P_i.append((sum(x * (x - 1) for x in row)) / (s * (s - 1)))
    P_bar = sum(P_i) / len(P_i) if P_i else 0.0

    p_j = [sum(matrix[i][j] for i in range(N)) / (N * n) for j in range(k)]
    P_e = sum(p * p for p in p_j)

    if P_e == 1.0:
        return 1.0
    return (P_bar - P_e) / (1 - P_e)


def majority_vote(rater_labels: Sequence[dict[str, str]]) -> dict[str, str]:
    """Majority-vote consensus. Bỏ qua attempt không có đủ nhãn."""
    if not rater_labels:
        return {}
    keys = set(rater_labels[0].keys())
    for r in rater_labels[1:]:
        keys &= set(r.keys())

    consensus: dict[str, str] = {}
    for k in keys:
        votes = Counter(r[k] for r in rater_labels if k in r)
        if not votes:
            continue
        most_common, freq = votes.most_common(1)[0]
        # Tie: chọn alphabet đầu → deterministic.
        tied = [lab for lab, c in votes.items() if c == freq]
        consensus[k] = sorted(tied)[0]
    return consensus


def macro_f1(y_true: Sequence[str], y_pred: Sequence[str]) -> float:
    """Macro F1 — trung bình F1 theo từng class."""
    if len(y_true) != len(y_pred):
        raise ValueError("y_true, y_pred cùng độ dài")
    if not y_true:
        return 0.0
    labels = sorted(set(y_true) | set(y_pred))
    f1s: list[float] = []
    for lab in labels:
        tp = sum(1 for t, p in zip(y_true, y_pred) if t == lab and p == lab)
        fp = sum(1 for t, p in zip(y_true, y_pred) if t != lab and p == lab)
        fn = sum(1 for t, p in zip(y_true, y_pred) if t == lab and p != lab)
        if tp == 0 and fp == 0 and fn == 0:
            continue
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        if precision + recall == 0:
            f1s.append(0.0)
        else:
            f1s.append(2 * precision * recall / (precision + recall))
    return sum(f1s) / len(f1s) if f1s else 0.0


def exact_match_ratio(y_true: Sequence[str], y_pred: Sequence[str]) -> float:
    if len(y_true) != len(y_pred):
        raise ValueError("y_true, y_pred cùng độ dài")
    if not y_true:
        return 0.0
    return sum(1 for t, p in zip(y_true, y_pred) if t == p) / len(y_true)


def confusion_matrix(
    y_true: Sequence[str],
    y_pred: Sequence[str],
) -> dict[str, dict[str, int]]:
    """Confusion matrix `cm[true][pred] = count`."""
    if len(y_true) != len(y_pred):
        raise ValueError("y_true, y_pred cùng độ dài")
    cm: dict[str, dict[str, int]] = {}
    for t, p in zip(y_true, y_pred):
        cm.setdefault(t, {}).setdefault(p, 0)
        cm[t][p] += 1
    return cm