// DR-11: Ghi lại evidence mỗi lượt HS trả lời. Append-only.
// Trọng số theo context (BR-16).
//
// Đặc tính:
//   - Cùng input → cùng EvidenceEvent (idempotent).
//   - KHÔNG DateTime.now() — dùng logical clock bên ngoài truyền vào.

import 'package:nekopath_app/engine/evidence/evidence_context.dart';

/// Builder tất định — không có yếu tố ngẫu nhiên.
class EvidenceRecorder {
  final ConfidenceWeights weights;

  const EvidenceRecorder({this.weights = ConfidenceWeights.defaults});

  /// Sinh evidence mới từ input. `logicalTimestamp` do caller cung cấp
  /// (từ `hub/logical_clock.dart`) — KHÔNG dùng DateTime.now().
  EvidenceEvent record({
    required String eventId,
    required String studentId,
    required String itemId,
    required int response,
    required int latencyMs,
    required ContextMode contextMode,
    required String logicalTimestamp,
    required String deviceId,
    required String sessionId,
  }) {
    return EvidenceEvent(
      eventId: eventId,
      studentId: studentId,
      itemId: itemId,
      response: response,
      latencyMs: latencyMs,
      contextMode: contextMode,
      confidenceWeight: weights.forMode(contextMode),
      logicalTimestamp: logicalTimestamp,
      deviceId: deviceId,
      sessionId: sessionId,
      syncStatus: 'pending',
    );
  }
}