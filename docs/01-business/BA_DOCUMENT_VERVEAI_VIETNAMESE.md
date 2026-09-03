# Tài Liệu Phân Tích Kinh Doanh — LEAPS (VerveAI)

> **Dự án:** LEAPS (Local Educational Adaptive Personalization System)  
> **Tên Ứng dụng:** Verve  
> **Mã dự án:** VerveAI
> **Phiên bản BA Document:** 2.2
> **Ngày cập nhật:** 2026-09-06

| **Phiên bản** | **Ngày** | **Trạng thái** | **Thay đổi** |
|---------------|----------|----------------|--------------|
| 2.0 | 2026-09-06 | Bản nháp | Viết lại hoàn chỉnh theo cấu trúc 24 phần mới |
| 2.1 | 2026-09-06 | Bản nháp | Cập nhật dựa trên xác minh triển khai — căn chỉnh số FR, sửa cấu trúc dự án, thêm các triển khai còn thiếu |
| 2.2 | 2026-09-06 | Bản nháp | Đã sửa: Tính nhất quán ID GAP, độ chính xác trạng thái triển khai, nhãn bằng chứng BO, làm rõ mục tiêu NFR, rõ ràng actor Use Case, nhất quán RTM, lỗi chính tả |

---

**Nhãn Bằng chứng:**
- **[F]** Fact — được hỗ trợ bởi mã nguồn, tài liệu, hoặc quan sát trực tiếp
- **[I]** Inference — suy luận hợp lý từ các fact, chưa được xác minh trực tiếp
- **[A]** Assumption — chưa xác minh, cần xác thực
- **[TBD]** To Be Determined — đang chờ xác nhận

---

# 1. Tổng quan Dự án

## 1.1 Tên Dự án

**LEAPS — Local Educational Adaptive Personalization System**  
*(Mã dự án: VerveAI · Ứng dụng: Verve)*

## 1.2 Lĩnh vực Kinh doanh

Công nghệ Giáo dục (EdTech) — Hỗ trợ Học tập Thích ứng cho Lớp học có Năng lực Hỗn hợp tại Việt Nam, cụ thể nhắm vào giáo dục Toán ở bậc trung học cơ sở (lớp 5-7).

## 1.3 Mục đích Dự án

Xây dựng một công cụ đánh giá chẩn đoán hoạt động 100% offline, xác định khoảng trống kiến thức ở cấp độ kỹ năng (không chỉ ở cấp độ chương), và hỗ trợ giáo viên đưa ra quyết định can thiệp phân biệt trong giới hạn thời gian lên lớp.

## 1.4 Vấn đề Kinh doanh

Kiến thức toán có cấu trúc phụ thuộc: nội dung xây dựng trên nền tảng nội dung trước đó. Trong lớp học có năng lực hỗn hợp (40-45 học sinh), một câu trả lời sai có thể bắt nguồn từ nhiều nguyên nhân gốc rễ khác nhau. Hiện tại giáo viên chỉ nhận được tín hiệu nhị phân (đúng/sai) mà không có thông tin chẩn đoán, buộc họ phải giảng dạy theo mức trung bình.

**Điểm mấu chốt:** Đơn vị phân tích trong thực tế hiện tại là *điểm × chương*. Đơn vị cần thiết cho can thiệp đúng là *nguyên nhân gốc × kỹ năng*. Toàn bộ khoảng trống của dự án nằm ở sự không khớp pha này.

## 1.5 Giải pháp Đề xuất

Một công cụ chẩn đoán 100% offline kết hợp:
1. **Thu thập Bằng chứng** — ghi nhận có cấu trúc công việc của học sinh với ngữ cảnh
2. **Kiến trúc AI 3 Lớp** — trích xuất (LLM), quyết định tất định (BKT/đồ thị), biểu đạt (dựa trên mẫu)
3. **Đồng bộ Hub Cục bộ** — đồng bộ ngang hàng không qua internet qua mDNS/HTTP hoặc USB dự phòng
4. **Thiết kế Ưu tiên Quyền riêng tư** — dữ liệu không bao giờ rời khỏi khuôn viên trường, ẩn danh trước khi xuất

## 1.6 Mục tiêu

| **ID** | **Mục tiêu** | **Chỉ số Thành công** | **Trạng thái** |
|--------|--------------|----------------------|-----------------|
| BO-01 | Giảm thời gian từ phát hiện đến can thiệp cho khoảng trống kiến thức đã xác định | Số ngày/bài học cho đến khi phát hiện — **TBD** | **[A]** |
| BO-02 | Cho phép giảng dạy phân biệt mà không tăng khối lượng công việc của giáo viên | So sánh thời gian hàng tuần — **TBD** | **[A]** |
| BO-03 | Giảm số quyết định can thiệp mỗi lớp | Số nhóm can thiệp mỗi lớp — **TBD** | **[A]** |
| BO-04 | Giảm nợ kiến thức chuyển sang lớp/chương tiếp theo | Học sinh đạt chuẩn thành thạo — **TBD** | **[A]** |
| BO-05 | Triển khai được ở khu vực không/kết nối hạn chế | Số ngày hoạt động liên tục offline — **TBD** | **[A]** |
| BO-06 | Không có rủi ro pháp lý hoặc đạo đức về dữ liệu học sinh | Sự cố bằng không; cơ sở pháp lý được ghi nhận | **[TBD]** |
| BO-07 | Hiệu quả có thể được xác minh bởi bên độc lập | Tồn tại báo cáo đánh giá của bên thứ ba | **[TBD]** |
| BO-08 | Không làm rộng thêm khoảng cách giữa học sinh giỏi và yếu | So sánh tiến độ giữa các nhóm — **TBD** | **[A]** |

> **Ghi chú:** Không có mục tiêu kinh doanh nào có chỉ tiêu số cụ thể trong phiên bản này. Tất cả các mục tiêu được đánh dấu **TBD** vì dữ liệu cơ sở chưa được thu thập từ thực tế.

## 1.7 Giá trị Kinh doanh Kỳ vọng

| **Giá trị** | **Đo lường** | **Trạng thái** |
|-------------|--------------|----------------|
| Phát hiện sớm hơn khoảng trống kiến thức | Giảm độ trễ phát hiện | **[TBD]** |
| Ít quyết định can thiệp hơn mỗi lớp | Tỷ lệ nén | **[TBD]** |
| Giảm tích lũy nợ kiến thức | Tỷ lệ giữ lại | **[TBD]** |
| Có thể mở rộng đến khu vực kết nối kém | Thành công triển khai ở vùng T0/T1 | **[TBD]** |
| Tuân thủ quyền riêng tư | Sự cố dữ liệu bằng không | **[F]** |

---

# 2. Các Bên liên quan

## 2.1 Phân loại Bên liên quan

### Bên liên quan Chính

| **ID** | **Bên liên quan** | **Vai trò** | **Trách nhiệm** | **Quan tâm** |
|--------|-------------------|-------------|-----------------|--------------|
| SH-01 | Giáo viên Toán | Người dùng chính; người ra quyết định thực tế | Sử dụng hệ thống; cung cấp chuyên môn lĩnh vực | Rất Cao |
| SH-02 | Học sinh | Người thụ hưởng cuối | Sử dụng tính năng học tập | Rất Cao |

### Bên liên quan Phụ

| **ID** | **Bên liên quan** | **Vai trò** | **Trách nhiệm** | **Quan tâm** |
|--------|-------------------|-------------|-----------------|--------------|
| SH-03 | Tổ trưởng bộ môn | Người xem xét nội dung | Xác nhận đồ thị kiến thức | Cao |
| SH-04 | Hiệu trưởng | Người phê duyệt triển khai | Cho phép triển khai | Trung bình |
| SH-05 | Phòng Giáo dục Quận/Tỉnh | Người mua | Quyết định mua sắm | Trung bình |
| SH-06 | Phụ huynh | Bị ảnh hưởng gián tiếp | Theo dõi tiến độ con | Cao |

### Các Actor Hệ thống

| **ID** | **Actor** | **Mô tả** |
|--------|-----------|-----------|
| ACT-S | Học sinh | Người dùng cuối của tính năng học tập |
| ACT-T | Giáo viên | Người dùng chính của bảng điều khiển chẩn đoán |
| ACT-A | Quản trị | Cấu hình hệ thống và xuất dữ liệu |
| ACT-R | Người xem xét Nội dung | Xác nhận nội dung trước khi phát hành |
| ACT-SY | Hệ thống | Công cụ chẩn đoán tự động |

## 2.2 Bảng Bên liên quan

| **Bên liên quan** | **Vai trò** | **Trách nhiệm** | **Quan tâm** |
|-------------------|-------------|-----------------|--------------|
| SH-01 Giáo viên Toán | Người dùng chính | Sử dụng tính năng chẩn đoán; đưa ra quyết định can thiệp | Rất Cao |
| SH-02 Học sinh | Người thụ hưởng cuối | Hoàn thành lộ trình học tập được giao | Rất Cao |
| SH-03 Tổ trưởng bộ môn | Người xác nhận nội dung | Xem xét và phê duyệt đồ thị kiến thức và nội dung | Cao |
| SH-04 Hiệu trưởng | Người phê duyệt triển khai | Cho phép sử dụng tại trường | Trung bình |
| SH-05 Sở Giáo dục | Người mua | Quyết định mua sắm và mở rộng | Trung bình |
| SH-06 Phụ huynh | Bị ảnh hưởng gián tiếp | Nhận cập nhật tiến độ (tùy chọn) | Cao |
| SH-07 Tác giả Nội dung | Nhà cung cấp nội dung | Tạo và duy trì ngân hàng câu hỏi | Trung bình |
| SH-08 Đơn vị Nghiên cứu Giáo dục | Người đánh giá độc lập | Xác nhận phương pháp luận và kết quả | Trung bình |
| SH-09 Nhóm Phát triển | Nhà cung cấp giải pháp | Xây dựng và duy trì hệ thống | Rất Cao |
| SH-10 Hội đồng Đánh giá | Người đánh giá ngắn hạn | Đánh giá dự án cho cuộc thi/tài trợ | Cao |

---

# 3. Vấn đề Kinh doanh

## 3.1 Tuyên bố Vấn đề

> **Giáo viên toán trong các lớp học đông, năng lực hỗn hợp cần một cách để xác định học sinh đang thiếu kiến thức nền tảng nào và nhóm học sinh thành số lượng nhóm can thiệp có thể quản lý được trong khung thời gian ngắn — vì tín hiệu đúng/sai họ nhận được không mang thông tin chẩn đoán về nguyên nhân gốc rễ, buộc họ phải giảng dạy theo mức trung bình trong khi các học sinh yếu hơn tụt hậu thêm mỗi tuần.**

## 3.2 Vấn đề vs Nguyên nhân Gốc vs Tác động

