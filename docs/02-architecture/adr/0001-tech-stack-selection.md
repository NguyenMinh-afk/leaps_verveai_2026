# ADR-0001: Tech Stack Selection

> **Status:** [A] Accepted (chọn tạm cho pilot, chờ Bài kiểm A & B của `research/model-eval/` xác nhận)
> **Date:** 2026-08-25 / 03/09/2026 (cập nhật)
> **Deciders:** Team Verve Core
> **Supersedes:** phiên bản cũ (React/Vite/TS) — lỗi thời sau khi BA v1.4.5 chốt tech stack ở Phụ lục F/G.

---

## Ưu tiên phát triển

| Ưu tiên | Module | Tech Stack |
|---------|--------|------------|
| **CAO NHẤT** | `web-portal/` | Next.js / TypeScript / Tailwind CSS |
| Sau | `app/` | Flutter / Dart (theo ADR này) |

---

## Context

LEAPS phải:

- Chạy 100% offline trên **Android + Windows** trong môi trường băng thông hẹp (CO-R-01/02, CO-T-02).
- Engine chẩn đoán **tất định**, cùng codebase với app, viết bằng ngôn ngữ chính của app (TS-07).
- Chạy LLM cục bộ qua FFI — PWA/web không thể chạy `llama.cpp` qua FFI hiệu quả trên CPU thuần.
- Một mã nguồn phủ cả Android lẫn Windows — ràng buộc "không đủ nguồn lực hai bản gốc".
- Phân phối model + nội dung vài trăm MB–vài GB qua USB (TS-19, TS-20).

## Decision

**Chọn Flutter (Dart) làm tech stack chính** cho `app/`. Engine tất định viết bằng Dart thuần, cùng codebase.

### Tech-stack quyết định (theo BA v1.4 — TS-01 → TS-20)

| Mã | Quyết định |
|---|---|
| **TS-01** | Flutter — 1 mã nguồn cho Android + Windows |
| **TS-02** | `llama.cpp` qua FFI (Dart `ffi`) |
| **TS-03** | GGUF, dòng Gemma 4-bit; tải 4B → 2B → 1B theo bậc thiết bị (AS-61) |
| **TS-04** | GBNF grammar-constrained decoding — ép mô hình chỉ chọn nhãn đã thẩm định |
| **TS-05** | SQLite, bảng sự kiện chỉ ghi thêm (append-only); 1 file/cơ sở |
| **TS-06** | Knowledge graph lưu JSON versioned, duyệt bằng mã ứng dụng |
| **TS-07** | Engine tất định — viết bằng Dart, KHÔNG ngẫu nhiên |
| **TS-08** | HTTP nội bộ qua mDNS — "điểm trung tâm cục bộ" ở máy giáo viên |
| **TS-09** | Mã ghép nối 6 số / QR |
| **TS-10** | libsodium (Dart `cryptography` + `cryptography_flutter`) |
| **TS-11** | File-exchange dự phòng qua USB — xuất/nhập archive mã hoá |
| **TS-12** | Xuất PDF trực tiếp từ app Flutter (SC-08) |
| **TS-17** | APK cài trực tiếp (Android) |
| **TS-18** | EXE độc lập không cần cài (Windows) |
| **TS-19** | USB là kênh bắt buộc phân phối model + nội dung |
| **TS-20** | Kiểm băm/checksum toàn bộ bundle |

Bổ sung chữ ký: **Ed25519** ký gói nội dung, app từ chối nội dung không có chữ ký hợp lệ.

### Bảng thành phần

| Thành phần | Chọn | Ghi chú |
|---|---|---|
| Framework | Flutter ≥ 3.22 | 1 codebase Android + Windows |
| Ngôn ngữ | Dart ≥ 3.4 | |
| Lưu trữ | `sqflite` (mobile) + `sqflite_common_ffi` (desktop) | TS-05 |
| Mã hoá kênh | `cryptography` / `cryptography_flutter` | TS-10 (libsodium-equivalent) |
| Chữ ký nội dung | `pointycastle` (Ed25519) | |
| Mạng nội bộ | `http` + `network_info_plus` | TS-08 |
| QR | `qr_flutter` + `mobile_scanner` | TS-09 |
| FFI | Dart `ffi` | TS-02 |
| Lưu trữ khóa | path_provider, path | |
| UUID | `uuid` (UUIDv7) | DR-11 |
| Nén archive | `archive` | TS-11 |

### Cờ trạng thái

> ⚠️ Toàn bộ nhánh `app/lib/inference/` (LLM cục bộ) đang ở trạng thái **[A] "chọn tạm cho pilot"**.
> Chờ kết quả **Bài kiểm A** (chất lượng trích xuất) và **Bài kiểm B** (hiệu năng thiết bị) — `research/model-eval/` — chốt được cỡ model cụ thể mới rời [A].

### Lộ trình trước khi code UI (F.7)

Dựng **bản thử nghiệm mỏng nhất** trước: Flutter + `llama.cpp` + 1 model 4-bit, chạy trên thiết bị thật mượn tại địa bàn — chỉ làm **một việc**:

> Đọc 1 bài làm mẫu → xuất bằng chứng theo lược đồ. Đo th�i gian, RAM đỉnh, dung lượng, tụt pin.

Nếu bản này không chạy được → biết ngay, **đừng code UI trước**.

## Consequences

### Tích cực
- Một mã nguồn phủ Android + Windows — đúng ràng buộc nhân lực.
- Dart FFI cho phép chạy `llama.cpp` hiệu quả trên CPU thuần, điều PWA/web không làm được.
- Engine tất định cùng codebase với app → dễ kiểm thử, dễ kiểm toán.
- libsodium + Ed25519: kênh cục bộ mã hoá + nội dung có chữ ký → app từ chối gói không hợp lệ.
- APK / EXE độc lập, không cần PWA cache asset.

### Tiêu cực
- Hệ sinh thái Flutter cho AI/local LLM mỏng hơn web — phải tự viết wrapper.
- SQLite + FFI + Flutter desktop đòi hỏi build pipeline cẩn thận (sqflite_common_ffi trên Windows).
- Phải đ�i Bài kiểm A & B mới chốt được cỡ model — chưa thể lên cấu hình cứng.

### Trung tính
- Chuyển từ React/TS sang Flutter/Dart: phải viết lại toàn bộ engine.
- UI Flutter dùng Material/Cupertino — sẽ cập nhật `.cursor/rules/02-frontend.mdc` cho phù hợp.

## Lỗ hổng mới đã đưa vào cấu trúc (Phụ lục G.9)

| Mã | Module |
|---|---|
| FR-25 | `app/lib/engine/diagnose/language_barrier_detector.dart` |
| FR-26 | `app/lib/engine/transfer/student_transfer.dart` |
| DR-12 | `app/lib/privacy/retention_policy.dart` |
| NFR-21 | `app/lib/privacy/breach_notify.dart` |
| NFR-22 | `app/lib/hub/backup.dart` |
| NFR-23 | `content-pipeline/src/age-appropriateness/` |
| OS-03 (chưa quyết) | `app/lib/ui/student/` — chờ G.9 vùng #1 kèm theo |

## References

- BA v1.4.5 — Phụ lục F (F.1, F.2, F.4, F.7) & Phụ lục G (G.2, G.3, G.9)
- `research/model-eval/test_a_extraction_quality.py`
- `research/model-eval/test_b_device_performance.py`
- ADR-0002 (sync strategy), ADR-0003 (kiến trúc AI 3 lớp)
