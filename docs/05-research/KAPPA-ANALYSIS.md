# Kappa Analysis — đo độ tin cậy giữa các GV

> **Phiên bản:** 1.4.5
> **Căn cứ:** BA v1.4.5 — inter-rater reliability cho pilot

---

## 🎯 Mục đích

Trước khi dùng 3 GV chấm làm "gold standard" cho Bài kiểm A, cần kiểm tra:

- **3 GV có đồng thuận không?** (Fleiss' kappa ≥ 0.70)
- Nếu không → schema nguyên nhân chưa rõ → chỉnh trước khi LLM đánh giá.

---

## 📐 Các metric

### Cohen's Kappa (2 rater)
$$\kappa = \frac{p_o - p_e}{1 - p_e}$$

- $p_o$: tỉ lệ đồng ý quan sát được.
- $p_e$: tỉ lệ đồng ý ngẫu nhiên (theo phân bố nhãn).

| Giá trị | Diễn giải |
|---------|----------|
| < 0 | Tệ hơn ngẫu nhiên |
| 0.0 – 0.20 | Nhẹ |
| 0.21 – 0.40 | Tạm được |
| 0.41 – 0.60 | Trung bình |
| 0.61 – 0.80 | Tốt |
| 0.81 – 1.00 | Gần như hoàn hảo |

### Fleiss' Kappa (N rater)
Mở rộng Cohen cho N rater. Khi N=3 → dùng cho pilot LEAPS.

**Ngưỡng BA v1.4**: ≥ **0.70** — "chấm chặt".

---

## 🐍 Code

### Python (chạy độc lập)
```bash
cd research
python -m research.expert_agreement.kappa_analysis \
    --input data/pilot_gold.csv \
    --out reports/kappa.json
```

Input format:
```csv
attempt_id,t1,t2,t3
a001,RC-001,RC-001,RC-001
a002,RC-002,RC-001,RC-002
a003,RC-003,RC-003,RC-003
```

### Đã tích hợp vào Bài kiểm A
Khi chạy `test_a_extraction_quality.py`, Fleiss' kappa được tính tự động trong báo cáo.

---

## 📊 Cách đọc kết quả

### Nếu Fleiss ≥ 0.70
- 3 GV đồng thuận.
- Dùng majority-vote làm gold standard.
- Lập tức chạy Bài kiểm A.

### Nếu Fleiss < 0.70
- Schema nguyên nhân chưa rõ → thảo luận lại với GV.
- Hoặc: tăng số lượng bài (nhiễu ngẫu nhiên giảm).
- **KHÔNG** dùng dữ liệu này cho Bài kiểm A.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [Bài kiểm A](./TEST-A-EXTRACTION.md)
- Code: `research/src/research/expert_agreement/kappa_analysis.py`

---

**END OF DOCUMENT**
