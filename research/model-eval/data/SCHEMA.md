# Schema dữ liệu — Bài kiểm A & B

## `data/attempts.csv` — 30 bài làm thật

| Cột | Kiểu | Bắt buộc | Mô tả |
|-----|------|----------|-------|
| `attempt_id` | string | ✓ | UUIDv7, định danh lượt |
| `student_id` | string | ✓ | Mã hồ sơ (đã ẩn danh) |
| `item_id` | string | ✓ | Câu hỏi |
| `wording_complexity` | float 0..1 | ✓ | Độ phức tạp đề (do GV định) |
| `item_difficulty` | float 0..1 | ✓ | Độ khó (do GV định) |
| `response_text` | string | ✓ | Câu trả lời của HS (text/OCR) |
| `latency_ms` | int | ✓ | Thời gian trả lời |
| `context_mode` | `in-class` \| `out-of-class` | ✓ | Theo BR-16 |

## `data/gold/gold_tN.csv` — Chấm của GV thứ N (N = 1, 2, 3)

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `attempt_id` | string | Tham chiếu `attempts.csv` |
| `root_cause_id` | string | Nhãn nguyên nhân (RC-001, RC-002, …) |
| `confidence` | float 0..1 | Mức tin cậy của GV khi gán nhãn |
| `is_knowledge_gap` | bool | `true` nếu do hổng kiến thức, `false` nếu rào cản khác |
| `note` | string | Ghi chú (tuỳ chọn) |

## `data/llm_predictions.csv` — Output của `extract_evidence.dart`

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `attempt_id` | string | |
| `root_cause_id` | string | Nhãn LLM sinh (đã qua GBNF — chỉ chọn nhãn hợp lệ) |
| `confidence` | float 0..1 | Mức tin cậy của LLM |
| `model_size` | `4B` \| `2B` \| `1B` | Cỡ model dùng (TS-03, AS-61) |
| `latency_ms` | int | Thời gian inference |

## Ghi chú ẩn danh (DR-08)
- `student_id` phải qua HMAC tại hub trước khi đưa vào file này.
- `response_text` KHÔNG chứa tên thật, lớp thật, trường thật.

---

## Bài kiểm B

### `data/device.json` — Thông tin thiết bị đo

```json
{
  "device_id": "pilot-android-001",
  "platform": "android",
  "os_version": "Android 13",
  "model": "Samsung Galaxy A14",
  "ram_mb": 4096,
  "battery_mah": 5000,
  "soc": "Exynos 850",
  "notes": "Thiết bị mượn tại trường pilot X."
}
```

### `data/measurements.csv` — Đo trên thiết bị thật

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `model_size` | `4B` \| `2B` \| `1B` | Cỡ model đang chạy (TS-03, AS-61) |
| `attempt_id` | string | Lượt gọi (lặp lại cùng id để test stability) |
| `latency_ms` | int | Thời gian 1 lần gọi `extract_evidence` |
| `peak_rss_mb` | float | RAM đỉnh (MB), sample mỗi 100 ms |
| `battery_pct_before` | float | % pin trước khi chạy batch |
| `battery_pct_after` | float | % pin sau khi chạy batch |
| `model_size_on_disk_mb` | float | Dung lượng file GGUF trên ổ |

### Cách ghi trên thiết bị

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