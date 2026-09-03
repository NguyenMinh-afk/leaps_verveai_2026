// FR-25 (Phụ lục G.9, vùng trống #1):
// Phát hiện rào cản ngôn ngữ — tránh kết luận nhầm "hổng kiến thức"
// khi học sinh thực ra sai vì đọc/hiểu sai đề.
//
// Đặc tính BẮT BUỘC:
//   - Thuộc Lớp 2 (engine) — KHÔNG phụ thuộc LLM. Chạy độc lập với inference/.
//   - Tất định: cùng input → cùng kết luận.
//   - Trả về mức tin cậy do lớp này tính (BR-01, AIR-15).
//
// Ý tưởng (heuristic, không cần LLM):
//   Dựa vào một số tín hiệu rõ ràng từ `EvidenceEvent`:
//     1. Sai đề khó (item difficulty cao) liên tiếp nhiều câu → có thể là barrier.
//     2. Sai đề dễ (item difficulty thấp) liên tiếp nhiều câu → gần như chắc chắn
//        hổng kiến thức.
//     3. Sai ở câu có wording phức tạp nhưng đúng ở câu tương tự wording đơn giản
//        → barrier rất cao.
//     4. Sai kèm `latencyMs` bất thường (rất lâu hoặc rất nhanh) → có thể do hiểu sai.

/// Tín hiệu quan sát được về 1 lượt trả lời.
class AttemptSignal {
  final bool correct;
  final double itemDifficulty; // 0.0 (rất dễ) .. 1.0 (rất khó)
  final double wordingComplexity; // 0.0 (đơn giản) .. 1.0 (phức tạp)
  final int latencyMs;

  const AttemptSignal({
    required this.correct,
    required this.itemDifficulty,
    required this.wordingComplexity,
    required this.latencyMs,
  });
}

/// Kết quả phát hiện rào cản ngôn ngữ.
class LanguageBarrierVerdict {
  /// Xác suất (0..1) rằng lỗi gần đây do rào cản ngôn ngữ, không phải hổng kiến thức.
  final double probability;

  /// Cờ cảnh báo — engine Lớp 2 quyết định, không phải LLM (BR-01, AIR-15).
  final bool shouldFlag;

  /// Lý do giải thích — cho dashboard giáo viên.
  final String reason;

  const LanguageBarrierVerdict({
    required this.probability,
    required this.shouldFlag,
    required this.reason,
  });

  @override
  String toString() =>
      'LanguageBarrierVerdict(p=$probability, flag=$shouldFlag, reason="$reason")';
}

/// Detector tất định — Dart thuần, không phụ thuộc Flutter.
class LanguageBarrierDetector {
  /// Số lượt gần đây tối đa cần xét.
  static const int kWindowSize = 5;

  /// Ngưỡng `shouldFlag` — probability vượt qua → cờ.
  static const double kFlagThreshold = 0.6;

  const LanguageBarrierDetector();

  /// Phát hiện rào cản dựa trên cửa sổ lượt gần đây.
  LanguageBarrierVerdict detect(List<AttemptSignal> recentAttempts) {
    if (recentAttempts.isEmpty) {
      return const LanguageBarrierVerdict(
        probability: 0.0,
        shouldFlag: false,
        reason: 'no-data',
      );
    }

    final window = recentAttempts.length > kWindowSize
        ? recentAttempts.sublist(recentAttempts.length - kWindowSize)
        : recentAttempts;

    final wrongAttempts = window.where((a) => !a.correct).toList();
    if (wrongAttempts.isEmpty) {
      return const LanguageBarrierVerdict(
        probability: 0.0,
        shouldFlag: false,
        reason: 'all-correct',
      );
    }

    // Tín hiệu 1: trung bình wording complexity của các câu sai
    final avgWording = wrongAttempts
            .map((a) => a.wordingComplexity)
            .fold<double>(0, (acc, v) => acc + v) /
        wrongAttempts.length;

    // Tín hiệu 2: tỉ lệ câu "dễ" bị sai (difficulty < 0.3)
    final easyWrong = wrongAttempts.where((a) => a.itemDifficulty < 0.3).length;
    final easyWrongRatio = easyWrong / wrongAttempts.length;

    // Tín hiệu 3: latency bất thường (rất ngắn hoặc rất dài so với trung vị)
    final latencies = window.map((a) => a.latencyMs).toList()..sort();
    final medianLatency = latencies[latencies.length ~/ 2];
    final abnormalLatency = wrongAttempts
        .where((a) =>
            a.latencyMs < medianLatency * 0.3 || a.latencyMs > medianLatency * 3.0,
        )
        .length;
    final abnormalLatencyRatio = abnormalLatency / wrongAttempts.length;

    // Tín hiệu 4: nếu có câu wording phức tạp sai và wording đơn giản đúng → barrier
    final complexWrong = wrongAttempts.where((a) => a.wordingComplexity > 0.7).length;
    final simpleCorrect = window
        .where((a) => a.correct && a.wordingComplexity < 0.3)
        .length;
    final crossPattern = complexWrong >= 1 && simpleCorrect >= 1;

    // Gộp tín hiệu — tất cả đều deterministic.
    // Các trọng số được cố định (compile-time const).
    const wWording = 0.35;
    const wEasyWrong = 0.25;
    const wAbnormalLatency = 0.15;
    const wCrossPattern = 0.25;

    final p = (avgWording * wWording) +
        (easyWrongRatio * wEasyWrong) +
        (abnormalLatencyRatio * wAbnormalLatency) +
        (crossPattern ? wCrossPattern : 0.0);

    final clamped = p < 0 ? 0.0 : (p > 1 ? 1.0 : p);

    String reason;
    if (crossPattern) {
      reason = 'cross-wording-pattern';
    } else if (easyWrongRatio > 0.5) {
      reason = 'easy-items-wrong';
    } else if (avgWording > 0.7) {
      reason = 'complex-wording-wrong';
    } else if (abnormalLatencyRatio > 0.5) {
      reason = 'abnormal-latency';
    } else {
      reason = 'weak-signal';
    }

    return LanguageBarrierVerdict(
      probability: clamped,
      shouldFlag: clamped >= kFlagThreshold,
      reason: reason,
    );
  }
}