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
  { id: "location", label: "Location", href: `#${SECTION_IDS.location}` },
  { id: "contact", label: "Contact", href: `#${SECTION_IDS.booking}` },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    id: "explore",
    title: "Quick Links",
    items: [
      { id: "stay", label: "Stay", href: `#${SECTION_IDS.stay}` },
      { id: "gallery", label: "Gallery", href: `#${SECTION_IDS.gallery}` },
      {
        id: "amenities",
        label: "Amenities",
        href: `#${SECTION_IDS.amenities}`,
      },
      { id: "location", label: "Location", href: `#${SECTION_IDS.location}` },
    ],
  },
  {
    id: "guest-information",
    title: "Guest Information",
    items: [
      {
        id: "book",
        label: "Book Your Stay",
        href: `#${SECTION_IDS.booking}`,
      },
      // PLACEHOLDER: these pages do not exist yet.
      { id: "policies", label: "Stay Policies", href: "#" },
      { id: "faq", label: "FAQ", href: "#" },
      { id: "house-rules", label: "House Rules", href: "#" },
    ],
  },
];

/** PLACEHOLDER: legal pages are not built yet. */
export const legalLinks: NavigationItem[] = [
  { id: "privacy", label: "Privacy Policy", href: "#" },
  { id: "terms", label: "Terms", href: "#" },
];

export const socialLinks: SocialLink[] = [
  { id: "instagram", label: "Instagram", url: siteConfig.social.instagram },
  { id: "facebook", label: "Facebook", url: siteConfig.social.facebook },
  { id: "whatsapp", label: "WhatsApp", url: siteConfig.contact.whatsapp },
];