| **Khía cạnh** | **Mô tả** | **Bằng chứng** |
|---------------|-----------|----------------|
| **Vấn đề** | Giáo viên không thể xác định nguyên nhân gốc rễ của lỗi học sinh ở cấp độ kỹ năng | **[F]** — từ Tài liệu Logic Kinh doanh VerveAI |
| **Nguyên nhân Gốc** | Công cụ đánh giá đo *kết quả*, không phải *nguyên nhân*. Không có ánh xạ từ "câu trả lời sai" đến "kiến thức nền tảng nào đang thiếu". Không có cơ chế xác định khi nào bằng chứng đủ cho kết luận. | **[F]** |
| **Tác động** | Can thiệp sai hoặc không can thiệp; tích lũy nợ kiến thức; khoảng cách rộng trong lớp; học sinh gặp khó khăn quy kết thất bại cho năng lực bẩm sinh | **[I]** |

## 3.3 Ba Thành phần Vấn đề (P-Codes)

| **Mã** | **Thành phần Vấn đề** | **Khoảng trống Liên quan** |
|--------|----------------------|---------------------------|
| **P1** | Không thể xác định nguyên nhân gốc ở cấp kỹ năng; không thể xác định khi nào bằng chứng đủ | GAP-01, GAP-02, GAP-05, GAP-06, GAP-07, GAP-08, GAP-09 |
| **P2** | Không thể nén quyết định can thiệp thành số lượng có thể quản lý; ranh giới giữa quyết định của con người/hệ thống chưa được thiết lập | GAP-03, GAP-04 |
| **P3** | Không thể phục vụ khu vực không có kết nối — nơi nhu cầu cao nhất | GAP-01, GAP-02 |

---

# 4. Mục tiêu Kinh doanh

Xem Phần 1.6 ở trên để biết bảng mục tiêu kinh doanh đầy đủ.

## 4.1 Các Chỉ số Thành công Chính

| **Chỉ số** | **Trạng thái Hiện tại** | **Mục tiêu** | **Trạng thái** |
|------------|--------------------------|--------------|----------------|
| Độ trễ phát hiện | Tuần (giữa các đợt đánh giá định kỳ) | Trong giờ lên lớp | **[TBD]** |
| Độ phân giải chẩn đoán | Cấp chương | Cấp kỹ năng | **[TBD]** |
| Nhóm can thiệp mỗi lớp | Không xác định (quy trình hiện tại không nhóm) | Có thể quản lý trong một bài học | **[TBD]** |
| Khả năng hoạt động offline | Không áp dụng | 100% chức năng cốt lõi | **[TBD]** |

---

# 5. Phạm vi

## 5.1 Trong Phạm vi

| **Mục** | **Mô tả** | **Ưu tiên** | **Trạng thái Triển khai** |
|---------|-----------|-------------|--------------------------|
| Thu thập bằng chứng với ngữ cảnh | Ghi nhận câu trả lời học sinh với thời gian, độ khó, chế độ ngữ cảnh | Bắt buộc | **[F]** — `engine/evidence/record_attempt.dart` |
| Công cụ chẩn đoán với mức độ tin cậy | Bayesian Knowledge Tracing + phân cụm nguyên nhân gốc | Bắt buộc | **[F]** — `engine/mastery/bkt.dart`, `engine/diagnose/` |
| Bảng điều khiển giáo viên với nhóm can thiệp | Nhóm theo nguyên nhân gốc, sắp xếp theo ưu tiên | Bắt buộc | **[F]** — `ui/teacher/intervention_dashboard.dart` |
| Kiến trúc ưu tiên offline | 100% offline cho các tính năng cốt lõi | Bắt buộc | **[F]** — `app/` được thiết kế ưu tiên offline |
| Đồng bộ hub cục bộ | mDNS/HTTP + USB dự phòng cho đồng bộ dữ liệu | Bắt buộc | **[F]** — `hub/`, `sync/` modules |
| Xác minh toàn vẹn nội dung | Gói nội dung được ký Ed25519 | Bắt buộc | **[F]** — `content_security/signature_verify.dart` |
| Khả năng xuất/xóa dữ liệu | Tính di động và xóa dữ liệu trường học | Bắt buộc | **[F]** — `privacy/export_delete.dart` |
| Kiểm soát quyền riêng tư | Ẩn danh, chính sách lưu giữ, thông báo vi phạm | Bắt buộc | **[F]** — `privacy/` modules |
| Đồ thị kiến thức cho phân số → tỉ lệ | Phạm vi nội dung ban đầu | Bắt buộc | **[F]** — `engine/knowledge_graph/` |
| Chọn câu hỏi (thích ứng) | Chọn câu hỏi phân biệt tốt nhất | Bắt buộc | **[F]** — `engine/item_selection/next_best_item.dart` |
| Lập kế hoạch khắc phục | Xây dựng kế hoạch khắc phục tối thiểu | Bắt buộc | **[I]** — `engine/remediation/build_plan.dart` tồn tại; logic hold-out được triển khai; tạo kế hoạch đầy đủ chưa được xác nhận |
| Phát hiện rào cản ngôn ngữ | Phát hiện nguyên nhân không phải kiến thức | Nên | **[F]** — `engine/diagnose/language_barrier_detector.dart` |
| Phát hiện nguyên nhân không phải kiến thức | Phát hiện bất cẩn, đoán mò | Nên | **[F]** — `engine/diagnose/non_knowledge_detector.dart` |
| Xử lý chuyển trường học sinh | Xử lý thay đổi lớp/trường của học sinh | Nên | **[F]** — `engine/transfer/student_transfer.dart` |

## 5.2 Ngoài Phạm vi

| **Mục** | **Lý do** |
|---------|-----------|
| Dịch vụ dựa trên đám mây | Vi phạm yêu cầu ưu tiên offline |
| Nhận dạng chữ viết tay | Quyết định OS-03 đang chờ; cần phân tích thêm |
| Phạm vi chương trình đầy đủ | MVP giới hạn ở phân số → tỉ lệ |
| Tính năng cộng tác thời gian thực | Không cần cho trường hợp sử dụng chẩn đoán cốt lõi |
| Tính năng hóa trò chơi | Không thuộc phần cốt lõi chẩn đoán |
| Giao can thiệp tự động | BR-04 — chỉ giáo viên mới có thể kích hoạt can thiệp |
| Tích hợp sổ điểm | Không thuộc MVP |

## 5.3 Ưu tiên Phát triển (Hiện tại)

| **Ưu tiên** | **Module** | **Trạng thái** |
|-------------|------------|----------------|
| **CAO NHẤT** | `web-portal/` (Cổng Giáo viên, Cổng Quản trị) | **[I]** — Đang phát triển sớm; cấu trúc Next.js cơ bản tồn tại nhưng chưa triển khai màn hình |
| Tiếp theo | `app/` (Flutter PWA) | **[F]** — Công cụ cốt lõi đã triển khai; Giao diện học sinh đang chờ |
| Sau | `inference/` (LLM Layers 1 & 3) | **[A]** — Đang chờ Test A & B |

> **Ghi chú:** `web-portal/` có tài liệu mở rộng trong `docs/02-architecture/web-portal-architecture.md` với 29 màn hình được định nghĩa, nhưng triển khai thực tế chỉ có khung Next.js cơ bản (layout, page, middleware). Tài liệu đại diện cho **thiết kế dự định**, không phải triển khai hiện tại.

---

# 6. Quy trình HIỆN TẠI

## 6.1 Quy trình Giảng dạy Hiện tại

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      QUY TRÌNH GIẢNG DẠY HIỆN TẠI                          │
│                                                                             │
│  A1: Dạy bài mới theo chương trình → Bài học chung cho cả lớp              │
│       ↓                                                                    │
│  A2: Giao bài tập về nhà đồng nhất → Bài tập giống nhau cho tất cả         │
│       ↓                                                                    │
│  A3: Học sinh làm bài tập ở nhà → Không kiểm soát được điều kiện          │
│       ↓                                                                    │
│  A4: Chữa bài mẫu trên lớp → Chỉ một số bài được kiểm tra                 │
│       ↓                                                                    │
│  A5: Đánh giá định kỳ → Tạo ra một CON SỐ (điểm) mà thôi                │
│       ↓                                                                    │
│  A6: Xem phân bố điểm lớp → Kết luận ở cấp CHƯƠNG                        │
│       ↓                                                                    │
│  A7: Nhóm học sinh để khắc phục → Nhóm theo ĐIỂM, không phải nguyên nhân  │
│       ↓                                                                    │
│  A8: Dạy lại cả chương cho nhóm "yếu" → Lãng phí thời gian vào nội dung đã biết │
│       ↓                                                                    │
│  A9: Đánh giá lại → Kết quả thường không cải thiện đáng kể                │
│       ↓                                                                    │
│  A10: Chuyển sang chương tiếp theo → Nợ kiến thức tích lũy                │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Điểm đau trong Quy trình Hiện tại

| **Bước** | **Điểm đau** | **Nguyên nhân Gốc** | **Tác động** |
|----------|--------------|--------------------|--------------|
| A1 | Tốc độ cố định không phù hợp với mức học sinh | Ràng buộc thể chế (CO-E-02) | Học sinh gặp khó khăn tụt hậu ngay |
| A2 | Không phân biệt | Không có thông tin chẩn đoán | Học sinh giỏi chán; học sinh yếu bỏ lỡ |
| A3 | Điều kiện không kiểm soát được | Bối cảnh sử dụng (CO-D-07) | Nhiễu trong tín hiệu đánh giá |
| A4 | Hầu hết bài không được kiểm tra | Lớp đông, thời gian hạn chế | Mất dữ liệu lớn |
| A5 | Điểm không có giá trị chẩn đoán | Đánh giá được thiết kế để xếp hạng, không phải chẩn đoán | **Nút thắt cổ chai cốt lõi** |
| A6 | Kết luận ở độ chi tiết sai | Không có ánh xạ câu hỏi-kiến thức | Can thiệp không đúng trọng tâm |
| A7 | Nhóm theo điểm, không phải nguyên nhân gốc | Không có thông tin nguyên nhân | Nhóm không đồng nhất |
| A8 | Dạy lại cả chương | Không biết học sinh đã thành thạo gì | Lãng phí thời gian; học sinh mất tập trung |
| A9 | Kết quả không cải thiện | Can thiệp sai | Vòng lặp không thoát |
| A10 | Nợ kiến thức tích lũy | Ràng buộc cấu trúc (CO-E-02) | Khoảng cách rộng theo thời gian |

---

# 7. Quy trình TƯƠNG LAI

