# CI/CD Workflows

GitHub Actions workflows cho dự án **NEKOPATH** — Diagnostic Assessment Engine.

## Project Structure (pnpm monorepo)

```
nekopath/
├── app/                    # Flutter app (TS-01): offline-first, APK + EXE
│   └── lib/
│       ├── engine/         # Lớp 2: BKT, cluster, diagnose (Dart thuần)
│       ├── inference/      # Lớp 1 & 3: llama.cpp FFI, GBNF (tùy Bài kiểm A/B)
│       ├── hub/            # SC-05: HTTP nội bộ + mDNS
│       ├── sync/           # SC-06: USB chunked transfer
│       ├── storage/        # TS-05: SQLite + audit log
│       ├── privacy/        # DR-08/09/12: ẩn danh, xóa, retention
│       ├── ui/             # Flutter widgets (teacher, admin — student chờ OS-03)
│       └── auth/           # FR-22: profile_gate
│
├── content-pipeline/      # TypeScript (online): FR-20, SN-SC-03
│   └── src/
│       ├── authoring/      # Tạo câu hỏi, ký Ed25519
│       └── export/         # Build & sign bundle cho app
│
├── review-console/         # React/TypeScript (online): SC-04
│   └── src/
│       └── screens/        # Teacher review interface (browser)
│
├── database/               # PostgreSQL schema (web console online)
├── infra/                  # Kubernetes / Terraform (web services)
├── research/                # Python: device eval, model analysis
└── scripts/                # Deployment scripts
```

## Workflows

| Workflow | Mô tả | Trigger |
|----------|--------|---------|
| `ci-app.yml` | Flutter analyze + unit test + widget test | push/PR `app/**` |
| `ci-content-pipeline.yml` | TypeScript lint + typecheck + vitest | push/PR `content-pipeline/**` |
| `ci-review-console.yml` | ESLint + typecheck + vitest | push/PR `review-console/**` |
| `ci-research.yml` | pytest + flake8 | push/PR `research/**` |
| `build-android.yml` | Build debug APK (device test) | push to `develop` |
| `build-windows.yml` | Build Windows EXE | push to `develop` |
| `bundle-sign.yml` | Sign content bundle (Ed25519) | release tag |
| `e2e-tests.yml` | Playwright e2e cho review-console | PR merge |
| `deploy-web.yml` | Deploy review-console + content-pipeline | push to `main` |

## Lưu ý

- **App Flutter offline-first** — CI build APK/EXE, deploy qua USB hoặc GitHub Release
- **Web services online** — review-console + content-pipeline deploy lên cloud
- **Không có backend microservices** — app không cần server để chạy
- **Sync qua USB** (SC-06) — không cần cloud sync
- **Content bundle ký Ed25519** — đảm bảo không bị chỉnh sửa sau khi export
- **Bài kiểm A & B** (Bảng F.5) quyết định inference pipeline có/không có trong app

## Secrets cần thiết

| Secret | Mô tả |
|--------|--------|
| `SIGNING_KEY` | Private key Ed25519 cho ký content bundle |
| `ANDROID_KEYSTORE` | Keystore để ký APK release |
| `DEPLOY_TOKEN` | Token deploy review-console + content-pipeline |
| `POSTGRES_URL` | Connection string cho database/ (web console) |
