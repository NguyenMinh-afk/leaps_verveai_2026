// BR-07, BR-08: Phân cụm học sinh theo nguyên nhân hổng kiến thức.
// BR-07: cụm phải đạt 30% sĩ số lớp, sàn 3 học sinh.
// BR-08: tie-break theo Mục 19.4 — ưu tiên (a) số lượng HS,
//        (b) độ khó giảm dần, (c) thứ tự root-causeId bảng chữ cái.
//
// Tất định, Dart thuần — Lớp 2 engine.

/// Một học sinh với nguyên nhân hổng kiến thức chính.
class StudentRootCause {
  final String studentId;
  final String rootCauseId;
  final double severity;

  const StudentRootCause({
    required this.studentId,
    required this.rootCauseId,
    required this.severity,
  });
}

/// Một cụm — sẵn để hiển thị cho GV (CO-T can thiệp).
class RootCauseCluster {
  final String rootCauseId;
  final List<String> studentIds;
  final double averageSeverity;

  const RootCauseCluster({
    required this.rootCauseId,
    required this.studentIds,
    required this.averageSeverity,
  });
}

/// Clusterer tất định — Dart thuần.
class RootCauseClusterer {
  /// BR-07 — sàn kích thước cụm.
  static const int kMinClusterSize = 3;

  /// BR-07 — cụm phải đạt 30% sĩ số lớp.
  static const double kMinSizeRatio = 0.30;

  const RootCauseClusterer();

  /// BR-08 — tie-break: ưu tiên root-causeId bảng chữ cái.
  static int tieBreak(String a, String b) {
    final cmp = a.compareTo(b);
    if (cmp != 0) return cmp;
    return 0;
  }

  /// Phân cụm: gom HS theo rootCauseId, lọc cụm nhỏ hơn sàn.
  /// Trả về danh sách cụm, sắp theo BR-08:
  ///   1. size giảm dần.
  ///   2. averageSeverity giảm dần.
  ///   3. rootCauseId tăng dần (tie-break).
  List<RootCauseCluster> cluster(List<StudentRootCause> students) {
    if (students.isEmpty) return const [];

    // Gom theo rootCauseId
    final groups = <String, List<StudentRootCause>>{};
    for (final s in students) {
      groups.putIfAbsent(s.rootCauseId, () => []).add(s);
    }

    final totalStudents = students.length;
    const minSize = kMinClusterSize;
    final minSizeByRatio = (totalStudents * kMinSizeRatio).ceil();
    final effectiveMin = minSize > minSizeByRatio ? minSize : minSizeByRatio;

    final clusters = <RootCauseCluster>[];
    groups.forEach((cause, list) {
      if (list.length < effectiveMin) {
        return; // Bỏ qua cụm nhỏ hơn sàn.
      }
      final avg = list
        .map((s) => s.severity)
        .fold<double>(0, (acc, v) => acc + v) /
        list.length;
      clusters.add(RootCauseCluster(
        rootCauseId: cause,
        studentIds: list.map((s) => s.studentId).toList()..sort(),
        averageSeverity: avg,
      ),);
    });

    // BR-08 — sắp xếp.
    clusters.sort((a, b) {
      final bySize = b.studentIds.length.compareTo(a.studentIds.length);
      if (bySize != 0) return bySize;
      final bySeverity = b.averageSeverity.compareTo(a.averageSeverity);
      if (bySeverity != 0) return bySeverity;
      return tieBreak(a.rootCauseId, b.rootCauseId);
    });

    return clusters;
  }
}