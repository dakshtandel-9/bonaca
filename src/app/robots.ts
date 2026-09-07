import type { MetadataRoute } from "next";

import { getSiteContent } from "@/lib/cms/content";
import { isIndexable } from "@/lib/cms/derive";
import { siteUrl } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const content = await getSiteContent();

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    ],
    ...(isIndexable(content) ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
    host: siteUrl,
  };
}
