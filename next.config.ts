import type { NextConfig } from "next";

/**
 * The site used to be a static export. It is now server-rendered, because the
 * CRM at /admin needs route handlers, a session cookie and a live read of the
 * content stored in Firebase — none of which survive `output: "export"`.
 */
const nextConfig: NextConfig = {
  poweredByHeader: false,
  /** firebase-admin ships CJS with dynamic requires; keep it out of the bundle. */
  serverExternalPackages: ["firebase-admin"],
  images: {
    /**
     * Photography is served straight from Cloudflare R2 (or /public for the
     * originals), so nothing goes through the optimizer. Keeping this on means
     * an uploaded R2 URL works the moment it is saved, with no allow-list edit.
     */
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.dev" },
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
    ],
  },
};

export default nextConfig;
