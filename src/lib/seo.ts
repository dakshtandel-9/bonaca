import { galleryItems } from "@/data/gallery";
import { reviews } from "@/data/reviews";
import { IMAGES } from "@/lib/constants";
import { isPlaceholderLink, siteConfig } from "@/lib/site-config";

export const absoluteUrl = (path: string) =>
  new URL(path.startsWith("/") ? path : `/${path}`, `${siteConfig.url}/`).toString();

export const isPlaceholderEmail = (email: string) =>
  !email || email.endsWith(".example") || email.includes("@example.");

export const isPlaceholderPhone = (phone: string) =>
  !phone || /0{5,}|x{3,}/i.test(phone);

export const isPlaceholderLocation = (locality: string) =>
  !locality || /confirm|replace|location/i.test(locality);

const requiredLinks = {
  WhatsApp: siteConfig.contact.whatsapp,
  Instagram: siteConfig.social.instagram,
  Facebook: siteConfig.social.facebook,
  Airbnb: siteConfig.links.airbnb,
  "Booking.com": siteConfig.links.booking,
  Agoda: siteConfig.links.agoda,
  "Google Maps": siteConfig.links.googleMaps,
};

/**
 * Search engines stay in preview mode until every public claim and destination
 * on the page is real. Filling site-config and replacing the seeded reviews is
 * enough to switch indexing, robots and the sitemap on automatically.
 */
export const launchIssues = [
  ...(isPlaceholderEmail(siteConfig.contact.email) ? ["contact email"] : []),
  ...(isPlaceholderPhone(siteConfig.contact.phone) ? ["contact phone"] : []),
  ...(isPlaceholderLocation(siteConfig.place.locality) ? ["property location"] : []),
  ...Object.entries(requiredLinks)
    .filter(([, href]) => isPlaceholderLink(href))
    .map(([label]) => `${label} link`),
  ...(reviews.some((review) => review.id.startsWith("placeholder-"))
    ? ["real guest reviews"]
    : []),
];

export const isSiteLaunchReady = launchIssues.length === 0;

const galleryImagePaths = galleryItems
  .map((item) => item.src)
  .filter((src): src is string => src !== null);

/** Images that describe the property and are worth surfacing to image search. */
export const seoImagePaths: string[] = Array.from(
  new Set([
    "/social/og-image.png",
    IMAGES.heroWide,
    IMAGES.heroTall,
    IMAGES.premise,
    IMAGES.story,
    ...galleryImagePaths,
  ]),
);
