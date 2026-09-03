"""
BKT Self-Consistency Check.
Validates BKT parameters with synthetic data.
Ref: BA Document Section 13.4 - Reproducibility
"""
import argparse
import json
import random
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional

import numpy as np


@dataclass
class BKTParams:
    """Bayesian Knowledge Tracing Parameters."""
    p_l0: float = 0.3      # Initial probability of knowing
    p_t: float = 0.1       # Probability of learning
    p_g: float = 0.1       # Probability of guess
    p_s: float = 0.2       # Probability of slip

    def validate(self) -> list[str]:
        """Validate parameters are in reasonable range."""
        errors = []
        for name in ["p_l0", "p_t", "p_g", "p_s"]:
            value = getattr(self, name)
            if not 0 <= value <= 1:
                errors.append(f"{name} must be between 0 and 1, got {value}")
        if self.p_g + self.p_s > 1:
            errors.append(f"p_g + p_s must be <= 1, got {self.p_g + self.p_s}")
        return errors


@dataclass
class BKTResult:
    """Result of BKT consistency check."""
    params: BKTParams
    consistency_score: float
    is_consistent: bool
    warnings: list[str] = field(default_factory=list)


def simulate_bkt(params: BKTParams, n_students: int, n_opportunities: int) -> dict:
    """
    Simulate BKT model with given parameters.

    Returns:
        dict with mastery_progression and response_patterns
    """
    results = []

    for _ in range(n_students):
        student = {
            "mastery_history": [],
            "responses": [],
            "final_mastery": params.p_l0
        }

        current_mastery = params.p_l0

        for opp in range(n_opportunities):
            current_mastery = min(1.0, current_mastery + params.p_t * (1 - current_mastery))

            correct_prob = current_mastery * (1 - params.p_s) + (1 - current_mastery) * params.p_g
            response = random.random() < correct_prob

            student["mastery_history"].append(round(current_mastery, 4))
            student["responses"].append(1 if response else 0)

        results.append(student)

    return {"students": results}


def check_consistency(params: BKTParams, n_simulations: int = 1000) -> BKTResult:
    """
    Check if BKT parameters are self-consistent.

    A parameter set is consistent if:
    1. Mastery probability stays in [0, 1]
    2. Response probability stays in valid range
    3. Learning converges reasonably
    """
    warnings = []
    consistency_score = 1.0

    errors = params.validate()
    if errors:
        return BKTResult(
            params=params,
            consistency_score=0.0,
            is_consistent=False,
            warnings=errors
        )

    # Simulate and check convergence
    sim_result = simulate_bkt(params, 100, 20)
    all_responses = [r for s in sim_result["students"] for r in s["responses"]]

    avg_correct_rate = np.mean(all_responses)

    # Check if model predicts reasonable correct rate
    # For random guessing with p_l0 mastery: expected = p_l0*(1-p_s) + (1-p_l0)*p_g
    expected_correct = params.p_l0 * (1 - params.p_s) + (1 - params.p_l0) * params.p_g

    if abs(avg_correct_rate - expected_correct) > 0.1:
        consistency_score *= 0.8
        warnings.append(
            f"Observed correct rate ({avg_correct_rate:.3f}) differs from "
            f"expected ({expected_correct:.3f})"
        )

    # Check mastery convergence
    final_masteries = [s["mastery_history"][-1] for s in sim_result["students"]]
    avg_final_mastery = np.mean(final_masteries)

    # After many opportunities, mastery should approach 1
    if avg_final_mastery < 0.5:
        consistency_score *= 0.9
        warnings.append(
            f"Final mastery after 20 opportunities is low ({avg_final_mastery:.3f}). "
            "Consider increasing p_t."
        )

    # Check for negative/overflow mastery
    for student in sim_result["students"]:
        if any(m < 0 or m > 1.1 for m in student["mastery_history"]):
            consistency_score *= 0.5
            warnings.append("Mastery probability went out of valid range")
            break

    is_consistent = consistency_score >= 0.7

    return BKTResult(
        params=params,
        consistency_score=round(consistency_score, 4),
        is_consistent=is_consistent,
        warnings=warnings
    )


def analyze_params(
    p_l0: float,
    p_t: float,
    p_g: float,
    p_s: float,
    output_json: Optional[Path] = None
) -> dict:
    """Analyze BKT parameters and return results."""
    params = BKTParams(p_l0=p_l0, p_t=p_t, p_g=p_g, p_s=p_s)

    result = check_consistency(params)

    output = {
        "input_params": {
            "p_l0": params.p_l0,
            "p_t": params.p_t,
            "p_g": params.p_g,
            "p_s": params.p_s
        },
        "consistency_score": result.consistency_score,
        "is_consistent": result.is_consistent,
        "warnings": result.warnings,
        "recommendation": (
            "APPROVED" if result.is_consistent
            else "REJECTED - Review parameters"
        )
    }

    if output_json:
        output_json.write_text(json.dumps(output, indent=2, ensure_ascii=False))

    return output


def main():
    parser = argparse.ArgumentParser(
        description="Validate BKT parameters using self-consistency check"
    )
    parser.add_argument("--p-l0", type=float, default=0.3, help="Initial mastery")
    parser.add_argument("--p-t", type=float, default=0.1, help="Learn rate")
    parser.add_argument("--p-g", type=float, default=0.1, help="Guess probability")
    parser.add_argument("--p-s", type=float, default=0.2, help="Slip probability")
    parser.add_argument("--output", "-o", type=Path, help="Output JSON file")

    args = parser.parse_args()
    result = analyze_params(
        p_l0=args.p_l0,
        p_t=args.p_t,
        p_g=args.p_g,
        p_s=args.p_s,
        output_json=args.output
    )

    print(f"BKT Parameter Validation")
    print(f"  P(L0)={result['input_params']['p_l0']}, "
          f"P(T)={result['input_params']['p_t']}, "
          f"P(G)={result['input_params']['p_g']}, "
          f"P(S)={result['input_params']['p_s']}")
    print(f"  Consistency Score: {result['consistency_score']}")
    print(f"  Status: {result['recommendation']}")

    if result['warnings']:
        print("  Warnings:")
        for w in result['warnings']:
            print(f"    - {w}")


if __name__ == "__main__":
    main()
