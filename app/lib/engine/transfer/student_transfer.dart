// FR-26 (Phụ lục G.9, vùng trống #5):
// Hỗ trợ chuyển lớp / chuyển trường cho học sinh.
//
// Quy tắc:
//   * Hồ sơ + bằng chứng KHÔNG bị xoá — chuyển sang lớp/trường mới.
//   * EventId UUIDv7 giữ nguyên → không xung đột khi hợp nhất.
//   * Cờ `transferred` gắn lên từng evidence cũ để truy vết.
//   * Append-only — KHÔNG sửa evidence cũ.
//   * Tất định — cùng input → cùng output.

/// Thông tin chuyển.
class TransferRequest {
  final String studentId;
  final String fromClassId;
  final String toClassId;
  final String fromSchoolId;
  final String toSchoolId;
  final String transferId; // UUIDv7
  final String logicalTimestamp; // BR-17, DR-10 — KHÔNG DateTime.now()
  final String operatorId; // giáo viên / admin thực hiện

  const TransferRequest({
    required this.studentId,
    required this.fromClassId,
    required this.toClassId,
    required this.fromSchoolId,
    required this.toSchoolId,
    required this.transferId,
    required this.logicalTimestamp,
    required this.operatorId,
  });
}

/// Evidence event "đã chuyển" — append-only.
class TransferredEvidence {
  final String eventId; // UUIDv7 — giữ nguyên từ evidence gốc
  final String transferId;
  final String logicalTimestamp;
  final String toClassId;
  final String toSchoolId;

  const TransferredEvidence({
    required this.eventId,
    required this.transferId,
    required this.logicalTimestamp,
    required this.toClassId,
    required this.toSchoolId,
  });
}

/// Kết quả chuyển.
class TransferOutcome {
  final TransferRequest request;
  final List<TransferredEvidence> transferredEvents;
  final List<String> warnings;

  const TransferOutcome({
    required this.request,
    required this.transferredEvents,
    required this.warnings,
  });
}

/// Engine chuyển lớp/trường — tất định, Dart thuần.
class StudentTransfer {
  const StudentTransfer();

  /// Chuyển: tạo `TransferredEvidence` cho từng evidence cũ.
  /// KHÔNG sửa evidence gốc (append-only).
  TransferOutcome transfer({
    required TransferRequest req,
    required List<String> existingEventIds,
  }) {
    final warnings = <String>[];
    if (existingEventIds.isEmpty) {
      warnings.add('no-evidence-to-transfer');
    }

    final transferred = [
      for (final id in existingEventIds)
        TransferredEvidence(
          eventId: id,
          transferId: req.transferId,
          logicalTimestamp: req.logicalTimestamp,
          toClassId: req.toClassId,
          toSchoolId: req.toSchoolId,
        ),
    ];

    return TransferOutcome(
      request: req,
      transferredEvents: transferred,
      warnings: warnings,
    );
  }

  /// Kiểm tra request có hợp lệ không (cùng trường hoặc khác trường đều OK,
  /// nhưng `from` và `to` phải khác nhau để tránh no-op).
  bool isValid(TransferRequest req) {
    if (req.fromClassId == req.toClassId &&
        req.fromSchoolId == req.toSchoolId) {
      return false;
    }
    if (req.studentId.isEmpty || req.transferId.isEmpty) {
      return false;
    }
    return true;
  }
}