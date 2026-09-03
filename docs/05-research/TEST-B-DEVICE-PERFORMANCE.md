# Bài kiểm B — Hiệu năng thiết bị (Bảng F.5)

> **Phiên bản:** 1.4.5
> **Căn cứ:** BA v1.4.5 — Bảng F.5 + AS-61, TS-02, TS-03

---

## 🎯 Mục đích

Quyết định **cỡ model** (4B → 2B → 1B theo AS-61) đạt **budget** trên thiết bị mục tiêu.

---

## 📊 Phương pháp

Trên **thiết bị thật** (Android hoặc Windows):

1. Chạy `extract_evidence.dart` 30 lần với mỗi cỡ model.
2. Đo:
   - **Latency** per call (median, p95, max).
   - **RAM đỉnh** (peak RSS).
   - **Dung lượng model** trên ổ đĩa.
   - **Pin tụt** sau 30 lượt.
3. Tổng hợp → verdict.

---

## 📐 Ngưỡng (xem `TestBConfig`)

| Metric | Budget |
|---|---|
| Latency p95 | **≤ 2000 ms** |
| RAM đỉnh | **≤ 1500 MB** |
| Dung lượng model | **≤ 2500 MB** |
| Pin tụt | **≤ 5 % / 30 lượt** |
| Cỡ đo | **4B → 2B → 1B** (AS-61) |

Nếu **ít nhất 1 cỡ model** đạt budget → PASS. Chọn cỡ **nhỏ nhất** đạt (AS-61: 1B > 2B > 4B).

---

## 📁 Dữ liệu đầu vào

| File | Mô tả |
|------|-------|
| `data/device.json` | Thông tin thiết bị (model, OS, RAM) |
| `data/measurements.csv` | Output từ app Flutter sau pilot, đo trên thiết bị thật |

---

## 🚀 Chạy

### Bước 1: Đo trên thiết bị thật
Trong app Flutter, instrument `app/lib/inference/extraction/extract_evidence.dart`:

```dart
final stopwatch = Stopwatch()..start();
final peakRss = PeakRssSampler(); // platform channel
final result = await extract(text: responseText, schema: gbnf);
stopwatch.stop();
logMeasurement(
  modelSize: currentModel.size,
  attemptId: id,
  latencyMs: stopwatch.elapsedMilliseconds,
  peakRssMb: peakRss.peak,
  batteryPctBefore: battery.before,
  batteryPctAfter: battery.after,
  modelSizeOnDiskMb: model.fileSizeMb,
);
```

Sau pilot, kéo `measurements.csv` qua USB (TS-19) → đưa vào `data/measurements.csv`.

### Bước 2: Chạy bài kiểm
```bash
cd research
make test-b
# hoặc
python -m research.model_eval test_b \
    --device data/device.json \
    --measurements data/measurements.csv \
    --out reports/test_b_$(date +%Y%m%d_%H%M%S).json
```

### Bước 3: Đọc kết quả
- `verdict`: `PASS` hoặc `FAIL`.
- `best_model`: cỡ model chốt (1B / 2B / 4B / None).
- `per_size`: chi tiết metric cho từng cỡ.

---

## 🧪 Unit Test

```bash
cd research
pytest tests/test_test_b_device_performance.py -v
```

---

## ⚠️ Lưu ý quan trọng

- **Phải đo trên thiết bị thật** — máy dev không đại diện.
- **Mỗi cỡ model** phải đo đủ 30 lượt.
- **Pin tụt** cần đo qua batch 30 lượt liên tục.
- **Nhiệt độ** cũng nên ghi — có thể ảnh hưởng performance.

---

## 🔄 Quyết định theo verdict

### `verdict: PASS`
1. Chốt cỡ model theo `best_model` (nhỏ nhất đạt budget).
2. Mở PR cập nhật:
   - `app/lib/inference/model_manager.dart` — chốt cỡ mặc định.
   - `.cursor/rules/00-project-overview.mdc` — cập nhật tech stack table.

### `verdict: FAIL`
1. Không có cỡ nào đạt budget.
2. Cân nhắc:
   - Nâng cấp thiết bị tối thiểu (ràng buộc cứng).
   - Dùng Lớp 2 thuần (không LLM cục bộ).

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA v1.4.5 — Bảng F.5](../VerveAI_BA_Document_v1.4.md)
- [AS-61 thứ tự model](../VerveAI_BA_Document_v1.4.md)
- [Code: `research/src/research/model_eval/test_b_device_performance.py`](../../research/src/research/model_eval/test_b_device_performance.py)

---

**END OF DOCUMENT**
