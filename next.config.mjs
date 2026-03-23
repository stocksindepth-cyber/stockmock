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
};

export default nextConfig;
