# 🛠️ Runbook — LEAPS (VerveAI)

> **Phiên bản:** 1.4.4

Hướng dẫn xử lý sự cố cho DevOps / kỹ thuật viên triển khai.

---

## 1. App không khởi động

### Triệu chứng
- App hiển thị màn hình đỏ "Integrity check failed".
- Hoặc crash ngay sau khi mở.

### Nguyên nhân có thể
- File `engine/mastery/bkt.dart` bị sửa sau khi build.
- Bundle nội dung không đúng manifest.

### Xử lý
1. Cắm USB → re-install bundle.
2. Nếu vẫn lỗi → cài lại APK/EXE từ USB.
3. Ghi nhật ký post-mortem.

---

## 2. Hub không tìm thấy HS

### Triệu chứng
- HS không thấy hub trong danh sách mDNS.
- Mã QR pairing không hoạt động.

### Kiểm tra
- [ ] mDNS bật trên máy GV?
- [ ] Tường lửa Windows cho phép Flutter?
- [ ] GV đã bật "Hub mode" trong app?
- [ ] HS cùng LAN với GV?

### Xử lý
1. Nếu vẫn không được → **SC-06 USB fallback** (xem runbook §5).
2. Ghi nhật ký.

---

## 3. Bundle verify Ed25519 fail

### Triệu chứng
- App từ chối cài bundle.
- Thông báo "Invalid signature".

### Nguyên nhân
- Khoá công khai trong app cũ.
- File `.sig` bị corrupt.

### Xử lý
1. So sánh `keys/content-signing.pub` trong build vs app.
2. Nếu build có khoá mới → build lại app với khoá mới.
3. Nếu file `.sig` corrupt → build lại bundle.

---

## 4. Model không load

### Triệu chứng
- `extract_evidence.dart` fail ở `LlamaBindings.newContext`.

### Kiểm tra
- [ ] File `.gguf` đầy đủ?
- [ ] SHA-256 khớp `SHA256SUMS`?
- [ ] RAM thiết bị đủ cho model?

### Xử lý
1. Copy lại file GGUF.
2. Verify SHA-256.
3. Nếu vẫn lỗi → thử model nhỏ hơn (4B → 2B → 1B, AS-61).

---

## 5. Sync qua USB (fallback)

### Quy trình
1. **HS side**: Mở app → Settings → "Export to USB".
   - Tạo archive mã hoá (`sync/file_exchange.dart`).
   - Chia chunk + ký Ed25519.
   - Copy ra USB.
2. **GV side**: Cắm USB → m� app → Settings → "Import from USB".
   - Verify chunks + Ed25519.
   - Merge evidence vào hub.

### Lỗi thường gặp
- **USB không nhận**: thử cổng khác, format FAT32.
- **Chunk bị corrupt**: copy lại từ HS.
- **Merge conflict**: hiển thị cho GV giải quyết (BR-17).

---

## 6. Audit log / Breach notify

### Triệu chứng
- Admin thấy banner "Data breach detected".

### Nguyên nhân
- Integrity check fail (NFR-18).
- Ed25519 signature fail (TS-20).

### Xử lý
1. **Dừng sync** cho thiết bị liên quan.
2. Đọc audit log: `audit_log.dart` → `action = 'detect_breach'`.
3. Xác minh nguyên nhân.
4. Cài lại app từ USB sạch.

---

## 7. Bài kiểm A/B fail

### A fail — `verdict: FAIL`
- Xem `reports/test_a_*.json` → `reasons`.
- Nếu `fleiss-kappa-below-threshold`: 3 GV chấm không đồng thuận → thống nhất lại schema.
- Nếu `cohen-kappa-below-threshold`: LLM khớp GV kém → xem confusion matrix, đổi prompt.

### B fail — `verdict: FAIL`
- Latency quá cao → hạ cỡ model.
- RAM quá cao → hạ cỡ model.
- Pin tụt nhiều → giảm batch size hoặc cache.

### Quyết định
- A và B đều PASS → `inference/` ra khỏi **[A]**.
- Một trong hai FAIL → KHÔNG đưa ra khỏi [A].

---

## 📞 Liên hệ

- Tech Lead: ...
- DevOps on-call: ...
- Repository issue: GitHub/GitLab

---

## 📚 TÀI LIỆU LIÊN QUAN

- [Troubleshooting](../03-development/troubleshooting.md)
- [USB Distribution](./usb-distribution.md)
- [Integrity Check](./integrity-check.md)
- [Bài kiểm A & B](../05-research/)

---

**END OF DOCUMENT**
