// BR-07, BR-08.

import 'package:flutter_test/flutter_test.dart';
import 'package:nekopath_app/engine/grouping/cluster_by_root_cause.dart';

void main() {
  group('BR-07/08 — RootCauseClusterer', () {
    const clusterer = RootCauseClusterer();

    test('danh sách rỗng → không có cụm', () {
      expect(clusterer.cluster(const []), isEmpty);
    });

    test('cụm < sàn 3 HS → bỏ qua', () {
      const input = [
        StudentRootCause(studentId: 's1', rootCauseId: 'RC-A', severity: 0.8),
        StudentRootCause(studentId: 's2', rootCauseId: 'RC-A', severity: 0.7),
      ];
      expect(clusterer.cluster(input), isEmpty);
    });

    test('30% sĩ số lớp 30 HS = 9, nhưng sàn cứng là 3 → lấy max(3, 9) = 9', () {
      // Lớp 30 HS: 30 * 0.3 = 9; sàn 3 → lấy 9.
      final input = List.generate(30, (i) {
        // 10 HS cùng root cause
        if (i < 8) return StudentRootCause(studentId: 's$i', rootCauseId: 'RC-A', severity: 0.7);
        return StudentRootCause(studentId: 's$i', rootCauseId: 'RC-B', severity: 0.5);
      });
      final out = clusterer.cluster(input);
      // RC-A chỉ 8 HS < 9 → bỏ. RC-B có 22 HS → giữ.
      expect(out.length, 1);
      expect(out.first.rootCauseId, 'RC-B');
    });

    test('lớp 10 HS: 30% = 3 = sàn → cụm đủ 3 được giữ', () {
      const input = <StudentRootCause>[
        StudentRootCause(studentId: 's1', rootCauseId: 'RC-A', severity: 0.7),
        StudentRootCause(studentId: 's2', rootCauseId: 'RC-A', severity: 0.7),
        StudentRootCause(studentId: 's3', rootCauseId: 'RC-A', severity: 0.7),
        StudentRootCause(studentId: 's4', rootCauseId: 'RC-B', severity: 0.5),
        StudentRootCause(studentId: 's5', rootCauseId: 'RC-B', severity: 0.5),
      ];
      final out = clusterer.cluster(input);
      expect(out.length, 1);
      expect(out.first.rootCauseId, 'RC-A');
    });

    test('BR-08 — sắp xếp: size giảm dần trước', () {
      const input = [
        // RC-A: 5 HS
        StudentRootCause(studentId: 's1', rootCauseId: 'RC-A', severity: 0.5),
        StudentRootCause(studentId: 's2', rootCauseId: 'RC-A', severity: 0.5),
        StudentRootCause(studentId: 's3', rootCauseId: 'RC-A', severity: 0.5),
        StudentRootCause(studentId: 's4', rootCauseId: 'RC-A', severity: 0.5),
        StudentRootCause(studentId: 's5', rootCauseId: 'RC-A', severity: 0.5),
        // RC-B: 4 HS
        StudentRootCause(studentId: 's6', rootCauseId: 'RC-B', severity: 0.6),
        StudentRootCause(studentId: 's7', rootCauseId: 'RC-B', severity: 0.6),
        StudentRootCause(studentId: 's8', rootCauseId: 'RC-B', severity: 0.6),
        StudentRootCause(studentId: 's9', rootCauseId: 'RC-B', severity: 0.6),
      ];
      final out = clusterer.cluster(input);
      expect(out.first.rootCauseId, 'RC-A'); // size lớn hơn đứng trước
      expect(out.last.rootCauseId, 'RC-B');
    });

    test('BR-08 — tie-break cùng size: severity giảm dần', () {
      const input = [
        StudentRootCause(studentId: 's1', rootCauseId: 'RC-A', severity: 0.4),
        StudentRootCause(studentId: 's2', rootCauseId: 'RC-A', severity: 0.4),
        StudentRootCause(studentId: 's3', rootCauseId: 'RC-A', severity: 0.4),
        StudentRootCause(studentId: 's4', rootCauseId: 'RC-B', severity: 0.7),
        StudentRootCause(studentId: 's5', rootCauseId: 'RC-B', severity: 0.7),
        StudentRootCause(studentId: 's6', rootCauseId: 'RC-B', severity: 0.7),
      ];
      final out = clusterer.cluster(input);
      expect(out.first.rootCauseId, 'RC-B'); // severity cao hơn → ưu tiên
    });

    test('BR-08 — tie-break cùng size + severity: rootCauseId alphabet', () {
      const input = [
        StudentRootCause(studentId: 's1', rootCauseId: 'RC-Z', severity: 0.5),
        StudentRootCause(studentId: 's2', rootCauseId: 'RC-Z', severity: 0.5),
        StudentRootCause(studentId: 's3', rootCauseId: 'RC-Z', severity: 0.5),
        StudentRootCause(studentId: 's4', rootCauseId: 'RC-A', severity: 0.5),
        StudentRootCause(studentId: 's5', rootCauseId: 'RC-A', severity: 0.5),
        StudentRootCause(studentId: 's6', rootCauseId: 'RC-A', severity: 0.5),
      ];
      final out = clusterer.cluster(input);
      expect(out.first.rootCauseId, 'RC-A'); // alphabet trước
    });

    test('TẤT ĐỊNH — cùng input ra cùng output', () {
      const input = [
        StudentRootCause(studentId: 's1', rootCauseId: 'RC-A', severity: 0.5),
        StudentRootCause(studentId: 's2', rootCauseId: 'RC-A', severity: 0.5),
        StudentRootCause(studentId: 's3', rootCauseId: 'RC-A', severity: 0.5),
      ];
      final a = clusterer.cluster(input);
      final b = clusterer.cluster(input);
      expect(a.length, b.length);
      expect(a.first.rootCauseId, b.first.rootCauseId);
      expect(a.first.studentIds, b.first.studentIds);
    });
  });
}