## 7.1 Quy trình Tương lai Đề xuất

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      QUY TRÌNH GIẢNG DẠY TƯƠNG LAI                          │
│                                                                             │
│  B1: Dạy bài với thông tin trước về nhóm cần chú ý                         │
│       ↓                                                                    │
│  B2: Giao bài tập phân biệt theo nhóm nguyên nhân gốc → Không theo điểm    │
│       ↓                                                                    │
│  B3: Học sinh làm việc trên thiết bị; mỗi bước được ghi với ngữ cảnh      │
│       ↓                                                                    │
│  B4: LLM cục bộ trích xuất bằng chứng có cấu trúc từ bài làm              │
│       ↓                                                                    │
│  B5: Công cụ tất định tích lũy bằng chứng → Trả về một trong ba trạng thái │
│       ↓                                                                    │
│  B6: Nếu bằng chứng không đủ: chọn câu hỏi phân biệt tốt nhất            │
│       ↓                                                                    │
│  B7: Nhóm theo nguyên nhân gốc; sắp xếp theo ưu tiên; giới hạn số có thể quản lý │
│       ↓                                                                    │
│  B8: Giáo viên xem xét bằng chứng, chấp nhận/điều chỉnh/từ chối kết luận  │
│       ↓                                                                    │
│  B9: Kế hoạch khắc phục tối thiểu: loại bỏ nội dung đã thành thạo, giữ phần thiếu │
│       ↓                                                                    │
│  B10: Xác nhận thành thạo qua câu hỏi độc lập (tối đa 3 vòng)             │
│       ↓                                                                    │
│  B11: Chuyển sang chương tiếp theo với hồ sơ nợ kiến thức rõ ràng          │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Sự khác biệt Chính HIỆN TẠI vs TƯƠNG LAI

| **Chiều** | **HIỆN TẠI** | **TƯƠNG LAI** |
|-----------|--------------|---------------|
| Độ phân giải chẩn đoán | Cấp chương | Cấp kỹ năng |
| Độ trễ phát hiện | Tuần | Trong giờ lên lớp |
| Tiêu chí nhóm | Điểm | Nguyên nhân gốc |
| Cơ sở bằng chứng | Trực giác, không ghi nhận | Chuỗi bằng chứng có thể truy vết |
| Nhắm mục tiêu can thiệp | Toàn bộ chương | Chỉ phần thiếu |
| Ranh giới giáo viên-hệ thống | Không xác định | Giáo viên có quyết định cuối cùng |

---

# 8. Yêu cầu Chức năng

## 8.1 Thu thập Bằng chứng

| **ID** | **Tên** | **Mô tả** | **Actor** | **Điều kiện tiên quyết** | **Luồng Chính** | **Luồng Thay thế/Ngoại lệ** | **Kết quả Kỳ vọng** | **Ưu tiên** | **Triển khai** |
|--------|---------|-----------|-----------|--------------------------|-----------------|-----------------------------|--------------------|-------------|----------------|
| FR-001 | Ghi nhận Bằng chứng | Hệ thống ghi nhận câu trả lời học sinh với ngữ cảnh: câu hỏi, phản hồi, độ trễ, độ khó, chế độ ngữ cảnh (trên lớp/ngoài lớp) | ACT-S | Nội dung đã cài đặt và xác nhận | Học sinh trả lời → Hệ thống ghi nhận sự kiện với UUIDv7, dấu thời gian logic, trọng số tin cậy | Nếu offline: xếp hàng để đồng bộ sau | Bản ghi bằng chứng hoàn chỉnh trong nhật ký chỉ thêm | Bắt buộc | **[F]** `engine/evidence/record_attempt.dart` |
| FR-002 | Tích lũy Bằng chứng | Hệ thống tích lũy bằng chứng qua các phiên và ngày | ACT-SY | Tồn tại bản ghi bằng chứng | Hệ thống lấy tất cả bằng chứng cho cặp (học sinh, kỹ năng) | Nếu học sinh chuyển trường: đánh dấu gián đoạn | Danh sách bằng chứng với ngữ cảnh | Bắt buộc | **[F]** `engine/evidence/` |
| FR-003 | Phát hiện Không-phải-Kiến thức | Hệ thống xác định mẫu bằng chứng gợi ý nguyên nhân không phải kiến thức (bất cẩn, đoán mò, rào cản ngôn ngữ) | ACT-SY | Tồn tại bằng chứng | Hệ thống phân tích mẫu phản hồi, độ trễ, độ phức tạp từ ngữ | Đánh dấu để giáo viên xem xét; không kết luận nguyên nhân kiến thức | Mẫu được đánh dấu hoặc trung tính | Bắt buộc | **[F]** `engine/diagnose/non_knowledge_detector.dart`, `language_barrier_detector.dart` |

## 8.2 Công cụ Chẩn đoán (BKT + Từ chối)

| **ID** | **Tên** | **Mô tả** | **Actor** | **Điều kiện tiên quyết** | **Luồng Chính** | **Luồng Thay thế/Ngoại lệ** | **Kết quả Kỳ vọng** | **Ưu tiên** | **Triển khai** |
|--------|---------|-----------|-----------|--------------------------|-----------------|-----------------------------|--------------------|-------------|----------------|
| FR-004 | Tính toán Thành thạo (BKT) | Bayesian Knowledge Tracing tính xác suất thành thạo (pKnown) cho mỗi cặp (học sinh, kỹ năng) | ACT-SY | Tồn tại đồ thị kiến thức đã xác nhận; tồn tại bằng chứng | Hệ thống áp dụng cập nhật Bayes với 4 tham số const: P_L0=0.10, P_T=0.20, P_G=0.20, P_S=0.10 | Nếu không có bằng chứng: trả về pKnown ban đầu = P_L0 | Số pKnown với tính minh bạch | Bắt buộc | **[F]** `engine/mastery/bkt.dart` |
| FR-005 | Xác định Nguyên nhân Gốc | Từ bằng chứng tích lũy, xác định khoảng trống kiến thức nguyên nhân gốc có khả năng nhất | ACT-SY | Tồn tại đồ thị kiến thức đã xác nhận; tồn tại bằng chứng | Hệ thống xác định các kỹ năng nền tảng liên quan → Đánh giá bằng chứng cho mỗi → Tính tin cậy → Trả về nguyên nhân gốc hoặc từ chối | Nếu tin cậy dưới ngưỡng: trả về "cần thêm bằng chứng" | Một trong: ID nguyên nhân gốc, từ chối, hoặc "đã thành thạo" | Bắt buộc | **[F]** `engine/diagnose/hypothesis_ranking.dart` |
| FR-006 | Từ chối khi Không chắc chắn | Nếu bằng chứng không đủ, hệ thống nêu rõ không thể kết luận | ACT-SY | Tồn tại bằng chứng nhưng dưới ngưỡng | Hệ thống trả về trạng thái từ chối với lý do | Nếu học sinh bỏ cuộc: giữ trạng thái trước | Từ chối rõ ràng, không kết luận sai | Bắt buộc | **[F]** `engine/diagnose/abstention.dart` |

## 8.3 Chọn Câu hỏi

| **ID** | **Tên** | **Mô tả** | **Actor** | **Điều kiện tiên quyết** | **Luồng Chính** | **Luồng Thay thế/Ngoại lệ** | **Kết quả Kỳ vọng** | **Ưu tiên** | **Triển khai** |
|--------|---------|-----------|-----------|--------------------------|-----------------|-----------------------------|--------------------|-------------|----------------|
| FR-007 | Chọn Câu hỏi Phân biệt | Khi bằng chứng không đủ, chọn câu hỏi phân biệt tốt nhất giữa các giả thuyết cạnh tranh | ACT-SY | Tồn tại nhiều giả thuyết; có ngân hàng câu hỏi | Hệ thống xác định đặc trưng phân biệt → Chọn câu hỏi tách giả thuyết tốt nhất | Nếu không có câu hỏi phân biệt: từ chối | Câu hỏi đã chọn với lý do | Bắt buộc | **[F]** `engine/item_selection/next_best_item.dart` |
| FR-008 | Theo dõi Câu hỏi Gần đây | Hệ thống theo dõi câu hỏi học sinh đã thấy gần đây để tránh lặp lại | ACT-SY | Học sinh đã thử các câu hỏi | Hệ thống duy trì recent_item_tracker với cửa sổ có thể cấu hình | Nếu lịch sử trống: trả về trống | Danh sách ID câu hỏi gần đây | Bắt buộc | **[F]** `engine/item_selection/recent_item_tracker.dart` |
| FR-009 | Giảm Gánh nặng Đánh giá | Giới hạn số câu hỏi học sinh phải hoàn thành trước khi nhận hỗ trợ | ACT-SY | Học sinh đang đánh giá | Hệ thống ưu tiên câu hỏi thông tin cao | Nếu học sinh bỏ cuộc: không suy luận từ chưa hoàn thành | Số câu hỏi giảm so với chọn ngẫu nhiên | Bắt buộc | **[F]** `engine/item_selection/next_best_item.dart` |

## 8.4 Hỗ trợ Khắc phục

| **ID** | **Tên** | **Mô tả** | **Actor** | **Điều kiện tiên quyết** | **Luồng Chính** | **Luồng Thay thế/Ngoại lệ** | **Kết quả Kỳ vọng** | **Ưu tiên** | **Triển khai** |
|--------|---------|-----------|-----------|--------------------------|-----------------|-----------------------------|--------------------|-------------|----------------|
| FR-010 | Xây dựng Kế hoạch Khắc phục Tối thiểu | Tạo kế hoạch khắc phục chỉ bao gồm các kỹ năng thiếu, loại trừ nội dung đã thành thạo | ACT-SY | Đã xác định nguyên nhân gốc | Hệ thống xác định kỹ năng thiếu → Loại bỏ tiên quyết đã thành thạo → Tạo đường dẫn tối thiểu | Nếu đường dẫn quá dài: áp dụng giới hạn; chia thành các giai đoạn | Kế hoạch loại trừ nội dung đã thành thạo | Bắt buộc | **[F]** `engine/remediation/build_plan.dart` |
| FR-011 | Xác minh Hold-Out | Xác nhận thành thạo sử dụng câu hỏi khác với luyện tập (câu hỏi xác minh phải khác với luyện tập) | ACT-SY | Đã hoàn thành khắc phục | Hệ thống chọn câu hỏi xác minh độc lập qua hold_out_check | Nếu thành thạo không xác nhận sau các vòng: chuyển lên giáo viên | Xác nhận hoặc chuyển lên | Bắt buộc | **[F]** `engine/remediation/hold_out_check.dart` |
| FR-012 | Duy trì Truy cập Cấp lớp | Học sinh phải vẫn truy cập nội dung lớp hiện tại trong quá trình khắc phục | ACT-SY | Đang khắc phục | Hệ thống đảm bảo khắc phục không chặn truy cập bài học hiện tại | Nếu xung đột: ưu tiên bài học hiện tại | Cả khắc phục và nội dung lớp đều truy cập được | Bắt buộc | **[I]** — Thiết kế logic tồn tại; cần triển khai đầy đủ và UI |
| FR-013 | Nội dung Mở rộng cho Học sinh Giỏi | Cung cấp nội dung mở rộng khi học sinh đã thành thạo tiên quyết | ACT-SY | Học sinh đã thành thạo tất cả tiên quyết | Hệ thống đề xuất phần mở rộng khi câu hỏi cấp hiện tại sai | — | Nội dung mở rộng được đề xuất | Nên | **[I]** — Thiết kế logic tồn tại; cần nội dung và UI |

