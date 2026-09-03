# Code Review Checklist

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản:** 1.4.5
> **Ngày:** 05/09/2026

Checklist dùng khi review PR LEAPS (VerveAI). Reviewer dùng làm template comment.

---

## 1. Liên kết BA & ADR

- [ ] PR có tham chiếu FR/BR/DR/NFR/TS/SC/AS/VP-id ở footer.
- [ ] Nếu thay đổi kiến trúc → có ADR mới hoặc cập nhật ADR hiện.
- [ ] Không tự ý thêm dependency mới ngoài `pubspec.yaml` / `pyproject.toml` / `package.json` đã chốt.

## 2. Folder Structure (`.cursor/rules/01-folder-structure.mdc`)

- [ ] File đặt đúng vị trí theo cấu trúc.
- [ ] Không tạo thư mục ngoài cấu trúc.
- [ ] `app/lib/` chỉ chứa `.dart`.
- [ ] `content-pipeline/` chỉ chứa `.ts`/`.tsx`.
- [ ] `research/` chỉ chứa `.py`.
- [ ] Không tạo backend services mới.

## 3. Lớp 2 — Engine (`app/lib/engine/`)

- [ ] **Tất định** — không có `DateTime.now()`, `Random`, `print`, `flutter` widgets.
- [ ] **Idempotent** — gọi nhiều lần cùng input ra cùng output.
- [ ] Dart thuần — KHÔNG import `package:flutter/...`.
- [ ] BKT constants là `const`, không truyền qua config runtime (TS-07).
- [ ] Test ≥ 80% cho `engine/`, ≥ 90% cho `bkt.dart`.
- [ ] Test có case "cùng input → cùng output" (deterministic).

## 4. Lớp 1 & 3 — Inference (`app/lib/inference/`)

- [ ] Vẫn đang **[A]** — không đưa ra khỏi [A] nếu chưa đạt Bài kiểm A & B.
- [ ] Nếu PR đụng `inference/` → reviewer **xác nhận trạng thái [A] không đổi ngoài ý muốn**.
- [ ] Lớp 1 dùng GBNF (TS-04) — không để LLM sinh nhãn ngoài.
- [ ] Lớp 3 qua `fact_check_guard` (AIR-24) trước khi phát cho người dùng.
- [ ] Mock llama.cpp bằng subclass override (KHÔNG thêm `mocktail`/`mockito`).

## 5. Privacy (`.cursor/rules/06-architecture.mdc` §"Privacy Rules")

- [ ] Không PII trong log.
- [ ] Mọi hàm xuất dữ liệu qua `Anonymizer.anonymize()` (DR-08).
- [ ] Audit log ghi nhận thao tác admin (BR-05).
- [ ] Timestamp dùng logical clock, không `DateTime.now()` (DR-10).
- [ ] Evidence append-only — KHÔNG sửa evidence cũ.
- [ ] ConfidenceWeight theo context (BR-16) — in-class > out-of-class.
- [ ] Hub chỉ dùng nội bộ LAN — không public port.

## 6. UI

- [ ] UI HS chưa code — chờ OS-03.
- [ ] UI giáo viên có i18n (không hardcoded text).
- [ ] Material 3 + theme sáng/tối.
- [ ] `Semantics` widget cho accessibility.

## 7. Testing

- [ ] Test pass locally + CI.
- [ ] Coverage không giảm so với base.
- [ ] Mock bằng subclass override, không thêm library mock.
- [ ] Không skip test không có lý do.

## 8. Git (`.cursor/rules/05-git-workflow.mdc`)

- [ ] Branch đúng format `type/NEKO-id-desc`.
- [ ] Commit theo Conventional Commits.
- [ ] Subject ≤ 72 ký tự, imperative.
- [ ] Footer có Refs/Fixes/BREAKING CHANGE.
- [ ] Không commit `.gguf`, `*.verveai-bundle.zip`, khoá Ed25519.

## 9. Build & Deploy

- [ ] `flutter test` pass.
- [ ] `flutter build apk --release` thành công (nếu đụng `app/`).
- [ ] `flutter build windows --release` thành công (nếu đụng native code).
- [ ] `pytest` pass (nếu đụng `research/`).
- [ ] Không commit bundle / model.

## 10. Tài liệu

- [ ] Nếu thêm module mới → update `.cursor/rules/01-folder-structure.mdc`.
- [ ] Nếu đổi kiến trúc → mở ADR mới.
- [ ] Nếu đổi quy trình → update `docs/03-development/` hoặc `04-operations/`.

---

## 🎯 Quyết định merge

- ✅ **Approve**: tất cả mục trên ✓ + reviewer tự tin.
- ⚠️ **Comment**: có thắc mắc → yêu cầu author giải đáp.
- ❌ **Request changes**: có mục ✗ → author fix và cập nhật PR.

## 📚 TÀI LIỆU LIÊN QUAN

- [`.cursor/rules/00-project-overview.mdc`](../../.cursor/rules/00-project-overview.mdc) — Golden Rules.
- [`.cursor/rules/04-testing.mdc`](../../.cursor/rules/04-testing.mdc) — Testing.
- [`.cursor/rules/05-git-workflow.mdc`](../../.cursor/rules/05-git-workflow.mdc) — Git.
- [`.cursor/rules/06-architecture.mdc`](../../.cursor/rules/06-architecture.mdc) — Architecture.

---

**END OF DOCUMENT**
