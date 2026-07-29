/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker standalone runtime image
  output: "standalone",

  images: {
    remotePatterns: [
      {
        // Cloudinary CDN — all product images are hosted here
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
