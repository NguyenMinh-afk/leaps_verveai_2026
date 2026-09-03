// TS-07: Cập nhật Bayes với tham số cố định, KHÔNG có yếu tố ngẫu nhiên.
// BKT (Bayesian Knowledge Tracing) — FR-06 → FR-11.
//
// Tính chất BẮT BUỘC:
//   * Cùng đầu vào → cùng đầu ra (idempotent).
//   * KHÔNG Random, DateTime.now(), processId, v.v.
//   * Tham số là `const` — không truyền qua config runtime.

import 'dart:math' as math;

/// Bốn tham số BKT — khai báo `const` ở compile time.
class BktParams {
  /// P(L0): xác suất tiên nghiệm học sinh đã biết kỹ năng trước lượt đầu.
  final double pL0;
  final double pT;
  final double pG;
  final double pS;

  const BktParams({
    required this.pL0,
    required this.pT,
    required this.pG,
    required this.pS,
  });

  /// Tham số mặc định — theo BA v1.4, dùng cho pilot.
  static const BktParams defaults = BktParams(
    pL0: 0.10,
    pT: 0.20,
    pG: 0.20,
    pS: 0.10,
  );

  bool get isValid =>
      pL0 >= 0 && pL0 <= 1 &&
      pT >= 0 && pT <= 1 &&
      pG >= 0 && pG <= 1 &&
      pS >= 0 && pS <= 1;
}

/// Trạng thái BKT cho một (studentId, skillId).
class BktState {
  final String studentId;
  final String skillId;
  final double pKnown;

  const BktState({
    required this.studentId,
    required this.skillId,
    required this.pKnown,
  });

  BktState copyWith({double? pKnown}) => BktState(
        studentId: studentId,
        skillId: skillId,
        pKnown: pKnown ?? this.pKnown,
      );

  @override
  bool operator ==(Object other) =>
      other is BktState &&
      other.studentId == studentId &&
      other.skillId == skillId &&
      (other.pKnown - pKnown).abs() < 1e-12;

  @override
  int get hashCode => Object.hash(studentId, skillId, pKnown.toStringAsFixed(12));
}

/// BKT updater — Dart thuần, không phụ thuộc Flutter.
class Bkt {
  final BktParams params;
  const Bkt({this.params = BktParams.defaults});

  /// Trạng thái ban đầu — pKnown = pL0.
  BktState initial(String studentId, String skillId) =>
      BktState(studentId: studentId, skillId: skillId, pKnown: params.pL0);

  /// Cập nhật Bayesian 1 lượt. Tất định theo (state, correct).
  ///
  /// P(L_n | correct) = (P(L_{n-1}) * (1 - pS)) / (...)
  /// P(L_n | incorrect) = (P(L_{n-1}) * pS) / (...)
  ///
  /// Sau đó áp dụng học: P(L_n) += (1 - P(L_n)) * pT nếu đúng.
  BktState update(BktState prev, bool correct) {
    final p = prev.pKnown;
    final double num;
    final double den;

    if (correct) {
      num = p * (1 - params.pS);
      den = num + (1 - p) * params.pG;
    } else {
      num = p * params.pS;
      den = num + (1 - p) * (1 - params.pG);
    }

    final postEvidence = (den == 0) ? 0.0 : num / den;
    final learned = correct ? (1 - postEvidence) * params.pT : 0.0;
    final next = postEvidence + learned;

    return prev.copyWith(pKnown: _clamp01(next));
  }

  /// Ngưỡng mastery — mặc định 0.95 (theo FR-09 + BA v1.4).
  static const double kMasteryThreshold = 0.95;

  bool isMastered(BktState s) => s.pKnown >= kMasteryThreshold;

  /// Log-likelihood gợi ý — dùng cho self_consistency_check.py (Python đối chiếu).
  double logLikelihood(Iterable<({BktState state, bool correct})> sequence) {
    var sum = 0.0;
    var s = params.pL0;
    for (final step in sequence) {
      // Xác suất quan sát được tại state pKnown = s.
      final pObsIfKnown = step.correct ? (1 - params.pS) : params.pS;
      final pObsIfUnknown = step.correct ? params.pG : (1 - params.pG);
      final obsProb = s * pObsIfKnown + (1 - s) * pObsIfUnknown;
      if (obsProb <= 0) return double.negativeInfinity;
      sum += math.log(obsProb);
      // Cập nhật state cho bước tiếp.
      final num = s * pObsIfKnown;
      final den = num + (1 - s) * pObsIfUnknown;
      final postEv = (den == 0) ? 0.0 : num / den;
      s = postEv + (step.correct ? (1 - postEv) * params.pT : 0.0);
      s = _clamp01(s);
    }
    return sum;
  }

  static double _clamp01(double v) => v < 0 ? 0 : (v > 1 ? 1 : v);
}