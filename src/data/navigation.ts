import { ROUTES, SECTION_IDS } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";
import type {
  FooterLinkGroup,
  NavigationItem,
  SocialLink,
} from "@/types/navigation";

/** Header navigation — one entry per page, in the order the bar renders them. */
export const mainNavigation: NavigationItem[] = [
  { id: "home", label: "Home", href: ROUTES.home },
  { id: "accommodation", label: "Accommodation", href: ROUTES.accommodation },
  { id: "experiences", label: "Experiences", href: ROUTES.experiences },
  {
    id: "know-before-you-book",
    label: "Know Before You Book",
    href: ROUTES.knowBeforeYouBook,
    /** Two words on a phone, so the bar does not wrap into three lines. */
    shortLabel: "Know Before",
  },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    id: "pages",
    title: "Pages",
    items: mainNavigation.map(({ id, label, href }) => ({ id, label, href })),
  },
  {
    id: "explore",
    title: "Explore",
    items: [
      { id: "story", label: "The House", href: `${ROUTES.home}#${SECTION_IDS.story}` },
      { id: "rooms", label: "Spaces", href: `${ROUTES.home}#${SECTION_IDS.rooms}` },
      { id: "gallery", label: "Gallery", href: `${ROUTES.home}#${SECTION_IDS.gallery}` },
      { id: "moments", label: "A Day Here", href: `${ROUTES.home}#${SECTION_IDS.moments}` },
    ],
  },
  {
    id: "guest-information",
    title: "Guests",
    items: [
      { id: "rates", label: "Rates", href: `${ROUTES.accommodation}#rates` },
      { id: "amenities", label: "Amenities", href: `${ROUTES.accommodation}#amenities` },
      { id: "policies", label: "Policies", href: `${ROUTES.accommodation}#policies` },
      { id: "faqs", label: "FAQs", href: ROUTES.knowBeforeYouBook },
    ],
  },
];

/** ⚠️ Legal pages are not built yet — these anchors go nowhere. */
export const legalLinks: NavigationItem[] = [
  { id: "privacy", label: "Privacy", href: "#" },
  { id: "terms", label: "Terms", href: "#" },
];

export const socialLinks: SocialLink[] = [
  { id: "instagram", label: "Instagram", url: siteConfig.social.instagram },
  { id: "facebook", label: "Facebook", url: siteConfig.social.facebook },
  { id: "whatsapp", label: "WhatsApp", url: siteConfig.contact.whatsapp },
];
