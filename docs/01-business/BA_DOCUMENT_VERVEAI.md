# Business Analysis Document — LEAPS (VerveAI)

> **Project:** LEAPS (Local Educational Adaptive Personalization System)  
> **App Name:** Verve  
> **Code Name:** VerveAI
> **Phiên bản BA Document:** 2.2
> **Ngày cập nhật:** 2026-09-06

| **Version** | **Date** | **Status** | **Changes** |
|-------------|----------|------------|-------------|
| 2.0 | 2026-09-06 | Draft | Complete rewrite following new 24-section structure |
| 2.1 | 2026-09-06 | Draft | Updated based on implementation verification — aligned FR numbers, corrected project structure, added missing implementations |
| 2.2 | 2026-09-06 | Draft | Fixed: GAP ID consistency, implementation status accuracy, BO evidence labels, NFR targets clarification, Use Case actor clarity, RTM consistency, typos |

---

**Evidence Labels:**
- **[F]** Fact — supported by source code, documentation, or direct observation
- **[I]** Inference — reasonable deduction from facts, not yet directly verified
- **[A]** Assumption — unverified, needs validation
- **[TBD]** To Be Determined — pending confirmation

---

# 1. Project Overview

## 1.1 Project Name

**LEAPS — Local Educational Adaptive Personalization System**  
*(Code name: VerveAI · App: Verve)*

## 1.2 Business Domain

Educational Technology (EdTech) — Adaptive Learning Support for Mixed-Ability Classrooms in Vietnam, specifically targeting Mathematics education at secondary school level (grades 5-7).

## 1.3 Project Purpose

Build an offline-first diagnostic assessment engine that identifies knowledge gaps at the skill level (not just chapter level) and helps teachers make differentiated intervention decisions within class time constraints.

## 1.4 Business Problem

Mathematics knowledge has a dependency structure: content builds on prior content. In mixed-ability classrooms (40-45 students), a single wrong answer can stem from multiple different root causes. Teachers currently receive only binary signals (right/wrong) without diagnostic information, forcing them to teach to the average level.

**Key insight:** The unit of analysis in current practice is *score × chapter*. The unit needed for correct intervention is *root cause × skill*. The entire project gap lies in this phase mismatch.

## 1.5 Proposed Solution

A 100% offline diagnostic engine combining:
1. **Evidence Collection** — structured recording of student work with context
2. **3-Layer AI Architecture** — extraction (LLM), deterministic decision (BKT/graph), expression (template-based)
3. **Local Hub Sync** — peer-to-peer sync without internet via mDNS/HTTP or USB backup
4. **Privacy-First Design** — data never leaves school premises, anonymized before export

## 1.6 Objectives

| **ID** | **Objective** | **Success Indicator** | **Status** |
|--------|--------------|----------------------|-------------|
| BO-01 | Reduce time-to-intervention for identified knowledge gaps | Days/lessons until detection — **TBD** | **[A]** |
| BO-02 | Enable differentiated teaching without increasing teacher workload | Weekly time comparison — **TBD** | **[A]** |
| BO-03 | Reduce number of intervention decisions per class | Intervention groups per class — **TBD** | **[A]** |
| BO-04 | Reduce knowledge debt carried to next grade/chapter | Students meeting mastery standards — **TBD** | **[A]** |
| BO-05 | Deployable in areas with no/limited internet connectivity | Days of continuous offline operation — **TBD** | **[A]** |
| BO-06 | No legal or ethical risk to student data | Zero incidents; documented legal basis | **[TBD]** |
| BO-07 | Effectiveness verifiable by independent parties | Third-party evaluation report exists | **[TBD]** |
| BO-08 | Do not widen gap between strong and weak students | Progress comparison between groups — **TBD** | **[A]** |

> **Note:** No business objective has specific numerical targets in this version. All targets marked **TBD** because baseline data has not been collected from real practice.

## 1.7 Expected Business Value

| **Value** | **Measurement** | **Status** |
|-----------|-----------------|-------------|
| Earlier detection of knowledge gaps | Reduction in detection latency | **[TBD]** |
| Fewer intervention decisions per class | Compression ratio | **[TBD]** |
| Reduced knowledge debt accumulation | Retention rate | **[TBD]** |
| Scalable to low-connectivity areas | Deployment success in T0/T1 zones | **[TBD]** |
| Privacy compliance | Zero data incidents | **[F]** |

---

# 2. Stakeholders

## 2.1 Stakeholder Classification

### Primary Stakeholders

| **ID** | **Stakeholder** | **Role** | **Responsibility** | **Interest** |
|--------|-----------------|----------|-------------------|--------------|
| SH-01 | Mathematics Teacher | Primary user; de facto decision-maker | Use system; provide domain expertise | Very High |
| SH-02 | Student | End beneficiary | Use learning features | Very High |

### Secondary Stakeholders

| **ID** | **Stakeholder** | **Role** | **Responsibility** | **Interest** |
|--------|-----------------|----------|-------------------|--------------|
| SH-03 | Subject Lead Teacher | Content reviewer | Validate knowledge graph | High |
| SH-04 | School Principal | Deployment approver | Authorize deployment | Medium |
| SH-05 | District/Provincial Education Office | Purchaser | Procurement decision | Medium |
| SH-06 | Parent | Indirectly affected | Monitor child progress | High |

### System Actors

| **ID** | **Actor** | **Description** |
|--------|-----------|----------------|
| ACT-S | Student | End user of learning features |
| ACT-T | Teacher | Primary user of diagnostic dashboard |
| ACT-A | Admin | System configuration and data export |
| ACT-R | Content Reviewer | Validates content before release |
| ACT-SY | System | Automated diagnostic engine |

## 2.2 Stakeholder Table

| **Stakeholder** | **Role** | **Responsibility** | **Interest** |
|----------------|----------|-------------------|--------------|
| SH-01 Mathematics Teacher | Primary user | Use diagnostic features; make intervention decisions | Very High |
| SH-02 Student | End beneficiary | Complete assigned learning paths | Very High |
| SH-03 Subject Lead Teacher | Content validator | Review and approve knowledge graph and content | High |
| SH-04 School Principal | Deployment approver | Authorize use at school | Medium |
| SH-05 Education Office | Purchaser | Procurement and scaling decisions | Medium |
| SH-06 Parent | Indirectly affected | Receive progress updates (optional) | High |
| SH-07 Content Author | Content provider | Create and maintain question bank | Medium |
| SH-08 Educational Research Unit | Independent evaluator | Validate methodology and results | Medium |
| SH-09 Development Team | Solution provider | Build and maintain system | Very High |
| SH-10 Evaluation Committee | Short-term evaluator | Assess project for competition/grant | High |

---

# 3. Business Problem

## 3.1 Problem Statement

> **Mathematics teachers in large, mixed-ability classrooms need a way to identify which background knowledge each student is missing and group the class into a manageable number of intervention groups within a short time window — because the right/wrong signals they receive carry no diagnostic information about root causes, forcing them to teach to the average level while watching the weaker students fall further behind each week.**

## 3.2 Problem vs Root Cause vs Impact

| **Aspect** | **Description** | **Evidence** |
|------------|-----------------|--------------|
| **Problem** | Teachers cannot identify root causes of student errors at skill level | **[F]** — from VerveAI Business Logic Document |
| **Root Cause** | Assessment tools measure *results*, not *causes*. No mapping from "wrong answer" to "which background knowledge is missing". No mechanism to determine when evidence is sufficient for conclusion. | **[F]** |
| **Impact** | Wrong intervention or no intervention; accumulating knowledge debt; widening gap in class; struggling students attribute failure to innate ability | **[I]** |

## 3.3 Three Problem Components (P-Codes)

| **Code** | **Problem Component** | **Related Gaps** |
|----------|---------------------|-------------------|
| **P1** | Cannot identify root cause at skill level; cannot determine when evidence is sufficient | GAP-01, GAP-02, GAP-05, GAP-06, GAP-07, GAP-08, GAP-09 |
| **P2** | Cannot compress intervention decisions to manageable number; boundary between human/system decision not established | GAP-03, GAP-04 |
| **P3** | Cannot serve areas with no connectivity — where need is highest | GAP-01, GAP-02 |

---

# 4. Business Objectives

See Section 1.6 above for the complete business objectives table.

## 4.1 Key Success Metrics

