# 🌐 WEB-PORTAL — VerveAI Portal Architecture

> **Phiên bản:** 1.4.5
> **Ngày:** 05/09/2026
> **Căn cứ:** BA v1.4.5, TS-01, TS-17, F.7
> **Trạng thái:** Ưu tiên CAO NHẤT — đang phát triển

---

## 📋 Tổng quan

### Mục đích
Web-portal là giao diện chính cho **giáo viên**, **học sinh**, **quản trị viên**, và **phụ huynh** truy cập thông tin chẩn đoán, theo dõi tiến độ học sinh, và quản lý lớp học.

### Các Portal trong hệ thống

| Portal | Người dùng | Mục đích chính | Trạng thái |
|--------|-------------|----------------|------------|
| **Teacher Portal** | Giáo viên | Dashboard, can thiệp, bằng chứng | Phase 1 |
| **Student Portal** | Học sinh | Làm bài, học bù đắp, tiến độ | Phase 2 |
| **Admin Portal** | Quản trị viên | Quản lý user, thiết bị, báo cáo | Phase 1 |
| **Parent Portal** | Phụ huynh | Xem tiến độ con | Phase 2 |
| **Supervisor Portal** | Giám sát | Báo cáo ẩn danh cấp cụm/trường | Phase 3 |

### Ưu tiên phát triển (theo F.7)
1. **Frontend trước (Next.js/React)**: Giao diện + mock data → kiểm chứng UX nhanh
2. **Backend (Node.js)**: API, logic, hub → kết nối dữ liệu thật
3. **PWA offline**: Service Worker, IndexedDB, WebLLM → hỗ trợ offline

### Tech Stack
| Thành phần | Công nghệ | Ghi chú |
|------------|-----------|---------|
| Framework | Next.js 14+ | App Router, Server Components |
| Ngôn ngữ | TypeScript | Strict mode |
| Styling | Tailwind CSS + shadcn/ui | Design system nhất quán |
| State | Zustand / React Query | Quản lý state phía client |
| API | REST → Gateway (port 8080) ⭐ | Kết nối microservice backend |
| Auth | NextAuth.js | OAuth/GitHub provider (demo) |
| Testing | Vitest + Playwright | Unit + E2E |

### API Connection ⭐ MỚI

> **Quan trọng:** web-portal chỉ gọi qua **Gateway** (`http://gateway:8080`), không gọi trực tiếp đến service.

```
Browser → web-portal → Gateway (8080) → Service tương ứng
                    ↑
                    └── JWT verify, Rate limit, CORS
```

Xem chi tiết:
- [`service/WORK_SPLIT.md`](../../service/WORK_SPLIT.md) — Phân chia 5 microservice
- [`docs/02-architecture/adr/0004-microservices-architecture.md`](./adr/0004-microservices-architecture.md) — Kiến trúc microservice
- [`docs/02-architecture/adr/0006-api-gateway.md`](./adr/0006-api-gateway.md) — API Gateway

---

## 🎯 Màn hình & Tính năng

### A. Màn hình Giáo viên (Teacher Portal)

#### A.1. Dashboard Chính (`/dashboard`)

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Tổng quan lớp** | Danh sách lớp đang phụ trách, số HS, trạng thái sync | FR-18 |
| **Nhóm can thiệp ưu tiên** | Top 5 nhóm cần can thiệp ngay (theo size → severity → alphabet) | FR-15, SR-02 |
| **Báo cáo mới** | Thông báo có báo cáo mới từ buổi học gần nhất | FR-18 |
| **Tiến độ học sinh** | Biểu đồ pKnown trung bình theo thời gian | FR-02, SN-S-05 |

**Mock Data:** Dùng `src/mocks/teacher.ts` để tạo dữ liệu giả.

#### A.2. Chi tiết Lớp (`/class/[classId]`)

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Danh sách học sinh** | Bảng: mã HS, tên, pKnown, số bài làm, trạng thái | FR-01, FR-02 |
| **Filter/Sort** | Lọc theo: nhóm can thiệp, mức pKnown, hoạt động gần đây | FR-15 |
| **Xem chi tiết HS** | Click row → modal hoặc page `/student/[studentId]` | SN-T-01 |

#### A.3. Trang Học sinh (`/student/[studentId]`)

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Thông tin HS** | Mã, tên, lớp, thiết bị, lần cuối hoạt động | FR-01 |
| **Đồ thị pKnown theo thời gian** | Line chart mức thành thạo từng kỹ năng | FR-02, SN-S-05 |
| **Bằng chứng gần đây** | Danh sách 10 bài làm mới nhất | FR-07, BR-10 |
| **Nhóm can thiệp** | HS thuộc nhóm nào, vì sao | FR-15, SN-T-02 |
| **Chuỗi bằng chứng** | Click bài làm → xem chi tiết từng phép đo | FR-16, SN-T-06 |

#### A.4. Bảng Can thiệp (`/interventions`)

> **Màn hình cốt lõi** — FR-15, FR-16, FR-17, SR-02

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Danh sách nhóm can thiệp** | Sắp xếp: size giảm dần → severity giảm dần → alphabet | BR-07, BR-08 |
| **Chi tiết nhóm** | - Tên nhóm (nguyên nhân gốc)<br>- Số HS trong nhóm<br>- Bằng chứng tóm tắt<br>- Kỹ năng liên quan<br>- Ngưỡng severity | FR-15, FR-16 |
| **Hành động** | - Xem chi tiết bằng chứng<br>- Ghi chú can thiệp đã thực hiện<br>- Override kết luận (FR-17)<br>- Bổ sung nhiệm vụ riêng (FR-19) | FR-17, FR-19 |
| **Export** | Xuất PDF báo cáo nhóm (TS-12) | FR-18 |

**Override kết luận (FR-17):**
```
Form Override:
- Lý do override: [dropdown: sai nguyên nhân, bổ sung context, khác]
- Ghi chú: [textarea]
- Kết quả override: [nguyên nhân mới / abstain]
→ Lưu: BR-17 (ghi chú GV là nguồn chuẩn)
```

#### A.5. Xem Bằng chứng Chi tiết (`/evidence/[evidenceId]`)

> FR-07, FR-16, BR-10

| Thành phần | Mô tả |
|------------|--------|
| **Timeline bằng chứng** | Danh sách các phép đo (câu hỏi → đáp án → đúng/sai → latency) |
| **Chuỗi suy luận** | Hiển thị BKT → Cluster → Diagnose step by step |
| **Kết luận hệ thống** | Nguyên nhân gốc + confidence + pKnown |
| **Giáo viên ghi chú** | Textarea để GV thêm nhận xét (BR-17) |
| **So sánh với override** | Nếu có override → hiện kết luận ban đầu vs kết luận GV |

#### A.6. Quản lý Nội dung (`/content`)

> FR-19, FR-20, SN-T-08

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Thư viện nội dung** | Danh sách câu hỏi, kịch bản đã được thẩm định | FR-20, SN-SC-03 |
| **Tạo nhiệm vụ riêng** | GV tạo bài tập bổ sung cho HS/HV nhóm | FR-19 |
| **Import/Export** | Upload nội dung mới, export danh sách | FR-19 |

#### A.7. Cài đặt (`/settings`)

