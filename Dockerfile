# Multi-stage Dockerfile for FarmFriend Fullstack Production Deployment

# ---- Stage 1: Build Frontend ----
FROM node:20-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
# Build production bundle to dist
RUN npm run build

# ---- Stage 2: Production Backend ----
FROM node:20-alpine AS runner
WORKDIR /app/backend

# Install curl for health check probe
RUN apk add --no-cache curl

COPY backend/package*.json ./
RUN npm install --omit=dev

COPY backend/ ./

# Copy built frontend assets into the location served by Express
COPY --from=client-builder /app/client/dist ../client/dist

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["node", "server.js"]