## 8.5 Hỗ trợ Quyết định Giáo viên

| **ID** | **Tên** | **Mô tả** | **Actor** | **Điều kiện tiên quyết** | **Luồng Chính** | **Luồng Thay thế/Ngoại lệ** | **Kết quả Kỳ vọng** | **Ưu tiên** | **Triển khai** |
|--------|---------|-----------|-----------|--------------------------|-----------------|-----------------------------|--------------------|-------------|----------------|
| FR-014 | Trình bày Nhóm Can thiệp | Tổng hợp chẩn đoán cá nhân thành nhóm can thiệp cấp lớp | ACT-SY | Tồn tại nhiều chẩn đoán học sinh | Hệ thống nhóm học sinh theo nguyên nhân gốc chia sẻ → Sắp xếp theo ưu tiên (quy mô → mức độ nghiêm trọng → bảng chữ cái) → Giới hạn số có thể quản lý | Nếu quá nhiều nhóm: gộp các nguyên nhân tương tự | Danh sách đã nhóm với tóm tắt bằng chứng | Bắt buộc | **[F]** `engine/grouping/cluster_by_root_cause.dart` |
| FR-015 | Hiển thị Chuỗi Bằng chứng | Hiển thị chuỗi bằng chứng dẫn đến mỗi kết luận | ACT-T | Tồn tại kết luận | Giáo viên yêu cầu bằng chứng → Hệ thống hiển thị tất cả mục bằng chứng với dấu thời gian | Nếu giáo viên muốn thêm: hiển thị chi tiết đầy đủ | Trình bày bằng chứng minh bạch | Bắt buộc | **[I]** — `ui/teacher/intervention_dashboard.dart` stub tồn tại; UI chuỗi bằng chứng đầy đủ chưa triển khai |
| FR-016 | Ghi đè của Giáo viên | Giáo viên có thể chấp nhận, từ chối hoặc điều chỉnh bất kỳ kết luận hệ thống nào | ACT-T | Tồn tại kết luận | Giáo viên không đồng ý → Ghi đè với lý do → Hệ thống ghi nhận ghi đè; bản gốc được bảo tồn để kiểm toán | Nếu giáo viên và hệ thống xung đột: quyết định giáo viên thắng | Ghi đè được ghi nhận; bản gốc được bảo tồn | Bắt buộc | **[F]** `hub/merge.dart` với ưu tiên chú thích giáo viên |
| FR-017 | Xem Trạng thái Lớp Offline | Giáo viên có thể xem thông tin lớp tổng hợp mà không cần kết nối | ACT-T | Tồn tại bằng chứng trên hub | Giáo viên yêu cầu xem lớp → Hub phục vụ từ bộ nhớ cục bộ | Nếu hub không khả dụng: hiển thị dữ liệu đã lưu hoặc một phần | Xem lớp hoàn chỉnh | Bắt buộc | **[I]** — `hub/server.dart` triển khai API; các thành phần UI trong `ui/teacher/` một phần |
| FR-018 | Thêm Ghi chú Cá nhân | Giáo viên có thể thêm ghi chú cá nhân hoặc mục tùy chỉnh | ACT-T | Tồn tại kết luận | Giáo viên thêm ghi chú → Hệ thống liên kết với học sinh/kết luận | — | Ghi chú được đính kèm bản ghi | Nên | **[I]** — `hub/merge.dart` hỗ trợ chú thích giáo viên; UI đầy đủ chưa triển khai |
| FR-019 | Báo cáo In được | Giáo viên có thể xuất báo cáo PDF có thể in | ACT-T | Tồn tại dữ liệu | Giáo viên yêu cầu xuất → Hệ thống tạo PDF trực tiếp từ ứng dụng | Nếu tạo thất bại: hiển thị lỗi | Tệp PDF được tạo | Nên | **[I]** — `ui/teacher/printable_report.dart` stub tồn tại; tạo PDF chưa triển khai |

## 8.6 Quản lý Nội dung và Dữ liệu

| **ID** | **Tên** | **Mô tả** | **Actor** | **Điều kiện tiên quyết** | **Luồng Chính** | **Luồng Thay thế/Ngoại lệ** | **Kết quả Kỳ vọng** | **Ưu tiên** | **Triển khai** |
|--------|---------|-----------|-----------|--------------------------|-----------------|-----------------------------|--------------------|-------------|----------------|
| FR-020 | Xem xét Nội dung trước Phát hành | Nội dung phải được chuyên gia bộ môn xem xét trước khi đến học sinh | ACT-R | Tồn tại nội dung | Người xem xét truy cập hàng đợi → Xem xét tính đúng đắn, phù hợp lứa tuổi → Ký nếu phê duyệt | Nếu từ chối: trả về để sửa | Gói nội dung đã ký | Bắt buộc | **[F]** `content-pipeline/` với module xem xét |
| FR-021 | Xuất và Xóa Dữ liệu | Trường học có thể xuất tất cả dữ liệu và yêu cầu xóa | ACT-A | Tồn tại dữ liệu trường | Quản trị yêu cầu xuất → Hệ thống tạo lưu trữ → Quản trị xác nhận xóa | Nếu yêu cầu xóa: ngay hoặc theo lịch | Xuất dữ liệu hoặc xóa an toàn | Bắt buộc | **[I]** — `privacy/export_delete.dart` tồn tại; UI chưa tích hợp đầy đủ |
| FR-022 | Kiểm tra Hồ sơ trên Thiết bị Chia sẻ | Trên thiết bị chia sẻ, học sinh chỉ thấy dữ liệu của mình | ACT-S | Kịch bản thiết bị chia sẻ | Học sinh mở ứng dụng → Xác nhận hồ sơ → Hệ thống thực thi cô lập dữ liệu | Nếu hồ sơ sai: yêu cầu chuyển rõ ràng | Cô lập dữ liệu được thực thi | Nên | **[I]** — `auth/profile_gate.dart` tồn tại; `ui/teacher/profile_switcher.dart` một phần |
| FR-023 | Ẩn danh Dữ liệu trước Xuất | Dữ liệu nhận dạng học sinh phải được ẩn danh trước khi rời hub | ACT-SY | Tồn tại dữ liệu để xuất | Hệ thống áp dụng ẩn danh HMAC tại hub trước xuất | Nếu mất khóa hub: ẩn danh không thể đảo ngược | Chỉ dữ liệu ẩn danh | Bắt buộc | **[I]** — `privacy/anonymize.dart` tồn tại; tích hợp với luồng xuất một phần |
| FR-024 | Tính lại Kết luận | Khi phiên bản mô hình/logic thay đổi, kết luận có thể được tính lại từ bằng chứng gốc | ACT-SY | Tồn tại phiên bản mới; bằng chứng gốc còn nguyên | Hệ thống tính lại chẩn đoán sử dụng phiên bản công cụ mới | Nếu bằng chứng bị hỏng: đánh dấu để xem xét | Kết luận tính lại với thẻ phiên bản | Bắt buộc | **[I]** — `engine/versioning/recompute.dart` stub tồn tại; chưa kiểm tra đầu-cuối |
| FR-025 | Chuyển trường Học sinh | Xử lý học sinh chuyển lớp/trường trong khi bảo tồn bằng chứng | ACT-SY | Tồn tại yêu cầu chuyển trường | Hệ thống tạo sự kiện chuyển, xuất lưu trữ mã hóa | Nếu điểm đến offline: xếp hàng để đồng bộ | Bằng chứng được chuyển với trường mới | Nên | **[I]** — `engine/transfer/student_transfer.dart` tồn tại; luồng đầu-cuối chưa kiểm tra |

---

# 9. Yêu cầu Phi Chức năng

## 9.1 Hiệu năng

| **ID** | **Loại** | **Yêu cầu** | **Đo lường** | **Bằng chứng** |
|--------|----------|-------------|--------------|----------------|
| NFR-001 | Hiệu năng | Chức năng cốt lõi hoạt động không cần kết nối | 100% offline cho các tính năng cốt lõi | **[F]** — nguyên tắc thiết kế cốt lõi |
| NFR-002 | Hiệu năng | Kích thước ứng dụng trong giới hạn hợp lý | **MỤC TIÊU:** ~1 GB tổng (nội dung + mô hình) | **[TBD]** — ngưỡng chấp nhận; chưa xác nhận trên thiết bị mục tiêu |
| NFR-003 | Hiệu năng | Kết quả chẩn đoán có sẵn trong nhịp bài học | **MỤC TIÊU:** < 2 giây tại p95 | **[TBD]** — ngưỡng chấp nhận; chưa xác nhận thực nghiệm |
| NFR-004 | Hiệu năng | Hoạt động trên thiết bị phổ thông cấu hình thấp tại khu vực triển khai | **MỤC TIÊU:** thông số thiết bị cụ thể TBD | **[TBD]** — ngưỡng chấp nhận; đang chờ khảo sát thiết bị OQ-07 |

## 9.2 Khả năng mở rộng

| **ID** | **Loại** | **Yêu cầu** | **Đo lường** | **Bằng chứng** |
|--------|----------|-------------|--------------|----------------|
| NFR-005 | Khả năng mở rộng | Hỗ trợ 50 học sinh mỗi lớp, 500 thiết bị mỗi trường | **MỤC TIÊU:** 50 học sinh/lớp, 500 thiết bị/trường | **[TBD]** — giả định thiết kế; chưa kiểm tra tải |

## 9.3 Khả năng sẵn sàng

| **ID** | **Loại** | **Yêu cầu** | **Đo lường** | **Bằng chứng** |
|--------|----------|-------------|--------------|----------------|
| NFR-006 | Khả năng sẵn sàng | Hoạt động liên tục không cần internet | 100% offline | **[F]** — yêu cầu thiết kế |

## 9.4 Bảo mật

| **ID** | **Loại** | **Yêu cầu** | **Đo lường** | **Bằng chứng** |
|--------|----------|-------------|--------------|----------------|
| NFR-007 | Bảo mật | Không có nội dung chưa xác nhận đến học sinh | Chỉ gói đã ký | **[F]** — yêu cầu ký Ed25519 |
| NFR-008 | Bảo mật | Dữ liệu nhận dạng không bao giờ rời khuôn viên trường | Ẩn danh trước xuất | **[F]** — kiến trúc quyền riêng tư |
| NFR-009 | Bảo mật | Kết quả không được sử dụng cho quyết định ảnh hưởng quyền học sinh | Ràng buộc chính sách | **[F]** — BR-12 |
| NFR-010 | Bảo mật | Phát hiện và thông báo vi phạm dữ liệu | Tồn tại quy trình ghi nhận; **MỤC TIÊU:** không có vi phạm không phát hiện | **[I]** — `privacy/breach_notify.dart` stub tồn tại; quy trình đầy đủ chưa triển khai hoặc kiểm tra |
| NFR-011 | Bảo mật | Mã hóa kênh cho đồng bộ hub | Mã hóa libsodium | **[F]** — `hub/crypto.dart` |

