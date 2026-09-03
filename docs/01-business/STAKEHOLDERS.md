# 👥 STAKEHOLDERS

Đối tượng sử dụng **LEAPS (VerveAI)** và các yêu cầu UI tương ứng.

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Căn cứ:** BA v1.4.5 — CO-T-01..09 (giáo viên), CO-S-01..05 (học sinh), CO-A-01..05 (admin).

---

## 1. Học sinh (HS) — *chưa có UI trong pilot*

### Đặc điểm
- Lớp 1–12, nhiều vùng miền (Bắc/Trung/Nam, Tây Nguyên).
- Có thể dùng giọng địa phương, đọc/hiểu đề khó.
- Thiết bị: tablet Android cấu hình thấp hoặc laptop Windows cũ.

### Yêu cầu
- UI **chưa code** (`app/lib/ui/student/`) — chờ **OS-03** (G.9 vùng #1 kèm theo) chốt.
- Engine phải phát hiện **rào cản ngôn ngữ** (FR-25) để tránh kết luận nhầm hổng kiến thức.
- Phải có chuyển lớp/trường (FR-26) cho HS chuyển trường giữa năm.

### Quyết định phạm vi
- Pilot Phase 1–4: HS chỉ dùng app qua **GV cấu hình**, không cần UI riêng.
- Phase 5 (sau): UI HS — chờ G.9.

---

## 2. Giáo viên (GV)

### Đặc điểm
- Chủ nhiệm lớp 20–50 HS.
- Cần nhìn nhanh: lớp nào có cụm HS hổng cùng kiến thức → can thiệp nhóm.
- Một số GV có thể kém công nghệ → UI phải đơn giản, tiếng Việt, có hướng dẫn.

### Yêu cầu UI
- **CO-T-01**: Profile switcher (HS ↔ GV).
- **CO-T-02**: Intervention dashboard — xem cụm nguyên nhân hổng kiến thức (BR-07/08).
- **CO-T-03 → 07**: Xem báo cáo cá nhân HS, xuất PDF (TS-12, SC-08).
- **CO-T-08 → 09**: Thêm/sửa chú thích GV — **nguồn chuẩn** (BR-17).

### Ràng buộc
- Hub cục bộ phải chạy ổn định trên máy GV (Windows).
- Nếu hub không khả dụng → tự chuyển USB (sync_strategy_resolver).

Xem chi tiết: [`06-user/teacher-guide.md`](../06-user/teacher-guide.md) *(sẽ viết khi có UI)*.

---

## 3. Admin

### Đặc điểm
- Quản lý nhiều lớp / trường.
- Chịu trách nhiệm privacy: export, xoá dữ liệu (DR-09, FR-21).
- Kiểm tra integrity (NFR-18).

### Yêu cầu UI
- **CO-A-01**: Data governance panel — export/xoá theo lớp/trường.
- **CO-A-02**: Sao lưu hub (NFR-22).
- **CO-A-03**: Retention policy (DR-12) — cấu hình thời hạn lưu trữ.
- **CO-A-04**: Breach notify (NFR-21) — phát hiện sự cố dữ liệu.
- **CO-A-05**: Xem audit log (BR-05) — nhật ký bất biến.

### Ràng buộc
- Quyền admin phải qua `auth/profile_gate.dart` (FR-22).
- Mọi thao tác admin phải ghi audit log (BR-05) — append-only.

Xem chi tiết: [`06-user/admin-guide.md`](../06-user/admin-guide.md) *(sẽ viết khi có UI)*.

---

## 4. Kỹ thuật viên triển khai

### Đặc điểm
- Cài app lên nhiều thiết bị HS + máy GV.
- Phân phối model + nội dung qua USB (TS-19, AS-28).

### Yêu cầu
- Script build & ký bundle (xem `scripts/build-bundle.sh`).
- Hướng dẫn cài APK/EXE + verify Ed25519 (xem `04-operations/usb-distribution.md`).

---

## 5. Nhà nghiên cứu (Researcher)

### Đặc điểm
- Chạy Bài kiểm A & B (Bảng F.5).
- Phân tích kappa giữa các GV chấm.
- Validate BKT qua self_consistency_check.

### Yêu cầu
- `research/` package có CLI: `verveai-test-a`, `verveai-test-b`.
- Dữ liệu phải ẩn danh (DR-08) trước khi đưa vào pilot.

Xem chi tiết: [`05-research/`](../05-research/).

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA Document v1.4.5 — Phụ lục B (CO-T, CO-S, CO-A)](../VerveAI_BA_Document_v1.4.md)
- [Project Management Plan](./PROJECT_MANAGEMENT_PLAN.md)
- [ADR-0001 Tech Stack](../02-architecture/adr/0001-tech-stack-selection.md)

---

**END OF DOCUMENT**