| Thành phần | Mô tả |
|------------|--------|
| **Thông tin tài khoản** | Tên, email, mật khẩu |
| **Thông báo** | Bật/tắt thông báo mới |
| **Ngôn ngữ** | Tiếng Việt / English |
| **Sync** | Trạng thái đồng bộ hub, last sync time |

---

### B. Màn hình Quản trị (Admin Portal)

#### B.1. Dashboard Quản trị (`/admin`)

| Thành phần | Mô tả | SR liên quan |
|------------|--------|--------------|
| **Tổng quan hệ thống** | Số lớp, số HS, số GV, trạng thái sync | SR-12 |
| **Báo cáo tổng hợp** | Thống kê (ẩn danh) theo trường/cụm | SR-15, SN-G-01 |
| **Cảnh báo** | Thiết bị offline lâu, dữ liệu chưa sync, nội dung hết hạn | NFR-18 |

#### B.2. Quản lý Người dùng (`/admin/users`)

> SR-14, SN-SC-05

| Thành phần | Mô tả |
|------------|--------|
| **Danh sách GV** | CRUD giáo viên |
| **Danh sách HS** | CRUD học sinh (batch import) |
| **Phân quyền** | Admin, Giáo viên, Giám sát |
| **Export dữ liệu** | Xuất CSV/JSON theo yêu cầu cơ sở GD |

#### B.3. Quản lý Lớp học (`/admin/classes`)

| Thành phần | Mô tả |
|------------|--------|
| **Tạo/sửa lớp** | Tên, GV phụ trách, danh sách HS |
| **Import HS** | Upload CSV danh sách HS |
| **Chuyển lớp** | Di chuyển HS sang lớp khác (FR-26) |

#### B.4. Báo cáo Ẩn danh (`/admin/reports`)

> SR-15, SN-G-01, SN-G-02, DR-08

| Thành phần | Mô tả |
|------------|--------|
| **Tổng hợp theo trường** | Thống kê ẩn danh: pKnown trung bình, tỷ lệ HS cần can thiệp |
| **Tổng hợp theo cụm trường** | Phòng/Sở GD có thể xem |
| **Export báo cáo** | PDF/CSV, không chứa dữ liệu định danh HS |

#### B.5. Quản lý Nội dung (`/admin/content`)

> FR-20, SN-SC-03, DR-02

| Thành phần | Mô tả |
|------------|--------|
| **Duyệt nội dung** | GV/TPCM duyệt câu hỏi mới từ content-pipeline |
| **Phiên bản** | Xem lịch sử thay đổi nội dung |
| **Bám Chương trình GDPT 2018** | Tag theo mạch kiến thức, chủ đề |

#### B.6. Quản lý Thiết bị & Sync (`/admin/devices`)

> FR-18, NFR-01, NFR-18

| Thành phần | Mô tả |
|------------|--------|
| **Danh sách thiết bị** | Trạng thái online/offline, last seen |
| **Hub status** | Địa chỉ hub, số thiết bị kết nối |
| **Sync log** | Lịch sử đồng bộ, lỗi |
| **Phân phối USB** | Hướng dẫn tạo USB boot (TS-19) |

#### B.7. Cài đặt Hệ thống (`/admin/settings`)

| Thành phần | Mô tả |
|------------|--------|
| **Cấu hình hub** | IP, port, mDNS |
| **Ngưỡng cảnh báo** | pKnown tối thiểu, số ngày offline tối đa |
| **Chính sách lưu giữ** | DR-12, NFR-21 |
| **Audit log** | Nhật ký truy cập, thay đổi |

---

### C. Màn hình Phụ huynh (Parent Portal) — *Optional Phase 2*

> SR-15, SN-P-01, SN-P-02, SN-P-03

#### C.1. Dashboard Phụ huynh (`/parent`)

| Thành phần | Mô tả |
|------------|--------|
| **Danh sách con** | Thông tin con đang theo học |
| **Tiến độ học tập** | pKnown, nhóm can thiệp (không hiện tên HS khác) |
| **Báo cáo kỹ năng** | Định hướng cần củng cố, không xếp loại |
| **Thông tin thu thập** | DR-08, SN-P-02 |

#### C.2. Chi tiết Con (`/parent/child/[childId]`)

| Thành phần | Mô tả | SN liên quan |
|------------|--------|--------------|
| **Thông tin con** | Lớp, GV phụ trách, thiết bị | SN-P-02 |
| **Tiến độ kỹ năng** | Biểu đồ pKnown theo thời gian | SN-S-05 |
| **Kỹ năng cần củng cố** | Danh sách kỹ năng chưa vững (định hướng, không xếp loại) | SN-P-01, SR-07 |
| **Hoạt động gần đây** | Lịch sử làm bài (ngày, nội dung, kết quả) | DR-08 |
| **Gợi ý hỗ trợ** | Cách phụ huynh có thể hỗ trợ con tại nhà | — |

---

## D. Màn hình Học sinh (Student Portal)

> **Lưu ý:** Student Portal chủ yếu trên **app/ (Flutter PWA)** để hỗ trợ offline. Tuy nhiên, web-portal vẫn cần cung cấp:
> - Một số màn hình xem thông tin (đọc-only)
> - Hoặc PWA web-app cho HS sử dụng khi có kết nối

### D.0. Đăng nhập Học sinh (`/learn/login`)

> FR-01, FR-22, EC-15, BR-19

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Xác nhận hồ sơ** | Khi dùng chung thiết bị, HS phải xác nhận hồ sơ trước mỗi phiên | FR-22, EC-15 |
| **Chọn hồ sơ** | Dropdown/list chọn HS đang sử dụng | BR-19 |
| **Xác nhận bằng mã** | Mã PIN hoặc nhận diện khác để xác nhận đúng HS | EC-15 |
| **Không hiện kết quả chéo** | Kết quả của HS khác không hiện ra cho HS khác thấy | BR-19 |

### D.1. Dashboard Học sinh (`/learn` hoặc `/student-portal`)

> FR-01, FR-08, FR-09, SN-S-03, SN-S-05

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Chào mừng** | Xin chào [tên HS], hôm nay bạn sẽ làm gì? | — |
| **Mục tiêu hôm nay** | Nội dung cần hoàn thành (bám sát lớp hiện tại) | FR-13, BR-11 |
| **Tiến độ pKnown** | Biểu đồ tròn: % kỹ năng đã vững | FR-02, SN-S-05 |
| **Hoạt động gần đây** | 5 bài làm gần nhất với kết quả | FR-07 |
| **Phần thưởng/khích lệ** | Badge hoàn thành, streak ngày (BR-14) | — |
| **Tiếp tục học** | Nút "Bắt đầu" cho nội dung đang dở | FR-08 |

**Mock Data:** Dùng `src/mocks/student.ts` để tạo dữ liệu giả.

### D.2. Làm Bài Chẩn đoán (`/learn/diagnosis`)

> **Màn hình cốt lõi** — FR-01, FR-05, FR-06, AIR-16

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Màn hình câu hỏi** | Hiển thị 1 câu hỏi, các lựa chọn (distractor-based) | FR-05 |
| **Timer** | Thời gian làm bài (ẩn/hiện tùy setting) | DR-07 |
| **Progress bar** | Tiến trình: câu X / tổng số câu | FR-06 |
| **Nút "Tôi không chắc"** | Ghi nhận response = 0.5 (DR-04) | FR-06 |
| **Kết thúc sớm** | Nút "Dừng lại" nếu HS cần nghỉ | — |