## 9.5 Độ tin cậy

| **ID** | **Loại** | **Yêu cầu** | **Đo lường** | **Bằng chứng** |
|--------|----------|-------------|--------------|----------------|
| NFR-012 | Độ tin cậy | Không mất dữ liệu trong đồng bộ, ngay cả khi gián đoạn | Không mất dữ liệu | **[F]** — thiết kế chỉ thêm |
| NFR-013 | Độ tin cậy | Quyết định tất định: cùng bằng chứng + cùng phiên bản = cùng kết quả | Tính lại idempotent | **[F]** — yêu cầu TS-07, `engine/mastery/bkt.dart` |
| NFR-014 | Độ tin cậy | Tất cả kết luận có thể tính lại từ bằng chứng gốc | Khả năng kiểm toán | **[F]** — nhật ký sự kiện chỉ thêm |
| NFR-015 | Độ tin cậy | Toàn vẹn dữ liệu được xác minh khi khởi động | Xác nhận checksum | **[F]** — `storage/integrity_check.dart` |

## 9.6 Khả năng bảo trì

| **ID** | **Loại** | **Yêu cầu** | **Đo lường** | **Bằng chứng** |
|--------|----------|-------------|--------------|----------------|
| NFR-016 | Khả năng bảo trì | Không cần nhân viên kỹ thuật tại trường để vận hành | **MỤC TIÊU:** triển khai tự phục vụ khả thi | **[TBD]** — tiêu chí chấp nhận; chưa xác nhận với giáo viên |
| NFR-017 | Khả năng bảo trì | Dự phòng và khôi phục hub khi thiết bị giáo viên thất bại | **MỤC TIÊU:** tồn tại khả năng khôi phục; **CHẤP NHẬN:** dự phòng xác minh khôi phục được | **[I]** — `hub/backup.dart` tồn tại; quy trình khôi phục chưa triển khai hoặc kiểm tra đầy đủ |

## 9.7 Khả năng quan sát

| **ID** | **Loại** | **Yêu cầu** | **Đo lường** | **Bằng chứng** |
|--------|----------|-------------|--------------|----------------|
| NFR-018 | Khả năng quan sát | Giáo viên có thể giải thích lý luận hệ thống bằng thuật ngữ chuyên môn | **MỤC TIÊU:** giải thích dễ hiểu cho giáo viên không chuyên kỹ thuật | **[TBD]** — tiêu chí chấp nhận; chưa xác nhận với giáo viên |

## 9.8 Khả năng sử dụng

| **ID** | **Loại** | **Yêu cầu** | **Đo lường** | **Bằng chứng** |
|--------|----------|-------------|--------------|----------------|
| NFR-019 | Khả năng sử dụng | Không hiển thị nhãn năng lực cho học sinh hoặc phụ huynh | Hiển thị không có nhãn | **[F]** — yêu cầu BR-13 |

---

# 10. User Stories

## Epic 1: Thu thập Bằng chứng

| **ID** | **User Story** | **Ưu tiên** | **Tiêu chí Chấp nhận** |
|--------|----------------|--------------|------------------------|
| US-001 | Là một **học sinh**, tôi muốn kết quả bài làm của tôi được ghi nhận đầy đủ, để hệ thống hiểu tôi đang gặp khó khăn ở đâu | Bắt buộc | Cho trước: học sinh hoàn thành một câu hỏi; Khi: hệ thống ghi nhận phản hồi; Sau đó: tồn tại bản ghi bằng chứng hoàn chỉnh với ngữ cảnh |
| US-002 | Là một **giáo viên**, tôi muốn mọi lần làm bài đều để lại dấu vết, để tôi không mất thông tin như khi chỉ có thể kiểm tra một số bài | Bắt buộc | Cho trước: học sinh hoàn thành bài làm; Khi: bằng chứng được ghi nhận; Sau đó: lịch sử hoàn chỉnh được bảo tồn ngay cả khi giáo viên chỉ kiểm tra một phần |

## Epic 2: Chẩn đoán

| **ID** | **User Story** | **Ưu tiên** | **Tiêu chí Chấp nhận** |
|--------|----------------|--------------|------------------------|
| US-003 | Là một **giáo viên**, tôi muốn biết tại sao học sinh này sai, không chỉ là sai, để tôi không phải đoán | Bắt buộc | Cho trước: học sinh trả lời sai; Khi: hệ thống chẩn đoán; Sau đó: trả về khoảng trống kiến thức nguyên nhân gốc với tin cậy |
| US-004 | Là một **giáo viên**, tôi muốn hệ thống nêu rõ khi bằng chứng không đủ, để tôi không hành động dựa trên kết luận không có hỗ trợ | Bắt buộc | Cho trước: bằng chứng dưới ngưỡng; Khi: hệ thống chẩn đoán; Sau đó: trả về trạng thái từ chối, không phải kết luận sai |
| US-005 | Là một **học sinh**, tôi muốn không phải trả lời quá nhiều câu hỏi trước khi được hỗ trợ, để tôi không nản lòng | Bắt buộc | Cho trước: học sinh cần chẩn đoán; Khi: hệ thống chọn câu hỏi; Sau đó: chọn câu hỏi thông tin cao nhất trước |
| US-006 | Là một **giáo viên**, tôi muốn hệ thống phân biệt bất cẩn với khoảng trống kiến thức, để tôi không xếp nhầm học sinh vào nhóm khắc phục | Nên | Cho trước: mẫu phản hồi gợi ý nguyên nhân không phải kiến thức; Khi: hệ thống chẩn đoán; Sau đó: đánh dấu nguyên nhân không phải kiến thức, không kết luận khoảng trống kiến thức |

## Epic 3: Hỗ trợ Học sinh

| **ID** | **User Story** | **Ưu tiên** | **Tiêu chí Chấp nhận** |
|--------|----------------|--------------|------------------------|
| US-007 | Là một **học sinh**, tôi muốn chỉ ôn lại những gì tôi thực sự không biết, để tôi không lãng phí thời gian vào nội dung đã thành thạo | Bắt buộc | Cho trước: nguyên nhân gốc đã xác định; Khi: hệ thống xây dựng kế hoạch; Sau đó: kế hoạch loại trừ các kỹ năng đã thành thạo |
| US-008 | Là một **học sinh**, tôi muốn vẫn truy cập nội dung lớp hiện tại, để tôi không bị tụt hậu trong khi đang khắc phục | Bắt buộc | Cho trước: học sinh đang khắc phục; Khi: học sinh làm việc; Sau đó: nội dung bài học hiện tại vẫn truy cập được |
| US-009 | Là một **giáo viên**, tôi muốn biết học sinh thực sự hiểu hay chỉ nhìn thấy đáp án, để tôi tin kết quả | Bắt buộc | Cho trước: học sinh hoàn thành luyện tập; Khi: hệ thống xác minh; Sau đó: sử dụng câu hỏi khác với luyện tập |
| US-010 | Là một **học sinh giỏi**, tôi muốn nhận nội dung mở rộng khi đã thành thạo kiến thức cơ bản, để tôi không ngồi qua tài liệu dễ | Nên | Cho trước: học sinh đã thành thạo tất cả tiên quyết; Khi: học sinh trả lời sai câu hỏi cấp hiện tại; Sau đó: đề xuất phần mở rộng, không phải khắc phục |

## Epic 4: Hỗ trợ Quyết định Giáo viên

| **ID** | **User Story** | **Ưu tiên** | **Tiêu chí Chấp nhận** |
|--------|----------------|--------------|------------------------|
| US-011 | Là một **giáo viên**, tôi muốn biết tôi có bao nhiêu nhóm can thiệp và ưu tiên nào trước, để tôi sử dụng 45 phút hiệu quả | Bắt buộc | Cho trước: tồn tại bằng chứng lớp; Khi: giáo viên xem bảng điều khiển; Sau đó: thấy các can thiệp được nhóm đã sắp xếp theo ưu tiên, giới hạn số có thể quản lý |
| US-012 | Là một **giáo viên**, tôi muốn thấy chuỗi bằng chứng cho mỗi kết luận, để tôi có thể xác minh thay vì tin mù quáng | Bắt buộc | Cho trước: hệ thống trình bày một kết luận; Khi: giáo viên yêu cầu bằng chứng; Sau đó: hiển thị chuỗi bằng chứng đầy đủ |
| US-013 | Là một **giáo viên**, tôi muốn có thể từ chối hoặc điều chỉnh kết luận khi tôi biết rõ hơn, để tôi giữ quyền ra quyết định chuyên môn | Bắt buộc | Cho trước: kết luận hệ thống; Khi: giáo viên không đồng ý; Sau đó: ghi đè của giáo viên được ghi nhận, bản gốc được bảo tồn |
| US-014 | Là một **giáo viên**, tôi muốn thêm ghi chú hoặc mục tùy chỉnh của riêng tôi, để tôi kết hợp những gì hệ thống không biết | Nên | Cho trước: tồn tại kết luận hệ thống; Khi: giáo viên thêm ghi chú; Sau đó: ghi chú được liên kết với bản ghi |
| US-015 | Là một **giáo viên**, tôi muốn đảm bảo dữ liệu này sẽ không được dùng để đánh giá tôi, để tôi sử dụng tự do | Bắt buộc | Cho trước: hệ thống thu thập bằng chứng; Khi: giáo viên sử dụng hệ thống; Sau đó: dữ liệu không thể dùng để đánh giá giáo viên |

## Epic 5: Hoạt động Offline

| **ID** | **User Story** | **Ưu tiên** | **Tiêu chí Chấp nhận** |
|--------|----------------|--------------|------------------------|
| US-016 | Là một **học sinh**, tôi muốn tiếp tục học khi không có mạng, để việc học của tôi không phụ thuộc vào hạ tầng nơi tôi sống | Bắt buộc | Cho trước: không có kết nối; Khi: học sinh làm việc; Sau đó: quy trình đầy đủ khả dụng offline |
| US-017 | Là một **giáo viên**, tôi muốn xem trạng thái lớp ngay trong lớp học mà không cần mạng, để tôi đưa ra quyết định trong giờ chứ không phải sau | Bắt buộc | Cho trước: không có kết nối; Khi: giáo viên mở bảng điều khiển; Sau đó: thông tin lớp hiển thị ngay |
| US-018 | Là một **giáo viên**, tôi muốn dữ liệu đồng bộ tự động khi kết nối trở lại mà không mất, để tôi không phải làm gì thêm | Bắt buộc | Cho trước: đồng bộ bị gián đoạn; Khi: kết nối khôi phục; Sau đó: không mất dữ liệu, không trùng lặp |

## Epic 6: Quản trị Nội dung và Dữ liệu

