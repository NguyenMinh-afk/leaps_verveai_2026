#!/usr/bin/env bash
# Bring up the full Plan C3 infrastructure:
#   - Consul on :8500
#   - Postgres 15 on :5432 with both `class` and `bkt` schemas
#   - svc-class running as a detached Node process on :3003
#   - migrations + seed data inserted

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SERVICE_BKT="$REPO_ROOT/service/service-bkt"
SERVICE_CLASS="$REPO_ROOT/service/service-class"

PG_USER="${PG_USER:-verveai}"
PG_PASS="${PG_PASS:-verveai_c3_pass}"
PG_HOST="${PG_HOST:-localhost}"
PG_PORT="${PG_PORT:-5432}"
PG_DB="${PG_DB:-verveai}"
PG_URL="postgresql://${PG_USER}:${PG_PASS}@${PG_HOST}:${PG_PORT}/${PG_DB}"
PG_URL_BKT="${PG_URL}?schema=bkt"
PG_URL_CLASS="${PG_URL}?schema=class"

CONSUL_HOST="${CONSUL_HOST:-localhost}"
CONSUL_PORT="${CONSUL_PORT:-8500}"

step() { printf "\n\033[1;34m==>\033[0m %s\n" "$*"; }

step "1/6 Consul container"
if ! curl -sS -o /dev/null "http://${CONSUL_HOST}:${CONSUL_PORT}/v1/status/leader"; then
  docker rm -f consul-c3 2>/dev/null || true
  docker run -d --name consul-c3 -p "${CONSUL_PORT}:8500" consul:1.15 >/dev/null
  sleep 5
fi
echo "    Consul OK at http://${CONSUL_HOST}:${CONSUL_PORT}"

step "2/6 Postgres container"
if ! PGPASSWORD="$PG_PASS" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -c "SELECT 1" >/dev/null 2>&1; then
  docker rm -f verveai-pg-c3 2>/dev/null || true
  docker run -d --name verveai-pg-c3 -p "${PG_PORT}:5432" \
    -e POSTGRES_USER="$PG_USER" \
    -e POSTGRES_PASSWORD="$PG_PASS" \
    -e POSTGRES_DB="$PG_DB" \
    postgres:15 >/dev/null
  # Wait for readiness.
  for _ in $(seq 1 30); do
    if PGPASSWORD="$PG_PASS" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" -c "SELECT 1" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi
echo "    Postgres OK at ${PG_HOST}:${PG_PORT}"

step "3/6 Schemas"
PGPASSWORD="$PG_PASS" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" \
  -c "CREATE SCHEMA IF NOT EXISTS class; CREATE SCHEMA IF NOT EXISTS bkt;" >/dev/null
echo "    class, bkt"

step "4/6 service-class migrations"
( cd "$SERVICE_CLASS" && \
  DATABASE_URL="$PG_URL_CLASS" npx prisma migrate deploy >/dev/null )

step "5/6 service-bkt migrations"
( cd "$SERVICE_BKT" && \
  DATABASE_URL="$PG_URL_BKT" npx prisma migrate deploy >/dev/null )

step "6/6 Seed data"
( cd "$SERVICE_CLASS" && \
  DATABASE_URL="$PG_URL_CLASS" npx tsx prisma/seed-c3.ts >/dev/null )
PGPASSWORD="$PG_PASS" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" -d "$PG_DB" \
  -f "$SERVICE_BKT/tests/integration/c3-seed.sql" >/dev/null
echo "    1 class, 2 students, 2 enrollments, 1 skill, 2 diagnoses"

step "svc-class process"
# Already running? Leave it; otherwise start it detached.
if curl -sS -o /dev/null "http://localhost:3003/health"; then
  echo "    svc-class already listening on :3003"
else
  ( cd "$SERVICE_CLASS" && \
    DATABASE_URL="$PG_URL_CLASS" \
    PORT=3003 SERVICE_NAME=svc-class SERVICE_PORT=3003 \
    CONSUL_HOST="$CONSUL_HOST" CONSUL_PORT="$CONSUL_PORT" \
    LOG_LEVEL=info NODE_ENV=development \
    setsid nohup npx tsx src/index.ts > /tmp/svc-class.log 2>&1 < /dev/null &
    disown
  )
  for _ in $(seq 1 15); do
    if curl -sS -o /dev/null "http://localhost:3003/health"; then break; fi
    sleep 1
  done
  echo "    svc-class started on :3003 (log: /tmp/svc-class.log)"
fi

echo
echo "Plan C3 infrastructure is ready."
echo "  - Consul    : http://${CONSUL_HOST}:${CONSUL_PORT}"
echo "  - Postgres  : ${PG_HOST}:${PG_PORT} (db=${PG_DB}, schemas=class,bkt)"
echo "  - svc-class : http://localhost:3003/health"
echo
echo "Run the suite from service/service-bkt:"
echo "  DATABASE_URL='${PG_URL_BKT}' npm run test:integration"
