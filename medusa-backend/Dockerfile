# ─────────────────────────────────────────────────────────────────
# Single-stage production Dockerfile for Medusa v2
#
# No pre-build step — Medusa starts directly from source using its
# own internal TypeScript/ESM loader. This is the recommended approach
# when no custom API routes or admin panel are being bundled.
#
# The image is larger than a multi-stage build but guaranteed to work
# regardless of the medusa build output location.
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine

# dumb-init: proper signal handling (PID 1 issue)
# python3/make/g++: native modules (bcrypt, pg bindings)
RUN apk add --no-cache dumb-init python3 make g++

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --no-audit --no-fund --registry https://registry.npmmirror.com

# Copy application source
COPY . .

EXPOSE 9000

# Entrypoint: runs migrations then starts server
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["dumb-init", "--"]
CMD ["./docker-entrypoint.sh"]
