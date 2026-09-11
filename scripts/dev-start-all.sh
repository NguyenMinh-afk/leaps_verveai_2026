#!/bin/bash
# VERVEAI Development — Start ALL services locally
# Docker Compose chỉ chạy infrastructure (Postgres, Consul, Jaeger, Prometheus, Grafana)
# Script này chạy Gateway + 5 services locally để phát triển

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  VERVEAI — Development Start (All Services)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Check infrastructure
echo -e "${YELLOW}[1/6] Checking infrastructure...${NC}"
if ! docker compose -f infra/docker-compose.yml ps | grep -q "verveai-postgres.*running"; then
    echo -e "${RED}Infrastructure not running. Starting...${NC}"
    cd infra
    docker compose up -d
    cd ..
    echo -e "${GREEN}Waiting 15s for services to be healthy...${NC}"
    sleep 15
else
    echo -e "${GREEN}Infrastructure already running ✓${NC}"
fi
echo ""

# Step 2: Check database
echo -e "${YELLOW}[2/6] Checking database...${NC}"
export PGPASSWORD="verveai_dev_pass"
if ! psql -h localhost -p 5433 -U verveai -d verveai -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${YELLOW}Database 'verveai' not found. Creating...${NC}"
    psql -h localhost -p 5433 -U verveai -d postgres -c "CREATE DATABASE verveai;" 2>/dev/null || echo "Database might exist"
fi
echo -e "${GREEN}Database ready ✓${NC}"
echo ""

# Step 3: Install dependencies & generate Prisma
echo -e "${YELLOW}[3/6] Installing dependencies...${NC}"
SERVICES=(
    "service/service-auth"
    "service/service-bkt"
    "service/service-class"
    "service/service-content"
    "service/service-sync"
    "service/gateway"
)

for svc in "${SERVICES[@]}"; do
    if [ ! -d "$svc/node_modules" ]; then
        echo -e "${BLUE}Installing $svc...${NC}"
        (cd "$svc" && npm install --ignore-scripts --legacy-peer-deps) || {
            echo -e "${RED}Failed to install $svc${NC}"
            exit 1
        }
    fi
done
echo -e "${GREEN}Dependencies installed ✓${NC}"
echo ""

# Step 4: Prisma generate & migrate
echo -e "${YELLOW}[4/6] Running Prisma migrations...${NC}"
for svc in service/service-*; do
    if [ -f "$svc/prisma/schema.prisma" ]; then
        echo -e "${BLUE}Generating Prisma client for $svc...${NC}"
        (cd "$svc" && npx prisma generate) || true
        echo -e "${BLUE}Running migrations for $svc...${NC}"
        (cd "$svc" && npx prisma migrate deploy) || true
    fi
done
echo -e "${GREEN}Prisma ready ✓${NC}"
echo ""

# Step 5: Start services in background
echo -e "${YELLOW}[5/6] Starting services...${NC}"

# Create logs directory
mkdir -p logs

# Start service-auth (port 3001)
echo -e "${BLUE}Starting service-auth (port 3001)...${NC}"
(cd service/service-auth && npm run dev > ../../logs/service-auth.log 2>&1 &)
sleep 2

# Start service-bkt (port 3002)
echo -e "${BLUE}Starting service-bkt (port 3002)...${NC}"
(cd service/service-bkt && npm run dev > ../../logs/service-bkt.log 2>&1 &)
sleep 2

# Start service-class (port 3003)
echo -e "${BLUE}Starting service-class (port 3003)...${NC}"
(cd service/service-class && npm run dev > ../../logs/service-class.log 2>&1 &)
sleep 2

# Start service-content (port 3004)
echo -e "${BLUE}Starting service-content (port 3004)...${NC}"
(cd service/service-content && npm run dev > ../../logs/service-content.log 2>&1 &)
sleep 2

# Start service-sync (port 3005)
echo -e "${BLUE}Starting service-sync (port 3005)...${NC}"
(cd service/service-sync && npm run dev > ../../logs/service-sync.log 2>&1 &)
sleep 2

# Start gateway (port 8080)
echo -e "${BLUE}Starting gateway (port 8080)...${NC}"
(cd service/gateway && npm run dev > ../../logs/gateway.log 2>&1 &)
sleep 3

echo -e "${GREEN}All services started ✓${NC}"
echo ""

# Step 6: Health check
echo -e "${YELLOW}[6/6] Health check...${NC}"
sleep 5

check_health() {
    local name=$1
    local url=$2
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}  ✓ $name${NC}"
        return 0
    else
        echo -e "${RED}  ✗ $name (check logs/$name.log)${NC}"
        return 1
    fi
}

check_health "service-auth" "http://localhost:3001/health"
check_health "service-bkt" "http://localhost:3002/health"
check_health "service-class" "http://localhost:3003/health"
check_health "service-content" "http://localhost:3004/health"
check_health "service-sync" "http://localhost:3005/health"
check_health "gateway" "http://localhost:8080/health"

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ All services running!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}URLs:${NC}"
echo -e "  • Gateway:    ${BLUE}http://localhost:8080${NC}"
echo -e "  • Consul UI:  ${BLUE}http://localhost:8500${NC}"
echo -e "  • Jaeger UI:  ${BLUE}http://localhost:16686${NC}"
echo -e "  • Prometheus: ${BLUE}http://localhost:9090${NC}"
echo -e "  • Grafana:    ${BLUE}http://localhost:3000${NC} (admin/admin)"
echo ""
echo -e "${YELLOW}Logs:${NC}"
echo -e "  • tail -f logs/service-auth.log"
echo -e "  • tail -f logs/gateway.log"
echo ""
echo -e "${YELLOW}Stop all:${NC}"
echo -e "  • ./scripts/dev-stop-all.sh"
echo ""
