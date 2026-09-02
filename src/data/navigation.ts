import { SECTION_IDS } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";
import type {
  FooterLinkGroup,
  NavigationItem,
  SocialLink,
} from "@/types/navigation";

/** Header navigation. Anchors scroll to the matching homepage section. */
export const mainNavigation: NavigationItem[] = [
  { id: "stay", label: "Stay", href: `#${SECTION_IDS.stay}` },
  { id: "gallery", label: "Gallery", href: `#${SECTION_IDS.gallery}` },
  { id: "amenities", label: "Amenities", href: `#${SECTION_IDS.amenities}` },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    id: "explore",
    title: "Explore",
    items: [
      { id: "story", label: "The House", href: `#${SECTION_IDS.story}` },
      { id: "rooms", label: "Spaces", href: `#${SECTION_IDS.rooms}` },
      { id: "gallery", label: "Gallery", href: `#${SECTION_IDS.gallery}` },
      { id: "moments", label: "A Day Here", href: `#${SECTION_IDS.moments}` },
    ],
  },
  {
    id: "guest-information",
    title: "Guests",
    items: [
      { id: "amenities", label: "Amenities", href: `#${SECTION_IDS.amenities}` },
      { id: "reviews", label: "Reviews", href: `#${SECTION_IDS.reviews}` },
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
