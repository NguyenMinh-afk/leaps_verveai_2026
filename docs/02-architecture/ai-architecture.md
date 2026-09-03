# 🤖 AI Architecture — 3 lớp cục bộ

> **Phiên bản:** 1.4.5
> **Ngày:** 05/09/2026
> **Căn cứ:** BA v1.4.5 Phụ lục G.2 + ADR-0003

---

## 🎯 Mục tiêu

LEAPS chạy AI **cục bộ** (không gọi cloud) để:
- Phát hiện rào cản ngôn ngữ (FR-25, G.9).
- Diễn đạt kết quả cho GV (Lớp 3, BR-13).
- KHÔNG để LLM "chế" nhãn ngoài (GBNF — TS-04, AIR-25).
- KHÔNG để LLM bịa (fact_check_guard — AIR-24).

---

## 🧱 Kiến trúc 3 lớp

```
┌────────────────────────────────────────────────────────────┐
│  Lớp 3 — DIỄN ĐẠT                                          │
│  ─────────────────                                          │
│  inference/expression/*.dart                                │
│                                                            │
│  • explain_to_teacher.dart                                  │
│  • fill_student_template.dart    ← BR-13 (HS chỉ template) │
│  • fact_check_guard.dart         ← AIR-24 (chặn bịa)      │
│                                                            │
│  Input:  engine output (giải thích có cấu trúc)            │
│  Output: text cho người dùng                               │
└────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌────────────────────────────────────────────────────────────┐
│  Lớp 2 — TỔNG HỢP & QUYẾT ĐỊNH   ⭐ TẤT ĐỊNH (TS-07)      │
│  ─────────────────────────────────────────────              │
│  engine/*.dart                                              │
│                                                            │
│  • evidence/        (DR-11, BR-16)                          │
│  • mastery/bkt.dart (FR-06..11, 4 tham số const)           │
│  • diagnose/        (BR-01, AIR-15, FR-25)                 │
│  • item_selection/  (FR-01..05, FR-24)                     │
│  • remediation/     (FR-14..17)                            │
│  • grouping/        (BR-07/08)                             │
│  • knowledge_graph/ (TS-06)                                │
│  • versioning/      (DR-07)                                │
│  • transfer/        (FR-26)                                │
│                                                            │
│  Đặc tính: Dart thuần, KHÔNG phụ thuộc Flutter,           │
│  KHÔNG DateTime.now/Random, idempotent, deterministic.     │
│                                                            │
│  Input:  evidence (append-only)                             │
│  Output: mastery state, hypothesis ranking, plan           │
└────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌────────────────────────────────────────────────────────────┐
│  Lớp 1 — TRÍCH XUẤT                                         │
│  ─────────────────                                          │
│  inference/extraction/extract_evidence.dart                 │
│                                                            │
│  Input:  response_text + context (item, wording, latency)   │
│  Output: nhãn đóng theo GBNF (TS-04) — KHÔNG nhãn tự do    │
│                                                            │
│  Schema: inference/grammar/extraction_schema.gbnf           │
│  AIR-25: chỉ chọn nhãn đã th�m định                        │
└────────────────────────────────────────────────────────────┘
```

---

## 📐 GBNF — Grammar-Constrained Decoding (TS-04)

### Vì sao cần?
LLM có xu hướng "chế" nhãn ngoài phạm vi. Với chẩn đoán học tập, điều này **rất nguy hiểm**:
- Nhãn sai → BKT cập nhật sai → mastery lệch → can thiệp nhầm cụm HS.

### Cơ chế
- GBNF (GGML BNF) là định dạng grammar đặc tả đầu ra LLM.
- `llama.cpp` ép LLM **chỉ sinh token thoả mãn grammar**.
- Trước khi truyền prompt → load grammar:
  ```dart
  final grammar = await File('inference/grammar/extraction_schema.gbnf').readAsString();
  final ctx = await LlamaBindings.newContext(modelPath, grammar: grammar);
  ```
