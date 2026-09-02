import { amenities } from "@/data/amenities";
import { faqItems } from "@/data/faq";
import { propertyStats } from "@/data/property";
import { isPlaceholderLink, siteConfig } from "@/lib/site-config";

/**
 * Schema.org markup so search engines can read Bonaca as a lodging business
 * rather than a generic page. Everything is derived from siteConfig and the
 * data files, so it stays correct as the placeholders are filled in — and
 * placeholder values are omitted rather than published as facts.
 */
export function buildStructuredData() {
  const sameAs = [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.links.airbnb,
    siteConfig.links.booking,
    siteConfig.links.agoda,
  ].filter((url) => !isPlaceholderLink(url));

  const lodging: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/social/og-image.png`,
    petsAllowed: false,
    numberOfRooms: propertyStats[0].value,
    amenityFeature: amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.name,
      value: true,
    })),
  };

  if (sameAs.length > 0) lodging.sameAs = sameAs;
  if (!isPlaceholderLink(siteConfig.contact.whatsapp)) {
    lodging.telephone = siteConfig.contact.phone;
  }

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return [lodging, faq];
}
