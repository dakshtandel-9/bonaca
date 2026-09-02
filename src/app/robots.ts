import type { MetadataRoute } from "next";

import { isSiteLaunchReady } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    ...(isSiteLaunchReady ? { sitemap: `${siteConfig.url}/sitemap.xml` } : {}),
    host: siteConfig.url,
  };
}
