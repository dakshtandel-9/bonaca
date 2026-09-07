import type {
  BookingPlatformItem,
  FaqItem,
  SiteContent,
} from "@/lib/cms/types";

/** True when a link has not been filled in yet, so the UI can soften it. */
export const isPlaceholderLink = (href: string) => !href || href === "#";

export const isPlaceholderEmail = (email: string) =>
  !email || email.endsWith(".example") || email.includes("@example.");

export const isPlaceholderPhone = (phone: string) => !phone || /0{5,}|x{3,}/i.test(phone);

export const isPlaceholderLocation = (locality: string) =>
  !locality || /confirm|replace|location/i.test(locality);

/** The single preferred booking destination, used by the header and hero. */
export function primaryPlatform(content: SiteContent): BookingPlatformItem {
  const platforms = content.booking.platforms;
  return platforms.find((platform) => platform.primary) ?? platforms[0];
}

export function secondaryPlatforms(content: SiteContent): BookingPlatformItem[] {
  const primary = primaryPlatform(content);
  return content.booking.platforms.filter((platform) => platform.id !== primary?.id);
}

/** `tel:` href with the spaces the display number keeps stripped out. */
export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;

/** Filter chips for the gallery, derived so they never drift from the items. */
export function galleryCategories(content: SiteContent): string[] {
  return [
    "all",
    ...Array.from(new Set(content.home.gallery.items.map((item) => item.category))),
  ];
}

/** FAQs bucketed in the order their groups first appear. */
export function faqGroups(items: FaqItem[]): { group: string; items: FaqItem[] }[] {
  return Array.from(new Set(items.map((faq) => faq.group))).map((group) => ({
    group,
    items: items.filter((faq) => faq.group === group),
  }));
}

export const groupSlug = (group: string) => group.toLowerCase().replace(/[^a-z]+/g, "-");

/** Money, formatted once here rather than repeating "₹" through the markup. */
export function formatPrice(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}

/**
 * Everything still standing between the site and being indexable.
 *
 * Search engines stay in preview mode until every public claim and destination
 * is real. Filling the contact details and links in the CRM, and replacing the
 * seeded reviews, switches indexing, robots and the sitemap on by itself —
 * unless the owner has overridden `site.indexing` outright.
 */
export function launchIssues(content: SiteContent): string[] {
  const { site } = content;

  const requiredLinks: Record<string, string> = {
    WhatsApp: site.contact.whatsapp,
    Instagram: site.social.instagram,
    Facebook: site.social.facebook,
    Airbnb: site.links.airbnb,
    "Booking.com": site.links.booking,
    Agoda: site.links.agoda,
    "Google Maps": site.links.googleMaps,
  };

  return [
    ...(isPlaceholderEmail(site.contact.email) ? ["contact email"] : []),
    ...(isPlaceholderPhone(site.contact.phone) ? ["contact phone"] : []),
    ...(isPlaceholderLocation(site.place.locality) ? ["property location"] : []),
    ...Object.entries(requiredLinks)
      .filter(([, href]) => isPlaceholderLink(href))
      .map(([label]) => `${label} link`),
    ...(content.home.reviews.items.some((review) => review.id.startsWith("placeholder-"))
      ? ["real guest reviews"]
      : []),
  ];
}

export function isIndexable(content: SiteContent): boolean {
  if (content.site.indexing === "index") return true;
  if (content.site.indexing === "noindex") return false;
  return launchIssues(content).length === 0;
}
