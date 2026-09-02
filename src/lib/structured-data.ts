import { amenities } from "@/data/amenities";
import { propertyStats } from "@/data/property";
import {
  absoluteUrl,
  isPlaceholderEmail,
  isPlaceholderLocation,
  isPlaceholderPhone,
  seoImagePaths,
} from "@/lib/seo";
import { isPlaceholderLink, siteConfig } from "@/lib/site-config";

/**
 * Schema.org markup so search engines can read Bonaca as a lodging business
 * rather than a generic page. Everything is derived from siteConfig and the
 * data files, so it stays correct as the placeholders are filled in — and
 * placeholder values are omitted rather than published as facts.
 *
 * Only what the page actually shows is published here: the FAQPage block went
 * when the questions came off the page, since schema for absent content is a
 * structured-data violation rather than a free win.
 */
export function buildStructuredData() {
  const sameAs = [
    siteConfig.social.instagram,
    siteConfig.social.facebook,
    siteConfig.links.airbnb,
    siteConfig.links.booking,
    siteConfig.links.agoda,
  ].filter((url) => !isPlaceholderLink(url));

  const lodgingId = `${siteConfig.url}/#lodging`;
  const websiteId = `${siteConfig.url}/#website`;
  const bedroomCount = propertyStats.find((stat) => stat.id === "bedrooms")?.value;
  const guestCount = propertyStats.find((stat) => stat.id === "guests")?.value;

  const lodging: Record<string, unknown> = {
    "@type": "LodgingBusiness",
    "@id": lodgingId,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    mainEntityOfPage: { "@id": websiteId },
    image: seoImagePaths.map(absoluteUrl),
    logo: absoluteUrl("/images/bonaca/branding/logo-dark-trim.png"),
    numberOfRooms: bedroomCount,
    containsPlace: {
      "@type": "Accommodation",
      name: `${siteConfig.name} private villa`,
      accommodationCategory: "Villa",
      numberOfBedrooms: bedroomCount,
      occupancy: {
        "@type": "QuantitativeValue",
        value: guestCount,
      },
    },
    amenityFeature: amenities.map((amenity) => ({
      "@type": "LocationFeatureSpecification",
      name: amenity.name,
      value: true,
    })),
  };

  if (sameAs.length > 0) lodging.sameAs = sameAs;
  if (!isPlaceholderPhone(siteConfig.contact.phone)) {
    lodging.telephone = siteConfig.contact.phone;
  }
  if (!isPlaceholderEmail(siteConfig.contact.email)) lodging.email = siteConfig.contact.email;
  if (!isPlaceholderLocation(siteConfig.place.locality)) {
    lodging.address = {
      "@type": "PostalAddress",
      addressLocality: siteConfig.place.locality,
      addressRegion: siteConfig.place.region,
      addressCountry: siteConfig.place.countryCode,
    };
  }
  if (!isPlaceholderLink(siteConfig.links.googleMaps)) {
    lodging.hasMap = siteConfig.links.googleMaps;
  }
  if (!isPlaceholderLink(siteConfig.links.airbnb)) {
    lodging.potentialAction = {
      "@type": "ReserveAction",
      target: siteConfig.links.airbnb,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        publisher: { "@id": lodgingId },
      },
      lodging,
    ],
  };
}
