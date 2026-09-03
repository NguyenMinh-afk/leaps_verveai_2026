# 💾 Database

Quản lý database cho LEAPS (VerveAI).

## Cấu trúc

| Thư mục | Mục đích |
|---------|----------|
| [migrations/](./migrations/) | Database migrations (Prisma) |
| [seeds/](./seeds/) | Initial seed data |
| [schemas/](./schemas/) | SQL DDL definitions |
| [diagrams/](./diagrams/) | ER diagrams |

## Databases

### app/lib/storage/ — SQLite (TS-05)
- **Platform:** SQLite append-only
- **Mục đích:** Lưu trữ cục bộ trên thiết bị học sinh
- **Đặc điểm:** 
  - 1 file/cơ sở giáo dục
  - Bảng sự kiện chỉ ghi thêm (append-only)
  - Xuất và xoá gọn (FR-21, DR-09)
  - Integrity check (NFR-18)

### backend/ — PostgreSQL (Phase 2)
- **Platform:** PostgreSQL 15+
- **Mục đích:** API server cho web-portal
- **ORM:** Prisma
- **Thư mục:** `backend/prisma/schema.prisma`

## Status

⚠️ **Phase 1:** Chưa triển khai backend — web-portal dùng mock data.

📋 **Phase 2:** Backend với PostgreSQL + Prisma.

📋 **Hiện tại:** Chỉ có SQLite cho `app/lib/storage/`.

## Migrations

```bash
# Backend (Phase 2)
cd backend
npx prisma migrate dev
npx prisma migrate deploy
```

## Lưu ý

- **KHÔNG commit** dữ liệu thật vào seeds/
- Dùng dữ liệu ẩn danh cho development
- Schema phải tương thích ngược khi thêm migration
