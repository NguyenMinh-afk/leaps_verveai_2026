# BKT Validation — TS-07

> **Phiên bản:** 1.4.5
> **Căn cứ:** BA v1.4.5 — FR-06 → FR-11, TS-07

---

## 🎯 Mục tiêu

Validate BKT (Bayesian Knowledge Tracing) trước khi đưa vào production:

- 4 tham số `P_L0`, `P_T`, `P_G`, `P_S` đặt `const` trong `app/lib/engine/mastery/bkt.dart`.
- Đảm bảo BKT là **tất định** (cùng input → cùng output).
- Đảm bảo log-likelihood từ Dart implementation khớp Python reference.

---

## 🔧 Công thức BKT

| Ký hiệu | Ý nghĩa |
|---------|---------|
| `P(L₀)` | Xác suất tiên nghiệm học sinh đã biết kỹ năng trước lượt đầu |
| `P(T)` | Xác suất học sau mỗi lượt trả lời đúng |
| `P(G)` | Xác suất trả lời đúng dù chưa học (đoán) |
| `P(S)` | Xác suất trượt dù đã học (slip) |

### Update theo Bayes
```
P(correct | L) = P(L) * (1 - P(S)) + (1 - P(L)) * P(G)
P(correct | ¬L) = P(L) * P(S) + (1 - P(L)) * (1 - P(G))

P(L | obs) = P(L) * P(obs | L) / P(obs)
```

### Sau đó áp dụng học
```
If obs == correct: P(L_new) = P(L | obs) + (1 - P(L | obs)) * P(T)
Else:              P(L_new) = P(L | obs)
```

---

## 🐍 Python Validation

### Code
```python
# research/src/research/simulation/self_consistency_check.py
```

### Chạy
```bash
cd research
python -m research.simulation.self_consistency_check
```

### Kiểm tra
- Log-likelihood của chuỗi quan sát tổng hợp.
- So sánh với kết quả từ Dart `Bkt.logLikelihood()` (qua test).
- Ngưỡng: khác biệt < 1e-9.

---

## 🎯 Dart Reference

### Code
```dart
// app/lib/engine/mastery/bkt.dart
class Bkt {
  final BktParams params;
  const Bkt({this.params = BktParams.defaults});

  BktState update(BktState prev, bool correct) {
    // ... (xem source)
  }

  double logLikelihood(Iterable<({BktState state, bool correct})> sequence) {
    // ... (xem source)
  }
}
```

### Test
```bash
cd app
flutter test test/unit/engine/mastery/bkt_test.dart
```

---

## 📊 Output

| Output | Mô tả |
|--------|-------|
| `pass: true` | Tất cả test pass, BKT sẵn sàng production |
| `pass: false` | Có test fail → mở ADR mới, cân nhắc IRT/DKT/PFA |

---

## 🚫 Khi nào cần thay đổi BKT?

- Log-likelihood Dart ≠ Python (> 1e-9).
- BKT update không idempotent.
- pKnown ra ngoài [0, 1].
- Bài kiểm A & B cho thấy Lớp 1 (trích xuất) kém → cần BKT tốt hơn.

### ADR mới cần mở
- IRT (2PL/3PL) — phù hợp khi có item difficulty.
- DKT (LSTM) — phù hợp khi sequence length quan trọng.
- PFA (Performance Factor Analysis) — variant của BKT.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [Bài kiểm A](./TEST-A-EXTRACTION.md)
- [Bài kiểm B](./TEST-B-DEVICE-PERFORMANCE.md)
- [TS-07 tất định — `app/lib/engine/mastery/bkt.dart`](../../app/lib/engine/mastery/bkt.dart)

---

**END OF DOCUMENT**
