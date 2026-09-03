// FR-25 (G.9 vùng trống #1):
// Phát hiện rào cản ngôn ngữ — sai vì đọc/hiểu sai đề, không phải hổng kiến thức.

import 'package:flutter_test/flutter_test.dart';
import 'package:nekopath_app/engine/diagnose/language_barrier_detector.dart';

void main() {
  group('FR-25 — LanguageBarrierDetector', () {
    const det = LanguageBarrierDetector();

    test('input rỗng → probability = 0, không flag', () {
      final v = det.detect(const []);
      expect(v.probability, 0.0);
      expect(v.shouldFlag, isFalse);
      expect(v.reason, 'no-data');
    });

    test('toàn đúng → probability = 0, không flag', () {
      final v = det.detect(const [
        AttemptSignal(correct: true, itemDifficulty: 0.5, wordingComplexity: 0.5, latencyMs: 1500),
        AttemptSignal(correct: true, itemDifficulty: 0.4, wordingComplexity: 0.4, latencyMs: 1500),
      ]);
      expect(v.shouldFlag, isFalse);
      expect(v.reason, 'all-correct');
    });

    test('sai câu dễ (difficulty < 0.3) → tăng probability', () {
      final v = det.detect(const [
        AttemptSignal(correct: false, itemDifficulty: 0.1, wordingComplexity: 0.3, latencyMs: 1200),
        AttemptSignal(correct: false, itemDifficulty: 0.2, wordingComplexity: 0.3, latencyMs: 1200),
        AttemptSignal(correct: false, itemDifficulty: 0.15, wordingComplexity: 0.3, latencyMs: 1200),
      ]);
      expect(v.probability, greaterThan(0.0));
    });

    test('sai câu wording phức tạp + đúng câu wording đơn giản → flag', () {
      final v = det.detect(const [
        AttemptSignal(correct: false, itemDifficulty: 0.7, wordingComplexity: 0.9, latencyMs: 1500),
        AttemptSignal(correct: true, itemDifficulty: 0.7, wordingComplexity: 0.1, latencyMs: 1500),
      ]);
      expect(v.shouldFlag, isTrue);
      expect(v.reason, 'cross-wording-pattern');
    });

    test('TẤT ĐỊNH — cùng input luôn ra cùng verdict', () {
      const input = [
        AttemptSignal(correct: false, itemDifficulty: 0.6, wordingComplexity: 0.8, latencyMs: 1500),
        AttemptSignal(correct: true, itemDifficulty: 0.4, wordingComplexity: 0.2, latencyMs: 1500),
      ];
      final v1 = det.detect(input);
      final v2 = det.detect(input);
      expect(v1.probability, v2.probability);
      expect(v1.shouldFlag, v2.shouldFlag);
      expect(v1.reason, v2.reason);
    });

    test('chỉ xét tối đa kWindowSize lượt gần nhất', () {
      // 3 lượt cũ toàn sai khó, 2 lượt gần toàn đúng → kết quả dựa trên 2 lượt gần.
      final v = det.detect(const [
        AttemptSignal(correct: false, itemDifficulty: 0.9, wordingComplexity: 0.9, latencyMs: 1500),
        AttemptSignal(correct: false, itemDifficulty: 0.9, wordingComplexity: 0.9, latencyMs: 1500),
        AttemptSignal(correct: false, itemDifficulty: 0.9, wordingComplexity: 0.9, latencyMs: 1500),
        AttemptSignal(correct: true, itemDifficulty: 0.5, wordingComplexity: 0.5, latencyMs: 1500),
        AttemptSignal(correct: true, itemDifficulty: 0.5, wordingComplexity: 0.5, latencyMs: 1500),
        AttemptSignal(correct: true, itemDifficulty: 0.5, wordingComplexity: 0.5, latencyMs: 1500),
      ]);
      // Cửa sổ 5 lượt cuối → 3 đúng + 2 sai câu khó, wording TB = 0.5.
      // easy-wrong ratio = 0 → không trigger easy-items-wrong.
      // Không có cross-pattern (đúng câu dễ + sai câu khó wording phức tạp) vì wording = 0.5.
      // Kỳ vọng: không flag (probability < 0.6).
      expect(v.shouldFlag, isFalse);
    });

    test('latency bất thường → abnormal-latency ratio cao', () {
      final v = det.detect(const [
        AttemptSignal(correct: false, itemDifficulty: 0.6, wordingComplexity: 0.6, latencyMs: 100),
        AttemptSignal(correct: false, itemDifficulty: 0.6, wordingComplexity: 0.6, latencyMs: 200),
        AttemptSignal(correct: false, itemDifficulty: 0.6, wordingComplexity: 0.6, latencyMs: 150),
      ]);
      // Latency rất ngắn so với "median" → abnormal.
      expect(v.reason, anyOf('abnormal-latency', 'weak-signal'));
    });
  });
}