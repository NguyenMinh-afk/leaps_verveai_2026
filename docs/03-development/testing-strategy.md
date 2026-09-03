# Testing Strategy

> **Bản này đồng bộ với `.cursor/rules/04-testing.mdc`.**

## 📊 Coverage Requirements

### web-portal/ (Next.js/TypeScript) — ƯU TIÊN CAO NHẤT
| Layer | Min Coverage |
|-------|--------------|
| `web-portal/src/app/` | **80%** |
| Components | **70%** |

### app/ (Flutter) — Ưu tiên sau
| Layer | Min Coverage |
|-------|--------------|
| `app/lib/engine/mastery/bkt.dart` | **90%** |
| `app/lib/engine/` (Lớp 2 — tất định) | **80%** |
| `app/lib/hub/` + `app/lib/sync/` (SC-05, SC-06) | **85%** |
| `app/lib/storage/` (SQLite append-only) | **80%** |
| `app/lib/inference/` (Lớp 1 & 3 — [A]) | **60%** (mock llama.cpp) |
| UI components | **70%** |

### research/ (Python)
| Layer | Min Coverage |
|-------|--------------|
| Python scripts | **80%** |

### Tổng thể
| Project | Min Coverage |
|---------|--------------|
| **Tổng thể** | **80%** |

## 🧪 Test Types

### 1. Unit Tests (60–75%)
- Pure functions trong `app/lib/engine/` (Dart thuần).
- BKT update (TS-07 — tất định, idempotent).
- Hypothesis ranking, FR-25 language barrier detector.
- Python: pytest cho analysis scripts.

### 2. Integration Tests (20–30%)
- `app/lib/storage/` với SQLite thật (`sqflite_common_ffi`).
- `app/lib/hub/` với HTTP nội bộ — mock network qua interface.
- Flutter `integration_test` trên thiết bị thật.

### 3. E2E Tests (5–10%)
- Critical user flows.
- Offline-first operation.
- Sync qua hub + fallback USB.

### 4. Research Tests (Python) — Bài kiểm quyết định ⭐
- `pytest` cho tất cả scripts.
- **Bài kiểm A** (`research/src/research/model_eval/test_a_extraction_quality.py`).
- **Bài kiểm B** (`research/src/research/model_eval/test_b_device_performance.py`).
- Hai bài kiểm này **quyết định [A] của `inference/`**: đạt ngưỡng mới đưa ra khỏi [A].

## ✅ MUST
- Mỗi PR phải có test — coverage không giảm.
- Test **behavior, not implementation** — refactor không được vỡ test.
- Engine (`app/lib/engine/`) test chạy độc lập với LLM.
- Khi test `inference/`: mock `LlamaBindings` qua **subclass override** (chưa cần thêm `mocktail` vào pubspec — giữ dependency gọn cho pilot).

## ❌ NEVER
- Test private methods.
- Test implementation details.
- Skip test không có lý do rõ ràng.
- Fake coverage — chỉ test happy path.
- Đưa `inference/` ra khỏi **[A]** trước khi Bài kiểm A & B đạt ngư�ng.

## 🎯 Chạy test

### web-portal/ (Next.js/TypeScript)
```bash
cd web-portal
npm install
npm run dev                             # Development server
npm run build                           # Production build
npm run lint                            # ESLint check
npm run type-check                     # TypeScript check
```

### Dart/Flutter
```bash
cd app
flutter pub get
flutter test                          # unit + acceptance
flutter test integration_test         # e2e thiết bị thật
flutter test --coverage               # coverage report
```

### Python (research/)
```bash
cd research
pip install -e ".[dev]"
make test-unit                        # pytest tests/
make test-a                           # Bài kiểm A
make test-b                           # Bài kiểm B
```

## 📚 TÀI LIỆU LIÊN QUAN
- [`.cursor/rules/04-testing.mdc`](../../.cursor/rules/04-testing.mdc) — Phiên bản rule.
- [Bài kiểm A & B](../05-research/) — research/.
- [app/test/README.md](../../app/test/README.md) — test hiện có.
