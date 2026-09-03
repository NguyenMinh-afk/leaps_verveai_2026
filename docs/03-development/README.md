# 🛠️ Development Documentation

Hướng dẫn phát triển cho contributors **LEAPS (VerveAI)**.

> **Tên mã nguồn:** VerveAI · **App:** Verve

## Ưu tiên phát triển

| Ưu tiên | Module | Ghi chú |
|---------|--------|---------|
| **CAO NHẤT** | `web-portal/` (Next.js/TypeScript) | Web portal cho giáo viên |
| Sau | `app/` (Flutter PWA) | Triển khai sau khi web-portal hoàn thành |

---

## Cấu trúc

| Thư mục / File | Nội dung |
|----------------|----------|
| [coding-standards/](./coding-standards/) | Style guides: Dart, TypeScript, Python |
| [git-workflow.md](./git-workflow.md) | Branch + Conventional Commits |
| [testing-strategy.md](./testing-strategy.md) | Unit, integration, e2e + Bài kiểm A & B |
| [code-review-checklist.md](./code-review-checklist.md) | PR review checklist |
| [troubleshooting.md](./troubleshooting.md) | Các lỗi thường gặp |

## Quy tắc bắt buộc (MUST READ)

- [`.cursor/rules/00-project-overview.mdc`](../../.cursor/rules/00-project-overview.mdc) — Golden Rules.
- [`.cursor/rules/01-folder-structure.mdc`](../../.cursor/rules/01-folder-structure.mdc) — Đặt file đúng vị trí.
- [`.cursor/rules/02-frontend.mdc`](../../.cursor/rules/02-frontend.mdc) — Dart/Flutter.
- [`.cursor/rules/03-python.mdc`](../../.cursor/rules/03-python.mdc) — Python.
- [`.cursor/rules/04-testing.mdc`](../../.cursor/rules/04-testing.mdc) — Test coverage.
- [`.cursor/rules/05-git-workflow.mdc`](../../.cursor/rules/05-git-workflow.mdc) — Branch + commit.
- [`.cursor/rules/06-architecture.mdc`](../../.cursor/rules/06-architecture.mdc) — Kiến trúc.

## Quy trình đóng góp

1. Đọc BA Document + rule trên.
2. Tạo branch: `git checkout -b feature/VP-{id}-{desc}`.
3. Code + test.
4. PR theo template.
5. CI pass + review approve → merge.

Xem chi tiết: [git-workflow.md](./git-workflow.md), [code-review-checklist.md](./code-review-checklist.md).
