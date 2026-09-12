-- C3 seed SQL for the `sync` schema.
-- Run after `prisma migrate deploy` for service-sync:
--   PGPASSWORD=verveai_c3_pass psql -h localhost -U verveai -d verveai -f tests/integration/c3-seed.sql
--
-- Idempotent: every INSERT guards on NOT EXISTS.
--
-- Stable UUIDs (match what the C3 E2E test asserts on):
--   DEVICE_A   : c3000000-0000-4000-8000-0000000000e1
--   DEVICE_B   : c3000000-0000-4000-8000-0000000000e2
--   CONFLICT_1 : c3000000-0000-4000-8000-0000000000f1 (PENDING, evidence record)
--   CONFLICT_2 : c3000000-0000-4000-8000-0000000000f2 (PENDING, student record)
--   CONFLICT_3 : c3000000-0000-4000-8000-0000000000f3 (already RESOLVED — SERVER_WINS)

-- Device A (Android tablet)
INSERT INTO sync.devices (id, type, name, last_seen_at, created_at, deleted_at)
SELECT 'c3000000-0000-4000-8000-0000000000e1',
       'TABLET',
       'Tablet A (C3)',
       NOW(),
       NOW(),
       NULL
WHERE NOT EXISTS (
  SELECT 1 FROM sync.devices WHERE id = 'c3000000-0000-4000-8000-0000000000e1'
);

-- Device B (Windows desktop)
INSERT INTO sync.devices (id, type, name, last_seen_at, created_at, deleted_at)
SELECT 'c3000000-0000-4000-8000-0000000000e2',
       'WINDOWS',
       'Desktop B (C3)',
       NOW(),
       NOW(),
       NULL
WHERE NOT EXISTS (
  SELECT 1 FROM sync.devices WHERE id = 'c3000000-0000-4000-8000-0000000000e2'
);

-- Pre-existing conflict #1 — PENDING, evidence record
INSERT INTO sync.sync_conflicts
  (id, device_id, entity_type, entity_id, server_version, client_version,
   resolved_at, resolution, detected_at)
SELECT 'c3000000-0000-4000-8000-0000000000f1',
       'c3000000-0000-4000-8000-0000000000e1',
       'evidence',
       'c3000000-0000-4000-a000-0000000000a1',
       'v1',
       'v2',
       NULL,
       NULL,
       NOW() - INTERVAL '2 hours'
WHERE NOT EXISTS (
  SELECT 1 FROM sync.sync_conflicts WHERE id = 'c3000000-0000-4000-8000-0000000000f1'
);

-- Pre-existing conflict #2 — PENDING, student record
INSERT INTO sync.sync_conflicts
  (id, device_id, entity_type, entity_id, server_version, client_version,
   resolved_at, resolution, detected_at)
SELECT 'c3000000-0000-4000-8000-0000000000f2',
       'c3000000-0000-4000-8000-0000000000e2',
       'student',
       'c3000000-0000-4000-a000-0000000000a2',
       'v3',
       'v4',
       NULL,
       NULL,
       NOW() - INTERVAL '1 hour'
WHERE NOT EXISTS (
  SELECT 1 FROM sync.sync_conflicts WHERE id = 'c3000000-0000-4000-8000-0000000000f2'
);

-- Pre-existing conflict #3 — already RESOLVED via SERVER_WINS (for filter tests)
INSERT INTO sync.sync_conflicts
  (id, device_id, entity_type, entity_id, server_version, client_version,
   resolved_at, resolution, detected_at)
SELECT 'c3000000-0000-4000-8000-0000000000f3',
       'c3000000-0000-4000-8000-0000000000e1',
       'evidence',
       'c3000000-0000-4000-a000-0000000000a3',
       'v1',
       'v2',
       NOW() - INTERVAL '30 minutes',
       'SERVER_WINS',
       NOW() - INTERVAL '45 minutes'
WHERE NOT EXISTS (
  SELECT 1 FROM sync.sync_conflicts WHERE id = 'c3000000-0000-4000-8000-0000000000f3'
);
