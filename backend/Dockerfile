# ━━━ Stage 1: Install dependencies ━━━
FROM node:20-alpine AS deps
WORKDIR /app
COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --ignore-scripts

# ━━━ Stage 2: Build TypeScript ━━━
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY backend/ .
RUN npm run build

# ━━━ Stage 3: Production ━━━
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

USER appuser
EXPOSE 4000

CMD ["node", "dist/server.js"]
