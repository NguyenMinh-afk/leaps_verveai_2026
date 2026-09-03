# 🔒 Privacy Architecture

> **Phiên bản:** 1.4.5
> **Ngày:** 05/09/2026
> **Căn cứ:** BA v1.4.5 — Phụ lục BR (01–20), DR (01–12), NFR (18, 21, 22, 23)

---

## 🎯 Nguyên tắc chung

1. **PII không bao giờ rời thiết bị** — kể cả lúc đồng bộ qua hub.
2. **Ẩn danh tại hub** trước khi xuất ra bên thứ ba (DR-08).
3. **Chú thích GV là nguồn chuẩn** (BR-17) — không bị ghi đè bởi LLM/algorithm.
4. **Audit log bất biến** (BR-05) — mọi thao tác admin phải ghi log.
5. **Có kế hoạch xoá** (FR-21, DR-09) — HS chuyển trường → xoá trong 30 ngày.

---

## 🗂️ Bảng quy tắc → Module

| Mã | Quy tắc | Module Dart |
|----|---------|-------------|
| **BR-01** | Không PII cho bên thứ ba | `privacy/anonymize.dart` |
| **BR-05** | Audit log bất biến | `storage/audit_log.dart` |
| **BR-07** | Cụm nguyên nhân ≥ 30% sĩ số, sàn 3 HS | `engine/grouping/cluster_by_root_cause.dart` |
| **BR-08** | Tie-break cụm: size → severity → alphabet | `engine/grouping/cluster_by_root_cause.dart` |
| **BR-13** | HS chỉ nhận template đóng | `inference/expression/fill_student_template.dart` |
| **BR-16** | Trọng số in-class > out-of-class | `engine/evidence/evidence_context.dart` |
| **BR-17** | Chú thích GV là nguồn chu�n | `hub/merge.dart` |
| **DR-07** | Băm trọng số + mức lượng tử + tham số giải mã | `engine/versioning/model_version.dart` |
| **DR-08** | Ẩn danh tại hub trước khi xuất | `privacy/anonymize.dart` |
| **DR-09** | Xuất và xoá | `privacy/export_delete.dart` |
| **DR-10** | KHÔNG giờ máy — đồng hồ logic lai | `hub/logical_clock.dart` |
| **DR-11** | Mỗi lượt ghi bằng chứng có context | `engine/evidence/record_attempt.dart` |
| **DR-12** *(G.9)* | Thời hạn lưu trữ + tự xoá | `privacy/retention_policy.dart` |
| **NFR-18** | Checksum manifest + kiểm lúc khởi động | `storage/integrity_check.dart` |
| **NFR-21** *(G.9)* | Phát hiện & báo sự cố dữ liệu | `privacy/breach_notify.dart` |
| **NFR-22** *(G.9)* | Sao lưu hub cục bộ | `hub/backup.dart` |
| **NFR-23** *(G.9)* | Kiểm duyệt phù hợp lứa tuổi | `content-pipeline/src/age-appropriateness/` |

---

## 🔐 Ẩn danh tại hub (DR-08)

### Cơ chế
- Khi HS đồng bộ evidence lên hub → hub **ngay lập tức** thay `studentId` bằng HMAC(studentId, hubSecretKey).
- Khoá HMAC **không rời khỏi hub**.
- Khi xuất cho bên thứ ba (research/validation) → ID đã ẩn danh, không thể truy ngược.

### Code skeleton
```dart
class Anonymizer {
  final SecretKey hubKey;
  String anonymize(String studentId) {
    final mac = Hmac(sha256, hubKey).convert(utf8.encode(studentId));
    return 'anon-${mac.toString().substring(0, 16)}';
  }
}
```

### Lưu ý
- `hubKey` chỉ tồn tại trong bộ nhớ hub — KHÔNG commit, KHÔNG log.
- Nếu hub bị wipe → không truy ngược được — chấp nhận mất liên kết.

---

## 🛡️ Audit log (BR-05)

### Bắt buộc ghi log khi:
- Admin export/xoá dữ liệu.
- Cài gói nội dung / model mới.
- Thay đổi cấu hình retention (DR-12).
- Phát hiện sự cố (NFR-21).

### Schema
```dart
class AuditLogEntry {
  final String eventId;          // UUIDv7
  final String actorId;          // adminId
  final String action;           // 'export' | 'delete' | 'install' | 'detect_breach'
  final String targetScope;      // 'class:5A' | 'student:anon-abc' | 'bundle:v1.0.4'
  final DateTime timestamp;      // logical timestamp (DR-10)
  final String signature;        // Ed25519 — bất biến
}
```

### Bất biến
- `audit_log` là append-only table.
- M�i entry có Ed25519 signature → tamper-evident.

---

## 🗑️ Xuất và xoá (FR-21, DR-09)

### Quy trình xoá HS chuyển trường
1. HS chuyển trường → tạo `TransferRequest` (FR-26).
2. Evidence được "đánh dấu đã chuyển" (KHÔNG xoá — append-only).
3. Hết thời hạn retention (DR-12, mặc định 30 ngày) → background task xoá evidence cũ.
4. Audit log ghi nhận `delete:student:anon-xxx`.

### Quy trình xuất
1. Admin chọn lớp/trường → `export_delete.dart`.
2. Hub ẩn danh toàn bộ evidence → đóng gói `.zip`.
3. File xuất KHÔNG chứa `studentId` thật — chỉ `anon-xxx`.
4. Audit log ghi nhận `export:class:5A`.

---

## 📅 Retention policy (DR-12) ⭐ mới

### Mặc định
| Loại dữ liệu | Thời hạn |
|---------------|----------|
| Evidence trong app | 1 năm (cấu hình được) |
| Evidence trên hub | 2 năm |
| Audit log | 5 năm |
| Bundle cũ | 6 tháng sau khi cài bản mới |

### Cấu hình
- Admin có UI chỉnh trong `ui/admin/data_governance_panel.dart`.
- Mỗi lần thay đổi → audit log.

### Background task
- Chạy hàng đêm trên hub (khi không có HS sync).
- Dùng logical clock, KHÔNG DateTime.now().

---

## � Phát hiện & báo sự cố (NFR-21) ⭐ mới

### Trigger
- Phát hiện hash evidence không khớp integrity manifest (NFR-18).
- Phát hiện signature Ed25519 không hợp lệ trên bundle.
- Phát hiện evidenceEvents có payload bất thường (e.g. negative latency).

### Response
1. Ghi audit log `detect_breach`.
2. Tạm dừng sync cho thiết bị liên quan.
3. Hiển thị banner cho GV/Admin: "Phát hiện sự cố dữ liệu — kiểm tra".
4. Có option xem chi tiết trong admin panel.

---

## ✅ Checklist khi code Privacy

- [ ] Mọi file ghi evidence đều có `confidenceWeight` theo context (BR-16).
- [ ] Mọi hàm xuất dữ liệu đều qua `Anonymizer.anonymize()` (DR-08).
- [ ] Mọi thao tác admin đều ghi audit log (BR-05).
- [ ] Mọi timestamp đều dùng logical clock (DR-10).
- [ ] Mọi bundle đều có Ed25519 signature (TS-19/20).
- [ ] UI HS dùng template đóng, không mệnh lệnh (BR-13).

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA v1.4.5 — Phụ lục BR/DR/NFR](../VerveAI_BA_Document_v1.4.md)
- [System Overview](./system-overview.md)
- [Sync Architecture](./sync-architecture.md)

---

**END OF DOCUMENT**
