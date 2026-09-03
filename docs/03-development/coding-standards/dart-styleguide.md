# Dart & Flutter Style Guide — LEAPS / VerveAI

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản:** 1.4.5
> **Bản đồng bộ với `.cursor/rules/02-frontend.mdc`.**

---

## 📐 Naming

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Class / enum / extension | PascalCase | `EvidenceEvent`, `ContextMode`, `Bkt` |
| File | snake_case | `record_attempt.dart`, `language_barrier_detector.dart` |
| Constant | lowerCamelCase hoặc prefix `k` | `kMasteryThreshold`, `kWindowSize` |
| Boolean | prefix `is/has/should/can` | `isOffline`, `hasMastery` |
| Private | prefix `_` | `_evidenceLog` |

**Đặc biệt:**
- BKT constants `P_L0`, `P_T`, `P_G`, `P_S` — khai báo `const` trong `app/lib/engine/mastery/bkt.dart`.

---

## ✅ MUST

- Flutter ≥ 3.22, Dart ≥ 3.4, **sound null safety**.
- Stateless widget khi có thể; stateful chỉ khi thật sự cần.
- Material 3; theme sáng + tối.
- i18n cho mọi text user-facing (`flutter_localizations` + ARB).
- `Semantics` widget cho accessibility.
- Context mode tracking (in-class vs out-of-class) ở mọi lượt tương tác (BR-16).
- Engine (`app/lib/engine/`) là **Dart thuần** — không import Flutter.
- Ed25519 cho mọi bundle nội dung / model.
- `fact_check_guard` (AIR-24) chạy trư�c khi phát đầu ra Lớp 3.

## ❌ NEVER

- Class chỉ để truyền dữ liệu → dùng record/function widget.
- `dynamic` — dùng `Object?` + pattern matching.
- `print` — dùng `debugPrint` (dev) hoặc `dart:developer log` (production).
- Hardcoded URL/secret/text user-facing — ARB / config.
- Magic numbers — `const` ở đầu file hoặc file constants riêng.
- File `.ts`/`.tsx` trong `app/`.
- Comment lặp lại code hoặc giải thích hiển nhiên.
- Blocking call trong `build()` / `initState()`.
- Gọi `inference/` trong unit test của `engine/`.

---

## 🧪 Test

- `flutter test` cho unit + acceptance.
- `flutter test integration_test` cho e2e.
- Coverage tối thiểu:
  - `app/lib/engine/mastery/bkt.dart` — **90%**.
  - Toàn bộ `app/lib/engine/` — **≥ 80%**.
- Mock `LlamaBindings` qua **subclass override** (KHÔNG thêm `mocktail`/`mockito`).

---

## 🔧 Cấu hình & Build

- `--dart-define` cho env (KHÔNG dùng `VITE_*`).
- `flutter build apk --release` cho Android (TS-17).
- `flutter build windows --release` cho Windows (TS-18).
- Model + nội dung phân phối qua USB (TS-19), **KHÔNG** bundle vào APK/EXE.

---

## 🎯 BKT Rules (TS-07)

- BKT là **tất định** (cùng input → cùng output).
- Validate qua `research/simulation/self_consistency_check.py`.
- Nếu thất bại → cân nhắc IRT / DKT / PFA. Mở ADR mới.

## ⚠️ Nhánh đang chờ

- `app/lib/inference/` — **[A]** — không đưa ra khỏi [A] trước Bài kiểm A & B.
- `app/lib/ui/student/` — **chưa code** — chờ OS-03 (G.9 vùng #1 kèm theo).

---

## 📚 TÀI LIỆU LIÊN QUAN
- [`.cursor/rules/02-frontend.mdc`](../../.cursor/rules/02-frontend.mdc) — Phiên bản rule.
- [Testing Strategy](../testing-strategy.md).
