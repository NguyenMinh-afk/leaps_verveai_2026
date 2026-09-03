# Teacher Guide — Hướng dẫn cho giáo viên

> **Trạng thái**: `web-portal/` (Next.js) đang được phát triển ưu tiên. Tài liệu này sẽ được cập nhật khi web portal sẵn sàng.
>
> **Tên mã nguồn:** VerveAI · **App:** Verve

---

## 🎯 Vai trò giáo viên trong LEAPS (VerveAI)

- **Ưu tiên: Web portal** (`web-portal/`): Dashboard, xem báo cáo lớp, quản lý HS.
- Xem báo cáo lớp: HS nào hổng kiến thức gì → can thiệp nhóm.
- Thêm/sửa **chú thích GV** — nguồn chuẩn (BR-17), thắng mọi xung đột.
- Cài đặt hub cục bộ trên máy GV (Windows) — qua `app/` (Flutter).
- Cài gói nội dung qua USB (TS-19) — qua `app/` (Flutter).

---

## 📋 Công việc thường ngày

### 1. Bật hub cục bộ
1. Mở app **Verve** trên máy GV (Windows).
2. Vào **Settings → Hub mode → Bật**.
3. Lưu mã QR / mã 6 số → cho HS quét.

### 2. Xem dashboard can thiệp
1. Mở app → **Teacher Dashboard**.
2. Xem các cụm HS hổng cùng nguyên nhân (BR-07/08).
3. Click vào cụm → xem chi tiết từng HS.

### 3. Thêm chú thích GV
1. Trong chi tiết HS → tab **Teacher note**.
2. Viết chú thích → **Lưu**.
3. Chú thích được ghi vào audit log (BR-05) và có Ed25519 signature.

### 4. In báo cáo
1. Trong dashboard → **Export → PDF** (TS-12).
2. Chọn lớp + phạm vi thời gian → **Tải PDF** (SC-08).

---

## 🔧 Cài đặt hub

### Yêu cầu
- Windows 10+ (64-bit).
- RAM ≥ 4GB.
- Ổ đĩa trống ≥ 10GB (cho backup + log).

### Các bước
1. Cắm USB → mở file `verveai-app-v1.4.4-setup.exe`.
2. Cài đặt (độc lập, không cần admin).
3. Mở app → vào **Settings → Hub mode**.
4. Cấu hình: tên lớp, mật khẩu hub (khuyến nghị ≥ 12 ký tự).
5. **Bật Hub mode**.

### Sao lưu
- Tự động backup hàng ngày (NFR-22).
- Vị trí: `Documents/Verve/hub_backups/`.
- KHÔNG copy ra USB public.

---

## 📲 Nhận HS qua USB (SC-06 fallback)

Nếu hub không khả dụng:

1. HS vào **Settings → Export to USB** trên tablet.
2. HS cắm USB vào máy GV.
3. GV mở app → **Settings → Import from USB**.
4. Verify chunks + Ed25519 → merge.

---

## 🚨 Xử lý sự cố

### App báo "Data breach detected"
1. Dừng sync ngay.
2. Đọc chi tiết trong audit log.
3. Liên hệ kỹ thuật viên (xem [runbook](../04-operations/runbook.md)).

### Mã QR pairing không hoạt động
1. Kiểm tra giờ hệ thống — không quá lệch.
2. Tạo mã mới.
3. Nếu vẫn lỗi → dùng USB fallback.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [Stakeholders](../01-business/STAKEHOLDERS.md)
- [VerveAI BA v1.4.5 — CO-T-01..09](../VerveAI_BA_Document_v1.4.md)
- [Privacy Architecture](../02-architecture/privacy-architecture.md)
- [Runbook](../04-operations/runbook.md)

---

**END OF DOCUMENT**
