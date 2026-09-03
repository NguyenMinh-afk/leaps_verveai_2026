# Content Pipeline (online, chạy trước khi triển khai)

Sinh nội dung (câu hỏi, biến thể, gợi ý), kiểm duyệt tự động, rà soát chất lượng, và đóng gói thành bundle có ký Ed25519 để cài qua USB (TS-19, TS-20).

## Thư mục con

- `authoring/`        — sinh biến thể (generate_variants.ts)
- `auto-verify/`      — kiểm tra đáp án đúng (check_answer_correctness.ts)
- `age-appropriateness/` — **MỚI — NFR-23**: kiểm duyệt phù hợp lứa tuổi, ngoài đúng-sai
- `review/`           — hàng đợi rà soát (review_queue.ts)
- `export/`           — đóng gói (`buildContentBundle.ts`) và **ký Ed25519** (`signBundle.ts`)

## Lưu ý

- Khoá riêng Ed25519 do **người thẩm định giữ**; không commit.
- App Flutter ở `app/` chỉ dùng khoá công khai để xác minh (`content_security/signature_verify.dart`).
