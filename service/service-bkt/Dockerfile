# --- Build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy workspace manifests first so pnpm can resolve deps without
# pulling in source yet (cache-friendly).
COPY pnpm-workspace.yaml package.json ./
COPY service/shared ./service/shared
COPY service/service-bkt/package.json ./service/service-bkt/

# Install everything the builder needs.
RUN corepack enable && corepack prepare pnpm@9 --activate && \
    pnpm install --frozen-lockfile --filter @verveai/service-bkt...

# Bring in source + Prisma schema and build.
COPY service/service-bkt ./service/service-bkt
RUN pnpm --filter @verveai/service-bkt db:generate && \
    pnpm --filter @verveai/service-bkt build

# --- Runtime stage ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/service/shared ./service/shared
COPY --from=builder /app/service/service-bkt/dist ./service/service-bkt/dist
COPY --from=builder /app/service/service-bkt/node_modules ./service/service-bkt/node_modules
COPY --from=builder /app/service/service-bkt/package.json ./service/service-bkt/package.json
COPY --from=builder /app/service/service-bkt/prisma ./service/service-bkt/prisma

EXPOSE 3002

CMD ["node", "service/service-bkt/dist/index.js"]
