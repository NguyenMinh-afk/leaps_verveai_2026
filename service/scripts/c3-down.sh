#!/usr/bin/env bash
# Tear down the Plan C3 infrastructure.

set -euo pipefail

step() { printf "\n\033[1;34m==>\033[0m %s\n" "$*"; }

step "Stop svc-class"
pkill -f "tsx.*service-class/src/index.ts" 2>/dev/null || true
echo "    done"

step "Deregister svc-class from Consul"
for id in $(curl -sS http://localhost:8500/v1/catalog/service/svc-class 2>/dev/null | \
            grep -oE '"ServiceID": "[^"]*"' | cut -d'"' -f4 | sort -u); do
  curl -sS -X PUT "http://localhost:8500/v1/agent/service/deregister/${id}" >/dev/null
done
echo "    done"

step "Truncate Postgres data (keep schema)"
PGPASSWORD="${PG_PASS:-verveai_c3_pass}" psql -h "${PG_HOST:-localhost}" -p "${PG_PORT:-5432}" \
  -U "${PG_USER:-verveai}" -d "${PG_DB:-verveai}" \
  -c "TRUNCATE class.enrollments, class.students, class.classes CASCADE;" 2>/dev/null || true
PGPASSWORD="${PG_PASS:-verveai_c3_pass}" psql -h "${PG_HOST:-localhost}" -p "${PG_PORT:-5432}" \
  -U "${PG_USER:-verveai}" -d "${PG_DB:-verveai}" \
  -c "TRUNCATE bkt.diagnoses, bkt.evidence_items, bkt.interventions, bkt.intervention_notes CASCADE;
      DELETE FROM bkt.skills WHERE code = 'MATH-ADD-001';" 2>/dev/null || true
echo "    done"

step "Remove containers"
docker rm -f consul-c3 verveai-pg-c3 2>/dev/null || true
echo "    done"

echo
echo "Plan C3 infrastructure removed."