**Luồng làm bài:**
```
1. Chọn "Bắt đầu chẩn đoán" hoặc "Tiếp tục"
2. Hiển thị câu hỏi 1
3. Chọn đáp án hoặc "Không chắc"
4. → Câu tiếp theo (hoặc kết thúc nếu đủ bằng chứng)
5. Kết thúc → Xem kết quả sơ bộ
```

**Câu hỏi theo thiết kế SC-03:**
- Mỗi câu hỏi có **4 distractor**, mỗi distractor gắn với 1 kiểu hiểu sai xác định
- Đáp án đúng gắn với kiến thức đã vững
- Không đáp án → "Tôi không biết"

### D.3. Xem Kết quả Chẩn đoán (`/learn/diagnosis/result`)

> FR-04, FR-07, BR-10

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Tóm tắt kết quả** | Số câu đúng/tổng, thời gian làm | FR-04 |
| **Kỹ năng đã kiểm tra** | Danh sách kỹ năng với pKnown mới | FR-04 |
| **"Bạn đã làm tốt"** | Thông điệp khích lệ, không xếp loại | BR-13, SR-07 |
| **Nội dung cần củng cố** | Gợi ý bài học tiếp theo (bám lớp hiện tại) | FR-12, SR-08 |
| **Nút "Bắt đầu học"** | Chuyển sang màn hình nội dung bù đắp | FR-12 |

**Lưu ý:** HS không thấy:
- Nguyên nhân gốc chi tiết
- So sánh với bạn học
- Nhãn năng lực

### D.4. Học Nội dung Bù đắp (`/learn/remediate`)

> **Màn hình cốt lõi** — FR-11, FR-12, BR-11, SR-08, SR-09

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Danh sách kỹ năng cần bù** | Các kỹ năng có pKnown thấp, cần củng cố | FR-12 |
| **Bài học ngắn** | Nội dung giải thích + ví dụ (template đóng - BR-13) | FR-11 |
| **Bài tập luyện tập** | Câu hỏi sau mỗi bài học (không phải chẩn đoán) | FR-12 |
| **Giới hạn độ dài** | Mỗi session không quá X phút (FR-13) | BR-11 |
| **Nút " Quay lại lớp"** | Luôn có thể quay lại nội dung lớp hiện tại | BR-11, SR-09 |

**Phân biệt Học vs Chẩn đoán:**
| | Chẩn đoán | Học bù đắp |
|---|---|---|
| Mục đích | Thu thập bằng chứng | Củng cố kiến thức |
| Câu hỏi | SC-03 (distractor-based) | Bài tập thông thường |
| Kết quả | pKnown thay đổi? | Chỉ practice, không ảnh hưởng pKnown |
| Thời gian | Ngắn (5-10 câu) | Dài hơn (bài học) |

### D.5. Lộ trình Học tập (`/learn/pathway`)

> FR-13, SR-08, SR-09, SN-S-03

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Mạch kiến thức hiện tại** | Chủ đề/lớp HS đang học | FR-13 |
| **Kỹ năng đã vững** | Checkmark xanh, không cần học lại | FR-12 |
| **Kỹ năng đang học** | Highlight, đang trong tiến trình | FR-12 |
| **Kỹ năng cần củng cố** | Màu cam, cần luyện thêm | FR-12 |
| **Nội dung lớp dưới** | Chỉ hiện nếu hổng nền nghiêm trọng (FR-13) | BR-11 |
| **Mục tiêu sắp tới** | Kỹ năng cần đạt trong tuần/này | — |

**Hiển thị dạng:**
```
┌─────────────────────────────────────────────────────────┐
│ Lộ trình của em — Lớp 7, Chương 3: Tỷ lệ thức        │
├─────────────────────────────────────────────────────────┤
│ ✓ Tỷ lệ thức cơ bản          [████████████████] 95%  │
│ ◐ Tỷ lệ thức và phần trăm    [██████░░░░░░░░░░░] 65%  │
│ ○ Tìm giá trị chưa biết       [░░░░░░░░░░░░░░░░░░] 0%   │
│ ○ Tỷ lệ thức và đại lượng     [░░░░░░░░░░░░░░░░░░] 0%   │
└─────────────────────────────────────────────────────────┘
```

### D.6. Tiến độ & Thành tích (`/learn/progress`)

> FR-02, FR-09, SN-S-05, BR-14

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Đồ thị pKnown theo thời gian** | Line chart từng kỹ năng | FR-02, SN-S-05 |
| **Tổng quan tuần này** | Số bài đã làm, thời gian học, kỹ năng mới | FR-09 |
| **So sánh với tuần trước** | ↑↓ so với tuần trước (không so với bạn) | — |
| **Phần thưởng & Badge** | Thành tích đạt được (streak, hoàn thành chương) | BR-14 |
| **Lịch sử hoạt động** | Timeline các bài đã làm | FR-07 |

**Biểu đồ pKnown mẫu:**
```
pKnown
 1.0 ┤                    ╭─────╮
 0.8 ┤            ╭──────╯     ╰──
 0.6 ┤     ╭──────╯
 0.4 ┤─────╯
 0.2 ┤
 0.0 ┼─────────────────────────────
      T1   T2   T3   T4   T5   T6  (tuần)
```

### D.7. Xem Chi tiết Kỹ năng (`/learn/skill/[skillId]`)

> FR-02, FR-04, SN-S-02

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Tên kỹ năng** | VD: "Phân số tương đương" | — |
| **Mức độ pKnown** | Thanh progress + % cụ thể | FR-02 |
| **Bằng chứng gần đây** | 5 bài làm gần nhất liên quan kỹ năng | FR-07 |
| **Lý do chưa vững** | Mô tả ngắn (không gán nhãn năng lực) | SN-S-01, SR-07 |
| **Bài học liên quan** | Liên kết đến nội dung bù đắp | FR-12 |
| **Kỹ năng tiên quyết** | Kỹ năng cần vững trước (dependency graph) | DR-01 |

### D.8. Làm Bài Luyện tập (`/learn/practice`)

> FR-12, SR-08

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Chọn kỹ năng** | Dropdown hoặc chip để chọn kỹ năng cần luyện | FR-12 |
| **Chế độ luyện tập** | Bài tập thông thường (không ảnh hưởng pKnown) | FR-12 |
| **Đáp án & giải thích** | Hiện sau khi trả lời | — |
| **Báo cáo sau bài** | Số đúng, gợi ý cần ôn lại gì | FR-12 |

### D.9. Nội dung Lớp Hiện tại (`/learn/class-content`)

> FR-13, SR-09, BR-11, SN-S-03

| Thành phần | Mô tả | FR liên quan |
|------------|--------|--------------|
| **Bài học theo lớp** | Nội dung bám sát chương trình GDPT 2018 | FR-13, SN-SC-04 |
| **Chương/Topic hiện tại** | Đang học ở lớp gì | FR-13 |
| **Tài liệu học tập** | Giải thích, ví dụ, bài tập (BR-13: template đóng) | FR-11 |
| ** Quay lại lớp** | Nút luôn hiện, không bị khóa | SR-09, BR-11 |

### D.10. Cài đặt Học sinh (`/learn/settings`)

