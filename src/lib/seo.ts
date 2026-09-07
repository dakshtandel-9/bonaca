import type { SiteContent } from "@/lib/cms/types";
import { siteConfig } from "@/lib/site-config";

/**
 * The deployment origin is the one thing that is not content: it belongs to
 * wherever the site is hosted, so it stays in the environment rather than in
 * the CRM, where changing it would only ever break the canonical URLs.
 */
export const siteUrl = siteConfig.url;

export const absoluteUrl = (path: string) =>
  /^https?:\/\//i.test(path)
    ? path
    : new URL(path.startsWith("/") ? path : `/${path}`, `${siteUrl}/`).toString();

/** Images that describe the property and are worth surfacing to image search. */
export function seoImagePaths(content: SiteContent): string[] {
  return Array.from(
    new Set(
      [
        content.site.branding.ogImage,
        content.home.hero.imageWide,
        content.home.hero.imageTall,
        content.home.overview.image,
        content.home.story.image,
        ...content.home.gallery.items.map((item) => item.src),
      ].filter(Boolean),
    ),
  );
}
