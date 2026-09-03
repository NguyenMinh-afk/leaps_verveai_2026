# 🔌 USB Distribution — TS-19 / TS-20

> **Phiên bản:** 1.4.5
> **Ngày:** 05/09/2026
> **Căn cứ:** BA v1.4.5 — AS-28, TS-19, TS-20

---

## 🎯 Nguyên tắc

- LEAPS **không phân phối qua cloud**.
- Mọi gói nội dung + model đều qua **USB** (TS-19).
- Mỗi gói có **Ed25519 signature** (TS-20) — app từ chối gói không hợp lệ.
- Khoá riêng Ed25519 **không commit** — do người thẩm định giữ.

---

## 📦 Cấu trúc gói USB

```
<USB_ROOT>/
├── apps/
│   ├── verveai-app-v1.4.4.apk           # APK Android (TS-17)
│   └── verveai-app-v1.4.4-setup.exe     # EXE Windows (TS-18)
├── content/
│   ├── math-grade-5-v2026.09.03.zip      # Bundle nội dung (.verveai-bundle.zip)
│   ├── math-grade-5-v2026.09.03.zip.sig  # Ed25519 signature
│   └── SHA256SUMS                         # Checksum toàn bộ
└── models/
    ├── gemma-3-4b-instruct-q4.gguf        # Model 4B
    ├── gemma-3-2b-instruct-q4.gguf        # Model 2B
    └── gemma-3-1b-instruct-q4.gguf        # Model 1B
```

---

## 🔨 Build & Sign

### Bước 1: Build app
```bash
./scripts/build.sh
# → app/build/app/outputs/flutter-apk/app-release.apk
# → app/build/windows/runner/Release/verveai_app.exe
```

### Bước 2: Build + ký bundle nội dung
```bash
PRIVATE_KEY_PATH=./keys/content-signing.key \
./scripts/build-bundle.sh ./dist/content 2026.09.03
# → dist/content/verveai-content-v2026.09.03.zip (Ed25519 đã ký)
```

### Bước 3: Copy sang USB
```bash
# Tạo cấu trúc trên USB
USB=/Volumes/LEAPS
mkdir -p $USB/{apps,content,models}
cp app/build/app/outputs/flutter-apk/app-release.apk $USB/apps/
cp dist/content/*.zip $USB/content/
cp dist/models/*.gguf $USB/models/
```

---

## 📥 Cài trên thiết bị

### Android
1. Copy APK sang thiết bị.
2. Bật "Unknown sources" nếu cần.
3. Cài APK.
4. Mở app → tự động verify Ed25519.

### Windows
1. Copy EXE sang thiết bị.
2. Chạy installer.
3. Mở app → tự động verify Ed25519.

---

## ✅ Verify

Sau khi cài, app tự động:
1. Kiểm băm SHA256SUMS.
2. Verify Ed25519 signature.
3. Nếu fail → từ chối cài, hiển thị lỗi.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [Integrity Check](../integrity-check.md)
- [Runbook](../runbook.md)
- [ADR-0002 Sync Strategy](../../02-architecture/adr/0002-sync-strategy.md)
- [BA v1.4.5 — TS-19, TS-20](../../VerveAI_BA_Document_v1.4.md)

---

**END OF DOCUMENT**
