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

/**
 * The number inside a wa.me / api.whatsapp.com link, written out for people:
 * "https://wa.me/919000000000" → "+91 90000 00000". Null when there is none.
 */
export function whatsappNumber(link: string): string | null {
  if (isPlaceholderLink(link)) return null;
  const digits = (link.match(/(?:wa\.me\/|phone=)\+?(\d{8,15})/) ?? [])[1];
  if (!digits || /0{5,}/.test(digits.slice(-10))) return null;
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return `+${digits}`;
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
    /* A hidden band makes no claims, so its seeded quotes do not block indexing. */
    ...(content.home.reviews.visible &&
    content.home.reviews.items.some((review) => review.id.startsWith("placeholder-"))
      ? ["real guest reviews"]
      : []),
  ];
}

/**
 * True while the holding page has replaced the public site.
 *
 * Every public page must check this and render nothing, not just the layout.
 * Next renders a page segment and serialises its output into the RSC payload
 * even when the layout above it discards `children` — so a page that skips
 * this check ships its whole copy to the browser inside the very page meant
 * to be hiding it. `(site)/layout.tsx` then draws the holding page itself.
 */
export const isComingSoon = (content: SiteContent): boolean =>
  FORCE_COMING_SOON || content.comingSoon.enabled;

/**
 * Pins the holding page on from code, whatever the CRM switch says.
 *
 * The CRM flag lives in Firestore, so a deploy alone cannot change it. While
 * this is `true` every deploy shows the coming soon page; set it back to
 * `false` and push to hand control back to the dashboard toggle.
 */
export const FORCE_COMING_SOON = true;

export function isIndexable(content: SiteContent): boolean {
  /* A holding page is never worth indexing, and it outranks the manual
     override — turning the site off is a clearer instruction than a setting
     someone flipped to "index" weeks ago. */
  if (isComingSoon(content)) return false;

  if (content.site.indexing === "index") return true;
  if (content.site.indexing === "noindex") return false;
  return launchIssues(content).length === 0;
}