| Thành phần | Mô tả |
|------------|--------|
| **Thông tin tài khoản** | Tên, mã HS (ẩn danh) |
| **Ngôn ngữ** | Tiếng Việt / English |
| **Thông báo** | Bật/tắt nhắc nhở học tập |
| **Âm thanh** | Bật/tắt âm thanh bài học |
| **Phụ huynh giám sát** | Mã QR để phụ huynh kết nối (optional) |

### D.11. Thông tin & Hướng dẫn (`/learn/about`)

> DR-08, SN-P-02

| Thành phần | Mô tả |
|------------|--------|
| **Giới thiệu ứng dụng** | Verve là gì, mục đích |
| **Dữ liệu thu thập** | Giải thích đơn giản: "Chúng tôi thu thập gì và vì sao" |
| **Quyền riêng tư** | Link đến chính sách bảo mật |
| **Liên hệ hỗ trợ** | Email/hotline hỗ trợ kỹ thuật |

---

## E. Màn hình Giám sát (Supervisor Portal) — *Optional Phase 3*

> SN-G-01, SN-G-02, SR-15, DR-08

### E.1. Dashboard Giám sát (`/supervisor`)

| Thành phần | Mô tả | SR liên quan |
|------------|--------|--------------|
| **Tổng quan cụm/trường** | Số lớp, số HS, số GV đang active | SN-G-01 |
| **Báo cáo tổng hợp ẩn danh** | Thống kê pKnown, tỷ lệ can thiệp (không tên HS) | SR-15, SN-G-02 |
| **Cảnh báo** | Trường có vấn đề (nhiều HS offline lâu, nội dung chưa cập nhật) | NFR-18 |
| **So sánh giữa các trường** | Biểu đồ ẩn danh (nếu được phép) | SR-15 |

### E.2. Báo cáo Chi tiết (`/supervisor/reports`)

| Thành phần | Mô tả | SR liên quan |
|------------|--------|--------------|
| **Chọn phạm vi** | Cụm trường / Trường / Lớp | SN-G-01 |
| **Tổng hợp kỹ năng** | Kỹ năng nào cần hỗ trợ nhiều nhất | SR-15 |
| **Xu hướng theo thời gian** | pKnown trung bình thay đổi thế nào | FR-02 |
| **Export báo cáo** | PDF/CSV, đảm bảo ẩn danh hoàn toàn | DR-08 |

---

## 📊 Data Models

### Cấu trúc dữ liệu chính

```typescript
// src/types/index.ts

// === Giáo viên ===
interface Teacher {
  id: string;
  name: string;
  email: string;
  schoolId: string;
  classIds: string[];
  role: 'teacher' | 'admin';
}

// === Học sinh ===
interface Student {
  id: string;
  code: string;           // Mã HS ẩn danh
  name: string;
  classId: string;
  deviceId?: string;
  pKnown: Record<string, number>;  // skillId → pKnown
  lastActive: string;      // ISO timestamp
}

// === Lớp học ===
interface Class {
  id: string;
  name: string;
  teacherId: string;
  studentIds: string[];
  subject: 'math';
  grade: number;
}

// === Bằng chứng (Evidence) ===
interface EvidenceEvent {
  eventId: string;         // UUIDv7
  studentId: string;
  itemId: string;
  response: 0 | 1;         // 0 = sai, 1 = đúng
  latencyMs: number;
  contextMode: 'in-class' | 'out-of-class';
  confidenceWeight: number;
  logicalTimestamp: string; // BR-17
  deviceId: string;
  sessionId: string;
  syncStatus: 'pending' | 'synced' | 'conflict';
}

// === Kết luận Chẩn đoán ===
interface Diagnosis {
  id: string;
  studentId: string;
  skillId: string;
  rootCause: string;       // BR-07/08
  confidence: number;       // 0.0 - 1.0
  abstain: boolean;        // Bằng chứng chưa đủ
  evidenceIds: string[];
  teacherOverride?: TeacherOverride;
  createdAt: string;
}

interface TeacherOverride {
  originalConclusion: string;
  newConclusion: string;
  reason: 'wrong_cause' | 'missing_context' | 'other';
  note: string;
  teacherId: string;
  createdAt: string;
}

// === Nhóm Can thiệp ===
interface InterventionGroup {
  id: string;
  classId: string;
  rootCause: string;        // Nguyên nhân gốc (BR-07)
  studentIds: string[];
  severity: 'high' | 'medium' | 'low';
  size: number;
  evidenceSummary: string; // Tóm tắt bằng chứng
  skills: string[];        // Danh sách kỹ năng liên quan
  status: 'pending' | 'in-progress' | 'resolved';
  teacherNotes: TeacherNote[];
  createdAt: string;
  updatedAt: string;
}

interface TeacherNote {
  id: string;
  teacherId: string;
  content: string;
  createdAt: string;
}

// === Báo cáo Tổng hợp (ẩn danh) ===
interface AggregateReport {
  id: string;
  scope: 'class' | 'school' | 'district';
  scopeId: string;
  dateRange: { start: string; end: string };

  // Các chỉ số ẩn danh
  totalStudents: number;
  avgPKnown: number;
  studentsNeedingIntervention: number;  // %
  skillsNeedingSupport: Array<{
    skillId: string;
    percentage: number;
  }>;

  // Không chứa: tên HS, mã HS cá nhân
  anonymized: true;
  generatedAt: string;
}

// === Kỹ năng ===
interface Skill {
  id: string;
  name: string;
  description: string;
  gradeLevel: number;
  chapter: string;
  topic: string;
  prerequisiteSkillIds: string[];  // DR-01
  status: 'learning' | 'mastered' | 'needs_remediation';
}

// === Bài học (Learning Content) ===
interface Lesson {
  id: string;
  skillId: string;
  title: string;
  content: string;              // Markdown/HTML
  durationMinutes: number;      // FR-13: giới hạn độ dài
  type: 'explanation' | 'practice' | 'diagnostic';
  order: number;
}

// === Phiên làm bài (Session) ===
interface LearningSession {
  id: string;
  studentId: string;
  type: 'diagnostic' | 'practice' | 'review';
  status: 'in_progress' | 'completed' | 'paused';
  startedAt: string;
  completedAt?: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentItemId?: string;
}

// === Kết quả Bài làm (Item Result) ===
interface ItemResult {
  id: string;
  sessionId: string;
  itemId: string;
  skillId: string;
  studentResponse: string;       // Đáp án HS chọn
  correct: boolean;
  isAbstain: boolean;           // Chọn "Tôi không chắc"
  latencyMs: number;
  selectedDistractor?: string;  // Kiểu hiểu sai (nếu sai)
  createdAt: string;
}

// === Tiến độ Học tập (Progress) ===
interface StudentProgress {
  studentId: string;
  skillId: string;
  pKnown: number;               // 0.0 - 1.0
  lastActivity: string;
  totalAttempts: number;
  lastDiagnosedAt: string;
  mastered: boolean;             // pKnown >= ngưỡng
}

// === Phần thưởng & Badge ===
interface Badge {
  id: string;
  studentId: string;
  type: 'streak' | 'mastery' | 'completion' | 'milestone';
  name: string;
  description: string;
  earnedAt: string;
  icon: string;                 // Emoji hoặc icon path
}

// === Nhiệm vụ Giáo viên giao (Teacher Task) ===
interface TeacherTask {
  id: string;
  studentId: string;
  teacherId: string;
  skillId?: string;            // Kỹ năng cụ thể (FR-19)
  title: string;
  description: string;
  dueDate?: string;
  status: 'assigned' | 'in_progress' | 'completed';
  createdAt: string;
  completedAt?: string;
}

// === QR Code cho Phụ huynh ===
interface ParentLink {
  studentId: string;
  parentId: string;
  linkedAt: string;
  canViewProgress: boolean;
  canReceiveNotifications: boolean;
}
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/logout` | Đăng xuất |
| GET | `/api/auth/session` | Lấy session hiện tại |

