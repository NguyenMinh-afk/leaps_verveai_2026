# ❓ FAQ — Câu hỏi thường gặp

## Tổng quan

### LEAPS (VerveAI) là gì?
App Flutter chạy 100% offline, chẩn đoán kiến thức cho học sinh — theo BA v1.4.5.

### Tại sao offline?
- Trường học ở vùng sâu/vùng xa không có internet ổn định (CO-R-01/02).
- Băng thông hẹp → cloud không khả thi.
- Privacy: PII không bao giờ rời thiết bị (BR-01, DR-08).

### Có app mobile không?
- Android: APK (TS-17).
- Windows: EXE độc lập (TS-18).
- iOS, macOS, web: KHÔNG (chỉ 2 nền tảng trên).

---

## LLM cục bộ

### Tại sao dùng LLM cục bộ?
- Để phát hiện rào cản ngôn ngữ (FR-25) không thể làm bằng rule cứng.
- Để diễn đạt kết quả cho GV (Lớp 3 — BR-13).

### Model nào?
- Gemma 4B / 2B / 1B (lượng tử 4-bit, GGUF, TS-03).
- Chạy qua `llama.cpp` FFI (TS-02).

### Tại sao `[A]`?
- Chưa chốt cỡ model (AS-61).
- Chưa chạy Bài kiểm A (chất lượng) và B (hiệu năng) trên thiết bị thật.
- Xem [Bài kiểm A](../05-research/TEST-A-EXTRACTION.md) và [B](../05-research/TEST-B-DEVICE-PERFORMANCE.md).

---

## Sync

### Sync bằng cách nào?
- **SC-05**: hub cục bộ — cùng app Flutter, HTTP nội bộ trên máy GV (TS-08).
- **SC-06**: USB exchange — archive mã hoá, dự phòng (TS-11).

### SC-06 bắt buộc không?
- **CÓ** (theo BA v1.4.5).
- Lý do: hub có thể hỏng, GV vắng — cần USB làm fallback.

### Sao lưu dữ liệu ở đâu?
- Trong app (SQLite, TS-05).
- Trên hub (NFR-22).
- KHÔNG lên cloud.

---

## Privacy

### PII có lên cloud không?
- **KHÔNG** — toàn bộ offline.
- Khi xuất ra bên thứ ba → ẩn danh tại hub (DR-08).

### HS có thể xoá dữ liệu không?
- Có (FR-21, DR-09).
- Qua admin → sau retention → xoá background.

### GV có thể sửa evidence không?
- KHÔNG sửa evidence cũ (DR-11 — append-only).
- GV có thể thêm **chú thích GV** (teacher note) — nguồn chuẩn (BR-17).

---

## Trong quá trình phát triển

### Làm sao chạy test?
```bash
cd app && flutter test                          # Dart
cd research && make test-unit                    # Python
cd research && make test-a                       # Bài kiểm A
```

### Làm sao build APK?
```bash
cd app && flutter build apk --release
```

### Làm sao ký bundle?
```bash
PRIVATE_KEY_PATH=./keys/content-signing.key \
  ./scripts/build-bundle.sh ./dist/content 2026.08.25
```

### AI assistant có rule chuẩn không?
- Có — xem `.cursor/rules/00..06`.
- Bắt buộc đọc `00-project-overview.mdc` (Golden Rules) trước.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [README](../README.md)
- [Stakeholders](../01-business/STAKEHOLDERS.md)
- [Troubleshooting](../03-development/troubleshooting.md)
- [Runbook](../04-operations/runbook.md)

---

**END OF DOCUMENT**
