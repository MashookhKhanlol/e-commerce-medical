# ─────────────────────────────────────────────────────────────────
# Stage 1: Build
# Uses Debian (not Alpine) so Rollup/Vite native binaries work correctly.
# Alpine's musl libc breaks @rollup/rollup-linux-x64-musl during admin bundling.
# Output: .medusa/server/ — the compiled production bundle
# ─────────────────────────────────────────────────────────────────
FROM node:20 AS builder

# Install build tools needed for native npm modules (bcrypt etc.)
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund --registry https://registry.npmmirror.com

COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# ─────────────────────────────────────────────────────────────────
# Stage 2: Runtime
# Copy only compiled output + production node_modules.
# Results in a significantly smaller image.
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy compiled server bundle from build stage
COPY --from=builder /app/.medusa/server ./
# Copy production-only node_modules
COPY --from=builder /app/node_modules ./node_modules

# Entrypoint script (runs migrations, then starts Medusa)
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

EXPOSE 9000

# Use dumb-init to properly handle signals in Docker
ENTRYPOINT ["dumb-init", "--", "./docker-entrypoint.sh"]
