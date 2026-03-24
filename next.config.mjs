/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next.js/Turbopack from bundling these packages.
  // google-auth-library's jwa dep calls crypto.createSign().sign(pemString)
  // which throws DECODER routines::unsupported on Node 18+ / OpenSSL 3.
  // Marking them external forces native Node.js require() for both packages,
  // so the system OpenSSL handles key loading (not a bundled copy).
  serverExternalPackages: [
    "@google-cloud/bigquery",
    "@google-cloud/common",
    "google-auth-library",
    "google-gax",
    "jws",
    "jwa",
  ],

  // Serve AVIF/WebP with long cache TTL — major LCP win for image-heavy pages
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 96, 128, 256],
  },

  compress: true,
};

export default nextConfig;
