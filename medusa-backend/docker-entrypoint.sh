#!/bin/sh
# docker-entrypoint.sh
# Runs database migrations then starts the Medusa server.
# Migrations are idempotent — safe to run on every restart.
set -e

echo "============================================="
echo "  Medusa Backend Entrypoint"
echo "  Worker Mode: ${MEDUSA_WORKER_MODE:-server}"
echo "============================================="

echo "--> Running database migrations..."
./node_modules/.bin/medusa db:migrate

echo "--> Migrations complete. Starting Medusa..."
exec ./node_modules/.bin/medusa start
