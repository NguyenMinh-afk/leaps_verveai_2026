# Data Anonymization — DR-08

> **Phiên bản:** 1.4.5
> **Căn cứ:** BA v1.4.5 — DR-08, BR-06, BR-01

---

## 🎯 Mục đích

Trước khi dữ liệu HS rời hub (xuất cho research, third-party validation), phải **ẩn danh**.

Quy tắc:
- `studentId` → HMAC(studentId, hubSecretKey)
- `responseText` → tên thật / lớp thật / trường thật **đã bị xoá**
- `studentNotes` (GV note) → xoá PII

---

## 🔧 Quy trình

### 1. Tại hub (`app/lib/privacy/anonymize.dart`)

```dart
class Anonymizer {
  final SecretKey hubKey; // KHÔNG rời hub

  String anonymize(String studentId) {
    final mac = Hmac(sha256, hubKey).convert(utf8.encode(studentId));
    return 'anon-${mac.toString().substring(0, 16)}';
  }
}
```

### 2. Trước khi xuất (`app/lib/privacy/export_delete.dart`)

```dart
final csvRows = events.map((e) {
  return {
    'attempt_id': e.attemptId,
    'student_id': anonymizer.anonymize(e.studentId),
    'response_text': removePii(e.responseText),
    'root_cause_id': e.rootCauseId,
    // ...
  };
});
```

### 3. Trước khi đưa vào `research/model-eval/data/`

- Verify KHÔNG có tên thật, lớp thật, trường thật.
- Verify `student_id` đã ở dạng `anon-xxx`.
- Verify `response_text` không chứa PII.

---

## ✅ Checklist khi đưa dữ liệu vào pilot

- [ ] Không có `studentId` thật — chỉ `anon-xxx`.
- [ ] Không có tên HS trong `response_text`.
- [ ] Không có tên GV trong notes.
- [ ] Không có tên trường / lớp thật.
- [ ] Audit log ghi nhận `export:class:5A` (BR-05).

---

## 🚫 KHÔNG commit dữ liệu thật

Đã có `.gitignore` ở `research/.gitignore` chặn:
- `data/attempts.csv`
- `data/measurements.csv`
- `data/llm_predictions.csv`
- `data/gold/`

Để chia sẻ với researcher → dùng **USB** (TS-19) hoặc mã hoá PGP.

---

## 🔐 Nếu hubKey bị lộ

1. Thu hồi (rotate) — tạo key mới.
2. Tất cả evidence cũ đã ẩn danh theo key cũ → không truy ngược được.
3. Bắt buộc hub mới dùng key mới → evidence mới sẽ ẩn danh theo key mới.
4. Audit log ghi nhận `key_rotation`.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [Privacy Architecture](../02-architecture/privacy-architecture.md)
- [VerveAI BA v1.4.5 — DR-08](../VerveAI_BA_Document_v1.4.md)
- Code: `app/lib/privacy/anonymize.dart`

---

**END OF DOCUMENT**
