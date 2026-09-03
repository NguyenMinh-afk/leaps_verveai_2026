# Thư mục test/ — NEKOPATH

## Bố cục

- `unit/` — unit test cho `app/lib/engine/` (Lớp 2 — tất định). **BẮT BUỘC pass** trước khi merge.
- `acceptance/` — test chấp nhận theo từng BR/FR/NFR.
- `e2e/` — `integration_test` chạy trên thiết bị thật (Android/Windows).

## Test đã có (v0.1)

| File | Phủ |
|---|---|
| `unit/engine/mastery/bkt_test.dart` | `bkt.dart` — TS-07: tất định, idempotent, log-likelihood |
| `unit/engine/evidence/evidence_context_test.dart` | `evidence_context.dart` + `record_attempt.dart` — DR-11, BR-16 |
| `unit/engine/diagnose/language_barrier_detector_test.dart` | `language_barrier_detector.dart` — FR-25 (G.9) |
| `unit/engine/grouping/cluster_by_root_cause_test.dart` | `cluster_by_root_cause.dart` — BR-07 (30%/sàn 3), BR-08 (tie-break) |
| `unit/engine/transfer/student_transfer_test.dart` | `student_transfer.dart` — FR-26 (G.9) |

## Coverage yêu cầu

| Layer | Min |
|---|---|
| `engine/mastery/bkt.dart` | 90% |
| `engine/` (tổng) | 80% |
| `hub/`, `sync/` | 85% |
| `storage/` | 80% |

## Chạy test

```bash
cd app && flutter pub get
flutter test                                # unit + acceptance
flutter test test/unit                      # chỉ unit
flutter test --coverage                     # có coverage report
flutter test integration_test               # e2e trên thiết bị thật
```

## Quy tắc mock (theo 02-frontend.mdc)

- **KHÔNG thêm `mocktail` hay `mockito`** vào `pubspec.yaml`.
- Mock bằng **subclass override**: tạo class con override hàm cần mock.
- Test `inference/` (Lớp 1 & 3) chỉ chạy khi `LlamaBindings` được mock qua subclass.

## Khi nào mở rộng

- Mỗi khi thêm file vào `engine/`, viết test tương ứng đảm bảo:
  - Tất định (cùng input → cùng output).
  - Idempotent (gọi nhiều lần → không thay đổi state).
  - Không phụ thuộc `DateTime.now()`, `Random`, `print`, `flutter` widgets.