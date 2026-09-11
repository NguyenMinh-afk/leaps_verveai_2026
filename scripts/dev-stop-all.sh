#!/bin/bash
# VERVEAI Development — Stop ALL services

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  VERVEAI — Stopping All Services${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}Stopping Node.js services...${NC}"

# Kill all node processes running on service ports
pkill -f "tsx watch src/index.ts" || true
pkill -f "node.*service-auth" || true
pkill -f "node.*service-bkt" || true
pkill -f "node.*service-class" || true
pkill -f "node.*service-content" || true
pkill -f "node.*service-sync" || true
pkill -f "node.*gateway" || true

# Kill by port if needed
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
lsof -ti:3003 | xargs kill -9 2>/dev/null || true
lsof -ti:3004 | xargs kill -9 2>/dev/null || true
lsof -ti:3005 | xargs kill -9 2>/dev/null || true
lsof -ti:8080 | xargs kill -9 2>/dev/null || true

echo -e "${GREEN}All services stopped ✓${NC}"
echo ""

echo -e "${YELLOW}Infrastructure still running. To stop:${NC}"
echo -e "  cd infra && docker compose down"
echo ""
