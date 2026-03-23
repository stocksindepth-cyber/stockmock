/** @type {import('next').NextConfig} */
const nextConfig = {
  // Prevent Next.js from bundling these so native crypto (RSA signing via
  // google-auth-library) works correctly with OpenSSL 3.x on Node 18+.
  serverExternalPackages: ["@google-cloud/bigquery", "google-auth-library"],
};

export default nextConfig;
