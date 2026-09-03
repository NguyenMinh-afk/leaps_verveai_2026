# Troubleshooting

Lỗi thường gặp và cách xử lý.

---

## 1. L�i khi build APK

### `FAILURE: Build failed with an exception. Could not determine java version`

- Nguyên nhân: Java/Android SDK chưa đúng version.
- Xem yêu cầu ở `app/pubspec.yaml` (Flutter ≥ 3.22, Dart ≥ 3.4).
- Chạy `flutter doctor` để kiểm tra môi trường.

### `Gradle could not resolve sqflite_common_ffi`

- Nguyên nhân: thiếu Windows desktop support.
- Chạy `flutter config --enable-windows-desktop` rồi `flutter pub get`.

---

## 2. Lỗi khi test Flutter

### `Bad state: Tried to read content of an unavailable channel`

- Nguyên nhân: test gọi platform channel mà không mock.
- Xem rule 02-frontend.mdc — **mock bằng subclass override**, KHÔNG thêm `mocktail`.

### `TypeError: Null is not a subtype of ...` trong test

- Nguyên nhân: thiếu `null` safety trong code production.
- Bật `strict-casts`, `strict-inference` trong `analysis_options.yaml`.

---

## 3. Lỗi khi sync qua hub

### HS không tìm thấy hub

- Kiểm tra mDNS đang bật trên cả 2 thiết bị (Windows + Android).
- Tường lửa Windows: cho phép Flutter qua port LAN.
- Thử dùng QR pairing thay vì mDNS.

### Merge conflict — eventId trùng, payload khác

- Đây là **cờ conflict** (BR-17) — KHÔNG tự động ghi đè.
- Mở `ui/teacher/intervention_dashboard.dart` → xem danh sách conflict.
- **Chú thích GV thắng** (BR-17) — nếu là chú thích GV thì giữ.

---

## 4. Lỗi khi build nội dung

### `signBundle: PRIVATE_KEY_PATH not set`

- Set env: `export PRIVATE_KEY_PATH=./keys/content-signing.key`.
- Khoá riêng KHÔNG commit.

### `GBNF schema không đóng`

- LLM sinh token không khớp schema → inference lỗi.
- Dùng [GBNF validator](https://github.com/ggml-org/llama.cpp/tree/master/grammars) trước khi deploy.
- Test grammar qua `app/lib/inference/grammar/` test.

---

## 5. Lỗi khi chạy Bài kiểm A/B

### `need-30-attempts-got-X`

- Bài kiểm A yêu cầu **đúng 30 bài làm**.
- Mở `research/model-eval/data/attempts.csv` → bổ sung đủ 30 dòng.

### `fleiss-kappa-below-threshold`

- 3 GV chấm không đồng thuận.
- Có thể do schema root_cause_id mơ hồ → thống nhất lại với GV.
- Hoặc tăng số lượng bài để giảm nhiễu.

### `cohen-kappa-below-threshold`

- LLM (Lớp 1) khớp GV ở mức thấp.
- Xem confusion matrix ở `reports/test_a_*.json`.
- Thử prompt khác hoặc đổi cỡ model.

### `model_size_on_disk too large`

- Bài kiểm B fail ở budget 2500 MB.
- Hạ cỡ model: 4B → 2B → 1B (AS-61).

---

## 6. Lỗi khi chạy Python tests

### `ModuleNotFoundError: No module named 'research'`

- Chưa `pip install -e .` hoặc chưa activate venv.
- Xem `research/Makefile` — `make install` rồi `make test-unit`.

### `pydantic ValidationError`

- CSV thiếu cột → xem `research/model-eval/data/SCHEMA.md`.
- Schema validation fail-fast.

---

## 7. Lỗi Cursor AI

### AI gợi ý thêm `mocktail`/`mockito`

- BỎ QUA. Rule 02-frontend.mdc **cấm** thêm dependency mock.
- Mock bằng subclass override.

### AI đề xuất code `ui/student/`

- BỎ QUA. Rule 00-project-overview.mdc — **chờ OS-03**.

### AI đề xuất dùng cloud

- BỎ QUA. Rule 00-project-overview.mdc — **offline 100%**.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [Testing Strategy](./testing-strategy.md)
- [Git Workflow](./git-workflow.md)
- [Code Review Checklist](./code-review-checklist.md)
- [`.cursor/rules/`](../../.cursor/rules/) — Toàn bộ rule.

---

**END OF DOCUMENT**
