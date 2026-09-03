# Admin Guide — Hướng dẫn cho Admin

> **Trạng thái**: UI đang triển khai (Phase 4).
> Tài liệu này sẽ được cập nhật khi UI admin sẵn sàng.

---

## 🎯 Vai trò Admin trong LEAPS (VerveAI)

- Quản lý nhiều lớp / trường.
- Chịu trách nhiệm privacy: export, xoá dữ liệu (DR-09, FR-21).
- Cấu hình retention policy (DR-12).
- Xem audit log (BR-05).
- Sao lưu hub (NFR-22).

---

## 📋 Công việc thường ngày

### 1. Mở Admin Panel
1. Mở app **Verve** → **Profile switcher → Admin** (FR-22).
2. Nhập mật khẩu admin (PIN ≥ 6 số).

### 2. Export dữ liệu (FR-21, DR-09)
1. Vào **Data governance → Export**.
2. Chọn phạm vi: lớp / trường / toàn hệ thống.
3. Chọn khoảng thời gian.
4. App sẽ ẩn danh tại hub (DR-08) trước khi xuất.
5. Tải file `.zip` chứa CSV evidence + manifest.

### 3. Xoá dữ liệu
1. **Data governance → Delete**.
2. Chọn đối tượng (HS / lớp / trường).
3. Xác nhận → audit log ghi `delete:student:anon-xxx`.
4. Background task xoá sau khi hết retention (DR-12).

### 4. Cấu hình Retention Policy (DR-12)
1. **Settings → Retention**.
2. Đặt:
   - Evidence trong app: mặc định 1 năm.
   - Evidence trên hub: mặc định 2 năm.
   - Audit log: mặc định 5 năm.
3. Mỗi lần thay đổi → audit log.

### 5. Xem Audit Log (BR-05)
1. **Data governance → Audit log**.
2. Lọc theo: actor / action / date range.
3. Mỗi entry có Ed25519 signature → tamper-evident.

### 6. Sao lưu Hub (NFR-22)
1. **Settings → Backup → Manual backup**.
2. Hoặc để mặc định: tự động backup hàng ngày.
3. Backup có Ed25519 signature → không bị sửa.

---

## 🚨 Phát hiện sự cố (NFR-21)

### Triệu chứng
- Banner đỏ "Data breach detected".
- Audit log có action `detect_breach`.

### Xử lý
1. Đọc audit log chi tiết.
2. Xác định thiết bị / bundle nào.
3. **Dừng sync** cho thiết bị liên quan.
4. Cài lại app từ USB sạch.
5. Liên hệ kỹ thuật viên.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [Stakeholders](../01-business/STAKEHOLDERS.md)
- [Privacy Architecture](../02-architecture/privacy-architecture.md)
- [BR/DR/NFR](../02-architecture/privacy-architecture.md#bảng-quy-tắc--module)
- [Runbook](../04-operations/runbook.md)

---

**END OF DOCUMENT**
