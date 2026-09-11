# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY service/shared shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy service source
COPY service/service-bkt/ .

# Generate Prisma client
RUN pnpm --filter @verveai/service-bkt db:generate

# Build TypeScript
RUN pnpm --filter @verveai/service-bkt build

# Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install production dependencies only
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Copy package files for pruned install
COPY service/service-bkt/package.json ./package.json
COPY service/shared shared/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built artifacts
COPY --from=builder /app/dist ./dist

# Set environment
ENV NODE_ENV=production
ENV PORT=3002

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1

# Start service
CMD ["node", "dist/index.js"]
