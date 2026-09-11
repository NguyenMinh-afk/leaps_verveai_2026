#!/bin/bash

# 🚀 Quick Setup Script for Service Auth (Local Development)
# This script helps you setup and run service-auth without Docker

set -e  # Exit on error

echo "======================================"
echo "🚀 VERVEAI Service Auth - Quick Setup"
echo "======================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js ≥ 20${NC}"
    echo "   Ubuntu: curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs"
    echo "   macOS: brew install node@20"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${RED}❌ Node.js version is $NODE_VERSION. Required: ≥ 20${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# Check PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL not found. Please install PostgreSQL ≥ 15${NC}"
    echo "   Ubuntu: sudo apt install postgresql postgresql-contrib"
    echo "   macOS: brew install postgresql@15"
    exit 1
fi
echo -e "${GREEN}✅ PostgreSQL $(psql --version | awk '{print $3}')${NC}"

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Starting...${NC}"
    if command -v systemctl &> /dev/null; then
        sudo systemctl start postgresql
    elif command -v brew &> /dev/null; then
        brew services start postgresql@15
    fi
    sleep 2
    if ! pg_isready -q; then
        echo -e "${RED}❌ Failed to start PostgreSQL${NC}"
        exit 1
    fi
fi
echo -e "${GREEN}✅ PostgreSQL is running${NC}"

echo ""
echo "======================================"
echo "🔧 Setting up Service Auth"
echo "======================================"
echo ""

# Navigate to service-auth directory
cd "$(dirname "$0")"

# Step 1: Create .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env created${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env and update:${NC}"
    echo "   - DATABASE_URL (username, password)"
    echo "   - JWT_SECRET (min 32 characters)"
    read -p "Press Enter after editing .env..."
else
    echo -e "${GREEN}✅ .env already exists${NC}"
fi

# Step 2: Install dependencies
echo ""
echo "📦 Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    npm install
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 3: Setup database
echo ""
echo "🗄️  Setting up database..."

# Extract DB info from .env
if [ -f .env ]; then
    source .env
    
    # Parse DATABASE_URL
    # Format: postgresql://user:pass@host:port/dbname?schema=auth
    DB_URL=$DATABASE_URL
    DB_USER=$(echo $DB_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASS=$(echo $DB_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    DB_HOST=$(echo $DB_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DB_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DB_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    
    echo "Database config:"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  User: $DB_USER"
    echo "  Database: $DB_NAME"
    
    # Check if database exists
    if PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
        echo -e "${GREEN}✅ Database '$DB_NAME' exists${NC}"
    else
        echo -e "${YELLOW}⚠️  Database '$DB_NAME' not found. Creating...${NC}"
        PGPASSWORD=$DB_PASS createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME || {
            echo -e "${RED}❌ Failed to create database. Please create manually:${NC}"
            echo "   sudo -u postgres psql"
            echo "   CREATE DATABASE $DB_NAME;"
            echo "   CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
            echo "   GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
            exit 1
        }
        echo -e "${GREEN}✅ Database created${NC}"
    fi
    
    # Create schema 'auth' if not exists
    echo "Creating schema 'auth'..."
    PGPASSWORD=$DB_PASS psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE SCHEMA IF NOT EXISTS auth;" 2>/dev/null || true
    echo -e "${GREEN}✅ Schema 'auth' ready${NC}"
fi

# Step 4: Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"

# Step 5: Run migrations
echo ""
echo "🔄 Running database migrations..."
npx prisma migrate deploy || npx prisma db push
echo -e "${GREEN}✅ Database migrations completed${NC}"

# Step 6: Start service
echo ""
echo "======================================"
echo "🚀 Starting Service Auth"
echo "======================================"
echo ""
echo -e "${GREEN}Service will start on port 3001${NC}"
echo -e "${YELLOW}⚠️  REMEMBER: All API calls must go through Gateway (port 8080)${NC}"
echo ""
echo "Test endpoints:"
echo "  ❌ WRONG: http://localhost:3001/api/auth/login"
echo "  ✅ RIGHT: http://localhost:8080/api/auth/login (via Gateway)"
echo ""
echo "Press Ctrl+C to stop the service"
echo ""
sleep 2

npm run dev
