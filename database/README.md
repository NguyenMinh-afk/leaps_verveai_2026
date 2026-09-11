# Database Migrations

Thư mục này chứa Prisma migrations gốc cho 5 schema trong PostgreSQL.

## Cấu trúc

```
database/
├── migrations/             # Prisma migrations (theo version)
│   ├── 0001_init/         # Initial — 5 schema với tables cơ bản
│   ├── 0002_add_skills/   # Thêm skills + prereq
│   ├── 0003_add_evidence/ # Thêm evidence chain
│   └── ...
├── diagrams/               # ERD
│   ├── erd.svg
│   └── schema.puml
├── seeds/                  # Data mẫu cho dev
│   └── dev_seed.ts
└── README.md
```

## Quy trình migration

```bash
# 1. Tạo migration mới từ shared/prisma-schema
cd service/shared/prisma-schema
npx prisma migrate dev --name init

# 2. Apply migrations cho cả 5 schema (1 lần)
cd database/migrations
npx prisma migrate deploy
```

## 5 Schema

| Schema | Models | Service |
|--------|--------|---------|
| **auth** | user, session, refresh_token, teacher_class, teacher_note | svc-auth |
| **bkt** | skill, diagnosis, evidence, intervention, intervention_note | svc-bkt |
| **class** | class, student, enrollment, progress | svc-class |
| **content** | content_item, bundle, bundle_signature, review | svc-content |
| **sync** | device, sync_log, sync_conflict, student_transfer | svc-sync |

## Convention

- Mỗi migration có tên mô tả: `0001_init`, `0002_add_skills`, etc.
- Migration KHÔNG được sửa sau khi đã apply.
- Dùng `prisma migrate dev` cho development.
- Dùng `prisma migrate deploy` cho production.
