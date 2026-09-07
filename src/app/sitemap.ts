import type { MetadataRoute } from "next";

import { getSiteContent } from "@/lib/cms/content";
import { isIndexable } from "@/lib/cms/derive";
import { ROUTES } from "@/lib/constants";
import { absoluteUrl, seoImagePaths, siteUrl } from "@/lib/seo";

/** The homepage carries the photography, so only it lists the image set. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  if (!isIndexable(content)) return [];

  const pages = [
    { path: ROUTES.home, priority: 1, images: seoImagePaths(content) },
    { path: ROUTES.accommodation, priority: 0.9, images: [] as string[] },
    { path: ROUTES.experiences, priority: 0.8, images: [] as string[] },
    { path: ROUTES.knowBeforeYouBook, priority: 0.7, images: [] as string[] },
  ];

  return pages.map(({ path, priority, images }) => ({
    url: path === ROUTES.home ? siteUrl : `${siteUrl}${path}`,
    changeFrequency: "monthly",
    priority,
    images: images.map(absoluteUrl),
  }));
}
