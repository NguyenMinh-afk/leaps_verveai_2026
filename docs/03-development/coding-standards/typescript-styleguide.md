# TypeScript Style Guide — LEAPS / VerveAI (web-portal, content-pipeline, review-console)

> **Tên mã nguồn:** VerveAI · **App:** Verve
> **Phiên bản:** 1.4.5
> **Áp dụng cho:** `web-portal/` (Next.js), `content-pipeline/`, `review-console/`

---

## 📐 Naming

| Loại | Convention | Ví dụ |
|------|-----------|-------|
| Class / enum / interface | PascalCase | `ContentBuilder`, `ReviewQueueItem` |
| File | kebab-case | `build-content-bundle.ts`, `review-queue.ts` |
| Variable / function | camelCase | `buildBundle`, `isKnowledgeGap` |
| Constant | UPPER_SNAKE_CASE | `GBNF_SCHEMA_VERSION` |
| Boolean | prefix `is/has/should/can` | `isValid`, `hasMastery` |
| Private | prefix `_` (private field/method) | `_signKey` |

---

## ✅ MUST

- TypeScript ≥ 5.0, `strict: true` trong `tsconfig.json`.
- ESM imports (`import { ... } from ...`), KHÔNG CommonJS.
- Dùng `zod` cho schema validation (input từ CLI/JSON).
- Dùng `pino` cho logging (production) — KHÔNG `console.log`.
- Tất cả output phải deterministic (cùng input → cùng output).
- Mọi gói bundle phải qua `signBundle.ts` (Ed25519) trước khi phát hành.
- `age-appropriateness` (NFR-23) chạy trước khi review.

## ❌ NEVER

- `any` — dùng `unknown` + type guards.
- `console.log` trong production.
- Hardcoded khoá bí mật — env qua `process.env.PRIVATE_KEY_PATH`.
- Mutable default parameters.
- Skip validation schema.
- Commit khoá riêng Ed25519.

---

## 📁 Module structure

### web-portal/ (Next.js)
```
web-portal/src/
├── app/                             # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   └── ...
├── styles/
│   └── globals.css                  # Tailwind + CSS variables (shadcn/ui)
├── components/                      # React components
└── lib/                            # Utilities, API clients
```

### content-pipeline/src/
```
content-pipeline/src/
├── authoring/
│   └── generate_variants.ts
├── auto-verify/
│   └── check_answer_correctness.ts
├── age-appropriateness/             # NFR-23
│   └── age_appropriateness_check.ts
├── review/                          # FR-20, SN-SC-03
│   └── review_queue.ts
└── export/
    ├── buildContentBundle.ts
    └── signBundle.ts                # Ed25519
```

---

## 🧪 Test

- `pnpm test` — Jest + ts-jest.
- Snapshot test cho output bundle (cẩn thận timestamp trong snapshot).
- E2E test với dữ liệu giả trong `tests/fixtures/`.

---

## 📚 TÀI LIỆU LIÊN QUAN
- [`.cursor/rules/03-python.mdc`](../../.cursor/rules/03-python.mdc) — cho Python nghiên cứu.
- [Testing Strategy](../testing-strategy.md).