- Sau khi sinh → parse JSON → validate schema → mới đưa vào Lớp 2.

### Ví dụ grammar (extraction)
```gbnf
root ::= root_cause_id
root_cause_id ::= "RC-001" | "RC-002" | "RC-003" | "RC-004"
```
→ LLM **không thể** sinh `"RC-099"` hoặc `"không biết"`.

---

## 🛡️ fact_check_guard (AIR-24) — Lớp 3

### Vì sao cần?
Lớp 3 diễn đạt có thể bịa:
- Nói HS "đã hiểu" khi thực tế mastery chỉ 40%.
- Khuyến nghị GV can thiệp sai cụm.

### Cơ chế
Trước khi phát output cho người dùng:

```dart
final safeText = factCheckGuard.check(
  llmOutput: explanationText,
  evidence: evidenceList,
  masteryState: state,
  rules: [
    ClaimRequiresEvidence(),          // Mỗi claim phải có evidence
    ClaimContradictsMastery(),       // Không nói "đã hiểu" nếu mastery < 0.5
    NoImperativeForStudent(),        // BR-13 — HS không nhận mệnh lệnh
  ],
);
if (safeText == null) {
  return fallbackTemplate(state);    // Dùng template đóng
}
return safeText;
```

### Quy tắc chính

| Quy tắc | Mô tả |
|---------|-------|
| `ClaimRequiresEvidence` | Mỗi phát biểu phải trỏ về evidence cụ thể |
| `ClaimContradictsMastery` | Không nói "thành thạo" khi mastery < 0.95 |
| `NoImperativeForStudent` | BR-13 — với HS chỉ dùng template đóng, không mệnh lệnh |
| `NoImperativeForSensitiveTopics` | Tránh chủ đề nhạy cảm (NFR-23) |

---

## ⚠️ Trạng thái [A]

- Toàn bộ `app/lib/inference/` (Lớp 1 & 3) đang **[A] "chọn tạm cho pilot"**.
- **KHÔNG** đưa ra khỏi [A] trước khi Bài kiểm A & B (Bảng F.5) đạt ngưỡng.

### Bài kiểm A — chất lượng trích xuất

| Metric | Ngưỡng |
|---|---|
| Fleiss' kappa (3 GV) | ≥ 0.70 |
| Cohen's kappa TB (LLM vs GV) | ≥ 0.60 |
| Macro F1 (LLM vs consensus) | ≥ 0.65 |
| Exact-match ratio | ≥ 0.50 |

Xem: `research/src/research/model_eval/test_a_extraction_quality.py`.

### Bài kiểm B — hiệu năng thiết bị

| Metric | Budget |
|---|---|
| Latency p95 | ≤ 2000 ms |
| RAM đỉnh | ≤ 1500 MB |
| Dung lượng model | ≤ 2500 MB |
| Pin tụt | ≤ 5 % / 30 lượt |
| Cỡ đo | 4B → 2B → 1B (AS-61) |

Xem: `research/src/research/model_eval/test_b_device_performance.py`.

---

## � Validation Lớp 2 — BKT (TS-07)

- Tham số `P_L0`, `P_T`, `P_G`, `P_S` khai báo `const` trong `engine/mastery/bkt.dart`.
- `python -m research.simulation.self_consistency_check` đối chiếu log-likelihood Dart ↔ Python.
- Nếu khác → mở ADR mới, cân nhắc IRT / DKT / PFA.

---

## 📚 TÀI LIỆU LIÊN QUAN

- [VerveAI BA v1.4.5 — Phụ lục G.2](../VerveAI_BA_Document_v1.4.md)
- [ADR-0003 Local AI Architecture](./adr/0003-local-ai-architecture.md)
- [System Overview](./system-overview.md)
- [Bài kiểm A & B](../05-research/)

---

**END OF DOCUMENT**
