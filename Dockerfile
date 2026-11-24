# ── Stage 1: Build ────────────────────────────────────────────────────────────
# Astro requires Node 22.23+.
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm ci

# Copy source and build — same as `npm run build` locally (type-check + Astro build into build/)
COPY . .
RUN npm run build

# ── Stage 2: Serve ────────────────────────────────────────────────────────────
FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
#EXPOSE 8080
EXPOSE 80
