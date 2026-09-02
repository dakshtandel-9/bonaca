import type { MetadataRoute } from "next";

import { absoluteUrl, isSiteLaunchReady, seoImagePaths } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isSiteLaunchReady) return [];

  return [
    {
      url: siteConfig.url,
      changeFrequency: "monthly",
      priority: 1,
      images: seoImagePaths.map(absoluteUrl),
    },
  ];
}