| **ID** | **User Story** | **Ưu tiên** | **Tiêu chí Chấp nhận** |
|--------|----------------|--------------|------------------------|
| US-019 | Là một **người xem xét nội dung**, tôi muốn phê duyệt nội dung trước khi nó đến học sinh, để tôi chịu trách nhiệm cho những gì tôi ký | Bắt buộc | Cho trước: tồn tại nội dung; Khi: người xem xét phê duyệt; Sau đó: chữ ký Ed25519 được áp dụng, nội dung được phát hành |
| US-020 | Là một **quản trị trường**, tôi muốn xuất và xóa dữ liệu trường của tôi, để tôi kiểm soát rủi ro quyền riêng tư | Bắt buộc | Cho trước: tồn tại dữ liệu trường; Khi: quản trị yêu cầu xuất/xóa; Sau đó: tạo lưu trữ đầy đủ, dữ liệu được xóa an toàn |
| US-021 | Là một **học sinh** dùng chung thiết bị với người khác, tôi muốn kết quả của tôi không hiển thị cho người dùng tiếp theo, để tôi không bị xấu hổ | Nên | Cho trước: thiết bị chia sẻ; Khi: học sinh mở ứng dụng; Sau đó: chỉ hiển thị dữ liệu của học sinh đó |

---

# 11. Use Cases

## 11.1 Tóm tắt Use Cases

| **Loại** | **UC ID** | **Use Case** | **Actor Chính** | **Kích hoạt** | **Hành vi Tự động** | **Ưu tiên** |
|---------|-----------|--------------|-----------------|---------------|--------------------|--------------|
| E1 — Bằng chứng | UC-001 | Ghi nhận phản hồi học sinh | Học sinh (ACT-S) | Học sinh nộp câu trả lời | Hệ thống ghi nhận sự kiện với UUIDv7 và dấu thời gian logic | Bắt buộc |
| E1 — Bằng chứng | UC-002 | Tích lũy bằng chứng qua các phiên | Hệ thống (tự động) | Bằng chứng mới được ghi nhận | Hệ thống tổng hợp bằng chứng cho cặp (học sinh, kỹ năng) | Bắt buộc |
| E2 — Chẩn đoán | UC-003 | Tính toán thành thạo với BKT | Hệ thống (tự động) | Bằng chứng được cập nhật | Hệ thống áp dụng cập nhật Bayes với tham số const | Bắt buộc |
| E2 — Chẩn đoán | UC-004 | Xác định nguyên nhân gốc của lỗi | Hệ thống (tự động) | Bằng chứng tích lũy | Hệ thống đánh giá giả thuyết, tính tin cậy | Bắt buộc |
| E2 — Chẩn đoán | UC-005 | Từ chối khi bằng chứng không đủ | Hệ thống (tự động) | Tin cậy dưới ngưỡng | Hệ thống trả về trạng thái từ chối rõ ràng | Bắt buộc |
| E2 — Chẩn đoán | UC-006 | Chọn câu hỏi phân biệt | Hệ thống (tự động) | Từ chối hoặc đánh giá mới | Hệ thống chọn câu hỏi thông tin cao nhất | Bắt buộc |
| E2 — Chẩn đoán | UC-007 | Xác định nguyên nhân không phải kiến thức | Hệ thống (tự động) | Mẫu bằng chứng được phân tích | Hệ thống đánh dấu bất cẩn, đoán mò, rào cản ngôn ngữ | Bắt buộc |
| E3 — Hỗ trợ | UC-008 | Xây dựng kế hoạch khắc phục tối thiểu | Hệ thống (tự động) | Nguyên nhân gốc được xác định | Hệ thống loại trừ kỹ năng đã thành thạo, tạo đường dẫn tối thiểu | Bắt buộc |
| E3 — Hỗ trợ | UC-009 | Xác minh thành thạo với câu hỏi hold-out | Hệ thống (tự động) | Khắc phục hoàn thành | Hệ thống chọn câu hỏi xác minh độc lập | Bắt buộc |
| E3 — Hỗ trợ | UC-010 | Chuyển sang nội dung mở rộng khi đã thành thạo | Hệ thống (tự động) | Học sinh đã thành thạo tiên quyết | Hệ thống đề xuất nội dung mở rộng | Nên |
| E4 — Giáo viên | UC-011 | Trình bày nhóm can thiệp theo ưu tiên | Giáo viên (ACT-T) | Giáo viên yêu cầu xem | Hệ thống tổng hợp chẩn đoán, nhóm theo nguyên nhân gốc | Bắt buộc |
| E4 — Giáo viên | UC-012 | Giáo viên xem xét bằng chứng và quyết định | Giáo viên (ACT-T) | Giáo viên xem kết luận | — | Bắt buộc |
| E4 — Giáo viên | UC-013 | Giáo viên ghi đè hoặc điều chỉnh kết luận | Giáo viên (ACT-T) | Giáo viên không đồng ý | Hệ thống ghi nhận ghi đè, bảo tồn bản gốc | Bắt buộc |
| E4 — Giáo viên | UC-014 | Giáo viên thêm ghi chú cá nhân | Giáo viên (ACT-T) | Giáo viên thêm ghi chú | Hệ thống liên kết ghi chú với bản ghi | Nên |
| E4 — Giáo viên | UC-015 | Xuất báo cáo in được | Giáo viên (ACT-T) | Giáo viên yêu cầu xuất | Hệ thống tạo báo cáo PDF | Nên |
| E5 — Offline | UC-016 | Tổng hợp bằng chứng lớp khi offline | Hệ thống (tự động) | Bằng chứng được ghi nhận trên thiết bị | Hub tổng hợp không phụ thuộc đám mây | Bắt buộc |
| E5 — Offline | UC-017 | Đồng bộ dữ liệu khi kết nối trở lại | Hệ thống (tự động) | Có kết nối | Hệ thống hợp nhất bằng chứng, giải quyết xung đột | Bắt buộc |
| E5 — Offline | UC-018 | Cài đặt và cập nhật nội dung theo phiên bản | Hệ thống (tự động) | Có gói mới | Hệ thống xác minh chữ ký, cài đặt gói | Bắt buộc |
| E6 — Quản trị | UC-019 | Xem xét và phê duyệt nội dung | Người xem xét Nội dung (ACT-R) | Nội dung mới đang chờ | — | Bắt buộc |
| E6 — Quản trị | UC-020 | Tính lại kết luận khi mô hình cập nhật | Hệ thống (tự động) | Phiên bản công cụ mới | Hệ thống tính lại từ bằng chứng gốc | Bắt buộc |
| E6 — Quản trị | UC-021 | Xuất và xóa dữ liệu trường | Quản trị (ACT-A) | Quản trị yêu cầu hành động | Hệ thống ẩn danh và xuất | Bắt buộc |
| E6 — Quản trị | UC-022 | Chuyển hồ sơ học sinh trên thiết bị chia sẻ | Học sinh (ACT-S) | Học sinh mở ứng dụng | Hệ thống thực thi cô lập dữ liệu | Nên |
| E6 — Quản trị | UC-023 | Ẩn danh dữ liệu trước xuất | Hệ thống (tự động) | Xuất được khởi tạo | Hệ thống áp dụng ẩn danh HMAC tại hub | Bắt buộc |
| E6 — Quản trị | UC-024 | Xử lý chuyển trường học sinh | Hệ thống (tự động) | Yêu cầu chuyển trường | Hệ thống tạo sự kiện chuyển, xuất lưu trữ | Nên |

## 11.2 Ánh xạ Actor

| **Actor** | **Use Cases (Chính)** | **Use Cases (Tự động)** |
|-----------|----------------------|------------------------|
| ACT-S (Học sinh) | UC-001, UC-022 | UC-002 |
| ACT-T (Giáo viên) | UC-011, UC-012, UC-013, UC-014, UC-015 | — |
| ACT-SY (Hệ thống) | — | UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-016, UC-017, UC-018, UC-020, UC-023, UC-024 |
| ACT-R (Người xem xét) | UC-019 | — |
| ACT-A (Quản trị) | UC-021 | — |

---

# 12. Quy tắc Kinh doanh

## 12.1 Quy tắc Chẩn đoán

| **ID** | **Quy tắc** | **Bằng chứng** |
|--------|-------------|----------------|
| BR-001 | Khi tin cậy bằng chứng dưới ngưỡng, hệ thống KHÔNG ĐƯỢC kết luận nguyên nhân gốc; phải trả về trạng thái từ chối | **[F]** — `engine/diagnose/abstention.dart` |
| BR-002 | Tin cậy phải tính đến xác suất trả lời đúng do may mắn | **[F]** — BR-02 trong logic kinh doanh |
| BR-003 | Nguyên nhân gốc là khoảng trống cấp lớp khi xuất hiện ở ≥30% lớp (làm tròn xuống), tối thiểu tuyệt đối 3 học sinh | **[F]** — `engine/grouping/cluster_by_root_cause.dart` |
| BR-004 | Ưu tiên: nhóm bị ảnh hưởng lớn hơn + kiến thức chặn nhiều hơn trước; phá vỡ hòa: kết luận trước, rồi sớm hơn trong chuỗi phụ thuộc | **[F]** — `engine/grouping/cluster_by_root_cause.dart` |
| BR-005 | Khi bằng chứng gợi ý nguyên nhân không phải kiến thức, hệ thống KHÔNG ĐƯỢC kết luận khoảng trống kiến thức | **[F]** — `engine/diagnose/non_knowledge_detector.dart`, `language_barrier_detector.dart` |
| BR-006 | Bằng chứng trên lớp có trọng số tin cậy cao hơn bằng chứng ngoài lớp | **[F]** — `engine/evidence/evidence_context.dart` |

## 12.2 Quy tắc Hỗ trợ Học sinh

| **ID** | **Quy tắc** | **Bằng chứng** |
|--------|-------------|----------------|
| BR-007 | Câu hỏi xác minh phải khác với câu hỏi luyện tập | **[F]** — `engine/remediation/hold_out_check.dart` |
| BR-008 | Kế hoạch khắc phục phải có giới hạn độ dài; học sinh phải vẫn truy cập nội dung lớp hiện tại | **[F]** — `engine/remediation/build_plan.dart` |
| BR-009 | Kế hoạch khắc phục phải loại trừ nội dung đã xác nhận thành thạo | **[F]** — `engine/remediation/build_plan.dart` |

## 12.3 Quy tắc Thẩm quyền Giáo viên

| **ID** | **Quy tắc** | **Bằng chứng** |
|--------|-------------|----------------|
| BR-010 | Quyết định giáo viên luôn ghi đè kết luận hệ thống | **[F]** — `hub/merge.dart` |
| BR-011 | Hệ thống không bao giờ được tự động giao can thiệp cho học sinh mà không có hành động giáo viên | **[F]** — nguyên tắc thiết kế |
| BR-012 | Mọi ghi đè của giáo viên phải được ghi nhận; kết luận gốc phải được bảo tồn | **[F]** — `hub/merge.dart` |

## 12.4 Quy tắc An toàn

