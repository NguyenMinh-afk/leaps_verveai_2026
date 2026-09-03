# scripts/

Hỗ trợ build & deploy cho VERVEAI (BA v1.4.4).

| Script | Mô tả |
|--------|-------|
| `build.sh` / `build.bat` | Build content-pipeline + review-console (TS) + Flutter app (Android APK + Windows EXE). |
| `build-bundle.sh` | Đóng gói + **ký Ed25519** gói nội dung `.verveai-bundle.zip` (TS-19/20). |
| `deploy.sh` | Tổng hợp app + bundle vào `deploy/` để chép sang USB. |

## Lưu ý

- VERVEAI **không** deploy qua cloud — phân phối qua USB (TS-19).
- Khoá riêng Ed25519 đặt ở biến `PRIVATE_KEY_PATH`, **không commit**.
- Model + nội dung vài trăm MB–vài GB phân phối qua USB; **không** bundle vào APK/EXE.
- Trên Windows, dùng `build.bat` (PowerShell hoặc cmd). Trên macOS/Linux dùng `build.sh`.
