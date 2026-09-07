import {
  isPlaceholderEmail,
  isPlaceholderLink,
  isPlaceholderLocation,
  isPlaceholderPhone,
} from "@/lib/cms/derive";
import type { SiteContent } from "@/lib/cms/types";
import { absoluteUrl, seoImagePaths, siteUrl } from "@/lib/seo";

/**
 * Schema.org markup so search engines can read Bonaca as a lodging business
 * rather than a generic page. Everything is derived from the CRM content, so
 * it stays correct as the placeholders are filled in — and placeholder values
 * are omitted rather than published as facts.
 */
export function buildStructuredData(content: SiteContent) {
  const { site } = content;

  const sameAs = [
    site.social.instagram,
    site.social.facebook,
    site.links.airbnb,
    site.links.booking,
    site.links.agoda,
  ].filter((url) => !isPlaceholderLink(url));

  const lodgingId = `${siteUrl}/#lodging`;
  const websiteId = `${siteUrl}/#website`;

  const stats = content.home.overview.stats;
  const bedroomCount = stats.find((stat) => stat.id === "bedrooms")?.value;
  const guestCount = stats.find((stat) => stat.id === "guests")?.value;

  const lodging: Record<string, unknown> = {
    "@type": "LodgingBusiness",
    "@id": lodgingId,
    name: site.name,
    description: site.description,
    url: siteUrl,
    mainEntityOfPage: { "@id": websiteId },
    image: seoImagePaths(content).map(absoluteUrl),
    logo: absoluteUrl(site.branding.logoDark),
    numberOfRooms: bedroomCount,
    containsPlace: {
      "@type": "Accommodation",
      name: `${site.name} private villa`,
      accommodationCategory: "Villa",
      numberOfBedrooms: bedroomCount,
      occupancy: {
        "@type": "QuantitativeValue",
        value: guestCount,
      },
    },
    amenityFeature: content.amenities.items.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.name,
      value: true,
    })),
  };

  if (sameAs.length > 0) lodging.sameAs = sameAs;
  if (!isPlaceholderPhone(site.contact.phone)) lodging.telephone = site.contact.phone;
  if (!isPlaceholderEmail(site.contact.email)) lodging.email = site.contact.email;
  if (!isPlaceholderLocation(site.place.locality)) {
    lodging.address = {
      "@type": "PostalAddress",
      addressLocality: site.place.locality,
      addressRegion: site.place.region,
      addressCountry: site.place.countryCode,
    };
  }
  if (!isPlaceholderLink(site.links.googleMaps)) lodging.hasMap = site.links.googleMaps;
  if (!isPlaceholderLink(site.links.airbnb)) {
    lodging.potentialAction = {
      "@type": "ReserveAction",
      target: site.links.airbnb,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteUrl,
        name: site.name,
        description: site.description,
        inLanguage: site.language,
        publisher: { "@id": lodgingId },
      },
      lodging,
    ],
  };
}
