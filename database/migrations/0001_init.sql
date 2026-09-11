-- Migration 0001_init: Initial schema for 5 microservice
-- Phụ thuộc: PostgreSQL 15+
-- Áp dụng: 5 schema (auth, bkt, class, content, sync)

-- ============================================================
-- AUTH SCHEMA (svc-auth — Dev 1)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS auth;
SET search_path TO auth;

CREATE TABLE IF NOT EXISTS auth.users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        VARCHAR(255) UNIQUE NOT NULL,
  password     VARCHAR(255) NOT NULL,
  role         VARCHAR(50) NOT NULL CHECK (role IN ('TEACHER', 'ADMIN', 'SUPERVISOR')),
  name         VARCHAR(255) NOT NULL,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS auth.sessions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token          VARCHAR(512) UNIQUE NOT NULL,
  refresh_token  VARCHAR(512) UNIQUE,
  expires_at     TIMESTAMPTZ NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now(),
  revoked_at     TIMESTAMPTZ
);

CREATE INDEX idx_sessions_user_id ON auth.sessions(user_id);
CREATE INDEX idx_sessions_token ON auth.sessions(token);

CREATE TABLE IF NOT EXISTS auth.refresh_tokens (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token      VARCHAR(512) UNIQUE NOT NULL,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE TYPE auth.note_type AS ENUM ('GENERAL', 'INTERVENTION', 'PROGRESS', 'WARNING');

CREATE TABLE IF NOT EXISTS auth.teacher_notes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id),
  student_id UUID,
  content    TEXT NOT NULL,
  type       auth.note_type NOT NULL DEFAULT 'GENERAL',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- BKT SCHEMA (svc-bkt — Dev 2)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS bkt;
SET search_path TO bkt;

CREATE TABLE IF NOT EXISTS bkt.skills (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          VARCHAR(100) UNIQUE NOT NULL,
  name          VARCHAR(255) NOT NULL,
  difficulty    INTEGER DEFAULT 1,
  description   TEXT,
  prereq_skills TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE bkt.diagnosis_status AS ENUM ('PENDING', 'DIAGNOSED', 'MASTERED', 'STRUGGLING');

CREATE TABLE IF NOT EXISTS bkt.diagnoses (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  skill_id   UUID NOT NULL REFERENCES bkt.skills(id),
  p_known    REAL DEFAULT 0.0,
  confidence REAL DEFAULT 0.0,
  status     bkt.diagnosis_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, skill_id)
);

CREATE TYPE bkt.evidence_quality AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'UNKNOWN');

CREATE TABLE IF NOT EXISTS bkt.evidence_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  diagnosis_id     UUID NOT NULL REFERENCES bkt.diagnoses(id) ON DELETE CASCADE,
  item_id          UUID NOT NULL,
  extracted_answer TEXT,
  correct          BOOLEAN,
  confidence       REAL DEFAULT 0.0,
  quality          bkt.evidence_quality DEFAULT 'UNKNOWN',
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TYPE bkt.intervention_status AS ENUM ('ACTIVE', 'RESOLVED', 'CANCELLED');

CREATE TABLE IF NOT EXISTS bkt.interventions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL,
  skill_id    UUID NOT NULL REFERENCES bkt.skills(id),
  priority    INTEGER DEFAULT 50,
  status      bkt.intervention_status DEFAULT 'ACTIVE',
  teacher_id  UUID,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS bkt.intervention_notes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intervention_id UUID NOT NULL REFERENCES bkt.interventions(id) ON DELETE CASCADE,
  teacher_id      UUID NOT NULL,
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- CLASS SCHEMA (svc-class — Dev 3)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS class;
SET search_path TO class;

CREATE TABLE IF NOT EXISTS class.classes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  subject    VARCHAR(255) NOT NULL,
  teacher_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class.students (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(255) NOT NULL,
  email      VARCHAR(255) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS class.enrollments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES class.classes(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES class.students(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  dropped_at  TIMESTAMPTZ,
  UNIQUE(class_id, student_id)
);

CREATE TABLE IF NOT EXISTS class.progress (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES class.students(id) ON DELETE CASCADE,
  skill_id      UUID NOT NULL,
  p_known       REAL DEFAULT 0.0,
  last_p_known  REAL DEFAULT 0.0,
  attempt_count INTEGER DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, skill_id)
);

-- ============================================================
-- CONTENT SCHEMA (svc-content — Dev 1)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS content;
SET search_path TO content;

CREATE TYPE content.content_type AS ENUM ('ITEM_QUESTION', 'ITEM_EXPLANATION', 'ITEM_MEDIA');
CREATE TYPE content.content_status AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');
CREATE TYPE content.bundle_status AS ENUM ('BUILDING', 'BUILT', 'SIGNED', 'PUBLISHED');
CREATE TYPE content.review_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE IF NOT EXISTS content.content_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type       content.content_type NOT NULL,
  title      VARCHAR(255) NOT NULL,
  body       TEXT NOT NULL,
  difficulty INTEGER DEFAULT 1,
  status     content.content_status DEFAULT 'DRAFT',
  author_id  UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content.bundles (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(255) NOT NULL,
  version      VARCHAR(50) DEFAULT '1.0.0',
  status       content.bundle_status DEFAULT 'BUILDING',
  content_ids  TEXT[] DEFAULT '{}',
  created_at   TIMESTAMPTZ DEFAULT now(),
  published_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS content.bundle_signatures (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id              UUID NOT NULL REFERENCES content.bundles(id) ON DELETE CASCADE,
  public_key_fingerprint VARCHAR(128) NOT NULL,
  signature              TEXT NOT NULL,
  signed_at              TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content.reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id  UUID NOT NULL REFERENCES content.content_items(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  status      content.review_status DEFAULT 'PENDING',
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- SYNC SCHEMA (svc-sync — Dev 3)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS sync;
SET search_path TO sync;

CREATE TYPE sync.device_type AS ENUM ('ANDROID', 'WINDOWS', 'TABLET');
CREATE TYPE sync.sync_direction AS ENUM ('PUSH', 'PULL');
CREATE TYPE sync.sync_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');
CREATE TYPE sync.conflict_resolution AS ENUM ('SERVER_WINS', 'CLIENT_WINS', 'MERGED');
CREATE TYPE sync.transfer_status AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

CREATE TABLE IF NOT EXISTS sync.devices (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type         sync.device_type NOT NULL,
  name         VARCHAR(255) NOT NULL,
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sync.sync_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     UUID NOT NULL REFERENCES sync.devices(id) ON DELETE CASCADE,
  direction     sync.sync_direction NOT NULL,
  status        sync.sync_status DEFAULT 'PENDING',
  record_count  INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS sync.sync_conflicts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id      UUID NOT NULL REFERENCES sync.devices(id),
  entity_type    VARCHAR(100) NOT NULL,
  entity_id      UUID NOT NULL,
  server_version VARCHAR(50) NOT NULL,
  client_version VARCHAR(50) NOT NULL,
  resolved_at    TIMESTAMPTZ,
  resolution     sync.conflict_resolution
);

CREATE TABLE IF NOT EXISTS sync.student_transfers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_device_id UUID NOT NULL,
  to_device_id   UUID NOT NULL,
  status         sync.transfer_status DEFAULT 'PENDING',
  transferred_at TIMESTAMPTZ
);
