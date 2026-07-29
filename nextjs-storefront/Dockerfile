# ─────────────────────────────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# ─────────────────────────────────────────────────────────────────
# Stage 2: Build
# Requires build-time env vars — pass via --build-arg or
# docker-compose build args. NEXT_PUBLIC_* must be set at BUILD time.
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# These must be provided at build time for NEXT_PUBLIC_ vars to be embedded
ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_SHOP_NAME
ARG NEXT_PUBLIC_SHOP_PHONE
ARG NEXT_PUBLIC_SHOP_WHATSAPP
ARG NEXT_PUBLIC_SHOP_ADDRESS
ARG NEXT_PUBLIC_SHOP_HOURS

ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL
ENV NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_SHOP_NAME=$NEXT_PUBLIC_SHOP_NAME
ENV NEXT_PUBLIC_SHOP_PHONE=$NEXT_PUBLIC_SHOP_PHONE
ENV NEXT_PUBLIC_SHOP_WHATSAPP=$NEXT_PUBLIC_SHOP_WHATSAPP
ENV NEXT_PUBLIC_SHOP_ADDRESS=$NEXT_PUBLIC_SHOP_ADDRESS
ENV NEXT_PUBLIC_SHOP_HOURS=$NEXT_PUBLIC_SHOP_HOURS

RUN npm run build

# ─────────────────────────────────────────────────────────────────
# Stage 3: Runtime (standalone)
# next.config.js output: 'standalone' generates a minimal runtime.
# .next/standalone includes only what's needed to run the server.
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN apk add --no-cache dumb-init

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
