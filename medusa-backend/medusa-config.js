// medusa-config.js — plain JavaScript so Node.js can load it
// without ts-node. Functionally identical to medusa-config.ts.
const { defineConfig } = require("@medusajs/framework/utils");

// Load .env file only in development.
// In production (Docker), env vars come from docker-compose — loadEnv uses
// override:true which would overwrite docker-compose values with stale image-baked ones.
if (process.env.NODE_ENV !== 'production') {
  const { loadEnv } = require("@medusajs/framework/utils");
  loadEnv(process.env.NODE_ENV || 'development', process.cwd());
}

module.exports = defineConfig({
  // Admin panel is deployed separately (Vercel) pointing to this API.
  // Disabling it here skips the Vite admin bundle which fails in Docker
  // due to a known Rollup/ESM issue in this Medusa version.
  admin: {
    disable: true,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      storeCors: process.env.STORE_CORS,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },
  modules: [
    // ──────────────────────────────────────────────────────────────
    // File Module → Local Storage (default)
    // Images uploaded via Medusa Admin are stored on VPS disk.
    // Cloudinary can be wired in later once the site is live.
    // ──────────────────────────────────────────────────────────────
    {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/file-local",
            id: "local",
            options: {
              upload_dir: "uploads",
              backend_url: `${process.env.MEDUSA_BACKEND_URL}/uploads`,
            },
          },
        ],
      },
    },

    // ──────────────────────────────────────────────────────────────
    // Inventory Module
    // Tracks stock quantity per variant per Stock Location.
    // n8n sync workflow writes to this via Admin API.
    // ──────────────────────────────────────────────────────────────
    {
      resolve: "@medusajs/inventory",
    },

    // ──────────────────────────────────────────────────────────────
    // Stock Location Module
    // One location per physical shop.
    // Future: add more locations for multi-branch expansion.
    // ──────────────────────────────────────────────────────────────
    {
      resolve: "@medusajs/stock-location",
    },

    // ──────────────────────────────────────────────────────────────
    // Payment Module — intentionally NOT registered.
    // This is a browse-only storefront; no cart or checkout exists.
    // Add Razorpay/UPI provider here in a future phase.
    // ──────────────────────────────────────────────────────────────
  ],
});
