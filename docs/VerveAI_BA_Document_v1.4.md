# TÀI LIỆU PHÂN TÍCH NGHIỆP VỤ (BUSINESS ANALYSIS DOCUMENT)

## LEAPS — Local Educational Adaptive Personalization System

*(Tên mã nguồn: **VerveAI** · App: **Verve**)*

| **Phiên bản**        | **1.4.5**                                                                                                                                                                                             |



|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Ngày lập**         | 16/08/2026                                                                                                                                                                                            |
| **Cập nhật**         | 22/08/2026 — bản 1.4: đóng nốt hai mâu thuẫn còn mở G9 và G10 (xem Phụ lục G mục G.1) — bổ sung RACI vận hành tại Mục 2.4.2 và tách lại 3 ngưỡng sơ bộ tại Mục 17.2. 03/09/2026 — bản 1.4.4: đổi tên dự án NekoPath → **VerveAI**; ưu tiên `web-portal/` (Next.js) → `app/` (Flutter PWA sau). 03/09/2026 — bản 1.4.5: đổi tên folder từ **ioes_verveai_2026** → **leaps_verveai_2026**. Xem Phụ lục C — Lịch sử thay đổi |



| **Đơn vị**           | Team Verve Core                                                                                                                                                                                        |
| **Bối cảnh**         | AI Thực chiến 2026                                                                                                                                                                                    |
| **Trạng thái**       | Draft — chờ đóng các mục ở phần BA Open Items                                                                                                                                                         |
| **Phạm vi tài liệu** | Phân tích nghiệp vụ. **Không phải** tài liệu thiết kế giải pháp hoàn chỉnh. Phụ lục F chứa lựa chọn công nghệ dự kiến ở trạng thái tạm                                                                |

### QUY ƯỚC NHÃN BẰNG CHỨNG

Mọi phát biểu trong tài liệu này đều được gắn nhãn mức độ chắc chắn:

| **Nhãn**             | **Ý nghĩa**                                            |
|----------------------|--------------------------------------------------------|
| **[F]** Fact       | Có dữ liệu, văn bản hoặc quan sát trực tiếp làm căn cứ |
| **[I]** Inference  | Suy luận hợp lý từ Fact, chưa xác minh trực tiếp       |
| **[A]** Assumption | Đang giả định, chưa có căn cứ                          |
| **[TBD]**          | Cần xác minh trước khi kết luận                        |

**Nguyên tắc biên soạn:** tài liệu tuân thủ chuỗi *Problem → Need → Requirement → Solution*. Mọi ý tưởng công nghệ (biểu diễn tri thức dạng đồ thị, ứng dụng chạy ngoại tuyến, màn hình tổng hợp cho giáo viên, mô hình ngôn ngữ lớn, cơ chế lưu trữ cục bộ) **không** được coi là yêu cầu. Chúng chỉ xuất hiện tại **Mục 14 — Solution Candidates**.

### QUY ƯỚC MÃ ĐỊNH DANH

| **Tiền tố** | **Loại**                                                |
|-------------|---------------------------------------------------------|
| BO          | Business Objective                                      |
| SH          | Stakeholder                                             |
| SN          | Stakeholder Need                                        |
| GAP         | Gap                                                     |
| AS          | Assumption                                              |
| CO          | Constraint                                              |
| BR          | Business Rule                                           |
| FR          | Functional Requirement                                  |
| NFR         | Non-Functional Requirement                              |
| DR          | Data Requirement                                        |
| AIR         | AI Requirement                                          |
| UC          | Use Case                                                |
| EC          | Edge Case                                               |
| AC          | Acceptance Criteria — **luôn ở dạng số**: AC-001        |
| ACT         | Actor — **luôn ở dạng chữ**: ACT-T, ACT-S               |
| RK          | Risk                                                    |
| SC          | Solution Candidate                                      |
| OQ          | Open Question                                           |
| P           | Problem — thành phần bài toán, định nghĩa tại Mục 1.3.4 |
| BRQ         | Business Requirement                                    |
| SR          | Stakeholder Requirement                                 |
| IS / OS     | In Scope / Out of Scope                                 |
| DEP         | Dependency                                              |
| US          | User Story                                              |
| TS          | Tech Stack — lựa chọn công nghệ dự kiến, Phụ lục F      |

---

# 1. TỔNG QUAN BÀI TOÁN

## 1.1. Tên dự án

**VerveAI — Adaptive Learning Support for Mixed-Ability Classrooms** (Hỗ trợ học tập thích ứng cho lớp học đa trình độ)

## 1.2. Bối cảnh bài toán

### 1.2.1. Lớp học đa trình độ là gì

Lớp học đa trình độ (mixed-ability classroom) là lớp học trong đó học sinh cùng một khối lớp có mức độ nắm vững kiến thức nền chênh lệch đáng kể. **[F]**

**Phạm vi mục tiêu:** Dự án nhắm vào giáo dục Toán ở bậc trung học cơ sở (lớp 5-7), với phạm vi nội dung thử nghiệm là phân số → tỷ lệ thức.

Trong môn Toán, sự chênh lệch này mang tính tích luỹ: kiến thức Toán có cấu trúc phụ thuộc, nội dung sau xây trên nội dung trước. Một học sinh chưa vững phân số ở lớp 5 sẽ tiếp tục gặp khó khăn ở tỷ lệ thức lớp 7, và khoảng cách nới rộng theo thời gian thay vì thu hẹp lại. **[I]**

### 1.2.2. Vấn đề giáo viên đang gặp

Tín hiệu duy nhất giáo viên nhận được từ hoạt động đánh giá hiện hành là **đúng hoặc sai**. Tín hiệu này không mang thông tin về nguyên nhân. **[F]**

Ba học sinh cùng sai một bài toán tỷ lệ thức có thể xuất phát từ ba nguyên nhân gốc khác nhau: chưa vững phân số tương đương, chưa hiểu ý nghĩa của tỷ số, hoặc bằng chứng chưa đủ để kết luận. Ba nguyên nhân này đòi hỏi ba can thiệp khác nhau, nhưng biểu hiện bên ngoài giống hệt nhau. **[F]** *(Tài liệu logic nghiệp vụ VerveAI, mục 1)*

### 1.2.3. Tại sao vấn đề nghiêm trọng hơn trong lớp đông

Chi phí cá nhân hoá tăng tuyến tính theo sĩ số. Với lớp 40–45 học sinh, việc chẩn đoán riêng từng em rồi thiết kế 40 lộ trình riêng vượt quá khả năng thực hiện của một giáo viên trong 45 phút. **[I]**

Hệ quả quan sát được trong thực tế giảng dạy: giáo viên buộc phải dạy theo học sinh ở mức trung bình. Nhóm đã vững thấy nhàm chán, nhóm hổng nền không theo kịp, và cả hai nhóm cùng không được phục vụ. **[I] — cần xác minh qua phỏng vấn (OQ-01)**

### 1.2.4. Tại sao vấn đề này quan trọng

Nợ kiến thức nền không tự biến mất. Nó được mang theo sang chương sau, lớp sau, và biểu hiện thành kết quả học tập suy giảm dần cùng với việc học sinh dần quy nguyên nhân về năng lực bản thân thay vì về một lỗ hổng cụ thể có thể khắc phục. **[I]**

### 1.2.5. Đặc thù môi trường băng thông thấp và ngoại tuyến

Nhóm học sinh chịu thiệt thòi nhiều nhất từ vấn đề trên thường học tại các địa bàn có hạ tầng kết nối không ổn định. **[A] — cần khảo sát (OQ-07)**

Điều này tạo ra một ràng buộc kép: giải pháp phải hoạt động được ở nơi có ít hạ tầng nhất, trong khi chính nơi đó lại là nơi có nhu cầu cao nhất. Bất kỳ giải pháp nào chỉ hoạt động khi có kết nối ổn định sẽ phục vụ được nhóm ít cần nhất và bỏ lại nhóm cần nhất.

**Phân tầng điều kiện kết nối cần xem xét:**

| **Tầng** | **Mô tả**                                                                     | **Ghi chú**                 |
|----------|-------------------------------------------------------------------------------|-----------------------------|
| T0       | Không có kết nối tại phòng học; chỉ có kết nối ở nơi khác, không thường xuyên | Điều kiện thiết kế mục tiêu |
| T1       | Kết nối di động không ổn định, băng thông thấp, hay gián đoạn                 | Phổ biến                    |
| T2       | Kết nối chỉ ở một khu vực nhất định trong trường, theo lịch                   | Trường có điều kiện hơn     |
| T3       | Kết nối ổn định                                                               | Khu vực thành thị           |

**[A] — phân tầng này là giả thuyết làm việc, chưa được khảo sát thực địa xác nhận.**

## 1.3. Problem Statement

### 1.3.1. Phát biểu chính

> **Giáo viên Toán tại lớp học đông và đa trình độ cần một cách để biết được từng học sinh đang hổng kiến thức nền nào và gom cả lớp lại thành một số ít nhóm can thiệp trong khoảng thời gian ngắn — bởi vì tín hiệu đúng/sai mà họ nhận được không mang thông tin về nguyên nhân, khiến họ buộc phải dạy theo học sinh ở mức trung bình và nhìn nhóm yếu tụt xa thêm sau mỗi tuần.**

### 1.3.2. Phân rã theo bốn câu hỏi bắt buộc

| **Câu hỏi**                          | **Trả lời**                                                                                                                                                                                                    | **Nhãn**  |
|--------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| **Ai đang gặp vấn đề?**              | Giáo viên Toán phụ trách nhiều lớp đa trình độ, sĩ số lớn. Đồng thời là học sinh có lỗ hổng kiến thức nền chưa được định vị                                                                                    | **[F]** |
| **Họ đang cố làm gì?**               | Đưa đúng sự hỗ trợ tới đúng học sinh trong thời lượng một tiết học, mà không bỏ rơi phần còn lại của lớp                                                                                                       | **[I]** |
| **Tại sao hiện tại không làm được?** | Hoạt động đánh giá hiện hành đo *kết quả*, không đo *nguyên nhân*. Không tồn tại ánh xạ từ "câu này sai" sang "kiến thức nền nào chưa vững", và không có cơ chế cho biết bằng chứng đã đủ để kết luận hay chưa | **[F]** |
| **Hậu quả là gì?**                   | Can thiệp sai chỗ hoặc không can thiệp; nợ kiến thức tích luỹ; khoảng cách trong lớp nới rộng; học sinh yếu dần buông môn học                                                                                  | **[I]** |

### 1.3.3. Kiểm tra chất lượng phát biểu

| **Tiêu chí**                              | **Kết quả**                                                                                                 |
|-------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| Có chứa giải pháp không?                  | Không. Không nhắc tới công nghệ, kiến trúc hay tính năng cụ thể                                             |
| Có phải vấn đề kinh doanh trá hình không? | Không. Không nhắc doanh thu, thị phần                                                                       |
| Có phải yêu cầu tính năng không?          | Không                                                                                                       |
| Persona đủ cụ thể chưa?                   | Có. Giáo viên Toán, nhiều lớp, sĩ số lớn                                                                    |
| Đo lường được không?                      | Được. Số nhóm can thiệp trên mỗi lớp; thời gian từ dữ liệu tới quyết định; độ chênh nhóm yếu theo thời gian |

### 1.3.4. Ba thành phần bài toán — mã P

Phát biểu vấn đề ở 1.3.1 phân rã thành ba thành phần độc lập. Mã **P1 / P2 / P3** được dùng xuyên suốt tài liệu ở các cột *Truy về* và *Source* (Mục 2.2, 5.1, 6.3, 11).

| **Mã** | **Thành phần bài toán**                                                                                                                                     | **Gap tương ứng**                                                      |
|--------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| **P1** | Không định vị được **nguyên nhân** của lỗi ở cấp kỹ năng, và không biết khi nào bằng chứng đã đủ để kết luận                                                | GAP-01, GAP-02, GAP-05, GAP-06, GAP-07, GAP-08, GAP-09, GAP-11, GAP-13 |
| **P2** | Không nén được số quyết định can thiệp xuống mức một giáo viên xử lý được trong một tiết, và chưa xác lập ranh giới quyền quyết định giữa người và hệ thống | GAP-03, GAP-04, GAP-12                                                 |
| **P3** | Không phục vụ được địa bàn không có kết nối — nơi có nhu cầu cao nhất                                                                                       | GAP-10                                                                 |

## 1.4. Business Objectives

| **ID**    | **Business Objective**                                                                        | **Rationale**                                                                             | **Success Indicator**                                               | **Evidence Status**                        |
|-----------|-----------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|---------------------------------------------------------------------|--------------------------------------------|
| **BO-01** | Rút ngắn thời gian từ khi lỗ hổng kiến thức hình thành đến khi được phát hiện                 | Trong khoảng thời gian chờ bài kiểm tra định kỳ, học sinh tiếp tục học trên nền chưa vững | Độ trễ phát hiện (đơn vị: ngày/tiết học) — **Target TBD**           | **[I]** — độ trễ hiện tại chưa đo        |
| **BO-02** | Cho phép một giáo viên thực hiện dạy phân hoá trong lớp đông mà không tăng thời gian chuẩn bị | Nếu làm tăng khối lượng công việc, giáo viên sẽ ngừng sử dụng                             | Thời gian giáo viên bỏ ra mỗi tuần so với hiện tại — **Target TBD** | **[I]** — quỹ thời gian hiện tại chưa đo |
| **BO-03** | Giảm số lượng quyết định can thiệp mà giáo viên phải ra cho mỗi lớp                           | Cá nhân hoá chi phí O(n) là bất khả thi; cần cơ chế nén                                   | Số nhóm can thiệp trên mỗi lớp — **Target TBD**                     | **[I]**                                  |
| **BO-04** | Giảm tỷ lệ học sinh mang nợ kiến thức nền sang chương/lớp kế tiếp                             | Đây là kết quả cuối cùng mọi bên đều thừa nhận là đáng giá                                | Tỷ lệ học sinh đạt chuẩn kiến thức nền — **Target TBD**             | **[A]** — tỷ lệ nền hiện tại chưa có     |
| **BO-05** | Triển khai được tại cơ sở giáo dục không có hạ tầng CNTT và không có nhân sự kỹ thuật         | Nhóm đối tượng ưu tiên nằm ở địa bàn hạ tầng hạn chế                                      | Số ngày hoạt động liên tục không phụ thuộc kết nối — **Target TBD** | **[A]** — chưa khảo sát                  |
| **BO-06** | Không tạo ra rủi ro pháp lý hoặc đạo đức đối với dữ liệu người học chưa thành niên            | Một sự cố đủ để chấm dứt dự án và gây ảnh hưởng tới cơ sở giáo dục                        | Không có sự cố; có cơ sở pháp lý được rà soát                       | **[F]** — ràng buộc pháp lý tồn tại      |
| **BO-07** | Hiệu quả phải kiểm chứng được bởi bên độc lập, không chỉ tự báo cáo                           | Kết quả tự đánh giá trên dữ liệu tự sinh không có giá trị chứng minh                      | Có báo cáo đánh giá của bên thứ ba                                  | **[F]**                                  |
| **BO-08** | Không làm trầm trọng thêm khoảng cách giữa nhóm học sinh mạnh và nhóm yếu                     | Hệ thống thích ứng có khả năng khoá nhóm yếu trong vòng lặp học bù kéo dài                | So sánh tiến bộ giữa các nhóm năng lực — **Target TBD**             | **[I]**                                  |

> **Ghi chú quan trọng:** không có Business Objective nào được gán chỉ tiêu số cụ thể trong phiên bản này. Toàn bộ chỉ tiêu ghi **TBD** vì chưa có số liệu nền (baseline) từ thực tế. Đặt chỉ tiêu trước khi có số liệu nền sẽ tạo ra chỉ tiêu không có căn cứ.

## 1.5. Success Criteria

### 1.5.1. Business Success

| **Tiêu chí** | **Nội dung**                                                                   | **Nhãn**    |
|--------------|--------------------------------------------------------------------------------|-------------|
| BS-1         | Cơ sở giáo dục đồng ý tiếp tục sử dụng sau giai đoạn thử nghiệm                | **[TBD]** |
| BS-2         | Có ít nhất một báo cáo đánh giá độc lập về phương pháp                         | **[TBD]** |
| BS-3         | Chi phí triển khai không vượt quá khả năng chi trả của cơ sở giáo dục công lập | **[TBD]** |

### 1.5.2. Teacher Success

| **Tiêu chí** | **Nội dung**                                                                                                                                      | **Nhãn**                       |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------|
| TS-1         | Giáo viên sử dụng chủ động, không cần nhắc nhở, trong nhiều tuần liên tiếp                                                                        | **[TBD]**                    |
| TS-2         | Giáo viên thực hiện được can thiệp cụ thể xuất phát từ thông tin hệ thống cung cấp                                                                | **[TBD]**                    |
| TS-3         | Tỷ lệ giáo viên ghi đè kết luận của hệ thống nằm trong dải hợp lý — quá cao nghĩa là hệ thống sai, quá thấp nghĩa là giáo viên chấp nhận thụ động | **[A]** — dải hợp lý **TBD** |
| TS-4         | Giáo viên giải thích lại được cho người khác vì sao hệ thống đưa ra kết luận đó                                                                   | **[TBD]**                    |

### 1.5.3. Student Success

| **Tiêu chí** | **Nội dung**                                                                                       | **Nhãn**    |
|--------------|----------------------------------------------------------------------------------------------------|-------------|
| SS-1         | Học sinh hoàn thành được lộ trình học bù được giao                                                 | **[TBD]** |
| SS-2         | Mức thành thạo kiến thức nền được xác nhận bằng phép đo độc lập, giữ được sau một khoảng thời gian | **[TBD]** |
| SS-3         | Học sinh tiếp tục sử dụng sau nhiều tuần, không bỏ giữa chừng                                      | **[TBD]** |
| SS-4         | Không có học sinh nào bị giữ trong vòng lặp học bù quá giới hạn cho phép                           | **[TBD]** |

### 1.5.4. Diagnostic / AI Success

| **Tiêu chí** | **Nội dung**                                                                | **Nhãn**                                           |
|--------------|-----------------------------------------------------------------------------|----------------------------------------------------|
| DS-1         | Kết luận về nguyên nhân gốc phù hợp với chẩn đoán độc lập của chuyên gia    | **[TBD]** — phụ thuộc AS-02                      |
| DS-2         | **Không có trường hợp hệ thống kết luận sai trong khi báo mức tin cậy cao** | **[F]** — đây là chính sách thiết kế, target = 0 |
| DS-3         | Tỷ lệ từ chối kết luận nằm trong dải sử dụng được                           | **[A]** — dải **TBD**                            |
| DS-4         | Số phép đo cần thiết để đạt kết luận nằm trong mức học sinh chấp nhận được  | **[TBD]**                                        |

### 1.5.5. Technical Success

| **Tiêu chí** | **Nội dung**                                                               | **Nhãn**                                         |
|--------------|----------------------------------------------------------------------------|--------------------------------------------------|
| TC-1         | Chức năng cốt lõi hoạt động liên tục khi không có kết nối                  | **[F]** — yêu cầu bắt buộc, thời lượng **TBD** |
| TC-2         | Không mất dữ liệu trong quá trình đồng bộ, kể cả khi gián đoạn giữa chừng  | **[F]** — target = 0                           |
| TC-3         | Hoạt động được trên thiết bị phổ thông đời cũ đang có tại địa bàn mục tiêu | **[A]** — cấu hình cụ thể **TBD**              |
| TC-4         | Mọi kết luận tính lại được từ dữ liệu gốc                                  | **[F]**                                        |

## 1.6. Evidence Status

### 1.6.1. Facts — đã có căn cứ

| **#** | **Nội dung**                                                                                                                                                                            | **Nguồn**                                          |
|--------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| F-01   | Một đáp án sai có thể xuất phát từ nhiều nguyên nhân gốc khác nhau                                                                                                                      | Tài liệu logic nghiệp vụ, mục 1; bản chất bài toán |
| F-02   | Kiến thức Toán có cấu trúc phụ thuộc giữa các nội dung                                                                                                                                  | Chương trình GDPT 2018                             |
| F-03   | Đội đã xây dựng bản thử nghiệm engine chẩn đoán và chạy trên 24 hồ sơ mô phỏng, kết quả: 19/24 đúng kết cục kỳ vọng, 83,3% đúng nguyên nhân gốc hàng đầu, 0 trường hợp tự tin nhưng sai | Tài liệu logic nghiệp vụ, mục 8                    |
| F-04   | Dữ liệu dùng ở F-03 là dữ liệu mô phỏng do chính đội sinh ra từ cùng bộ giả định mà engine sử dụng                                                                                      | Tài liệu logic nghiệp vụ, mục 8                    |
| F-05   | Chưa có bất kỳ dữ liệu nào từ học sinh thật                                                                                                                                             | Tài liệu logic nghiệp vụ, mục 8                    |
| F-06   | Phạm vi nội dung đã thử nghiệm giới hạn ở một lát cắt: phân số → tỷ lệ thức                                                                                                             | Tài liệu logic nghiệp vụ, mục 8                    |
| F-07   | Đồ thị nội dung hiện tại là bản nháp, chưa qua rà soát chuyên môn                                                                                                                       | Tài liệu logic nghiệp vụ, mục 8                    |

> **Diễn giải bắt buộc đối với F-03 và F-04:** dữ liệu mô phỏng được sinh ra từ cùng bộ giả định mà hệ thống dùng để suy luận. Kết quả 83,3% vì vậy chứng minh **phần mềm vận hành đúng như thiết kế**, không chứng minh **thiết kế đúng với học sinh thật**. Đây là kiểm tra tính nhất quán nội bộ (self-consistency check), không phải kết quả đánh giá. Cỡ mẫu n = 24 cũng quá nhỏ để cho ra khoảng tin cậy hữu ích.

### 1.6.2. Inferences — suy luận hợp lý, chưa xác minh

| **#** | **Nội dung**                                                                                                                                            |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| I-01   | Chi phí cá nhân hoá tăng tuyến tính theo sĩ số, vượt khả năng của giáo viên ở lớp đông                                                                  |
| I-02   | Giáo viên hiện dạy theo học sinh mức trung bình do không có thông tin phân hoá                                                                          |
| I-03   | Nợ kiến thức nền tích luỹ và biểu hiện thành suy giảm kết quả ở các lớp trên                                                                            |
| I-04   | Khác biệt cạnh tranh thật nằm ở cơ chế từ chối kết luận khi thiếu bằng chứng và ở việc gom nhóm theo nguyên nhân, không nằm ở khái niệm "học thích ứng" |
| I-05   | Hoạt động ngoại tuyến là điều kiện cần để tiếp cận địa bàn khó khăn, không phải điểm bán hàng chính                                                     |

### 1.6.3. Assumptions — đang giả định

Xem đầy đủ tại **Mục 5.3**. Tổng cộng **60 giả định**, trong đó **12 giả định nếu sai sẽ làm mất lý do tồn tại của sản phẩm**.

Bảy giả định chịu lực chính:

| **ID** | **Assumption**                                                                    |
|--------|-----------------------------------------------------------------------------------|
| AS-01  | Giáo viên **chưa biết** nguyên nhân gốc của từng học sinh                         |
| AS-02  | **Tồn tại một đáp án đúng** cho câu hỏi "nguyên nhân gốc là gì"                   |
| AS-03  | Chuỗi *chẩn đoán đúng → can thiệp đúng → kết quả học tốt hơn* không đứt ở mắt nào |
| AS-04  | Mỗi lỗi có **một** nguyên nhân gốc chi phối                                       |
| AS-05  | Học sinh cố gắng làm đúng và tự làm bài                                           |
| AS-06  | Giáo viên **được phép** thay đổi cách tổ chức tiết học                            |
| AS-07  | Lỗ hổng là **thiếu** kiến thức, không phải **hiểu sai** kiến thức                 |

### 1.6.4. Open Questions

| **ID**    | **Câu hỏi**                                                                                                                      | **Ai trả lời**               | **Mức chặn**               |
|-----------|----------------------------------------------------------------------------------------------------------------------------------|------------------------------|----------------------------|
| **OQ-01** | Giáo viên hiện chẩn đoán nguyên nhân bằng cách nào, và chẩn đoán chính xác đến đâu?                                              | Giáo viên                    | Chặn định vị sản phẩm      |
| **OQ-02** | Ba chuyên gia độc lập có đồng thuận khi chẩn đoán cùng một bài làm không?                                                        | Giáo viên                    | **Chặn khả năng đo lường** |
| **OQ-03** | Nội quy nhà trường có cho phép học sinh sử dụng thiết bị trong lớp không?                                                        | Hiệu trưởng                  | **Chặn kiến trúc**         |
| **OQ-04** | Bao nhiêu học sinh dùng chung một thiết bị?                                                                                      | Hiệu trưởng                  | **Chặn kiến trúc**         |
| **OQ-05** | Ai có thẩm quyền thẩm định mô hình cấu trúc kiến thức, và năng suất thẩm định là bao nhiêu?                                      | Tổ trưởng chuyên môn         | **Chặn quy mô**            |
| **OQ-06** | Quỹ thời gian thực tế của giáo viên dành cho việc chuẩn bị và theo dõi là bao nhiêu?                                             | Giáo viên                    | Chặn thiết kế              |
| **OQ-07** | Điều kiện kết nối và thiết bị thực tế tại địa bàn mục tiêu?                                                                      | Hiệu trưởng                  | Chặn thiết kế              |
| **OQ-08** | Cơ sở pháp lý để xử lý dữ liệu cá nhân của người học chưa thành niên là gì, và ai có thẩm quyền đồng ý?                          | Bộ phận pháp lý / Nhà trường | **Chặn triển khai**        |
| **OQ-09** | Ngân hàng câu hỏi nguồn có ràng buộc bản quyền nào?                                                                              | Bộ phận pháp lý              | **Chặn thương mại hoá**    |
| **OQ-10** | Tỷ lệ lỗi có nguyên nhân phi kiến thức (bất cẩn, đọc hiểu, đoán mò) là bao nhiêu?                                                | Nghiên cứu bài làm thật      | Chặn thuật toán            |
| **OQ-11** | Phụ huynh phản ứng thế nào với cơ chế truy ngược về kiến thức lớp dưới?                                                          | Phụ huynh (qua giáo viên)    | Chặn truyền thông          |
| **OQ-12** | Phân phối chương trình và quy định về giáo án có cho phép giáo viên tổ chức nhiều nhóm hoạt động khác nhau trong một tiết không? | Tổ trưởng chuyên môn         | **Chặn tính khả thi**      |

---

# 2. PHÂN TÍCH STAKEHOLDER

## 2.1. Stakeholder Register

| **ID**    | **Stakeholder**                             | **Vai trò**                                             | **Nhu cầu**                                                 | **Pain Point**                                               | **Power**                    | **Interest** | **Risk nếu bỏ qua**                            |
|-----------|---------------------------------------------|---------------------------------------------------------|-------------------------------------------------------------|--------------------------------------------------------------|------------------------------|--------------|------------------------------------------------|
| **SH-01** | Giáo viên Toán                              | Người dùng chính; người quyết định sử dụng trên thực tế | Biết ai cần giúp và giúp cái gì, trong quỹ thời gian sẵn có | Chỉ có tín hiệu đúng/sai; không đủ thời gian hỏi từng em     | Cao *(quyền phủ quyết ngầm)* | Rất cao      | **Không sử dụng — sản phẩm mất lý do tồn tại** |
| **SH-02** | Học sinh                                    | Người thụ hưởng                                         | Theo kịp lớp mà không phải học lại thứ đã biết              | Được giao "làm lại bài sai" trong khi lỗ hổng nằm ở lớp dưới | Thấp                         | Rất cao      | Ngừng sử dụng; dữ liệu không đủ để chẩn đoán   |
| **SH-03** | Tổ trưởng chuyên môn                        | Người thẩm định nội dung                                | Nội dung đúng chuẩn, đồng nghiệp không phàn nàn             | Chịu trách nhiệm chuyên môn nếu nội dung sai                 | Trung bình                   | Cao          | Chặn ở khâu thẩm định; nút thắt năng suất      |
| **SH-04** | Hiệu trưởng                                 | Người phê duyệt triển khai                              | Không phát sinh rủi ro, không phát sinh ngân sách           | Không có nhân sự kỹ thuật để vận hành                        | Cao                          | Trung bình   | Không cho phép triển khai                      |
| **SH-05** | Phòng / Sở Giáo dục                         | **Người mua**                                           | Phù hợp chủ trương; có số liệu báo cáo                      | Mua phần mềm rồi không ai dùng                               | Cao nhất                     | Trung bình   | Không có nguồn doanh thu                       |
| **SH-06** | Phụ huynh                                   | Bên chịu tác động gián tiếp                             | Con tiến bộ; thông tin minh bạch                            | Lo con bị đánh giá thấp                                      | Thấp–Trung bình              | Cao          | Phản đối; tạo áp lực ngược lên giáo viên       |
| **SH-07** | Người biên soạn nội dung                    | Nhà cung cấp đầu vào                                    | Khối lượng công việc khả thi; được ghi nhận                 | Khối lượng thẩm định lớn, không có thù lao tương xứng        | Thấp                         | Trung bình   | Nút thắt tiến độ và quy mô                     |
| **SH-08** | Đơn vị chuyên môn giáo dục (trường sư phạm) | Đánh giá độc lập                                        | Phương pháp chặt chẽ; có dữ liệu nghiên cứu                 | Rủi ro uy tín khi gắn tên vào sản phẩm chưa kiểm chứng       | Thấp                         | Trung bình   | Mất kênh xác nhận độc lập (ảnh hưởng BO-07)    |
| **SH-09** | Đội phát triển                              | Nhà cung cấp giải pháp                                  | Phạm vi rõ ràng; đủ thời gian                               | Phạm vi thay đổi; thiếu quyền tiếp cận hiện trường           | Trung bình                   | Rất cao      | Nội bộ                                         |
| **SH-10** | Hội đồng đánh giá (bối cảnh cuộc thi)       | Người đánh giá ngắn hạn                                 | Chiều sâu phương pháp; bằng chứng trung thực                | Sản phẩm chỉ dừng ở mức trình diễn                           | Cao *(ngắn hạn)*             | Cao          | Không đạt kết quả tại kỳ đánh giá              |

## 2.2. Stakeholder Needs

Phần này mô tả **nhu cầu**, không mô tả tính năng.

### 2.2.1. Giáo viên (SH-01)

| **ID**      | **Stakeholder Need**                                                                  | **Truy về**        | **Nhãn**  |
|-------------|---------------------------------------------------------------------------------------|--------------------|-----------|
| **SN-T-01** | Biết được từng học sinh đang hổng kiến thức nền nào, không chỉ biết điểm cao hay thấp | P1, GAP-01         | **[F]** |
| **SN-T-02** | Xác định nhanh học sinh nào cần can thiệp và vì sao, kèm bằng chứng xem được          | P2, GAP-03, GAP-07 | **[I]** |
| **SN-T-03** | Biết nên xử lý nhóm nào trước khi thời gian có hạn                                    | P2, GAP-04         | **[I]** |
| **SN-T-04** | Giữ quyền quyết định cuối cùng và bác bỏ được đề xuất khi thấy không phù hợp          | RK-01, BR-03       | **[I]** |
| **SN-T-05** | Được bảo đảm rằng dữ liệu không bị dùng để đánh giá bản thân mình                     | RK-01              | **[I]** |
| **SN-T-06** | Hiểu được vì sao hệ thống kết luận như vậy, bằng ngôn ngữ chuyên môn quen thuộc       | GAP-08             | **[I]** |
| **SN-T-07** | Không phải bỏ thêm thời gian so với hiện tại                                          | BO-02              | **[A]** |
| **SN-T-08** | Bổ sung được kinh nghiệm và tài liệu riêng vào quá trình hỗ trợ học sinh              | SH-01              | **[I]** |

### 2.2.2. Học sinh (SH-02)

| **ID**      | **Stakeholder Need**                                                    | **Truy về**  | **Nhãn**  |
|-------------|-------------------------------------------------------------------------|--------------|-----------|
| **SN-S-01** | Không bị gán nhãn năng lực ở bất kỳ đâu                                 | BR-13, BO-08 | **[A]** |
| **SN-S-02** | Được hỗ trợ đúng chỗ đang thiếu, không phải học lại toàn bộ             | GAP-06       | **[I]** |
| **SN-S-03** | Vẫn được tiếp cận nội dung của lớp hiện tại, không bị kéo lùi hoàn toàn | BR-11, RK-04 | **[I]** |
| **SN-S-04** | Không phải trả lời quá nhiều câu hỏi trước khi nhận được hỗ trợ         | GAP-09       | **[A]** |
| **SN-S-05** | Nhìn thấy được tiến bộ của bản thân                                     | RK-04        | **[A]** |
| **SN-S-06** | Kết quả cá nhân không hiển thị cho bạn học khác                         | SH-02, BO-06 | **[I]** |

### 2.2.3. Nhà trường (SH-03, SH-04)

| **ID**       | **Stakeholder Need**                                                                 | **Truy về**      | **Nhãn**  |
|--------------|--------------------------------------------------------------------------------------|------------------|-----------|
| **SN-SC-01** | Triển khai không đòi hỏi mua sắm thiết bị mới                                        | CO-B-04          | **[A]** |
| **SN-SC-02** | Vận hành không cần nhân sự kỹ thuật thường trực                                      | CO-T-04          | **[A]** |
| **SN-SC-03** | Mọi nội dung tới học sinh đều đã qua thẩm định chuyên môn                            | SH-03            | **[F]** |
| **SN-SC-04** | Nội dung bám Chương trình GDPT 2018                                                  | CO-E-01          | **[F]** |
| **SN-SC-05** | Nhà trường dừng được việc sử dụng và lấy lại dữ liệu bất cứ lúc nào                  | BO-06            | **[I]** |
| **SN-SC-06** | Cách sử dụng phù hợp với nội quy hiện hành về thiết bị và với phân phối chương trình | CO-E-02, CO-E-05 | **[A]** |

### 2.2.4. Phụ huynh (SH-06)

| **ID**      | **Stakeholder Need**                                                                              | **Truy về** | **Nhãn**  |
|-------------|---------------------------------------------------------------------------------------------------|-------------|-----------|
| **SN-P-01** | Thông tin về con được diễn đạt theo hướng kỹ năng cần củng cố, không theo hướng xếp loại năng lực | BR-13       | **[A]** |
| **SN-P-02** | Biết dữ liệu gì của con được thu thập và dùng vào việc gì                                         | BO-06       | **[F]** |
| **SN-P-03** | Kết quả không được dùng cho quyết định ảnh hưởng tới quyền lợi học tập của con                    | BR-12       | **[F]** |

### 2.2.5. Các bên còn lại

| **ID**      | **Stakeholder Need**                                                        | **Bên**      | **Nhãn**  |
|-------------|-----------------------------------------------------------------------------|--------------|-----------|
| **SN-G-01** | Có thông tin tổng hợp cấp trường/cụm phục vụ quản lý                        | SH-05        | **[A]** |
| **SN-G-02** | Thông tin tổng hợp không chứa dữ liệu định danh học sinh                    | SH-05, SH-06 | **[I]** |
| **SN-C-01** | Thẩm định được khối lượng nội dung lớn với chi phí thời gian chấp nhận được | SH-07        | **[A]** |
| **SN-E-01** | Tiếp cận được dữ liệu và phương pháp đủ để tái lập kết luận                 | SH-08        | **[I]** |

## 2.3. Power / Interest Analysis

| **Nhóm** | **Stakeholder** | **Tư thế tiếp cận** |
|---|---|---|
| **Quyền cao — Quan tâm cao** *(Quản lý sát)* | SH-01 Giáo viên · SH-03 Tổ trưởng chuyên môn · SH-10 Hội đồng đánh giá | Tham gia từ đầu; đồng thiết kế; trao đổi thường xuyên |
| **Quyền cao — Quan tâm trung bình** *(Giữ hài lòng)* | SH-04 Hiệu trưởng · SH-05 Phòng/Sở Giáo dục | Thông tin định kỳ, ngắn gọn; tiếp cận sau khi có bằng chứng |
| **Quyền thấp — Quan tâm cao** *(Giữ thông tin đầy đủ)* | SH-02 Học sinh · SH-06 Phụ huynh · SH-07 Người biên soạn · SH-08 Đơn vị chuyên môn | Thông tin minh bạch; bảo vệ lợi ích bằng quy tắc nghiệp vụ |
| **Quyền thấp — Quan tâm thấp** *(Theo dõi)* | Cơ quan quản lý ngành (khung chương trình) · Các sản phẩm cùng phân khúc | Theo dõi thay đổi chính sách |

> **Vì sao chỉ dùng lưới Power/Interest.** Hai công cụ phân loại khác được nhắc tới trong Phụ lục A — *Onion diagram* và *Salience model* — không được áp dụng ở phiên bản này. Onion diagram phân lớp theo khoảng cách tới hệ thống, mà ở giai đoạn phân tích nghiệp vụ chưa có hệ thống để lấy làm tâm. Salience model đòi hỏi đánh giá tính chính đáng và tính cấp thiết của từng bên — hai thuộc tính hiện chưa có căn cứ quan sát. Cả hai sẽ được xem xét lại sau khi đóng OQ-03, OQ-05 và OQ-08.

### 2.3.1. Ba nhận định rút ra

**Nhận định 1 — Quyền lực của giáo viên là quyền phủ quyết ngầm.** Giáo viên không ký bất kỳ quyết định nào, nhưng nếu họ không sử dụng thì sản phẩm không tồn tại trên thực tế. Lưới hai chiều không diễn tả được dạng quyền lực này. **[I]**

**Nhận định 2 — Người mua không phải người dùng.** Bên có quyền cao nhất (SH-05) lại có mức quan tâm tới trải nghiệm sử dụng ở mức trung bình. Đây là đặc điểm cấu trúc của thị trường giáo dục công, không phải khiếm khuyết có thể khắc phục bằng thiết kế. **[I]**

**Nhận định 3 — Hai bên chịu hậu quả nhiều nhất lại không có tiếng nói.** Học sinh (SH-02) và phụ huynh (SH-06) có mức quan tâm cao nhưng quyền lực thấp. Lợi ích của họ vì vậy phải được bảo vệ bằng **quy tắc nghiệp vụ bắt buộc** (BR-11, BR-12, BR-13), không thể dựa vào thiện chí trong quá trình thiết kế. **[I]**

## 2.4. RACI Matrix

Chỉ lập RACI cho các hoạt động thực sự cần cơ chế quản trị.

*R = Thực hiện · A = Chịu trách nhiệm cuối · C = Tham vấn · I = Thông báo*

| **Hoạt động**                                                    | **SH-09 Đội PT** | **SH-01 GV** | **SH-03 TTCM** | **SH-04 HT** | **SH-05 Phòng/Sở** | **SH-08 ĐV chuyên môn** |
|------------------------------------------------------------------|------------------|--------------|----------------|--------------|--------------------|-------------------------|
| Xác lập và duy trì mô hình cấu trúc kiến thức                    | R                | C            | **A**          | I            | —                  | C                       |
| Thẩm định nội dung trước khi phát hành                           | R                | C            | **A**          | I            | —                  | —                       |
| Thiết kế cơ chế chẩn đoán                                        | **R/A**          | C            | C              | —            | —                  | C                       |
| Thiết kế trải nghiệm cho giáo viên                               | R                | **A**        | C              | I            | —                  | —                       |
| Xác lập quy tắc nghiệp vụ bảo vệ người học (BR-11, BR-12, BR-13) | R                | C            | C              | C            | I                  | **A**                   |
| Phê duyệt triển khai tại cơ sở                                   | I                | C            | C              | **A**        | C                  | I                       |
| Đánh giá độc lập kết quả                                         | C                | C            | C              | I            | I                  | **R/A**                 |
| Quyết định mua sắm                                               | I                | C            | I              | C            | **A**              | I                       |
| Xử lý dữ liệu cá nhân người học                                  | R                | I            | I              | **A**        | I                  | C                       |

### 2.4.1. Hai lưu ý về RACI

**Lưu ý 1.** Ở hoạt động *Quyết định mua sắm*, giáo viên chỉ ở vai trò tham vấn (C) trong khi trên thực tế họ nắm quyền phủ quyết. Sự bất đối xứng này là biểu hiện trực tiếp của rủi ro RK-01. Biện pháp: đưa bằng chứng về mức độ sử dụng thực tế của giáo viên vào hồ sơ trình quyết định mua.

**Lưu ý 2.** Trách nhiệm cuối (A) đối với các quy tắc bảo vệ người học được giao cho đơn vị chuyên môn độc lập (SH-08), không giao cho đội phát triển. Lý do: các quy tắc này bảo vệ học sinh khỏi chính sản phẩm; bên xây dựng không nên đồng thời là bên tự thẩm định.

**Lưu ý 3.** SH-08 được xếp Power: Thấp tại Mục 2.1 vì họ không có quyền quyết định ngân sách, nhân sự hay lịch triển khai của dự án — đúng định nghĩa "Power" trong phân tích stakeholder chuẩn (quyền lực tổ chức chung). Việc họ đồng thời giữ vai trò A (chịu trách nhiệm cuối) cho hai hoạt động chuyên biệt tại Mục 2.4 không phải là mâu thuẫn, mà là một cơ chế uỷ quyền có chủ đích trong phạm vi hẹp (delegated domain authority), đúng lý do đã nêu ở Lưu ý 2. Cơ chế này chỉ có hiệu lực thật nếu có ràng buộc thực thi đi kèm: sản phẩm không được phát hành nếu thiếu chữ ký của SH-08 tại Phụ lục D; nội dung không được đưa vào MVP nếu SH-08 chưa thẩm định (đối chiếu Mục 15.3.4, DR-06). Bảng RACI vận hành tại Mục 2.4.2 quy định ai duy trì cơ chế này sau khi dự án kết thúc giai đoạn xây dựng.

### 2.4.2. RACI vận hành (bổ sung tại bản 1.4)

RACI tại Mục 2.4 chỉ phủ giai đoạn xây dựng. Bảng dưới đây trả lời ba câu hỏi còn trống nêu tại Phụ lục G, mục G.9 số 7: ai cập nhật nội dung mỗi học kỳ, ai xử lý khi giáo viên báo lỗi, và ai nâng cấp phiên bản mô hình tại cơ sở không có nhân sự kỹ thuật. Đây là mô hình vận hành đề xuất, chưa được các bên liên quan xác nhận chính thức.

| **Hoạt động vận hành**                                                                          | **SH-09 Đội PT** | **SH-01 GV** | **SH-03 TTCM**       | **SH-04 HT** | **SH-05 Phòng/Sở**             | **SH-08 ĐV chuyên môn** |
|-------------------------------------------------------------------------------------------------|------------------|--------------|----------------------|--------------|--------------------------------|-------------------------|
| Cập nhật nội dung mỗi học kỳ (qua xưởng nội dung, Phụ lục F.3)                                  | C                | I            | R/A                  | I            | —                              | C                       |
| Xử lý khi giáo viên báo lỗi hoặc hành vi bất thường                                             | R/A              | I            | C (nếu lỗi nội dung) | I            | —                              | —                       |
| Nâng cấp phiên bản mô hình tại cơ sở không có nhân sự kỹ thuật (đóng gói sẵn, triển khai từ xa) | R/A              | I            | —                    | I            | C (nếu điều phối nhiều trường) | —                       |
| Rà soát định kỳ quy tắc bảo vệ người học (không chỉ một lần lúc xây dựng)                       | C                | I            | I                    | I            | I                              | R/A                     |

**Cách đọc.** Quy ước R/A giống Mục 2.4: R = Thực hiện, A = Chịu trách nhiệm cuối, C = Tham vấn, I = Thông báo. Bảng này đóng khoảng hở số 7 tại Phụ lục G mục G.9, và là cơ chế thực thi cho Lưu ý 3 ở trên.

---

# 3. PHÂN TÍCH HIỆN TRẠNG — AS-IS

## 3.1. Phân biệt ba khái niệm

Tài liệu này phân biệt nghiêm ngặt:

| **Khái niệm**                    | **Định nghĩa**                  | **Ví dụ trong bài toán**                            |
|----------------------------------|---------------------------------|-----------------------------------------------------|
| **Symptom** (triệu chứng)        | Biểu hiện quan sát được         | Điểm kiểm tra thấp                                  |
| **Pain Point** (điểm đau)        | Khó khăn cụ thể trong quy trình | Giáo viên không biết em nào hổng chỗ nào            |
| **Root Cause** (nguyên nhân gốc) | Nguồn phát sinh                 | Hoạt động đánh giá đo kết quả, không đo nguyên nhân |

> **Cảnh báo phương pháp:** tài liệu này **không** mặc định mọi lỗi học tập đều do lỗ hổng kiến thức. Nguyên nhân có thể là bất cẩn, khó khăn đọc hiểu, đoán ngẫu nhiên, hoặc yếu tố hoàn cảnh nằm ngoài phạm vi quan sát. Tỷ lệ giữa các loại nguyên nhân **chưa được đo** (OQ-10) và là một trong những ẩn số quan trọng nhất của dự án.

## 3.2. Quy trình hiện tại

| **Step** | **Hoạt động hiện tại**                  | **Input**                    | **Output**                          | **Pain Point**                                                 | **Root Cause**                                                  | **Impact**                                                                   |
|----------|-----------------------------------------|------------------------------|-------------------------------------|----------------------------------------------------------------|-----------------------------------------------------------------|------------------------------------------------------------------------------|
| **A1**   | Dạy bài mới theo phân phối chương trình | Kế hoạch giáo dục            | Bài giảng chung cho cả lớp          | Nhịp cố định, không phụ thuộc trình độ thực tế của lớp         | Ràng buộc thể chế (CO-E-02)                                     | Nhóm hổng nền không theo kịp ngay từ đầu                                     |
| **A2**   | Giao bài tập đồng loạt                  | Sách giáo khoa, sách bài tập | Bài tập giống nhau cho mọi học sinh | Không phân hoá theo trình độ                                   | Không có thông tin để phân hoá                                  | Nhóm vững thấy nhàm; nhóm hổng không làm được                                |
| **A3**   | Học sinh làm bài ở nhà                  | Đề bài                       | Bài làm                             | Không kiểm soát được điều kiện làm bài                         | Bối cảnh sử dụng (CO-D-07)                                      | Tín hiệu nhiễu: không phân biệt được năng lực thật với sự trợ giúp bên ngoài |
| **A4**   | Chữa bài mẫu trên lớp                   | Bài làm                      | Lời giải mẫu                        | Không chấm hết bài của toàn bộ học sinh                        | Sĩ số lớn, quỹ thời gian hạn chế (CO-E-03, CO-E-04)             | **Mất dữ liệu**: phần lớn bài làm không được xem xét                         |
| **A5**   | Kiểm tra định kỳ                        | Đề kiểm tra                  | **Một con số**                      | Kết quả không mang thông tin nguyên nhân                       | Công cụ đánh giá thiết kế để xếp hạng, không để định vị lỗ hổng | **Nút thắt chính của toàn bộ quy trình**                                     |
| **A6**   | Xem xét phổ điểm lớp                    | Bảng điểm                    | Nhận định "lớp yếu ở chương này"    | Độ phân giải ở cấp chương, trong khi nguyên nhân ở cấp kỹ năng | Không có ánh xạ câu hỏi → kiến thức nền                         | Sai một bậc độ phân giải; can thiệp không trúng đích                         |
| **A7**   | Gom nhóm phụ đạo                        | Bảng điểm                    | Nhóm "học sinh yếu"                 | Gom theo **điểm số**, không theo **nguyên nhân**               | Không có thông tin về nguyên nhân                               | Nhóm hỗn tạp: nhiều nguyên nhân khác nhau trong cùng một nhóm                |
| **A8**   | Dạy lại nội dung cho nhóm yếu           | Nhóm đã gom                  | Buổi phụ đạo                        | Dạy lại toàn bộ chương                                         | Không biết em nào đã vững phần nào                              | Học sinh phải ngồi nghe lại nội dung đã nắm được; lãng phí và gây chán       |
| **A9**   | Kiểm tra lại                            | Đề kiểm tra                  | Điểm số mới                         | Kết quả thường không cải thiện đáng kể                         | Can thiệp không trúng nguyên nhân gốc                           | Vòng lặp không thoát ra được                                                 |
| **A10**  | Chuyển sang chương mới                  | Kế hoạch giáo dục            | Bài học mới                         | Lỗ hổng cũ chưa được xử lý                                     | Ràng buộc tiến độ (CO-E-02)                                     | **Nợ kiến thức tích luỹ và cộng dồn**                                        |

## 3.3. Hai chỉ số rút ra từ hiện trạng

| **Chỉ số**                   | **Giá trị hiện tại**                     | **Nhãn**                              | **Ghi chú**                                                         |
|------------------------------|------------------------------------------|---------------------------------------|---------------------------------------------------------------------|
| **Độ trễ phát hiện lỗ hổng** | Khoảng cách giữa hai kỳ kiểm tra định kỳ | **[I]** — chưa đo chính xác (OQ-06) | Trong khoảng thời gian này học sinh tiếp tục học trên nền chưa vững |
| **Độ phân giải chẩn đoán**   | Cấp **chương**                           | **[F]**                             | Nguyên nhân nằm ở cấp **kỹ năng** — lệch một bậc                    |

## 3.4. Chẩn đoán tổng hợp về hiện trạng

> Đơn vị phân tích của quy trình hiện tại là **điểm số × chương**. Đơn vị cần thiết để can thiệp đúng là **nguyên nhân × kỹ năng**. Toàn bộ khoảng cách của bài toán nằm ở sự lệch pha này.

---

# 4. GAP ANALYSIS

| **GAP ID** | **Dimension**           | **AS-IS**                                                                    | **Desired State**                                               | **Gap**                                                        | **Impact**                                                   | **Priority** |
|------------|-------------------------|------------------------------------------------------------------------------|-----------------------------------------------------------------|----------------------------------------------------------------|--------------------------------------------------------------|--------------|
| **GAP-01** | Diagnostic resolution   | Điểm số ở cấp chương                                                         | Nguyên nhân ở cấp kỹ năng                                       | Thiếu ánh xạ từ biểu hiện lỗi tới kiến thức nền                | Can thiệp không trúng đích                                   | **Must**     |
| **GAP-02** | Time-to-intervention    | Phát hiện sau kỳ kiểm tra định kỳ                                            | Phát hiện trong phạm vi buổi học                                | Không có cơ chế chẩn đoán tại chỗ                              | Học sinh học tiếp trên nền gãy                               | **Must**     |
| **GAP-03** | Teacher decision making | Gom nhóm theo điểm số                                                        | Gom nhóm theo nguyên nhân gốc                                   | Sai tiêu chí gom nhóm                                          | Nhóm hỗn tạp, can thiệp chung không hiệu quả                 | **Must**     |
| **GAP-04** | Personalization effort  | Chi phí tăng tuyến tính theo sĩ số; thực tế chỉ ra được một quyết định chung | Số quyết định giảm xuống mức giáo viên xử lý được               | Thiếu cơ chế nén số quyết định                                 | Phân hoá không khả thi trên thực tế                          | **Must**     |
| **GAP-05** | Evidence sufficiency    | Kết luận dựa trên trực giác, hoặc bỏ qua                                     | Có trạng thái tường minh khi bằng chứng chưa đủ                 | Không có cơ chế từ chối kết luận                               | Kết luận sai được đưa ra với vẻ chắc chắn                    | **Must**     |
| **GAP-06** | Remediation targeting   | Dạy lại toàn bộ chương                                                       | Chỉ bù đúng phần còn thiếu                                      | Không xác định được phần đã vững                               | Lãng phí thời gian; học sinh mất động lực                    | **Must**     |
| **GAP-07** | Evidence quality        | Căn cứ là trực giác, không lưu lại                                           | Căn cứ là dữ liệu truy vết được                                 | Không có nhật ký bằng chứng                                    | Không kiểm chứng, không cải tiến, không tính lại được        | **Must**     |
| **GAP-08** | Explainability          | Không cần giải thích vì là phán đoán con người                               | Mọi kết luận của hệ thống phải giải thích được                  | Chưa có cơ chế trình bày chuỗi bằng chứng                      | Giáo viên không tin, không hành động                         | **Must**     |
| **GAP-09** | Signal density          | Mỗi câu hỏi cung cấp một bit thông tin (đúng/sai)                            | Mỗi phép đo thu hẹp được không gian giả thuyết                  | Thiết kế phép đo chưa mang thông tin chẩn đoán                 | Chi phí đạt kết luận vượt ngưỡng chịu đựng của học sinh      | **Should**   |
| **GAP-10** | Offline operation       | Quy trình giấy không cần kết nối                                             | Giải pháp số cũng không được đòi hỏi kết nối                    | Chưa có mô hình vận hành không kết nối được kiểm chứng         | Không phục vụ được nhóm đối tượng ưu tiên                    | **Must**     |
| **GAP-11** | Data availability       | Không có dữ liệu học tập ở dạng số                                           | Có dữ liệu đủ để phân tích và cải tiến                          | Chưa có nguồn dữ liệu người thật                               | Không hiệu chỉnh được ngưỡng; không chứng minh được hiệu quả | **Must**     |
| **GAP-12** | Human oversight         | Giáo viên quyết định toàn bộ, không có hỗ trợ                                | Giáo viên quyết định cuối cùng, có hỗ trợ và có khả năng bác bỏ | Chưa xác lập ranh giới quyền quyết định giữa người và hệ thống | Rủi ro mất quyền tự chủ sư phạm hoặc chấp nhận thụ động      | **Must**     |
| **GAP-13** | Non-knowledge causes    | Không phân biệt được nguyên nhân kiến thức và phi kiến thức                  | Nhận diện được và không kết luận sai loại                       | Chưa có cơ chế phân biệt                                       | Chẩn đoán sai hàng loạt nếu tỷ lệ lỗi phi kiến thức cao      | **Should**   |
| **GAP-14** | Equity safeguard        | Không có cơ chế bảo vệ nhóm yếu khỏi bị kéo lùi                              | Có giới hạn bảo đảm học sinh vẫn tiếp cận nội dung lớp hiện tại | Chưa có ràng buộc này                                          | Nhóm yếu bị khoá trong vòng lặp học bù                       | **Must**     |

> **Kiểm tra bao phủ:** mỗi GAP trong bảng trên đều có ít nhất một requirement tương ứng tại Mục 6. Xem đối chiếu đầy đủ tại **Mục 11 — Requirement Traceability Matrix**.

---

# 5. PHẠM VI DỰ ÁN (SCOPE)

## 5.1. In Scope

Chỉ đưa vào phạm vi những nội dung truy được về Problem, Gap hoặc Stakeholder Need.

| **#** | **Nội dung trong phạm vi**                                                                              | **Truy về**      |
|--------|---------------------------------------------------------------------------------------------------------|------------------|
| IS-01  | Ghi nhận và lưu trữ bằng chứng học tập của học sinh ở mức chi tiết đủ để suy luận nguyên nhân           | GAP-07, GAP-11   |
| IS-02  | Xác định kiến thức nền có khả năng gây ra lỗi hiện tại của người học                                    | GAP-01, P1       |
| IS-03  | Xử lý tình huống bằng chứng chưa đủ để kết luận                                                         | GAP-05           |
| IS-04  | Phân biệt nguyên nhân thuộc về kiến thức và nguyên nhân phi kiến thức                                   | GAP-13           |
| IS-05  | Xây dựng phương án hỗ trợ tối giản, bỏ qua phần người học đã nắm vững                                   | GAP-06           |
| IS-06  | Xác nhận lại mức thành thạo bằng phép đo độc lập với phần đã luyện tập                                  | GAP-07           |
| IS-07  | Tổng hợp bằng chứng ở cấp lớp, gom nhóm theo nguyên nhân và sắp thứ tự ưu tiên                          | GAP-03, GAP-04   |
| IS-08  | Trình bày căn cứ để giáo viên hiểu và kiểm chứng được kết luận                                          | GAP-08, GAP-12   |
| IS-09  | Cơ chế cho phép giáo viên bác bỏ và điều chỉnh mọi kết luận, đề xuất                                    | GAP-12           |
| IS-10  | Vận hành chức năng cốt lõi trong điều kiện không có kết nối                                             | GAP-10           |
| IS-11  | Tập hợp dữ liệu cấp lớp trong điều kiện không có kết nối                                                | GAP-10, SN-T-02  |
| IS-12  | Bảo đảm người học vẫn tiếp cận nội dung của lớp hiện tại trong quá trình được hỗ trợ                    | GAP-14           |
| IS-13  | Quy trình thẩm định chuyên môn đối với toàn bộ nội dung trước khi tới người học                         | SN-SC-03         |
| IS-14  | Xuất và xoá dữ liệu theo yêu cầu của cơ sở giáo dục                                                     | SN-SC-05, BO-06  |
| IS-15  | Phạm vi nội dung thử nghiệm: môn Toán, lớp 5-7, phân số → tỷ lệ thức, kèm kiến thức nền các lớp dưới | CO-R-01, CO-R-02 |

## 5.2. Out of Scope

Nêu rõ những gì **cố ý** chưa giải quyết trong phiên bản này, kèm lý do.

| **#** | **Ngoài phạm vi**                                                                 | **Lý do**                                                                                  |
|--------|-----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|
| OS-01  | Các môn học khác ngoài Toán                                                       | Ưu tiên chiều sâu; nguồn lực giới hạn (CO-R-01, CO-R-02)                                   |
| OS-02  | Các khối lớp khác                                                                 | Như trên                                                                                   |
| OS-03  | Chấm bài tự luận, nhận dạng chữ viết tay                                          | Nằm ngoài yêu cầu tối thiểu để kiểm chứng giả thuyết cốt lõi                               |
| OS-04  | Mọi quyết định có tính ràng buộc đối với người học (xếp lớp, học bạ, xét kỷ luật) | Chính sách bắt buộc (BR-12); độ chính xác hiện tại không đủ cho quyết định không đảo ngược |
| OS-05  | Đánh giá năng lực giáo viên                                                       | Chính sách bắt buộc (BR-15); vi phạm sẽ mất toàn bộ người dùng                             |
| OS-06  | Đồng bộ dữ liệu thời gian thực giữa nhiều thiết bị                                | Không truy được về requirement nào                                                         |
| OS-07  | Quản lý hồ sơ học sinh, thời khoá biểu, điểm danh (chức năng quản lý trường học)  | Ngoài phạm vi bài toán                                                                     |
| OS-08  | Liên lạc trực tiếp giữa hệ thống và phụ huynh                                     | Rủi ro truyền thông cao (RK-06); trung gian qua giáo viên                                  |
| OS-09  | Dự báo kết quả thi, xếp hạng học sinh                                             | Xung đột với BR-12 và BR-13                                                                |
| OS-10  | Tự động sinh mô hình cấu trúc kiến thức không qua thẩm định chuyên môn            | Xung đột với AIR-07 và SN-SC-03                                                            |
| OS-11  | Thu phí trực tiếp từ người học hoặc phụ huynh                                     | Xung đột với nguyên tắc CO-B-05; có thể chạm quy định về dạy thêm (CO-L-05)                |

## 5.3. Assumptions

Trạng thái: **Open** = chưa kiểm chứng · **Testing** = đang kiểm chứng · **Closed** = đã kết luận

### 5.3.1. Nhóm chịu lực cao nhất

| **ID**    | **Assumption**                                                                  | **Related Requirement** | **Impact if False**                                                                  | **Validation Method**                                                              | **Status** |
|-----------|---------------------------------------------------------------------------------|-------------------------|--------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|------------|
| **AS-01** | Giáo viên chưa biết nguyên nhân gốc của từng học sinh                           | FR-03, BO-01            | **Sản phẩm mất giá trị chẩn đoán; chỉ còn giá trị ghi chép**                         | 3 giáo viên chẩn đoán 20 bài làm thật trước khi xem kết quả hệ thống               | Open       |
| **AS-02** | Tồn tại một đáp án đúng cho câu hỏi "nguyên nhân gốc là gì"                     | Toàn bộ BO-07, AIR-15   | **Không đo được độ chính xác của bất kỳ hệ thống nào; mọi chỉ số accuracy vô nghĩa** | Đo mức đồng thuận giữa 3 chuyên gia độc lập trên cùng bộ bài làm                   | Open       |
| **AS-03** | Chuỗi chẩn đoán đúng → can thiệp đúng → kết quả học tốt hơn không đứt ở mắt nào | BO-01, BO-04            | Chẩn đoán chính xác nhưng kết quả học không thay đổi                                 | Thử nghiệm thực địa: đo cả độ chính xác chẩn đoán lẫn kết quả học, kiểm tương quan | Open       |
| **AS-04** | Mỗi lỗi có một nguyên nhân gốc chi phối                                         | FR-03, FR-05            | Chọn một trong nhiều nguyên nhân đồng thời; can thiệp không đủ                       | Hỏi chuyên gia: mỗi bài làm có mấy nguyên nhân                                     | Open       |
| **AS-05** | Học sinh cố gắng làm đúng và tự làm bài                                         | FR-01 → FR-08           | **Bằng chứng nhiễu tới mức mọi chẩn đoán mất giá trị**                               | Phân tích thời gian làm bài; cài phép đo đối chứng; quan sát trực tiếp             | Open       |
| **AS-06** | Giáo viên được phép thay đổi cách tổ chức tiết học                              | FR-16, BO-02            | **Hệ thống gợi ý điều giáo viên không được phép thực hiện**                          | Hỏi tổ trưởng chuyên môn và phó hiệu trưởng chuyên môn                             | Open       |
| **AS-07** | Lỗ hổng là thiếu kiến thức, không phải hiểu sai kiến thức                       | FR-11, FR-12            | Bổ sung kiến thức chồng lên một hiểu sai làm tình trạng nặng thêm                    | Quan sát học sinh tư duy thành tiếng; phân loại lỗi theo hai nhóm                  | Open       |

### 5.3.2. Hành vi giáo viên

| **ID**    | **Assumption**                                                         | **Related Requirement** | **Impact if False**                                                 | **Validation Method**                                  | **Status** |
|-----------|------------------------------------------------------------------------|-------------------------|---------------------------------------------------------------------|--------------------------------------------------------|------------|
| **AS-08** | Có thông tin thì giáo viên sẽ hành động khác đi                        | BO-02, FR-16            | **Sản phẩm được mở đều đặn nhưng không thay đổi hành vi giảng dạy** | Quan sát tiết học; ghi nhận can thiệp thực tế          | Open       |
| **AS-09** | Giáo viên quản lý được nhiều nhóm hoạt động khác nhau trong một tiết   | FR-15                   | Gom nhóm chính xác nhưng không thực hiện được                       | Quan sát tiết học; phỏng vấn kinh nghiệm dạy phân hoá  | Open       |
| **AS-10** | Giáo viên coi việc phân hoá là trách nhiệm của mình                    | BO-02                   | Giải quyết vấn đề mà người dùng không coi là vấn đề của họ          | Phỏng vấn: "điều gì làm nên một tiết dạy thành công?"  | Open       |
| **AS-11** | Giáo viên chấp nhận kết luận của hệ thống khi nó trái với trực giác    | FR-17, AIR-18           | Bác bỏ toàn bộ → hệ thống không tạo thêm giá trị                    | Đo tỷ lệ bác bỏ trong thử nghiệm thực địa              | Open       |
| **AS-12** | Tồn tại một khoảng thời gian trong tuần để giáo viên xem xét thông tin | NFR-11                  | Không có thời điểm nào để sử dụng sản phẩm                          | Nhật ký thời gian một tuần của 3 giáo viên             | Open       |
| **AS-13** | Cam kết không dùng dữ liệu để đánh giá giáo viên là đủ để tạo niềm tin | AIR-19, SN-T-05         | Giáo viên điều chỉnh hành vi để làm đẹp số liệu, hoặc không sử dụng | Phỏng vấn ẩn danh                                      | Open       |
| **AS-14** | Giáo viên hiểu và tin được phần giải thích của hệ thống                | NFR-08, AIR-17          | Không tin thì không hành động                                       | Cho giáo viên đọc mẫu giải thích, kiểm tra mức độ hiểu | Open       |

### 5.3.3. Hành vi học sinh

| **ID**    | **Assumption**                                                             | **Related Requirement** | **Impact if False**                                               | **Validation Method**                                                   | **Status** |
|-----------|----------------------------------------------------------------------------|-------------------------|-------------------------------------------------------------------|-------------------------------------------------------------------------|------------|
| **AS-15** | Học sinh làm bài một mình, không có trợ giúp bên ngoài                     | FR-01, DR-03            | Chẩn đoán năng lực của người khác                                 | Đối chiếu kết quả làm tại nhà với kết quả làm tại lớp trên cùng kỹ năng | Open       |
| **AS-16** | Học sinh đọc hiểu được đề bài                                              | FR-07                   | Chẩn đoán "hổng kiến thức Toán" trong khi vấn đề là đọc hiểu      | Quan sát tư duy thành tiếng; đối chiếu với kết quả môn Ngữ văn          | Open       |
| **AS-17** | Học sinh tự học được từ nội dung hỗ trợ, không cần người kèm               | FR-12                   | **Phương án hỗ trợ đúng nhưng người học không thực hiện được**    | Quan sát 5 học sinh tự học, đo tỷ lệ hoàn thành                         | Open       |
| **AS-18** | Học sinh sử dụng đều đặn mà không cần thúc ép                              | BO-04                   | **Không đủ dữ liệu để chẩn đoán; thử nghiệm không kết luận được** | Đo tỷ lệ quay lại theo tuần                                             | Open       |
| **AS-19** | Học sinh chấp nhận được số phép đo cần thiết để hệ thống kết luận          | FR-06, AIR-16           | Tỷ lệ bỏ dở cao; tỷ lệ chẩn đoán thành công thấp                  | Đo tỷ lệ bỏ dở theo số câu                                              | Open       |
| **AS-20** | Học sinh không ngại việc bạn học biết mình đang củng cố kiến thức lớp dưới | FR-22, AIR-13           | Từ chối sử dụng, hoặc cố ý trả lời sai để tránh bị phân nhóm      | Phỏng vấn học sinh; quan sát phản ứng khi được phân nhóm                | Open       |
| **AS-21** | Học sinh được người thân cho phép sử dụng thiết bị ngoài giờ               | NFR-14                  | Không có thời gian sử dụng ngoài lớp                              | Khảo sát phụ huynh qua giáo viên                                        | Open       |

### 5.3.4. Thiết bị và hạ tầng

| **ID**    | **Assumption**                                                                   | **Related Requirement** | **Impact if False**                                                  | **Validation Method**                                          | **Status** |
|-----------|----------------------------------------------------------------------------------|-------------------------|----------------------------------------------------------------------|----------------------------------------------------------------|------------|
| **AS-22** | Có đủ thiết bị cho học sinh sử dụng                                              | NFR-14                  | **Không triển khai được**                                            | Khảo sát 3 cơ sở: số thiết bị, số học sinh có thiết bị cá nhân | Open       |
| **AS-23** | Học sinh được phép sử dụng thiết bị trong lớp                                    | FR-15, NFR-14           | **Toàn bộ kịch bản sử dụng trong tiết học không còn hiệu lực**       | Hỏi nội quy nhà trường                                         | Open       |
| **AS-24** | Nhiều học sinh dùng chung một thiết bị là kịch bản cần hỗ trợ                    | FR-22                   | Thiết kế hồ sơ người dùng sai từ gốc                                 | Khảo sát                                                       | Open       |
| **AS-25** | Thiết bị đời cũ đáp ứng được yêu cầu xử lý và lưu trữ cục bộ                     | NFR-14, NFR-01          | **Chức năng ngoại tuyến không hoạt động trên đúng nhóm cần nó nhất** | Thử nghiệm trên thiết bị phổ thông giá thấp                    | Open       |
| **AS-26** | Dữ liệu lưu cục bộ không bị hệ điều hành thu hồi khi thiếu dung lượng            | NFR-01, NFR-03          | Mất dữ liệu học tập; mất niềm tin                                    | Thử nghiệm điều kiện đầy bộ nhớ                                | Open       |
| **AS-27** | Nguồn điện đủ ổn định để duy trì thiết bị hoạt động                              | NFR-01                  | Gián đoạn phiên làm việc                                             | Khảo sát                                                       | Open       |
| **AS-28** | Tồn tại ít nhất một điểm có kết nối định kỳ để nạp nội dung và đồng bộ           | NFR-01, NFR-03          | **Không nạp được nội dung lần đầu; sản phẩm không khởi động được**   | Khảo sát: vị trí và tần suất có kết nối                        | Open       |
| **AS-29** | Giáo viên có thiết bị đủ năng lực để làm điểm tập hợp dữ liệu lớp                | FR-18                   | Không tổng hợp được dữ liệu lớp khi không có kết nối; AS-08 sụp theo | Khảo sát thiết bị của giáo viên                                | Open       |
| **AS-30** | Giáo viên chấp nhận sử dụng tài nguyên kết nối cá nhân cho hoạt động lớp         | FR-18                   | Chi phí chuyển sang cá nhân giáo viên; khó duy trì                   | Hỏi trực tiếp                                                  | Open       |
| **AS-31** | Kết nối cục bộ hoạt động ổn định với số lượng thiết bị của một lớp               | FR-18                   | Tập hợp dữ liệu thất bại đúng lúc cần                                | Thử nghiệm thực địa trong phòng học                            | Open       |
| **AS-32** | Nội dung một chương nạp được trong thời gian chấp nhận được ở băng thông thực tế | NFR-02                  | Không hoàn tất được bước cài đặt ban đầu                             | Đo băng thông thực tế; thử nạp                                 | Open       |

### 5.3.5. Dữ liệu

| **ID**    | **Assumption**                                                               | **Related Requirement** | **Impact if False**                                                  | **Validation Method**                                                       | **Status** |
|-----------|------------------------------------------------------------------------------|-------------------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------|------------|
| **AS-33** | Tiếp cận được nguồn dữ liệu kết quả học tập thật, đủ chất lượng để phân tích | DR-05, BO-07            | Mất trụ bằng chứng chính                                             | Gửi văn bản đề nghị chính thức                                              | Open       |
| **AS-34** | Có cơ sở pháp lý để xử lý dữ liệu người học chưa thành niên                  | DR-03, NFR-10           | **Chặn triển khai bất kể chất lượng sản phẩm**                       | Rà soát quy định; xác định quy trình đồng thuận                             | Open       |
| **AS-35** | Có quyền sử dụng ngân hàng câu hỏi nguồn                                     | DR-02                   | **Chặn thương mại hoá; rủi ro pháp lý**                              | Rà soát nguồn gốc từng đơn vị nội dung                                      | Open       |
| **AS-36** | Công cụ đánh giá sẵn có của nhà trường đo đúng nội dung được can thiệp       | BO-07                   | Thử nghiệm không kết luận được                                       | Đối chiếu đề kiểm tra với danh mục kỹ năng mục tiêu                         | Open       |
| **AS-37** | Thời lượng thử nghiệm đủ dài để quan sát được thay đổi kết quả học           | BO-04, BO-07            | Kết quả "không khác biệt" bị hiểu nhầm thành sản phẩm không hiệu quả | Ước lượng cỡ hiệu ứng trước; nếu không đủ thì chuyển sang chỉ số quá trình  | Open       |
| **AS-38** | Có nhóm đối chứng khả dụng và được chấp nhận về mặt đạo đức                  | BO-07                   | Không tách được tác động của sản phẩm khỏi các yếu tố khác           | Thiết kế triển khai so le theo thời gian thay vì giữ nhóm không được hỗ trợ | Open       |
| **AS-39** | Dữ liệu mô phỏng phản ánh được phân bố của người học thật                    | —                       | **Đã xác định là không đúng hoàn toàn**                              | Đã kết luận: chỉ dùng làm kiểm tra tính nhất quán nội bộ                    | **Closed** |

### 5.3.6. Cấu trúc kiến thức và khả năng chẩn đoán

| **ID**    | **Assumption**                                                               | **Related Requirement** | **Impact if False**                                                          | **Validation Method**                                         | **Status** |
|-----------|------------------------------------------------------------------------------|-------------------------|------------------------------------------------------------------------------|---------------------------------------------------------------|------------|
| **AS-40** | Kiến thức môn học có cấu trúc phụ thuộc rời rạc và ổn định                   | DR-01, FR-03            | Mô hình không phản ánh cách học thật                                         | Kiểm định quan hệ phụ thuộc trên dữ liệu kết quả học tập thật | Open       |
| **AS-41** | Quan hệ phụ thuộc là nhị phân (vững / chưa vững), không phải mức độ liên tục | FR-02                   | Phân loại sai ở vùng ranh giới                                               | Phân tích phân bố mức thành thạo                              | Open       |
| **AS-42** | Một mô hình cấu trúc kiến thức đúng cho mọi người học                        | DR-01                   | Áp đặt một lối học không phù hợp với một số người học                        | So sánh giữa các nhóm có nền tảng khác nhau                   | Open       |
| **AS-43** | Kiến thức đã nắm vững không suy giảm theo thời gian                          | FR-02, FR-09            | Kết luận "đã vững" sai đối với người học đã quên                             | Đo lại kỹ năng cũ sau một khoảng thời gian                    | Open       |
| **AS-44** | Khung chương trình đủ để suy ra quan hệ phụ thuộc nhận thức                  | DR-01                   | **Mô hình chỉ phản ánh trình tự hành chính, không phản ánh phụ thuộc thật**  | Kiểm định thực nghiệm trên dữ liệu kết quả học tập            | Open       |
| **AS-45** | Nguyên nhân gốc quan sát được từ hành vi làm bài                             | FR-01, FR-03            | Nguyên nhân thật nằm ngoài tầm quan sát (hoàn cảnh, sức khoẻ, thời gian học) | Quan sát tư duy thành tiếng; tìm hiểu hoàn cảnh người học     | Open       |
| **AS-46** | Lỗi có nguyên nhân phi kiến thức chiếm tỷ lệ thiểu số                        | FR-07                   | Phần lớn chẩn đoán sai trong khi vẫn báo mức tin cậy cao                     | Phân loại nguyên nhân trên một tập bài làm thật               | Open       |
| **AS-47** | Tỷ lệ từ chối kết luận nằm ở mức sử dụng được                                | AIR-16                  | Từ chối quá nhiều thì không ai dùng; quá ít thì kết luận thiếu căn cứ        | Chạy trên dữ liệu thật, đo phân bố                            | Open       |

### 5.3.7. Công nghệ hỗ trợ và triển khai

| **ID**    | **Assumption**                                                                        | **Related Requirement** | **Impact if False**                                                         | **Validation Method**                                    | **Status** |
|-----------|---------------------------------------------------------------------------------------|-------------------------|-----------------------------------------------------------------------------|----------------------------------------------------------|------------|
| **AS-48** | Công cụ hỗ trợ sinh nội dung tạo ra kết quả đạt mức chuyên gia chấp nhận              | AIR-06                  | Chi phí biên soạn quay về mức thủ công                                      | Đo tỷ lệ chấp nhận của chuyên gia trên một tập mẫu       | Open       |
| **AS-49** | Kiểm chứng tự động được tính đúng đắn của nội dung trong phạm vi môn học mục tiêu     | NFR-09, AIR-07          | Mất tầng an toàn với một số dạng nội dung                                   | Thử trên tập mẫu, đếm tỷ lệ kiểm chứng được              | Open       |
| **AS-50** | Chuẩn bị nội dung trước là đủ, không cần sinh nội dung tại thời điểm sử dụng          | NFR-01                  | Mâu thuẫn không giải được giữa cá nhân hoá tức thời và vận hành ngoại tuyến | Thử nghiệm với người học: nội dung tĩnh có đáp ứng không | Open       |
| **AS-51** | Công cụ xử lý được nội dung chuyên môn bằng tiếng Việt ở mức chấp nhận được           | AIR-06                  | Chất lượng thấp; khối lượng chỉnh sửa lớn                                   | Đo trên tập mẫu                                          | Open       |
| **AS-52** | Chi phí chuẩn bị nội dung nằm trong ngân sách                                         | BO-05                   | Mô hình chi phí không đứng vững                                             | Tính chi phí thực tế trên một chương                     | Open       |
| **AS-53** | Xin được chấp thuận triển khai trước khi bắt đầu năm học                              | BO-07                   | **Mất cửa sổ thử nghiệm; chất lượng bằng chứng giảm mạnh**                  | Gửi văn bản đề nghị                                      | Open       |
| **AS-54** | Năng lực thẩm định nội dung đáp ứng được khối lượng cần thiết                         | DR-02, NFR-16           | **Nút thắt quy mô: tốc độ sinh nội dung trở nên vô nghĩa**                  | Đo thời gian thẩm định trên một tập mẫu                  | Open       |
| **AS-55** | Không cần tích hợp với hệ thống quản lý sẵn có của nhà trường                         | NFR-16                  | Giáo viên phải nhập liệu hai nơi → ngừng sử dụng                            | Hỏi nhà trường đang sử dụng hệ thống nào                 | Open       |
| **AS-56** | Sản phẩm vận hành ổn định trong suốt giai đoạn thử nghiệm mà không cần hỗ trợ tại chỗ | NFR-16                  | Đội phải trực thường xuyên; không mở rộng được                              | Theo dõi số sự cố trong giai đoạn đầu                    | Open       |
| **AS-57** | Đội phát triển phối hợp hiệu quả trong khung thời gian đã định                        | —                       | Hao hụt năng lực vào chi phí phối hợp nội bộ                                | Kiểm điểm tại mốc kiểm tra đầu tiên                      | Open       |
| **AS-58** | Phụ huynh không phản đối cơ chế truy ngược về kiến thức lớp dưới                      | AIR-13                  | Áp lực ngược lên giáo viên; nhà trường rút khỏi thử nghiệm                  | Phỏng vấn phụ huynh qua giáo viên                        | Open       |
| **AS-59** | Tiêu chí đánh giá bên ngoài phù hợp với hướng tiếp cận đã chọn                        | —                       | Định hướng sai trong toàn bộ giai đoạn                                      | Đọc kỹ quy định; xác nhận với ban tổ chức                | Open       |
| **AS-60** | Điều kiện làm bài tại lớp cho bằng chứng đáng tin cậy hơn tại nhà                     | FR-01, DR-07            | Không phân biệt được chất lượng bằng chứng theo bối cảnh                    | Đối chiếu kết quả hai bối cảnh trên cùng kỹ năng         | Open       |

### 5.3.8. Tổng hợp assumption

| **Chỉ số**                                                           | **Giá trị**                                                                                     |
|----------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| Tổng số assumption                                                   | **60** — đếm được từ bảng 5.3.1 → 5.3.7                                                         |
| Sai sẽ làm mất lý do tồn tại của sản phẩm                            | **12** — **[A]** ước lượng của đội; từng assumption chưa được gắn nhãn nhóm hệ quả (xem 17.7) |
| Sai sẽ buộc thiết kế lại kiến trúc                                   | 27 — **[A]** như trên                                                                         |
| Đóng được bằng khảo sát, phỏng vấn, quan sát — **không cần viết mã** | **31** — **[A]** như trên                                                                     |
| Đã đóng                                                              | 1 (AS-39) — kiểm chứng được từ cột Status                                                       |

> **Nhận định:** hơn một nửa số assumption có thể đóng lại trước khi viết thêm bất kỳ dòng mã nào. Một buổi làm việc với ba giáo viên trên hai mươi bài làm thật đóng được đồng thời AS-01, AS-02, AS-04, AS-07 và AS-46 — trong đó **bốn** assumption (AS-01, AS-02, AS-04, AS-07) thuộc nhóm chịu lực cao nhất ở 5.3.1.

## 5.4. Constraints

### 5.4.1. Business Constraint

| **ID**      | **Constraint**                                                               | **Type** | **Hard/Soft**           | **Source**                        | **Impact**                                                         |
|-------------|------------------------------------------------------------------------------|----------|-------------------------|-----------------------------------|--------------------------------------------------------------------|
| **CO-B-01** | Người trả tiền là tổ chức, không phải người dùng cuối                        | Business | **Hard**                | Cấu trúc thị trường giáo dục công | Giá trị phải thuyết phục được cả bên mua lẫn bên dùng              |
| **CO-B-02** | Chi tiêu công theo năm tài chính và có định mức                              | Business | **Hard**                | Quy chế tài chính công            | Thời điểm chào hàng phải khớp chu kỳ ngân sách                     |
| **CO-B-03** | Mua sắm công phải qua quy trình có sẵn                                       | Business | **Hard**                | Quy định mua sắm                  | Thuyết phục thành công vẫn có thể không ký được hợp đồng           |
| **CO-B-04** | Không có ngân sách trang bị thiết bị mới cho người học                       | Business | Soft                    | Thực tế cơ sở giáo dục công       | Giải pháp đòi hỏi thiết bị mới sẽ không tiếp cận được nhóm ưu tiên |
| **CO-B-05** | Người học thuộc nhóm khó khăn không phải là bên chi trả                      | Business | **Hard** *(nguyên tắc)* | Nguyên tắc của dự án              | Loại bỏ mô hình thu phí trực tiếp từ người học                     |
| **CO-B-06** | Quyết định triển khai gắn với chu kỳ năm học                                 | Business | **Hard**                | Vận hành cơ sở giáo dục           | Bỏ lỡ cửa sổ đầu năm học phải chờ chu kỳ sau                       |
| **CO-B-07** | Phải cạnh tranh với phương án "giữ nguyên hiện trạng", vốn không tốn chi phí | Business | Soft                    | Hành vi tổ chức                   | Giá trị phải vượt trội rõ ràng, không chỉ nhỉnh hơn                |

### 5.4.2. Educational Constraint

| **ID**      | **Constraint**                                                                              | **Type**    | **Hard/Soft**   | **Source**                   | **Impact**                                                              |
|-------------|---------------------------------------------------------------------------------------------|-------------|-----------------|------------------------------|-------------------------------------------------------------------------|
| **CO-E-01** | Nội dung phải bám Chương trình GDPT 2018                                                    | Educational | **Hard**        | Văn bản pháp quy             | Không đạt thì không được thẩm định thông qua                            |
| **CO-E-02** | Phân phối chương trình cố định theo tuần; không được giảm tiến độ để chờ nhóm chưa theo kịp | Educational | **Hard**        | Kế hoạch giáo dục nhà trường | **Phương án hỗ trợ phải nằm ngoài hoặc song song với tiến độ bắt buộc** |
| **CO-E-03** | Thời lượng tiết học và số tiết mỗi tuần là cố định                                          | Educational | **Hard**        | Điều lệ trường học           | Mọi thiết kế đòi hỏi thời lượng bổ sung đều không khả thi               |
| **CO-E-04** | Sĩ số lớp lớn                                                                               | Educational | **Hard**        | Điều lệ và thực tế           | Nền tảng của toàn bộ bài toán                                           |
| **CO-E-05** | Giáo án được phê duyệt trước; tiết dạy được đánh giá theo tiêu chí dự giờ                   | Educational | **Hard**        | Quản lý chuyên môn           | **Hệ thống có thể gợi ý điều giáo viên không được phép thực hiện**      |
| **CO-E-06** | Lịch kiểm tra định kỳ do nhà trường quy định                                                | Educational | **Hard**        | Quy chế đánh giá             | Phép đo phải bám lịch sẵn có, không tự chèn thêm                        |
| **CO-E-07** | Không được làm tăng khối lượng bài tập vượt quy định                                        | Educational | Soft *(cần rà)* | Chủ trương giảm tải          | Ràng buộc số lượng phép đo trên mỗi người học                           |
| **CO-E-08** | Không xếp lớp lại giữa năm học                                                              | Educational | **Hard**        | Quy chế                      | Củng cố lý do cấm sử dụng cho quyết định ràng buộc                      |
| **CO-E-09** | Các đợt nghỉ làm gián đoạn chuỗi dữ liệu                                                    | Educational | **Hard**        | Lịch năm học                 | Bằng chứng bị đứt quãng; kiến thức có thể suy giảm giữa các đợt         |
| **CO-E-10** | Giáo viên phụ trách nhiều lớp                                                               | Educational | **Hard**        | Định mức giờ dạy             | Thiết kế cho một lớp không nhân lên được cho nhiều lớp                  |
| **CO-E-11** | Kiến thức nền cần truy ngược thuộc chương trình lớp dưới, do giáo viên khác phụ trách       | Educational | Soft            | Cấu trúc bậc học             | Giáo viên hiện tại có thể không nắm chi tiết nội dung lớp dưới          |

### 5.4.3. Technical Constraint

| **ID**      | **Constraint**                                                                                          | **Type**  | **Hard/Soft** | **Source**         | **Impact**                                                                             |
|-------------|---------------------------------------------------------------------------------------------------------|-----------|---------------|--------------------|----------------------------------------------------------------------------------------|
| **CO-T-01** | Không thể gọi dịch vụ bên ngoài khi không có kết nối                                                    | Technical | **Hard**      | Giới hạn vật lý    | Mọi chức năng phụ thuộc dịch vụ bên ngoài đều không khả dụng ở T0                      |
| **CO-T-02** | Thiết bị mục tiêu có năng lực xử lý và bộ nhớ hạn chế                                                   | Technical | **Hard**      | Thực tế người dùng | Kiểm thử phải thực hiện trên thiết bị thật, không trên thiết bị của đội phát triển     |
| **CO-T-03** | Dữ liệu lưu cục bộ có thể bị hệ điều hành thu hồi                                                       | Technical | **Hard**      | Hành vi nền tảng   | Cần cơ chế phát hiện và phục hồi                                                       |
| **CO-T-04** | Không có nhân sự kỹ thuật tại cơ sở giáo dục                                                            | Technical | **Hard**      | Thực tế            | Sự cố nhỏ cũng có thể dẫn tới ngừng sử dụng vĩnh viễn                                  |
| **CO-T-05** | Kiểm chứng tự động tính đúng đắn nội dung chỉ khả thi với một số dạng nội dung                          | Technical | **Hard**      | Giới hạn công cụ   | Phần còn lại bắt buộc phải thẩm định thủ công                                          |
| **CO-T-06** | Đồng hồ thiết bị không đáng tin cậy                                                                     | Technical | **Hard**      | Thực tế phần cứng  | Không được dùng thời gian thiết bị để sắp thứ tự sự kiện                               |
| **CO-T-07** | Quá trình cài đặt phải đơn giản tới mức giáo viên tự thực hiện được                                     | Technical | **Hard**      | CO-T-04            | Giới hạn độ phức tạp triển khai                                                        |
| **CO-T-08** | Nội dung sinh bằng công cụ hỗ trợ phải hoàn tất trước khi phát hành                                     | Technical | **Hard**      | CO-T-01            | Loại bỏ phương án sinh nội dung tại thời điểm sử dụng                                  |
| CO-T-09     | Mô hình ngôn ngữ chạy cục bộ bị giới hạn bởi RAM, CPU và dung lượng trống của thiết bị mục tiêu         | Technical | Hard          | CO-T-02, SC-14     | Quyết định cỡ mô hình dùng được; có thể loại bỏ hoàn toàn phương án mô hình cục bộ     |
| CO-T-10     | Đầu ra mô hình phải tất định với cùng phiên bản trọng số, cùng mức lượng tử hoá và cùng tham số giải mã | Technical | Hard          | NFR-06, FR-23      | Bắt buộc giải mã tham lam và ghim phiên bản; đầu ra trích xuất được lưu như bằng chứng |

### 5.4.4. Infrastructure Constraint

| **ID**      | **Constraint**                                                            | **Type**       | **Hard/Soft**                           | **Source**       | **Impact**                                                                |
|-------------|---------------------------------------------------------------------------|----------------|-----------------------------------------|------------------|---------------------------------------------------------------------------|
| **CO-I-01** | Không có kết nối ổn định tại phòng học ở địa bàn mục tiêu                 | Infrastructure | **Hard** *(với T0/T1)*                  | Thực tế địa bàn  | Nền tảng của yêu cầu vận hành ngoại tuyến                                 |
| **CO-I-02** | Băng thông thấp và không ổn định khi có kết nối                           | Infrastructure | **Hard**                                | Thực tế          | Giới hạn kích thước nội dung                                              |
| **CO-I-03** | Số thiết bị ít hơn số người học                                           | Infrastructure | Soft                                    | CO-B-04          | Mô hình một người một thiết bị không áp dụng được                         |
| **CO-I-04** | Nguồn điện không hoàn toàn ổn định ở một số địa bàn                       | Infrastructure | Soft                                    | Thực tế          | Phiên làm việc có thể bị gián đoạn                                        |
| **CO-I-05** | Phòng máy dùng chung theo lịch, không sẵn sàng mọi lúc                    | Infrastructure | **Hard** *(nếu chọn mô hình phòng máy)* | Vận hành cơ sở   | Chu kỳ phản hồi kéo dài từ tiết học thành tuần                            |
| **CO-I-06** | Không có hạ tầng máy chủ hoặc mạng nội bộ tại cơ sở                       | Infrastructure | **Hard**                                | CO-T-04, CO-B-04 | Việc tập hợp dữ liệu lớp phải dựa vào thiết bị cá nhân                    |
| CO-I-07     | Cần một máy tính do giáo viên vận hành đóng vai trò điểm trung tâm cục bộ | Infrastructure | Hard (khi chọn SC-05)                   | Mục 19.7.2       | Phát sinh yêu cầu thiết bị cho giáo viên; phải đối chiếu NFR-14 và NFR-19 |

### 5.4.5. Data Constraint

| **ID**      | **Constraint**                                                           | **Type** | **Hard/Soft** | **Source**                | **Impact**                                                    |
|-------------|--------------------------------------------------------------------------|----------|---------------|---------------------------|---------------------------------------------------------------|
| **CO-D-01** | Không có dữ liệu người học thật tại thời điểm bắt đầu                    | Data     | **Hard**      | Trạng thái dự án          | Không hiệu chỉnh được tham số; không chứng minh được hiệu quả |
| **CO-D-02** | Ngân hàng câu hỏi nguồn có ràng buộc bản quyền                           | Data     | **Hard**      | Luật sở hữu trí tuệ       | Ảnh hưởng trực tiếp tới khả năng thương mại hoá               |
| **CO-D-03** | Dữ liệu phục vụ phân tích phải được ẩn danh tại nguồn                    | Data     | **Hard**      | Nguyên tắc bảo vệ dữ liệu | Không tiếp nhận bản có định danh                              |
| **CO-D-04** | Chỉ được thu thập dữ liệu phục vụ đúng mục đích đã công bố               | Data     | **Hard**      | Nguyên tắc tối thiểu hoá  | Giới hạn phạm vi thu thập                                     |
| **CO-D-05** | Cỡ mẫu nhỏ trong giai đoạn thử nghiệm                                    | Data     | **Hard**      | Nguồn lực                 | Phải chọn chỉ số phù hợp cỡ mẫu, không tuyên bố quá khả năng  |
| **CO-D-06** | Dữ liệu bị đứt đoạn khi người học chuyển lớp, chuyển trường, nghỉ dài    | Data     | **Hard**      | CO-E-09                   | Chuỗi bằng chứng không liên tục                               |
| **CO-D-07** | Không kiểm soát được điều kiện làm bài khi người học thực hiện ngoài lớp | Data     | **Hard**      | Bối cảnh sử dụng          | **Bằng chứng thu ngoài lớp có độ tin cậy thấp hơn**           |
| **CO-D-08** | Mọi kết luận phải gắn phiên bản mô hình và phiên bản logic               | Data     | **Hard**      | Yêu cầu tái lập           | Bắt buộc với khả năng tính lại                                |

### 5.4.6. Privacy / Legal Constraint

> Toàn bộ mục này **cần rà soát điều khoản áp dụng cụ thể** bởi người có chuyên môn pháp lý. Các văn bản nêu tên là điểm khởi đầu tra cứu, **không phải kết luận pháp lý**.

| **ID**      | **Constraint**                                                                                                                  | **Type** | **Hard/Soft**     | **Source**                                        | **Impact**                                            |
|-------------|---------------------------------------------------------------------------------------------------------------------------------|----------|-------------------|---------------------------------------------------|-------------------------------------------------------|
| **CO-L-01** | Xử lý dữ liệu cá nhân của người chưa thành niên có yêu cầu riêng về cơ sở pháp lý và sự đồng ý                                  | Privacy  | **Hard**          | Nghị định 13/2023/NĐ-CP; Luật Trẻ em — **cần rà** | **Chặn triển khai; tạo rủi ro cho cả cơ sở giáo dục** |
| **CO-L-02** | Phải xác định rõ ai có thẩm quyền đồng ý — cơ sở giáo dục hay người giám hộ                                                     | Privacy  | **Hard**          | Như trên — **cần rà**                             | Thu thập dữ liệu không có cơ sở hợp lệ                |
| **CO-L-03** | Chủ thể dữ liệu có quyền được biết, truy cập và yêu cầu xoá                                                                     | Privacy  | **Hard**          | Như trên — **cần rà**                             | Phải có cơ chế đáp ứng                                |
| **CO-L-04** | Học liệu nguồn được bảo hộ quyền tác giả                                                                                        | Legal    | **Hard**          | Luật Sở hữu trí tuệ — **cần rà**                  | Ảnh hưởng khả năng thương mại hoá                     |
| **CO-L-05** | Mô hình thu phí trực tiếp từ người học có thể chạm quy định về dạy thêm                                                         | Legal    | Soft — **cần rà** | Quy định về dạy thêm học thêm                     | Thêm căn cứ loại bỏ mô hình thu phí trực tiếp         |
| **CO-L-06** | Dữ liệu không được sử dụng ngoài mục đích đã công bố                                                                            | Privacy  | **Hard**          | Nguyên tắc giới hạn mục đích                      | Vi phạm đồng thời về pháp lý và niềm tin              |
| **CO-L-07** | Nghiên cứu có sự tham gia của người chưa thành niên cần quy trình đồng thuận phù hợp                                            | Legal    | **Hard**          | Chuẩn đạo đức nghiên cứu                          | Ảnh hưởng khả năng có đánh giá độc lập (BO-07)        |
| CO-L-08     | Trọng số mô hình ngôn ngữ có giấy phép riêng, có thể kèm chính sách sử dụng và nghĩa vụ truyền kèm điều khoản khi phân phối lại | Legal    | Hard              | Điều khoản của nhà phát hành mô hình — cần rà     | Chặn phân phối tới cơ sở giáo dục nếu không rà trước  |

### 5.4.7. Time / Resource Constraint

| **ID**      | **Constraint**                                                       | **Type** | **Hard/Soft** | **Source**       | **Impact**                                     |
|-------------|----------------------------------------------------------------------|----------|---------------|------------------|------------------------------------------------|
| **CO-R-01** | Khung thời gian tổng thể có giới hạn                                 | Time     | **Hard**      | Quyết định dự án | Giới hạn phạm vi                               |
| **CO-R-02** | Quy mô nhân lực có giới hạn, có thể không toàn thời gian             | Resource | **Hard**      | Nguồn lực đội    | Ước lượng theo toàn thời gian sẽ sai lệch      |
| **CO-R-03** | Cửa sổ xin chấp thuận triển khai nằm trước thời điểm bắt đầu năm học | Time     | **Hard**      | CO-B-06, CO-E-09 | Bỏ lỡ thì mất khả năng thu bằng chứng thực địa |
| **CO-R-04** | Điểm đo bị ràng buộc vào lịch kiểm tra định kỳ có sẵn                | Time     | **Hard**      | CO-E-06          | Sản phẩm phải sẵn sàng trước mốc đó            |
| **CO-R-05** | Năng lực thẩm định nội dung của chuyên môn có giới hạn               | Resource | **Hard**      | SH-03, SH-07     | **Nút thắt quyết định khả năng mở rộng**       |
| **CO-R-06** | Giáo viên tham gia không được bố trí giảm giờ dạy                    | Resource | **Hard**      | CO-B-04, CO-E-10 | Khó duy trì sự tham gia dài hạn                |

### 5.4.8. Phân tích chuyên sâu — ràng buộc băng thông thấp / ngoại tuyến

Đây là ràng buộc có ảnh hưởng sâu nhất tới thiết kế, nên được phân tích riêng.

**Bản chất của ràng buộc.** Ràng buộc thật là **CO-I-01** và **CO-I-02**: điều kiện kết nối tại địa bàn mục tiêu. Từ đó suy ra ràng buộc kỹ thuật **CO-T-01** (không gọi được dịch vụ bên ngoài) và **CO-T-08** (nội dung phải chuẩn bị trước).

**Điều KHÔNG được suy ra từ ràng buộc này.** Ràng buộc không quy định phải dùng công nghệ lưu trữ nào, kiến trúc ứng dụng nào, hay cơ chế đồng bộ nào. Những nội dung đó thuộc **Mục 14 — Solution Candidates**.

**Bốn hệ quả bắt buộc đối với yêu cầu:**

| **#** | **Hệ quả**                                                                                                                                        | **Requirement liên quan** |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| 1      | Toàn bộ chuỗi từ thu thập bằng chứng đến kết luận và đề xuất phải hoàn tất **trên phạm vi cục bộ**                                                | NFR-01, FR-01 → FR-13     |
| 2      | Việc tổng hợp dữ liệu **cấp lớp** cũng phải thực hiện được không cần kết nối — nếu không, thông tin cho giáo viên sẽ trống rỗng đúng lúc cần nhất | FR-18                     |
| 3      | Kích thước nội dung phải nằm trong ngân sách truyền dữ liệu khả thi ở băng thông thực tế                                                          | NFR-02                    |
| 4      | Mọi chức năng cần dịch vụ bên ngoài phải được xếp vào **tầng tuỳ chọn**, không nằm trên đường đi tối thiểu của người dùng                         | NFR-01, AIR-06            |

**Thang suy giảm chức năng.** Yêu cầu được diễn giải theo bốn bậc, mỗi bậc vẫn phải sử dụng được:

| **Bậc** | **Điều kiện**                          | **Yêu cầu về chức năng**                 |
|---------|----------------------------------------|------------------------------------------|
| L0      | Chưa từng có kết nối kể từ lần cài đặt | Toàn bộ chức năng cốt lõi phải hoạt động |
| L1      | Có kết nối không thường xuyên          | Bổ sung sao lưu và cập nhật nội dung     |
| L2      | Có kết nối theo khu vực và theo lịch   | Bổ sung nội dung dung lượng lớn          |
| L3      | Kết nối ổn định                        | Bổ sung các chức năng mở rộng            |

> **Nguyên tắc:** **L0 đã phải là một sản phẩm hoàn chỉnh.** Nếu có chức năng nào được coi là cốt lõi mà chỉ hoạt động từ L2 trở lên, thì yêu cầu đã bị đặt sai.

## 5.5. Dependencies

| **ID**     | **Dependency**                                                                  | **Loại**  | **Phụ thuộc vào** | **Ảnh hưởng nếu không có**                                     |
|------------|---------------------------------------------------------------------------------|-----------|-------------------|----------------------------------------------------------------|
| **DEP-01** | Chấp thuận triển khai từ cơ sở giáo dục                                         | Tổ chức   | SH-04             | Không thu được bằng chứng thực địa (BO-07)                     |
| **DEP-02** | Sự tham gia của giáo viên trong quá trình đồng thiết kế và thử nghiệm           | Con người | SH-01             | Yêu cầu không được kiểm chứng; rủi ro RK-01 hiện thực hoá      |
| **DEP-03** | Năng lực thẩm định chuyên môn đối với nội dung và mô hình cấu trúc kiến thức    | Con người | SH-03, SH-07      | Không có nội dung hợp lệ để đưa tới người học                  |
| **DEP-04** | Nguồn dữ liệu kết quả học tập thật phục vụ kiểm định mô hình cấu trúc kiến thức | Dữ liệu   | Bên thứ ba        | Mô hình cấu trúc kiến thức không có căn cứ thực nghiệm (AS-44) |
| **DEP-05** | Kết luận rà soát pháp lý về dữ liệu người chưa thành niên                       | Pháp lý   | Bộ phận pháp lý   | **Chặn toàn bộ hoạt động thu thập dữ liệu**                    |
| **DEP-06** | Kết luận rà soát bản quyền học liệu nguồn                                       | Pháp lý   | Bộ phận pháp lý   | Chặn khả năng thương mại hoá                                   |
| **DEP-07** | Sự tham gia của đơn vị chuyên môn giáo dục cho đánh giá độc lập                 | Tổ chức   | SH-08             | Không đạt BO-07                                                |
| **DEP-08** | Thiết bị thử nghiệm đại diện cho điều kiện thực tế                              | Vật tư    | Đội phát triển    | Không kiểm chứng được NFR-14                                   |

---

# 6. PHÂN TÍCH YÊU CẦU

## 6.0. Nguyên tắc viết yêu cầu

Mọi yêu cầu trong mục này tuân thủ bốn tiêu chí:

| **Tiêu chí**             | **Nội dung**                                                      |
|--------------------------|-------------------------------------------------------------------|
| **Solution-independent** | Mô tả *cần đạt được điều gì*, không mô tả *dùng công nghệ nào*    |
| **Atomic**               | Một yêu cầu diễn đạt một năng lực; không ghép nhiều nội dung      |
| **Testable**             | Có thể xác định được đã đạt hay chưa                              |
| **Traceable**            | Truy được về Problem, Gap, Stakeholder Need, Constraint hoặc Risk |

**Ví dụ đối chiếu:**

| **Cách viết sai (chứa giải pháp)**                              | **Cách viết đúng (mô tả năng lực)**                                                               |
|-----------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| "Hệ thống phải dùng đồ thị tri thức để truy ngược kỹ năng"      | "Hệ thống phải xác định được các kiến thức nền có khả năng gây ra lỗi hiện tại của người học"     |
| "Hệ thống phải dùng ứng dụng web lưu trữ cục bộ"                | "Các chức năng cốt lõi phải tiếp tục hoạt động khi không có kết nối"                              |
| "Hệ thống phải có màn hình tổng hợp cho giáo viên"              | "Giáo viên phải xác định được nhóm người học nào cần can thiệp trước và vì sao"                   |
| "Hệ thống phải dùng mô hình ngôn ngữ lớn sinh biến thể bài tập" | "Kho phép đo phải đủ lớn để người học không gặp lại cùng một phép đo trong khoảng thời gian ngắn" |

## 6.1. Business Requirements

| **ID**     | **Requirement**                                                                                | **Rationale**                                                        | **Source**        | **Priority** | **Evidence Status** |
|------------|------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|-------------------|--------------|---------------------|
| **BRQ-01** | Giải pháp phải rút ngắn khoảng thời gian từ khi lỗ hổng hình thành đến khi được phát hiện      | Trong khoảng chờ đó người học tiếp tục học trên nền chưa vững        | BO-01, GAP-02     | Must         | **[I]**           |
| **BRQ-02** | Giải pháp phải cho phép dạy phân hoá mà không làm tăng khối lượng công việc của giáo viên      | Tăng tải dẫn tới ngừng sử dụng                                       | BO-02, RK-01      | Must         | **[I]**           |
| **BRQ-03** | Giải pháp phải giảm số quyết định can thiệp mà giáo viên phải ra trên mỗi lớp                  | Cá nhân hoá chi phí tuyến tính là bất khả thi                        | BO-03, GAP-04     | Must         | **[I]**           |
| **BRQ-04** | Giải pháp phải triển khai được ở cơ sở không có hạ tầng CNTT và không có nhân sự kỹ thuật      | Nhóm ưu tiên nằm ở địa bàn hạ tầng hạn chế                           | BO-05, CO-T-04    | Must         | **[A]**           |
| **BRQ-05** | Giải pháp không được tạo rủi ro pháp lý hoặc đạo đức đối với dữ liệu người học chưa thành niên | Một sự cố đủ để chấm dứt dự án                                       | BO-06, CO-L-01    | Must         | **[F]**           |
| **BRQ-06** | Hiệu quả của giải pháp phải kiểm chứng được bởi bên độc lập                                    | Kết quả tự đánh giá trên dữ liệu tự sinh không có giá trị chứng minh | BO-07             | Must         | **[F]**           |
| **BRQ-07** | Giải pháp không được làm gia tăng khoảng cách giữa các nhóm năng lực                           | Hệ thích ứng có khả năng khoá nhóm yếu trong vòng lặp hỗ trợ         | BO-08, GAP-14     | Must         | **[I]**           |
| **BRQ-08** | Chi phí sở hữu phải nằm trong khả năng chi trả và quy trình mua sắm của tổ chức giáo dục công  | Người mua là tổ chức công lập                                        | CO-B-01 → CO-B-03 | Should       | **[A]**           |

## 6.2. Stakeholder Requirements

Nhu cầu chi tiết của từng bên đã trình bày tại **Mục 2.2**. Mục này tổng hợp thành yêu cầu cấp stakeholder và chỉ ra yêu cầu chức năng tương ứng.

| **ID**    | **Stakeholder Requirement**                                                           | **Bên**      | **Truy về Need**   | **FR tương ứng** | **Priority** |
|-----------|---------------------------------------------------------------------------------------|--------------|--------------------|------------------|--------------|
| **SR-01** | Giáo viên phải xác định được từng người học đang thiếu kiến thức nền nào              | SH-01        | SN-T-01            | FR-03            | Must         |
| **SR-02** | Giáo viên phải xác định được nhóm nào cần can thiệp trước, kèm căn cứ kiểm chứng được | SH-01        | SN-T-02, SN-T-03   | FR-15, FR-16     | Must         |
| **SR-03** | Giáo viên phải giữ được quyền quyết định cuối cùng                                    | SH-01        | SN-T-04            | FR-17            | Must         |
| **SR-04** | Giáo viên phải được bảo đảm dữ liệu không dùng để đánh giá bản thân                   | SH-01        | SN-T-05            | AIR-19           | Must         |
| **SR-05** | Giáo viên phải hiểu được căn cứ dẫn tới kết luận                                      | SH-01        | SN-T-06            | FR-16, NFR-08    | Must         |
| **SR-06** | Giáo viên phải bổ sung được nội dung và kinh nghiệm riêng                             | SH-01        | SN-T-08            | FR-19            | Should       |
| **SR-07** | Người học không được gán nhãn năng lực ở bất kỳ điểm tiếp xúc nào                     | SH-02, SH-06 | SN-S-01, SN-P-01   | AIR-13           | Must         |
| **SR-08** | Người học chỉ phải bù đúng phần còn thiếu                                             | SH-02        | SN-S-02            | FR-12            | Must         |
| **SR-09** | Người học vẫn phải tiếp cận được nội dung của lớp hiện tại                            | SH-02        | SN-S-03            | FR-13            | Must         |
| **SR-10** | Số phép đo yêu cầu người học thực hiện phải ở mức chấp nhận được                      | SH-02        | SN-S-04            | FR-06            | Should       |
| **SR-11** | Kết quả cá nhân không hiển thị cho người học khác                                     | SH-02        | SN-S-06            | FR-22            | Must         |
| **SR-12** | Triển khai không đòi hỏi mua sắm thiết bị mới và không cần nhân sự kỹ thuật           | SH-04        | SN-SC-01, SN-SC-02 | NFR-14, NFR-16   | Must         |
| **SR-13** | Toàn bộ nội dung phải qua thẩm định chuyên môn trước khi tới người học                | SH-03        | SN-SC-03           | FR-20, NFR-09    | Must         |
| **SR-14** | Cơ sở giáo dục phải dừng được việc sử dụng và lấy lại dữ liệu bất cứ lúc nào          | SH-04        | SN-SC-05           | FR-21            | Must         |
| **SR-15** | Thông tin tổng hợp cấp quản lý không được chứa dữ liệu định danh người học            | SH-05, SH-06 | SN-G-02            | DR-08            | Must         |
| **SR-16** | Bên đánh giá độc lập phải tiếp cận được dữ liệu và phương pháp đủ để tái lập kết luận | SH-08        | SN-E-01            | NFR-06, DR-08    | Should       |
| **SR-17** | Khối lượng thẩm định nội dung phải nằm trong năng lực thực tế của chuyên môn          | SH-03, SH-07 | SN-C-01            | NFR-17           | Must         |

## 6.3. Functional Requirements

| **ID**    | **Requirement**                                                                                                                          | **Actor**            | **Source**        | **Priority** | **Dependency** |
|-----------|------------------------------------------------------------------------------------------------------------------------------------------|----------------------|-------------------|--------------|----------------|
| **FR-01** | Hệ thống phải ghi nhận được mỗi lượt trả lời của người học kèm ngữ cảnh đủ để suy luận về sau                                            | Hệ thống             | GAP-07, P1        | Must         | —              |
| **FR-02** | Hệ thống phải ước lượng được mức thành thạo của người học trên từng đơn vị kiến thức                                                     | Hệ thống             | GAP-01            | Must         | FR-01          |
| **FR-03** | Hệ thống phải xác định được các kiến thức nền có khả năng là nguyên nhân của lỗi hiện tại                                                | Hệ thống             | P1, GAP-01        | Must         | FR-02, DR-01   |
| **FR-04** | Hệ thống phải xếp hạng các nguyên nhân khả dĩ theo mức độ phù hợp với bằng chứng thu được                                                | Hệ thống             | GAP-01, GAP-05    | Must         | FR-03          |
| **FR-05** | Mỗi phép đo phải thu hẹp được không gian giả thuyết về nguyên nhân                                                                       | Hệ thống             | GAP-09            | Should       | DR-02          |
| **FR-06** | Khi bằng chứng chưa đủ, hệ thống phải chủ động chọn phép đo có khả năng phân biệt tốt nhất giữa các giả thuyết đang cạnh tranh           | Hệ thống             | GAP-05, GAP-09    | Must         | FR-04, DR-02   |
| **FR-07** | Hệ thống phải nhận diện được trường hợp nguyên nhân không thuộc về kiến thức và không kết luận nguyên nhân kiến thức trong trường hợp đó | Hệ thống             | GAP-13, RK-03     | Should       | FR-01          |
| **FR-08** | Hệ thống phải từ chối kết luận khi bằng chứng chưa đạt mức tin cậy yêu cầu, và thể hiện rõ trạng thái đó                                 | Hệ thống             | GAP-05, BR-01     | Must         | FR-04          |
| **FR-09** | Hệ thống phải nhận diện được người học đã nắm vững kiến thức nền và chuyển sang nội dung mở rộng thay vì nội dung bù                     | Hệ thống             | GAP-06            | Must         | FR-02          |
| **FR-10** | Hệ thống phải phân biệt được lỗ hổng ở phạm vi cá nhân với lỗ hổng ở phạm vi cả lớp                                                      | Hệ thống             | GAP-03            | Should       | FR-03          |
| **FR-11** | Hệ thống phải gom người học theo nguyên nhân gốc chung thành số nhóm mà giáo viên xử lý được trong một tiết                              | Hệ thống             | GAP-03, GAP-04    | Must         | FR-03          |
| **FR-12** | Hệ thống phải xây dựng được phương án hỗ trợ tối giản từ nguyên nhân gốc tới mục tiêu học tập, loại bỏ phần người học đã nắm vững        | Hệ thống             | GAP-06            | Must         | FR-02, FR-03   |
| **FR-13** | Hệ thống phải giới hạn độ dài phương án hỗ trợ và bảo đảm người học vẫn tiếp cận mục tiêu của lớp hiện tại                               | Hệ thống             | GAP-14, BR-11     | Must         | FR-12          |
| **FR-14** | Hệ thống phải xác nhận lại mức thành thạo bằng phép đo độc lập với phần người học đã luyện tập                                           | Hệ thống             | GAP-07, BR-10     | Must         | FR-12, DR-02   |
| **FR-15** | Hệ thống phải trình bày cho giáo viên các nhóm cần can thiệp kèm thứ tự ưu tiên                                                          | Hệ thống → Giáo viên | GAP-03, GAP-04    | Must         | FR-11          |
| **FR-16** | Hệ thống phải trình bày chuỗi bằng chứng dẫn tới mỗi kết luận, ở mức chi tiết giáo viên kiểm chứng được                                  | Hệ thống → Giáo viên | GAP-08, GAP-12    | Must         | FR-01, FR-04   |
| **FR-17** | Giáo viên phải bác bỏ hoặc điều chỉnh được mọi kết luận và đề xuất; mọi lần điều chỉnh phải được ghi nhận                                | Giáo viên            | GAP-12, BR-03     | Must         | FR-15          |
| **FR-18** | Hệ thống phải tập hợp được bằng chứng ở phạm vi cả lớp mà không cần kết nối tới hạ tầng bên ngoài                                        | Hệ thống             | GAP-10, CO-I-01   | Must         | FR-01          |
| **FR-19** | Giáo viên phải bổ sung được nội dung hoặc nhiệm vụ riêng vào phương án hỗ trợ của người học                                              | Giáo viên            | SN-T-08           | Should       | FR-12          |
| **FR-20** | Hệ thống phải bảo đảm mọi nội dung tới người học đã qua thẩm định chuyên môn                                                             | Hệ thống             | SN-SC-03, CO-T-05 | Must         | DR-02          |
| **FR-21** | Cơ sở giáo dục phải xuất và xoá được toàn bộ dữ liệu thuộc phạm vi của mình                                                              | Cơ sở giáo dục       | SN-SC-05, CO-L-03 | Must         | DR-08          |
| **FR-22** | Hệ thống phải hỗ trợ nhiều người học sử dụng chung một thiết bị với dữ liệu tách biệt và không hiển thị chéo                             | Hệ thống             | CO-I-03, SN-S-06  | Should       | —              |
| **FR-23** | Hệ thống phải tính lại được mọi kết luận từ bằng chứng gốc khi mô hình hoặc logic thay đổi phiên bản                                     | Hệ thống             | BR-06, CO-D-08    | Must         | FR-01, DR-07   |
| **FR-24** | Hệ thống phải bảo đảm người học không gặp lại cùng một phép đo trong khoảng thời gian ngắn                                               | Hệ thống             | RK-07             | Should       | DR-02          |

## 6.4. Non-Functional Requirements

> **Nguyên tắc:** không đặt ngưỡng số khi chưa có căn cứ. Mọi ngưỡng chưa xác định ghi **TBD — cần validation**, kèm phương pháp xác định.

### 6.4.1. Offline Capability

| **ID**     | **Requirement**                                                                                         | **Ngưỡng**                           | **Source**      | **Cách xác định ngưỡng**                                                   |
|------------|---------------------------------------------------------------------------------------------------------|--------------------------------------|-----------------|----------------------------------------------------------------------------|
| **NFR-01** | Toàn bộ chức năng cốt lõi phải hoạt động khi không có kết nối, bao gồm cả việc tổng hợp dữ liệu cấp lớp | Thời lượng liên tục: **TBD**         | CO-I-01, GAP-10 | Khảo sát chu kỳ có kết nối thực tế tại địa bàn (OQ-07)                     |
| **NFR-02** | Kích thước nội dung cần nạp cho một đơn vị chương trình phải nằm trong ngân sách truyền dữ liệu khả thi | Kích thước và thời gian nạp: **TBD** | CO-I-02         | Đo băng thông thực tế; xác định thời gian nạp chấp nhận được với giáo viên |
| **NFR-03** | Quá trình đồng bộ khi có kết nối phải không làm mất dữ liệu, kể cả khi gián đoạn giữa chừng             | Tỷ lệ mất dữ liệu = **0**            | CO-I-02, GAP-07 | Ngưỡng này là chính sách, không cần dữ liệu để đặt                         |
| **NFR-04** | Việc nạp nội dung phải tiếp tục được sau gián đoạn, không phải bắt đầu lại từ đầu                       | Bắt buộc                             | CO-I-02         | —                                                                          |

### 6.4.2. Performance

| **ID**     | **Requirement**                                                                                                                                                                                                                    | **Ngưỡng** | **Source**       | **Cách xác định ngưỡng**                             |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|------------------|------------------------------------------------------|
| **NFR-05** | Kết quả chẩn đoán và thông tin tổng hợp cấp lớp phải sẵn sàng trong khoảng thời gian phù hợp với nhịp ra quyết định trên lớp                                                                                                       | **TBD**    | SN-T-07, CO-E-03 | Quan sát nhịp làm việc thực tế của giáo viên (OQ-06) |
| **NFR-06** | Kết luận nguyên nhân gốc, mức tin cậy, kết quả gom nhóm và thứ tự ưu tiên phải tất định với cùng dữ liệu đầu vào và cùng phiên bản logic. Phần diễn đạt bằng ngôn ngữ tự nhiên không thuộc phạm vi ràng buộc này nhưng chịu AIR-24 | Bắt buộc   | BO-07, BR-06     | Ngưỡng là chính sách                                 |

### 6.4.3. Reliability

| **ID**     | **Requirement**                                                                         | **Ngưỡng** | **Source**     |
|------------|-----------------------------------------------------------------------------------------|------------|----------------|
| **NFR-07** | Mọi kết luận phải truy vết được về bằng chứng gốc; bằng chứng gốc không bị sửa hoặc xoá | Bắt buộc   | GAP-07, BO-07  |
| **NFR-18** | Hệ thống phải phát hiện được tình trạng mất dữ liệu cục bộ và phục hồi từ nguồn còn lại | Bắt buộc   | CO-T-03, AS-26 |

### 6.4.4. Usability

| **ID**     | **Requirement**                                                                                                                      | **Ngưỡng** | **Source**     | **Cách xác định**                           |
|------------|--------------------------------------------------------------------------------------------------------------------------------------|------------|----------------|---------------------------------------------|
| **NFR-11** | Giáo viên phải sử dụng được mà không cần đào tạo kéo dài; phải tự tạo ra được một kết quả đúng ngay trong lần làm quen đầu tiên      | **TBD**    | RK-01, SH-01   | Thử nghiệm với giáo viên chưa từng tiếp xúc |
| **NFR-12** | Nội dung hiển thị cho người học và người giám hộ phải sử dụng ngôn ngữ về kỹ năng cần củng cố, không dùng ngôn ngữ xếp loại năng lực | Bắt buộc   | BR-13, SN-P-01 | Ngưỡng là chính sách                        |

### 6.4.5. Security & Privacy

| **ID**     | **Requirement**                                                                                                         | **Ngưỡng** | **Source**        |
|------------|-------------------------------------------------------------------------------------------------------------------------|------------|-------------------|
| **NFR-09** | Không nội dung nào tới người học khi chưa được xác nhận tính đúng đắn và chưa qua thẩm định chuyên môn                  | Bắt buộc   | SN-SC-03, CO-T-05 |
| **NFR-10** | Dữ liệu định danh người học mặc định không rời khỏi phạm vi cơ sở giáo dục; dữ liệu phục vụ phân tích phải được ẩn danh | Bắt buộc   | CO-L-01, CO-D-03  |
| **NFR-13** | Kết quả của hệ thống không được sử dụng cho quyết định ảnh hưởng tới quyền lợi người học hoặc để đánh giá giáo viên     | Bắt buộc   | BR-12, BR-15      |

### 6.4.6. Explainability

| **ID**     | **Requirement**                                                                                   | **Ngưỡng**               | **Source**      | **Cách xác định**                    |
|------------|---------------------------------------------------------------------------------------------------|--------------------------|-----------------|--------------------------------------|
| **NFR-08** | Mọi kết luận phải kèm chuỗi bằng chứng diễn đạt bằng ngôn ngữ chuyên môn quen thuộc với giáo viên | **TBD** — dạng trình bày | GAP-08, SN-T-06 | Thử nghiệm mức độ hiểu với giáo viên |

### 6.4.7. Maintainability & Scalability

| **ID**     | **Requirement**                                                                              | **Ngưỡng** | **Source**        | **Cách xác định ngưỡng**               |
|------------|----------------------------------------------------------------------------------------------|------------|-------------------|----------------------------------------|
| **NFR-15** | Việc bổ sung phạm vi kiến thức mới không được đòi hỏi thay đổi cơ chế chẩn đoán              | Bắt buộc   | BO-04, RK-02      | —                                      |
| **NFR-16** | Vận hành không đòi hỏi nhân sự kỹ thuật thường trực tại cơ sở giáo dục                       | Bắt buộc   | CO-T-04, SN-SC-02 | —                                      |
| **NFR-17** | Khối lượng thẩm định nội dung sinh ra phải nằm trong năng lực thực tế của bộ phận chuyên môn | **TBD**    | CO-R-05, SR-17    | Đo năng suất thẩm định thực tế (OQ-05) |

### 6.4.8. Compatibility

| **ID**     | **Requirement**                                                                          | **Ngưỡng**                  | **Source**       | **Cách xác định**                                              |
|------------|------------------------------------------------------------------------------------------|-----------------------------|------------------|----------------------------------------------------------------|
| **NFR-14** | Hệ thống phải hoạt động được trên thiết bị phổ thông đời cũ đang có tại địa bàn mục tiêu | Cấu hình tối thiểu: **TBD** | CO-T-02, CO-B-04 | Khảo sát thiết bị thực tế (OQ-07); kiểm thử trên thiết bị thật |
| **NFR-19** | Dung lượng lưu trữ chiếm dụng không được buộc người dùng gỡ bỏ ứng dụng khác             | **TBD**                     | CO-T-02          | Khảo sát dung lượng trống thực tế                              |

### 6.4.9. Fairness

| **ID**     | **Requirement**                                                                                  | **Ngưỡng** | **Source**    | **Cách xác định**                               |
|------------|--------------------------------------------------------------------------------------------------|------------|---------------|-------------------------------------------------|
| **NFR-20** | Chất lượng chẩn đoán không được suy giảm có hệ thống đối với nhóm người học có năng lực thấp hơn | **TBD**    | BO-08, GAP-14 | Phân tích kết quả theo nhóm khi có dữ liệu thật |

## 6.5. Data Requirements

| **ID**    | **Requirement**                                                                                                                                                                      | **Nguồn dữ liệu**                                                       | **Yêu cầu chất lượng**                                              | **Quyền sử dụng**                                            | **Evidence Status**                                                                                                                                     |
|-----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------|---------------------------------------------------------------------|--------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| **DR-01** | Phải có mô hình mô tả các đơn vị kiến thức và quan hệ phụ thuộc giữa chúng                                                                                                           | Khung chương trình + thẩm định chuyên môn + kiểm định trên dữ liệu thật | Được chuyên môn thẩm định **và** có căn cứ thực nghiệm              | Phái sinh từ tài liệu công khai; phần thẩm định thuộc nội bộ | **[F]** — hiện là bản nháp (F-07)                                                                                                                     |
| **DR-02** | Phải có kho phép đo đủ lớn, mỗi phép đo gắn với đơn vị kiến thức xác định                                                                                                            | Ngân hàng câu hỏi + nội dung biên soạn mới                              | Đáp án đã được xác nhận; đã qua thẩm định                           | **Cần rà soát bản quyền (OQ-09)**                            | **[F]**                                                                                                                                               |
| **DR-03** | Phải có nhật ký hành vi làm bài của người học ở mức chi tiết đủ để suy luận                                                                                                          | Ghi nhận trong quá trình sử dụng                                        | Không mất mát; gắn định danh nội bộ, không dùng định danh trực tiếp | **Cần cơ sở pháp lý (OQ-08)**                                | **[F]**                                                                                                                                               |
| **DR-04** | Phải có dữ liệu ánh xạ giữa kiểu sai và nguyên nhân tương ứng                                                                                                                        | Thẩm định chuyên môn; tích luỹ theo thời gian                           | Do chuyên môn xác nhận                                              | Nội bộ                                                       | **[I]** — cơ chế tích luỹ nay có lời giải: trích xuất bằng mô hình cục bộ (AIR-25, Phụ lục F TS-04) kết hợp tích luỹ qua các lần giáo viên điều chỉnh |
| **DR-05** | Phải có dữ liệu kết quả học tập thật, không do hệ thống tự sinh, để kiểm định mô hình                                                                                                | Bên thứ ba                                                              | Người thật; đủ quy mô để phân tích quan hệ phụ thuộc                | Cần thoả thuận và ẩn danh tại nguồn                          | **[F]** — chưa có (F-05)                                                                                                                              |
| **DR-06** | Phải có dữ liệu chuẩn đối chiếu: chẩn đoán độc lập của chuyên gia trên cùng bài làm                                                                                                  | Giáo viên tham gia                                                      | Tối thiểu ba chuyên gia độc lập; đo mức đồng thuận                  | Thoả thuận với người tham gia                                | **[I]** — chưa thu thập                                                                                                                               |
| **DR-07** | Mọi kết luận phải được gắn phiên bản mô hình kiến thức, phiên bản logic, và — khi có dùng mô hình ngôn ngữ cục bộ — băm tệp trọng số, mức lượng tử hoá và tham số giải mã đã sử dụng | Hệ thống                                                                | Bắt buộc                                                            | Nội bộ                                                       | **[F]**                                                                                                                                               |
| **DR-08** | Dữ liệu định danh không rời khỏi phạm vi cơ sở giáo dục; dữ liệu phân tích phải ẩn danh                                                                                              | Hệ thống                                                                | Ẩn danh tại nguồn                                                   | Bắt buộc                                                     | **[F]**                                                                                                                                               |
| **DR-09** | Phải có cơ chế xuất và xoá dữ liệu theo yêu cầu của chủ thể có thẩm quyền                                                                                                            | Hệ thống                                                                | Bắt buộc                                                            | Bắt buộc                                                     | **[F]**                                                                                                                                               |
| **DR-10** | Thứ tự sự kiện không được phụ thuộc vào đồng hồ thiết bị                                                                                                                             | Hệ thống                                                                | Bắt buộc                                                            | —                                                            | **[F]** — CO-T-06                                                                                                                                     |
| **DR-11** | Dữ liệu phải phân biệt được bối cảnh thu thập (trong lớp / ngoài lớp) để đánh giá độ tin cậy                                                                                         | Hệ thống                                                                | Bắt buộc                                                            | —                                                            | **[I]** — CO-D-07                                                                                                                                     |

## 6.6. AI Requirements

### 6.6.1. Phạm vi AI được phép quyết định

| **ID**     | **Requirement**                                                         | **Điều kiện kèm theo**                                                                                | **Source**     | **Evidence Status** |
|------------|-------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|----------------|---------------------|
| **AIR-01** | Được phép đề xuất giả thuyết về nguyên nhân gốc, kèm mức tin cậy        | Luôn ở dạng đề xuất, không phải kết luận cuối cùng                                                    | FR-03, GAP-12  | **[F]**           |
| **AIR-02** | Được phép chọn phép đo tiếp theo nhằm thu hẹp không gian giả thuyết     | Chỉ trong phạm vi kho phép đo đã thẩm định                                                            | FR-06          | **[F]**           |
| **AIR-03** | Được phép quyết định thời điểm bằng chứng chưa đủ để kết luận           | Trạng thái này phải hiển thị rõ, không được ẩn đi                                                     | FR-08, BR-01   | **[F]**           |
| **AIR-04** | Được phép xây dựng đề xuất phương án hỗ trợ                             | Giáo viên phải điều chỉnh được                                                                        | FR-12          | **[F]**           |
| **AIR-05** | Được phép gom nhóm và sắp thứ tự ưu tiên để trình bày cho giáo viên     | Kèm bằng chứng; giáo viên sắp lại được                                                                | FR-11, FR-15   | **[F]**           |
| **AIR-06** | Được phép hỗ trợ diễn giải ngôn ngữ và sinh biến thể của nội dung đã có | **Chỉ ở giai đoạn chuẩn bị**, phải qua kiểm chứng tự động và thẩm định chuyên môn trước khi phát hành | FR-24, CO-T-08 | **[I]**           |

### 6.6.2. Ranh giới AI không được phép — quy tắc cứng

| **ID**     | **Cấm**                                                                                                   | **Rationale**                                                                              | **Source**       | **Evidence Status** |
|------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|------------------|---------------------|
| **AIR-07** | Không được sửa đổi đáp án đúng, nội dung gốc hoặc mô hình cấu trúc kiến thức đã thẩm định                 | Sai sót về kiến thức phá huỷ toàn bộ độ tin cậy; trách nhiệm chuyên môn thuộc về con người | BR-09, NFR-09    | **[F]**           |
| **AIR-08** | Không được đưa ra hoặc gợi ý quyết định ảnh hưởng tới quyền lợi học tập của người học                     | Độ chính xác hiện tại không đủ cho quyết định không đảo ngược được                         | BR-12, CO-E-08   | **[F]**           |
| **AIR-09** | Không được tạo ra đánh giá về giáo viên                                                                   | Vi phạm dẫn tới mất toàn bộ người dùng                                                     | BR-15, RK-01     | **[F]**           |
| **AIR-10** | Không được kết luận nguyên nhân khi bằng chứng dưới ngưỡng tin cậy                                        | Kết luận sai kèm mức tin cậy cao gây hại hơn việc không kết luận                           | BR-01, FR-08     | **[F]**           |
| **AIR-11** | Không được tự thực hiện can thiệp tới người học mà không thông qua giáo viên                              | Giáo viên là điểm quyết định cuối cùng                                                     | BR-04, GAP-12    | **[F]**           |
| **AIR-12** | Không được phát hành nội dung tới người học khi chưa qua thẩm định chuyên môn                             | Áp dụng cho cả nội dung do công cụ tự động sinh ra                                         | NFR-09, SN-SC-03 | **[F]**           |
| **AIR-13** | Không được sử dụng nhãn năng lực hoặc nhãn cấp lớp trong nội dung hiển thị cho người học và người giám hộ | Tác động tâm lý tiêu cực và rủi ro phản ứng từ gia đình                                    | BR-13, SN-S-01   | **[I]**           |

### 6.6.3. Confidence, Abstention, Oversight

| **ID**     | **Requirement**                                                                                                                    | **Ngưỡng**               | **Source**     | **Cách xác định**                                                    |
|------------|------------------------------------------------------------------------------------------------------------------------------------|--------------------------|----------------|----------------------------------------------------------------------|
| **AIR-14** | Mọi kết luận phải kèm mức tin cậy tường minh, không ở dạng nhị phân                                                                | Thang biểu đạt: **TBD**  | FR-08, NFR-08  | Thử nghiệm mức độ hiểu với giáo viên                                 |
| **AIR-15** | Tỷ lệ kết luận sai trong khi mức tin cậy cao phải bằng không; khi phân vân phải ưu tiên từ chối kết luận                           | **= 0**                  | BR-01, BO-07   | Ngưỡng là chính sách; đo trên dữ liệu thật khi có                    |
| **AIR-16** | Tỷ lệ từ chối kết luận phải nằm trong dải sử dụng được                                                                             | Dải: **TBD**             | FR-08, SN-S-04 | Chạy trên dữ liệu thật; đối chiếu với ngưỡng chịu đựng của người học |
| **AIR-17** | Mỗi kết luận phải kèm chuỗi bằng chứng cụ thể đã dẫn tới nó                                                                        | Bắt buộc                 | NFR-08         | —                                                                    |
| **AIR-18** | Giáo viên phải bác bỏ được mọi đầu ra; mọi lần bác bỏ phải được ghi nhận và sử dụng làm tín hiệu giám sát chất lượng               | Bắt buộc                 | FR-17, BR-03   | —                                                                    |
| **AIR-19** | Phải có chỉ số giám sát vận hành phát hiện suy giảm chất lượng (biến động bất thường của tỷ lệ bác bỏ hoặc tỷ lệ từ chối kết luận) | Ngưỡng cảnh báo: **TBD** | RK-01, BO-07   | Xác định sau khi có dữ liệu nền                                      |
| **AIR-20** | Chất lượng chẩn đoán phải được kiểm tra tách theo nhóm người học để phát hiện suy giảm có hệ thống                                 | **TBD**                  | NFR-20, BO-08  | Phân tích theo nhóm khi có dữ liệu thật                              |

### 6.6.4. Failure Behavior

| **ID**     | **Requirement**                                                                                                                                         | **Source**     |
|------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|----------------|
| **AIR-21** | Khi không thể kết luận, hệ thống phải trả về trạng thái tường minh kèm lý do, không được trả về kết quả mặc định                                        | FR-08, BR-01   |
| **AIR-22** | Khi dữ liệu đầu vào bất thường hoặc không đủ, hệ thống phải chuyển quyền quyết định về giáo viên thay vì tự xử lý                                       | AIR-11, GAP-12 |
| **AIR-23** | Khi mô hình cấu trúc kiến thức thay đổi phiên bản, các kết luận đã lưu phải được đánh dấu là cần tính lại, không được giữ nguyên như kết luận hiện hành | FR-23, DR-07   |

---

# 7. USER STORIES & USE CASES

## 7.1. Actors

| **ID**     | **Actor**                    | **Loại** | **Mô tả**                                                                                |
|------------|------------------------------|----------|------------------------------------------------------------------------------------------|
| **ACT-T**  | Giáo viên                    | Chính    | Người ra quyết định can thiệp; người dùng có quyền quyết định cuối cùng                  |
| **ACT-S**  | Người học                    | Chính    | Người tạo ra bằng chứng và người thụ hưởng phương án hỗ trợ                              |
| **ACT-R**  | Người thẩm định chuyên môn   | Phụ      | Tổ trưởng chuyên môn hoặc người được phân công; kiểm duyệt nội dung và mô hình kiến thức |
| **ACT-A**  | Người quản lý cơ sở giáo dục | Phụ      | Phê duyệt triển khai; quản lý vòng đời dữ liệu                                           |
| **ACT-SY** | Hệ thống                     | Hệ thống | Thực hiện suy luận, tổng hợp và trình bày                                                |
| **ACT-E**  | Bên đánh giá độc lập         | Phụ      | Kiểm chứng phương pháp và kết quả                                                        |

## 7.2. Epic / Use Case List

| **Epic**                                 | **ID** | **Use Case**                                              | **Actor chính** | **Priority** |
|------------------------------------------|--------|-----------------------------------------------------------|-----------------|--------------|
| **E1 — Thu thập bằng chứng**             | UC-001 | Ghi nhận lượt trả lời của người học                       | ACT-S           | Must         |
|                                          | UC-002 | Cập nhật ước lượng mức thành thạo                         | ACT-SY          | Must         |
| **E2 — Chẩn đoán**                       | UC-003 | Xác định nguyên nhân gốc của lỗi                          | ACT-SY          | Must         |
|                                          | UC-004 | Thu thập thêm bằng chứng phân biệt khi chưa đủ căn cứ     | ACT-SY, ACT-S   | Must         |
|                                          | UC-005 | Nhận diện nguyên nhân phi kiến thức                       | ACT-SY          | Should       |
| **E3 — Hỗ trợ người học**                | UC-006 | Xây dựng phương án hỗ trợ tối giản                        | ACT-SY          | Must         |
|                                          | UC-007 | Thực hiện phương án hỗ trợ và xác nhận lại mức thành thạo | ACT-S           | Must         |
|                                          | UC-008 | Chuyển sang nội dung mở rộng khi đã vững nền              | ACT-SY          | Must         |
| **E4 — Hỗ trợ quyết định của giáo viên** | UC-009 | Tổng hợp và sắp thứ tự ưu tiên các nhóm can thiệp         | ACT-SY          | Must         |
|                                          | UC-010 | Giáo viên xem xét bằng chứng và ra quyết định             | ACT-T           | Must         |
|                                          | UC-011 | Giáo viên bác bỏ hoặc điều chỉnh kết luận, đề xuất        | ACT-T           | Must         |
|                                          | UC-012 | Giáo viên bổ sung nội dung riêng                          | ACT-T           | Should       |
| **E5 — Vận hành không kết nối**          | UC-013 | Tập hợp bằng chứng cấp lớp khi không có kết nối           | ACT-SY          | Must         |
|                                          | UC-014 | Đồng bộ dữ liệu khi có kết nối trở lại                    | ACT-SY          | Must         |
|                                          | UC-015 | Nạp và cập nhật nội dung theo phiên bản                   | ACT-SY          | Must         |
| **E6 — Quản trị nội dung và dữ liệu**    | UC-016 | Thẩm định nội dung trước khi phát hành                    | ACT-R           | Must         |
|                                          | UC-017 | Tính lại kết luận khi mô hình đổi phiên bản               | ACT-SY          | Must         |
|                                          | UC-018 | Xuất và xoá dữ liệu theo yêu cầu                          | ACT-A           | Must         |
|                                          | UC-019 | Chuyển đổi hồ sơ người học trên thiết bị dùng chung       | ACT-S           | Should       |

## 7.3. User Stories

### Epic 1 — Thu thập bằng chứng

| **ID** | **User Story**                                                                                                                         | **Truy về**   |
|--------|----------------------------------------------------------------------------------------------------------------------------------------|---------------|
| US-01  | Là **người học**, tôi muốn kết quả làm bài của mình được ghi nhận đầy đủ, để hệ thống hiểu đúng tôi đang gặp khó ở đâu                 | FR-01         |
| US-02  | Là **giáo viên**, tôi muốn mọi lượt làm bài đều để lại dấu vết, để tôi không mất thông tin như hiện nay khi chỉ chấm được một phần bài | FR-01, GAP-07 |

### Epic 2 — Chẩn đoán

| **ID** | **User Story**                                                                                                                        | **Truy về**    |
|--------|---------------------------------------------------------------------------------------------------------------------------------------|----------------|
| US-03  | Là **giáo viên**, tôi muốn biết em này sai vì thiếu kiến thức nền nào, để tôi không phải đoán                                         | FR-03, SN-T-01 |
| US-04  | Là **giáo viên**, tôi muốn hệ thống nói rõ khi chưa đủ căn cứ, để tôi không hành động dựa trên một kết luận thiếu cơ sở               | FR-08, SN-T-04 |
| US-05  | Là **người học**, tôi muốn không phải làm quá nhiều bài trước khi được giúp, để tôi không nản                                         | FR-06, SN-S-04 |
| US-06  | Là **giáo viên**, tôi muốn hệ thống phân biệt được lỗi do bất cẩn với lỗi do hổng kiến thức, để tôi không xếp nhầm em vào nhóm học bù | FR-07, GAP-13  |

### Epic 3 — Hỗ trợ người học

| **ID** | **User Story**                                                                                                      | **Truy về**    |
|--------|---------------------------------------------------------------------------------------------------------------------|----------------|
| US-07  | Là **người học**, tôi muốn chỉ phải học lại phần tôi thực sự chưa nắm, để tôi không mất thời gian với thứ đã biết   | FR-12, SN-S-02 |
| US-08  | Là **người học**, tôi muốn vẫn được học nội dung của lớp mình, để tôi không bị bỏ lại phía sau khi đang củng cố nền | FR-13, SN-S-03 |
| US-09  | Là **giáo viên**, tôi muốn biết em đó đã thực sự hiểu hay chỉ vừa xem xong lời giải, để tôi tin được kết quả        | FR-14, BR-10   |
| US-10  | Là **người học** đã vững nền, tôi muốn được giao nội dung mở rộng, để tôi không phải ngồi lại với bài dễ            | FR-09          |

### Epic 4 — Hỗ trợ quyết định của giáo viên

| **ID** | **User Story**                                                                                                          | **Truy về**     |
|--------|-------------------------------------------------------------------------------------------------------------------------|-----------------|
| US-11  | Là **giáo viên**, tôi muốn biết lớp mình có mấy nhóm cần can thiệp và nhóm nào trước, để tôi dùng được 45 phút hiệu quả | FR-11, FR-15    |
| US-12  | Là **giáo viên**, tôi muốn xem được bằng chứng dẫn tới kết luận, để tôi kiểm chứng được thay vì phải tin                | FR-16, SN-T-06  |
| US-13  | Là **giáo viên**, tôi muốn bác bỏ được đề xuất khi tôi biết rõ hơn hệ thống, để tôi giữ được quyền chuyên môn của mình  | FR-17, SN-T-04  |
| US-14  | Là **giáo viên**, tôi muốn thêm được bài tập hoặc lưu ý của riêng tôi, để tôi đưa vào những gì hệ thống không biết      | FR-19, SN-T-08  |
| US-15  | Là **giáo viên**, tôi muốn chắc chắn dữ liệu này không được dùng để đánh giá tôi, để tôi sử dụng thoải mái              | AIR-09, SN-T-05 |

### Epic 5 — Vận hành không kết nối

| **ID** | **User Story**                                                                                                                                   | **Truy về**   |
|--------|--------------------------------------------------------------------------------------------------------------------------------------------------|---------------|
| US-16  | Là **người học**, tôi muốn tiếp tục học được khi không có mạng, để việc học của tôi không phụ thuộc vào hạ tầng nơi tôi sống                     | NFR-01        |
| US-17  | Là **giáo viên**, tôi muốn xem được tình hình cả lớp ngay tại phòng học không có mạng, để tôi ra quyết định trong tiết chứ không phải đợi về nhà | FR-18, NFR-01 |
| US-18  | Là **giáo viên**, tôi muốn dữ liệu tự đồng bộ khi có mạng mà không mất mát, để tôi không phải làm gì thêm                                        | NFR-03        |

### Epic 6 — Quản trị nội dung và dữ liệu

| **ID** | **User Story**                                                                                                                     | **Truy về**     |
|--------|------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| US-19  | Là **người thẩm định chuyên môn**, tôi muốn duyệt nội dung trước khi nó tới học sinh, để tôi chịu trách nhiệm được với thứ mình ký | FR-20, SN-SC-03 |
| US-20  | Là **người quản lý cơ sở giáo dục**, tôi muốn xuất và xoá được dữ liệu của trường mình, để tôi kiểm soát được rủi ro               | FR-21, SN-SC-05 |
| US-21  | Là **người học** dùng chung thiết bị với bạn, tôi muốn kết quả của tôi không hiện ra cho bạn thấy, để tôi không ngại               | FR-22, SN-S-06  |

> **Kiểm tra:** không có user story nào được viết cho tính năng chưa chứng minh được là cần thiết. Mỗi story đều truy về ít nhất một FR, và mỗi FR đều truy về một GAP hoặc Stakeholder Need.

## 7.4. Detailed Use Cases

### UC-003 — Xác định nguyên nhân gốc của lỗi

| **Mục** | **Nội dung** |
|---|---|
| **Use Case ID** | UC-003 |
| **Name** | Xác định nguyên nhân gốc của lỗi |
| **Goal** | Từ một lỗi quan sát được ở mục tiêu học tập hiện tại, xác định kiến thức nền có khả năng là nguyên nhân |
| **Actor** | ACT-SY (chính) · ACT-S (nguồn bằng chứng) |
| **Trigger** | Người học trả lời sai một phép đo gắn với mục tiêu học tập đang theo dõi |
| **Preconditions** | Đã tồn tại mô hình cấu trúc kiến thức đã thẩm định (DR-01)<br>Đã có ít nhất một bản ghi bằng chứng (FR-01)<br>Kho phép đo có nội dung gắn với các kiến thức nền liên quan (DR-02) |
| **Inputs / Context** | Mục tiêu học tập đang xét · Lịch sử bằng chứng của người học · Quan hệ phụ thuộc kiến thức · Phiên bản mô hình và phiên bản logic |
| **Main Flow** | 1. Hệ thống xác định tập kiến thức nền liên quan tới mục tiêu đang xét<br>2. Hệ thống tập hợp toàn bộ bằng chứng hiện có trên từng kiến thức nền<br>3. Hệ thống đánh giá mức độ phù hợp của từng giả thuyết nguyên nhân với bằng chứng<br>4. Hệ thống đánh giá mức tin cậy của giả thuyết tốt nhất<br>5. Nếu mức tin cậy đạt ngưỡng: kết luận nguyên nhân gốc, gắn phiên bản, chuyển sang UC-006<br>6. Hệ thống lưu chuỗi bằng chứng dẫn tới kết luận (FR-16) |
| **Alternative Flow** | **AF-1 (bước 4):** mức tin cậy chưa đạt ngưỡng → chuyển sang **UC-004**<br>**AF-2 (bước 3):** toàn bộ kiến thức nền đều cho thấy đã vững → chuyển sang **UC-008**<br>**AF-3 (bước 2):** tín hiệu cho thấy nguyên nhân phi kiến thức → chuyển sang **UC-005** |
| **Exception Flow** | **EF-1:** thiếu mô hình cấu trúc kiến thức cho phạm vi đang xét → không kết luận, ghi nhận và báo trạng thái không hỗ trợ<br>**EF-2:** bằng chứng mâu thuẫn không giải được sau nhiều vòng → dừng, chuyển quyền quyết định cho giáo viên (AIR-22)<br>**EF-3:** phiên bản mô hình thay đổi giữa chừng → đánh dấu cần tính lại (AIR-23) |
| **Postconditions** | Một trong ba trạng thái: đã kết luận nguyên nhân · cần thêm bằng chứng · đã vững nền.<br>Chuỗi bằng chứng và phiên bản được lưu lại phục vụ kiểm chứng |
| **Related Requirements** | FR-02, FR-03, FR-04, FR-08, FR-16, FR-23, DR-01, DR-07, AIR-01, AIR-10 |
| **Related Business Rules** | BR-01, BR-02, BR-06, BR-14 |


### UC-004 — Thu thập thêm bằng chứng phân biệt

| **Mục** | **Nội dung** |
|---|---|
| **Use Case ID** | UC-004 |
| **Name** | Thu thập thêm bằng chứng phân biệt khi chưa đủ căn cứ |
| **Goal** | Chọn phép đo có khả năng phân biệt tốt nhất giữa các giả thuyết đang cạnh tranh, nhằm đạt kết luận với số phép đo ít nhất |
| **Actor** | ACT-SY (chính) · ACT-S (thực hiện phép đo) |
| **Trigger** | UC-003 kết thúc ở trạng thái chưa đủ bằng chứng |
| **Preconditions** | Tồn tại từ hai giả thuyết nguyên nhân trở lên chưa phân biệt được<br>Kho phép đo còn nội dung chưa sử dụng gần đây (FR-24) |
| **Inputs / Context** | Tập giả thuyết đang cạnh tranh · Bằng chứng hiện có · Kho phép đo khả dụng · Số phép đo đã yêu cầu người học thực hiện trong phiên |
| **Main Flow** | 1. Hệ thống xác định điểm khác biệt giữa các giả thuyết đang cạnh tranh<br>2. Hệ thống chọn phép đo mà kết quả của nó phân tách các giả thuyết rõ nhất<br>3. Hệ thống giao phép đo cho người học<br>4. Người học thực hiện<br>5. Bằng chứng mới được ghi nhận (UC-001) và quay lại **UC-003** |
| **Alternative Flow** | **AF-1 (bước 2):** không còn phép đo phân biệt được → dừng, giữ trạng thái chưa kết luận, chuyển thông tin cho giáo viên<br>**AF-2 (bước 3):** số phép đo đã đạt giới hạn chịu đựng → dừng, không tiếp tục yêu cầu (SN-S-04) |
| **Exception Flow** | **EF-1:** người học bỏ dở giữa chừng → giữ nguyên trạng thái, không suy luận từ dữ liệu không hoàn chỉnh<br>**EF-2:** thời gian trả lời cho thấy dấu hiệu không nỗ lực → không dùng làm bằng chứng chẩn đoán, chuyển sang UC-005 |
| **Postconditions** | Hoặc đã đủ bằng chứng để quay lại UC-003, hoặc trạng thái chưa kết luận được ghi nhận và chuyển cho giáo viên |
| **Related Requirements** | FR-05, FR-06, FR-08, FR-24, AIR-02, AIR-16, AIR-21 |
| **Related Business Rules** | BR-01, BR-02, BR-16 |


### UC-009 — Tổng hợp và sắp thứ tự ưu tiên các nhóm can thiệp

| **Mục** | **Nội dung** |
|---|---|
| **Use Case ID** | UC-009 |
| **Name** | Tổng hợp và sắp thứ tự ưu tiên các nhóm can thiệp |
| **Goal** | Chuyển từ nhiều kết luận cá nhân thành số ít nhóm hành động mà giáo viên xử lý được trong một tiết |
| **Actor** | ACT-SY (chính) · ACT-T (người tiêu thụ kết quả) |
| **Trigger** | Giáo viên mở phần thông tin lớp, hoặc tới thời điểm định kỳ trước tiết học |
| **Preconditions** | Đã tập hợp được bằng chứng của các người học trong lớp (UC-013)<br>Có ít nhất một kết luận nguyên nhân gốc |
| **Inputs / Context** | Toàn bộ bằng chứng cấp lớp · Các kết luận nguyên nhân · Trạng thái chưa kết luận · Quan hệ phụ thuộc kiến thức |
| **Main Flow** | 1. Hệ thống tập hợp bằng chứng theo từng nguyên nhân gốc<br>2. Hệ thống gom người học có cùng nguyên nhân gốc thành nhóm<br>3. Hệ thống xác định nhóm nào phản ánh lỗ hổng ở phạm vi cả lớp thay vì cá nhân<br>4. Hệ thống sắp thứ tự ưu tiên giữa các nhóm<br>5. Hệ thống giới hạn số nhóm trình bày ở mức giáo viên xử lý được<br>6. Hệ thống trình bày kèm bằng chứng của từng nhóm và danh sách người học chưa kết luận được |
| **Alternative Flow** | **AF-1 (bước 2):** số nhóm vượt giới hạn → gộp theo mức độ gần nhau của nguyên nhân, ghi rõ đã gộp<br>**AF-2 (bước 6):** phần lớn người học ở trạng thái chưa kết luận → trình bày điều đó như thông tin chính, không che giấu bằng các nhóm nhỏ |
| **Exception Flow** | **EF-1:** dữ liệu lớp chưa đủ do một số thiết bị chưa tập hợp được → hiển thị rõ phạm vi dữ liệu đang có, không trình bày như thể đã đầy đủ<br>**EF-2:** không có kết luận nào → trình bày trạng thái trống kèm lý do, không tạo nhóm giả |
| **Postconditions** | Giáo viên có danh sách nhóm, thứ tự ưu tiên, bằng chứng và phạm vi dữ liệu; sẵn sàng cho UC-010 |
| **Related Requirements** | FR-10, FR-11, FR-15, FR-16, FR-18, NFR-05, AIR-05 |
| **Related Business Rules** | BR-07, BR-08, BR-13 |


### UC-011 — Giáo viên bác bỏ hoặc điều chỉnh kết luận

| **Mục** | **Nội dung** |
|---|---|
| **Use Case ID** | UC-011 |
| **Name** | Giáo viên bác bỏ hoặc điều chỉnh kết luận, đề xuất |
| **Goal** | Bảo đảm quyền quyết định cuối cùng thuộc về giáo viên, đồng thời thu được tín hiệu giám sát chất lượng hệ thống |
| **Actor** | ACT-T |
| **Trigger** | Giáo viên không đồng ý với kết luận hoặc đề xuất của hệ thống |
| **Preconditions** | Đã có kết luận hoặc đề xuất được trình bày (UC-009, UC-010) |
| **Inputs / Context** | Kết luận của hệ thống · Bằng chứng kèm theo · Nhận định chuyên môn của giáo viên |
| **Main Flow** | 1. Giáo viên xem bằng chứng dẫn tới kết luận<br>2. Giáo viên chọn bác bỏ hoặc điều chỉnh<br>3. Hệ thống ghi nhận quyết định của giáo viên kèm thời điểm và lý do nếu có<br>4. Quyết định của giáo viên thay thế kết luận của hệ thống trong mọi hoạt động tiếp theo<br>5. Hệ thống ghi nhận sự kiện này làm tín hiệu giám sát chất lượng |
| **Alternative Flow** | **AF-1:** giáo viên yêu cầu thêm bằng chứng trước khi quyết định → kích hoạt UC-004 theo yêu cầu của giáo viên |
| **Exception Flow** | **EF-1:** giáo viên và hệ thống cùng cập nhật trên hai thiết bị khác nhau → quyết định của giáo viên được ưu tiên (BR-03) |
| **Postconditions** | Quyết định của giáo viên có hiệu lực; bằng chứng gốc và kết luận cũ vẫn được giữ nguyên phục vụ kiểm chứng (NFR-07) |
| **Related Requirements** | FR-17, FR-23, NFR-07, AIR-18, AIR-19 |
| **Related Business Rules** | BR-03, BR-04, BR-05 |


### UC-013 — Tập hợp bằng chứng cấp lớp khi không có kết nối

| **Mục** | **Nội dung** |
|---|---|
| **Use Case ID** | UC-013 |
| **Name** | Tập hợp bằng chứng cấp lớp khi không có kết nối |
| **Goal** | Bảo đảm giáo viên có thông tin toàn lớp ngay tại phòng học, không phụ thuộc hạ tầng bên ngoài |
| **Actor** | ACT-SY (chính) · ACT-T (người khởi tạo) |
| **Trigger** | Giáo viên yêu cầu tập hợp dữ liệu lớp, hoặc theo lịch định kỳ |
| **Preconditions** | Các bản ghi bằng chứng tồn tại trên phạm vi cục bộ của từng người học<br>Có phương thức trao đổi dữ liệu trong phạm vi lớp học không dùng hạ tầng bên ngoài |
| **Inputs / Context** | Bằng chứng cục bộ của từng người học · Định danh phiên bản mô hình và logic |
| **Main Flow** | 1. Hệ thống khởi tạo phiên tập hợp trong phạm vi lớp<br>2. Từng nguồn dữ liệu chuyển các bản ghi chưa được tập hợp<br>3. Hệ thống hợp nhất theo định danh bản ghi, bảo đảm không nhân bản khi lặp lại<br>4. Hệ thống sắp thứ tự sự kiện không dựa trên đồng hồ thiết bị<br>5. Hệ thống chuyển sang UC-009 |
| **Alternative Flow** | **AF-1 (bước 2):** một số nguồn không tham gia được → hoàn tất với phạm vi dữ liệu hiện có, ghi rõ phần còn thiếu<br>**AF-2:** phiên tập hợp bị gián đoạn → tiếp tục được ở lần sau, không phải bắt đầu lại |
| **Exception Flow** | **EF-1:** phát hiện bản ghi trùng định danh nhưng khác nội dung → giữ cả hai, đánh dấu cần xử lý, không tự ghi đè<br>**EF-2:** một nguồn dữ liệu dùng phiên bản mô hình khác → không hợp nhất kết luận, chỉ hợp nhất bằng chứng gốc và đánh dấu cần tính lại |
| **Postconditions** | Bằng chứng cấp lớp được tập hợp; phạm vi dữ liệu được ghi rõ; không mất bản ghi nào |
| **Related Requirements** | FR-18, FR-23, NFR-01, NFR-03, NFR-04, NFR-18, DR-07, DR-10 |
| **Related Business Rules** | BR-05, BR-06, BR-17 |


---

# 8. QUY TẮC NGHIỆP VỤ (BUSINESS RULES)

## 8.1. Nhóm quy tắc chẩn đoán

| **ID**    | **Business Rule**                                                                                                                                                   | **Rationale**                                                                                                                                                                                                                     | **Source**            | **Related Requirement** | **Trạng thái**                                                                                                |
|-----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------|-------------------------|---------------------------------------------------------------------------------------------------------------|
| **BR-01** | Khi bằng chứng chưa đạt mức tin cậy yêu cầu, hệ thống **không được kết luận** nguyên nhân gốc; phải trả về trạng thái tường minh                                    | Kết luận sai kèm vẻ chắc chắn gây hại hơn việc không kết luận                                                                                                                                                                     | GAP-05                | FR-08, AIR-10           | **Đã xác lập**                                                                                                |
| **BR-02** | Mức tin cậy phải tính có trừ khả năng trả lời đúng do ngẫu nhiên                                                                                                    | Đếm số phép đo không phản ánh được độ tin cậy                                                                                                                                                                                     | Phân tích phương pháp | FR-04, AIR-14           | **Đã sửa** — thay cho quy tắc đếm số lượng trước đây                                                          |
| **BR-07** | Một nguyên nhân gốc được coi là lỗ hổng ở phạm vi cả lớp khi xuất hiện ở tỷ lệ từ 30% sĩ số lớp trở lên (làm tròn xuống), với sàn tối thiểu tuyệt đối là 3 học sinh | Hai loại lỗ hổng đòi hai kiểu can thiệp                                                                                                                                                                                           | GAP-03                | FR-10                   | **Heuristic — đã có giá trị tạm (30% sĩ số, sàn 3 học sinh), chờ hiệu chỉnh trên dữ liệu thật. Xem Mục 19.3** |
| **BR-08** | Thứ tự ưu tiên giữa các nhóm được xác định theo số người học chịu ảnh hưởng và số kiến thức phía sau bị chặn                                                        | Lỗ hổng ảnh hưởng rộng và chặn nhiều nội dung sau nên được xử lý trước. Khi hai nhóm bằng điểm ưu tiên: ưu tiên nguyên nhân đạt trạng thái đã kết luận sớm hơn; nếu vẫn bằng, ưu tiên nguyên nhân nằm gần đầu chuỗi phụ thuộc hơn | GAP-04                | FR-11, FR-15            | **Heuristic — định hướng công thức đã xác nhận, quy tắc tie-break đã chốt tạm, chờ kiểm chứng. Xem Mục 19.4** |
| **BR-14** | Khi tín hiệu cho thấy nguyên nhân phi kiến thức, hệ thống không được kết luận nguyên nhân kiến thức                                                                 | Nếu tỷ lệ lỗi phi kiến thức cao, chẩn đoán sẽ sai hàng loạt                                                                                                                                                                       | GAP-13, RK-03         | FR-07                   | **Mới bổ sung**                                                                                               |
| **BR-16** | Bằng chứng thu thập trong điều kiện không quan sát được có trọng số tin cậy thấp hơn bằng chứng thu tại lớp                                                         | Không kiểm soát được điều kiện làm bài ngoài lớp                                                                                                                                                                                  | CO-D-07               | DR-11                   | **Mới bổ sung**                                                                                               |

## 8.2. Nhóm quy tắc hỗ trợ học tập

| **ID**    | **Business Rule**                                                                                                 | **Rationale**                                                   | **Source**    | **Related Requirement** | **Trạng thái**              |
|-----------|-------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|---------------|-------------------------|-----------------------------|
| **BR-10** | Phép đo dùng để xác nhận mức thành thạo phải khác với phép đo đã dùng trong quá trình luyện tập                   | Tránh nhầm lẫn giữa "đã nhìn thấy lời giải" và "đã hiểu"        | GAP-07        | FR-14                   | **Đã xác lập**              |
| **BR-11** | Phương án hỗ trợ phải có giới hạn độ dài, và người học vẫn phải tiếp cận mục tiêu của lớp hiện tại trong mỗi buổi | Chống tình trạng người học bị giữ trong vòng lặp hỗ trợ kéo dài | GAP-14, RK-04 | FR-13                   | **Mới bổ sung — tỷ lệ TBD** |
| **BR-18** | Phương án hỗ trợ phải loại bỏ những nội dung người học đã được xác nhận là nắm vững                               | Tránh lãng phí thời gian và làm mất động lực                    | GAP-06        | FR-12, FR-09            | **Đã xác lập**              |

## 8.3. Nhóm quy tắc về quyền quyết định của giáo viên

| **ID**    | **Business Rule**                                                                           | **Rationale**                                                      | **Source** | **Related Requirement** | **Trạng thái** |
|-----------|---------------------------------------------------------------------------------------------|--------------------------------------------------------------------|------------|-------------------------|----------------|
| **BR-03** | Quyết định của giáo viên luôn được ưu tiên so với kết luận của hệ thống                     | Quyền tự chủ chuyên môn; đồng thời là tín hiệu giám sát chất lượng | GAP-12     | FR-17, AIR-18           | **Đã xác lập** |
| **BR-04** | Hệ thống không được tự thực hiện can thiệp tới người học mà không thông qua giáo viên       | Giáo viên là điểm quyết định cuối cùng                             | GAP-12     | AIR-11                  | **Đã xác lập** |
| **BR-05** | Mọi lần giáo viên bác bỏ hoặc điều chỉnh phải được ghi nhận, và không được xoá kết luận gốc | Phục vụ kiểm chứng và cải tiến                                     | GAP-07     | FR-17, NFR-07           | **Đã xác lập** |

## 8.4. Nhóm quy tắc an toàn

| **ID**    | **Business Rule**                                                                                                                         | **Rationale**                                                 | **Source**              | **Related Requirement** | **Trạng thái**                                |
|-----------|-------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|-------------------------|-------------------------|-----------------------------------------------|
| **BR-09** | Công cụ tự động không được sửa đổi đáp án đúng, nội dung gốc hoặc mô hình cấu trúc kiến thức đã thẩm định                                 | Sai sót kiến thức phá huỷ toàn bộ độ tin cậy                  | SN-SC-03                | AIR-07, NFR-09          | **Đã xác lập**                                |
| **BR-12** | Kết quả của hệ thống không được sử dụng cho quyết định ảnh hưởng tới quyền lợi học tập của người học                                      | Độ chính xác không đủ cho quyết định không đảo ngược được     | BO-06, CO-E-08          | AIR-08, NFR-13          | **Đã xác lập — chính sách tự nguyện của đội** |
| **BR-13** | Nội dung hiển thị cho người học và người giám hộ phải diễn đạt theo hướng kỹ năng cần củng cố, không dùng nhãn năng lực hoặc nhãn cấp lớp | Tác động tâm lý và rủi ro phản ứng từ gia đình                | SN-S-01, SN-P-01, RK-06 | AIR-13, NFR-12          | **Mới bổ sung**                               |
| **BR-15** | Dữ liệu của hệ thống không được sử dụng để đánh giá giáo viên                                                                             | Vi phạm dẫn tới mất toàn bộ người dùng                        | RK-01, SN-T-05          | AIR-09, NFR-13          | **Mới bổ sung**                               |
| **BR-19** | Kết quả chẩn đoán của một người học không được hiển thị cho người học khác                                                                | Tránh gây xấu hổ; đặc biệt quan trọng khi dùng chung thiết bị | SN-S-06                 | FR-22                   | **Mới bổ sung**                               |

## 8.5. Nhóm quy tắc dữ liệu và vận hành không kết nối

| **ID**    | **Business Rule**                                                                                                        | **Rationale**                                             | **Source**       | **Related Requirement** | **Trạng thái**  |
|-----------|--------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|------------------|-------------------------|-----------------|
| **BR-06** | Mọi kết luận phải tính lại được từ bằng chứng gốc; bằng chứng gốc không được sửa hoặc xoá                                | Cho phép sửa sai và nâng cấp mô hình mà không mất lịch sử | GAP-07           | FR-23, NFR-07           | **Đã xác lập**  |
| **BR-17** | Thứ tự sự kiện không được xác định dựa trên đồng hồ thiết bị                                                             | Đồng hồ trên thiết bị đời cũ không đáng tin cậy           | CO-T-06          | DR-10                   | **Mới bổ sung** |
| **BR-20** | Mỗi kết luận phải gắn phiên bản mô hình cấu trúc kiến thức và phiên bản logic đã sử dụng                                 | Bảo đảm khả năng so sánh và tính lại giữa các phiên bản   | CO-D-08          | DR-07, FR-23            | **Đã xác lập**  |
| **BR-21** | Dữ liệu định danh người học không rời khỏi phạm vi cơ sở giáo dục; dữ liệu phục vụ phân tích phải được ẩn danh tại nguồn | Yêu cầu bảo vệ dữ liệu người chưa thành niên              | CO-L-01, CO-D-03 | DR-08, NFR-10           | **Đã xác lập**  |

> **Lưu ý bắt buộc khi trình bày:** **BR-07** và **BR-08** hiện là quy tắc kinh nghiệm (heuristic) do đội tự đặt, **chưa được hiệu chỉnh trên dữ liệu thật**. Cần nêu rõ điều này trong mọi tài liệu đối ngoại. Việc chủ động công bố tình trạng heuristic làm tăng độ tin cậy của phần còn lại; để bên đánh giá tự phát hiện sẽ có tác dụng ngược.

---

# 9. EDGE CASES & FAILURE MODES

| **ID**    | **Use Case**  | **Edge / Failure Case**                                                            | **Impact**                                                           | **Expected Behavior**                                                                                                                                                              | **Severity**     |
|-----------|---------------|------------------------------------------------------------------------------------|----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|
| **EC-01** | UC-003        | Bằng chứng ở các kiến thức nền mâu thuẫn nhau                                      | Không xác định được nguyên nhân                                      | Giữ trạng thái chưa kết luận; chuyển sang UC-004; nếu vẫn mâu thuẫn thì chuyển quyền quyết định cho giáo viên                                                                      | Cao              |
| **EC-02** | UC-001        | Người học trả lời ngẫu nhiên hoặc bấm cho xong                                     | **Bằng chứng nhiễu làm sai lệch toàn bộ chẩn đoán**                  | Nhận diện qua thời gian trả lời và tính không nhất quán; loại khỏi bằng chứng chẩn đoán; chuyển sang UC-005                                                                        | **Nghiêm trọng** |
| **EC-03** | UC-003        | Lỗi do bất cẩn ở người học vốn đã nắm vững                                         | Xếp nhầm vào nhóm cần hỗ trợ                                         | Đối chiếu với lịch sử; nếu mâu thuẫn với mức thành thạo đã xác lập thì yêu cầu thêm bằng chứng trước khi kết luận                                                                  | Cao              |
| **EC-04** | UC-003        | Lỗi do không hiểu đề bài, không phải do thiếu kiến thức                            | Chẩn đoán sai loại nguyên nhân                                       | Nhận diện qua kiểu sai không theo cụm kiến thức; không kết luận nguyên nhân kiến thức (BR-14)                                                                                      | Cao              |
| **EC-05** | UC-003        | Nguyên nhân nằm ngoài phạm vi quan sát (nghỉ học dài, hoàn cảnh gia đình)          | Hệ thống chẩn đoán một nguyên nhân không phải nguyên nhân thật       | Không có khả năng phát hiện tự động; phải chuyển thông tin cho giáo viên kèm cảnh báo về giới hạn của hệ thống                                                                     | Cao              |
| **EC-06** | UC-003        | Người học có nhiều lỗ hổng đồng thời                                               | Chọn một nguyên nhân là chưa đủ                                      | Trình bày nhiều nguyên nhân khả dĩ thay vì ép về một; để giáo viên quyết định thứ tự                                                                                               | Cao              |
| **EC-07** | UC-006        | Phương án hỗ trợ trở nên quá dài do lỗ hổng ở rất xa mục tiêu                      | Người học bỏ cuộc; bị kéo lùi                                        | Áp giới hạn độ dài (BR-11); chia thành nhiều giai đoạn; vẫn bảo đảm tiếp cận nội dung lớp hiện tại                                                                                 | **Nghiêm trọng** |
| **EC-08** | UC-007        | Người học lặp lại vòng hỗ trợ nhiều lần mà không đạt xác nhận                      | Vòng lặp không thoát; mất động lực                                   | Sau 3 vòng lặp chưa đạt xác nhận — chưa đạt nghĩa là đúng dưới 70% số câu trong phép đo xác nhận độc lập — hệ thống dừng tự động và chuyển bắt buộc cho giáo viên xử lý (Mục 19.5) | **Nghiêm trọng** |
| **EC-09** | UC-004        | Kho phép đo cạn, không còn nội dung phân biệt được                                 | Không thể thu hẹp giả thuyết                                         | Dừng, giữ trạng thái chưa kết luận, ghi rõ lý do là thiếu nội dung chứ không phải do người học                                                                                     | Trung bình       |
| **EC-10** | UC-004        | Người học bỏ dở giữa chừng                                                         | Dữ liệu không hoàn chỉnh                                             | Không suy luận từ dữ liệu dở dang; giữ nguyên trạng thái trước đó                                                                                                                  | Trung bình       |
| **EC-11** | UC-013        | Mất kết nối cục bộ giữa phiên tập hợp dữ liệu                                      | Dữ liệu lớp không đầy đủ                                             | Hoàn tất với phạm vi hiện có; **hiển thị rõ phần còn thiếu**; tiếp tục được ở lần sau                                                                                              | Cao              |
| **EC-12** | UC-014        | Đồng bộ bị gián đoạn nhiều lần                                                     | Nguy cơ nhân bản hoặc mất bản ghi                                    | Hợp nhất theo định danh bản ghi, bảo đảm lặp lại không tạo bản sao; tỷ lệ mất dữ liệu bằng không                                                                                   | **Nghiêm trọng** |
| **EC-13** | UC-013        | Đồng hồ hai thiết bị lệch nhau đáng kể                                             | Sắp sai thứ tự sự kiện                                               | Không dùng đồng hồ thiết bị để sắp thứ tự (BR-17)                                                                                                                                  | Cao              |
| **EC-14** | Toàn hệ thống | Dữ liệu cục bộ bị hệ điều hành thu hồi do thiếu dung lượng                         | Mất dữ liệu học tập                                                  | Phát hiện và phục hồi từ nguồn đã tập hợp; cảnh báo cho người dùng (NFR-18)                                                                                                        | **Nghiêm trọng** |
| **EC-15** | UC-019        | Nhiều người học dùng chung thiết bị, chuyển hồ sơ không đúng                       | Ghi bằng chứng vào hồ sơ sai người                                   | Bắt buộc xác nhận hồ sơ trước mỗi phiên; dữ liệu tách biệt; không hiển thị chéo                                                                                                    | Cao              |
| **EC-16** | UC-011        | Giáo viên bác bỏ toàn bộ kết luận của hệ thống trong thời gian dài                 | Hệ thống không tạo thêm giá trị                                      | Ghi nhận như chỉ số cảnh báo chất lượng (AIR-19); rà soát lại mô hình                                                                                                              | Cao              |
| **EC-17** | UC-011        | Giáo viên chấp nhận toàn bộ mà không xem bằng chứng                                | **Chấp nhận thụ động — rủi ro cao hơn cả trường hợp bác bỏ toàn bộ** | Theo dõi tỷ lệ chấp nhận không kèm xem bằng chứng; cảnh báo khi vượt ngưỡng                                                                                                        | Cao              |
| **EC-18** | UC-003        | Hệ thống kết luận sai nhưng báo mức tin cậy cao                                    | **Mất niềm tin ở mức không phục hồi được**                           | Chính sách: khi phân vân phải từ chối kết luận (AIR-15); mục tiêu tỷ lệ bằng không                                                                                                 | **Nghiêm trọng** |
| **EC-19** | UC-017        | Mô hình cấu trúc kiến thức đổi phiên bản khi người học đang trong quá trình hỗ trợ | Phương án đang thực hiện có thể không còn hợp lệ                     | Đánh dấu cần tính lại; không huỷ tiến độ đã đạt; thông báo cho giáo viên (AIR-23)                                                                                                  | Cao              |
| **EC-20** | UC-016        | Nội dung chưa qua thẩm định lọt tới người học                                      | Rủi ro sai kiến thức                                                 | Chặn ở cấp quy tắc: nội dung không có dấu thẩm định thì không được phát hành (BR-09)                                                                                               | **Nghiêm trọng** |
| **EC-21** | UC-009        | Phần lớn người học ở trạng thái chưa kết luận được                                 | Thông tin cho giáo viên gần như trống                                | Trình bày trung thực tình trạng này như thông tin chính, kèm lý do; không tạo nhóm giả để lấp chỗ trống                                                                            | Cao              |
| **EC-22** | Toàn hệ thống | Người học chuyển lớp hoặc chuyển trường giữa chừng                                 | Chuỗi bằng chứng đứt đoạn                                            | Giữ nguyên dữ liệu đã có; đánh dấu gián đoạn; không suy luận xuyên qua khoảng trống                                                                                                | Trung bình       |
| **EC-23** | Toàn hệ thống | Thiết bị hết pin hoặc tắt đột ngột giữa phiên làm bài                              | Mất bằng chứng của phiên đó                                          | Ghi nhận bằng chứng theo từng lượt, không chờ kết thúc phiên                                                                                                                       | Trung bình       |
| **EC-24** | UC-006        | Người học đã vững nền nhưng vẫn sai do nội dung mục tiêu vượt mức                  | Xếp nhầm vào nhóm hỗ trợ nền                                         | Nhận diện qua trạng thái đã vững toàn bộ kiến thức nền; chuyển sang nội dung mở rộng thay vì hỗ trợ (FR-09)                                                                        | Trung bình       |

---

# 10. ACCEPTANCE CRITERIA

> **Quy ước:** mã tiêu chí chấp nhận dùng tiền tố **AC** kèm ba chữ số (**AC-001**); mã tác nhân ở Mục 7.1 dùng tiền tố **ACT** (**ACT-T**, **ACT-S**…). Hai tiền tố khác nhau nên không còn khả năng nhầm lẫn.
>
> Không sử dụng các từ mô tả mơ hồ. Khi chưa có căn cứ để đặt ngưỡng, ghi **TBD** kèm phương pháp xác định — **không** điền một con số chỉ để tài liệu trông đầy đủ.

## 10.1. Chẩn đoán

| **AC ID**  | **Req ID**    | **Given**                                                                      | **When**                                              | **Then**                                                                                                | **Metric**                                                                                       |
|------------|---------------|--------------------------------------------------------------------------------|-------------------------------------------------------|---------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| **AC-001** | FR-03         | Người học có bằng chứng trên các kiến thức nền liên quan tới mục tiêu đang xét | Người học trả lời sai một phép đo gắn với mục tiêu đó | Hệ thống trả về một trong ba trạng thái: đã kết luận nguyên nhân, cần thêm bằng chứng, hoặc đã vững nền | Tỷ lệ trả về đúng một trong ba trạng thái = 100%                                                 |
| **AC-002** | FR-03         | Có bộ bài làm thật đã được ba chuyên gia chẩn đoán độc lập                     | Hệ thống chẩn đoán trên cùng bộ bài làm đó            | Kết luận của hệ thống trùng với kết luận đa số của chuyên gia                                           | Tỷ lệ trùng khớp: **TBD** — chỉ đặt được sau khi xác định mức đồng thuận giữa chuyên gia (AS-02) |
| **AC-003** | FR-08         | Bằng chứng hiện có chưa đạt mức tin cậy yêu cầu                                | Hệ thống thực hiện chẩn đoán                          | Hệ thống trả về trạng thái cần thêm bằng chứng, **không** trả về một nguyên nhân gốc                    | Số trường hợp kết luận khi dưới ngưỡng = **0**                                                   |
| **AC-004** | AIR-15        | Hệ thống trả về kết luận kèm mức tin cậy cao                                   | Đối chiếu với chuẩn đối chiếu độc lập                 | Không tồn tại trường hợp kết luận sai                                                                   | Số trường hợp sai khi tin cậy cao = **0**                                                        |
| **AC-005** | FR-07         | Lượt trả lời có dấu hiệu nguyên nhân phi kiến thức                             | Hệ thống thực hiện chẩn đoán                          | Hệ thống không kết luận nguyên nhân thuộc về kiến thức                                                  | Tỷ lệ tuân thủ quy tắc = 100%                                                                    |
| **AC-006** | FR-06         | Tồn tại từ hai giả thuyết nguyên nhân trở lên chưa phân biệt được              | Hệ thống chọn phép đo tiếp theo                       | Phép đo được chọn phải là phép đo có khả năng phân tách các giả thuyết, không phải phép đo ngẫu nhiên   | Số phép đo trung bình để đạt kết luận: **TBD** — xác định sau khi có dữ liệu thật                |
| **AC-007** | FR-04, AIR-14 | Hệ thống đưa ra kết luận                                                       | Giáo viên xem kết luận                                | Kết luận luôn kèm mức tin cậy tường minh, không ở dạng nhị phân                                         | Tỷ lệ kết luận có kèm mức tin cậy = 100%                                                         |

## 10.2. Hỗ trợ người học

| **AC ID**  | **Req / EC ID** | **Given**                                                                       | **When**                                   | **Then**                                                              | **Metric**                                                                               |
|------------|-----------------|---------------------------------------------------------------------------------|--------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------------------|
| **AC-008** | FR-12           | Đã xác định nguyên nhân gốc và người học đã nắm vững một số nội dung trung gian | Hệ thống xây dựng phương án hỗ trợ         | Phương án không chứa nội dung người học đã được xác nhận nắm vững     | Số nội dung thừa trong phương án = **0**                                                 |
| **AC-009** | FR-13, BR-11    | Người học đang thực hiện phương án hỗ trợ                                       | Trong mỗi buổi học                         | Người học vẫn được tiếp cận nội dung mục tiêu của lớp hiện tại        | Số buổi không tiếp cận mục tiêu lớp hiện tại = **0**                                     |
| **AC-010** | FR-13           | Người học được xác định có lỗ hổng ở rất xa mục tiêu                            | Hệ thống xây dựng phương án hỗ trợ         | Độ dài phương án không vượt quá giới hạn đã xác lập                   | Giới hạn độ dài: **TBD** — xác định qua quan sát khả năng theo đuổi của người học        |
| **AC-011** | FR-14, BR-10    | Người học đã hoàn thành phần luyện tập                                          | Hệ thống thực hiện xác nhận mức thành thạo | Phép đo xác nhận không trùng với phép đo đã dùng khi luyện tập        | Tỷ lệ trùng lặp = **0**                                                                  |
| **AC-012** | FR-09           | Người học đã vững toàn bộ kiến thức nền liên quan                               | Người học trả lời sai ở mục tiêu hiện tại  | Hệ thống chuyển sang nội dung mở rộng, không xây phương án hỗ trợ nền | Tỷ lệ xử lý đúng = 100%                                                                  |
| **AC-013** | EC-08           | Người học đã lặp vòng hỗ trợ vượt số lần xác định mà chưa đạt xác nhận          | Vòng lặp tiếp theo được kích hoạt          | Hệ thống dừng tự động và chuyển bắt buộc cho giáo viên                | Số lần lặp tối đa: **3 — chốt tại Mục 19.5**; số trường hợp vượt mà không chuyển = **0** |

## 10.3. Hỗ trợ quyết định của giáo viên

| **AC ID**  | **Req ID**    | **Given**                                                            | **When**                                        | **Then**                                                                             | **Metric**                                                                             |
|------------|---------------|----------------------------------------------------------------------|-------------------------------------------------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| **AC-014** | FR-11, FR-15  | Một lớp có bằng chứng của nhiều người học                            | Giáo viên xem thông tin tổng hợp lớp            | Số nhóm can thiệp được trình bày không vượt giới hạn xử lý được trong một tiết       | Giới hạn số nhóm: **TBD** — xác định qua quan sát năng lực tổ chức lớp thực tế (AS-09) |
| **AC-015** | FR-16         | Hệ thống đưa ra một kết luận                                         | Giáo viên yêu cầu xem căn cứ                    | Hệ thống trình bày chuỗi bằng chứng cụ thể đã dẫn tới kết luận đó                    | Tỷ lệ kết luận có chuỗi bằng chứng truy được = 100%                                    |
| **AC-016** | FR-16, NFR-08 | Giáo viên chưa từng sử dụng hệ thống                                 | Giáo viên đọc phần giải thích của một kết luận  | Giáo viên diễn đạt lại được căn cứ của kết luận đó                                   | Tỷ lệ diễn đạt lại chính xác: **TBD** — xác định qua thử nghiệm với giáo viên          |
| **AC-017** | FR-17         | Hệ thống đưa ra kết luận hoặc đề xuất                                | Giáo viên không đồng ý                          | Giáo viên bác bỏ hoặc điều chỉnh được; quyết định của giáo viên có hiệu lực thay thế | Tỷ lệ trường hợp bác bỏ được = 100%                                                    |
| **AC-018** | FR-17, BR-05  | Giáo viên đã bác bỏ một kết luận                                     | Sau khi bác bỏ                                  | Kết luận gốc và bằng chứng gốc vẫn được lưu giữ nguyên vẹn                           | Số bản ghi bị xoá = **0**                                                              |
| **AC-019** | AIR-19        | Hệ thống hoạt động trong một khoảng thời gian                        | Tỷ lệ bác bỏ vượt hoặc thấp hơn dải bình thường | Hệ thống phát cảnh báo chất lượng                                                    | Dải bình thường: **TBD** — xác định sau khi có dữ liệu nền từ thử nghiệm thực địa      |
| **AC-020** | NFR-05        | Giáo viên mở thông tin tổng hợp lớp trong điều kiện không có kết nối | Yêu cầu hiển thị                                | Thông tin sẵn sàng trong khoảng thời gian phù hợp với nhịp ra quyết định trên lớp    | Ngưỡng thời gian: **TBD** — xác định qua quan sát nhịp làm việc thực tế (OQ-06)        |

## 10.4. Vận hành không kết nối

| **AC ID**  | **Req ID**    | **Given**                                                                                   | **When**                                                                                   | **Then**                                                                  | **Metric**                                                                   |
|------------|---------------|---------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|------------------------------------------------------------------------------|
| **AC-021** | NFR-01        | Thiết bị đã nạp xong nội dung và bị ngắt hoàn toàn kết nối                                  | Người học thực hiện toàn bộ chu trình: làm bài → chẩn đoán → nhận phương án → xác nhận lại | Toàn bộ chu trình hoàn tất bình thường                                    | Số chức năng cốt lõi không hoạt động = **0**; thời lượng duy trì: **TBD**    |
| **AC-022** | FR-18, NFR-01 | Nhiều người học trong một lớp có bằng chứng trên thiết bị riêng, không có kết nối bên ngoài | Giáo viên yêu cầu tập hợp dữ liệu lớp                                                      | Bằng chứng được tập hợp và thông tin tổng hợp lớp hiển thị được           | Tỷ lệ tập hợp thành công: **TBD**; phạm vi dữ liệu phải được hiển thị rõ     |
| **AC-023** | NFR-03        | Quá trình đồng bộ bị ngắt giữa chừng nhiều lần                                              | Kết nối được khôi phục và đồng bộ lại                                                      | Không có bản ghi nào bị mất và không có bản ghi nào bị nhân bản           | Số bản ghi mất = **0**; số bản ghi nhân bản = **0**                          |
| **AC-024** | NFR-04        | Việc nạp nội dung bị gián đoạn giữa chừng                                                   | Kết nối được khôi phục                                                                     | Quá trình nạp tiếp tục từ điểm dừng, không bắt đầu lại                    | Tỷ lệ phải nạp lại từ đầu = **0**                                            |
| **AC-025** | DR-10, BR-17  | Hai thiết bị có đồng hồ lệch nhau đáng kể                                                   | Dữ liệu từ hai thiết bị được tập hợp                                                       | Thứ tự sự kiện được xác định đúng, không phụ thuộc đồng hồ thiết bị       | Số trường hợp sắp sai thứ tự = **0**                                         |
| **AC-026** | NFR-14        | Thiết bị thuộc cấu hình phổ thông đời cũ tại địa bàn mục tiêu                               | Chạy toàn bộ chức năng cốt lõi                                                             | Hệ thống hoạt động không lỗi                                              | Cấu hình tối thiểu: **TBD** — xác định sau khảo sát thiết bị thực tế (OQ-07) |
| **AC-027** | NFR-18        | Dữ liệu cục bộ bị mất do hệ điều hành thu hồi dung lượng                                    | Người dùng mở lại ứng dụng                                                                 | Hệ thống phát hiện tình trạng mất dữ liệu và phục hồi từ nguồn đã tập hợp | Tỷ lệ phát hiện được = 100%                                                  |

## 10.5. An toàn, nội dung và dữ liệu

| **AC ID**  | **Req ID**    | **Given**                                                             | **When**                                           | **Then**                                                                                      | **Metric**                                                 |
|------------|---------------|-----------------------------------------------------------------------|----------------------------------------------------|-----------------------------------------------------------------------------------------------|------------------------------------------------------------|
| **AC-028** | FR-20, BR-09  | Một nội dung chưa có dấu thẩm định chuyên môn                         | Hệ thống chuẩn bị phát hành nội dung tới người học | Nội dung bị chặn, không tới được người học                                                    | Số nội dung chưa thẩm định tới người học = **0**           |
| **AC-029** | AIR-07        | Công cụ tự động xử lý nội dung                                        | Kết quả được đưa vào quy trình phát hành           | Đáp án đúng và nội dung gốc không bị thay đổi                                                 | Số trường hợp nội dung gốc bị thay đổi = **0**             |
| **AC-030** | AIR-13, BR-13 | Hệ thống hiển thị thông tin cho người học hoặc người giám hộ          | Bất kỳ điểm tiếp xúc nào                           | Không xuất hiện nhãn năng lực hoặc nhãn cấp lớp                                               | Số lần xuất hiện = **0**                                   |
| **AC-031** | FR-22, BR-19  | Nhiều người học sử dụng chung một thiết bị                            | Một người học mở ứng dụng                          | Chỉ dữ liệu của người học đó được hiển thị                                                    | Số lần hiển thị chéo = **0**                               |
| **AC-032** | FR-21, DR-09  | Cơ sở giáo dục yêu cầu ngừng sử dụng                                  | Yêu cầu xuất và xoá dữ liệu được thực hiện         | Toàn bộ dữ liệu thuộc phạm vi cơ sở được xuất ra và xoá khỏi hệ thống                         | Tỷ lệ hoàn tất = 100%                                      |
| **AC-033** | DR-08, NFR-10 | Dữ liệu được chuyển ra ngoài phạm vi cơ sở giáo dục phục vụ phân tích | Kiểm tra nội dung dữ liệu                          | Không chứa thông tin định danh trực tiếp người học                                            | Số trường định danh trực tiếp = **0**                      |
| **AC-034** | FR-23, AIR-23 | Mô hình cấu trúc kiến thức đổi phiên bản                              | Các kết luận đã lưu được rà soát                   | Các kết luận bị ảnh hưởng được đánh dấu cần tính lại, không giữ nguyên như kết luận hiện hành | Tỷ lệ đánh dấu đúng = 100%                                 |
| **AC-035** | FR-24         | Người học vừa thực hiện một phép đo                                   | Trong khoảng thời gian xác định sau đó             | Người học không gặp lại đúng phép đo đó                                                       | Khoảng thời gian: **TBD**; số lần lặp trong khoảng = **0** |

> **Tổng kết Mục 10:** trong 35 tiêu chí chấp nhận, **23 tiêu chí có ngưỡng xác định** (phần lớn là ngưỡng bằng 0 hoặc 100%, tức các ngưỡng thuộc về chính sách), **12 tiêu chí ở trạng thái TBD** (AC-002, AC-006, AC-010, AC-013, AC-014, AC-016, AC-019, AC-020, AC-021, AC-022, AC-026, AC-035). Toàn bộ tiêu chí TBD đều kèm phương pháp xác định cụ thể. Không có tiêu chí nào được gán ngưỡng tuỳ tiện.

---

# 11. REQUIREMENT TRACEABILITY MATRIX

| **Problem / Gap**  | **Stakeholder Need** | **Requirement**                                                               | **Use Case**           | **AC**                                                             | **Metric**                                                       |
|--------------------|----------------------|-------------------------------------------------------------------------------|------------------------|--------------------------------------------------------------------|------------------------------------------------------------------|
| P1 / GAP-01        | SN-T-01              | FR-02, FR-03, FR-04                                                           | UC-003                 | AC-001, AC-002                                                     | Mức trùng khớp với chẩn đoán chuyên gia                          |
| P1 / GAP-05        | SN-T-04              | FR-08, AIR-10, AIR-15                                                         | UC-003, UC-004         | AC-003, AC-004                                                     | Số kết luận dưới ngưỡng; số sai khi tin cậy cao                  |
| P1 / GAP-09        | SN-S-04              | FR-05, FR-06, AIR-02                                                          | UC-004                 | AC-006                                                             | Số phép đo trung bình để đạt kết luận                            |
| P1 / GAP-13        | SN-T-01              | FR-07, BR-14                                                                  | UC-005                 | AC-005                                                             | Tỷ lệ tuân thủ quy tắc phi kiến thức                             |
| P2 / GAP-03        | SN-T-02              | FR-10, FR-11, AIR-05                                                          | UC-009                 | AC-014                                                             | Số nhóm can thiệp trên mỗi lớp                                   |
| P2 / GAP-04        | SN-T-03              | FR-11, FR-15                                                                  | UC-009, UC-010         | AC-014                                                             | Số quyết định giáo viên phải ra                                  |
| P1 / GAP-02        | SN-T-02              | FR-01, FR-03, FR-18                                                           | UC-001, UC-003, UC-013 | AC-020, AC-022                                                     | Độ trễ từ bằng chứng tới thông tin cho giáo viên                 |
| P1 / GAP-06        | SN-S-02              | FR-09, FR-12, BR-18                                                           | UC-006, UC-008         | AC-008, AC-012                                                     | Số nội dung thừa trong phương án hỗ trợ                          |
| P1 / GAP-07        | SN-T-06, SN-E-01     | FR-01, FR-14, FR-23, NFR-07                                                   | UC-001, UC-007, UC-017 | AC-011, AC-018, AC-034                                             | Tỷ lệ kết luận truy vết được                                     |
| P1 / GAP-08        | SN-T-06              | FR-16, NFR-08, AIR-17                                                         | UC-010                 | AC-015, AC-016                                                     | Tỷ lệ giáo viên diễn đạt lại được căn cứ                         |
| P2 / GAP-12        | SN-T-04              | FR-17, AIR-11, AIR-18, BR-03                                                  | UC-011                 | AC-017, AC-018, AC-019                                             | Tỷ lệ bác bỏ của giáo viên                                       |
| P3 / GAP-10        | SN-SC-01, SN-T-02    | NFR-01, NFR-02, NFR-03, FR-18                                                 | UC-013, UC-014, UC-015 | AC-021 → AC-025                                                    | Thời lượng vận hành không kết nối; tỷ lệ mất dữ liệu             |
| P1 / GAP-11        | SN-E-01              | DR-01, DR-05, DR-06                                                           | UC-016                 | AC-002                                                             | Có dữ liệu người thật phục vụ kiểm định                          |
| BO-08 / GAP-14     | SN-S-03              | FR-13, BR-11, NFR-20                                                          | UC-006, UC-007         | AC-009, AC-010, AC-013                                             | Số buổi không tiếp cận mục tiêu lớp hiện tại                     |
| RK-06 / BO-06      | SN-S-01, SN-P-01     | AIR-13, NFR-12, BR-13                                                         | UC-010                 | AC-030                                                             | Số lần xuất hiện nhãn năng lực                                   |
| BO-06 / CO-L-01    | SN-P-02, SN-SC-05    | DR-08, DR-09, FR-21, NFR-10                                                   | UC-018                 | AC-032, AC-033                                                     | Tỷ lệ hoàn tất yêu cầu xuất/xoá dữ liệu                          |
| SN-SC-03 / CO-T-05 | SN-SC-03             | FR-20, NFR-09, AIR-07, AIR-12, BR-09                                          | UC-016                 | AC-028, AC-029                                                     | Số nội dung chưa thẩm định tới người học                         |
| RK-01 / SN-T-05    | SN-T-05              | AIR-09, NFR-13, BR-15                                                         | UC-010                 | — *(kiểm chứng bằng chính sách và rà soát quyền truy cập)*         | Không có báo cáo đánh giá giáo viên tồn tại                      |
| CO-I-03 / SN-S-06  | SN-S-06              | FR-22, BR-19                                                                  | UC-019                 | AC-031                                                             | Số lần hiển thị chéo                                             |
| CO-R-05 / SN-C-01  | SN-C-01              | NFR-17                                                                        | UC-016                 | — **[TBD]** — cần bổ sung AC sau khi đo được năng suất thẩm định | Năng suất thẩm định nội dung                                     |
| CO-T-06            | —                    | DR-10, BR-17                                                                  | UC-013                 | AC-025                                                             | Số trường hợp sắp sai thứ tự sự kiện                             |
| CO-D-07            | —                    | DR-11, BR-16                                                                  | UC-001                 | — **[TBD]** — cần bổ sung AC                                     | Chênh lệch độ tin cậy giữa hai bối cảnh                          |
| BO-06 / CO-E-08    | SN-P-03              | AIR-08, NFR-13, BR-12                                                         | UC-010                 | — *(kiểm chứng bằng chính sách)*                                   | Không tồn tại quyết định ràng buộc nào dựa trên kết quả hệ thống |
| CO-E-01            | SN-SC-04             | FR-20, NFR-09, DR-01                                                          | UC-016                 | AC-028                                                             | Tỷ lệ nội dung bám khung chương trình đã thẩm định               |
| CO-E-02, CO-E-05   | SN-SC-06             | — *(đóng bằng ràng buộc, không bằng requirement: AS-06, AS-23, OQ-03, OQ-12)* | —                      | —                                                                  | Kết luận khảo sát nội quy thiết bị và phân phối chương trình     |
| BO-04              | SN-S-05              | **Chưa có requirement** — ghi nhận tại 17.7                                   | —                      | —                                                                  | —                                                                |

## 11.1. Kiểm tra requirement mồ côi

| **Kiểm tra**                                                                        | **Kết quả**                                                                                                                                                                        |
|-------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Requirement không truy được về Problem / Gap / Stakeholder Need / Constraint / Risk | **Không có**                                                                                                                                                                       |
| Gap chưa có requirement tương ứng                                                   | **Không có** — 14/14 GAP đều có ít nhất một requirement                                                                                                                            |
| Stakeholder Need chưa được bao phủ                                                  | **Có 1**: trong **27** Need, 26 ánh xạ tới ít nhất một requirement hoặc constraint; **SN-S-05** (người học nhìn thấy tiến bộ của bản thân) chưa có requirement — ghi nhận tại 17.7 |
| Requirement quan trọng chưa có tiêu chí chấp nhận                                   | **Có 2 được nêu tên trong Mục 17.3** (NFR-17, DR-11). Ngoài ra nhiều requirement **không xuất hiện trong cột Req ID của Mục 10** dù được phủ gián tiếp — danh sách đầy đủ tại 17.7 |

---

# 12. RISK ANALYSIS

*Thang: Probability = Thấp / Trung bình / Cao / **Đã xảy ra** (rủi ro đã hiện thực hoá) · Impact = Thấp / Trung bình / Cao / Rất cao · Severity = tích hợp hai chiều*

| **Risk ID** | **Risk**                                                                                  | **Category**   | **Probability** | **Impact**  | **Severity**     | **Mitigation**                                                                                                                | **Validation**                                                         |
|-------------|-------------------------------------------------------------------------------------------|----------------|-----------------|-------------|------------------|-------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| **RK-01**   | Giáo viên không sử dụng, hoặc sử dụng hình thức                                           | Adoption       | Cao             | Cao         | **Nghiêm trọng** | Đồng thiết kế từ đầu; bảo đảm không tăng khối lượng công việc; cam kết không dùng dữ liệu để đánh giá giáo viên (BR-15)       | Đo mức sử dụng thực tế và tỷ lệ bác bỏ trong thử nghiệm (AS-08, AS-11) |
| **RK-02**   | Mô hình cấu trúc kiến thức sai hoặc xây dựng quá chậm                                     | Product        | Cao             | Cao         | **Nghiêm trọng** | Kiểm định quan hệ phụ thuộc trên dữ liệu kết quả học tập thật; giới hạn phạm vi nội dung                                      | Kiểm định thực nghiệm (AS-40, AS-44)                                   |
| **RK-03**   | Lỗi có nguyên nhân phi kiến thức chiếm tỷ lệ cao hơn dự kiến                              | Educational    | Trung bình–Cao  | Cao         | **Nghiêm trọng** | Bổ sung BR-14 và FR-07; không kết luận nguyên nhân kiến thức khi có dấu hiệu ngược lại                                        | Phân loại nguyên nhân trên tập bài làm thật (AS-46)                    |
| **RK-04**   | Người học bị giữ trong vòng lặp hỗ trợ, mất động lực và tụt xa thêm                       | Educational    | Trung bình      | Cao         | **Nghiêm trọng** | BR-11, FR-13, EC-08: giới hạn độ dài và bảo đảm tiếp cận nội dung lớp hiện tại                                                | Theo dõi số vòng lặp và tỷ lệ bỏ dở (AS-18)                            |
| **RK-05**   | Nội quy nhà trường không cho phép sử dụng thiết bị trong lớp                              | Infrastructure | Trung bình      | Cao         | **Nghiêm trọng** | Xác minh sớm; chuẩn bị phương án vận hành thay thế không phụ thuộc thiết bị cá nhân của người học                             | Khảo sát nội quy (OQ-03)                                               |
| **RK-06**   | Người giám hộ phản đối cơ chế truy ngược về kiến thức lớp dưới                            | Product        | Trung bình      | Trung bình  | Cao              | BR-13, AIR-13: ngôn ngữ về kỹ năng, không dùng nhãn cấp lớp; thông tin qua giáo viên                                          | Phỏng vấn qua giáo viên (AS-58)                                        |
| **RK-07**   | Kho phép đo cạn, người học gặp lại nội dung cũ                                            | Product        | Cao             | Trung bình  | Cao              | FR-24; biến thể tham số hoá; chuẩn bị trước ở giai đoạn biên soạn                                                             | Đo tần suất lặp trong thử nghiệm                                       |
| **RK-08**   | Thiết bị dùng chung dẫn tới ghi nhầm dữ liệu                                              | Technical      | Trung bình      | Trung bình  | Trung bình       | FR-22, BR-19, EC-15                                                                                                           | Kiểm thử kịch bản dùng chung (AS-24)                                   |
| **RK-09**   | Kiểm chứng theo vòng tròn: đánh giá trên dữ liệu do chính hệ thống sinh ra                | Product        | **Đã xảy ra**   | Cao         | **Nghiêm trọng** | Đã xác định; chuyển sang chuẩn đối chiếu độc lập từ chuyên gia và dữ liệu kết quả học tập thật                                | Đã đóng về mặt nhận thức; cần thực hiện DR-05, DR-06                   |
| **RK-10**   | Không có cơ sở pháp lý hợp lệ để xử lý dữ liệu người chưa thành niên                      | Privacy        | Trung bình      | **Rất cao** | **Nghiêm trọng** | Rà soát pháp lý trước khi thu thập bất kỳ dữ liệu nào; xác định rõ thẩm quyền đồng ý                                          | Rà soát pháp lý (OQ-08)                                                |
| **RK-11**   | Vi phạm bản quyền học liệu nguồn                                                          | Legal          | Trung bình      | Cao         | **Nghiêm trọng** | Rà soát nguồn gốc từng đơn vị nội dung; ưu tiên nội dung tự biên soạn hoặc có giấy phép rõ ràng                               | Rà soát pháp lý (OQ-09)                                                |
| **RK-12**   | Năng lực thẩm định chuyên môn không đáp ứng khối lượng                                    | Resource       | Cao             | Cao         | **Nghiêm trọng** | Giới hạn phạm vi nội dung; tối ưu quy trình thẩm định; NFR-17                                                                 | Đo năng suất thẩm định thực tế (OQ-05)                                 |
| **RK-13**   | Không thu được chấp thuận triển khai trong cửa sổ thời gian cho phép                      | Time           | Trung bình      | Cao         | **Nghiêm trọng** | Gửi đề nghị sớm; chuẩn bị nhiều cơ sở thay thế; chuẩn bị phương án bằng chứng dự phòng                                        | Theo dõi tiến độ phản hồi (AS-53)                                      |
| **RK-14**   | Không tồn tại chuẩn đối chiếu do chuyên gia không đồng thuận                              | Product        | Trung bình      | **Rất cao** | **Nghiêm trọng** | Nếu xảy ra: chuyển từ chỉ số độ chính xác sang chỉ số hữu ích với giáo viên; công bố phát hiện này như một kết quả nghiên cứu | Đo mức đồng thuận giữa chuyên gia (AS-02, OQ-02)                       |
| **RK-15**   | Phân phối chương trình và quy định về giáo án không cho phép tổ chức nhiều nhóm hoạt động | Educational    | Trung bình      | Cao         | **Nghiêm trọng** | Thiết kế phương án can thiệp nằm ngoài hoặc song song với tiến độ bắt buộc                                                    | Hỏi tổ trưởng chuyên môn (OQ-12, AS-06)                                |
| **RK-16**   | Chấp nhận thụ động: giáo viên đồng ý mọi kết luận mà không xem bằng chứng                 | Adoption       | Trung bình      | Cao         | Cao              | AIR-19, EC-17: theo dõi tỷ lệ chấp nhận không kèm xem bằng chứng                                                              | Đo trong thử nghiệm                                                    |
| **RK-17**   | Dữ liệu cục bộ bị mất do giới hạn thiết bị                                                | Technical      | Trung bình      | Cao         | Cao              | NFR-18, EC-14: phát hiện và phục hồi                                                                                          | Kiểm thử điều kiện đầy bộ nhớ (AS-26)                                  |

## 12.1. Rủi ro cần xử lý trước tiên

Bốn rủi ro có mức nghiêm trọng cao **và** có thể xử lý bằng hành động không tốn chi phí phát triển:

| **Risk**         | **Hành động**                                    | **Thời điểm**                         |
|------------------|--------------------------------------------------|---------------------------------------|
| **RK-10**        | Rà soát pháp lý về dữ liệu người chưa thành niên | Trước khi thu thập bất kỳ dữ liệu nào |
| **RK-13**        | Gửi văn bản đề nghị triển khai                   | Trong cửa sổ thời gian trước năm học  |
| **RK-05, RK-15** | Khảo sát nội quy thiết bị và quy định chuyên môn | Cùng một buổi làm việc với nhà trường |
| **RK-14**        | Đo mức đồng thuận giữa ba chuyên gia             | Một buổi làm việc với giáo viên       |

---

# 13. METRICS & KPIs

> **Nguyên tắc:** chỉ đặt Target khi có căn cứ. Target dạng **0** hoặc **100%** là ngưỡng chính sách (do đội cam kết), không cần dữ liệu để xác lập. Mọi Target khác đều ghi **TBD** kèm cách xác định.

## 13.1. Business Metrics

| **Metric**                                           | **Purpose**          | **Measurement**                                                  | **Target**                         | **Evidence for Target**                        |
|------------------------------------------------------|----------------------|------------------------------------------------------------------|------------------------------------|------------------------------------------------|
| Độ trễ phát hiện lỗ hổng                             | Đo BO-01             | Khoảng thời gian từ khi lỗ hổng biểu hiện tới khi giáo viên biết | **TBD**                            | Chưa có số liệu nền về độ trễ hiện tại         |
| Số nhóm can thiệp trên mỗi lớp                       | Đo BO-03             | Đếm số nhóm hệ thống trình bày                                   | **TBD**                            | Phụ thuộc năng lực tổ chức lớp thực tế (AS-09) |
| Thời gian giáo viên bỏ ra mỗi tuần                   | Đo BO-02             | Nhật ký thời gian, so sánh trước/sau                             | **TBD** — mục tiêu là *không tăng* | Chưa đo được quỹ thời gian hiện tại (OQ-06)    |
| Tỷ lệ cơ sở giáo dục tiếp tục sử dụng sau thử nghiệm | Đo sức sống sản phẩm | Đếm                                                              | **TBD**                            | Chưa có tiền lệ                                |

## 13.2. Teacher Metrics

| **Metric**                                             | **Purpose**                                     | **Measurement**                             | **Target**                   | **Evidence for Target**                                                                                                          |
|--------------------------------------------------------|-------------------------------------------------|---------------------------------------------|------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| Tần suất sử dụng                                       | Đo mức chấp nhận thực tế                        | Số lần mở và thao tác mỗi tuần              | **TBD**                      | Chưa có dữ liệu nền                                                                                                              |
| Số can thiệp thực hiện xuất phát từ thông tin hệ thống | Đo AS-08 — thông tin có dẫn tới hành động không | Quan sát tiết học và ghi nhận của giáo viên | **TBD**                      | Đây là biến số quan trọng nhất chưa được kiểm chứng                                                                              |
| **Tỷ lệ bác bỏ của giáo viên**                         | Chỉ số sức khoẻ hệ thống hai chiều              | Tỷ lệ kết luận bị bác bỏ hoặc điều chỉnh    | **TBD — dải chấp nhận được** | Giá trị quá cao nghĩa là hệ thống sai; quá thấp nghĩa là chấp nhận thụ động. Dải cụ thể chỉ xác định được sau khi có dữ liệu nền |
| Tỷ lệ chấp nhận không kèm xem bằng chứng               | Phát hiện RK-16                                 | Tỷ lệ quyết định không mở phần bằng chứng   | **TBD**                      | —                                                                                                                                |
| Thời gian từ khi mở tới khi ra quyết định              | Đo NFR-05                                       | Đo trong quá trình sử dụng                  | **TBD**                      | Cần quan sát nhịp làm việc thực tế                                                                                               |

## 13.3. Student Metrics

| **Metric**                                        | **Purpose**                | **Measurement**                                    | **Target** | **Evidence for Target**                                       |
|---------------------------------------------------|----------------------------|----------------------------------------------------|------------|---------------------------------------------------------------|
| Tỷ lệ hoàn thành phương án hỗ trợ                 | Đo AS-17, AS-18            | Đếm                                                | **TBD**    | —                                                             |
| Tỷ lệ quay lại theo tuần                          | Phát hiện tình trạng bỏ dở | Đếm theo tuần                                      | **TBD**    | Bỏ dở sau vài tuần là thất bại phổ biến của loại sản phẩm này |
| Kết quả phép đo xác nhận độc lập                  | Đo hiệu quả hỗ trợ         | So sánh trước/sau; đo lại sau một khoảng thời gian | **TBD**    | Cần thiết kế đo lường phù hợp cỡ mẫu (CO-D-05)                |
| Số buổi không được tiếp cận mục tiêu lớp hiện tại | Kiểm soát RK-04            | Đếm                                                | **0**      | Ngưỡng chính sách (BR-11)                                     |
| Số phép đo trung bình để đạt kết luận             | Đo SN-S-04                 | Đếm                                                | **TBD**    | Cần đo ngưỡng chịu đựng thực tế                               |

## 13.4. Diagnostic / AI Metrics

| **Metric**                                              | **Purpose**                    | **Measurement**                | **Target**                                 | **Evidence for Target**                                                                         |
|---------------------------------------------------------|--------------------------------|--------------------------------|--------------------------------------------|-------------------------------------------------------------------------------------------------|
| Mức trùng khớp với chẩn đoán chuyên gia                 | Đo FR-03                       | So với chuẩn đối chiếu độc lập | **TBD**                                    | **Phụ thuộc hoàn toàn vào AS-02**: nếu chuyên gia không đồng thuận thì chỉ số này không tồn tại |
| **Số kết luận sai khi mức tin cậy cao**                 | Đo AIR-15                      | Đếm                            | **0**                                      | Ngưỡng chính sách                                                                               |
| Tỷ lệ từ chối kết luận                                  | Đo AIR-16                      | Tỷ lệ trạng thái chưa kết luận | **TBD — dải**                              | Quá cao thì không dùng được; quá thấp thì kết luận thiếu căn cứ                                 |
| Tỷ lệ nội dung bị loại ở khâu kiểm chứng tự động        | Đo giá trị của tầng kiểm chứng | Đếm                            | **Báo cáo trung thực, không đặt mục tiêu** | Con số này thể hiện mức độ cần thiết của tầng kiểm chứng                                        |
| Mức đồng thuận giữa các chuyên gia                      | Kiểm chứng AS-02               | Đo trên cùng bộ bài làm        | **TBD**                                    | **Đây là phép đo phải thực hiện trước mọi phép đo khác**                                        |
| Chênh lệch chất lượng chẩn đoán giữa các nhóm người học | Đo NFR-20                      | Phân tích tách theo nhóm       | **TBD**                                    | —                                                                                               |

## 13.5. Offline / Technical Metrics

| **Metric**                                         | **Purpose** | **Measurement**               | **Target** | **Evidence for Target**                     |
|----------------------------------------------------|-------------|-------------------------------|------------|---------------------------------------------|
| Thời lượng vận hành liên tục không kết nối         | Đo NFR-01   | Kiểm thử và ghi nhận thực tế  | **TBD**    | Phụ thuộc chu kỳ có kết nối thực tế (OQ-07) |
| Tỷ lệ mất dữ liệu khi đồng bộ                      | Đo NFR-03   | Đối chiếu số bản ghi          | **0**      | Ngưỡng chính sách                           |
| Tỷ lệ bản ghi bị nhân bản                          | Đo EC-12    | Đối chiếu định danh bản ghi   | **0**      | Ngưỡng chính sách                           |
| Kích thước nội dung một đơn vị chương trình        | Đo NFR-02   | Đo trực tiếp                  | **TBD**    | Phụ thuộc băng thông thực tế                |
| Thời gian nạp nội dung ở băng thông thực tế        | Đo NFR-02   | Kiểm thử ở băng thông đo được | **TBD**    | —                                           |
| Tỷ lệ phát hiện được tình trạng mất dữ liệu cục bộ | Đo NFR-18   | Kiểm thử                      | **100%**   | Ngưỡng chính sách                           |
| Cấu hình thiết bị tối thiểu vận hành được          | Đo NFR-14   | Kiểm thử trên thiết bị thật   | **TBD**    | Phụ thuộc khảo sát thiết bị thực tế         |

> **Tổng kết Mục 13:** trong **27** chỉ số, **5 chỉ số có Target bằng số** (đều là ngưỡng chính sách dạng 0 hoặc 100%), **1 chỉ số cố ý không đặt mục tiêu** (tỷ lệ nội dung bị loại ở khâu kiểm chứng tự động — chỉ báo cáo trung thực), **21 chỉ số ở trạng thái TBD**. Tỷ lệ TBD cao phản ánh đúng trạng thái hiện tại của dự án: chưa có dữ liệu nền. Việc điền số vào các ô này trước khi có dữ liệu sẽ tạo ra mục tiêu không có căn cứ và làm sai lệch việc đánh giá về sau.

---

# 14. SOLUTION CANDIDATES

> **Đây là mục đầu tiên và duy nhất trong tài liệu được phép mô tả giải pháp.**
>
> Phân biệt ba khái niệm:

| **Khái niệm**             | **Định nghĩa**                       | **Trạng thái**                       |
|---------------------------|--------------------------------------|--------------------------------------|
| **Requirement**           | Điều hệ thống/nghiệp vụ cần đạt được | Đã xác lập tại Mục 6                 |
| **Solution Candidate**    | Một cách khả dĩ để đạt requirement   | **Đang xem xét** — chưa quyết định   |
| **Architecture Decision** | Lựa chọn đã được chốt kèm lý do      | **Chưa có quyết định nào được chốt** |

> Toàn bộ nội dung mục này ở trạng thái **Under Evaluation**. Việc chốt phương án chỉ được thực hiện sau khi đóng các assumption tương ứng.

## 14.1. Danh mục Solution Candidate

| **Candidate**                                                                                                        | **Requirement giải quyết**    | **Ưu điểm**                                                                            | **Nhược điểm**                                                                             | **Assumption phụ thuộc**   | **Decision Status**                                     |
|----------------------------------------------------------------------------------------------------------------------|-------------------------------|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|----------------------------|---------------------------------------------------------|
| **SC-01** — Biểu diễn tri thức dưới dạng quan hệ phụ thuộc tường minh giữa các đơn vị kiến thức                      | FR-03, FR-12, DR-01           | Giải thích được; suy luận không cần dữ liệu lớn; vận hành cục bộ được                  | Chi phí xây dựng và thẩm định cao; phụ thuộc chất lượng mô hình; giả định cấu trúc rời rạc | AS-40, AS-41, AS-42, AS-44 | **Chọn tạm cho pilot — provisional (Mục 19.7.1)**       |
| **SC-02** — Mô hình chẩn đoán xác suất có ghi nhật ký đầy đủ                                                         | FR-03, FR-04, NFR-06, NFR-08  | Biểu đạt được mức tin cậy và nhiều nguyên nhân đồng thời; xử lý tốt AS-04              | Cần dữ liệu để hiệu chỉnh; khó giải thích hơn nếu không thiết kế cẩn thận                  | AS-40, CO-D-01             | **Under Evaluation**                                    |
| **SC-03** — Thiết kế phép đo mang thông tin chẩn đoán, trong đó mỗi phương án sai gắn với một kiểu hiểu sai xác định | FR-05, FR-06, GAP-09          | Tăng lượng thông tin trên mỗi phép đo; giảm số câu hỏi cần thiết; tạo ra dữ liệu DR-04 | Chi phí biên soạn cao hơn; đòi hỏi chuyên môn sâu; làm nặng thêm nút thắt CO-R-05          | AS-46, AS-48, AS-54        | **Under Evaluation**                                    |
| **SC-04** — Kiến trúc ưu tiên xử lý cục bộ, đồng bộ khi có điều kiện                                                 | NFR-01, NFR-03, FR-18         | Đáp ứng trực tiếp CO-I-01; chi phí vận hành biên thấp                                  | Phức tạp trong xử lý xung đột dữ liệu; giới hạn bởi năng lực thiết bị                      | AS-25, AS-26, AS-28        | **Under Evaluation**                                    |
| **SC-05** — Tập hợp dữ liệu lớp qua một điểm trung tâm cục bộ do giáo viên vận hành                                  | FR-18, NFR-01                 | Cho phép có thông tin cấp lớp mà không cần hạ tầng bên ngoài                           | Chuyển chi phí và trách nhiệm sang giáo viên; phụ thuộc thiết bị của giáo viên             | AS-29, AS-30, AS-31        | **Chọn tạm cho pilot — provisional (Mục 19.7.2)**       |
| **SC-06** — Trao đổi dữ liệu qua phương tiện lưu trữ vật lý khi không có phương án kết nối cục bộ                    | FR-18                         | Hoạt động trong điều kiện khắc nghiệt nhất                                             | Thao tác thủ công; độ trễ cao; dễ sai sót                                                  | AS-28                      | **Under Evaluation** — phương án dự phòng               |
| **SC-07** — Hỗ trợ ra quyết định cho giáo viên dưới dạng thông tin tổng hợp theo nhóm nguyên nhân                    | FR-15, FR-16, SR-02           | Đáp ứng trực tiếp GAP-03 và GAP-04                                                     | Rủi ro chấp nhận thụ động (RK-16); có thể không phù hợp nhịp làm việc thực tế              | AS-08, AS-09, AS-12        | **Chọn tạm cho pilot — provisional (Mục 19.7.3)**       |
| **SC-08** — Trình bày thông tin cho giáo viên dưới dạng bản in trước tiết học                                        | FR-15, SR-02                  | Không phụ thuộc thiết bị; phù hợp với giáo viên ít dùng công nghệ                      | Không tương tác được; không xem sâu bằng chứng được; độ trễ cao hơn                        | AS-12, AS-23               | **Under Evaluation** — phương án thay thế nếu AS-23 sai |
| **SC-09** — Chuẩn bị nội dung trước bằng công cụ hỗ trợ tự động, kèm kiểm chứng và thẩm định trước khi phát hành     | FR-24, NFR-09, AIR-06, AIR-12 | Giảm chi phí biên soạn; giữ được yêu cầu vận hành không kết nối                        | Chất lượng chưa được kiểm chứng; không loại bỏ được nút thắt thẩm định                     | AS-48, AS-49, AS-51, AS-54 | **Chọn tạm cho pilot — provisional (Mục 19.7.4)**       |
| **SC-10** — Kiểm chứng tự động tính đúng đắn của nội dung trước khi đưa vào quy trình thẩm định                      | NFR-09, AIR-07                | Loại bỏ sai sót về đáp án trước khi tới người thẩm định; giảm tải cho chuyên môn       | Chỉ áp dụng được với một số dạng nội dung (CO-T-05)                                        | AS-49                      | **Chọn tạm cho pilot — provisional (Mục 19.7.4)**       |
| **SC-11** — Biên soạn thủ công toàn bộ nội dung                                                                      | FR-24, NFR-09                 | Chất lượng kiểm soát được; không phụ thuộc công cụ                                     | Chi phí và thời gian cao; hạn chế quy mô                                                   | AS-54                      | **Under Evaluation** — phương án đối chứng              |
| **SC-12** — Kiểm định quan hệ phụ thuộc kiến thức bằng dữ liệu kết quả học tập thật ở quy mô lớn                     | DR-01, DR-05, BO-07           | Chuyển mô hình từ giả định sang có căn cứ thực nghiệm; giải quyết RK-02 và AS-44       | Phụ thuộc khả năng tiếp cận dữ liệu; dữ liệu có thể ở cấp độ khác với cấp độ mục tiêu      | AS-33, AS-44               | **Under Evaluation**                                    |
| **SC-13** — Xác lập chuẩn đối chiếu bằng chẩn đoán độc lập của nhiều chuyên gia                                      | DR-06, BO-07                  | Bằng chứng trên dữ liệu người thật; đồng thời kiểm chứng AS-01, AS-02, AS-04, AS-07    | Cỡ mẫu nhỏ; phụ thuộc sự tham gia của giáo viên                                            | AS-01, AS-02               | **Under Evaluation — ưu tiên cao nhất**                 |

## 14.2. Quan hệ thay thế và bổ sung

| **Nhóm**                | **Các phương án**          | **Quan hệ**                                |
|-------------------------|----------------------------|--------------------------------------------|
| Cơ chế suy luận         | SC-01, SC-02               | Có thể **thay thế** hoặc **kết hợp**       |
| Vận hành không kết nối  | SC-04 + (SC-05 hoặc SC-06) | SC-04 là nền; SC-05 và SC-06 thay thế nhau |
| Trình bày cho giáo viên | SC-07, SC-08               | **Thay thế** — lựa chọn phụ thuộc AS-23    |
| Chuẩn bị nội dung       | SC-09 + SC-10, hoặc SC-11  | Hai hướng **thay thế** nhau                |
| Bằng chứng              | SC-12, SC-13               | **Bổ sung** — nên làm cả hai               |

## 14.3. Điều kiện để chuyển từ Candidate sang Architecture Decision

| **Candidate**  | **Điều kiện chốt**                                                                                                          |
|----------------|-----------------------------------------------------------------------------------------------------------------------------|
| SC-01 vs SC-02 | Sau khi có kết quả kiểm định quan hệ phụ thuộc (SC-12) và kết quả về số nguyên nhân đồng thời (AS-04)                       |
| SC-04          | Sau khi khảo sát hạ tầng và kiểm thử trên thiết bị thật (AS-25, AS-28, OQ-07)                                               |
| SC-05 vs SC-06 | Sau khi xác minh AS-29, AS-30, AS-31                                                                                        |
| SC-07 vs SC-08 | Sau khi xác minh AS-23 (nội quy thiết bị) và AS-12 (nhịp làm việc của giáo viên)                                            |
| SC-09 vs SC-11 | Sau khi đo tỷ lệ chấp nhận của chuyên gia đối với nội dung do công cụ hỗ trợ sinh ra (AS-48) và năng suất thẩm định (AS-54) |
| SC-03          | Sau khi đánh giá chi phí biên soạn so với mức giảm số phép đo cần thiết                                                     |

> **Trạng thái hiện tại (cập nhật bản 1.3): bốn nhóm phương án đã được chọn tạm cho pilot — SC-01, SC-05, SC-07 và SC-09+SC-10 — theo Mục 19. Đây là quyết định tạm có điều kiện lật rõ ràng, chưa phải Architecture Decision cuối cùng. Lựa chọn công nghệ tương ứng nằm tại Phụ lục F.** Đây là trạng thái đúng của dự án ở giai đoạn này. Việc chốt sớm trước khi đóng các assumption tương ứng sẽ tạo ra ràng buộc không cần thiết.

---

# 15. PRIORITY & ROADMAP

## 15.1. Requirement Prioritization

| **Mức**    | **Định nghĩa áp dụng trong tài liệu này**                                          |
|------------|------------------------------------------------------------------------------------|
| **Must**   | Không có thì không kiểm chứng được giả thuyết cốt lõi, hoặc vi phạm ràng buộc cứng |
| **Should** | Nâng đáng kể giá trị nhưng không chặn việc kiểm chứng                              |
| **Could**  | Có giá trị, thực hiện khi còn nguồn lực                                            |
| **Later**  | Ghi nhận, chưa xét trong phạm vi hiện tại                                          |

### 15.1.1. Must

| **ID**                                                                                 | **Requirement (rút gọn)**                                                                                                                                          | **Lý do bắt buộc**                                                                                                                        |
|----------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| FR-01, FR-02, FR-03                                                                    | Ghi nhận bằng chứng, ước lượng mức thành thạo, xác định nguyên nhân                                                                                                | Cấu thành giả thuyết cốt lõi                                                                                                              |
| FR-04                                                                                  | Xếp hạng nguyên nhân khả dĩ theo mức phù hợp với bằng chứng                                                                                                        | Không có thì FR-08 không có căn cứ để so với ngưỡng tin cậy                                                                               |
| FR-06                                                                                  | Chủ động chọn phép đo phân biệt khi bằng chứng chưa đủ                                                                                                             | Chu trình MVP tại 15.3.2 bắt buộc có trạng thái "cần thêm bằng chứng"; UC-004 là Must                                                     |
| FR-08                                                                                  | Từ chối kết luận khi chưa đủ bằng chứng                                                                                                                            | Ràng buộc an toàn; là điểm phân biệt cốt lõi                                                                                              |
| FR-09                                                                                  | Chuyển sang nội dung mở rộng khi đã vững nền                                                                                                                       | UC-008 là Must; AC-012 đặt ngưỡng 100%; không có thì vi phạm GAP-06                                                                       |
| FR-11, FR-15                                                                           | Gom nhóm và trình bày ưu tiên                                                                                                                                      | Đáp ứng GAP-03, GAP-04                                                                                                                    |
| FR-12, FR-13                                                                           | Phương án hỗ trợ tối giản có giới hạn                                                                                                                              | Đáp ứng GAP-06, GAP-14                                                                                                                    |
| FR-14                                                                                  | Xác nhận độc lập                                                                                                                                                   | Không có thì không đo được hiệu quả                                                                                                       |
| FR-16, FR-17                                                                           | Trình bày bằng chứng và cho phép bác bỏ                                                                                                                            | Đáp ứng GAP-08, GAP-12                                                                                                                    |
| FR-18                                                                                  | Tập hợp dữ liệu lớp không cần kết nối                                                                                                                              | Đáp ứng GAP-10                                                                                                                            |
| FR-20, FR-21, FR-23                                                                    | Thẩm định nội dung, quản lý dữ liệu, tính lại kết luận                                                                                                             | Ràng buộc an toàn và pháp lý                                                                                                              |
| NFR-20                                                                                 | Chất lượng chẩn đoán không suy giảm có hệ thống theo nhóm người học                                                                                                | Là nguồn của BRQ-07 (Must) và của BO-08. Nâng từ Could ở bản 1.2                                                                          |
| NFR-14                                                                                 | Hoạt động trên thiết bị phổ thông đời cũ tại địa bàn                                                                                                               | Mục 15.3.2 ghi rõ đây là điều kiện biên của MVP, không phải tính năng nâng cao. Là tiêu chí hoàn thành MVP số 1. Nâng từ Should ở bản 1.2 |
| DR-09                                                                                  | Cơ chế xuất và xoá dữ liệu theo yêu cầu                                                                                                                            | Là nguồn của FR-21 (Must) và của nghĩa vụ pháp lý CO-L-03, BO-06. Nâng từ Could ở bản 1.2                                                 |
| DR-06                                                                                  | Chuẩn đối chiếu độc lập từ chẩn đoán của chuyên gia                                                                                                                | Điều kiện của AC-002, của hành động ưu tiên số 1 tại Mục 15.4 và của tiêu chí hoàn thành MVP số 5. Nâng từ Should ở bản 1.2               |
| NFR-01, NFR-02, NFR-03, NFR-04, NFR-06, NFR-07, NFR-09, NFR-10, NFR-12, NFR-13, NFR-16 | Vận hành không kết nối, ngân sách truyền dữ liệu, nạp lại được sau gián đoạn, toàn vẹn dữ liệu, tái lập, an toàn nội dung, ngôn ngữ không xếp loại, bảo vệ dữ liệu | Ràng buộc cứng (NFR-02 và NFR-04 xuất phát từ CO-I-02; NFR-12 gắn với BR-13)                                                              |
| DR-01, DR-02, DR-03, DR-07, DR-08                                                      | Mô hình kiến thức, kho phép đo, nhật ký, phiên bản, ẩn danh                                                                                                        | Điều kiện cần                                                                                                                             |
| AIR-07 → AIR-13, AIR-15, AIR-17, AIR-18                                                | Ranh giới quyền quyết định của AI                                                                                                                                  | Ràng buộc an toàn                                                                                                                         |

### 15.1.2. Should

FR-05, FR-07, FR-10, FR-19, FR-22, FR-24 · NFR-05, NFR-08, NFR-11, NFR-17, NFR-18 · DR-04, DR-05, DR-10, DR-11 · AIR-01 → AIR-06, AIR-14, AIR-16, AIR-19, AIR-21 → AIR-23

> **Kiểm tra bao phủ mức ưu tiên:** toàn bộ FR-01 → FR-24, NFR-01 → NFR-20, DR-01 → DR-11 và AIR-01 → AIR-23 đều xuất hiện đúng một lần trong bốn nhóm Must / Should / Could / Later. Mức ưu tiên ở mục này khớp với cột *Priority* của Mục 6.3.

### 15.1.3. Could

NFR-15, NFR-19 · AIR-20

### 15.1.4. Later

Mở rộng phạm vi môn học và khối lớp · Báo cáo tổng hợp cấp Phòng/Sở (SN-G-01) — hoãn trong pilot đầu tiên theo Mục 19.6. Lưu ý: SR-15 KHÔNG nằm ở mức Later; SR-15 là ràng buộc ẩn danh áp cho mọi báo cáo tổng hợp và giữ nguyên mức Must theo Mục 6.2 · Tích hợp với hệ thống quản lý của nhà trường

## 15.2. Validation Priority

Xếp theo nguyên tắc: **assumption nào sai sẽ thay đổi toàn bộ giải pháp thì kiểm trước**.

### Nhóm 1 — Kiểm ngay, chi phí thấp, có thể lật toàn bộ hướng đi

| **Thứ tự** | **Đối tượng kiểm**                                                          | **Cách kiểm**                                            | **Đóng được**                                                     |
|------------|-----------------------------------------------------------------------------|----------------------------------------------------------|-------------------------------------------------------------------|
| 1          | **AS-02** — có tồn tại chuẩn đối chiếu không                                | Ba giáo viên chẩn đoán độc lập trên cùng bộ bài làm thật | **Nếu không đồng thuận, toàn bộ chỉ số độ chính xác mất ý nghĩa** |
| 2          | **AS-01** — giáo viên đã biết nguyên nhân chưa                              | Cùng buổi làm việc trên                                  | Quyết định định vị sản phẩm                                       |
| 3          | **AS-04, AS-07, AS-46** — số nguyên nhân, loại lỗ hổng, tỷ lệ phi kiến thức | Cùng buổi làm việc trên                                  | Quyết định cơ chế suy luận (SC-01 hay SC-02)                      |
| 4          | **AS-23, AS-22, AS-24** — nội quy thiết bị, số thiết bị                     | Khảo sát nhà trường                                      | **Quyết định kiến trúc**                                          |
| 5          | **AS-06, AS-53** — quyền tổ chức tiết học, chấp thuận triển khai            | Làm việc với chuyên môn và ban giám hiệu                 | Quyết định tính khả thi                                           |
| 6          | **AS-34, AS-35** — cơ sở pháp lý và bản quyền                               | Rà soát pháp lý                                          | **Chặn triển khai và thương mại hoá**                             |

> Bốn hạng mục đầu tiên đóng được bằng **một buổi làm việc với ba giáo viên** và **một buổi khảo sát nhà trường**. Chi phí gần bằng không so với giá trị thông tin thu được.

### Nhóm 2 — Kiểm trong giai đoạn xây dựng

AS-25, AS-26, AS-28 → AS-32 (thiết bị và hạ tầng) · AS-48 → AS-52 (công cụ hỗ trợ) · AS-54 (năng suất thẩm định) · AS-40, AS-44 (kiểm định mô hình bằng dữ liệu thật)

### Nhóm 3 — Chỉ đóng được qua thử nghiệm thực địa

AS-03, AS-05, AS-08, AS-09, AS-11, AS-15 → AS-21, AS-36 → AS-38, AS-43, AS-47, AS-55 → AS-58

## 15.3. MVP Scope

> **MVP không được định nghĩa bằng số lượng tính năng.** MVP là **phạm vi nhỏ nhất cho phép kiểm chứng giả thuyết cốt lõi từ đầu tới cuối.**

### 15.3.1. Giả thuyết cốt lõi cần kiểm chứng

> Từ bằng chứng làm bài của một người học, có thể xác định được kiến thức nền là nguyên nhân của lỗi hiện tại với độ tin cậy đủ để giáo viên hành động — hoặc nhận biết được khi chưa đủ căn cứ để kết luận — và toàn bộ quá trình đó diễn ra được trong điều kiện không có kết nối.

### 15.3.2. Phạm vi tối thiểu để kiểm chứng giả thuyết trên

| **Chiều**          | **Phạm vi MVP**                                                                                                                           | **Lý do**                                                              |
|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| Nội dung           | **Một chuỗi phụ thuộc kiến thức duy nhất**                                                                                                | Đủ để chạy hết chu trình; nhiều hơn không tăng giá trị kiểm chứng      |
| Người dùng         | Một lớp, một giáo viên                                                                                                                    | Đủ để quan sát hành vi ra quyết định                                   |
| Chu trình          | **Đầy đủ**: bằng chứng → chẩn đoán → ba trạng thái kết luận → phương án hỗ trợ → xác nhận độc lập → thông tin cho giáo viên → bác bỏ được | **Không được cắt bớt** — cắt ở đâu thì giả thuyết không được kiểm ở đó |
| Điều kiện vận hành | Không có kết nối, trên thiết bị phổ thông đời cũ                                                                                          | Là điều kiện biên, không phải tính năng nâng cao                       |
| Bằng chứng         | Có chuẩn đối chiếu độc lập từ chuyên gia                                                                                                  | Không có thì không kết luận được gì                                    |

### 15.3.3. Nằm ngoài MVP

Nhiều lớp và nhiều giáo viên · Thông tin tổng hợp cấp quản lý · Nội dung đa phương tiện dung lượng lớn · Đăng nhập và phân quyền phức tạp · Tích hợp hệ thống bên ngoài · Nội dung ngoài chuỗi phụ thuộc đã chọn · Giao diện hoàn thiện

### 15.3.4. Tiêu chí hoàn thành MVP

| **#** | **Tiêu chí**                                                                                    |
|--------|-------------------------------------------------------------------------------------------------|
| 1      | Chu trình đầy đủ chạy được từ đầu tới cuối trên thiết bị thật, trong điều kiện không có kết nối |
| 2      | Hệ thống trả về đúng một trong ba trạng thái trong mọi trường hợp (AC-001)                      |
| 3      | Không có trường hợp kết luận sai kèm mức tin cậy cao trên bộ kiểm thử (AC-004)                  |
| 4      | Giáo viên bác bỏ được kết luận và quyết định của giáo viên có hiệu lực (AC-017)                 |
| 5      | Có kết quả đối chiếu với chẩn đoán độc lập của chuyên gia trên bài làm thật                     |

## 15.4. Recommended Next Actions

| **Priority** | **Action**                                                                       | **Why**                                                                                                      | **Input Needed**                                                                                    | **Deliverable**                                                                        | **Dependency**    |
|--------------|----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|-------------------|
| **1**        | Tổ chức buổi đối chiếu chẩn đoán với ba giáo viên trên bộ bài làm thật đã có sẵn | Đóng đồng thời AS-01, AS-02, AS-04, AS-07, AS-46 — trong đó AS-02 quyết định liệu có đo lường được hay không | Bài kiểm tra đã chấm của một lớp; ba giáo viên cùng chuyên môn                                      | Báo cáo mức đồng thuận và độ chính xác của chuyên gia; chuẩn đối chiếu ban đầu (DR-06) | DEP-02            |
| **2**        | Gửi văn bản đề nghị triển khai tới các cơ sở giáo dục                            | Cửa sổ thời gian trước năm học là ràng buộc cứng (CO-R-03)                                                   | Nội dung đề nghị nêu rõ phạm vi dữ liệu, cam kết không dùng cho đánh giá, quyền dừng bất cứ lúc nào | Văn bản chấp thuận                                                                     | DEP-01            |
| **3**        | Khảo sát hạ tầng, thiết bị và nội quy tại các cơ sở mục tiêu                     | Đóng AS-22, AS-23, AS-24, AS-27, AS-28 — nhóm quyết định kiến trúc                                           | Danh sách câu hỏi khảo sát                                                                          | Báo cáo điều kiện triển khai; kết luận cho OQ-03, OQ-04, OQ-07                         | DEP-01            |
| **4**        | Rà soát pháp lý về dữ liệu người chưa thành niên và bản quyền học liệu           | Hai ràng buộc cứng có thể chặn toàn bộ dự án ở giai đoạn cuối                                                | Danh mục dữ liệu dự kiến thu thập; danh mục nguồn nội dung                                          | Kết luận pháp lý; quy trình đồng thuận                                                 | DEP-05, DEP-06    |
| **5**        | Làm việc với tổ chuyên môn về phân phối chương trình và quy định giáo án         | Đóng AS-06 và OQ-12 — quyết định tính khả thi của việc tổ chức nhiều nhóm hoạt động                          | —                                                                                                   | Kết luận về không gian hành động thực tế của giáo viên                                 | DEP-03            |
| **6**        | Đo năng suất thẩm định nội dung trên một tập mẫu                                 | Đóng AS-54; xác định nút thắt quy mô thật (CO-R-05)                                                          | Tập mẫu nội dung; người thẩm định                                                                   | Số liệu năng suất; cơ sở đặt ngưỡng NFR-17                                             | DEP-03            |
| **7**        | Tiếp cận nguồn dữ liệu kết quả học tập thật để kiểm định quan hệ phụ thuộc       | Chuyển mô hình cấu trúc kiến thức từ giả định sang có căn cứ (AS-44, RK-02)                                  | Văn bản đề nghị; yêu cầu ẩn danh tại nguồn                                                          | Báo cáo kiểm định quan hệ phụ thuộc                                                    | DEP-04            |
| **8**        | Quan sát người học thực hiện bài làm theo phương pháp tư duy thành tiếng         | Đóng AS-05, AS-16, AS-17, AS-20, AS-45                                                                       | Nhóm nhỏ người học; sự đồng ý của người giám hộ                                                     | Báo cáo hành vi làm bài; phân loại nguyên nhân                                         | DEP-01, DEP-05    |
| **9**        | Xây dựng MVP theo phạm vi tại 15.3                                               | Kiểm chứng giả thuyết cốt lõi từ đầu tới cuối                                                                | Kết quả từ hành động 1, 3, 5                                                                        | Sản phẩm chạy được trên thiết bị thật, không kết nối                                   | Hành động 1, 3, 5 |
| **10**       | Thiết kế đo lường cho giai đoạn thử nghiệm thực địa                              | Bảo đảm thử nghiệm cho ra kết luận, không chỉ cho ra hoạt động                                               | Lịch kiểm tra định kỳ của nhà trường; cỡ mẫu dự kiến                                                | Kế hoạch đo lường; xác định các Target hiện đang TBD                                   | Hành động 2, 3    |

> **Thứ tự này không thể đảo.** Các hành động từ 1 tới 8 phần lớn **không đòi hỏi viết mã**, nhưng lại quyết định thiết kế của phần việc còn lại. Bắt đầu từ hành động 9 mà bỏ qua các hành động trước sẽ dẫn tới việc xây dựng trên nền giả định chưa được kiểm chứng.

---

# 16. SELF-REVIEW

Vòng tự rà soát trước khi kết thúc tài liệu.

| **#** | **Câu hỏi rà soát**                                                  | **Kết quả**                                                                                                                                         | **Xử lý**                                                                                                                                                                                                                      |
|--------|----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | **Requirement nào đang chứa giải pháp?**                             | Phát hiện 12 nội dung trong tài liệu nguồn được trình bày như yêu cầu nhưng thực chất là giải pháp                                                  | Đã tách toàn bộ sang Mục 14; yêu cầu tương ứng được viết lại ở dạng mô tả năng lực                                                                                                                                             |
| 2      | **Requirement nào không truy được về problem/gap/stakeholder?**      | Không còn                                                                                                                                           | Bốn nội dung trong tài liệu nguồn không truy được nguồn gốc đã bị loại: tài liệu dạng tệp tĩnh, đồng bộ đa thiết bị thời gian thực, mô hình thu phí trực tiếp từ người học, và một phần nội dung đa phương tiện dung lượng lớn |
| 3      | **Assumption nào đang được trình bày như fact?**                     | Phát hiện tại tài liệu nguồn: kết quả trên dữ liệu mô phỏng được trình bày như kết quả đánh giá                                                     | Đã đính chính tại Mục 1.6.1; đổi cách gọi thành kiểm tra tính nhất quán nội bộ                                                                                                                                                 |
| 4      | **Requirement nào không kiểm thử được?**                             | Không còn trong nhóm Must                                                                                                                           | Các yêu cầu mang tính định tính đã được gắn tiêu chí chấp nhận có thể quan sát được tại Mục 10                                                                                                                                 |
| 5      | **Requirement nào thiếu tiêu chí chấp nhận?**                        | **NFR-17 và DR-11** được nêu tên tại 17.3. Ngoài ra một nhóm requirement không được nhắc trong cột Req ID của Mục 10 dù nội dung được phủ gián tiếp | Đã liệt kê đầy đủ tại 17.7; bổ sung AC hoặc bổ sung tham chiếu chéo trước khi chuyển sang thiết kế                                                                                                                             |
| 6      | **Stakeholder need nào chưa được bao phủ?**                          | **Còn 1: SN-S-05**                                                                                                                                  | 26/27 need ánh xạ tới ít nhất một requirement hoặc constraint (Mục 11). SN-S-05 chưa có requirement — ghi nhận tại 17.7, cần quyết định bổ sung requirement hay đưa ra ngoài phạm vi                                           |
| 7      | **Gap nào chưa có requirement tương ứng?**                           | Không còn                                                                                                                                           | 14/14 gap đều có requirement (Mục 11)                                                                                                                                                                                          |
| 8      | **Metric nào tự đặt target không có căn cứ?**                        | Đã rà soát toàn bộ                                                                                                                                  | 21/27 metric để ở trạng thái TBD kèm phương pháp xác định; 5 metric có target bằng số đều là ngưỡng chính sách dạng 0 hoặc 100%; 1 metric cố ý không đặt mục tiêu                                                              |
| 9      | **Giải pháp nào được chọn trước khi requirement đủ rõ?**             | Không có quyết định kiến trúc nào được chốt                                                                                                         | Toàn bộ 13 phương án ở trạng thái Under Evaluation, kèm điều kiện chốt cụ thể (Mục 14.3)                                                                                                                                       |
| 10     | **Có mâu thuẫn nào giữa các mục không?**                             | Phát hiện 3 mâu thuẫn về nội dung (M-01 → M-03)                                                                                                     | Xem bảng dưới                                                                                                                                                                                                                  |
| 11     | **Số liệu tổng kết trong tài liệu có khớp với bảng chi tiết không?** | Phiên bản 1.0 sai ở 4 chỗ: số Stakeholder Need, số tiêu chí chấp nhận TBD, số metric, và số assumption chịu lực đóng được trong một buổi làm việc   | Đã sửa toàn bộ ở phiên bản 1.1; xem Phụ lục C                                                                                                                                                                                  |
| 12     | **Mức ưu tiên ở Mục 6 và Mục 15 có khớp nhau không?**                | Phiên bản 1.0 lệch ở 3 chỗ: FR-04 không xuất hiện ở Mục 15; FR-06 và FR-09 là Must ở 6.3 nhưng nằm nhóm Should ở 15.1                               | Đã đồng bộ về Must ở phiên bản 1.1; bổ sung dòng kiểm tra bao phủ tại 15.1.2                                                                                                                                                   |

## 16.1. Mâu thuẫn phát hiện được và cách xử lý

| **#**   | **Mâu thuẫn**                                                                                                                                              | **Trạng thái**                                                                                                                                                                                      |
|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **M-01** | NFR-10 và DR-08 yêu cầu dữ liệu ở lại phạm vi cơ sở giáo dục, trong khi BO-07 yêu cầu kiểm chứng độc lập và SN-G-01 yêu cầu thông tin tổng hợp cấp quản lý | **Chưa giải quyết.** Hướng xử lý đề xuất: tách hai luồng dữ liệu — dữ liệu vận hành ở lại cơ sở, dữ liệu phục vụ đánh giá được ẩn danh và tổng hợp theo thoả thuận riêng. Cần quyết định chính thức |
| **M-02** | SN-SC-03 yêu cầu mọi nội dung phải qua thẩm định chuyên môn, trong khi FR-24 yêu cầu kho phép đo đủ lớn để tránh lặp lại                                   | **Chưa giải quyết.** Đây là ràng buộc quy mô thật (CO-R-05). Phụ thuộc kết quả đo năng suất thẩm định (hành động 6)                                                                                 |
| **M-03** | FR-12 yêu cầu phương án hỗ trợ đi từ nguyên nhân gốc, trong khi FR-13 và CO-E-02 yêu cầu vẫn tiếp cận mục tiêu của lớp hiện tại                            | **Đã giải quyết** bằng cách chuyển thành ràng buộc phân bổ thời lượng thay vì lựa chọn loại trừ. Tỷ lệ cụ thể còn TBD                                                                               |

---

# 17. BA OPEN ITEMS

*Cập nhật 22/08/2026 — Một phần các mục dưới đây (ngưỡng BR-07/BR-08/EC-08, mâu thuẫn M-01, Solution Candidate SC-01/02, SC-05/06, SC-07/08, SC-09-11, và Stakeholder Need SN-S-05) đã được chốt tại buổi làm việc nhóm vòng 1. Xem chi tiết và lý do tại **Phụ lục E** ở cuối tài liệu.*

Danh sách toàn bộ nội dung chưa được đóng trước khi chuyển sang giai đoạn thiết kế giải pháp.

## 17.1. Câu hỏi chưa có lời đáp

> **Cách đọc cột cuối:** cột *Ghi nhận sơ bộ* chứa thông tin đội đã nghe được nhưng **chưa xác minh**. Toàn bộ đều mang nhãn **[A]**. Không câu hỏi nào trong bảng này được coi là đã đóng; không được trích dẫn cột này như dữ liệu khảo sát.

| **ID** | **Nội dung**                                                                              | **Ai trả lời**               | **Mức chặn**          | **Ghi nhận sơ bộ — [A] chưa xác minh**                                                                                                                                                                                                     |
|--------|-------------------------------------------------------------------------------------------|------------------------------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| OQ-01  | Giáo viên hiện chẩn đoán bằng cách nào và chính xác đến đâu                               | Giáo viên                    | Định vị sản phẩm      | —                                                                                                                                                                                                                                            |
| OQ-02  | Chuyên gia có đồng thuận khi chẩn đoán cùng một bài làm không                             | Giáo viên                    | **Khả năng đo lường** | — *(chưa tổ chức buổi đối chiếu; là hành động ưu tiên số 1 tại 15.4)*                                                                                                                                                                        |
| OQ-03  | Nội quy về thiết bị trong lớp học                                                         | Ban giám hiệu                | **Kiến trúc**         | —                                                                                                                                                                                                                                            |
| OQ-04  | Số người học trên mỗi thiết bị                                                            | Ban giám hiệu                | **Kiến trúc**         | Chưa xác định                                                                                                                                                                                                                                |
| OQ-05  | Thẩm quyền và năng suất thẩm định nội dung                                                | Tổ chuyên môn                | **Quy mô**            | —                                                                                                                                                                                                                                            |
| OQ-06  | Quỹ thời gian thực tế của giáo viên                                                       | Giáo viên                    | Thiết kế              | Một nguồn cho biết khoảng **10 giờ/tuần**, trong đó 8 giờ hành chính và 2 giờ hỗ trợ người học ngoài giờ. n = 1, chưa đối chiếu bằng nhật ký thời gian                                                                                       |
| OQ-07  | Điều kiện kết nối và thiết bị tại địa bàn                                                 | Ban giám hiệu                | Thiết kế              | Mô tả định tính: ít thiết bị, đường truyền không ổn định. Chưa có số liệu định lượng về băng thông, số thiết bị hay tần suất mất kết nối                                                                                                     |
| OQ-08  | Cơ sở pháp lý xử lý dữ liệu người chưa thành niên; thẩm quyền đồng ý                      | Pháp lý / Nhà trường         | **Triển khai**        | —                                                                                                                                                                                                                                            |
| OQ-09  | Ràng buộc bản quyền của ngân hàng câu hỏi nguồn                                           | Pháp lý                      | **Thương mại hoá**    | Chưa rà soát. Nội dung đang dùng chỉ là **dữ liệu mẫu cho nguyên mẫu nội bộ**, chưa có quyền sử dụng cho bản phát hành. Bắt buộc rà soát nguồn gốc từng đơn vị nội dung trước khi bất kỳ nội dung nào tới người học (CO-L-04, RK-11, AIR-12) |
| OQ-10  | Tỷ lệ lỗi có nguyên nhân phi kiến thức                                                    | Nghiên cứu bài làm thật      | Thuật toán            | —                                                                                                                                                                                                                                            |
| OQ-11  | Phản ứng của người giám hộ với cơ chế truy ngược                                          | Người giám hộ, qua giáo viên | Truyền thông          | —                                                                                                                                                                                                                                            |
| OQ-12  | Phân phối chương trình và quy định giáo án có cho phép tổ chức nhiều nhóm hoạt động không | Tổ chuyên môn                | **Tính khả thi**      | Chưa làm việc với tổ chuyên môn; nằm ở hành động 5 tại 15.4                                                                                                                                                                                  |

## 17.2. Ngưỡng chưa xác định

> **Cảnh báo sử dụng.** Cột *Giá trị sơ bộ* là con số đội tạm nêu để định hướng thảo luận. Đây **không phải ngưỡng đã xác lập** và **không được đưa vào tiêu chí chấp nhận, hợp đồng hay tài liệu đối ngoại** cho tới khi đóng bằng phương pháp ghi ở cột *Điều kiện xác định*. Ba giá trị trước đây tự **mâu thuẫn với chính requirement gốc** (NFR-02, NFR-05, NFR-11) đã được tách lại thành ngưỡng kép ở bản 1.4, đánh dấu ✅ trong bảng — không còn tự mâu thuẫn, nhưng vẫn là giá trị sơ bộ [A], chưa phải ngưỡng đã chốt.

| **Đối tượng**  | **Nội dung chưa có ngưỡng**                                    | **Điều kiện xác định**                              | **Giá trị sơ bộ — [A], chưa phải ngưỡng**                                                                                                                                                                                                                                                                                                                                                                                                       |
|----------------|----------------------------------------------------------------|-----------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NFR-01         | Thời lượng vận hành liên tục không kết nối                     | Khảo sát chu kỳ có kết nối (OQ-07)                  | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| NFR-02         | Kích thước nội dung và thời gian nạp chấp nhận được            | Đo băng thông thực tế                               | ✅ Tách thành 2 tiêu chí (bản 1.4), không còn tự mâu thuẫn: (1) **thời gian nạp chấp nhận được** ở băng thông thấp điển hình theo CO-I-02: dưới 10 phút. (2) **kích thước nội dung tối đa** cho một đơn vị chương trình: suy ra từ (1), không đặt trước một số GB cố định. Cả hai vẫn là giá trị sơ bộ [A], chờ đo băng thông thực tế (OQ-07).                                                                                                  |
| NFR-05         | Ngưỡng thời gian phản hồi phù hợp nhịp lớp học                 | Quan sát nhịp làm việc (OQ-06)                      | ✅ Tách thành 2 ngưỡng (bản 1.4), không còn tự mâu thuẫn: (1) **thời gian hiển thị trong tiết** — phải nằm trong nhịp ra quyết định trên lớp, khớp AC-020 (tiết 45 phút): dưới 2 phút kể từ khi mở màn hình. (2) **thời gian chuẩn bị/tổng hợp trước tiết** — không cần tức thời: có thể tới 1–2 giờ trước giờ dạy. Cả hai là giá trị sơ bộ [A], chờ quan sát nhịp làm việc thực tế (OQ-06).                                                    |
| NFR-08         | Dạng trình bày giải thích mà giáo viên chấp nhận               | Thử nghiệm với giáo viên                            | Định hướng: chuỗi lập luận ngắn, theo dõi được từng bước, dùng ngôn ngữ chuyên môn của giáo viên. Chưa có mẫu được kiểm chứng                                                                                                                                                                                                                                                                                                                     |
| NFR-11         | Mức độ dễ sử dụng đạt yêu cầu                                  | Thử nghiệm với giáo viên chưa từng tiếp xúc         | ✅ Tách thành 2 mốc (bản 1.4), không còn tự mâu thuẫn: (1) **ngưỡng lần đầu** — giáo viên chưa từng tiếp xúc phải tự tạo ra được một kết quả đúng trong lần làm quen đầu tiên: cùng một phiên sử dụng, không quá 30 phút. (2) **thời gian đạt thành thạo** — dùng trôi chảy không cần tra cứu lại: khoảng 1–2 ngày sử dụng thực tế (không phải 1–2 ngày đào tạo). Cả hai là giá trị sơ bộ [A], chờ thử nghiệm với giáo viên chưa từng tiếp xúc. |
| NFR-14, NFR-19 | Cấu hình thiết bị tối thiểu và dung lượng chiếm dụng           | Khảo sát thiết bị (OQ-07)                           | Đội thử trên máy tính xách tay Core i5-8250U / 8 GB RAM / SSD 128 GB. Đây là **cấu hình máy của đội phát triển**, không phải cấu hình mục tiêu — CO-T-02 yêu cầu kiểm thử trên thiết bị thật tại địa bàn. Cấu hình tối thiểu vẫn **TBD** cho tới khi có kết quả OQ-07                                                                                                                                                                             |
| NFR-17         | Ngưỡng khối lượng thẩm định khả thi                            | Đo năng suất (OQ-05)                                | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| NFR-20, AIR-20 | Ngưỡng chênh lệch chất lượng chấp nhận được giữa các nhóm      | Phân tích khi có dữ liệu thật                       | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| AIR-14         | Thang biểu đạt mức tin cậy                                     | Thử nghiệm với giáo viên                            | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| AIR-16         | Dải tỷ lệ từ chối kết luận chấp nhận được                      | Dữ liệu thật kết hợp ngưỡng chịu đựng của người học | Pilot: tới 40–50%. Giai đoạn ổn định: khoảng 10% — Mục 19.2                                                                                                                                                                                                                                                                                                                                                                                       |
| AIR-19         | Ngưỡng cảnh báo suy giảm chất lượng                            | Dữ liệu nền từ thử nghiệm                           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| BR-02          | Mức tin cậy yêu cầu để kết luận                                | Hiệu chỉnh trên dữ liệu thật                        | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| BR-07          | Ngưỡng xác định lỗ hổng phạm vi cả lớp                         | Hiệu chỉnh trên dữ liệu thật                        | 30% sĩ số, sàn 3 học sinh — chốt tạm tại Mục 19.3                                                                                                                                                                                                                                                                                                                                                                                                 |
| BR-08          | Công thức xác định thứ tự ưu tiên                              | Kiểm chứng trên thực tế sử dụng                     | Số người học × số kỹ năng phía sau bị chặn, kèm tie-break — Mục 19.4                                                                                                                                                                                                                                                                                                                                                                              |
| BR-11          | Tỷ lệ thời lượng giữa nội dung hỗ trợ và nội dung lớp hiện tại | Thử nghiệm thực địa                                 | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| FR-11          | Số nhóm can thiệp tối đa                                       | Quan sát năng lực tổ chức lớp (AS-09)               | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| FR-13          | Giới hạn độ dài phương án hỗ trợ                               | Quan sát khả năng theo đuổi của người học           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| FR-24          | Khoảng thời gian không lặp lại phép đo                         | Đo trong thử nghiệm                                 | —                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| EC-08          | Số vòng lặp tối đa trước khi chuyển bắt buộc cho giáo viên     | Thử nghiệm thực địa                                 | 3 vòng; ngưỡng chưa đạt = dưới 70% — chốt tạm tại Mục 19.5                                                                                                                                                                                                                                                                                                                                                                                        |

## 17.3. Requirement còn thiếu tiêu chí chấp nhận

| **ID** | **Lý do chưa có**                                  | **Điều kiện bổ sung**                  |
|--------|----------------------------------------------------|----------------------------------------|
| NFR-17 | Chưa đo được năng suất thẩm định                   | Sau hành động 6 tại Mục 15.4           |
| DR-11  | Chưa có dữ liệu hai bối cảnh để so sánh độ tin cậy | Sau khi có dữ liệu thử nghiệm thực địa |

## 17.4. Mâu thuẫn chưa được giải quyết

| **ID** | **Nội dung**                                                            | **Người quyết định**                                                                        |
|--------|-------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| M-01   | Dữ liệu ở lại cơ sở giáo dục ↔ kiểm chứng độc lập ↔ báo cáo cấp quản lý | Ban giám hiệu + đơn vị đánh giá độc lập — đã chốt tại Mục 19.6, còn chờ xác nhận chính thức |
| M-02   | Yêu cầu thẩm định toàn bộ nội dung ↔ yêu cầu kho phép đo đủ lớn         | Tổ chuyên môn + đội phát triển                                                              |

## 17.5. Quy tắc nghiệp vụ đang ở trạng thái kinh nghiệm

| **ID** | **Nội dung**                   | **Cần làm**                                                                                |
|--------|--------------------------------|--------------------------------------------------------------------------------------------|
| BR-07  | Ngưỡng xác định lỗ hổng cả lớp | Hiệu chỉnh trên dữ liệu thật; **nêu rõ tình trạng heuristic trong mọi tài liệu đối ngoại** |
| BR-08  | Công thức thứ tự ưu tiên       | Như trên                                                                                   |

## 17.6. Quyết định chưa được chốt

| **Nhóm**                | **Nội dung**                | **Điều kiện chốt**     |
|-------------------------|-----------------------------|------------------------|
| Cơ chế suy luận         | SC-01 hay SC-02 hay kết hợp | Kết quả SC-12 và AS-04 |
| Vận hành không kết nối  | SC-05 hay SC-06             | AS-29, AS-30, AS-31    |
| Trình bày cho giáo viên | SC-07 hay SC-08             | AS-23, AS-12           |
| Chuẩn bị nội dung       | SC-09 + SC-10 hay SC-11     | AS-48, AS-54           |

## 17.7. Khoảng hở về truy vết phát hiện ở vòng rà soát 1.1

### 17.7.1. Stakeholder Need chưa có requirement

| **ID**      | **Need**                                      | **Tình trạng**                                                                              | **Cần quyết định**                                                                                                                  |
|-------------|-----------------------------------------------|---------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| **SN-S-05** | Người học nhìn thấy được tiến bộ của bản thân | Không có FR, NFR, DR hay AIR nào phủ. Liên quan gián tiếp tới BO-04 và RK-04 (mất động lực) | Bổ sung một requirement về phản hồi tiến bộ cho người học, **hoặc** đưa vào Out of Scope kèm lý do. Không được để ở trạng thái lửng |

### 17.7.2. Requirement không xuất hiện trong cột Req ID của Mục 10

Nội dung của phần lớn các requirement dưới đây **được phủ gián tiếp** qua một tiêu chí chấp nhận khác, nhưng do không được ghi ID nên không truy vết tự động được. Cần bổ sung tham chiếu chéo, hoặc bổ sung tiêu chí riêng.

| **Nhóm**       | **ID**                                                                                         | **Ghi chú**                                                                                                                                |
|----------------|------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| Functional     | FR-01, FR-02, FR-05, FR-10, FR-19                                                              | FR-01 và FR-02 là điều kiện đầu vào của AC-001 → AC-007 nhưng không được nêu tên                                                           |
| Non-functional | NFR-02, NFR-06, NFR-07, NFR-09, NFR-11, NFR-12, NFR-13, NFR-15, NFR-16, NFR-17, NFR-19, NFR-20 | NFR-07 phủ bởi AC-018; NFR-09 phủ bởi AC-028; NFR-12 phủ bởi AC-030 — cả ba chỉ ghi ID của FR hoặc BR tương ứng                            |
| Data           | DR-01, DR-02, DR-03, DR-04, DR-05, DR-06, DR-07, DR-11                                         | DR-07 phủ bởi AC-034; DR-08 đã được nêu tên tại AC-033                                                                                     |
| AI             | AIR-01 → AIR-06, AIR-08 → AIR-12, AIR-16, AIR-17, AIR-18, AIR-20, AIR-21, AIR-22               | AIR-08, AIR-09, AIR-11, AIR-12 là ranh giới cấm — kiểm chứng bằng rà soát chính sách, nên cần ghi rõ hình thức kiểm chứng thay vì để trống |

### 17.7.3. Assumption chưa được gắn nhãn nhóm hệ quả

Bảng 5.3.8 nêu ba con số — 12 assumption làm mất lý do tồn tại, 27 buộc thiết kế lại kiến trúc, 31 đóng được không cần viết mã — nhưng các bảng 5.3.1 → 5.3.7 **không có cột phân loại tương ứng**, nên ba con số này không kiểm chứng lại được từ tài liệu.

**Cần làm:** bổ sung một cột *Nhóm hệ quả* vào các bảng assumption, hoặc hạ ba con số xuống mức ước lượng có ghi nhãn **[A]** — hiện đang áp dụng cách thứ hai.

---

# 18. PHỤ LỤC

## Phụ lục A — Thuật ngữ

| **Thuật ngữ**               | **Giải thích**                                                                                                                  |
|-----------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| **Mixed-ability classroom** | Lớp học đa trình độ — lớp có người học cùng khối nhưng mức nắm vững kiến thức nền chênh lệch đáng kể                            |
| **Root cause**              | Nguyên nhân gốc — kiến thức nền chưa vững dẫn tới lỗi ở nội dung hiện tại                                                       |
| **Prerequisite**            | Kiến thức tiên quyết — nội dung cần nắm trước khi học nội dung phụ thuộc vào nó                                                 |
| **Abstention**              | Từ chối kết luận — hành vi hệ thống chủ động không đưa ra kết luận khi bằng chứng chưa đủ                                       |
| **Held-out check**          | Phép đo xác nhận độc lập — dùng nội dung khác với nội dung đã luyện tập                                                         |
| **Ground truth**            | Chuẩn đối chiếu — kết luận đúng dùng để đánh giá kết luận của hệ thống                                                          |
| **Expert agreement**        | Mức đồng thuận giữa các chuyên gia khi đánh giá độc lập cùng một đối tượng                                                      |
| **Self-consistency check**  | Kiểm tra tính nhất quán nội bộ — xác nhận phần mềm vận hành đúng thiết kế, **không** phải kiểm chứng tính đúng đắn của thiết kế |
| **Circular validation**     | Kiểm chứng vòng tròn — đánh giá hệ thống trên dữ liệu sinh ra từ chính giả định mà hệ thống sử dụng                             |
| **Override**                | Bác bỏ — hành động giáo viên thay thế kết luận của hệ thống bằng quyết định của mình                                            |
| **Remediation trap**        | Vòng lặp hỗ trợ — tình trạng người học yếu bị giữ trong nội dung bù kéo dài và tụt xa thêm                                      |
| **Onion diagram**           | Sơ đồ phân lớp các bên liên quan theo khoảng cách tới hệ thống                                                                  |
| **Salience model**          | Mô hình phân loại các bên liên quan theo ba thuộc tính: quyền lực, tính chính đáng, tính cấp thiết                              |
| **RACI**                    | Ma trận trách nhiệm: Thực hiện — Chịu trách nhiệm cuối — Tham vấn — Thông báo                                                   |
| **MoSCoW**                  | Phương pháp phân mức ưu tiên: Must — Should — Could — Later                                                                     |
| **T0 → T3**                 | Bốn tầng điều kiện kết nối, từ không có kết nối tới kết nối ổn định                                                             |
| **L0 → L3**                 | Bốn bậc chức năng tương ứng với bốn tầng kết nối                                                                                |

## Phụ lục B — Tài liệu tham chiếu

| **#** | **Tài liệu**                                             | **Vai trò**                                            |
|--------|----------------------------------------------------------|--------------------------------------------------------|
| 1      | Tài liệu logic nghiệp vụ VerveAI                        | Nguồn mô tả bài toán và bản thiết kế ban đầu           |
| 2      | Đề bài *Adaptive tutor for the mixed-ability classroom*  | Nguồn phạm vi bài toán                                 |
| 3      | Chương trình Giáo dục phổ thông 2018                     | Ràng buộc nội dung                                     |
| 4      | Văn bản pháp luật về bảo vệ dữ liệu cá nhân và về trẻ em | Ràng buộc pháp lý — **cần rà soát điều khoản áp dụng** |
| 5      | Luật Sở hữu trí tuệ                                      | Ràng buộc bản quyền học liệu — **cần rà soát**         |
| 6      | Điều lệ trường trung học cơ sở                           | Ràng buộc về sĩ số, thời lượng, tổ chức dạy học        |

> **Lưu ý:** các văn bản pháp luật nêu tại mục 4 và 5 là **điểm khởi đầu tra cứu**, không phải kết luận pháp lý. Cần người có chuyên môn xác định điều khoản áp dụng cụ thể.

## Phụ lục C — Lịch sử thay đổi

| **Phiên bản** | **Ngày**   | **Nội dung thay đổi**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|---------------|------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.0           | 16/08/2026 | Bản đầu tiên.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 1.1           | 22/08/2026 | Rà soát nhất quán nội bộ. Sửa bốn số liệu tổng kết sai: số Stakeholder Need, số tiêu chí chấp nhận ở trạng thái TBD, số metric, và số assumption chịu lực đóng được trong một buổi làm việc. Đồng bộ mức ưu tiên của FR-04, FR-06 và FR-09 giữa Mục 6.3 và Mục 15.1. Bổ sung Mục 17.7 về khoảng hở truy vết.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| 1.2           | 22/08/2026 | Bổ sung Phụ lục E — Quyết định vòng 1. Các quyết định trong phụ lục chưa được hợp nhất vào thân tài liệu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 1.3           | 22/08/2026 | Hợp nhất Phụ lục E vào thân tài liệu theo bảng đề xuất tại Mục 19.10: ngưỡng BR-07, tie-break BR-08, tiêu chí EC-08, trạng thái quyết định của SC-01, SC-05, SC-07, SC-09 và SC-10, cùng các giá trị đã chốt tại Mục 17.2 và 17.4. Sửa các mâu thuẫn nội bộ G1 tới G8 — xem Phụ lục G mục G.1: mức ưu tiên của SR-15, DR-06, DR-09, NFR-14 và NFR-20; câu kết Mục 14.3. Bổ sung hướng AI local: AIR-24, AIR-25, AIR-26; thu hẹp phạm vi NFR-06; mở rộng DR-07; thêm CO-T-09, CO-T-10, CO-I-07, CO-L-08. Đánh lại Phụ lục E thành Mục 19 và sửa bậc heading của 19.6, 19.7, 19.8, 19.10. Thêm Phụ lục C, Phụ lục F — Tech stack dự kiến, Phụ lục G — Kiến trúc AI local và bổ sung yêu cầu vòng 2, Phụ lục H — Quy trình TO-BE. |
| 1.4           | 22/08/2026 | Đóng nốt hai mâu thuẫn còn mở tại Phụ lục G mục G.1: G9 — thêm Lưu ý 3 tại Mục 2.4.1 và bảng RACI vận hành mới tại Mục 2.4.2, quy định ai cập nhật nội dung mỗi học kỳ, ai xử lý báo lỗi, ai nâng cấp mô hình tại cơ sở không có nhân sự kỹ thuật; G10 — tách 3 giá trị sơ bộ tại Mục 17.2 (NFR-02, NFR-05, NFR-11) thành ngưỡng kép, không còn tự mâu thuẫn với yêu cầu gốc. Cả hai vẫn là giá trị sơ bộ [A], chờ đo thực tế.                                                                                                                                                                                                                                                                                               |
| 1.4.1         | 03/09/2026 | Cập nhật Phụ lục F (Tech Stack): ưu tiên xây dựng **web-app (PWA)** trước để kiểm chứng nhanh MVP; Flutter chuyển sang giai đoạn sau khi có thời gian. Điều chỉnh TS-01, TS-02, TS-08, TS-17/18, F.4 và F.7 tương ứng. Nội dung nghiệp vụ giữ nguyên theo bản 1.4. |
| 1.4.2         | 03/09/2026 | Tinh chỉnh ưu tiên: **Frontend = Next.js / React trước**; Backend + full web-app (PWA offline) làm sau; Flutter giai đoạn sau nữa. Cập nhật TS-01, TS-02, TS-17/17b, F.4, F.7 và ghi chú đầu Phụ lục F. |
| 1.4.3         | 03/09/2026 | Bổ sung rõ **Backend = Node.js**. Thứ tự: Frontend (Next.js/React) → Backend (Node.js) → Full PWA offline → Flutter. Cập nhật TS-01, TS-02, TS-08, TS-17a, F.4, F.7 và ghi chú đầu Phụ lục F. |
| 1.4.4         | 03/09/2026 | Đổi tên dự án từ **NekoPath** sang **VerveAI**; đơn vị từ Team Neko Core sang **Team Verve Core**. Cập nhật ưu tiên phát triển: `web-portal/` (Next.js) ưu tiên cao nhất, `app/` (Flutter PWA) làm sau. Nội dung nghiệp vụ giữ nguyên. |
| 1.4.5         | 03/09/2026 | Đổi tên folder/brand từ **ioes_verveai_2026** sang **leaps_verveai_2026** (LEAPS = Local Educational Adaptive Personalization System); Team Verve Core giữ nguyên. Tên app **Verve** và tên mã nguồn **VerveAI** không thay đổi. |




## Phụ lục D — Phê duyệt

| **Vai trò**                  | **Họ tên** | **Trách nhiệm phê duyệt**                   | **Ngày** | **Chữ ký** |
|------------------------------|------------|---------------------------------------------|----------|------------|
| Chủ nhiệm đề tài             |            | Toàn bộ tài liệu                            |          |            |
| Đại diện chuyên môn giáo dục |            | Mục 3, 4, 8 và các quy tắc bảo vệ người học |          |            |
| Đại diện cơ sở giáo dục      |            | Mục 5.4, 5.5 và kế hoạch triển khai         |          |            |
| Phụ trách kỹ thuật           |            | Mục 6.4, 6.5, 6.6, 14                       |          |            |

---

# 19. PHỤ LỤC E — QUYẾT ĐỊNH VÒNG 1

*Ghi lại các quyết định thu được từ buổi làm việc nhóm nhằm đóng các mục ở Mục 17 (BA Open Items). Toàn bộ quyết định trong phụ lục này mang nhãn [A] — quyết định nội bộ nhóm, chưa qua hiệu chỉnh trên dữ liệu thật hoặc xác nhận độc lập với giáo viên/chuyên gia, trừ khi ghi chú khác. Với các câu hỏi mà đội chưa có câu trả lời trực tiếp, đội BA đề xuất một quyết định tạm thời hợp lý (đánh dấu rõ "đề xuất") để không chặn tiến độ, kèm điều kiện xác nhận lại.*

## 19.1. BR-01 / BR-02 — Nguyên tắc ưu tiên khi có rủi ro sai

| **Trường** | **Nội dung**                                                                                                                                                               |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Quyết định | Bỏ sót (false negative) chấp nhận được hơn báo sai (false positive). Báo sai root cause gây thiệt hại lớn hơn cho học sinh.                                                |
| Tác động   | Củng cố trực tiếp nguyên tắc abstention đã có ở BR-01: khi chưa đủ tin cậy, hệ thống phải nghiêng về không kết luận thay vì kết luận liều.                                 |
| Trạng thái | ĐÃ CHỐT [A] về định hướng. Mức tin cậy tối thiểu bằng số cụ thể (ngưỡng confidence của BR-02) vẫn TBD, cần hiệu chỉnh trên dữ liệu thật — không đổi so với tài liệu gốc. |

## 19.2. Chỉ số tỷ lệ "cần thêm bằng chứng" (PROBE NEEDED) — theo giai đoạn

| **Trường** | **Nội dung**                                                                                                                                         |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| Quyết định | Chia theo giai đoạn. Giai đoạn pilot: chấp nhận tới 40–50%. Giai đoạn ổn định (sau một thời gian vận hành): mục tiêu giảm còn khoảng 10%.            |
| Ghi chú    | Đây là một chỉ số (metric) nên đưa vào Mục 13.4 Diagnostic/AI Metrics dưới dạng target theo giai đoạn, không phải ngưỡng cứng trong logic chẩn đoán. |
| Trạng thái | ĐÃ CHỐT [A] — target 2 giai đoạn, đối chiếu lại sau khi có dữ liệu pilot thật.                                                                     |

## 19.3. BR-07 — Ngưỡng lỗ hổng cả lớp (class-wide gap)

| **Trường**                | **Nội dung**                                                                                                                                                                                                                                                                                                                            |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Quyết định cuối           | Ngưỡng chính thức = 30% sĩ số lớp (làm tròn xuống). Với lớp 40 học sinh → 12 học sinh.                                                                                                                                                                                                                                                  |
| Xử lý mâu thuẫn           | Đội nêu hai con số khác nhau ở vòng hỏi trước (30% và ~10 học sinh cho lớp 40). Vì đội xác nhận rõ "chốt mốc 30%" khi được hỏi trực tiếp về việc có nên tính theo % hay không, phần BA lấy 30% làm ngưỡng chính thức; con số 10 học sinh được xem là ước lượng nhanh ban đầu, nay được thay bằng 12 học sinh theo công thức chính thức. |
| Sàn tối thiểu cho lớp nhỏ | Bổ sung: giữ sàn tối thiểu tuyệt đối là 3 học sinh. Với lớp dưới 10 học sinh, nếu 30% làm tròn xuống dưới 3, vẫn dùng mốc 3 học sinh để tránh gắn nhãn "lỗ hổng cả lớp" chỉ vì 1–2 học sinh.                                                                                                                                            |
| Trạng thái                | ĐÃ CHỐT [A] — cần giáo viên xác nhận lại một lần nữa trong buổi đối chiếu (Action #1) trước khi đưa vào bản phát hành chính thức.                                                                                                                                                                                                    |

## 19.4. BR-08 — Công thức ưu tiên nhóm can thiệp

| **Trường**                               | **Nội dung**                                                                                                                                                                                                                                                                                                            |
|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Xác nhận định hướng                      | Giáo viên ưu tiên theo mức độ ảnh hưởng tới nhiều người hơn — xác nhận đúng hướng công thức gốc (số học sinh × số kỹ năng downstream bị chặn).                                                                                                                                                                          |
| Quy tắc tie-break (đề xuất, đã chốt tạm) | Khi hai nhóm có priority bằng nhau (hoặc chênh lệch không đáng kể): (1) ưu tiên root cause nào đạt trạng thái DIAGNOSED (đủ bằng chứng) sớm nhất; (2) nếu vẫn bằng, ưu tiên root cause nằm gần đầu chuỗi phụ thuộc kiến thức hơn (kiến thức nền tảng hơn), vì xử lý trước sẽ mở khoá được nhiều hướng học phía sau hơn. |
| Trạng thái                               | Định hướng công thức: ĐÃ CHỐT. Tie-break: ĐÃ CHỐT TẠM [A] — cần giáo viên xác nhận có hợp lý không trong buổi đối chiếu.                                                                                                                                                                                              |

## 19.5. EC-08 — Vòng lặp hỗ trợ tối đa

| **Trường**                                 | **Nội dung**                                                                                                                                                                    |
|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Số lần lặp tối đa                          | 3 lần — ĐÃ CHỐT.                                                                                                                                                                |
| Tiêu chí "chưa đạt" (đề xuất, đã chốt tạm) | Học sinh trả lời đúng dưới 70% số câu trong bài Held-out Check của bước đó thì tính là "chưa đạt".                                                                              |
| Trạng thái                                 | ĐÃ CHỐT TẠM [A] — mốc 70% là giá trị mặc định hợp lý dựa trên thông lệ đánh giá thành thạo phổ biến (mastery threshold 70–80%); cần hiệu chỉnh sau khi có dữ liệu pilot thật. |

## 19.6. Mâu thuẫn dữ liệu (M-01)

| **Trường**                                                              | **Nội dung**                                                                                                                                                                                                                                                                                                                                                                                                |
|-------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Thẩm quyền dữ liệu                                                      | Ban giám hiệu quyết định; dữ liệu chỉ được đưa ra ngoài cơ sở giáo dục khi có quyết định của ban giám hiệu, và chỉ được phép chuyển cho các cơ quan liên quan. ĐÃ CHỐT.                                                                                                                                                                                                                                     |
| Báo cáo cấp quản lý (Phòng/Sở)                                          | Hoãn — không bắt buộc trong pilot đầu tiên. ĐÃ CHỐT.                                                                                                                                                                                                                                                                                                                                                        |
| Mức chi tiết dữ liệu cho đơn vị đánh giá độc lập (đề xuất, đã chốt tạm) | Đơn vị đánh giá độc lập (ĐH Sư phạm) chỉ cần dữ liệu đã tổng hợp/ẩn danh (ví dụ: "12/40 HS thuộc nhóm root K02"), không cần dữ liệu cấp cá nhân. Lý do: mục đích đánh giá độc lập là kiểm chứng phương pháp và hiệu quả tổng thể, không phải đánh giá từng học sinh cụ thể — không đòi hỏi dữ liệu định danh. Quyết định này ưu tiên đúng theo ràng buộc đã có NFR-10/DR-08 (dữ liệu ở lại cơ sở giáo dục). |
| Nơi thực hiện ẩn danh hoá (đề xuất, đã chốt tạm)                        | Ẩn danh hoá thực hiện ngay tại điểm trung tâm cục bộ trong trường (theo SC-05 — điểm trung tâm do giáo viên vận hành), trước khi bất kỳ dữ liệu nào rời khỏi cơ sở giáo dục. Không có bước dữ liệu rời trường ở dạng còn định danh.                                                                                                                                                                         |
| Trạng thái                                                              | ĐÃ CHỐT [A] toàn bộ M-01 — 2 mục đầu là quyết định chính thức của ban giám hiệu; 2 mục sau là đề xuất của đội BA dựa trên ràng buộc đã có, cần Ban giám hiệu và ĐH Sư phạm xác nhận chính thức trước khi đưa vào văn bản đề nghị triển khai (Action #2, Mục 15.4).                                                                                                                                       |

## 19.7. Solution Candidates

## 19.7.1. SC-01 vs SC-02 — Cơ chế suy luận

| **Trường**                                           | **Nội dung**                                                                                                                                                                                                                                                                                                                                                                                                                        |
|------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Quyết định                                           | Dùng SC-01 (biểu diễn tri thức dưới dạng quan hệ phụ thuộc tường minh) cho giai đoạn pilot.                                                                                                                                                                                                                                                                                                                                         |
| Điều kiện chuyển sang SC-02 (cụ thể hoá từ Mục 14.3) | Tài liệu gốc đã quy định điều kiện chốt là sau khi có kết quả SC-12 (kiểm định quan hệ phụ thuộc bằng dữ liệu thật) và AS-04 (số nguyên nhân đồng thời). Cụ thể hoá: nếu SC-12 cho thấy tỷ lệ học sinh có từ 2 nguyên nhân gốc đồng thời trở lên vượt một ngưỡng đáng kể (ví dụ trên 20% số trường hợp DIAGNOSED) mà SC-01 (chọn một root tốt nhất) xử lý kém các trường hợp này, thì đánh giá chuyển sang hoặc kết hợp thêm SC-02. |
| Trạng thái                                           | ĐÃ CHỐT TẠM [A] theo đúng nguyên tắc Mục 14.3 — không phải Architecture Decision cuối cùng.                                                                                                                                                                                                                                                                                                                                       |

## 19.7.2. SC-05 vs SC-06 — Vận hành offline

| **Trường**                | **Nội dung**                                                                                                                                                                                                                                                                         |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Quyết định                | Chọn SC-05 (tập hợp dữ liệu lớp qua một điểm trung tâm cục bộ do giáo viên vận hành) làm phương án chính; giữ SC-06 (trao đổi qua phương tiện lưu trữ vật lý) đúng vai trò phương án dự phòng như đã định nghĩa ở Mục 14.1, dùng khi không có phương án kết nối cục bộ nào khả dụng. |
| Đánh đổi đã ghi nhận      | SC-05 khó triển khai hơn SC-06 nhưng bền vững hơn về lâu dài. Team chấp nhận MVP chậm hơn để tránh viết lại kiến trúc sau này.                                                                                                                                                       |
| Ràng buộc hạ tầng mới     | SC-05 cần một thiết bị (máy tính) do giáo viên vận hành đóng vai trò điểm trung tâm cục bộ. Cần bổ sung vào Mục 5.4.4 Infrastructure Constraint, và đối chiếu với NFR-14/NFR-19 (cấu hình thiết bị tối thiểu, hiện đang TBD).                                                        |
| Rủi ro bổ sung vào Mục 12 | Rủi ro tiến độ MVP do lựa chọn kiến trúc offline phức tạp hơn phương án còn lại — nên có phương án dự phòng (fallback sang SC-06) nếu SC-05 không kịp trong khung thời gian pilot.                                                                                                   |
| Trạng thái                | ĐÃ CHỐT TẠM [A] — kèm 2 việc cần bổ sung vào tài liệu gốc (constraint hạ tầng, rủi ro tiến độ).                                                                                                                                                                                    |

## 19.7.3. SC-07 vs SC-08 — Trình bày cho giáo viên

| **Trường**                        | **Nội dung**                                                                                                                                                                                                                                                                                                                                 |
|-----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Quyết định (đề xuất, đã chốt tạm) | Mặc định dùng SC-07 (hỗ trợ ra quyết định dưới dạng thông tin tổng hợp theo nhóm nguyên nhân) cho pilot. Lý do: toàn bộ thiết kế Teacher View đã có trong tài liệu (UC-009, UC-010, UC-011 — xem evidence, quick check, override) đều giả định một trải nghiệm tương tác trên thiết bị, khớp với SC-07 chứ không phải bản in tĩnh của SC-08. |
| Điều kiện chuyển sang SC-08       | Giữ đúng điều kiện đã có ở Mục 14.3: chuyển sang SC-08 nếu khảo sát hạ tầng (Action #3, đóng AS-23) cho thấy nội quy thiết bị tại trường không cho phép dùng công cụ số trong lớp học.                                                                                                                                                      |
| Trạng thái                        | ĐÃ CHỐT TẠM [A] — team đã bỏ qua câu hỏi này ở vòng trước; đội BA đề xuất phương án trên để không chặn tiến độ code Teacher View. Vẫn nên xác nhận lại với giáo viên tại buổi đối chiếu (Action #1).                                                                                                                                      |

## 19.7.4. SC-09+10 vs SC-11 — Chuẩn bị nội dung

| **Trường**              | **Nội dung**                                                                                                                                                                                            |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Quyết định              | Chốt tạm dùng SC-09 + SC-10 (chuẩn bị nội dung bằng công cụ hỗ trợ tự động, kèm kiểm chứng và thẩm định trước khi phát hành).                                                                           |
| Điều kiện xác nhận cuối | Phụ thuộc kết quả đo năng suất thẩm định thực tế của tổ chuyên môn (Action #6, Mục 15.4). Nếu năng suất không đủ cho phạm vi 1 học kỳ, cần xem lại, có thể quay về SC-11 (biên soạn thủ công toàn bộ). |
| Trạng thái              | ĐÃ CHỐT TẠM [A], có điều kiện xác nhận rõ ràng — đúng chuẩn quyết định tạm thời của Mục 14.3.                                                                                                         |

## 19.8. SN-S-05 — Học sinh xem tiến bộ của bản thân

| **Trường**                      | **Nội dung**                                                                                                                                                                                                                                                                          |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Có bắt buộc cho pilot đầu tiên? | Bắt buộc — không đưa vào Out of Scope của MVP.                                                                                                                                                                                                                                        |
| Học sinh nên thấy gì?           | Dạng đơn giản: số sao, phần trăm hoàn thành, phần thưởng (gamification), và các kỹ năng cần luyện thêm.                                                                                                                                                                               |
| Diễn đạt phải tuân theo BR-13   | Cụm "điểm yếu ở đâu" cần diễn đạt lại theo hướng kỹ năng cần luyện thêm (ví dụ: "Con cần luyện thêm: Phân số tương đương"), không dùng khung "yếu / kém / dưới trung bình" — để không vi phạm BR-13 (không dùng nhãn năng lực hoặc nhãn cấp lớp khi hiển thị cho học sinh/phụ huynh). |
| Gamification là phạm vi mới     | "Phần thưởng" chưa từng xuất hiện trong Stakeholder Need gốc (Mục 2.2.2) hay Business Objectives (Mục 1.4). Cần thêm 1 Stakeholder Need mới trước khi viết Functional Requirement chính thức, để giữ đúng nguyên tắc mọi requirement phải truy vết được về nhu cầu (Mục 6.0).         |
| Use Case & Acceptance Criteria  | Cần bổ sung UC-020 (đề xuất) — Học sinh xem tiến bộ của bản thân, kèm Main Flow và Acceptance Criteria, tham chiếu BR-13. Cũng cần thêm một dòng vào Mục 15.3.2 (MVP Scope) vì mục này hiện chưa liệt kê tính năng xem tiến bộ cho học sinh, dù nay đã là bắt buộc.                   |
| Trạng thái                      | ĐÃ CHỐT phạm vi và nội dung hiển thị. Use Case/Acceptance Criteria: cần viết trước khi code — xem đề xuất UC-020 tại Mục 19.9 bên dưới.                                                                                                                                               |

## 19.9. UC-020 (đề xuất) — Học sinh xem tiến bộ của bản thân

| **Mục**                | **Nội dung**                                                                                                                                                                                                                                                                   |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Use Case ID            | UC-020                                                                                                                                                                                                                                                                         |
| Name                   | Học sinh xem tiến bộ của bản thân                                                                                                                                                                                                                                              |
| Goal                   | Giúp học sinh nhìn thấy tiến bộ của chính mình để duy trì động lực, mà không dùng nhãn năng lực hay so sánh với người khác                                                                                                                                                     |
| Actor                  | ACT-S (chính)                                                                                                                                                                                                                                                                  |
| Trigger                | Học sinh mở màn hình tiến bộ cá nhân, hoặc sau khi hoàn thành một Held-out Check                                                                                                                                                                                               |
| Preconditions          | Học sinh đã có ít nhất một sự kiện (event) được ghi nhận                                                                                                                                                                                                                       |
| Main Flow              | 1. Học sinh mở màn hình tiến bộ cá nhân. 2. Hệ thống tổng hợp: số sao/điểm tích luỹ, phần trăm hoàn thành lộ trình hiện tại, danh sách kỹ năng cần luyện thêm (diễn đạt theo BR-13). 3. Hệ thống hiển thị, không kèm nhãn năng lực hay xếp hạng so với học sinh khác (BR-19). |
| Exception Flow         | EF-1: chưa có đủ sự kiện để tổng hợp — hiển thị trạng thái "mới bắt đầu", không suy diễn tiến bộ từ dữ liệu rỗng.                                                                                                                                                              |
| Postconditions         | Học sinh thấy được tiến bộ của mình; không có dữ liệu học sinh khác bị lộ (đối chiếu EC-15, BR-19)                                                                                                                                                                             |
| Related Requirements   | SN-S-05 (cần bổ sung Stakeholder Need cho gamification trước khi viết FR chính thức)                                                                                                                                                                                           |
| Related Business Rules | BR-13, BR-19                                                                                                                                                                                                                                                                   |
| Trạng thái             | ĐỀ XUẤT — cần đội BA/kỹ thuật rà lại và gán ID Functional Requirement chính thức trước khi đưa vào Mục 7 của tài liệu chính.                                                                                                                                                   |

## 19.10. Cập nhật đề xuất vào các mục khác của tài liệu

Bảng dưới đây tổng hợp toàn bộ thay đổi nên đưa vào thân tài liệu ở lần cập nhật tiếp theo (v1.2), để giữ tính nhất quán giữa Phụ lục E và các mục gốc:

| **Mục trong tài liệu gốc**               | **Thay đổi đề xuất**                                                                                                                                                                                                                         |
|------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Mục 5.4.4 — Infrastructure Constraint    | Thêm ràng buộc: cần một thiết bị (máy tính) do giáo viên vận hành đóng vai trò điểm trung tâm cục bộ, phát sinh từ quyết định chọn SC-05.                                                                                                    |
| Mục 5.4.6 — Privacy/Legal Constraint     | Bổ sung: thẩm quyền cho phép dữ liệu rời khỏi cơ sở giáo dục thuộc về ban giám hiệu; chỉ chuyển cho cơ quan liên quan; dữ liệu cho đơn vị đánh giá độc lập ở dạng tổng hợp/ẩn danh, ẩn danh hoá ngay tại điểm trung tâm cục bộ trong trường. |
| Mục 8.1 — Business Rules (chẩn đoán)     | BR-07: cập nhật ngưỡng chính thức 30% sĩ số (tối thiểu 3 học sinh). BR-08: bổ sung quy tắc tie-break. Đổi trạng thái từ "Heuristic — ngưỡng TBD" sang "Heuristic — đã có giá trị tạm, chờ hiệu chỉnh".                                       |
| Mục 9 — Edge Cases                       | EC-08: bổ sung tiêu chí "chưa đạt" = dưới 70% số câu đúng trong Held-out Check.                                                                                                                                                              |
| Mục 12 — Risk Analysis                   | Thêm rủi ro: tiến độ MVP có thể chậm do lựa chọn kiến trúc offline (SC-05) phức tạp hơn phương án còn lại.                                                                                                                                   |
| Mục 13.4 — Diagnostic/AI Metrics         | Thêm target theo giai đoạn cho tỷ lệ PROBE NEEDED: giai đoạn pilot ≤50%, giai đoạn ổn định ~10%.                                                                                                                                             |
| Mục 15.3.2 — MVP Scope                   | Thêm dòng: tính năng học sinh xem tiến bộ bản thân (SN-S-05, UC-020) — bắt buộc có trong MVP.                                                                                                                                                |
| Mục 2.2.2 — Stakeholder Needs (Học sinh) | Thêm Stakeholder Need mới cho yếu tố phần thưởng/gamification.                                                                                                                                                                               |
| Mục 7 — User Stories & Use Cases         | Thêm UC-020 chính thức theo nội dung đề xuất ở Mục 19.9 của phụ lục này.                                                                                                                                                                     |
| Mục 14.1 / 14.3 — Solution Candidates    | Cập nhật Decision Status: SC-01, SC-05, SC-07, SC-09+SC-10 chuyển từ "Under Evaluation" sang "Chọn tạm cho pilot — provisional", kèm điều kiện chốt cuối cùng như đã nêu ở Mục 19.7.                                                         |
| Mục 17 — BA Open Items                   | Đóng các dòng liên quan BR-07, BR-08, EC-08, M-01 (thẩm quyền + phạm vi báo cáo), SC-01/02, SC-05/06, SC-07/08, SC-09-11, SN-S-05 — tham chiếu chéo về Phụ lục E.                                                                            |

*Nguồn: VerveAI — VAIC 2026 Education, team Verve Core · Phụ lục E, quyết định vòng 1, cập nhật 22/08/2026*

---

# PHỤ LỤC F — TECH STACK DỰ KIẾN

Toàn bộ phụ lục này mang nhãn [A] — dự kiến, trạng thái "Chọn tạm cho pilot". Đây không phải Architecture Decision cuối cùng theo nghĩa Mục 14.3. Mỗi lựa chọn kèm điều kiện lật. Mã định danh dùng tiền tố TS.

> **Cập nhật ưu tiên triển khai (theo yêu cầu đội) — v1.4.5:**
> 1. **`web-portal/` (Next.js/TypeScript)** — **ƯU TIÊN CAO NHẤT**: Web portal cho giáo viên (dashboard, quản lý lớp, theo dõi tiến độ). Triển khai nhanh, kiểm chứng UX + luồng nghiệp vụ.
> 2. **`app/` (Flutter PWA)** — làm sau khi `web-portal/` hoàn thành. Hỗ trợ offline 100%, triển khai qua USB.
>
> Các lựa chọn TS-01, TS-17 và cấu trúc module đã được điều chỉnh tương ứng.




## F.0. Ba nguyên tắc chi phối

| **#** | **Nguyên tắc**                                                                            | **Nguồn**                     |
|--------|-------------------------------------------------------------------------------------------|-------------------------------|
| 1      | Không có nhân sự kỹ thuật tại cơ sở giáo dục. Mọi thứ phải cài và chạy được bởi giáo viên | CO-T-04, CO-T-07, NFR-16      |
| 2      | Lớp quyết định phải tất định và kiểm toán được. Mô hình ngôn ngữ không được đứng ở đó     | NFR-06, AIR-15, BR-02, AIR-26 |
| 3      | Dữ liệu định danh không rời thiết bị và không rời cơ sở giáo dục                          | NFR-10, DR-08, BR-21          |

## F.1. Thành phần chính

| **ID** | **Lớp**                                  | **Lựa chọn dự kiến**                                                                       | **Vì sao**                                                                                                                                                                        | **Truy về**                          | **Điều kiện lật**                                                                         |
|--------|------------------------------------------|--------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------|-------------------------------------------------------------------------------------------|
| TS-01  | Ứng dụng người học và ứng dụng giáo viên | **1. `web-portal/` (Next.js/TypeScript)** — ƯU TIÊN CAO NHẤT**: web portal cho giáo viên (dashboard, quản lý lớp). **2. `app/` (Flutter PWA)** — làm sau khi web-portal hoàn thành | Ưu tiên `web-portal/` để kiểm chứng UX + luồng nghiệp vụ nhanh. `app/` hỗ trợ offline 100% và triển khai qua USB | CO-T-02, CO-R-01, CO-R-02, NFR-16 | Sau `web-portal/` ổn mới phát triển `app/` |



| TS-02  | Suy luận mô hình cục bộ                  | **Frontend:** mock/stub. **Backend (Node.js):** có thể host/proxy model hoặc chuẩn bị API. **PWA sau:** WebLLM / llama.cpp WASM trên trình duyệt. **Flutter sau:** llama.cpp FFI, GGUF | Frontend tập trung UI; suy luận local gắn với giai đoạn PWA offline / native | CO-T-02, CO-T-09, NFR-14, SC-14      | Nếu chỉ Android thì cân nhắc MediaPipe; nếu web không đủ hiệu năng thì ưu tiên Flutter sớm hơn |



| TS-03  | Mô hình ngôn ngữ                         | Dòng Gemma, GGUF lượng tử 4-bit. Thang bậc theo AS-61: 4B → 2B → 1B → bỏ                   | Tiếng Việt tốt hơn các bản chưng cất nền Qwen; có nhánh cỡ nhỏ cho thiết bị hạn chế. Bản chưng cất suy luận sinh chuỗi dài, sai loại cho vai trò này và đẩy độ trễ vượt NFR-05    | AS-61, AS-63, SC-14                  | Bài kiểm A và Bài kiểm B (F.5) quyết định bậc. Bậc D thì bỏ TS-02 và TS-03, quay về SC-03 |
| TS-04  | Ép định dạng đầu ra mô hình              | Giải mã bị ràng buộc theo văn phạm GBNF của llama.cpp                                      | Đây là cơ chế kỹ thuật thực thi quy tắc lược đồ đóng: mô hình chỉ chọn trong tập nhãn đã thẩm định, không sinh tự do. Phân loại vào tập nhãn cố định là việc mô hình nhỏ làm được | AIR-25, DR-04                        | —                                                                                         |
| TS-05  | Lưu trữ cục bộ                           | SQLite, bảng sự kiện chỉ ghi thêm                                                          | Không cần quản trị (CO-T-04); một tệp duy nhất nên xuất và xoá gọn; bền và nhỏ                                                                                                    | CO-T-04, BR-06, NFR-07, FR-21, DR-09 | —                                                                                         |
| TS-06  | Mô hình cấu trúc kiến thức               | JSON có phiên bản và băm nội dung, nạp vào bộ nhớ, duyệt bằng mã ứng dụng                  | Đồ thị trong MVP nhỏ (một chuỗi phụ thuộc). Dùng cơ sở dữ liệu đồ thị vi phạm nguyên tắc 1                                                                                        | SC-01, DR-01, DR-07                  | Chỉ xem lại khi mở rộng nhiều môn, nhiều khối lớp                                         |
| TS-07  | Lớp chẩn đoán và mức tin cậy             | Mã tất định. Cập nhật Bayes có tham số đoán mò và sơ suất                                  | BR-02 yêu cầu trừ khả năng trả lời đúng do ngẫu nhiên. Hàm thuần, không ngẫu nhiên, hiệu chỉnh được sau khi có dữ liệu thật                                                       | NFR-06, BR-01, BR-02, AIR-15, AIR-26 | —                                                                                         |
| TS-08  | Điểm trung tâm cục bộ                    | **Backend (Node.js)** chạy chế độ hub trên máy giáo viên, phục vụ HTTP mạng cục bộ. Giai đoạn Frontend: chưa cần. PWA offline tích hợp sau. Flutter hub giai đoạn sau nữa | SC-05 đã chọn tạm. Hub gắn với Backend Node.js; không thêm phần mềm lạ cho giáo viên | SC-05, FR-18, CO-I-06, CO-I-07       | Nếu AS-64 hoặc AS-67 sai thì chuyển sang TS-11                                            |



| TS-09  | Phát hiện hub trong mạng                 | mDNS kèm mã ghép nối sáu chữ số hoặc mã QR                                                 | Giáo viên không cấu hình được địa chỉ mạng                                                                                                                                        | CO-T-04, CO-T-07                     | Nếu mạng trường chặn mDNS thì dùng mã QR chứa địa chỉ                                     |
| TS-10  | Bảo mật kênh cục bộ                      | Khoá chung của lớp, mã hoá tải trọng bằng thư viện libsodium                               | Chứng chỉ tự ký gây cảnh báo trên thiết bị cũ; giáo viên sẽ bỏ qua hoặc bỏ cuộc. Mã hoá ở tầng tải trọng tránh được toàn bộ vấn đề đó                                             | NFR-10, CO-T-04                      | —                                                                                         |
| TS-11  | Dự phòng khi không có mạng cục bộ        | Xuất và nhập một tệp lưu trữ đã mã hoá qua USB                                             | SC-06                                                                                                                                                                             | SC-06, FR-18                         | —                                                                                         |
| TS-12  | Bản in cho giáo viên                     | Xuất PDF từ chính màn hình thông tin tổng hợp lớp                                          | SC-08 là phương án thay thế nếu AS-23 sai. Xuất PDF giữ được cả hai đường mà không phải viết lại                                                                                  | SC-08, AS-23                         | —                                                                                         |

## F.2. Cơ chế thực thi quy tắc nghiệp vụ

Bảng quan trọng nhất của phụ lục. Mỗi quy tắc cứng phải có một cơ chế kỹ thuật thực thi, không dựa vào kỷ luật của người lập trình.

| **Quy tắc**                                                             | **Cơ chế kỹ thuật**                                                                                                                                                               | **Kiểm chứng bằng**                                               |
|-------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|
| BR-17, DR-10 — không dùng đồng hồ thiết bị để sắp thứ tự                | Đồng hồ logic lai trên mỗi thiết bị. Mã sự kiện = (mã thiết bị, số thứ tự logic). Sắp theo cặp đó. Giờ máy chỉ lưu làm siêu dữ liệu, không bao giờ dùng để sắp thứ tự             | AC-025                                                            |
| EC-12, NFR-03 — không mất và không nhân bản bản ghi                     | Nhật ký chỉ ghi thêm; hợp nhất theo mã sự kiện nên tự luỹ đẳng — chạy lại bao nhiêu lần cũng ra một kết quả. Trùng mã nhưng khác nội dung thì giữ cả hai, gắn cờ, không tự ghi đè | AC-023, EC-13                                                     |
| NFR-04 — nạp lại được sau gián đoạn                                     | Truyền theo khối, có điểm tiếp tục, xác thực băm từng khối                                                                                                                        | AC-024                                                            |
| BR-06, FR-23, NFR-07 — tính lại được, bằng chứng gốc bất biến           | Bảng sự kiện chỉ ghi thêm, không sửa và không xoá. Kết luận là bảng dẫn xuất, xoá và dựng lại được từ nhật ký                                                                     | AC-018, AC-034                                                    |
| DR-07 — gắn phiên bản vào mọi kết luận                                  | Mỗi kết luận lưu kèm: băm đồ thị tri thức, phiên bản logic, băm tệp trọng số mô hình, mức lượng tử hoá, tham số giải mã                                                           | AC-034                                                            |
| NFR-06 — tất định                                                       | Lớp quyết định là hàm thuần, không ngẫu nhiên, không đọc đồng hồ. Đầu ra trích xuất của mô hình được lưu như bằng chứng; khi tính lại thì đọc bản đã lưu, không gọi lại mô hình   | Kiểm thử vàng: cùng nhật ký cho ra cùng kết luận qua 100 lần chạy |
| AIR-12, NFR-09, BR-09 — nội dung chưa thẩm định không tới người học     | Gói nội dung ký bằng Ed25519, khoá riêng do người thẩm định giữ. Ứng dụng từ chối hiển thị bất kỳ mục nào không có chữ ký hợp lệ. Không có đường vòng ở tầng ứng dụng             | AC-028, AC-029                                                    |
| FR-22, BR-19, EC-15 — thiết bị dùng chung                               | Mã hồ sơ bắt buộc ở mọi truy vấn, chặn ngay tại tầng truy cập dữ liệu. Màn hình xác nhận hồ sơ mỗi phiên. Tuỳ chọn mã PIN                                                         | AC-031                                                            |
| CO-T-03, NFR-18, EC-14 — dữ liệu bị hệ điều hành thu hồi                | Bản kê băm; kiểm tra toàn vẹn lúc khởi động; phục hồi từ điểm trung tâm cục bộ; cảnh báo người dùng                                                                               | AC-027                                                            |
| FR-21, DR-09 — xuất và xoá dữ liệu                                      | Phạm vi dữ liệu của một cơ sở nằm trong một tệp SQLite. Xuất là kho lưu trữ có ký. Xoá là xoá an toàn kèm bia mộ                                                                  | AC-032                                                            |
| M-01, DR-08 — ẩn danh trước khi rời cơ sở giáo dục                      | HMAC ổn định của mã người học, khoá do cơ sở giáo dục giữ và không bao giờ rời khỏi cơ sở. Thực hiện tại điểm trung tâm cục bộ trước khi xuất, đúng quyết định tại Mục 19.6       | AC-033                                                            |
| AIR-24 — mô hình không được bịa dữ kiện                                 | Đầu ra diễn đạt bị đối chiếu tự động với tập dữ kiện đầu vào. Câu chứa thực thể không có trong chuỗi bằng chứng thì bị chặn và rơi về mẫu câu tĩnh                                | Kiểm thử trên tập mẫu; xem G.3                                    |
| BR-13, AIR-13 — không dùng nhãn năng lực với người học và người giám hộ | Mọi chuỗi hiển thị cho người học lấy từ danh mục mẫu câu đã duyệt. Mô hình chỉ điền ô từ một tập từ vựng đóng, không viết tự do                                                   | AC-030                                                            |
| AIR-19, EC-16, EC-17 — giám sát chất lượng                              | Bộ đếm cục bộ: tỷ lệ bác bỏ, tỷ lệ chấp nhận không mở phần bằng chứng, tỷ lệ từ chối kết luận. Xuất ở dạng ẩn danh                                                                | AC-019                                                            |

## F.3. Xưởng nội dung — tách biệt hoàn toàn

Chạy trên máy của đội phát triển, không chạy trên thiết bị tại cơ sở giáo dục, và không chạm tới dữ liệu người học. Ranh giới cần nêu rõ khi trình bày dự án: giai đoạn sử dụng bắt buộc chạy cục bộ; xưởng chuẩn bị nội dung không bắt buộc chạy cục bộ.

| **ID** | **Thành phần**                   | **Lựa chọn**                                                                                                        | **Truy về**           |
|--------|----------------------------------|---------------------------------------------------------------------------------------------------------------------|-----------------------|
| TS-13  | Sinh biến thể nội dung           | Python kết hợp mô hình ngôn ngữ cỡ lớn. Ở khâu này không có ràng buộc cục bộ vì không có dữ liệu người học tham gia | SC-09, AIR-06         |
| TS-14  | Kiểm chứng tự động tính đúng đắn | SymPy — xác minh đáp án cho các dạng đại số và số học biểu diễn được                                                | SC-10, CO-T-05, AS-49 |
| TS-15  | Hàng đợi thẩm định               | Giao diện nội bộ hiển thị nội dung đã lọc qua TS-14 để người thẩm định duyệt hoặc loại                              | FR-20, NFR-17, AS-54  |
| TS-16  | Ký và đóng gói                   | Chữ ký Ed25519, khoá riêng do người thẩm định giữ, đóng gói kèm bản kê nội dung                                     | AIR-12, BR-09         |

## F.4. Phân phối và cài đặt

| **ID** | **Nội dung**                     | **Lựa chọn**                                                                  | **Truy về**      |
|--------|----------------------------------|-------------------------------------------------------------------------------|------------------|
| TS-17  | `web-portal/` — ƯU TIÊN CAO NHẤT | Next.js/TypeScript — web portal cho giáo viên (dashboard, quản lý lớp). Deploy dạng web app thông thường (Vercel / static / server) | CO-I-01, CO-T-07, NFR-16 |
| TS-17a | `app/` — Flutter PWA (giai đoạn sau) | Flutter: APK cài trực tiếp (Android) + tệp chạy độc lập (Windows), không cần quyền quản trị. Hỗ trợ offline 100%, triển khai qua USB | CO-T-07          |
| TS-19  | Trọng số mô hình và gói nội dung | Chuyển qua USB. Dung lượng vài trăm MB tới vài GB. Gắn với giai đoạn PWA / native | CO-I-02, SC-06   |
| TS-20  | Cập nhật                         | Cùng đường USB (hoặc sync cục bộ), kiểm tra băm, giữ được phiên bản cũ để lùi lại | AS-64, NFR-18    |

Hệ quả phải ghi nhận: Mục 19.7.2 xếp SC-06 là phương án dự phòng cho việc tập hợp dữ liệu lớp. Với TS-19, SC-06 đồng thời trở thành kênh bắt buộc để phân phối mô hình và nội dung. Hai vai trò khác nhau và không loại trừ nhau. Thứ tự: **`web-portal/` (Next.js)** → **`app/` (Flutter PWA)**.




## F.5. Hai phép đo quyết định

| **Bài kiểm**                          | **Nội dung**                                                                                                                                                                                                                                                                                    | **Ghép vào**                                        | **Đóng được**                                             |
|---------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------------|
| A — chất lượng trích xuất và diễn đạt | Lấy 30 bài làm thật. Mỗi mô hình ứng viên trích xuất bằng chứng theo lược đồ đóng và diễn đạt lại chuỗi bằng chứng. Ba giáo viên chấm: có hiểu được không, có diễn đạt lại được căn cứ không, có câu nào bịa dữ kiện không. Chỉ số quyết định: số ca sai mà mô hình không tự nhận là không chắc | Hành động 1 tại Mục 15.4 — buổi đối chiếu chẩn đoán | AS-02, AS-63, DR-06, và chọn xong mô hình                 |
| B — chạy nổi trên thiết bị thật       | Đo trên máy thật tại địa bàn, không đo trên máy của đội: thời gian từ lúc yêu cầu tới lúc có kết quả; RAM đỉnh (trình duyệt / native); dung lượng chiếm sau cài đặt/cache; mức tụt pin sau 20 lần gọi liên tiếp (ưu tiên đo web-app trước, Flutter sau) | Hành động 3 tại Mục 15.4 — khảo sát hạ tầng         | AS-61, AS-62, AS-66, và đặt ngưỡng NFR-05, NFR-14, NFR-19 |


## F.6. Những gì phụ lục này chưa quyết định

| **Nội dung**                                                            | **Chờ gì**                                                         |
|-------------------------------------------------------------------------|--------------------------------------------------------------------|
| Cỡ mô hình cụ thể                                                       | Bài kiểm A và Bài kiểm B                                           |
| Ngưỡng cấu hình tối thiểu NFR-14 và dung lượng NFR-19                   | Đo trên thiết bị thật (OQ-07)                                      |
| Ngưỡng thời gian phản hồi NFR-05                                        | Đo suy luận cục bộ, và giải quyết mâu thuẫn ⚠ đang mở tại Mục 17.2 |
| Giấy phép trọng số mô hình                                              | Rà soát pháp lý — CO-L-08, AS-65                                   |
| Dạng nhập bằng chứng: gõ các bước hay trắc nghiệm kèm ô nhập trung gian | Quyết định này ràng buộc với OS-03 — xem G.9                       |

## F.7. Việc phải làm trước khi viết tính năng

Thứ tự ưu tiên xây dựng:

1. **Frontend trước (Next.js / React)**: dựng giao diện giáo viên + học sinh, luồng chẩn đoán chính, Teacher View (nhóm can thiệp, bằng chứng, override), Student progress. Dùng mock data / stub API để kiểm chứng UX và luồng nghiệp vụ nhanh. Không phụ thuộc offline hay suy luận local ở bước này.

2. **Backend (Node.js)**: API, logic nghiệp vụ, lưu trữ, điểm trung tâm cục bộ (hub). Kết nối Frontend với dữ liệu thật / mock server.

3. **Full web-app (PWA offline) sau**: Service Worker, IndexedDB/SQLite WASM, cache offline, suy luận local (WebLLM / llama.cpp WASM + mô hình 4-bit). Đo thời gian phản hồi, RAM đỉnh trình duyệt, dung lượng cache, khả năng offline trên thiết bị thật tại địa bàn.

4. **Flutter sau nữa** (khi có thời gian): Flutter + llama.cpp FFI + cùng mô hình, đo thêm mức tụt pin và hiệu năng native.

Ghép kết quả đo (bước 3) vào hành động 3 tại Mục 15.4. Kết quả quyết định bậc TS-03 và phạm vi tính năng MVP. Nếu PWA không chạy được ở mức chấp nhận thì biết sớm và điều chỉnh (giảm cỡ mô hình hoặc quay về SC-03).




---

# PHỤ LỤC G — KIẾN TRÚC AI LOCAL VÀ BỔ SUNG YÊU CẦU VÒNG 2

Phụ lục này ghi lại: các mâu thuẫn nội bộ đã sửa ở bản 1.3, kiến trúc AI local, các yêu cầu và ràng buộc bổ sung, và các vùng nội dung còn trống. Trừ nơi ghi khác, toàn bộ mang nhãn [A].

## G.1. Mâu thuẫn nội bộ đã sửa ở bản 1.3

| **#** | **Mâu thuẫn ở bản 1.2**                                                                                                                          | **Xử lý ở bản 1.3**                                                                                                                                                                             |
|--------|--------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| G1     | SR-15 ở mức Must tại Mục 6.2 nhưng bị liệt kê trong nhóm Later tại Mục 15.1.4; đồng thời truy sai về SN-G-01 trong khi Mục 6.2 truy về SN-G-02   | Sửa Mục 15.1.4: chỉ hoãn báo cáo tổng hợp cấp Phòng/Sở (SN-G-01) theo Mục 19.6. SR-15 giữ mức Must vì đó là ràng buộc ẩn danh áp cho mọi báo cáo tổng hợp                                       |
| G2     | DR-09 (xuất và xoá dữ liệu) xếp Could, trong khi là nguồn của FR-21 mức Must và của nghĩa vụ pháp lý CO-L-03                                     | Nâng DR-09 lên Must                                                                                                                                                                             |
| G3     | NFR-20 (không suy giảm chất lượng theo nhóm) xếp Could, trong khi là nguồn của BRQ-07 mức Must và của BO-08                                      | Nâng NFR-20 lên Must                                                                                                                                                                            |
| G4     | DR-06 (chuẩn đối chiếu chuyên gia) xếp Should, trong khi là điều kiện của AC-002, của hành động ưu tiên số 1 và của tiêu chí hoàn thành MVP số 5 | Nâng DR-06 lên Must                                                                                                                                                                             |
| G5     | NFR-14 (thiết bị phổ thông đời cũ) xếp Should, trong khi Mục 15.3.2 ghi rõ đây là điều kiện biên của MVP và là tiêu chí hoàn thành MVP số 1      | Nâng NFR-14 lên Must                                                                                                                                                                            |
| G6     | Mục 14.3 ghi "không có quyết định kiến trúc nào được chốt" trong khi Phụ lục E đã chọn tạm bốn nhóm phương án                                    | Sửa câu kết Mục 14.3; cập nhật Decision Status của SC-01, SC-05, SC-07, SC-09, SC-10 trong Mục 14.1                                                                                             |
| G7     | Hai heading cùng mang số 18; các mục 18.6, 18.7, 18.8, 18.10 đặt sai bậc heading                                                                 | Đánh lại Phụ lục E thành Mục 19; sửa bậc heading của 19.6, 19.7, 19.8, 19.10                                                                                                                    |
| G8     | Phụ lục C — Lịch sử thay đổi được tham chiếu ở đầu tài liệu và ở Mục 16 nhưng không tồn tại trong thân tài liệu                                  | Bổ sung Phụ lục C                                                                                                                                                                               |
| G9     | SH-08 xếp quyền lực Thấp tại Mục 2.1 nhưng giữ chữ A trong RACI cho hai hoạt động tại Mục 2.4                                                    | Đã sửa ở bản 1.4. Thêm Lưu ý 3 tại Mục 2.4.1 (giải thích Power thấp và quyền A không mâu thuẫn) và bảng RACI vận hành mới tại Mục 2.4.2, trả lời ba câu hỏi nêu ở G.9 mục 7                     |
| G10    | Ba giá trị sơ bộ ⚠ tại Mục 17.2 mâu thuẫn với chính requirement gốc (NFR-02 "khoảng 1 GB", NFR-05 "1–2 giờ", NFR-11 "1–2 ngày")                  | Đã sửa ở bản 1.4. Tách lại 3 giá trị sơ bộ tại Mục 17.2 (NFR-02, NFR-05, NFR-11) thành ngưỡng kép, không còn tự mâu thuẫn với yêu cầu gốc. Ngưỡng cuối cùng vẫn chờ đo thực tế theo Phụ lục F.6 |

## G.2. Kiến trúc AI local — ba lớp

Đề bài yêu cầu dùng AI chạy cục bộ để phát hiện người học đang hổng kiến thức nền nào. Thiết kế dưới đây đáp ứng yêu cầu đó, đồng thời giữ nguyên toàn bộ quy tắc cứng hiện có của tài liệu.

| **Lớp**                    | **Ai làm**                                      | **Việc cụ thể**                                                                                                                                             | **Yêu cầu liên quan**                                                |
|----------------------------|-------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------|
| 1. Trích xuất             | Mô hình ngôn ngữ chạy cục bộ                    | Đọc bài làm của người học, xuất ra bằng chứng có cấu trúc: sai ở bước nào, thuộc kỹ năng nào, kiểu hiểu sai gì, có dấu hiệu nguyên nhân phi kiến thức không | FR-01, FR-07, DR-03, DR-04, AIR-25                                   |
| 2. Tổng hợp và quyết định | Đồ thị phụ thuộc kiến thức, mã tất định (SC-01) | Cộng dồn bằng chứng qua nhiều lượt và nhiều ngày, cho ra nguyên nhân gốc, mức tin cậy, trạng thái từ chối kết luận, kết quả gom nhóm và thứ tự ưu tiên      | FR-02, FR-03, FR-04, FR-08, FR-10, FR-11, BR-01, BR-02, BR-07, BR-08 |
| 3. Diễn đạt               | Mô hình ngôn ngữ chạy cục bộ                    | Chuyển chuỗi bằng chứng thành lời giải thích cho giáo viên; điền mẫu câu về kỹ năng cần luyện cho người học                                                 | NFR-08, BR-13, AIR-17, AIR-24                                        |

Vì sao lớp 2 không dùng mô hình ngôn ngữ: AIR-15 đặt mục tiêu số ca kết luận sai kèm mức tin cậy cao bằng không, và BR-02 yêu cầu mức tin cậy phải hiệu chỉnh được trên dữ liệu thật. Mức tin cậy tự báo của mô hình ngôn ngữ không đáp ứng được hai điều này. Đây cũng chính là khác biệt cạnh tranh đã nêu tại I-04.

Vì sao NFR-06 vẫn giữ được: mô hình chạy một lần khi người học nộp bài, kết quả trích xuất được lưu như bằng chứng gốc, bất biến và gắn phiên bản. Mọi lần tính lại kết luận đều đọc bản ghi đã lưu chứ không gọi lại mô hình. Nhờ vậy cùng bằng chứng và cùng phiên bản logic luôn cho cùng kết luận.

## G.3. Yêu cầu AI bổ sung

| **ID** | **Requirement**                                                                                                                                                                 | **Điều kiện kèm theo**                                                                                              | **Source**                  |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|-----------------------------|
| AIR-24 | Mô hình ngôn ngữ chỉ được diễn đạt lại các dữ kiện do cơ chế suy luận cung cấp. Không được bổ sung dữ kiện, bước lập luận hoặc kết luận nào không có trong chuỗi bằng chứng gốc | Đối chiếu tự động giữa đầu ra và tập dữ kiện đầu vào; vi phạm thì chặn và rơi về mẫu câu tĩnh                       | NFR-08, NFR-07, AIR-17      |
| AIR-25 | Được phép phân tích bài làm của người học để trích xuất kỹ năng liên quan và kiểu sai, xuất ra theo lược đồ đã định                                                             | Chỉ chọn trong tập nhãn đã thẩm định; bắt buộc có nhãn "không xác định"; kết quả là bằng chứng, không phải kết luận | FR-01, FR-07, DR-04, GAP-13 |
| AIR-26 | Mô hình ngôn ngữ không được tự tính hoặc tự báo mức tin cậy của kết luận nguyên nhân gốc                                                                                        | Mức tin cậy do lớp tổng hợp tính theo BR-02                                                                         | AIR-15, BR-02, NFR-06       |

## G.4. Sửa đổi yêu cầu hiện có

| **ID** | **Bản 1.2**                                                                          | **Bản 1.3**                                                                                                                                                                                                                                                                                                    |
|--------|--------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| NFR-06 | Hệ thống phải cho cùng kết quả khi nhận cùng dữ liệu đầu vào và cùng phiên bản logic | Thu hẹp phạm vi về lớp quyết định: kết luận, mức tin cậy, gom nhóm và thứ tự ưu tiên phải tất định. Phần diễn đạt bằng ngôn ngữ tự nhiên không thuộc phạm vi này nhưng chịu AIR-24. Không thu hẹp thì NFR-06 là yêu cầu không thể đạt, vì đầu ra mô hình không giống hệt nhau trên các nền phần cứng khác nhau |
| DR-07  | Gắn phiên bản mô hình kiến thức và phiên bản logic                                   | Gắn thêm băm tệp trọng số, mức lượng tử hoá và tham số giải mã khi có dùng mô hình ngôn ngữ cục bộ                                                                                                                                                                                                             |
| DR-04  | Evidence Status: [I] — cơ chế tích luỹ chưa tồn tại                                | Cơ chế tích luỹ nay có lời giải: trích xuất bằng mô hình cục bộ (AIR-25, TS-04), tích luỹ qua các lần giáo viên điều chỉnh                                                                                                                                                                                     |
| BR-07  | Ngưỡng xác định lỗ hổng cả lớp: TBD                                                  | 30% sĩ số lớp, làm tròn xuống, sàn tối thiểu tuyệt đối 3 học sinh (Mục 19.3)                                                                                                                                                                                                                                   |
| BR-08  | Công thức ưu tiên: chưa có tie-break                                                 | Bổ sung tie-break: ưu tiên nguyên nhân đạt trạng thái đã kết luận sớm hơn; nếu vẫn bằng thì ưu tiên nguyên nhân nằm gần đầu chuỗi phụ thuộc hơn (Mục 19.4)                                                                                                                                                     |
| EC-08  | Sau số lần xác định thì dừng                                                         | Sau 3 vòng lặp chưa đạt xác nhận, với chưa đạt nghĩa là đúng dưới 70% số câu trong phép đo xác nhận độc lập (Mục 19.5)                                                                                                                                                                                         |

## G.5. Ràng buộc bổ sung

| **ID**  | **Constraint**                                                                                                                  | **Hard/Soft**       | **Nguồn**                                     | **Đã thêm vào** |
|---------|---------------------------------------------------------------------------------------------------------------------------------|---------------------|-----------------------------------------------|-----------------|
| CO-T-09 | Mô hình ngôn ngữ chạy cục bộ bị giới hạn bởi RAM, CPU và dung lượng trống của thiết bị mục tiêu                                 | Hard                | CO-T-02, SC-14                                | Mục 5.4.3       |
| CO-T-10 | Đầu ra mô hình phải tất định với cùng phiên bản trọng số, cùng mức lượng tử hoá và cùng tham số giải mã                         | Hard                | NFR-06, FR-23                                 | Mục 5.4.3       |
| CO-I-07 | Cần một máy tính do giáo viên vận hành đóng vai trò điểm trung tâm cục bộ                                                       | Hard khi chọn SC-05 | Mục 19.7.2                                    | Mục 5.4.4       |
| CO-L-08 | Trọng số mô hình ngôn ngữ có giấy phép riêng, có thể kèm chính sách sử dụng và nghĩa vụ truyền kèm điều khoản khi phân phối lại | Hard                | Điều khoản của nhà phát hành mô hình — cần rà | Mục 5.4.6       |

## G.6. Assumption bổ sung

| **ID** | **Assumption**                                                                                             | **Impact if False**                                                                                          | **Validation Method**                        |
|--------|------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------|----------------------------------------------|
| AS-61  | Thiết bị mục tiêu chạy được mô hình cục bộ trong ngưỡng thời gian hợp nhịp tiết học                        | Bỏ toàn bộ SC-14; quay về SC-03 với chi phí biên soạn cao hơn                                                | Bài kiểm B tại F.5                           |
| AS-62  | Dung lượng trọng số mô hình cộng nội dung nằm trong dung lượng trống thực tế của thiết bị                  | Vi phạm NFR-19; người dùng phải gỡ ứng dụng khác                                                             | Bài kiểm B tại F.5                           |
| AS-63  | Mô hình cỡ chạy được cục bộ xử lý tiếng Việt chuyên môn Toán ở mức chấp nhận được                          | Trích xuất sai hàng loạt; RK-19 hiện thực hoá. Nâng cấp từ AS-51, rủi ro cao hơn nhiều so với mô hình cỡ lớn | Bài kiểm A tại F.5                           |
| AS-64  | Phân phối và cập nhật mô hình tới cơ sở giáo dục ngoại tuyến khả thi mà không cần nhân sự kỹ thuật         | Không triển khai được ở quy mô ngoài trường thí điểm                                                         | Thử quy trình cài đặt với giáo viên thật     |
| AS-65  | Giấy phép trọng số mô hình cho phép sử dụng và phân phối lại trong bối cảnh giáo dục công                  | Chặn phân phối; phải đổi mô hình                                                                             | Rà soát pháp lý — CO-L-08                    |
| AS-66  | Thiết bị mục tiêu là kiến trúc 64-bit. Thiết bị Android 32-bit đời cũ không chạy nổi mô hình từ 2B trở lên | Buộc tụt xuống bậc thấp nhất hoặc bỏ SC-14                                                                   | Khảo sát thiết bị — hành động 3 tại Mục 15.4 |
| AS-67  | Mạng cục bộ tại phòng học cho phép hai thiết bị nhìn thấy nhau                                             | TS-08 và TS-09 hỏng; phải dùng TS-11 qua USB                                                                 | Thử tại trường — hành động 3 tại Mục 15.4    |
| AS-68  | Giáo viên tự cài được ứng dụng từ USB mà không cần hỗ trợ tại chỗ                                          | Vi phạm CO-T-07 và NFR-16                                                                                    | Thử với giáo viên thật                       |

## G.7. Rủi ro bổ sung

| **ID** | **Risk**                                                                                     | **Category**   | **Prob**       | **Impact** | **Mitigation**                                                                                                       |
|--------|----------------------------------------------------------------------------------------------|----------------|----------------|------------|----------------------------------------------------------------------------------------------------------------------|
| RK-18  | Thiết bị mục tiêu không chạy nổi mô hình cục bộ trong ngưỡng chấp nhận được                  | Technical      | Cao            | Cao        | Thang bậc TS-03; bậc thấp nhất vẫn giữ được sản phẩm vì lớp quyết định là đồ thị                                     |
| RK-19  | Mô hình trích xuất sai kiểu lỗi mà không tự nhận là không chắc                               | Product        | Trung bình     | Rất cao    | Bắt buộc nhãn "không xác định" (AIR-25); giáo viên xem và bác bỏ được (FR-16, FR-17); theo dõi tỷ lệ bác bỏ (AIR-19) |
| RK-20  | Tính không tất định làm gãy NFR-06 và khả năng tính lại theo FR-23                           | Technical      | Trung bình     | Cao        | CO-T-10; lưu đầu ra trích xuất như bằng chứng, không gọi lại mô hình khi tính lại                                    |
| RK-21  | Mô hình bịa dữ kiện trong phần giải thích, giáo viên không phát hiện được                    | Product        | Trung bình     | Rất cao    | AIR-24 kèm đối chiếu tự động; rơi về mẫu câu tĩnh khi vi phạm                                                        |
| RK-22  | Chi phí và thời gian phân phối, cập nhật mô hình tới cơ sở giáo dục ngoại tuyến vượt dự kiến | Resource       | Cao            | Trung bình | TS-19, TS-20; gộp lịch cập nhật theo học kỳ                                                                          |
| RK-23  | Mạng trường cô lập thiết bị nên hai máy không nhìn thấy nhau                                 | Infrastructure | Trung bình     | Cao        | TS-11 qua USB                                                                                                        |
| RK-24  | Rào cản ngôn ngữ và đọc hiểu bị chẩn đoán nhầm thành lỗ hổng kiến thức                       | Educational    | Trung bình–Cao | Cao        | Mở rộng BR-14; bổ sung FR-25 và OQ-13 — xem G.9                                                                      |
| RK-25  | Điểm trung tâm cục bộ hỏng hoặc mất, kéo theo mất toàn bộ dữ liệu lớp đã hợp nhất            | Technical      | Trung bình     | Cao        | Bổ sung NFR-22 — xem G.9                                                                                             |
| RK-26  | Giấy phép trọng số mô hình không cho phép phân phối trong bối cảnh này                       | Legal          | Trung bình     | Cao        | CO-L-08; rà soát trước khi chọn mô hình                                                                              |

## G.8. Edge case bổ sung

| **ID** | **Use Case**   | **Edge / Failure Case**                                              | **Expected Behavior**                                                                                                                         | **Severity** |
|--------|----------------|----------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| EC-25  | UC-001, UC-003 | Mô hình trích xuất gán sai kỹ năng mà vẫn báo là xác định            | Giáo viên thấy được bản trích xuất trong chuỗi bằng chứng và bác bỏ được; tỷ lệ bác bỏ theo dõi như chỉ số chất lượng (AIR-19)                | Nghiêm trọng |
| EC-26  | Toàn hệ thống  | Người học viết bằng ngôn ngữ hoặc cách diễn đạt mà mô hình xử lý kém | Trả nhãn "không xác định", chuyển sang trạng thái cần thêm bằng chứng; không kết luận nguyên nhân kiến thức (BR-14)                           | Cao          |
| EC-27  | Toàn hệ thống  | Máy giáo viên đóng vai trò điểm trung tâm cục bộ bị hỏng hoặc mất    | Khôi phục từ bản sao lưu theo NFR-22; nếu không có thì dựng lại từ nhật ký còn trên thiết bị người học                                        | Nghiêm trọng |
| EC-28  | UC-015         | Phiên bản trọng số mô hình thay đổi giữa chừng                       | Bằng chứng đã trích xuất giữ nguyên và giữ phiên bản cũ; chỉ nội dung trích xuất mới dùng phiên bản mới; đánh dấu ranh giới phiên bản (DR-07) | Cao          |

## G.9. Vùng nội dung còn trống và yêu cầu đề xuất

Bảy vùng dưới đây chưa có yêu cầu nào phủ ở bản 1.2. Yêu cầu đề xuất cần được rà và gán mã chính thức trước khi đưa vào Mục 6.

| **#** | **Vùng trống**                          | **Vì sao quan trọng**                                                                                                                                                                                                                                                                                               | **Yêu cầu đề xuất**                                                                                                                                                                                                                                              |
|--------|-----------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1      | Rào cản ngôn ngữ và đọc hiểu            | Địa bàn mục tiêu có tỷ lệ người học dùng tiếng Việt như ngôn ngữ thứ hai. Ăn thẳng vào EC-04 và OQ-10. Nếu người học sai vì rào cản ngôn ngữ mà hệ thống kết luận hổng kiến thức thì chẩn đoán sai hàng loạt — đúng kịch bản RK-03. Không mục nào ở bản 1.2 nhắc tới, kể cả trong 60 assumption và 12 open question | FR-25 — Hệ thống phải nhận diện được dấu hiệu lỗi do rào cản ngôn ngữ hoặc đọc hiểu và không kết luận nguyên nhân kiến thức trong trường hợp đó (mở rộng BR-14). OQ-13 — Tỷ lệ người học dùng tiếng Việt như ngôn ngữ thứ hai tại địa bàn mục tiêu là bao nhiêu? |
| 2      | Thời hạn lưu trữ dữ liệu                | DR-09 chỉ có xoá theo yêu cầu. Quy định bảo vệ dữ liệu người chưa thành niên thường đòi thời hạn lưu trữ tối đa và xoá tự động. Lỗ hổng trực tiếp với BO-06 và OQ-08                                                                                                                                                | DR-12 — Dữ liệu người học phải có thời hạn lưu trữ tối đa xác định và cơ chế xoá tự động khi hết hạn. OQ-14 — Thời hạn lưu trữ hợp lệ theo quy định hiện hành là bao lâu?                                                                                        |
| 3      | Xử lý sự cố dữ liệu                     | BO-06 ghi rằng một sự cố đủ để chấm dứt dự án, nhưng không có yêu cầu nào về phát hiện, ghi nhận và thông báo sự cố                                                                                                                                                                                                 | NFR-21 — Hệ thống phải phát hiện, ghi nhận và thông báo sự cố mất mát hoặc lộ dữ liệu theo quy trình đã định                                                                                                                                                     |
| 4      | Sao lưu điểm trung tâm cục bộ           | SC-05 tạo ra một điểm hỏng đơn lẻ. NFR-18 chỉ nói phục hồi từ nguồn còn lại; nếu máy giáo viên hỏng hoặc mất thì mất toàn bộ dữ liệu lớp đã hợp nhất                                                                                                                                                                | NFR-22 — Dữ liệu tại điểm trung tâm cục bộ phải có bản sao lưu khôi phục được khi thiết bị của giáo viên hỏng hoặc mất                                                                                                                                           |
| 5      | Người học chuyển lớp hoặc chuyển trường | EC-22 nêu tình huống nhưng không có FR, DR hay AC nào phủ. Đây là nghiệp vụ có thật, không phải trường hợp hiếm                                                                                                                                                                                                     | FR-26 — Hệ thống phải xử lý được trường hợp người học chuyển lớp hoặc chuyển trường: giữ dữ liệu đã có, đánh dấu gián đoạn, không suy luận xuyên qua khoảng trống                                                                                                |
| 6      | An toàn nội dung theo lứa tuổi          | AIR-06 cho phép sinh biến thể nội dung, nhưng thẩm định hiện chỉ kiểm đúng sai về kiến thức. Đối tượng là người chưa thành niên                                                                                                                                                                                     | NFR-23 — Nội dung sinh bằng công cụ hỗ trợ phải qua kiểm duyệt về mức độ phù hợp lứa tuổi, ngoài kiểm duyệt về tính đúng đắn kiến thức (mở rộng FR-20, NFR-09)                                                                                                   |
| 7      | Mô hình vận hành sau triển khai         | RACI tại Mục 2.4 chỉ phủ giai đoạn xây dựng. Chưa xác định ai cập nhật nội dung mỗi học kỳ, ai xử lý khi giáo viên báo lỗi, ai nâng cấp phiên bản mô hình tại cơ sở không có nhân sự kỹ thuật. Liên quan tới G1 mục G9 về quyền lực của SH-08                                                                       | Đã lập tại Mục 2.4.2 (bản 1.4) — bảng RACI vận hành trả lời cả ba câu hỏi                                                                                                                                                                                        |

Vùng số 1 là quan trọng nhất trong danh sách: đây là biến số có thể làm sai lệch chẩn đoán trên đúng nhóm đối tượng ưu tiên của dự án.

Ràng buộc kèm theo với OS-03: Mục 5.2 loại nhận dạng chữ viết tay khỏi phạm vi. Nếu người học làm bài trên giấy thì lớp trích xuất không có đầu vào. Phương án cho MVP: người học gõ các bước làm trên thiết bị, hoặc trắc nghiệm kèm ô nhập bước trung gian. Cần ghi rõ dạng bằng chứng vào IS-01 và vào Mục 15.3.2.

## G.10. Hành động bổ sung vào Mục 15.4

| **Mã** | **Action**                                                                               | **Ghép vào**                                            | **Deliverable**                                                           |
|--------|------------------------------------------------------------------------------------------|---------------------------------------------------------|---------------------------------------------------------------------------|
| 1b     | Bài kiểm A — chất lượng trích xuất và diễn đạt của mô hình ứng viên trên 30 bài làm thật | Hành động 1 — buổi đối chiếu chẩn đoán với ba giáo viên | Chọn xong mô hình; số liệu đóng AS-63; chuẩn đối chiếu ban đầu DR-06      |
| 3b     | Bài kiểm B — dựng bản thử nghiệm mỏng và đo trên thiết bị thật tại địa bàn               | Hành động 3 — khảo sát hạ tầng                          | Bậc TS-03; ngưỡng NFR-05, NFR-14, NFR-19; đóng AS-61, AS-62, AS-66, AS-67 |
| 11     | Rà soát giấy phép trọng số mô hình ngôn ngữ                                              | Hành động 4 — rà soát pháp lý                           | Kết luận cho CO-L-08 và AS-65                                             |

---

# PHỤ LỤC H — QUY TRÌNH TO-BE

Mục 3.2 mô tả quy trình hiện tại theo mười bước A1 tới A10. Mục 4 nêu Desired State theo từng dòng rời rạc nhưng không ghép thành một luồng. Phụ lục này bổ sung quy trình TO-BE tương ứng, để đối chiếu trực tiếp.

| **Bước** | **Hoạt động TO-BE**                                                                                 | **Input**                               | **Output**                                                                        | **Thay cho**                                | **Yêu cầu liên quan**                    |
|----------|-----------------------------------------------------------------------------------------------------|-----------------------------------------|-----------------------------------------------------------------------------------|---------------------------------------------|------------------------------------------|
| B1       | Dạy bài mới theo phân phối chương trình, có thông tin trước tiết về nhóm cần chú ý                  | Bảng nhóm can thiệp từ B7               | Bài giảng chung, trọng tâm được điều chỉnh                                        | A1                                          | FR-15, NFR-05                            |
| B2       | Giao nhiệm vụ có phân hoá theo nhóm nguyên nhân, không phân hoá theo điểm số                        | Danh sách nhóm theo nguyên nhân gốc     | Nhiệm vụ khác nhau theo nhóm                                                      | A2                                          | FR-11, FR-12, BR-18                      |
| B3       | Người học làm bài trên thiết bị; từng bước làm được ghi nhận kèm ngữ cảnh                           | Đề bài đã số hoá và đã thẩm định        | Nhật ký sự kiện chi tiết, bất biến                                                | A3                                          | FR-01, DR-03, DR-11, BR-16               |
| B4       | Mô hình cục bộ trích xuất bằng chứng có cấu trúc từ bài làm                                         | Bài làm của người học                   | Kỹ năng liên quan, kiểu sai, dấu hiệu phi kiến thức, hoặc nhãn không xác định     | Bước mới — A4 hiện làm mất phần lớn dữ liệu | AIR-25, FR-07, TS-04                     |
| B5       | Lớp tổng hợp cộng dồn bằng chứng và trả về một trong ba trạng thái                                  | Bằng chứng tích luỹ và đồ thị phụ thuộc | Đã kết luận nguyên nhân, cần thêm bằng chứng, hoặc đã vững nền                    | A5                                          | FR-02, FR-03, FR-04, FR-08, BR-01, BR-02 |
| B6       | Khi chưa đủ căn cứ: chọn phép đo phân biệt tốt nhất, không hỏi tràn lan                             | Tập giả thuyết đang cạnh tranh          | Phép đo tiếp theo                                                                 | Bước mới                                    | FR-05, FR-06, AIR-02, SN-S-04            |
| B7       | Gom nhóm theo nguyên nhân gốc, sắp thứ tự ưu tiên, giới hạn số nhóm ở mức xử lý được trong một tiết | Bằng chứng cấp lớp đã tập hợp           | Danh sách nhóm, thứ tự ưu tiên, bằng chứng kèm theo, danh sách chưa kết luận được | A6, A7                                      | FR-10, FR-11, FR-15, BR-07, BR-08        |
| B8       | Giáo viên xem bằng chứng, giữ hoặc bác bỏ, ra quyết định can thiệp                                  | Bảng nhóm và chuỗi bằng chứng           | Quyết định của giáo viên có hiệu lực; mọi lần điều chỉnh được ghi nhận            | Bước mới                                    | FR-16, FR-17, BR-03, BR-05, AIR-18       |
| B9       | Hỗ trợ tối giản: bỏ phần đã vững, giữ tiếp cận mục tiêu của lớp hiện tại                            | Nguyên nhân gốc đã chốt                 | Phương án hỗ trợ có giới hạn độ dài                                               | A8                                          | FR-12, FR-13, BR-11, BR-18               |
| B10      | Xác nhận bằng phép đo độc lập với phần đã luyện; tối đa 3 vòng                                      | Phương án hỗ trợ đã hoàn thành          | Đạt, hoặc chưa đạt và chuyển bắt buộc cho giáo viên sau vòng thứ ba               | A9                                          | FR-14, BR-10, EC-08                      |
| B11      | Sang chương mới với danh sách nợ kiến thức hiện rõ, không trôi qua trong im lặng                    | Trạng thái thành thạo theo từng kỹ năng | Danh sách phần còn nợ và nhóm cần xử lý tiếp                                      | A10                                         | FR-02, FR-09, BO-04                      |

## H.1. Hai chỉ số hiện trạng sau khi chuyển sang TO-BE

| **Chỉ số**               | **AS-IS (Mục 3.3)**                      | **TO-BE**                                       | **Bước tạo ra thay đổi** |
|--------------------------|------------------------------------------|-------------------------------------------------|--------------------------|
| Độ trễ phát hiện lỗ hổng | Khoảng cách giữa hai kỳ kiểm tra định kỳ | Trong phạm vi buổi học                          | B4 và B5                 |
| Độ phân giải chẩn đoán   | Cấp chương                               | Cấp kỹ năng                                     | B4 và B5                 |
| Tiêu chí gom nhóm        | Theo điểm số                             | Theo nguyên nhân gốc chung                      | B7                       |
| Căn cứ của kết luận      | Trực giác, không lưu lại                 | Chuỗi bằng chứng truy vết được và tính lại được | B3, B5, B8               |

Lưu ý về phạm vi: B1 tới B11 mô tả trạng thái mong muốn, không mô tả giải pháp. Cách hiện thực hoá từng bước nằm tại Mục 14 và Phụ lục F, và toàn bộ vẫn ở trạng thái tạm.