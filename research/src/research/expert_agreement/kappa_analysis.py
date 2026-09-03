"""
Cohen's Kappa and Fleiss' Kappa analysis for expert agreement.
Ref: BA Document Section 13.3 - Expert Agreement
"""
import argparse
import json
from pathlib import Path
from typing import NamedTuple
from dataclasses import dataclass

import pandas as pd
import numpy as np


@dataclass
class KappaResult:
    metric: str
    value: float
    interpretation: str
    n_observers: int
    n_subjects: int


def cohens_kappa(ratings: np.ndarray) -> float:
    """
    Calculate Cohen's Kappa for two raters.

    Args:
        ratings: Array of shape (n_items, 2) with ratings from 2 raters

    Returns:
        Kappa coefficient
    """
    n = len(ratings)
    if n == 0:
        return 0.0

    observed_agreement = np.mean(ratings[:, 0] == ratings[:, 1])

    unique_values = np.unique(ratings)
    expected_agreement = 0.0
    for val in unique_values:
        p1 = np.mean(ratings[:, 0] == val)
        p2 = np.mean(ratings[:, 1] == val)
        expected_agreement += p1 * p2

    if expected_agreement == 1.0:
        return 1.0

    kappa = (observed_agreement - expected_agreement) / (1.0 - expected_agreement)
    return max(-1.0, min(1.0, kappa))


def fleiss_kappa(ratings: np.ndarray) -> float:
    """
    Calculate Fleiss' Kappa for multiple raters.

    Args:
        ratings: Array of shape (n_subjects, n_raters) with categorical ratings

    Returns:
        Kappa coefficient
    """
    n_subjects, n_raters = ratings.shape
    if n_subjects == 0 or n_raters == 0:
        return 0.0

    n_categories = int(np.max(ratings)) + 1
    ratings_one_hot = np.zeros((n_subjects, n_categories))

    for i in range(n_subjects):
        for j in range(n_raters):
            cat = int(ratings[i, j])
            if 0 <= cat < n_categories:
                ratings_one_hot[i, cat] += 1

    n_ij = ratings_one_hot
    N = n_subjects
    n = n_raters
    k = n_categories

    p_j = np.sum(n_ij, axis=0) / (N * n)
    P_i = (np.sum(n_ij ** 2, axis=1) - n) / (n * (n - 1))
    P_bar = np.sum(P_i) / N
    P_e = np.sum(p_j ** 2)

    if P_e == 1.0:
        return 1.0

    kappa = (P_bar - P_e) / (1.0 - P_e)
    return max(-1.0, min(1.0, kappa))


def interpret_kappa(kappa: float) -> str:
    """Interpret kappa value according to Landis & Koch (1977)."""
    if kappa < 0:
        return "Poor"
    elif kappa < 0.20:
        return "Slight"
    elif kappa < 0.40:
        return "Fair"
    elif kappa < 0.60:
        return "Moderate"
    elif kappa < 0.80:
        return "Substantial"
    else:
        return "Almost Perfect"


def analyze(input_csv: Path, output_json: Path) -> dict:
    """
    Analyze expert agreement from CSV file.

    CSV format:
    subject_id,rater1,rater2,...
    item_1,1,1,2
    item_2,1,2,2
    ...
    """
    df = pd.read_csv(input_csv)
    ratings = df.iloc[:, 1:].values

    n_observers = ratings.shape[1]
    n_subjects = ratings.shape[0]

    results = {
        "n_subjects": int(n_subjects),
        "n_observers": int(n_observers),
        "metrics": []
    }

    if n_observers == 2:
        kappa = cohens_kappa(ratings)
        results["metrics"].append({
            "type": "cohens_kappa",
            "value": round(kappa, 4),
            "interpretation": interpret_kappa(kappa)
        })
    else:
        kappa = fleiss_kappa(ratings)
        results["metrics"].append({
            "type": "fleiss_kappa",
            "value": round(kappa, 4),
            "interpretation": interpret_kappa(kappa)
        })

    output_json.write_text(json.dumps(results, indent=2, ensure_ascii=False))
    return results


def main():
    parser = argparse.ArgumentParser(
        description="Analyze expert agreement using Cohen's/Fleiss' Kappa"
    )
    parser.add_argument(
        "--input", "-i",
        type=Path,
        required=True,
        help="Input CSV file with ratings"
    )
    parser.add_argument(
        "--output", "-o",
        type=Path,
        required=True,
        help="Output JSON file for results"
    )

    args = parser.parse_args()
    results = analyze(args.input, args.output)

    print(f"Analyzed {results['n_subjects']} subjects with {results['n_observers']} observers")
    for metric in results["metrics"]:
        print(f"  {metric['type']}: {metric['value']} ({metric['interpretation']})")


if __name__ == "__main__":
    main()
