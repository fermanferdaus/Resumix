# Multi-stage Dockerfile for Resumix React Frontend
# Stage 1: Build Frontend Assets
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build Arguments for Vite Environment Variables (Strictly from client/.env)
ARG VITE_API_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_SAWERIA_URL
ARG VITE_FEEDBACK_EMAIL
ARG VITE_CONTACT_EMAIL
ARG VITE_CONTACT_GITHUB
ARG VITE_CONTACT_INSTAGRAM

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_SAWERIA_URL=$VITE_SAWERIA_URL
ENV VITE_FEEDBACK_EMAIL=$VITE_FEEDBACK_EMAIL
ENV VITE_CONTACT_EMAIL=$VITE_CONTACT_EMAIL
ENV VITE_CONTACT_GITHUB=$VITE_CONTACT_GITHUB
ENV VITE_CONTACT_INSTAGRAM=$VITE_CONTACT_INSTAGRAM

RUN npm run build

# Stage 2: Serve via Nginx Alpine Web Server
FROM nginx:1.27-alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built distribution files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Healthcheck monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

