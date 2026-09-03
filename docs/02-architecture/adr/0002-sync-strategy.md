# ADR-0002: Sync Strategy (theo BA v1.4.5)

> **Status:** [A] Accepted (chọn tạm cho pilot, chờ Bài kiểm A & B)
> **Date:** 2026-08-25 / 05/09/2026 (cập nhật)
> **Deciders:** Team Verve Core
> **Supersedes:** phiên bản cũ (WebRTC + file-exchange) — lỗi thời sau khi BA v1.4.5 đổi sang Flutter/Dart.

---

## Context

LEAPS đồng bộ bằng chứng giữa thiết bị học sinh và giáo viên trong môi trường **không internet** (CO-R-01/02).

Ràng buộc chính:

- Không internet — nhiều trường băng thông hẹp hoặc cắt đứt hoàn toàn.
- Không backend — điểm trung tâm phải chạy trực tiếp trên thiết bị giáo viên.
- Quy mô: tối đa 50 học sinh/lớp, 500 thiết bị/trường.
- Dữ liệu phải toàn vẹn — append-only, không ghi đè; chú thích GV là nguồn chuẩn (BR-17).
- Quyền riêng tư: kênh mã hoá, dữ liệu xuất phải ẩn danh tại hub (DR-08).

## Decision

**SC-05 (hub cục bộ) là CHÍNH. SC-06 (USB dự phòng) là BẮT BUỘC.**

| Mã | Quyết định |
|---|---|
| **SC-05** | Cùng app Flutter, chạy HTTP nội bộ ở máy giáo viên (TS-08). Khám phá bằng mDNS + mã ghép nối 6 số / QR (TS-09). |
| **SC-06** | Xuất/nhập archive mã hoá qua USB (TS-11) — dự phòng khi hub không khả dụng. |

`app/lib/sync/sync_strategy_resolver.dart` tự chuyển **hub → USB** nếu AS-64/AS-67 sai (theo điều kiện lật của TS-08).

### SC-05 — Hub cục bộ (chính)

| Khía cạnh | Cách làm |
|---|---|
| Phát hiện | `app/lib/hub/discovery.dart` — mDNS + mã ghép nối 6 số / QR |
| Kênh | `app/lib/hub/server.dart` — HTTP nội bộ trên máy giáo viên |
| Mã hoá | `app/lib/hub/crypto.dart` — libsodium, khoá chung lớp (TS-10) |
| Đồng hồ | `app/lib/hub/logical_clock.dart` — lai, KHÔNG dùng giờ máy (BR-17, DR-10) |
| Hợp nhất | `app/lib/hub/merge.dart` — theo mã sự kiện; trùng khác nội dung → gắn cờ, không ghi đè |
| Sao lưu | `app/lib/hub/backup.dart` — **MỚI — NFR-22**, single point of failure |

### SC-06 — File exchange qua USB (bắt buộc)

| Khía cạnh | Cách làm |
|---|---|
| Đóng gói | `app/lib/sync/file_exchange.dart` (TS-11) — archive mã hoá |
| Truyền | `app/lib/sync/chunked_transfer.dart` — theo khối, điểm tiếp tục, băm từng khối |
| Kiểm | `app/lib/bootstrap/bundle_verify.dart` (TS-20) |

### Đồng bộ & xung đột

- **Bảng sự kiện**: append-only, không thể xung đột.
- **Chú thích GV**: nguồn chuẩn (BR-17).
- **Hai thiết bị cùng sửa**: đồng hồ logic lai; trùng `eventId` khác payload → cờ conflict, KHÔNG ghi đè.

### Phân phối model + nội dung (TS-19, TS-20)

- Model và nội dung (vài trăm MB–vài GB) **phải đi qua USB** — Wi-Fi/BT không đủ.
- `content-pipeline/src/export/sign_bundle.ts` ký Ed25519 trước khi cài.
- `app/lib/content_security/signature_verify.dart` từ chối nội dung không hợp lệ.
- `app/lib/bootstrap/model_installer.dart` cài trọng số Gemma; `bundle_verify.dart` kiểm băm.

## Consequences

### Tích cực
- Hub cục bộ mã hoá + USB dự phòng phủ mọi tình huống mất mạng.
- Engine xử lý xung đột xác định, không ghi đè.
- Mã ghép nối 6 số / QR — dễ thao tác cho GV không rành IT.
- Sao lưu hub (NFR-22) — giảm rủi ro single point of failure.

### Tiêu cực
- Hub là single point of failure nếu máy GV hỏng — đã có backup (NFR-22), nhưng vẫn cần pilot xác nhận.
- USB đòi hỏi thao tác vật lý; phải có quy trình thu/nhận rõ ràng.

### Rủi ro & giảm thiểu

| Rủi ro | Khả năng | Tác động | Giảm thiểu |
|---|---|---|---|
| Hub không khả dụng (GV nghỉ, máy hỏng) | Trung bình | Cao | USB dự phòng (SC-06) + backup hub |
| USB thất lạc/hỏng | Thấp | Trung bình | Băm + chữ ký Ed25519 |
| Khoá ghép nối lộ | Trung bình | Cao | QR + xoay vòng khoá |
| Mất dữ liệu thiết bị HS | Thấp | Trung bình | `storage/recovery.dart` từ hub |

## References

- TS-08, TS-09, TS-10, TS-11, TS-12, TS-19, TS-20
- SC-05, SC-06, SC-08
- BR-17, DR-08, DR-10
- ADR-0001 (tech stack), ADR-0003 (kiến trúc AI 3 lớp)