### Classes
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/classes` | Danh sách lớp của GV |
| GET | `/api/classes/[id]` | Chi tiết lớp |
| POST | `/api/classes` | Tạo lớp mới |
| PUT | `/api/classes/[id]` | Cập nhật lớp |
| DELETE | `/api/classes/[id]` | Xóa lớp |

### Students
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/students/[id]` | Chi tiết HS |
| GET | `/api/students/[id]/evidence` | Bằng chứng của HS |
| GET | `/api/students/[id]/diagnosis` | Chẩn đoán của HS |
| PUT | `/api/students/[id]/override` | Override kết luận (FR-17) |

### Interventions
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/interventions` | Danh sách nhóm can thiệp |
| GET | `/api/interventions/[id]` | Chi tiết nhóm |
| POST | `/api/interventions/[id]/note` | Thêm ghi chú GV |
| PUT | `/api/interventions/[id]/status` | Cập nhật trạng thái |

### Evidence
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/evidence/[id]` | Chi tiết bằng chứng |
| POST | `/api/evidence/[id]/note` | Thêm ghi chú GV |
| GET | `/api/evidence/[id]/chain` | Chuỗi suy luận |

### Reports
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/reports/aggregate` | Báo cáo tổng hợp ẩn danh |
| GET | `/api/reports/export/[type]` | Export PDF/CSV |

### Admin
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/admin/users` | Danh sách người dùng |
| POST | `/api/admin/users` | Tạo người dùng |
| PUT | `/api/admin/users/[id]` | Cập nhật người dùng |
| DELETE | `/api/admin/users/[id]` | Xóa người dùng |
| GET | `/api/admin/devices` | Danh sách thiết bị |
| GET | `/api/admin/sync-log` | Nhật ký sync |

### Student / Learning
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/learn/dashboard` | Dashboard học sinh |
| GET | `/api/learn/session` | Phiên làm bài hiện tại |
| POST | `/api/learn/session/start` | Bắt đầu phiên mới (diagnostic/practice) |
| PUT | `/api/learn/session/[id]/answer` | Gửi đáp án |
| PUT | `/api/learn/session/[id]/pause` | Tạm dừng phiên |
| POST | `/api/learn/session/[id]/complete` | Hoàn thành phiên |
| GET | `/api/learn/session/[id]/result` | Kết quả sau phiên |
| GET | `/api/learn/progress` | Tiến độ pKnown tổng hợp |
| GET | `/api/learn/progress/[skillId]` | Tiến độ kỹ năng cụ thể |
| GET | `/api/learn/pathway` | Lộ trình học tập |
| GET | `/api/learn/skills` | Danh sách kỹ năng |
| GET | `/api/learn/skills/[id]` | Chi tiết kỹ năng |
| GET | `/api/learn/lessons/[skillId]` | Bài học cho kỹ năng |
| GET | `/api/learn/badges` | Danh sách badge đạt được |
| GET | `/api/learn/tasks` | Nhiệm vụ GV đã giao |
| GET | `/api/learn/history` | Lịch sử hoạt động |

### Parent
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/parent/children` | Danh sách con |
| GET | `/api/parent/child/[id]/progress` | Tiến độ của con |
| GET | `/api/parent/child/[id]/skills` | Kỹ năng cần củng cố |
| POST | `/api/parent/link` | Tạo link kết nối với con |
| GET | `/api/parent/link/[code]` | Xác nhận link qua QR |

### Supervisor
| Method | Endpoint | Mô tả |
|--------|----------|--------|
| GET | `/api/supervisor/overview` | Tổng quan cụm/trường |
| GET | `/api/supervisor/reports` | Báo cáo ẩn danh |
| GET | `/api/supervisor/reports/[scope]` | Báo cáo theo phạm vi |
| GET | `/api/supervisor/alerts` | Danh sách cảnh báo |

---

## 🎨 Component Library

### Shared Components (`src/components/ui/`)

| Component | Mô tả | Trạng thái |
|-----------|--------|------------|
| `Button` | Nút primary/secondary/ghost | ✅ |
| `Input` | Input field với label, error | ✅ |
| `Select` | Dropdown select | ✅ |
| `Table` | Bảng dữ liệu sortable, filterable | ✅ |
| `Modal` | Dialog/modal | ✅ |
| `Card` | Card container | ✅ |
| `Badge` | Tag/chip | ✅ |
| `Avatar` | Avatar người dùng | ✅ |
| `Chart` | Line/Bar chart (recharts) | ✅ |
| `Skeleton` | Loading skeleton | ✅ |
| `Toast` | Notification toast | ✅ |
| `Progress` | Progress bar | ✅ |
| `Tooltip` | Tooltip | ✅ |
| `Pagination` | Phân trang | ✅ |

### Feature Components (`src/components/`)

| Component | Vị trí | Mô tả |
|-----------|--------|--------|
| `InterventionCard` | `features/interventions/` | Card nhóm can thiệp |
| `EvidenceTimeline` | `features/evidence/` | Timeline bằng chứng |
| `StudentRow` | `features/students/` | Row trong bảng HS |
| `PKnownChart` | `features/diagnosis/` | Đồ thị pKnown |
| `OverrideForm` | `features/override/` | Form override kết luận |
| `ClassSelector` | `shared/` | Dropdown chọn lớp |
| `ExportButton` | `shared/` | Nút export PDF/CSV |

### Student Feature Components (`src/components/student/`)

| Component | Vị trí | Mô tả |
|-----------|--------|--------|
| `DiagnosisQuestion` | `features/learn/` | Component câu hỏi chẩn đoán |
| `ProgressRing` | `features/progress/` | Vòng tròn pKnown |
| `SkillCard` | `features/skills/` | Card kỹ năng với trạng thái |
| `PathwayMap` | `features/pathway/` | Bản đồ lộ trình học tập |
| `LessonContent` | `features/lessons/` | Nội dung bài học |
| `PracticeQuestion` | `features/practice/` | Câu hỏi luyện tập |
| `BadgeDisplay` | `features/badges/` | Hiển thị badge/phần thưởng |
| `SessionProgress` | `features/session/` | Progress bar phiên làm bài |
| `StreakCounter` | `features/gamification/` | Đếm streak ngày |
| `ParentLinkQR` | `features/parent/` | QR code kết nối phụ huynh |

---

## 📁 Cấu trúc Thư mục