| **Metric** | **Current State** | **Target** | **Status** |
|------------|-------------------|------------|-------------|
| Detection latency | Weeks (between periodic assessments) | Within class period | **[TBD]** |
| Diagnostic resolution | Chapter level | Skill level | **[TBD]** |
| Intervention groups per class | Undefined (current process doesn't group) | Manageable in one lesson | **[TBD]** |
| Offline operation capability | N/A | 100% core functionality | **[TBD]** |

---

# 5. Scope

## 5.1 In Scope

| **Item** | **Description** | **Priority** | **Implementation Status** |
|----------|-----------------|--------------|-------------------------|
| Evidence collection with context | Recording student responses with timing, difficulty, context mode | Must | **[F]** — `engine/evidence/record_attempt.dart` |
| Diagnostic engine with confidence levels | Bayesian Knowledge Tracing + root cause clustering | Must | **[F]** — `engine/mastery/bkt.dart`, `engine/diagnose/` |
| Teacher dashboard with intervention groups | Grouping by root cause, sorted by priority | Must | **[F]** — `ui/teacher/intervention_dashboard.dart` |
| Offline-first architecture | 100% offline for core features | Must | **[F]** — `app/` designed offline-first |
| Local hub sync | mDNS/HTTP + USB backup for data synchronization | Must | **[F]** — `hub/`, `sync/` modules |
| Content integrity verification | Ed25519 signed content bundles | Must | **[F]** — `content_security/signature_verify.dart` |
| Data export/delete capabilities | School data portability and deletion | Must | **[F]** — `privacy/export_delete.dart` |
| Privacy controls | Anonymization, retention policies, breach notification | Must | **[F]** — `privacy/` modules |
| Knowledge graph for fractions → ratios domain | Initial content scope | Must | **[F]** — `engine/knowledge_graph/` |
| Item selection (adaptive) | Select best discriminating items | Must | **[F]** — `engine/item_selection/next_best_item.dart` |
| Remediation planning | Build minimal remediation plans | Must | **[I]** — `engine/remediation/build_plan.dart` exists; hold-out logic implemented; complete plan generation not yet validated |
| Language barrier detection | Detect non-knowledge causes | Should | **[F]** — `engine/diagnose/language_barrier_detector.dart` |
| Non-knowledge cause detection | Detect carelessness, guessing | Should | **[F]** — `engine/diagnose/non_knowledge_detector.dart` |
| Student transfer handling | Handle student class/school changes | Should | **[F]** — `engine/transfer/student_transfer.dart` |

## 5.2 Out of Scope

| **Item** | **Reason** |
|----------|------------|
| Cloud-based services | Violates offline-first requirement |
| Handwriting recognition | OS-03 decision pending; requires further analysis |
| Full curriculum coverage | MVP limited to fractions → ratios domain |
| Real-time collaboration features | Not required for core diagnostic use case |
| Gamification features | Not part of diagnostic core |
| Automated intervention delivery | BR-04 — only teacher can trigger interventions |
| Gradebook integration | Not part of MVP |

## 5.3 Development Priority (Current)

| **Priority** | **Module** | **Status** |
|--------------|------------|------------|
| **HIGHEST** | `web-portal/` (Teacher Portal, Admin Portal) | **[I]** — In early development; basic Next.js structure exists but screens not implemented |
| Next | `app/` (Flutter PWA) | **[F]** — Core engine implemented; Student UI pending |
| Later | `inference/` (LLM Layers 1 & 3) | **[A]** — Pending Test A & B |

> **Note:** `web-portal/` has extensive documentation in `docs/02-architecture/web-portal-architecture.md` with 29 screens defined, but actual implementation only has basic Next.js scaffolding (layout, page, middleware). The documentation represents the **intended design**, not current implementation.

---

# 6. AS-IS Process

## 6.1 Current Teaching Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           AS-IS TEACHING PROCESS                            │
│                                                                             │
│  A1: Teach new lesson following curriculum → Common lesson for entire class│
│       ↓                                                                    │
│  A2: Assign homework uniformly → Same exercises for all students           │
│       ↓                                                                    │
│  A3: Students do homework at home → No control over conditions            │
│       ↓                                                                    │
│  A4: Review sample solutions in class → Only a few papers can be checked  │
│       ↓                                                                    │
│  A5: Periodic assessment → Produces a NUMBER (score) only                  │
│       ↓                                                                    │
│  A6: Review class score distribution → Conclusions at CHAPTER level        │
│       ↓                                                                    │
│  A7: Group students for remediation → Groups by SCORE, not root cause      │
│       ↓                                                                    │
│  A8: Re-teach entire chapter to "weak" group → Wastes time on known content│
│       ↓                                                                    │
│  A9: Re-assessment → Results often don't improve significantly              │
│       ↓                                                                    │
│  A10: Move to next chapter → Knowledge debt accumulates                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Pain Points in Current Process

| **Step** | **Pain Point** | **Root Cause** | **Impact** |
|----------|----------------|---------------|------------|
| A1 | Fixed pace doesn't match student levels | Institutional constraint (CO-E-02) | Struggling students fall behind immediately |
| A2 | No differentiation | No diagnostic information available | Strong students bored; weak students lost |
| A3 | Uncontrolled conditions | Usage context (CO-D-07) | Noise in assessment signal |
| A4 | Most work unchecked | Large class size, limited time | Major data loss |
| A5 | Score has no diagnostic value | Assessment designed for ranking, not diagnosis | **Core bottleneck** |
| A6 | Conclusions at wrong granularity | No question-to-knowledge mapping | Interventions miss the mark |
| A7 | Groups by score, not root cause | No cause information | Heterogeneous groups |
| A8 | Re-teaches entire chapter | Doesn't know what students already mastered | Wastes time; students disengage |
| A9 | Results don't improve | Wrong intervention | Loop doesn't exit |
| A10 | Knowledge debt accumulates | Structural constraint (CO-E-02) | Gap widens over time |

---

# 7. TO-BE Process

## 7.1 Proposed Future Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TO-BE TEACHING PROCESS                            │
│                                                                             │
│  B1: Teach lesson with pre-information about groups needing attention       │
│       ↓                                                                    │
│  B2: Assign differentiated tasks by root cause group → Not by score        │
│       ↓                                                                    │
│  B3: Students work on devices; each step recorded with context            │
│       ↓                                                                    │
│  B4: Local LLM extracts structured evidence from student work            │
│       ↓                                                                    │
│  B5: Deterministic engine accumulates evidence → Returns one of three states│
│       ↓                                                                    │
│  B6: If evidence insufficient: select best discriminating item           │
│       ↓                                                                    │
│  B7: Group by root cause; sort by priority; limit to manageable number   │
│       ↓                                                                    │
│  B8: Teacher reviews evidence, accepts/adjusts/rejects system conclusion │
│       ↓                                                                    │
│  B9: Minimal remediation plan: remove mastered content, keep missing     │
│       ↓                                                                    │
│  B10: Confirm mastery via independent assessment item (max 3 loops)     │
│       ↓                                                                    │
│  B11: Move to next chapter with clear knowledge debt record              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 7.2 Key Differences AS-IS vs TO-BE

| **Dimension** | **AS-IS** | **TO-BE** |
|--------------|------------|-----------|
| Diagnostic resolution | Chapter level | Skill level |
| Detection latency | Weeks | Within class period |
| Grouping criteria | Score | Root cause |
| Evidence basis | Intuition, not recorded | Traceable evidence chain |
| Intervention targeting | Entire chapter | Just the missing part |
| Teacher-system boundary | Not defined | Teacher has final decision |

---

# 8. Functional Requirements

## 8.1 Evidence Collection

| **ID** | **Name** | **Description** | **Actor** | **Preconditions** | **Main Flow** | **Alternative/Exception** | **Expected Result** | **Priority** | **Implementation** |
|--------|----------|----------------|-----------|-------------------|---------------|-------------------------|-------------------|-------------|-------------------|
| FR-001 | Record Evidence | System records student response with context: item, response, latency, difficulty, context mode (in-class/out-of-class) | ACT-S | Content installed and validated | Student answers → System records event with UUIDv7, logical timestamp, confidence weight | If offline: queue for later sync | Complete evidence record in append-only log | Must | **[F]** `engine/evidence/record_attempt.dart` |
| FR-002 | Accumulate Evidence | System accumulates evidence across sessions and days | ACT-SY | Evidence records exist | System pulls all evidence for (student, skill) pair | If student transferred: mark discontinuity | Evidence list with context | Must | **[F]** `engine/evidence/` |
| FR-003 | Non-Knowledge Detection | System identifies evidence patterns suggesting non-knowledge causes (carelessness, guessing, language barrier) | ACT-SY | Evidence exists | System analyzes response patterns, latency, wording complexity | Flag for teacher review; don't conclude knowledge cause | Pattern flagged or neutral | Must | **[F]** `engine/diagnose/non_knowledge_detector.dart`, `language_barrier_detector.dart` |

## 8.2 Diagnostic Engine (BKT + Abstention)

| **ID** | **Name** | **Description** | **Actor** | **Preconditions** | **Main Flow** | **Alternative/Exception** | **Expected Result** | **Priority** | **Implementation** |
|--------|----------|----------------|-----------|-------------------|---------------|-------------------------|-------------------|-------------|-------------------|
| FR-004 | Calculate Mastery (BKT) | Bayesian Knowledge Tracing calculates mastery probability (pKnown) for each (student, skill) | ACT-SY | Validated knowledge graph exists; evidence exists | System applies Bayesian update with 4 const parameters: P_L0=0.10, P_T=0.20, P_G=0.20, P_S=0.10 | If no evidence: return initial pKnown = P_L0 | Numeric pKnown with transparency | Must | **[F]** `engine/mastery/bkt.dart` |
| FR-005 | Determine Root Cause | From accumulated evidence, identify the most likely root cause knowledge gap | ACT-SY | Validated knowledge graph exists; evidence exists | System identifies related background skills → Evaluates evidence for each → Calculates confidence → Returns root cause or abstention | If confidence below threshold: return "needs more evidence" | One of: root cause ID, abstention, or "already mastered" | Must | **[F]** `engine/diagnose/hypothesis_ranking.dart` |
| FR-006 | Abstain When Unsure | If evidence insufficient, system explicitly states it cannot conclude | ACT-SY | Evidence exists but below threshold | System returns abstention state with reason | If student abandons: maintain prior state | Explicit abstention, no false conclusion | Must | **[F]** `engine/diagnose/abstention.dart` |

## 8.3 Item Selection

| **ID** | **Name** | **Description** | **Actor** | **Preconditions** | **Main Flow** | **Alternative/Exception** | **Expected Result** | **Priority** | **Implementation** |
|--------|----------|----------------|-----------|-------------------|---------------|-------------------------|-------------------|-------------|-------------------|
| FR-007 | Select Discriminating Item | When evidence insufficient, select the item that best differentiates competing hypotheses | ACT-SY | Multiple hypotheses exist; item bank available | System identifies differentiating feature → Selects item that separates hypotheses best | If no discriminating item: abstain | Selected item with rationale | Must | **[F]** `engine/item_selection/next_best_item.dart` |
| FR-008 | Track Recent Items | System tracks which items student has seen recently to avoid repetition | ACT-SY | Student has attempted items | System maintains recent_item_tracker with configurable window | If history empty: return empty | List of recent item IDs | Must | **[F]** `engine/item_selection/recent_item_tracker.dart` |
| FR-009 | Minimize Assessment Burden | Limit number of items student must complete before receiving support | ACT-SY | Student in assessment | System prioritizes high-information items | If student abandons: don't infer from incomplete | Reduced item count vs random selection | Must | **[F]** `engine/item_selection/next_best_item.dart` |

## 8.4 Remediation Support

| **ID** | **Name** | **Description** | **Actor** | **Preconditions** | **Main Flow** | **Alternative/Exception** | **Expected Result** | **Priority** | **Implementation** |
|--------|----------|----------------|-----------|-------------------|---------------|-------------------------|-------------------|-------------|-------------------|
| FR-010 | Build Minimal Remediation Plan | Create remediation plan that includes only missing skills, excludes mastered content | ACT-SY | Root cause identified | System identifies missing skills → Removes already-mastered prerequisites → Creates minimal path | If path too long: apply limit; split into phases | Plan excluding mastered content | Must | **[F]** `engine/remediation/build_plan.dart` |
| FR-011 | Hold-Out Verification | Confirm mastery using different item than practice (verification item must differ from practice) | ACT-SY | Remediation completed | System selects independent verification item via hold_out_check | If mastery not confirmed after loops: escalate to teacher | Confirmation or escalation | Must | **[F]** `engine/remediation/hold_out_check.dart` |
| FR-012 | Maintain Grade-Level Access | Student must still access current grade content during remediation | ACT-SY | Remediation in progress | System ensures remediation doesn't block current lesson access | If conflict: prioritize current lesson | Both remediation and grade content accessible | Must | **[I]** — Logic design exists; needs full implementation and UI |
| FR-013 | Extended Content for Advanced | Provide extended content when student has mastered prerequisites | ACT-SY | Student mastered all prerequisites | System offers extension when current-level item incorrect | — | Extension content offered | Should | **[I]** — Logic design exists; needs content and UI |

## 8.5 Teacher Decision Support

| **ID** | **Name** | **Description** | **Actor** | **Preconditions** | **Main Flow** | **Alternative/Exception** | **Expected Result** | **Priority** | **Implementation** |
|--------|----------|----------------|-----------|-------------------|---------------|-------------------------|-------------------|-------------|-------------------|
| FR-014 | Present Intervention Groups | Aggregate individual diagnoses into class-level intervention groups | ACT-SY | Multiple student diagnoses exist | System groups students by shared root cause → Sorts by priority (size → severity → alphabet) → Limits to manageable number | If too many groups: merge similar causes | Grouped list with evidence summary | Must | **[F]** `engine/grouping/cluster_by_root_cause.dart` |
| FR-015 | Show Evidence Chain | Display the evidence chain leading to each conclusion | ACT-T | Conclusion exists | Teacher requests evidence → System shows all evidence items with timestamps | If teacher wants more: show full detail | Transparent evidence presentation | Must | **[I]** — `ui/teacher/intervention_dashboard.dart` stub exists; full evidence chain UI not implemented |
| FR-016 | Teacher Override | Teacher can accept, reject, or adjust any system conclusion | ACT-T | Conclusion exists | Teacher disagrees → Overrides with reason → System records override; original preserved for audit | If teacher and system conflict: teacher's decision wins | Override recorded; original preserved | Must | **[F]** `hub/merge.dart` with teacher annotation priority |
| FR-017 | View Class Status Offline | Teacher can view aggregated class information without connectivity | ACT-T | Evidence exists on hub | Teacher requests class view → Hub serves from local storage | If hub unavailable: show cached or partial data | Complete class view | Must | **[I]** — `hub/server.dart` implements API; UI components in `ui/teacher/` partial |
| FR-018 | Add Personal Notes | Teacher can add personal notes or custom items | ACT-T | Conclusion exists | Teacher adds note → System associates with student/conclusion | — | Note attached to record | Should | **[I]** — `hub/merge.dart` supports teacher annotations; full UI not implemented |
| FR-019 | Printable Report | Teacher can export printable PDF report | ACT-T | Data exists | Teacher requests export → System generates PDF directly from app | If generation fails: show error | PDF file generated | Should | **[I]** — `ui/teacher/printable_report.dart` stub exists; PDF generation not implemented |

## 8.6 Content and Data Management

| **ID** | **Name** | **Description** | **Actor** | **Preconditions** | **Main Flow** | **Alternative/Exception** | **Expected Result** | **Priority** | **Implementation** |
|--------|----------|----------------|-----------|-------------------|---------------|-------------------------|-------------------|-------------|-------------------|
| FR-020 | Review Content Before Release | Content must be reviewed by subject expert before reaching students | ACT-R | Content exists | Reviewer accesses queue → Reviews for correctness, age-appropriateness → Signs if approved | If rejected: return for revision | Signed content bundle | Must | **[F]** `content-pipeline/` with review module |
| FR-021 | Export and Delete Data | School can export all data and request deletion | ACT-A | School data exists | Admin requests export → System generates archive → Admin confirms deletion | If deletion request: immediate or scheduled | Data export or secure deletion | Must | **[I]** — `privacy/export_delete.dart` exists; UI not fully integrated |
| FR-022 | Profile Gate on Shared Devices | On shared devices, students see only their own data | ACT-S | Shared device scenario | Student opens app → Confirms profile → System enforces data isolation | If wrong profile: require explicit switch | Data isolation enforced | Should | **[I]** — `auth/profile_gate.dart` exists; `ui/teacher/profile_switcher.dart` partial |
| FR-023 | Anonymize Data Before Export | Student identifying data must be anonymized before leaving hub | ACT-SY | Data for export exists | System applies HMAC anonymization at hub before export | If hub key lost: anonymization irreversible | Anonymized data only | Must | **[I]** — `privacy/anonymize.dart` exists; integration with export flow partial |
| FR-024 | Recompute Conclusions | When model/logic version changes, conclusions can be recomputed from original evidence | ACT-SY | New version exists; original evidence intact | System recalculates diagnoses using new engine version | If evidence corrupted: flag for review | Recomputed conclusions with version tag | Must | **[I]** — `engine/versioning/recompute.dart` stub exists; not end-to-end tested |
| FR-025 | Student Transfer | Handle student transferring class/school while preserving evidence | ACT-SY | Transfer request exists | System generates transfer events, exports encrypted archive | If destination offline: queue for sync | Evidence transferred with new school | Should | **[I]** — `engine/transfer/student_transfer.dart` exists; end-to-end flow not tested |

---

# 9. Non-Functional Requirements

## 9.1 Performance

| **ID** | **Category** | **Requirement** | **Measure** | **Evidence** |
|--------|--------------|----------------|-------------|--------------|
| NFR-001 | Performance | Core functionality works without connectivity | 100% offline for core features | **[F]** — core design principle |
| NFR-002 | Performance | App size within reasonable limits | **TARGET:** ~1 GB total (content + model) | **[TBD]** — acceptance threshold; not yet validated on target devices |
| NFR-003 | Performance | Diagnostic result available within lesson pace | **TARGET:** < 2 seconds at p95 | **[TBD]** — acceptance threshold; not yet empirically validated |
| NFR-004 | Performance | Works on common low-end devices at target deployment area | **TARGET:** specific device specs TBD | **[TBD]** — acceptance threshold; pending OQ-07 device survey |

## 9.2 Scalability

| **ID** | **Category** | **Requirement** | **Measure** | **Evidence** |
|--------|--------------|----------------|-------------|--------------|
| NFR-005 | Scalability | Supports 50 students per class, 500 devices per school | **TARGET:** 50 students/class, 500 devices/school | **[TBD]** — design assumption; not yet load-tested |

## 9.3 Availability

| **ID** | **Category** | **Requirement** | **Measure** | **Evidence** |
|--------|--------------|----------------|-------------|--------------|
| NFR-006 | Availability | Continuous operation without internet | 100% offline | **[F]** — design requirement |

## 9.4 Security

| **ID** | **Category** | **Requirement** | **Measure** | **Evidence** |
|--------|--------------|----------------|-------------|--------------|
| NFR-007 | Security | No unvalidated content reaches students | Signed bundles only | **[F]** — Ed25519 signing requirement |
| NFR-008 | Security | Identifying data never leaves school premises | Anonymization before export | **[F]** — privacy architecture |
| NFR-009 | Security | Results not used for decisions affecting student rights | Policy constraint | **[F]** — BR-12 |
| NFR-010 | Security | Data breach detection and notification | Documented process exists; **TARGET:** zero undetected breaches | **[I]** — `privacy/breach_notify.dart` stub exists; full workflow not implemented or tested |
| NFR-011 | Security | Channel encryption for hub sync | libsodium encryption | **[F]** — `hub/crypto.dart` |

## 9.5 Reliability

| **ID** | **Category** | **Requirement** | **Measure** | **Evidence** |
|--------|--------------|----------------|-------------|--------------|
| NFR-012 | Reliability | No data loss during sync, even with interruptions | Zero data loss | **[F]** — append-only design |
| NFR-013 | Reliability | Deterministic decisions: same evidence + same version = same result | Idempotent recomputation | **[F]** — TS-07 requirement, `engine/mastery/bkt.dart` |
| NFR-014 | Reliability | All conclusions recomputable from original evidence | Audit capability | **[F]** — append-only event log |
| NFR-015 | Reliability | Data integrity verified on startup | Checksum validation | **[F]** — `storage/integrity_check.dart` |

## 9.6 Maintainability

| **ID** | **Category** | **Requirement** | **Measure** | **Evidence** |
|--------|--------------|----------------|-------------|--------------|
| NFR-016 | Maintainability | No technical staff required at school for operation | **TARGET:** self-service deployment achievable | **[TBD]** — acceptance criterion; not yet validated with teachers |
| NFR-017 | Maintainability | Hub backup and recovery when teacher device fails | **TARGET:** restore capability exists; **ACCEPTANCE:** backup verified restorable | **[I]** — `hub/backup.dart` exists; restore workflow not fully implemented or tested |

## 9.7 Observability

| **ID** | **Category** | **Requirement** | **Measure** | **Evidence** |
|--------|--------------|----------------|-------------|--------------|
| NFR-018 | Observability | Teacher can explain system reasoning in professional terms | **TARGET:** explanation comprehensible to non-technical teacher | **[TBD]** — acceptance criterion; not yet validated with teachers |

## 9.8 Usability

| **ID** | **Category** | **Requirement** | **Measure** | **Evidence** |
|--------|--------------|----------------|-------------|--------------|
| NFR-019 | Usability | No ability labels shown to students or parents | Label-free display | **[F]** — BR-13 requirement |

---

# 10. User Stories

## Epic 1: Evidence Collection

| **ID** | **User Story** | **Priority** | **Acceptance Criteria** |
|--------|----------------|--------------|-------------------------|
| US-001 | As a **student**, I want my work results to be fully recorded, so the system understands where I'm struggling | Must | Given: student completes an item; When: system records response; Then: complete evidence record exists with context |
| US-002 | As a **teacher**, I want every attempt to leave a trace, so I don't lose information as when I can only check some papers | Must | Given: student completes work; When: evidence recorded; Then: complete history preserved even if teacher only checks subset |

## Epic 2: Diagnosis

| **ID** | **User Story** | **Priority** | **Acceptance Criteria** |
|--------|----------------|--------------|-------------------------|
| US-003 | As a **teacher**, I want to know why this student is wrong, not just that they're wrong, so I don't have to guess | Must | Given: student answered incorrectly; When: system diagnoses; Then: returns root cause knowledge gap with confidence |
| US-004 | As a **teacher**, I want the system to clearly state when evidence is insufficient, so I don't act on unsupported conclusions | Must | Given: evidence below threshold; When: system diagnoses; Then: returns abstention state, not a false conclusion |
| US-005 | As a **student**, I want to not answer too many questions before getting help, so I don't get frustrated | Must | Given: student needs diagnostic; When: system selects items; Then: selects highest-information items first |
| US-006 | As a **teacher**, I want the system to distinguish carelessness from knowledge gaps, so I don't misplace students in remediation groups | Should | Given: response pattern suggests non-knowledge cause; When: system diagnoses; Then: flags non-knowledge cause, doesn't conclude knowledge gap |

## Epic 3: Student Support

| **ID** | **User Story** | **Priority** | **Acceptance Criteria** |
|--------|----------------|--------------|-------------------------|
| US-007 | As a **student**, I want to only relearn what I actually don't know, so I don't waste time on mastered content | Must | Given: root cause identified; When: system builds plan; Then: plan excludes already-mastered skills |
| US-008 | As a **student**, I want to still access current grade content, so I'm not left behind while remediating | Must | Given: student in remediation; When: student works; Then: current lesson content remains accessible |
| US-009 | As a **teacher**, I want to know if students genuinely understand or just saw the solution, so I trust the results | Must | Given: student completed practice; When: system verifies; Then: uses different items than practice |
| US-010 | As an **advanced student**, I want to receive extended content when I've mastered the basics, so I don't sit through easy material | Should | Given: student mastered all prerequisites; When: student answers current-level item incorrectly; Then: offers extension, not remediation |

## Epic 4: Teacher Decision Support

| **ID** | **User Story** | **Priority** | **Acceptance Criteria** |
|--------|----------------|--------------|-------------------------|
| US-011 | As a **teacher**, I want to know how many intervention groups I have and which to address first, so I can use my 45 minutes effectively | Must | Given: class evidence exists; When: teacher views dashboard; Then: sees grouped interventions sorted by priority, limited to manageable number |
| US-012 | As a **teacher**, I want to see the evidence chain for each conclusion, so I can verify rather than blindly trust | Must | Given: system presented a conclusion; When: teacher requests evidence; Then: complete evidence chain displayed |
| US-013 | As a **teacher**, I want to be able to reject or adjust conclusions when I know better, so I retain professional authority | Must | Given: system conclusion; When: teacher disagrees; Then: teacher override recorded, original preserved |
| US-014 | As a **teacher**, I want to add my own notes or custom items, so I incorporate what the system doesn't know | Should | Given: system conclusion exists; When: teacher adds note; Then: note associated with record |
| US-015 | As a **teacher**, I want assurance this data won't be used to evaluate me, so I'll use it freely | Must | Given: system collects evidence; When: teacher uses system; Then: data cannot be used for teacher evaluation |

## Epic 5: Offline Operation

| **ID** | **User Story** | **Priority** | **Acceptance Criteria** |
|--------|----------------|--------------|-------------------------|
| US-016 | As a **student**, I want to continue learning when there's no network, so my learning doesn't depend on infrastructure where I live | Must | Given: no connectivity; When: student works; Then: complete workflow available offline |
| US-017 | As a **teacher**, I want to view class status right in the classroom without network, so I make decisions during class not after | Must | Given: no connectivity; When: teacher opens dashboard; Then: class information displayed immediately |
| US-018 | As a **teacher**, I want data to sync automatically when connectivity returns without loss, so I don't have to do anything extra | Must | Given: sync interrupted; When: connectivity restored; Then: no data loss, no duplication |

## Epic 6: Content and Data Governance

| **ID** | **User Story** | **Priority** | **Acceptance Criteria** |
|--------|----------------|--------------|-------------------------|
| US-019 | As a **content reviewer**, I want to approve content before it reaches students, so I take responsibility for what I sign | Must | Given: content exists; When: reviewer approves; Then: Ed25519 signature applied, content released |
| US-020 | As a **school administrator**, I want to export and delete my school's data, so I'm in control of privacy risk | Must | Given: school data exists; When: admin requests export/delete; Then: complete archive produced, data securely deleted |
| US-021 | As a **student** sharing a device with others, I want my results not to appear for the next user, so I'm not embarrassed | Should | Given: shared device; When: student opens app; Then: only that student's data displayed |

---

# 11. Use Cases

## 11.1 Use Case Summary

| **Category** | **UC ID** | **Use Case** | **Primary Actor** | **Trigger** | **Automated Behavior** | **Priority** |
|-------------|-----------|--------------|-------------------|-------------|---------------------|--------------|
| E1 — Evidence | UC-001 | Record student response | Student (ACT-S) | Student submits answer | System records event with UUIDv7 and logical timestamp | Must |
| E1 — Evidence | UC-002 | Accumulate evidence across sessions | System (automated) | New evidence recorded | System aggregates evidence for (student, skill) pair | Must |
| E2 — Diagnosis | UC-003 | Calculate mastery with BKT | System (automated) | Evidence updated | System applies Bayesian update with const parameters | Must |
| E2 — Diagnosis | UC-004 | Determine root cause of error | System (automated) | Evidence accumulated | System evaluates hypotheses, calculates confidence | Must |
| E2 — Diagnosis | UC-005 | Abstain when evidence insufficient | System (automated) | Confidence below threshold | System returns explicit abstention state | Must |
| E2 — Diagnosis | UC-006 | Select discriminating item | System (automated) | Abstention or new assessment | System selects highest-information item | Must |
| E2 — Diagnosis | UC-007 | Identify non-knowledge causes | System (automated) | Evidence patterns analyzed | System flags carelessness, guessing, language barrier | Must |
| E3 — Support | UC-008 | Build minimal remediation plan | System (automated) | Root cause identified | System excludes mastered skills, creates minimal path | Must |
| E3 — Support | UC-009 | Verify mastery with hold-out items | System (automated) | Remediation completed | System selects independent verification item | Must |
| E3 — Support | UC-010 | Transition to extended content when mastered | System (automated) | Student mastered prerequisites | System offers extension content | Should |
| E4 — Teacher | UC-011 | Present intervention groups with priority | Teacher (ACT-T) | Teacher requests view | System aggregates diagnoses, groups by root cause | Must |
| E4 — Teacher | UC-012 | Teacher reviews evidence and decides | Teacher (ACT-T) | Teacher views conclusion | — | Must |
| E4 — Teacher | UC-013 | Teacher overrides or adjusts conclusion | Teacher (ACT-T) | Teacher disagrees | System records override, preserves original | Must |
| E4 — Teacher | UC-014 | Teacher adds personal notes | Teacher (ACT-T) | Teacher adds note | System associates note with record | Should |
| E4 — Teacher | UC-015 | Export printable report | Teacher (ACT-T) | Teacher requests export | System generates PDF report | Should |
| E5 — Offline | UC-016 | Aggregate class evidence when offline | System (automated) | Evidence recorded on device | Hub aggregates without cloud dependency | Must |
| E5 — Offline | UC-017 | Sync data when connectivity returns | System (automated) | Connectivity available | System merges evidence, resolves conflicts | Must |
| E5 — Offline | UC-018 | Install and update content by version | System (automated) | New bundle available | System verifies signature, installs bundle | Must |
| E6 — Governance | UC-019 | Review and approve content | Content Reviewer (ACT-R) | New content pending | — | Must |
| E6 — Governance | UC-020 | Recompute conclusions when model updates | System (automated) | New engine version | System recalculates from original evidence | Must |
| E6 — Governance | UC-021 | Export and delete school data | Admin (ACT-A) | Admin requests action | System anonymizes and exports | Must |
| E6 — Governance | UC-022 | Switch student profile on shared device | Student (ACT-S) | Student opens app | System enforces data isolation | Should |
| E6 — Governance | UC-023 | Anonymize data before export | System (automated) | Export initiated | System applies HMAC anonymization at hub | Must |
| E6 — Governance | UC-024 | Handle student transfer | System (automated) | Transfer request | System generates transfer events, exports archive | Should |

## 11.2 Actor Mapping

| **Actor** | **Use Cases (Primary)** | **Use Cases (Automated)** |
|-----------|------------------------|-------------------------|
| ACT-S (Student) | UC-001, UC-022 | UC-002 |
| ACT-T (Teacher) | UC-011, UC-012, UC-013, UC-014, UC-015 | — |
| ACT-SY (System) | — | UC-002, UC-003, UC-004, UC-005, UC-006, UC-007, UC-008, UC-009, UC-010, UC-016, UC-017, UC-018, UC-020, UC-023, UC-024 |
| ACT-R (Reviewer) | UC-019 | — |
| ACT-A (Admin) | UC-021 | — |

---

# 12. Business Rules

## 12.1 Diagnostic Rules

| **ID** | **Rule** | **Evidence** |
|--------|----------|--------------|
| BR-001 | When evidence confidence is below threshold, system MUST NOT conclude root cause; must return abstention state | **[F]** — `engine/diagnose/abstention.dart` |
| BR-002 | Confidence must account for probability of correct-by-chance responses | **[F]** — BR-02 in business logic |
| BR-003 | Root cause is class-level gap when appearing in ≥30% of class (rounded down), minimum absolute 3 students | **[F]** — `engine/grouping/cluster_by_root_cause.dart` |
| BR-004 | Priority: larger affected group + more blocking knowledge first; tie-break: earlier conclusion, then earlier in dependency chain | **[F]** — `engine/grouping/cluster_by_root_cause.dart` |
| BR-005 | When evidence suggests non-knowledge cause, system MUST NOT conclude knowledge gap | **[F]** — `engine/diagnose/non_knowledge_detector.dart`, `language_barrier_detector.dart` |
| BR-006 | In-class evidence has higher confidence weight than out-of-class evidence | **[F]** — `engine/evidence/evidence_context.dart` |

## 12.2 Student Support Rules

| **ID** | **Rule** | **Evidence** |
|--------|----------|--------------|
| BR-007 | Verification items must differ from practice items | **[F]** — `engine/remediation/hold_out_check.dart` |
| BR-008 | Remediation plans must have length limit; student must still access current grade content | **[F]** — `engine/remediation/build_plan.dart` |
| BR-009 | Remediation plan must exclude already-confirmed mastered content | **[F]** — `engine/remediation/build_plan.dart` |

## 12.3 Teacher Authority Rules

| **ID** | **Rule** | **Evidence** |
|--------|----------|--------------|
| BR-010 | Teacher decision always overrides system conclusion | **[F]** — `hub/merge.dart` |
| BR-011 | System must never automatically deliver intervention to student without teacher action | **[F]** — design principle |
| BR-012 | Every teacher override must be recorded; original conclusion must be preserved | **[F]** — `hub/merge.dart` |

## 12.4 Safety Rules

| **ID** | **Rule** | **Evidence** |
|--------|----------|--------------|
| BR-013 | Automated tools must not modify correct answers, original content, or validated knowledge graph | **[F]** — design principle |
| BR-014 | System results must not be used for decisions affecting student academic rights | **[F]** — design principle |
| BR-015 | Display for students/parents must use skill-focused language, not ability labels or grade labels | **[F]** — design principle |
| BR-016 | System data must not be used for teacher evaluation | **[F]** — design principle |
| BR-017 | One student's diagnostic results must not be visible to other students | **[F]** — `auth/profile_gate.dart` |

## 12.5 Data and Offline Rules

| **ID** | **Rule** | **Evidence** |
|--------|----------|--------------|
| BR-018 | Every conclusion must be recomputable from original evidence; original evidence must not be modified or deleted | **[F]** — `storage/event_log.dart`, append-only design |
| BR-019 | Event ordering must not be based on device clocks | **[F]** — `hub/logical_clock.dart` |
| BR-020 | Every conclusion must be tagged with knowledge graph version and logic version | **[F]** — `engine/versioning/` |
| BR-021 | Student identifying data must not leave school premises; data for analysis must be anonymized at source | **[F]** — `privacy/anonymize.dart` |
| BR-022 | Audit log must record all admin operations with Ed25519 signature | **[F]** — `storage/audit_log.dart` |

---

# 13. Data & Business Entities

## 13.1 Core Entities

| **Entity** | **Description** | **Key Attributes** | **Implementation** |
|------------|-----------------|-------------------|-------------------|
| Student | End user receiving diagnostic and support | studentId, currentProfile, assignedInterventions | `auth/profile_gate.dart` |
| Teacher | Primary user making instructional decisions | teacherId, assignedClasses | — |
| EvidenceEvent | Atomic record of student response | eventId (UUIDv7), studentId, itemId, response, latencyMs, contextMode, confidenceWeight, logicalTimestamp, deviceId, sessionId, syncStatus | `engine/evidence/record_attempt.dart`, `storage/event_log.dart` |
| Item | Assessment question | itemId, content, correctAnswer, difficulty, attachedSkills[] | `engine/knowledge_graph/` |
| Skill | Knowledge unit in dependency graph | skillId, name, description, dependsOn[] | `engine/knowledge_graph/graph.dart`, `schema.dart` |
| KnowledgeGraph | Dependency structure of skills | graphId, version, skills[], dependencies[] | `engine/knowledge_graph/` |
| BktState | Mastery state for (student, skill) | studentId, skillId, pKnown | `engine/mastery/bkt.dart` |
| Diagnosis | System conclusion about root cause | diagnosisId, studentId, skillId, confidence, status (concluded/abstained/mastered), timestamp | `engine/diagnose/` |
| InterventionGroup | Aggregated group for teacher action | groupId, rootCauseSkillId, studentIds[], priority, evidenceSummary | `engine/grouping/cluster_by_root_cause.dart` |
| TeacherOverride | Record of teacher decision | overrideId, diagnosisId, teacherDecision, reason, timestamp | `hub/merge.dart` |
| ContentBundle | Validated content package | bundleId, version, signature, items[], knowledgeGraph | `content-pipeline/` |
| AuditLogEntry | Immutable record of admin actions | eventId, actorId, action, targetScope, timestamp, signature | `storage/audit_log.dart` |

## 13.2 Entity Relationships

```
Student ─1:M─ EvidenceEvent ─M:1─ Item
Skill ─1:M─ Item (through attachedSkills)
Skill ─self─ KnowledgeGraph.dependencies
Student ─1:M─ BktState
BktState ─M:1─ Skill
Student ─1:M─ Diagnosis
Diagnosis ─M:1─ Skill (root cause)
Diagnosis ─M:1─ TeacherOverride (optional)
TeacherOverride ─M:1─ Teacher
Diagnosis ─M:M─ InterventionGroup (through studentIds)
ContentBundle ─1:M─ Item
ContentBundle ─1:1─ KnowledgeGraph
```

---

# 14. Integration & External Systems

## 14.1 Internal Modules

| **Module** | **Technology** | **Purpose** | **Implementation Status** |
|-----------|---------------|-------------|--------------------------|
| app/ (Flutter) | Flutter/Dart | Primary application for students and teachers | **[F]** — Core engine implemented; Student UI pending |
| web-portal/ | Next.js/TypeScript | Teacher dashboard (documented in web-portal-architecture.md) | **[I]** — Basic scaffolding exists; full implementation in progress |
| content-pipeline/ | TypeScript/Node | Content authoring, verification, and packaging | **[F]** — Modules exist |
| research/ | Python | Validation studies, model evaluation | **[F]** — Test A & B scripts exist |

## 14.2 External Dependencies

| **System** | **Purpose** | **Integration** |
|------------|-------------|-----------------|
| USB Storage | Content/model distribution, backup sync | File archive with Ed25519 signing |
| Local Network (mDNS) | Device discovery and hub communication | HTTP over local network |
| Gemma LLM (local) | Evidence extraction, natural language explanation | llama.cpp via FFI |
| SQLite | Local storage | Append-only event log |

## 14.3 No External Services

| **Service** | **Reason for Exclusion** |
|-------------|------------------------|
| Cloud APIs | Violates offline-first requirement |
| Firebase/Supabase | Violates offline-first requirement |
| Google Analytics | Privacy concern for student data |
| Any third-party SaaS | Data sovereignty requirement |

---

# 15. Event-Driven / Sync Architecture

## 15.1 Hub Sync Flow (SC-05, SC-06)

```
┌─────────────┐      mDNS + 6-digit code      ┌──────────────┐
│ Student     │ ◄────────────────────────────► │ Teacher Hub   │
│ Device      │                               │ (HTTP server)│
│ (Flutter)   │   ┌──────────────────┐       │              │
│             │   │ Local Engine      │       │ - Merge      │
│ - Evidence  │   │ (Dart, BKT)      │       │ - Backup     │
│ - Storage   │   │ Deterministic     │       │ - Crypto     │
│ - Privacy   │   └──────────────────┘       └──────────────┘
└─────────────┘            │                        │
                          │ USB (fallback)         │
                          ▼                        ▼
                   ┌─────────────────────────────────┐
                   │           USB Drive              │
                   │  - model.gguf (Gemma 4-bit)    │
                   │  - content-bundle.zip         │
                   │  - evidence-archive.enc       │
                   └─────────────────────────────────┘
```

## 15.2 Sync Components

| **Component** | **Description** | **Implementation** |
|--------------|-----------------|-------------------|
| EvidenceRecorder | Records student responses with context | `engine/evidence/record_attempt.dart` |
| HubServer | HTTP server on teacher's device | `hub/server.dart` |
| LogicalClock | Lamport-style timestamp for event ordering | `hub/logical_clock.dart` |
| MergeEngine | Append-only conflict resolution | `hub/merge.dart` |
| Crypto | libsodium encryption for channel | `hub/crypto.dart` |
| Discovery | mDNS + QR code pairing | `hub/discovery.dart` |
| Backup | Daily hub backup | `hub/backup.dart` |
| FileExchange | USB archive creation/import | `sync/file_exchange.dart` |
| ChunkedTransfer | Chunked transfer for large files | `sync/chunked_transfer.dart` |
| SyncStrategyResolver | Auto-select hub vs USB based on conditions | `sync/sync_strategy_resolver.dart` |
| ContentInstaller | Verifies Ed25519 signature, installs bundle | `bootstrap/content_installer.dart` |
| BundleVerify | Verify bundle integrity | `bootstrap/bundle_verify.dart` |

## 15.3 Business Purpose of Sync Events

| **Event** | **Business Purpose** |
|-----------|----------------------|
| Evidence append | Creates audit trail for all diagnostic decisions |
| Hub aggregation | Enables class-level view without cloud dependency |
| Teacher annotation | Captures professional judgment for audit and override |
| Backup | Protects against single point of failure (teacher device) |
| USB fallback | Ensures operation in areas without local network |

---

# 16. AI / Business Intelligence

## 16.1 AI Use Cases

| **Use Case** | **Input** | **Processing** | **Output** | **Business Value** | **Status** |
|--------------|-----------|----------------|------------|-------------------|------------|
| Evidence Extraction | Student work (text/response) | LLM with GBNF grammar | Structured evidence with skill labels | Reduces manual input; enables scale | **[A]** |
| Natural Language Explanation | Evidence chain + mastery state | Template filling with fact-check | Teacher-readable explanation | Trust and adoption | **[A]** |
| Student Template Messages | Mastery state | Pre-approved templates | Student-facing messages | BR-015 compliance | **[A]** |

## 16.2 AI Architecture (3 Layers)

```
┌────────────────────────────────────────────────────────────┐
│  Layer 3 — Expression (inference/expression/)             │
│  - Template-based output for students (BR-015)          │
│  - fact_check_guard to prevent hallucination             │
│  - explain_to_teacher for diagnostic explanations          │
├────────────────────────────────────────────────────────────┤
│  Layer 2 — Decision (engine/*) — DETERMINISTIC           │
│  - Bayesian Knowledge Tracing (BKT)                       │
│  - Root cause clustering (BR-003/004)                    │
│  - Hypothesis ranking with confidence                     │
│  - NO dependency on LLM for decisions                     │
├────────────────────────────────────────────────────────────┤
│  Layer 1 — Extraction (inference/extraction/)            │
│  - LLM reads student work → structured evidence          │
│  - GBNF grammar constrains output to approved labels     │
│  - Runs locally via llama.cpp FFI                        │
└────────────────────────────────────────────────────────────┘
```

## 16.3 AI Decision Status

| **Component** | **Status** | **Evidence** |
|--------------|------------|--------------|
| Layer 2 (Deterministic Engine) | Implemented | `engine/*` modules exist |
| Layer 1 (LLM Extraction) | **[A]** | `inference/extraction/` exists; pending Test A |
| Layer 3 (Expression) | **[A]** | `inference/expression/` exists; pending Test A |

## 16.4 Failure/Fallback Behavior

| **Scenario** | **Behavior** | **Human/System Responsibility** |
|-------------|--------------|--------------------------------|
| LLM extraction fails | Use deterministic engine only | System continues with reduced capability |
| LLM hallucination detected | fact_check_guard returns null → use static template | System prevents misinformation |
| Insufficient evidence | Return abstention state | System cannot conclude; human decides |
| Model version changes | Mark conclusions for recomputation | System flags affected records; human schedules review |

---

# 17. Assumptions

| **ID** | **Assumption** | **Impact if False** | **Validation** |
|--------|---------------|--------------------|----------------|
| A-001 | Teacher doesn't already know each student's root causes | Product loses value proposition | OQ-01 |
| A-002 | A correct answer exists for "what is the root cause" | Diagnostic approach invalid | OQ-02 |
| A-003 | Correct diagnosis → correct intervention → better outcomes chain is unbroken | Product doesn't improve student outcomes | Longitudinal study |
| A-004 | Each error has one dominant root cause | Oversimplification of diagnostic model | Analysis of real student work |
| A-005 | Students are trying their best and working independently | Evidence quality compromised | OQ-10 |
| A-006 | Teachers are permitted to reorganize classroom activities | Differentiated instruction not feasible | OQ-12 |
| A-007 | Knowledge gaps are missing knowledge, not misconceptions | Diagnostic model insufficient | Analysis of error types |
| A-061 | Target devices can run local LLM within acceptable time | Core features limited | Test B |
| A-062 | Model + content fits on target device storage | NFR-002 violated | Test B |
| A-063 | Small local model handles Vietnamese math language acceptably | Extraction quality unacceptable | Test A |
| A-064 | Offline content/model distribution is feasible without technical staff | Cannot scale beyond pilot | User testing |
| A-065 | Model weights license permits educational distribution | Legal constraint | Legal review |
| A-066 | Target devices are 64-bit architecture | Cannot run 2B+ models | Device survey |
| A-067 | Local network allows two devices to see each other | Hub sync fails; USB only | User testing |

---

# 18. Constraints

| **ID** | **Category** | **Constraint** | **Hard/Soft** |
|--------|-------------|----------------|---------------|
| CO-R-01 | Regulatory | Must work in areas with no internet connectivity | Hard |
| CO-R-02 | Regulatory | Must work with unstable low-bandwidth connectivity | Hard |
| CO-E-01 | Educational | Content must follow GDPT 2018 curriculum | Hard |
| CO-E-02 | Educational | Must comply with curriculum distribution requirements | Hard |
| CO-D-03 | Data | Student identifying data never leaves school premises | Hard |
| CO-D-07 | Data | Evidence quality differs by context (in-class vs out-of-class) | Hard |
| CO-D-08 | Data | Every conclusion tagged with model/logic versions | Hard |
| CO-L-01 | Legal | Must comply with FERPA/GDPR/PDPD Vietnam for minors | Hard |
| CO-T-02 | Technical | Must run on target devices in deployment areas | Hard |
| CO-T-04 | Technical | No technical staff available at school | Hard |
| CO-T-06 | Technical | Device clocks cannot be trusted for ordering | Hard |
| CO-T-07 | Technical | Teachers must be able to install without technical support | Hard |
| CO-T-09 | Technical | Local LLM constrained by device RAM/CPU/storage | Hard |
| CO-T-10 | Technical | LLM output must be deterministic with same weights/quantization/params | Hard |

---

# 19. Risks

| **ID** | **Risk** | **Probability** | **Impact** | **Mitigation** |
|--------|----------|----------------|------------|----------------|
| RK-01 | Teachers don't adopt system due to added workload | Medium | High | Minimize friction; BO-02 measurement |
| RK-02 | Intervening in the diagnostic chain fails | Medium | High | BR-001 abstention; teacher override |
| RK-03 | Non-knowledge error rate is high | Medium | High | BR-005; FR-003 detection |
| RK-04 | System creates ability grouping that widens gap | Low | High | BR-015 labeling constraint; NFR-019 |
| RK-05 | Content quality issues cause harm | Low | High | BR-013; UC-019 review |
| RK-06 | Parents react negatively to diagnostic transparency | Medium | Medium | BR-015; parent communication |
| RK-07 | Target devices cannot run local LLM acceptably | Medium | High | Test B; fallback to smaller model |
| RK-08 | LLM extracts wrong error type without uncertainty flag | Medium | Very High | "unknown" label; teacher review |
| RK-09 | Non-deterministic LLM breaks reproducibility | Medium | High | Save extraction as evidence |
| RK-10 | LLM generates hallucinated explanations | Medium | Very High | fact_check_guard |
| RK-11 | Offline distribution logistics exceed resources | High | Medium | Per-semester schedule |
| RK-12 | School network isolates devices from each other | Medium | High | USB fallback |
| RK-13 | Language barrier misdiagnosed as knowledge gap | Medium-High | High | FR-003 language barrier detection |
| RK-14 | Teacher device (hub) failure loses class data | Medium | High | Hub backup |
| RK-15 | Model license prohibits educational distribution | Medium | High | Legal review |

---

# 20. Dependencies

| **ID** | **Dependency** | **Type** | **Blocked By** |
|--------|----------------|----------|----------------|
| D-01 | Knowledge graph for fractions → ratios | Internal | None — in progress |
| D-02 | Validated content bundle | Internal | D-01, UC-019 |
| D-03 | Device specifications for target area | External | OQ-07 |
| D-04 | Legal review of data handling for minors | External | OQ-08 |
| D-05 | Model license review | External | A-065 |
| D-06 | Teacher cooperation for adoption | External | RK-01 mitigation |
| D-07 | School policy allowing devices in class | External | OQ-03 |
| D-08 | Content authorship rights clarified | External | OQ-09 |
| D-09 | Test A (LLM extraction quality) | Internal | D-02 (real student work samples) |
| D-10 | Test B (device performance) | Internal | D-03 |

---

# 21. MoSCoW Prioritization

## Must Have (P0)

- Evidence collection with context
- Deterministic diagnostic engine (BKT + root cause)
- Teacher intervention dashboard
- 100% offline core functionality
- Hub sync (mDNS/HTTP + USB backup)
- Content integrity verification (Ed25519)
- Data export/delete capabilities
- Privacy controls (anonymization, retention)
- Knowledge graph for fractions → ratios domain

## Should Have (P1)

- Non-knowledge cause detection (carelessness, guessing, language barrier)
- Teacher override with audit trail
- Profile switching for shared devices
- Teacher personal notes
- Extended content for advanced students

## Could Have (P2)

- Web portal for remote teacher access
- Advanced analytics for education office
- Integration with school systems

## Won't Have (MVP)

- Cloud connectivity
- Handwriting recognition (OS-03 pending)
- Full curriculum coverage
- Real-time multi-student collaboration
- Gamification

---

# 22. Requirement Traceability Matrix

| **Business Objective** | **Requirement** | **User Story** | **Use Case** | **Module** | **Implementation Status** |
|-----------------------|-----------------|---------------|--------------|------------|------------------------|
| BO-01, P1 | FR-001, FR-002, FR-004, FR-005, FR-006 | US-001, US-002, US-003, US-004 | UC-001, UC-002, UC-003, UC-004, UC-005 | engine/evidence, engine/mastery, engine/diagnose | **[F]** Implemented |
| BO-02, P2 | FR-014, FR-015, FR-016 | US-011, US-012, US-013 | UC-011, UC-012, UC-013 | ui/teacher, engine/grouping | **[I]** Core implemented; UI partial |
| BO-03, P2 | FR-014, FR-007 | US-011 | UC-011 | engine/grouping, engine/item_selection | **[F]** Implemented |
| BO-04 | FR-010, FR-011, FR-012 | US-007, US-008, US-009 | UC-008, UC-009 | engine/remediation | **[I]** Logic exists; needs validation |
| BO-05, P3 | FR-017, NFR-006 | US-016, US-017, US-018 | UC-016, UC-017, UC-018 | hub/, sync/ | **[I]** Core implemented; end-to-end testing pending |
| BO-06 | FR-021, FR-023, BR-014, BR-016, BR-017, BR-021 | US-020 | UC-021, UC-023 | privacy/, storage/ | **[I]** Modules exist; full workflow not validated |
| BO-07 | FR-020 | US-019 | UC-019 | content-pipeline/ | **[I]** Pipeline exists; independent validation not yet performed |
| BO-08 | BR-015, BR-017, FR-022 | US-021 | UC-022 | auth/, ui/ | **[I]** Profile gate exists; shared-device testing pending |

---

# 23. Requirement Gaps

| **Gap ID** | **Description** | **Related Requirements** | **Priority** |
|------------|-----------------|------------------------|--------------|
| GAP-01 | Offline-first operation not fully tested in target environment | NFR-006, BO-05 | Must |
| GAP-02 | Student UI not fully implemented | UI/student/*, FR-012, FR-013 | Should |
| GAP-03 | web-portal screens need full implementation | web-portal/, FR-015, FR-017, FR-018, FR-019 | Must |
| GAP-04 | Retention policy needs UI configuration panel | DR-12, NFR-016 | Must |
| GAP-05 | Breach notification flow needs full implementation and testing | NFR-010 | Must |
| GAP-06 | Hub backup recovery workflow needs end-to-end testing | NFR-017 | Should |
| GAP-07 | LLM Layer 1 & 3 pending Test A validation | inference/*, BO-01 | Must |
| GAP-08 | Device performance testing (Test B) not yet conducted | NFR-003, NFR-004 | Must |
| GAP-09 | Teacher UX validation not yet conducted | US-011..US-015, NFR-018 | Should |
| GAP-10 | Student UX validation not yet conducted | US-001, US-005, US-007..US-010 | Should |
| GAP-11 | Legal review of FERPA/GDPR/PDPD compliance not completed | BO-06, CO-L-01 | Must |
| GAP-12 | Independent third-party evaluation for BO-07 not conducted | BO-07 | Should |

---

# 24. BA Findings & Recommendations

## 24.1 Summary of Analysis

After cross-referencing the BA document with actual implementation in `app/`, `web-portal/`, `content-pipeline/`, and `research/`:

### Consistent Areas [F]

| **Finding** | **Evidence** |
|-------------|--------------|
| Project structure matches BA description | app/, web-portal/, content-pipeline/, research/ modules exist |
| 3-layer AI architecture documented and started | inference/, engine/ modules implemented |
| Hub sync architecture matches BA | hub/ with server, discovery, merge, logical_clock, crypto, backup |
| Privacy architecture implemented | privacy/ with anonymize, export_delete, retention_policy, breach_notify |
| Storage follows append-only design | storage/ with event_log, audit_log, integrity_check |
| Content pipeline exists | content-pipeline/ with authoring, verification, signing |
| ADR documents created | ADR-0001, ADR-0002, ADR-0003 in docs/02-architecture/adr/ |
| BKT implementation matches BA | engine/mastery/bkt.dart with const parameters (pL0=0.10, pT=0.20, pG=0.20, pS=0.10) |
| Root cause clustering implemented | engine/grouping/cluster_by_root_cause.dart with 30% threshold, min 3 students |
| Language barrier detection implemented | engine/diagnose/language_barrier_detector.dart |
| Non-knowledge detection implemented | engine/diagnose/non_knowledge_detector.dart |
| Student transfer implemented | engine/transfer/student_transfer.dart |
| Remediation planning implemented | engine/remediation/build_plan.dart, hold_out_check.dart |
| Item selection implemented | engine/item_selection/next_best_item.dart, recent_item_tracker.dart |

### Areas Requiring Updates

| **Finding** | **Action** |
|-------------|------------|
| FR numbering updated | Realigned FR IDs to match actual implementation (FR-001 to FR-025) |
| web-portal status corrected | Documentation extensive (29 screens) but implementation in early stages |
| web-portal-architecture.md contains aspirational design | This is the target design, not current state |
| Student UI modules pending | UI implementation needed for student-facing features |

### Gaps Identified

| **Gap** | **Impact** | **Recommendation** |
|---------|-----------|-------------------|
| Student UI not implemented | Student UX validation blocked | Prioritize Student Portal development |
| web-portal screens need implementation | Teacher UX validation blocked | Continue web-portal development per F.7 |
| LLM components (Layers 1 & 3) still [A] pending tests | Core AI features uncertain | Prioritize Test A & B to unblock LLM development |
| Some heuristic values need validation | Calibration needed | Plan validation study with real data |

## 24.2 Recommendations

1. **Continue web-portal development** — prioritize Phase 1 Teacher Portal per F.7
2. **Execute Test A & B** — unblocks LLM components, enables full architecture validation
3. **Plan baseline measurement study** — without real classroom data, many BO targets remain TBD
4. **Validate heuristic values** — BR-003 (30% threshold), BR-004 (tie-break) need real-world calibration
5. **Implement Student UI** — based on `web-portal-architecture.md` Section D

## 24.3 Items Requiring Confirmation

| **Item** | **Question** | **Who Can Answer** |
|----------|-------------|-------------------|
| OQ-01 | How do teachers currently diagnose root causes? | Teachers |
| OQ-02 | Do three independent experts agree on root causes for the same work? | Teachers |
| OQ-03 | Does school policy allow student devices in class? | Principal |
| OQ-07 | What are actual device specs and connectivity conditions at target areas? | Principal |
| OQ-08 | What is the legal basis for handling minor student data? | Legal/School |
| OQ-12 | Does curriculum allow differentiated classroom activities? | Subject Lead |

---

# Appendices

## Appendix A: Abbreviations

| **Abbreviation** | **Full Form** |
|------------------|---------------|
| BA | Business Analysis |
| BKT | Bayesian Knowledge Tracing |
| BR | Business Rule |
| FR | Functional Requirement |
| GBNF | GGML BNF (Grammar format for llama.cpp) |
| LLM | Large Language Model |
| NFR | Non-Functional Requirement |
| UC | Use Case |
| US | User Story |

## Appendix B: Implementation File Reference

| **Module** | **File** | **Purpose** |
|------------|----------|------------|
| BKT Engine | `app/lib/engine/mastery/bkt.dart` | Bayesian Knowledge Tracing |
| Abstention | `app/lib/engine/diagnose/abstention.dart` | Return abstention when insufficient evidence |
| Root Cause Clustering | `app/lib/engine/grouping/cluster_by_root_cause.dart` | Group students by root cause |
| Language Barrier | `app/lib/engine/diagnose/language_barrier_detector.dart` | Detect language barriers |
| Non-Knowledge | `app/lib/engine/diagnose/non_knowledge_detector.dart` | Detect carelessness/guessing |
| Hypothesis Ranking | `app/lib/engine/diagnose/hypothesis_ranking.dart` | Rank root cause hypotheses |
| Item Selection | `app/lib/engine/item_selection/next_best_item.dart` | Select best discriminating item |
| Remediaton | `app/lib/engine/remediation/build_plan.dart` | Build remediation plan |
| Hold-Out Check | `app/lib/engine/remediation/hold_out_check.dart` | Verify mastery independently |
| Student Transfer | `app/lib/engine/transfer/student_transfer.dart` | Handle student transfers |
| Evidence Recording | `app/lib/engine/evidence/record_attempt.dart` | Record student response |
| Versioning | `app/lib/engine/versioning/recompute.dart` | Recompute conclusions |
| Hub Server | `app/lib/hub/server.dart` | HTTP server on teacher device |
| Hub Discovery | `app/lib/hub/discovery.dart` | mDNS + QR pairing |
| Hub Merge | `app/lib/hub/merge.dart` | Append-only merge |
| Hub Crypto | `app/lib/hub/crypto.dart` | libsodium encryption |
| Hub Logical Clock | `app/lib/hub/logical_clock.dart` | Lamport-style timestamp |
| Hub Backup | `app/lib/hub/backup.dart` | Daily hub backup |
| Sync Strategy | `app/lib/sync/sync_strategy_resolver.dart` | Auto-select hub vs USB |
| File Exchange | `app/lib/sync/file_exchange.dart` | USB archive |
| Chunked Transfer | `app/lib/sync/chunked_transfer.dart` | Chunked USB transfer |
| Privacy Anonymize | `app/lib/privacy/anonymize.dart` | HMAC anonymization |
| Privacy Export Delete | `app/lib/privacy/export_delete.dart` | Data export/delete |
| Privacy Retention | `app/lib/privacy/retention_policy.dart` | Retention policy |
| Privacy Breach | `app/lib/privacy/breach_notify.dart` | Breach notification |
| Storage Event Log | `app/lib/storage/event_log.dart` | Append-only event log |
| Storage Audit Log | `app/lib/storage/audit_log.dart` | Immutable audit log |
| Storage Integrity | `app/lib/storage/integrity_check.dart` | Checksum validation |
| Storage DB | `app/lib/storage/db.dart` | SQLite database |
| Content Signature | `app/lib/content_security/signature_verify.dart` | Ed25519 verification |
| Bootstrap Content | `app/lib/bootstrap/content_installer.dart` | Install content bundle |
| Bootstrap Model | `app/lib/bootstrap/model_installer.dart` | Install LLM model |
| Bootstrap Bundle | `app/lib/bootstrap/bundle_verify.dart` | Verify bundle integrity |
| Auth Profile | `app/lib/auth/profile_gate.dart` | Profile switching |
| UI Teacher Dashboard | `app/lib/ui/teacher/intervention_dashboard.dart` | Teacher dashboard |
| UI Teacher Report | `app/lib/ui/teacher/printable_report.dart` | Printable report |
| UI Teacher Profile | `app/lib/ui/teacher/profile_switcher.dart` | Profile switcher |
| UI Admin Governance | `app/lib/ui/admin/data_governance_panel.dart` | Data governance |
| LLM Bindings | `app/lib/inference/ffi/llama_bindings.dart` | llama.cpp FFI |
| LLM Model Manager | `app/lib/inference/model_manager.dart` | Model loading |
| LLM Extraction | `app/lib/inference/extraction/extract_evidence.dart` | Evidence extraction |
| LLM Expression | `app/lib/inference/expression/explain_to_teacher.dart` | Teacher explanation |
| LLM Fact Check | `app/lib/inference/expression/fact_check_guard.dart` | Hallucination guard |
| LLM Student Template | `app/lib/inference/expression/fill_student_template.dart` | Student template |

## Appendix C: Document References

| **Document** | **Location** |
|--------------|--------------|
| BA Document v1.4.5 | docs/01-business/BA_DOCUMENT_VERVEAI.md |
| System Overview | docs/02-architecture/system-overview.md |
| AI Architecture | docs/02-architecture/ai-architecture.md |
| Sync Architecture | docs/02-architecture/sync-architecture.md |
| Privacy Architecture | docs/02-architecture/privacy-architecture.md |
| Web Portal Architecture | docs/02-architecture/web-portal-architecture.md |
| ADR-0001 Tech Stack | docs/02-architecture/adr/0001-tech-stack-selection.md |
| ADR-0002 Sync Strategy | docs/02-architecture/adr/0002-sync-strategy.md |
| ADR-0003 Local AI | docs/02-architecture/adr/0003-local-ai-architecture.md |
| Teacher Guide | docs/06-user/teacher-guide.md |
| Student Guide | docs/06-user/student-guide.md |
| Admin Guide | docs/06-user/admin-guide.md |
| Project Rules | docs/01-business/PROJECT_RULES.md |
| Stakeholders | docs/01-business/STAKEHOLDERS.md |

---

**Document Status:** Draft v2.2  
**Last Updated:** 2026-09-06  
**Next Review:** After Test A & B completion  

