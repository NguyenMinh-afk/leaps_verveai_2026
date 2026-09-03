# 🔄 Sync Architecture

> **Phiên bản:** 1.4.5
> **Ngày:** 05/09/2026
> **Căn cứ:** BA v1.4.5 — SC-05, SC-06 + ADR-0002 + TS-08..11

---

## 🎯 Nguyên tắc

- **SC-05 (hub cục bộ) là CHÍNH** — HTTP nội bộ ở máy GV.
- **SC-06 (USB exchange) là BẮT BUỘC** — không phải tuỳ chọn.
- **Tự động fallback** — `sync/sync_strategy_resolver.dart` quyết định hub ↔ USB theo điều kiện lật (TS-08).
- **Append-only merge** — trùng eventId khác payload → cờ conflict, KHÔNG ghi đè; chú thích GV thắng (BR-17).

---

## 📐 Sơ đồ tổng

```
        ┌──────────────┐
        │ App Flutter  │
        │ (HS)         │
        └──────┬───────┘
               │ evidence append-only (TS-05)
               │ + Ed25519 signature (TS-20)
               ▼
        ┌──────────────────────────────────────────────┐
        │ sync/sync_strategy_resolver.dart             │
        │ (chọn hub hoặc USB theo điều kiện lật TS-08) │
        └────────────────────┬─────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
   ┌─────────────────────┐    ┌─────────────────────┐
   │ SC-05 Hub cục bộ   │    │ SC-06 USB exchange  │
   │ (chính)             │    │ (BẮT BUỘC, dự phòng)│
   │ ─────────────────   │    │ ─────────────────   │
   │ • mDNS discover     │    │ • archive mã hoá    │
   │ • QR pairing 6 số   │    │ • chunked transfer  │
   │ • libsodium crypto  │    │ • Ed25519 verify    │
   │ • logical clock     │    │ • TS-19 USB phân phối│
   │ • mDNS HTTP nội bộ │    │                     │
   └─────────�───────────┘    └─────────┬───────────┘
             │                          │
             └────────────�─────────────┘
                          ▼
                ┌──────────────────────┐
                │ Hub storage          │
                │ (sqflite_common_ffi) │
                │ • audit log (BR-05) │
                │ • backup (NFR-22)   │
                └──────────────────────┘
```

---

## 📡 SC-05 — Hub cục bộ

### Phát hiện (TS-09)
- **mDNS** broadcast từ hub trên LAN cục bộ.
- **QR / mã 6 số** cho thiết bị HS quét.
- Mã ghép nối là OTP dùng 1 lần, hết hạn 5 phút.

### Kênh (TS-08, TS-10)
- HTTP nội bộ qua `http` package — KHÔNG public port.
- Mã hoá end-to-end bằng libsodium (`cryptography` + `cryptography_flutter`).
- Khoá chia s� lớp — GV tạo khi tạo lớp, HS nhận qua QR.
- Không cần TLS thật vì đã mã hoá application-layer.

### Đồng hồ (BR-17, DR-10)
- **Vector clock lai + Lamport** — KHÔNG dùng giờ máy.
- Mỗi thiết bị có `deviceId` + `clockVector`.
- Merge: trùng `eventId` khác payload → cờ conflict, hiển thị cho GV.

### Backup (NFR-22) ⭐
- Tự động backup hàng ngày vào thư mục `hub_backups/`.
- Backup có Ed25519 signature.
- KHÔNG phụ thuộc cloud.

### Quy trình sync
```
HS: ghi evidence → append SQLite local
HS: phát hiện hub (mDNS) → pairing
HS: gửi evidence mới qua HTTP (mã hoá libsodium)
Hub: nhận → verify Ed25519 → ghi vào hub_storage
Hub: trả về vector clock mới
HS: cập nhật logical clock
HS: nhận evidence từ hub khác (nếu có) → merge
```

### Trách nhiệm module
| Module | Trách nhiệm |
|--------|-------------|
| `hub/server.dart` | HTTP server trên máy GV |
| `hub/discovery.dart` | mDNS + QR pairing |
| `hub/crypto.dart` | libsodium session |
| `hub/logical_clock.dart` | vector clock lai |
| `hub/merge.dart` | merge với conflict flag |
| `hub/backup.dart` | NFR-22 |

---

## 💾 SC-06 — USB Exchange (BẮT BUỘC)

### Khi nào dùng?
- Hub không khả dụng (GV vắng, thiết bị hỏng).
- Lớp quá xa, không có LAN chung.
- Sao lưu dữ liệu lịch sử.

### Cơ chế (TS-11)
1. App HS tạo archive mã hoá (`sync/file_exchange.dart`).
2. Archive chứa evidence append-only + Ed25519 signature + metadata.
3. Chia thành chunk ~256 MB cho USB lớn.
4. Kiểm băm SHA-256 từng chunk.
5. Copy sang USB → cắm vào máy GV → import qua hub.

### Quy trình
```
HS: chọn "Export to USB" → archive → sign → chunk → /USB/
GV: cắm USB → "Import" → verify chunks → merge → audit log
```

### Tự động fallback
- `sync/sync_strategy_resolver.dart` kiểm tra mỗi 30s:
  - Hub khả dụng + LAN OK → dùng hub.
  - Hub không khả dụng → thông báo GV "Cắm USB HS để sync".

---

## 🔐 Mã hoá kênh (TS-10)

- **libsodium** (qua Dart `cryptography` + `cryptography_flutter`).
- **Khoá chia sẻ lớp** — GV tạo khi tạo lớp:
  ```dart
  final key = X25519.generateKeyPair();
  final sharedSecret = X25519.sharedSecret(myPrivate, hisPublic);
  ```
- Mỗi session có session key tạm (1 phiên làm bài).

---

## ⚖️ Hợp nhất dữ liệu (BR-17)

### Quy tắc
1. Cùng `eventId` cùng `payload` → giữ 1 bản.
2. Cùng `eventId` khác `payload` → cờ `conflict: true`, KHÔNG ghi đè.
3. **Chú thích GV** (có `isTeacherAnnotation: true`) → LUÔN thắng, kể cả có conflict.
4. Vector clock lớn hơn → thắng trong trường hợp bình thường.

### Audit
- Mỗi merge ghi audit log: `merge:{deviceA,deviceB,conflicts:n}`.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [ADR-0002 Sync Strategy](./adr/0002-sync-strategy.md)
- [VerveAI BA v1.4.5 — SC-05, SC-06](../VerveAI_BA_Document_v1.4.md)
- [Privacy Architecture](./privacy-architecture.md)
- [USB Distribution](../04-operations/usb-distribution.md)

---

**END OF DOCUMENT**
