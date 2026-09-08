import type { MetadataRoute } from "next";

import { getSiteContent } from "@/lib/cms/content";
import { isIndexable } from "@/lib/cms/derive";
import { siteUrl } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const content = await getSiteContent();

  /* While the holding page is up there is nothing on the domain worth
     crawling, and a placeholder that gets indexed outlives the launch. */
  if (content.comingSoon.enabled) {
    return { rules: [{ userAgent: "*", disallow: "/" }], host: siteUrl };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    ],
    ...(isIndexable(content) ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
    host: siteUrl,
  };
}
