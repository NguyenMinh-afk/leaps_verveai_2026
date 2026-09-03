// DR-11, BR-16.

import 'package:flutter_test/flutter_test.dart';
import 'package:nekopath_app/engine/evidence/evidence_context.dart';
import 'package:nekopath_app/engine/evidence/record_attempt.dart';

void main() {
  group('BR-16 — trọng số theo context', () {
    test('ConfidenceWeights mặc định: in-class (1.0) >= out-of-class (0.7)', () {
      const w = ConfidenceWeights.defaults;
      expect(w.isValid, isTrue);
      expect(w.isMonotonic, isTrue);
      expect(w.inClass, 1.0);
      expect(w.outOfClass, 0.7);
    });

    test('ConfidenceWeights không đơn điệu khi in < out', () {
      const bad = ConfidenceWeights(inClass: 0.5, outOfClass: 0.9);
      expect(bad.isMonotonic, isFalse);
    });

    test('ConfidenceWeights ngoài [0, 1] không hợp lệ', () {
      const bad = ConfidenceWeights(inClass: 1.5, outOfClass: 0.5);
      expect(bad.isValid, isFalse);
    });
  });

  group('DR-11 — EvidenceRecorder', () {
    const recorder = EvidenceRecorder();

    test('ghi evidence in-class với trọng số 1.0', () {
      final e = recorder.record(
        eventId: 'evt-1',
        studentId: 'stu-1',
        itemId: 'item-1',
        response: 1,
        latencyMs: 1200,
        contextMode: ContextMode.inClass,
        logicalTimestamp: '0:1',
        deviceId: 'dev-1',
        sessionId: 'sess-1',
      );
      expect(e.contextMode, ContextMode.inClass);
      expect(e.confidenceWeight, 1.0);
      expect(e.syncStatus, 'pending');
    });

    test('ghi evidence out-of-class với trọng số 0.7', () {
      final e = recorder.record(
        eventId: 'evt-2',
        studentId: 'stu-1',
        itemId: 'item-2',
        response: 0,
        latencyMs: 3000,
        contextMode: ContextMode.outOfClass,
        logicalTimestamp: '0:2',
        deviceId: 'dev-1',
        sessionId: 'sess-1',
      );
      expect(e.contextMode, ContextMode.outOfClass);
      expect(e.confidenceWeight, 0.7);
    });

    test('TẤT ĐỊNH — gọi 2 lần cùng input ra cùng EvidenceEvent', () {
      final a = recorder.record(
        eventId: 'evt-3',
        studentId: 'stu-1',
        itemId: 'item-3',
        response: 1,
        latencyMs: 1200,
        contextMode: ContextMode.inClass,
        logicalTimestamp: '0:3',
        deviceId: 'dev-1',
        sessionId: 'sess-1',
      );
      final b = recorder.record(
        eventId: 'evt-3',
        studentId: 'stu-1',
        itemId: 'item-3',
        response: 1,
        latencyMs: 1200,
        contextMode: ContextMode.inClass,
        logicalTimestamp: '0:3',
        deviceId: 'dev-1',
        sessionId: 'sess-1',
      );
      expect(a.eventId, b.eventId);
      expect(a.confidenceWeight, b.confidenceWeight);
      expect(a.logicalTimestamp, b.logicalTimestamp);
    });
  });
}