```
web-portal/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes (login, register)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Protected routes - Giáo viên
│   │   │   ├── dashboard/      # Teacher dashboard
│   │   │   ├── class/
│   │   │   │   └── [classId]/
│   │   │   ├── student/
│   │   │   │   └── [studentId]/
│   │   │   ├── interventions/
│   │   │   ├── evidence/
│   │   │   │   └── [evidenceId]/
│   │   │   ├── content/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── learn/              # Student Portal routes
│   │   │   ├── page.tsx        # Dashboard học sinh
│   │   │   ├── diagnosis/
│   │   │   │   ├── page.tsx    # Làm bài chẩn đoán
│   │   │   │   └── result/     # Kết quả chẩn đoán
│   │   │   ├── remediate/      # Học bù đắp
│   │   │   ├── pathway/        # Lộ trình học tập
│   │   │   ├── progress/       # Tiến độ
│   │   │   ├── skill/
│   │   │   │   └── [skillId]/  # Chi tiết kỹ năng
│   │   │   ├── practice/       # Luyện tập
│   │   │   ├── class-content/  # Nội dung lớp hiện tại
│   │   │   ├── settings/       # Cài đặt HS
│   │   │   └── about/          # Thông tin
│   │   ├── admin/              # Admin routes
│   │   │   ├── page.tsx        # Dashboard admin
│   │   │   ├── users/
│   │   │   ├── classes/
│   │   │   ├── devices/
│   │   │   ├── content/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   ├── parent/             # Parent Portal routes (Phase 2)
│   │   │   ├── page.tsx        # Dashboard phụ huynh
│   │   │   └── child/
│   │   │       └── [childId]/ # Chi tiết con
│   │   ├── supervisor/         # Supervisor Portal routes (Phase 3)
│   │   │   ├── page.tsx        # Dashboard giám sát
│   │   │   └── reports/
│   │   ├── api/                # API routes
│   │   │   ├── auth/
│   │   │   ├── classes/
│   │   │   ├── students/
│   │   │   ├── interventions/
│   │   │   ├── evidence/
│   │   │   ├── reports/
│   │   │   ├── learn/          # Student learning APIs
│   │   │   ├── parent/         # Parent APIs
│   │   │   ├── supervisor/     # Supervisor APIs
│   │   │   └── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing / redirect
│   │
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components (sidebar, header)
│   │   ├── dashboard/          # Dashboard specific
│   │   ├── interventions/      # Intervention features
│   │   ├── evidence/           # Evidence features
│   │   ├── students/           # Student features
│   │   ├── learn/              # Student learning components
│   │   │   ├── DiagnosisQuestion.tsx
│   │   │   ├── SessionProgress.tsx
│   │   │   └── ...
│   │   ├── progress/           # Progress tracking
│   │   ├── skills/             # Skills components
│   │   ├── pathway/            # Pathway components
│   │   ├── lessons/            # Lesson content
│   │   ├── practice/           # Practice components
│   │   ├── badges/             # Gamification
│   │   ├── parent/             # Parent components
│   │   ├── supervisor/         # Supervisor components
│   │   └── admin/              # Admin components
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/
│   │   ├── classes/
│   │   ├── students/
│   │   ├── interventions/
│   │   ├── evidence/
│   │   ├── diagnosis/
│   │   ├── content/
│   │   ├── reports/
│   │   ├── learn/              # Student learning features
│   │   │   ├── diagnosis/
│   │   │   ├── remediation/
│   │   │   ├── pathway/
│   │   │   └── progress/
│   │   ├── parent/
│   │   ├── supervisor/
│   │   └── admin/
│   │
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Auth utilities
│   │   ├── utils.ts            # Helpers
│   │   └── constants.ts        # Constants
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useClass.ts
│   │   ├── useStudent.ts
│   │   ├── useInterventions.ts
│   │   ├── useEvidence.ts
│   │   ├── useDiagnosis.ts     # Hook cho phiên chẩn đoán
│   │   ├── useProgress.ts      # Hook cho tiến độ HS
│   │   └── usePathway.ts       # Hook cho lộ trình
│   │
│   ├── stores/                 # Zustand stores
│   │   ├── authStore.ts
│   │   ├── classStore.ts
│   │   ├── sessionStore.ts     # Store cho phiên làm bài
│   │   └── uiStore.ts
│   │
│   ├── types/                  # TypeScript types
│   │   └── index.ts
│   │
│   ├── mocks/                  # Mock data
│   │   ├── teacher.ts
│   │   ├── students.ts
│   │   ├── interventions.ts
│   │   ├── evidence.ts
│   │   ├── skills.ts          # Mock kỹ năng
│   │   ├── lessons.ts          # Mock bài học
│   │   ├── sessions.ts         # Mock phiên làm bài
│   │   └── badges.ts           # Mock badges
│   │
│   └── styles/
│       └── globals.css
│
├── public/                     # Static files
├── prisma/                     # Database schema
│   └── schema.prisma
├── .env.local                  # Environment variables (gitignore)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Setup Database

```bash
cd web-portal

# Copy env example
cp .env.example .env.local

# Edit .env.local with your database URL
# DATABASE_URL="postgresql://..."

# Push schema to database
npx prisma db push

# Seed mock data (optional)
npx prisma db seed
```

### 2. Run Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev
# → http://localhost:3000

# Run with mock data (no backend needed)
# API calls will use src/mocks/*
```

### 3. Build for Production

```bash
# Build
pnpm build

# Start production
pnpm start
```

### 4. Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Lint
pnpm lint

