# Git Workflow

> **Bản này đồng bộ với `.cursor/rules/05-git-workflow.mdc`.** Xem rule để có phiên bản mới nhất.

## 🌿 Branch Naming

```
<type>/VP-<id>-<short-desc>

feature/VP-123-add-bkt-mastery
fix/VP-456-fix-hub-discovery
hotfix/VP-789-critical-sync-bug
refactor/VP-234-improve-item-selection
docs/VP-345-update-adr
test/VP-456-add-engine-tests
chore/VP-567-update-deps
```

## 📝 Commit Format (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `revert`.

### Scopes (theo BA v1.4)
- `(web-portal)` — Next.js/TypeScript web portal.
- `(engine)` — Lớp 2 (BKT, diagnose, item_selection, grouping, knowledge_graph, versioning, transfer).
- `(inference)` — Lớp 1 & 3.
- `(storage)` — SQLite append-only.
- `(hub)` — SC-05.
- `(sync)` — SC-06.
- `(bootstrap)` — AS-28, TS-19/20.
- `(ui)` — Flutter UI.
- `(privacy)` — BR/DR/NFR.
- `(content-security)` — Ed25519.
- `(content-pipeline)` — TypeScript.
- `(research)` — Python.
- `(adr)` — ADR.
- `(deps)` — package versions.

### Rules
- Subject ≤ 72 ký tự, **imperative** ("add" not "added").
- Body ≤ 100 ký tự/dòng, giải thích **why**.
- Footer: `Refs:`, `Fixes:`, hoặc `BREAKING CHANGE:`.

## ✅ EXAMPLES

```bash
git commit -m "feat(engine): add BKT mastery tracking

Implement Bayesian Knowledge Tracing with fixed parameters
P_L0, P_T, P_G, P_S0 as const (TS-07 — deterministic).

Refs: NEKO-123, FR-06, FR-07, FR-11"

git commit -m "feat(hub): add mDNS discovery + 6-digit pairing

Local hub via mDNS and pairing code (TS-08, TS-09).
Encrypted channel via libsodium (TS-10).

Refs: NEKO-310, SC-05, TS-09"

git commit -m "feat(engine): add language barrier detector (FR-25)

Distinguish 'did not understand the question' from 'gap in knowledge'.
Critical for Vietnamese rural classrooms with mixed dialects.

Refs: NEKO-450, FR-25, G.9"
```

## ❌ NEVER
- `git commit -m "update"` / `"fix bug"` / `"WIP"`.
- Commit trực tiếp vào `main`.
- Force push sau khi review started.
- Commit `.gguf`, `*.verveai-bundle.zip`, khoá riêng Ed25519.
- Squash nhiều concern vào 1 commit — 1 commit = 1 thay đổi logic.
- Commit > 500 dòng thay đổi — tách nhỏ.

## 🔀 PR Rules
- Title: Conventional Commits (`feat(engine): ...`).
- Description bắt buộc: **What / Why (Refs) / Test / Risk**.
- Reviewer tối thiểu 1; merge chỉ khi CI xanh + review approve.
- PR chạm `inference/` cần reviewer xác nhận trạng thái **[A]** không bị thay đổi ngoài ý muốn.

## 📚 TÀI LI�U LIÊN QUAN
- [`.cursor/rules/05-git-workflow.mdc`](../../.cursor/rules/05-git-workflow.mdc) — Phiên bản rule.
- [code-review-checklist.md](./code-review-checklist.md) — PR checklist.
