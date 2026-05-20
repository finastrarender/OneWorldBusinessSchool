/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["mongoose"],
  /**
   * next-auth/react still reads NEXTAUTH_URL in the client bundle. Mirror AUTH_URL so
   * session/csrf requests stay aligned and avoid ClientFetchError from wrong origins.
   */
  env: {
    NEXTAUTH_URL:
      process.env.AUTH_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  },
};

export default nextConfig;

