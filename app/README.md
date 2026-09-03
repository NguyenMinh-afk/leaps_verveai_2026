# VERVEAI — App Flutter/Dart

Ứng dụng Flutter **chạy 100% offline**, một mã nguồn duy nhất cho **Android + Windows** (TS-01, CO-T-02, CO-R-01/02).

## Cấu trúc thư mục `lib/`

```
lib/
├── main.dart                          # Entry point
├── engine/                            # Lớp 2: Tổng hợp & Quyết định (tất định, Dart thuần)
│   ├── evidence/                      # DR-11, BR-16
│   ├── mastery/bkt.dart               # TS-07: Bayes tham số cố định
│   ├── diagnose/                      # BR-01, AIR-15, FR-07, BR-14, FR-25
│   ├── item_selection/                # FR-01→FR-05, FR-24
│   ├── remediation/                   # FR-14→FR-17
│   ├── grouping/cluster_by_root_cause.dart   # BR-07, BR-08
│   ├── knowledge_graph/               # TS-06
│   ├── versioning/                    # DR-07
│   └── transfer/student_transfer.dart # FR-26 (mới)
│
├── inference/                         # Lớp 1 & 3: Mô hình ngôn ngữ cục bộ
│   ├── ffi/llama_bindings.dart        # TS-02
│   ├── model_manager.dart             # TS-03, AS-61
│   ├── grammar/                       # TS-04
│   ├── extraction/extract_evidence.dart
│   └── expression/                    # BR-13, AIR-24, AIR-25
│
├── content/v1/{knowledge-graph.json, item-bank.json}
├── bootstrap/                         # AS-28: Nạp nội dung + model lần đầu
│   ├── content_installer.dart
│   ├── model_installer.dart           # Mới: cài trọng số Gemma từ USB
│   ├── bundle_verify.dart             # TS-20
│   └── first_run_wizard.dart
│
├── storage/                           # TS-05: SQLite, 1 file/cơ sở
│   ├── db.dart
│   ├── event_log.dart                 # Chỉ ghi thêm, tự luỹ đ�ng khi hợp nhất
│   ├── audit_log.dart                 # BR-05
│   ├── integrity_check.dart           # NFR-18
│   └── recovery.dart
│
├── hub/                               # SC-05: Chế độ "điểm trung tâm cục bộ"
│   ├── server.dart
│   ├── discovery.dart                 # TS-09: mDNS + mã ghép nối 6 số/QR
│   ├── crypto.dart                    # TS-10: libsodium
│   ├── logical_clock.dart             # BR-17, DR-10
│   ├── merge.dart
│   └── backup.dart                    # NFR-22 (mới)
│
├── sync/                              # SC-06: dự phòng USB
│   ├── file_exchange.dart             # TS-11
│   ├── chunked_transfer.dart
│   └── sync_strategy_resolver.dart
│
├── privacy/
│   ├── anonymize.dart                 # DR-08
│   ├── export_delete.dart             # FR-21, DR-09
│   ├── retention_policy.dart          # DR-12 (mới)
│   └── breach_notify.dart             # NFR-21 (mới)
│
├── content_security/signature_verify.dart   # Mới: Ed25519
├── auth/profile_gate.dart             # FR-22
│
├── ui/
│   ├── student/
│   ├── teacher/
│   │   ├── profile_switcher.dart
│   │   ├── intervention_dashboard.dart
│   │   └── printable_report.dart      # TS-12, SC-08
│   ├── admin/data_governance_panel.dart
│   └── shared/
│
└── main.dart
```

## Ghi chú quan trọng

- Toàn bộ nhánh `inference/` (LLM cục bộ) đang ở trạng thái **[A] "chọn tạm cho pilot"** — chờ Bài kiểm A và B chốt cỡ model cụ thể.
- Bài kiểm m�ng nhất theo F.7: Flutter + llama.cpp + 1 model 4-bit, đọc 1 bài làm mẫu → xuất bằng chứng theo lược đồ. Đo thời gian, RAM đỉnh, dung lượng, pin.
- Tuyệt đối KHÔNG đụng UI trước khi bài kiểm mỏng nhất chạy được trên thiết bị thật.

## Lệnh thường dùng

```bash
flutter pub get
flutter test                       # unit + acceptance
flutter test integration_test      # e2e trên thiết bị thật
flutter build apk --release        # Android (TS-17)
flutter build windows --release    # Windows (TS-18)
```
