// FR-26 (G.9 vùng trống #5).

import 'package:flutter_test/flutter_test.dart';
import 'package:nekopath_app/engine/transfer/student_transfer.dart';

void main() {
  group('FR-26 — StudentTransfer', () {
    const engine = StudentTransfer();

    TransferRequest req({
      String studentId = 'stu-1',
      String fromClassId = 'class-A',
      String toClassId = 'class-B',
      String fromSchoolId = 'school-X',
      String toSchoolId = 'school-X',
      String transferId = 'trans-1',
      String logicalTimestamp = '5:3',
      String operatorId = 'teacher-1',
    }) =>
        TransferRequest(
          studentId: studentId,
          fromClassId: fromClassId,
          toClassId: toClassId,
          fromSchoolId: fromSchoolId,
          toSchoolId: toSchoolId,
          transferId: transferId,
          logicalTimestamp: logicalTimestamp,
          operatorId: operatorId,
        );

    test('chuyển lớp cùng trường — hợp lệ', () {
      final r = req();
      expect(engine.isValid(r), isTrue);
    });

    test('chuyển trường khác — hợp lệ', () {
      final r = req(toSchoolId: 'school-Y');
      expect(engine.isValid(r), isTrue);
    });

    test('no-op (cùng lớp + cùng trường) — không hợp lệ', () {
      final r = req(fromClassId: 'class-A', toClassId: 'class-A');
      expect(engine.isValid(r), isFalse);
    });

    test('thiếu studentId/transferId — không hợp lệ', () {
      expect(engine.isValid(req(studentId: '')), isFalse);
      expect(engine.isValid(req(transferId: '')), isFalse);
    });

    test('transfer giữ nguyên eventId — không xung đột khi merge', () {
      final existing = ['evt-1', 'evt-2', 'evt-3'];
      final out = engine.transfer(req: req(), existingEventIds: existing);
      expect(out.transferredEvents.length, 3);
      expect(
        out.transferredEvents.map((e) => e.eventId).toList(),
        existing,
      );
    });

    test('append-only — TransferOutcome KHÔNG sửa evidence cũ', () {
      // Đây là ràng buộc thiết kế: không có API mutate.
      // Chỉ kiểm tra transferredEvents là list mới, độc lập.
      final existing = ['evt-1', 'evt-2'];
      final out = engine.transfer(req: req(), existingEventIds: existing);
      // Mỗi TransferredEvidence có transferId + logicalTimestamp mới.
      for (final t in out.transferredEvents) {
        expect(t.transferId, 'trans-1');
        expect(t.logicalTimestamp, '5:3');
        expect(t.toClassId, 'class-B');
      }
    });

    test('danh sách eventId rỗng — có warning nhưng vẫn success', () {
      final out = engine.transfer(req: req(), existingEventIds: const []);
      expect(out.transferredEvents, isEmpty);
      expect(out.warnings, contains('no-evidence-to-transfer'));
    });

    test('TẤT ĐỊNH — cùng input ra cùng TransferredEvidence (cùng eventId, cùng transferId)', () {
      final r = req();
      final existing = ['evt-1', 'evt-2', 'evt-3'];
      final a = engine.transfer(req: r, existingEventIds: existing);
      final b = engine.transfer(req: r, existingEventIds: existing);
      expect(a.transferredEvents.length, b.transferredEvents.length);
      for (var i = 0; i < a.transferredEvents.length; i++) {
        expect(a.transferredEvents[i].eventId, b.transferredEvents[i].eventId);
        expect(a.transferredEvents[i].transferId, b.transferredEvents[i].transferId);
        expect(a.transferredEvents[i].logicalTimestamp, b.transferredEvents[i].logicalTimestamp);
      }
    });
  });
}