| **ID** | **Quy tắc** | **Bằng chứng** |
|--------|-------------|----------------|
| BR-013 | Công cụ tự động không được sửa đổi đáp án đúng, nội dung gốc hoặc đồ thị kiến thức đã xác nhận | **[F]** — nguyên tắc thiết kế |
| BR-014 | Kết quả hệ thống không được dùng cho quyết định ảnh hưởng quyền học thuật của học sinh | **[F]** — nguyên tắc thiết kế |
| BR-015 | Hiển thị cho học sinh/phụ huynh phải sử dụng ngôn ngữ tập trung kỹ năng, không có nhãn năng lực hoặc nhãn lớp | **[F]** — nguyên tắc thiết kế |
| BR-016 | Dữ liệu hệ thống không được dùng để đánh giá giáo viên | **[F]** — nguyên tắc thiết kế |
| BR-017 | Kết quả chẩn đoán của một học sinh không được hiển thị cho học sinh khác | **[F]** — `auth/profile_gate.dart` |

## 12.5 Quy tắc Dữ liệu và Offline

| **ID** | **Quy tắc** | **Bằng chứng** |
|--------|-------------|----------------|
| BR-018 | Mọi kết luận phải có thể tính lại từ bằng chứng gốc; bằng chứng gốc không được sửa đổi hoặc xóa | **[F]** — `storage/event_log.dart`, thiết kế chỉ thêm |
| BR-019 | Thứ tự sự kiện không được dựa trên đồng hồ thiết bị | **[F]** — `hub/logical_clock.dart` |
| BR-020 | Mọi kết luận phải được gắn thẻ phiên bản đồ thị kiến thức và phiên bản logic | **[F]** — `engine/versioning/` |
| BR-021 | Dữ liệu nhận dạng học sinh không được rời khuôn viên trường; dữ liệu phân tích phải được ẩn danh tại nguồn | **[F]** — `privacy/anonymize.dart` |
| BR-022 | Nhật ký kiểm toán phải ghi nhận tất cả thao tác quản trị với chữ ký Ed25519 | **[F]** — `storage/audit_log.dart` |

---

# 13. Dữ liệu & Thực thể Kinh doanh

## 13.1 Các Thực thể Cốt lõi

| **Thực thể** | **Mô tả** | **Thuộc tính Chính** | **Triển khai** |
|---------------|-----------|---------------------|----------------|
| Student | Người dùng cuối nhận chẩn đoán và hỗ trợ | studentId, currentProfile, assignedInterventions | `auth/profile_gate.dart` |
| Teacher | Người dùng chính đưa ra quyết định giảng dạy | teacherId, assignedClasses | — |
| EvidenceEvent | Bản ghi nguyên tử của phản hồi học sinh | eventId (UUIDv7), studentId, itemId, response, latencyMs, contextMode, confidenceWeight, logicalTimestamp, deviceId, sessionId, syncStatus | `engine/evidence/record_attempt.dart`, `storage/event_log.dart` |
| Item | Câu hỏi đánh giá | itemId, content, correctAnswer, difficulty, attachedSkills[] | `engine/knowledge_graph/` |
| Skill | Đơn vị kiến thức trong đồ thị phụ thuộc | skillId, name, description, dependsOn[] | `engine/knowledge_graph/graph.dart`, `schema.dart` |
| KnowledgeGraph | Cấu trúc phụ thuộc của các kỹ năng | graphId, version, skills[], dependencies[] | `engine/knowledge_graph/` |
| BktState | Trạng thái thành thạo cho (học sinh, kỹ năng) | studentId, skillId, pKnown | `engine/mastery/bkt.dart` |
| Diagnosis | Kết luận hệ thống về nguyên nhân gốc | diagnosisId, studentId, skillId, confidence, status (concluded/abstained/mastered), timestamp | `engine/diagnose/` |
| InterventionGroup | Nhóm tổng hợp cho hành động giáo viên | groupId, rootCauseSkillId, studentIds[], priority, evidenceSummary | `engine/grouping/cluster_by_root_cause.dart` |
| TeacherOverride | Bản ghi quyết định giáo viên | overrideId, diagnosisId, teacherDecision, reason, timestamp | `hub/merge.dart` |
| ContentBundle | Gói nội dung đã xác nhận | bundleId, version, signature, items[], knowledgeGraph | `content-pipeline/` |
| AuditLogEntry | Bản ghi bất biến của thao tác quản trị | eventId, actorId, action, targetScope, timestamp, signature | `storage/audit_log.dart` |

## 13.2 Quan hệ Thực thể

```
Student ─1:M─ EvidenceEvent ─M:1─ Item
Skill ─1:M─ Item (thông qua attachedSkills)
Skill ─self─ KnowledgeGraph.dependencies
Student ─1:M─ BktState
BktState ─M:1─ Skill
Student ─1:M─ Diagnosis
Diagnosis ─M:1─ Skill (nguyên nhân gốc)
Diagnosis ─M:1─ TeacherOverride (tùy chọn)
TeacherOverride ─M:1─ Teacher
Diagnosis ─M:M─ InterventionGroup (thông qua studentIds)
ContentBundle ─1:M─ Item
ContentBundle ─1:1─ KnowledgeGraph
```

---

# 14. Tích hợp & Hệ thống Bên ngoài

## 14.1 Các Module Nội bộ

| **Module** | **Công nghệ** | **Mục đích** | **Trạng thái Triển khai** |
|-----------|---------------|--------------|--------------------------|
| app/ (Flutter) | Flutter/Dart | Ứng dụng chính cho học sinh và giáo viên | **[F]** — Công cụ cốt lõi đã triển khai; Giao diện học sinh đang chờ |
| web-portal/ | Next.js/TypeScript | Bảng điều khiển giáo viên (tài liệu trong web-portal-architecture.md) | **[I]** — Khung cơ bản tồn tại; triển khai đầy đủ đang tiến hành |
| content-pipeline/ | TypeScript/Node | Tạo, xác nhận và đóng gói nội dung | **[F]** — Các module tồn tại |
| research/ | Python | Nghiên cứu xác nhận, đánh giá mô hình | **[F]** — Các script Test A & B tồn tại |

## 14.2 Phụ thuộc Bên ngoài

| **Hệ thống** | **Mục đích** | **Tích hợp** |
|-------------|--------------|--------------|
| USB Storage | Phân phối nội dung/mô hình, đồng bộ dự phòng | Lưu trữ tệp với chữ ký Ed25519 |
| Local Network (mDNS) | Khám phá thiết bị và giao tiếp hub | HTTP qua mạng cục bộ |
| Gemma LLM (cục bộ) | Trích xuất bằng chứng, giải thích ngôn ngữ tự nhiên | llama.cpp qua FFI |
| SQLite | Lưu trữ cục bộ | Nhật ký sự kiện chỉ thêm |

## 14.3 Không có Dịch vụ Bên ngoài

| **Dịch vụ** | **Lý do Loại trừ** |
|-------------|-------------------|
| Cloud APIs | Vi phạm yêu cầu ưu tiên offline |
| Firebase/Supabase | Vi phạm yêu cầu ưu tiên offline |
| Google Analytics | Lo ngại quyền riêng tư cho dữ liệu học sinh |
| Bất kỳ SaaS bên thứ ba nào | Yêu cầu chủ quyền dữ liệu |

---

# 15. Kiến trúc Hướng Sự kiện / Đồng bộ

## 15.1 Luồng Đồng bộ Hub (SC-05, SC-06)

```
┌─────────────┐      mDNS + mã 6 chữ số      ┌──────────────┐
│ Thiết bị    │ ◄────────────────────────────► │ Hub Giáo viên │
│ Học sinh    │                               │ (HTTP server)│
│ (Flutter)   │   ┌──────────────────┐       │              │
│             │   │ Công cụ Cục bộ   │       │ - Hợp nhất  │
│ - Bằng chứng│   │ (Dart, BKT)     │       │ - Dự phòng   │
│ - Lưu trữ  │   │ Tất định        │       │ - Mã hóa    │
│ - Quyền riêng│   └──────────────────┘       └──────────────┘
└─────────────┘            │                        │
                          │ USB (dự phòng)        │
                          ▼                        ▼
                   ┌─────────────────────────────────┐
                   │           Ổ USB                   │
                   │  - model.gguf (Gemma 4-bit)    │
                   │  - content-bundle.zip         │
                   │  - evidence-archive.enc       │
                   └─────────────────────────────────┘
```

## 15.2 Các Thành phần Đồng bộ

| **Thành phần** | **Mô tả** | **Triển khai** |
|--------------|-----------|----------------|
| EvidenceRecorder | Ghi nhận phản hồi học sinh với ngữ cảnh | `engine/evidence/record_attempt.dart` |
| HubServer | HTTP server trên thiết bị giáo viên | `hub/server.dart` |
| LogicalClock | Dấu thời gian kiểu Lamport để sắp xếp sự kiện | `hub/logical_clock.dart` |
| MergeEngine | Giải quyết xung đột chỉ thêm | `hub/merge.dart` |
| Crypto | Mã hóa libsodium cho kênh | `hub/crypto.dart` |
| Discovery | mDNS + ghép nối QR code | `hub/discovery.dart` |
| Backup | Dự phòng hub hàng ngày | `hub/backup.dart` |
| FileExchange | Tạo/nhập lưu trữ USB | `sync/file_exchange.dart` |
| ChunkedTransfer | Chuyển từng phần cho tệp lớn | `sync/chunked_transfer.dart` |
| SyncStrategyResolver | Tự chọn hub vs USB dựa trên điều kiện | `sync/sync_strategy_resolver.dart` |
| ContentInstaller | Xác minh chữ ký Ed25519, cài đặt gói | `bootstrap/content_installer.dart` |
| BundleVerify | Xác minh toàn vẹn gói | `bootstrap/bundle_verify.dart` |

## 15.3 Mục đích Kinh doanh của Sự kiện Đồng bộ

| **Sự kiện** | **Mục đích Kinh doanh** |
|-----------|------------------------|
| Thêm bằng chứng | Tạo chuỗi kiểm toán cho mọi quyết định chẩn đoán |
| Tổng hợp hub | Cho phép xem cấp lớp mà không phụ thuộc đám mây |
| Chú thích giáo viên | Ghi nhận phán đoán chuyên môn để kiểm toán và ghi đè |
| Dự phòng | Bảo vệ chống lại điểm thất bại đơn lẻ (thiết bị giáo viên) |
| Dự phòng USB | Đảm bảo hoạt động ở khu vực không có mạng cục bộ |

---

# 16. AI / Trí tuệ Kinh doanh

## 16.1 Các Trường hợp sử dụng AI

| **Trường hợp sử dụng** | **Đầu vào** | **Xử lý** | **Đầu ra** | **Giá trị Kinh doanh** | **Trạng thái** |
|------------------------|-------------|-----------|------------|----------------------|----------------|
| Trích xuất Bằng chứng | Bài làm học sinh (văn bản/phản hồi) | LLM với ngữ pháp GBNF | Bằng chứng có cấu trúc với nhãn kỹ năng | Giảm đầu vào thủ công; cho phép mở rộng | **[A]** |
| Giải thích Ngôn ngữ Tự nhiên | Chuỗi bằng chứng + trạng thái thành thạo | Điền mẫu với kiểm tra thực tế | Giải thích dễ hiểu cho giáo viên | Tin cậy và chấp nhận | **[A]** |
| Thông điệp Mẫu cho Học sinh | Trạng thái thành thạo | Mẫu được phê duyệt trước | Thông điệp cho học sinh | Tuân thủ BR-015 | **[A]** |

