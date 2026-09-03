# SQLite Schema for LEAPS (VerveAI)
# TS-05 — Append-only event log
# Platform: Flutter (app/)

## Tables

### evidence_events
Bảng sự kiện chỉ ghi thêm (append-only).

| Column | Type | Mô tả |
|--------|------|--------|
| id | TEXT | UUID |
| student_id | TEXT | Mã học sinh |
| skill_id | TEXT | Mã kỹ năng |
| item_id | TEXT | Mã câu hỏi |
| response | INTEGER | Đáp án (0/1) |
| timestamp | INTEGER | Unix timestamp |
| metadata | TEXT | JSON metadata |

### mastery_state
Trạng thái mastery BKT.

| Column | Type | Mô tả |
|--------|------|--------|
| student_id | TEXT | Mã học sinh |
| skill_id | TEXT | Mã kỹ năng |
| p_known | REAL | Xác suất known |
| evidence_count | INTEGER | Số bằng chứng |

### content_bundles
Gói nội dung đã tải về.

| Column | Type | Mô tả |
|--------|------|--------|
| bundle_id | TEXT | Mã gói |
| version | TEXT | Phiên bản |
| signature | TEXT | Ed25519 signature |
| downloaded_at | INTEGER | Thời gian tải |

## Lưu ý
- KHÔNG có UPDATE hoặc DELETE trên bảng evidence_events
- Integrity check định kỳ (NFR-18)
- Export & tombstone (FR-21, DR-09)
