#!/bin/sh
# docker-entrypoint.sh
# Runs on every container start for both server and worker modes.
# Migrations are idempotent — safe to run repeatedly.
set -e

echo "============================================="
echo "  Medusa Backend Entrypoint"
echo "  Worker Mode: ${MEDUSA_WORKER_MODE:-server}"
echo "============================================="

# Run database migrations before starting the server.
# The worker also runs this (idempotent) to ensure it's always
# up-to-date even if restarted independently.
echo "--> Running database migrations..."
node_modules/.bin/medusa db:migrate

echo "--> Migrations complete. Starting Medusa..."
exec node index.js
