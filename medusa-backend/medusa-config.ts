import { loadEnv, defineConfig } from "@medusajs/framework/utils";

// Load environment variables from .env file
loadEnv(process.env.NODE_ENV || "development", process.cwd());

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      storeCors: process.env.STORE_CORS!,
      jwtSecret: process.env.JWT_SECRET!,
      cookieSecret: process.env.COOKIE_SECRET!,
    },
  },
  modules: [
    // ──────────────────────────────────────────────────────────────
    // File Module → Cloudinary Provider
    // Images uploaded via Medusa Admin are stored in Cloudinary.
    // @tsc_tech/medusa-plugin-cloudinary requires >= 2.4.0
    // ──────────────────────────────────────────────────────────────
    {
      resolve: "@medusajs/file",
      options: {
        providers: [
          {
            resolve: "@tsc_tech/medusa-plugin-cloudinary",
            id: "cloudinary",
            options: {
              cloudName: process.env.CLOUDINARY_CLOUD_NAME,
              apiKey: process.env.CLOUDINARY_API_KEY,
              apiSecret: process.env.CLOUDINARY_API_SECRET,
              // All product images go under medstore/ folder in Cloudinary
              folderName: process.env.CLOUDINARY_FOLDER ?? "medstore",
              secure: true,
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
