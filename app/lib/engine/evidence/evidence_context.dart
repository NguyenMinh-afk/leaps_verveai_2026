// DR-11, BR-16: Bằng chứng có trọng số theo bối cảnh in/out-of-class.
// eventId UUIDv7 (timestamp-sortable), timestamp dùng logical_clock (BR-17, DR-10) — KHÔNG giờ máy.

/// Bối cảnh ghi bằng chứng — phân biệt in-class (cao trọng số) và out-of-class.
enum ContextMode {
  /// Trong lớp — quan sát trực tiếp bởi giáo viên. Trọng số cao nhất.
  inClass,

  /// Ngoài lớp — bài tập về nhà, tự học. Trọng số thấp hơn.
  outOfClass,
}

extension ContextModeX on ContextMode {
  String get id => switch (this) {
        ContextMode.inClass => 'in-class',
        ContextMode.outOfClass => 'out-of-class',
      };
}

/// Trọng số tin cậy mặc định — theo BR-16.
class ConfidenceWeights {
  final double inClass;
  final double outOfClass;

  const ConfidenceWeights({
    required this.inClass,
    required this.outOfClass,
  });

  /// BR-16 mặc định — in-class = 1.0, out-of-class = 0.7.
  static const ConfidenceWeights defaults = ConfidenceWeights(
    inClass: 1.0,
    outOfClass: 0.7,
  );

  bool get isValid =>
      inClass >= 0 && inClass <= 1 &&
      outOfClass >= 0 && outOfClass <= 1;

  /// Ràng buộc BR-16: in-class phải có trọng số ≥ out-of-class.
  bool get isMonotonic => inClass >= outOfClass;

  double forMode(ContextMode m) => switch (m) {
        ContextMode.inClass => inClass,
        ContextMode.outOfClass => outOfClass,
      };
}

/// Bằng chứng 1 lượt tương tác — append-only (DR-11, BR-09 read-only).
class EvidenceEvent {
  /// UUIDv7 (timestamp-sortable). Không dùng DateTime.now() — do `LogicalClock` sinh.
  final String eventId;
  final String studentId;
  final String itemId;
  final int response; // 0 = incorrect, 1 = correct
  final int latencyMs;
  final ContextMode contextMode;
  final double confidenceWeight;
  final String logicalTimestamp; // vector clock lai — KHÔNG DateTime ISO
  final String deviceId;
  final String sessionId;
  final String syncStatus; // 'pending' | 'synced' | 'conflict'

  const EvidenceEvent({
    required this.eventId,
    required this.studentId,
    required this.itemId,
    required this.response,
    required this.latencyMs,
    required this.contextMode,
    required this.confidenceWeight,
    required this.logicalTimestamp,
    required this.deviceId,
    required this.sessionId,
    required this.syncStatus,
  });

  EvidenceEvent copyWith({String? syncStatus}) => EvidenceEvent(
        eventId: eventId,
        studentId: studentId,
        itemId: itemId,
        response: response,
        latencyMs: latencyMs,
        contextMode: contextMode,
        confidenceWeight: confidenceWeight,
        logicalTimestamp: logicalTimestamp,
        deviceId: deviceId,
        sessionId: sessionId,
        syncStatus: syncStatus ?? this.syncStatus,
      );
}