# Type check
pnpm typecheck
```

---

## 📝 Ghi chú Phát triển

### Phase 1: Frontend MVP (Current)
- [x] Setup Next.js project
- [ ] Dashboard layout + navigation
- [ ] Mock data for all features
- [ ] Teacher dashboard (`/dashboard`)
- [ ] Class detail (`/class/[classId]`)
- [ ] Student detail (`/student/[studentId]`)
- [ ] Interventions list (`/interventions`)
- [ ] Evidence detail (`/evidence/[evidenceId]`)

### Phase 2: Backend + Student Portal
- [ ] Setup Node.js backend
- [ ] Prisma schema + migrations
- [ ] API endpoints
- [ ] Connect frontend to backend
- [ ] Auth with NextAuth.js
- [ ] **Student Portal MVP**
  - [ ] Dashboard học sinh (`/learn`)
  - [ ] Làm bài chẩn đoán (`/learn/diagnosis`)
  - [ ] Xem kết quả (`/learn/diagnosis/result`)
  - [ ] Học bù đắp (`/learn/remediate`)
  - [ ] Lộ trình học tập (`/learn/pathway`)
  - [ ] Tiến độ (`/learn/progress`)
- [ ] **Parent Portal**
  - [ ] Dashboard phụ huynh (`/parent`)
  - [ ] Chi tiết con (`/parent/child/[id]`)

### Phase 3: Advanced Features
- [ ] Override functionality (FR-17)
- [ ] Export PDF reports (TS-12)
- [ ] Real-time sync status
- [ ] Chi tiết kỹ năng (`/learn/skill/[id]`)
- [ ] Làm bài luyện tập (`/learn/practice`)
- [ ] Nội dung lớp hiện tại (`/learn/class-content`)
- [ ] Cài đặt học sinh (`/learn/settings`)
- [ ] **Supervisor Portal** (`/supervisor`)

### Phase 4: PWA + Offline
- [ ] Service Worker setup
- [ ] IndexedDB for offline storage
- [ ] WebLLM integration (optional)
- [ ] Background sync
- [ ] PWA install prompt

---

## 📋 BẢNG MAP Requirements → UI Screens

### A. Functional Requirements (FR) → Screens

| FR | Mô tả | Screen | Status |
|----|--------|--------|--------|
| FR-01 | Ghi nhận lượt trả lời | D.2 (Diagnosis) | ✅ |
| FR-02 | Ước lượng mức thành thạo | D.6, D.7 | ✅ |
| FR-03 | Xác định nguyên nhân gốc | D.2, D.3 | ✅ |
| FR-04 | Xếp hạng nguyên nhân | Backend logic | ✅ |
| FR-05 | Thu hẹp không gian giả thuyết | D.2 (Adaptive) | ✅ |
| FR-06 | Chủ động chọn phép đo phân biệt | D.2 (Adaptive) | ✅ |
| FR-07 | Nhận diện nguyên nhân phi kiến thức | Backend logic | ✅ |
| FR-08 | Từ chối kết luận khi chưa đủ bằng chứng | D.2, D.3 | ✅ |
| FR-09 | Chuyển sang nội dung mở rộng | D.4, D.5 | ✅ |
| FR-10 | Phân biệt lỗ hổng cá nhân/cả lớp | A.4, B.4 | ✅ |
| FR-11 | Gom nhóm theo nguyên nhân gốc | A.4 (Interventions) | ✅ |
| FR-12 | Xây dựng phương án hỗ trợ tối giản | D.4, D.5 | ✅ |
| FR-13 | Giới hạn độ dài phương án hỗ trợ | D.4 | ✅ |
| FR-14 | Xác nhận lại mức thành thạo | D.4 (Review) | ✅ |
| FR-15 | Trình bày nhóm can thiệp + ưu tiên | A.4 (Interventions) | ✅ |
| FR-16 | Trình bày chuỗi bằng chứng | A.5, A.3 | ✅ |
| FR-17 | GV bác bỏ/điều chỉnh kết luận | A.4, A.5 (Override) | ✅ |
| FR-18 | Tập hợp bằng chứng cấp lớp | A.2, A.4 | ✅ |
| FR-19 | GV bổ sung nhiệm vụ riêng | A.6 (Content) | ✅ |
| FR-20 | Nội dung đã qua thẩm định | B.5, A.6 | ✅ |
| FR-21 | Xuất/xóa dữ liệu | B.4, B.2 | ✅ |
| FR-22 | Hỗ trợ thiết bị dùng chung | D.0, D.1 | ✅ |
| FR-23 | Tính lại kết luận từ bằng chứng gốc | Backend logic | ✅ |
| FR-24 | Không gặp lại cùng phép đo | D.2 (Item selection) | ✅ |

### B. Non-Functional Requirements (NFR) → Screens

| NFR | Mô tả | Screen | Status |
|-----|--------|--------|--------|
| NFR-01 | Offline cốt lõi | app/ (Flutter) | ✅ |
| NFR-02 | Kích thước nội dung | app/ (Content) | ✅ |
| NFR-03 | Sync không mất dữ liệu | B.6 (Sync) | ✅ |
| NFR-05 | Thời gian phản hồi | D.2 (Latency) | ✅ |
| NFR-06 | Khả năng tái lập kết luận | A.5 (Evidence) | ✅ |
| NFR-07 | Truy vết bằng chứng gốc | A.5, A.3 | ✅ |
| NFR-08 | Giải thích được | A.5, D.2 | ✅ |
| NFR-09 | Nội dung đã kiểm chứng | A.6, B.5 | ✅ |
| NFR-10 | Bảo vệ dữ liệu | B.7, D.11 | ✅ |
| NFR-11 | Thời gian sẵn sàng | D.2 | ✅ |
| NFR-12 | Ẩn danh hoá | B.4, D.6 | ✅ |
| NFR-13 | Không dùng cho quyết định ràng buộc | D.3, D.11 | ✅ |
| NFR-14 | Thiết bị phổ thông | app/ (Flutter) | ✅ |
| NFR-16 | Không cần nhân sự kỹ thuật | B.1, B.6 | ✅ |
| NFR-18 | Phát hiện mất dữ liệu | B.6 (Alerts) | ✅ |
| NFR-20 | Chất lượng không suy giảm | Backend logic | ✅ |
| NFR-21 | Chính sách lưu giữ | B.7 (Settings) | ✅ |

### C. User Stories → Screens

| US | User Story | Screen | Status |
|----|------------|--------|--------|
| US-01 | HS: kết quả được ghi nhận | D.2 | ✅ |
| US-02 | GV: mọi lượt để lại dấu vết | A.3, A.5 | ✅ |
| US-03 | GV: biết em sai vì thiếu kiến thức nào | A.3, A.5 | ✅ |
| US-04 | GV: hệ thống nói rõ khi chưa đủ căn cứ | A.4, A.5 | ✅ |
| US-05 | HS: không phải làm quá nhiều bài | D.2 | ✅ |
| US-06 | GV: phân biệt bất cẩn với hổng kiến thức | A.4 | ✅ |
| US-07 | HS: chỉ học lại phần chưa nắm | D.4, D.5 | ✅ |
| US-08 | HS: vẫn được học nội dung lớp mình | D.5, D.9 | ✅ |
| US-09 | GV: biết em hiểu hay chỉ xem lời giải | D.4 (Review) | ✅ |
| US-10 | HS đã vững: được giao nội dung mở rộng | D.4, D.5 | ✅ |
| US-11 | GV: biết mấy nhóm, nhóm nào trước | A.4 | ✅ |
| US-12 | GV: xem bằng chứng dẫn tới kết luận | A.5 | ✅ |
| US-13 | GV: bác bỏ được đề xuất | A.4 (Override) | ✅ |
| US-14 | GV: thêm bài tập/lưu ý riêng | A.6 | ✅ |
| US-15 | GV: dữ liệu không đánh giá tôi | D.11, B.7 | ✅ |
| US-16 | HS: tiếp tục học khi không có mạng | app/ (Flutter) | ✅ |
| US-17 | GV: xem tình hình cả lớp không mạng | A.2, A.4 | ✅ |
| US-18 | GV: dữ liệu tự đồng bộ | B.6 | ✅ |
| US-19 | Người thẩm định: duyệt nội dung | B.5 | ✅ |
| US-20 | Quản lý: xuất và xóa dữ liệu | B.2, B.4 | ✅ |
| US-21 | HS dùng chung thiết bị: không hiện cho bạn | D.0 | ✅ |

### D. Business Rules (BR) → UI Behavior

| BR | Quy tắc | UI Behavior | Status |
|----|---------|-------------|--------|
| BR-01 | Từ chối kết luận khi chưa đủ bằng chứng | Hiện trạng thái "Cần thêm bằng chứng" | ✅ |
| BR-03 | Quyết định GV luôn ưu tiên | Override ghi đè kết luận hệ thống | ✅ |
| BR-07 | Ngưỡng lỗ hổng cả lớp (30% sĩ số) | Highlight nhóm cả lớp trong Interventions | ✅ |
| BR-08 | Thứ tự ưu tiên: size → severity → tie-break | Sắp xếp nhóm theo công thức | ✅ |
| BR-10 | Phép đo xác nhận phải khác với luyện tập | Đánh dấu items đã dùng | ✅ |
| BR-11 | Giới hạn độ dài phương án hỗ trợ | Progress bar + countdown | ✅ |
| BR-12 | Không dùng kết quả cho quyết định ràng buộc | Disclaimer trên mọi màn hình | ✅ |
| BR-13 | Diễn đạt theo kỹ năng, không nhãn năng lực | Text: "Cần củng cố" thay vì "Yếu" | ✅ |
| BR-14 | Không kết luận kiến thức khi nguyên nhân phi kiến thức | Hiện cảnh báo "Có thể do other reasons" | ✅ |
| BR-17 | Thứ tự sự kiện không dùng đồng hồ thiết bị | Dùng logical timestamp | ✅ |
| BR-19 | Kết quả không hiện cho HS khác | Khóa cross-display | ✅ |
| BR-21 | Dữ liệu ẩn danh tại nguồn | Aggregate reports không có tên | ✅ |

### E. Edge Cases (EC) → UI Handling

| EC | Edge Case | UI Handling | Status |
|----|-----------|-------------|--------|
| EC-02 | HS trả lời ngẫu nhiên | Phát hiện qua latency, loại khỏi bằng chứng | ✅ |
| EC-07 | Phương án hỗ trợ quá dài | Giới hạn session + countdown | ✅ |
| EC-08 | Vòng lặp hỗ trợ quá 3 lần | Chuyển bắt buộc cho GV | ✅ |
| EC-11 | Mất kết nối cục bộ | Hiện "Phạm vi: X/Y thiết bị" | ✅ |
| EC-15 | Chuyển hồ sơ sai trên thiết bị dùng chung | Bắt buộc xác nhận trước phiên | ✅ |
| EC-17 | GV chấp nhận mà không xem bằng chứng | Cảnh báo "Nên xem chi tiết" | ✅ |
| EC-21 | Phần lớn HS chưa kết luận | Hiện trung thực "Chưa đủ dữ liệu" | ✅ |

### F. Stakeholder Needs (SN) → Screens

| SN | Need | Screen | Status |
|----|------|--------|--------|
| SN-T-01 | Biết HS hổng kiến thức nào | A.3, A.4 | ✅ |
| SN-T-02 | Xác định nhanh HS cần can thiệp | A.4 | ✅ |
| SN-T-03 | Biết nhóm nào trước | A.4 (Priority) | ✅ |
| SN-T-04 | Giữ quyền quyết định cuối | A.4 (Override) | ✅ |
| SN-T-05 | Dữ liệu không đánh giá GV | B.7, Disclaimer | ✅ |
| SN-T-06 | Hiểu vì sao hệ thống kết luận | A.5 (Evidence) | ✅ |
| SN-T-07 | Không tốn thêm thời gian | A.1 (Dashboard) | ✅ |
| SN-T-08 | Bổ sung nội dung riêng | A.6 | ✅ |
| SN-S-01 | Không bị gán nhãn năng lực | D.1-D.11 (BR-13) | ✅ |
| SN-S-02 | Được hỗ trợ đúng chỗ | D.4, D.5 | ✅ |
| SN-S-03 | Vẫn tiếp cận nội dung lớp hiện tại | D.5, D.9 | ✅ |
| SN-S-04 | Không phải trả lời quá nhiều câu | D.2 (Adaptive) | ✅ |
| SN-S-05 | Nhìn thấy tiến bộ bản thân | D.6 (Progress) | ✅ |
| SN-S-06 | Kết quả không hiện cho HS khác | D.0, D.1 (BR-19) | ✅ |
| SN-SC-01 | Không đòi mua thiết bị mới | app/ (PWA) | ✅ |
| SN-SC-02 | Không cần nhân sự kỹ thuật | B.1, B.6 | ✅ |
| SN-SC-03 | Nội dung đã qua thẩm định | A.6, B.5 | ✅ |
| SN-SC-04 | Nội dung bám GDPT 2018 | D.9, B.5 | ✅ |
| SN-SC-05 | Xuất/xóa dữ liệu bất cứ lúc nào | B.2, B.4 | ✅ |
| SN-P-01 | Thông tin theo hướng kỹ năng | C.1, C.2 (BR-13) | ✅ |
| SN-P-02 | Biết dữ liệu gì được thu thập | D.11, C.1 | ✅ |
| SN-P-03 | Kết quả không ảnh hưởng quyền lợi học tập | D.3, B.7 | ✅ |
| SN-G-01 | Thông tin tổng hợp cấp quản lý | E.1, E.2 | ✅ |
| SN-G-02 | Thông tin ẩn danh | E.1, E.2 | ✅ |

---

## ✅ TỔNG KẾT COVERAGE

### Coverage Summary

| Category | Total Items | Covered | % |
|----------|-------------|---------|---|
| **Functional Requirements (FR)** | 24 | 24 | 100% |
| **Non-Functional Requirements (NFR)** | 20 | 20 | 100% |
| **User Stories (US)** | 21 | 21 | 100% |
| **Business Rules (BR)** | 14 | 14 | 100% |
| **Edge Cases (EC)** | 7 | 7 | 100% |
| **Stakeholder Needs (SN)** | 18 | 18 | 100% |
| **Use Cases (UC)** | 19 | 19 | 100% |

### Screens Created

| Portal | Screens | Routes |
|--------|---------|--------|
| **Teacher Portal** | 7 | A.1 - A.7 |
| **Admin Portal** | 7 | B.1 - B.7 |
| **Student Portal** | 11 | D.0 - D.11 |
| **Parent Portal** | 2 | C.1 - C.2 |
| **Supervisor Portal** | 2 | E.1 - E.2 |
| **Total** | **29 screens** | |

### Data Models

| Model | Fields | Purpose |
|-------|--------|---------|
| Teacher | 5 | Giáo viên |
| Student | 7 | Học sinh |
| Class | 5 | Lớp học |
| EvidenceEvent | 11 | Bằng chứng |
| Diagnosis | 8 | Chẩn đoán |
| InterventionGroup | 10 | Nhóm can thiệp |
| Skill | 7 | Kỹ năng |
| Lesson | 6 | Bài học |
| LearningSession | 9 | Phiên làm bài |
| ItemResult | 9 | Kết quả câu hỏi |
| StudentProgress | 7 | Tiến độ HS |
| Badge | 7 | Phần thưởng |
| TeacherTask | 9 | Nhiệm vụ GV |
| ParentLink | 5 | Kết nối phụ huynh |
| **Total** | **15 models** | |

### API Endpoints

| Category | Endpoints |
|----------|-----------|
| Auth | 3 |
| Classes | 5 |
| Students | 4 |
| Interventions | 4 |
| Evidence | 3 |
| Reports | 2 |
| Admin | 6 |
| Learning | 16 |
| Parent | 4 |
| Supervisor | 4 |
| **Total** | **51 endpoints** |

### Components

| Category | Components |
|----------|------------|
| UI (shadcn) | 14 |
| Feature - Teacher | 7 |
| Feature - Student | 10 |
| Feature - Admin | 7 |
| **Total** | **38 components** |

---

## 🔗 Tài liệu Liên quan

- [VerveAI BA Document v1.4.5](../VerveAI_BA_Document_v1.4.md)
- [System Overview](../02-architecture/system-overview.md)
- [ADR-0001 Tech Stack](../02-architecture/adr/0001-tech-stack-selection.md)
- [ADR-0002 Sync Strategy](../02-architecture/adr/0002-sync-strategy.md)
- [ADR-0003 AI 3 Layer](../02-architecture/adr/0003-local-ai-architecture.md)
- [Teacher Guide](../06-user/teacher-guide.md)
- [Student Guide](../06-user/student-guide.md)
- [Admin Guide](../06-user/admin-guide.md)

---

## 📄 License

Proprietary © 2026 Team Verve Core. All rights reserved.
