# Multi-stage Dockerfile for Resumix Express Backend
# Node.js Alpine LTS as requested
FROM node:22-alpine AS builder

WORKDIR /app

# Dependencies needed for Prisma engines on Alpine Linux
RUN apk add --no-cache openssl libc6-compat

# Install dependencies and generate Prisma client
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

# Production Runner Stage
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache openssl libc6-compat wget

# Install production and optional native dependencies (such as sharp-linuxmusl-x64)
COPY package*.json ./
RUN npm ci --omit=dev --include=optional && npm cache clean --force

ENV NODE_ENV=production
ENV PORT=3000

# Copy generated Prisma client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy application source code and prisma schema
COPY prisma ./prisma/
COPY . .

# Ensure storage directory for user uploads exists with correct permissions
RUN mkdir -p public/uploads && chown -R node:node /app

# Run as non-root user
USER node

# Healthcheck monitoring (dynamic port from server/.env)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT}/api/v1/health || exit 1

CMD ["npm", "start"]

