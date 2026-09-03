# 🛡️ Integrity Check — NFR-18

> **Phiên bản:** 1.4.5
> **Căn cứ:** BA v1.4.5 — NFR-18, BR-05, TS-20

---

## 🎯 Mục tiêu

Đảm bảo **không file nào bị tamper** từ lúc build đến lúc chạy trên thiết bị.

---

## 📐 Checksum Manifest

### Cấu trúc
```json
{
  "version": "1.0.4",
  "created_at": "2026-08-25T10:00:00Z",
  "files": {
    "app/lib/main.dart": "sha256:abc123...",
    "app/lib/engine/mastery/bkt.dart": "sha256:def456...",
    "content/knowledge-graph.json": "sha256:789...",
    "content/item-bank.json": "sha256:012..."
  },
  "signature": "ed25519:..."
}
```

### Vị trí
- `app/lib/storage/integrity_manifest.json` — bundle vào APK/EXE.
- `dist/content/manifest.json` — cùng gói nội dung.

---

## 🔍 Kiểm tra lúc khởi động (NFR-18)

### Quy trình
```
1. App khởi động
2. Đọc integrity_manifest.json
3. Tính SHA-256 từng file critical
4. So với manifest
5. Verify Ed25519 signature của manifest
6. Nếu fail → hiển thị lỗi + KHÔNG cho dùng app
```

### Module
- `app/lib/storage/integrity_check.dart`

### File PHẢI kiểm tra
- `engine/mastery/bkt.dart` (TS-07).
- `engine/diagnose/*.dart`.
- `content_security/signature_verify.dart` (Ed25519 verify).
- `privacy/retention_policy.dart` (DR-12).
- `content/knowledge-graph.json` + `item-bank.json`.

---

## 🚨 Phát hiện sự cố (NFR-21)

### Trigger
- SHA-256 không khớp manifest.
- Ed25519 signature không hợp lệ.
- File bị sửa giữa 2 lần khởi động.

### Response
1. **Dừng app** — không cho dùng đến khi verify lại.
2. **Audit log** ghi `detect_breach` (BR-05).
3. **Thông báo GV/Admin** — banner đỏ.
4. **Không tự động fix** — cần can thiệp thủ công.

### Module
- `app/lib/privacy/breach_notify.dart`

---

## 📦 Checksum cho USB distribution

### File `SHA256SUMS` ở root USB
```
abc123...  apps/verveai-app-v1.4.4.apk
def456...  apps/verveai-app-v1.4.4-setup.exe
789012...  content/verveai-content-v2026.09.03.zip
345678...  models/gemma-3-4b-instruct-q4.gguf
901234...  models/gemma-3-2b-instruct-q4.gguf
567890...  models/gemma-3-1b-instruct-q4.gguf
```

### Verify trên máy dev
```bash
cd /media/usb
sha256sum -c SHA256SUMS
```

---

## 🔄 Khi nào cập nhật manifest?

Mỗi lần release → build script tự động sinh manifest + ký Ed25519.

Xem chi tiết: [usb-distribution.md](./usb-distribution.md).

---

## 📚 TÀI LIỆU LIÊN QUAN

- [Privacy Architecture](../02-architecture/privacy-architecture.md)
- [USB Distribution](./usb-distribution.md)
- [Runbook](./runbook.md)

---

**END OF DOCUMENT**
