# 🔧 Operations Documentation

Hướng dẫn vận hành, triển khai, bảo trì **LEAPS (VerveAI)**.

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Đặc thù**: LEAPS **không deploy qua cloud**. Mọi phân phối qua **USB** (TS-19).

## Ưu tiên phát triển

| Ưu tiên | Module | Triển khai |
|---------|--------|------------|
| **CAO NHẤT** | `web-portal/` (Next.js) | Vercel / static hosting |
| Sau | `app/` (Flutter) | USB distribution (TS-19) |

---

## Cấu trúc

| File / Thư mục | Nội dung |
|----------------|----------|
| [usb-distribution.md](./usb-distribution.md) | Build + ký bundle → copy sang USB → cài thiết bị |
| [integrity-check.md](./integrity-check.md) | Checksum manifest, Ed25519 verify, NFR-18 |
| [runbook.md](./runbook.md) | Xử lý sự cố thường gặp |
| [post-mortems/](./post-mortems/) | Bài học từ sự cố đã xử lý |

## Quy trình release

1. **Code**: PR → review → merge vào `main`.
2. **Build**: `./scripts/build.sh` → APK + EXE.
3. **Bundle content**: `./scripts/build-bundle.sh` → ký Ed25519.
4. **Deploy qua USB**: copy vào USB → cài từng thiết bị.
5. **Verify**: `content_security/signature_verify.dart` tự động kiểm tra.

## Đọc theo vai trò

| Vai trò | File đầu tiên |
|---------|--------------|
| DevOps / Triển khai | usb-distribution.md → runbook.md |
| GV / Admin | usb-distribution.md (chỉ phần cài) |
| Researcher | runbook.md §"Bài kiểm A & B" |

---

**END OF DOCUMENT**