## 16.2 Kiến trúc AI (3 Lớp)

```
┌────────────────────────────────────────────────────────────┐
│  Lớp 3 — Biểu đạt (inference/expression/)                 │
│  - Đầu ra dựa trên mẫu cho học sinh (BR-015)          │
│  - fact_check_guard để ngăn ngừa ảo giác                │
│  - explain_to_teacher cho giải thích chẩn đoán          │
├────────────────────────────────────────────────────────────┤
│  Lớp 2 — Quyết định (engine/*) — TẤT ĐỊNH              │
│  - Bayesian Knowledge Tracing (BKT)                       │
│  - Phân cụm nguyên nhân gốc (BR-003/004)                │
│  - Xếp hạng giả thuyết với tin cậy                      │
│  - KHÔNG phụ thuộc vào LLM cho quyết định               │
├────────────────────────────────────────────────────────────┤
│  Lớp 1 — Trích xuất (inference/extraction/)             │
│  - LLM đọc bài làm học sinh → bằng chứng có cấu trúc  │
│  - Ngữ pháp GBNF giới hạn đầu ra thành nhãn được phê duyệt │
│  - Chạy cục bộ qua llama.cpp FFI                        │
└────────────────────────────────────────────────────────────┘
```

## 16.3 Trạng thái Quyết định AI

| **Thành phần** | **Trạng thái** | **Bằng chứng** |
|--------------|---------------|----------------|
| Lớp 2 (Công cụ Tất định) | Đã triển khai | Các module `engine/*` tồn tại |
| Lớp 1 (Trích xuất LLM) | **[A]** | `inference/extraction/` tồn tại; đang chờ Test A |
| Lớp 3 (Biểu đạt) | **[A]** | `inference/expression/` tồn tại; đang chờ Test A |

## 16.4 Hành vi Thất bại/Dự phòng

| **Kịch bản** | **Hành vi** | **Trách nhiệm Con người/Hệ thống** |
|-------------|-------------|-----------------------------------|
| Trích xuất LLM thất bại | Sử dụng chỉ công cụ tất định | Hệ thống tiếp tục với khả năng giảm |
| Phát hiện ảo giác LLM | fact_check_guard trả về null → sử dụng mẫu tĩnh | Hệ thống ngăn thông tin sai |
| Bằng chứng không đủ | Trả về trạng thái từ chối | Hệ thống không thể kết luận; con người quyết định |
| Phiên bản mô hình thay đổi | Đánh dấu kết luận để tính lại | Hệ thống đánh dấu các bản ghi bị ảnh hưởng; con người lên lịch xem xét |

---

# 17. Giả định

| **ID** | **Giả định** | **Tác động nếu Sai** | **Xác nhận** |
|--------|-------------|---------------------|--------------|
| A-001 | Giáo viên chưa biết nguyên nhân gốc của từng học sinh | Sản phẩm mất giá trị đề xuất | OQ-01 |
| A-002 | Tồn tại câu trả lời đúng cho "nguyên nhân gốc là gì" | Phương pháp chẩn đoán không hợp lệ | OQ-02 |
| A-003 | Chuỗi chẩn đoán đúng → can thiệp đúng → kết quả tốt hơn không bị gián đoạn | Sản phẩm không cải thiện kết quả học sinh | Nghiên cứu dài hạn |
| A-004 | Mỗi lỗi có một nguyên nhân gốc chi phối | Đơn giản hóa quá mức mô hình chẩn đoán | Phân tích bài làm học sinh thực |
| A-005 | Học sinh đang cố gắng hết sức và làm việc độc lập | Chất lượng bằng chứng bịcompromised | OQ-10 |
| A-006 | Giáo viên được phép tổ chức lại hoạt động lớp học | Không thể thực hiện giảng dạy phân biệt | OQ-12 |
| A-007 | Khoảng trống kiến thức là kiến thức thiếu, không phải hiểu sai | Mô hình chẩn đoán không đủ | Phân tích loại lỗi |
| A-061 | Thiết bị mục tiêu có thể chạy LLM cục bộ trong thời gian chấp nhận được | Các tính năng cốt lõi bị giới hạn | Test B |
| A-062 | Mô hình + nội dung vừa trong lưu trữ thiết bị mục tiêu | Vi phạm NFR-002 | Test B |
| A-063 | Mô hình cục bộ nhỏ xử lý ngôn ngữ toán tiếng Việt chấp nhận được | Chất lượng trích xuất không thể chấp nhận | Test A |
| A-064 | Phân phối nội dung/mô hình offline khả thi mà không cần nhân viên kỹ thuật | Không thể mở rộng ngoài thử nghiệm | Nghiên cứu người dùng |
| A-065 | Giấy phép trọng số mô hình cho phép phân phối giáo dục | Ràng buộc pháp lý | Xem xét pháp lý |
| A-066 | Thiết bị mục tiêu là kiến trúc 64-bit | Không thể chạy mô hình 2B+ | Khảo sát thiết bị |
| A-067 | Mạng cục bộ cho phép hai thiết bị nhìn thấy nhau | Đồng bộ hub thất bại; chỉ USB | Nghiên cứu người dùng |

---

# 18. Ràng buộc

| **ID** | **Loại** | **Ràng buộc** | **Cứng/Mềm** |
|--------|----------|--------------|--------------|
| CO-R-01 | Quy định | Phải hoạt động ở khu vực không có kết nối internet | Cứng |
| CO-R-02 | Quy định | Phải hoạt động với kết nối băng thông thấp, không ổn định | Cứng |
| CO-E-01 | Giáo dục | Nội dung phải theo chương trình GDPT 2018 | Cứng |
| CO-E-02 | Giáo dục | Phải tuân thủ yêu cầu phân phối chương trình | Cứng |
| CO-D-03 | Dữ liệu | Dữ liệu nhận dạng học sinh không bao giờ rời khuôn viên trường | Cứng |
| CO-D-07 | Dữ liệu | Chất lượng bằng chứng khác theo ngữ cảnh (trên lớp vs ngoài lớp) | Cứng |
| CO-D-08 | Dữ liệu | Mọi kết luận được gắn thẻ phiên bản mô hình/logic | Cứng |
| CO-L-01 | Pháp lý | Phải tuân thủ FERPA/GDPR/PDPD Việt Nam cho người chưa thành niên | Cứng |
| CO-T-02 | Kỹ thuật | Phải chạy trên thiết bị mục tiêu tại khu vực triển khai | Cứng |
| CO-T-04 | Kỹ thuật | Không có nhân viên kỹ thuật tại trường | Cứng |
| CO-T-06 | Kỹ thuật | Không thể tin tưởng đồng hồ thiết bị cho thứ tự | Cứng |
| CO-T-07 | Kỹ thuật | Giáo viên phải có thể cài đặt mà không cần hỗ trợ kỹ thuật | Cứng |
| CO-T-09 | Kỹ thuật | LLM cục bộ bị giới hạn bởi RAM/CPU/lưu trữ thiết bị | Cứng |
| CO-T-10 | Kỹ thuật | Đầu ra LLM phải tất định với cùng trọng số/lượng tử hóa/tham số | Cứng |

---

# 19. Rủi ro

| **ID** | **Rủi ro** | **Xác suất** | **Tác động** | **Giảm thiểu** |
|--------|------------|-------------|-------------|----------------|
| RK-01 | Giáo viên không áp dụng hệ thống do tăng khối lượng công việc | Trung bình | Cao | Giảm ma sát; đo BO-02 |
| RK-02 | Can thiệp trong chuỗi chẩn đoán thất bại | Trung bình | Cao | Từ chối BR-001; ghi đè giáo viên |
| RK-03 | Tỷ lệ lỗi không phải kiến thức cao | Trung bình | Cao | BR-005; phát hiện FR-003 |
| RK-04 | Hệ thống tạo nhóm năng lực làm rộng khoảng cách | Thấp | Cao | Ràng buộc nhãn BR-015; NFR-019 |
| RK-05 | Vấn đề chất lượng nội dung gây hại | Thấp | Cao | BR-013; xem xét UC-019 |
| RK-06 | Phụ huynh phản ứng tiêu cực với minh bạch chẩn đoán | Trung bình | Trung bình | BR-015; giao tiếp với phụ huynh |
| RK-07 | Thiết bị mục tiêu không thể chạy LLM cục bộ chấp nhận được | Trung bình | Cao | Test B; dự phòng sang mô hình nhỏ hơn |
| RK-08 | LLM trích xuất loại lỗi sai mà không có cờ không chắc chắn | Trung bình | Rất Cao | Nhãn "unknown"; xem xét giáo viên |
| RK-09 | LLM không tất định phá vỡ khả năng tái tạo | Trung bình | Cao | Lưu trữ trích xuất như bằng chứng |
| RK-10 | LLM tạo giải thích ảo giác | Trung bình | Rất Cao | fact_check_guard |
| RK-11 | Logistics phân phối offline vượt quá nguồn lực | Cao | Trung bình | Lịch theo học kỳ |
| RK-12 | Mạng trường cô lập các thiết bị khỏi nhau | Trung bình | Cao | Dự phòng USB |
| RK-13 | Rào cản ngôn ngữ bị chẩn đoán sai thành khoảng trống kiến thức | Trung bình-Cao | Cao | Phát hiện rào cản ngôn ngữ FR-003 |
| RK-14 | Thất bại thiết bị giáo viên (hub) mất dữ liệu lớp | Trung bình | Cao | Dự phòng hub |
| RK-15 | Giấy phép mô hình cấm phân phối giáo dục | Trung bình | Cao | Xem xét pháp lý |

---

# 20. Phụ thuộc

| **ID** | **Phụ thuộc** | **Loại** | **Bị chặn bởi** |
|--------|---------------|----------|-----------------|
| D-01 | Đồ thị kiến thức cho phân số → tỉ lệ | Nội bộ | Không — đang tiến hành |
| D-02 | Gói nội dung đã xác nhận | Nội bộ | D-01, UC-019 |
| D-03 | Thông số thiết bị cho khu vực mục tiêu | Bên ngoài | OQ-07 |
| D-04 | Xem xét pháp lý về xử lý dữ liệu cho người chưa thành niên | Bên ngoài | OQ-08 |
| D-05 | Xem xét giấy phép mô hình | Bên ngoài | A-065 |
| D-06 | Hợp tác giáo viên cho áp dụng | Bên ngoài | Giảm thiểu RK-01 |
| D-07 | Chính sách trường học cho phép hoạt động | Bên ngoài | OQ-12 |
