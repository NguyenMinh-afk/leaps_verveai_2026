FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --workspace=@verveai/service-ai
COPY service/service-ai ./service/service-ai
RUN npm run build --workspace=@verveai/service-ai

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/service/service-ai/dist ./dist
COPY --from=builder /app/service/service-ai/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3008
CMD ["node", "dist/index.js"]
