import {
  aboutTheVilla,
  bedrooms,
  cancellationPolicy,
  CURRENCY,
  featuredImages,
  leadRate,
  minimumStay,
  rateExclusions,
  rateInclusions,
  rateRows,
  refundPolicy,
  stayTimes,
  villaImages,
} from "@/data/accommodation";
import { amenities } from "@/data/amenities";
import { experiences } from "@/data/experiences";
import { faqs } from "@/data/faqs";
import { galleryItems } from "@/data/gallery";
import { moments } from "@/data/moments";
import { mainNavigation } from "@/data/navigation";
import { overviewStatement, property, propertyStats } from "@/data/property";
import { reviews } from "@/data/reviews";
import { rooms } from "@/data/rooms";
import { showcaseFrames } from "@/data/showcase";
import type { SiteContent } from "@/lib/cms/types";
import { IMAGES } from "@/lib/constants";
import { siteConfig } from "@/lib/site-config";

/**
 * The site exactly as it shipped, expressed as content.
 *
 * This is the floor the CRM edits sit on: anything the owner has never touched
 * still renders from here, so a half-filled Firestore document can never leave
 * a blank band on the page. `merge.ts` layers the stored document over it.
 */
export const DEFAULT_CONTENT: SiteContent = {
  site: {
    name: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    tagline: siteConfig.tagline,
    locale: siteConfig.locale,
    language: siteConfig.language,
    contact: {
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      whatsapp: siteConfig.contact.whatsapp,
    },
    social: {
      instagram: siteConfig.social.instagram,
      facebook: siteConfig.social.facebook,
    },
    links: {
      airbnb: siteConfig.links.airbnb,
      booking: siteConfig.links.booking,
      agoda: siteConfig.links.agoda,
      googleMaps: siteConfig.links.googleMaps,
    },
    place: {
      locality: siteConfig.place.locality,
      region: siteConfig.place.region,
      countryCode: siteConfig.place.countryCode,
    },
    branding: {
      logoLight: IMAGES.logoLight,
      logoDark: IMAGES.logoDark,
      ogImage: "/social/og-image.png",
    },
    indexing: "auto",
  },

  navigation: {
    main: mainNavigation.map((item) => ({
      id: item.id,
      label: item.label,
      href: item.href,
      shortLabel: item.shortLabel ?? "",
    })),
    social: [
      { id: "instagram", label: "Instagram", url: siteConfig.social.instagram },
      { id: "facebook", label: "Facebook", url: siteConfig.social.facebook },
      { id: "whatsapp", label: "WhatsApp", url: siteConfig.contact.whatsapp },
    ],
  },

  booking: {
    platforms: [
      {
        id: "airbnb",
        name: "Airbnb",
        url: siteConfig.links.airbnb,
        description: "Live calendar, instant confirmation",
        primary: true,
      },
      {
        id: "booking",
        name: "Booking.com",
        url: siteConfig.links.booking,
        description: "Free cancellation options",
        primary: false,
      },
      {
        id: "agoda",
        name: "Agoda",
        url: siteConfig.links.agoda,
        description: "Seasonal rates",
        primary: false,
      },
      {
        id: "whatsapp",
        name: "WhatsApp",
        url: siteConfig.contact.whatsapp,
        description: "Ask us anything, directly",
        primary: false,
      },
    ],
  },

  amenities: {
    items: amenities.map((amenity) => ({
      id: amenity.id,
      name: amenity.name,
      description: amenity.description,
      iconKey: amenity.iconKey,
    })),
  },

  home: {
    hero: {
      eyebrow: "Bonaca · Private Retreat",
      titleLines: ["A Private Retreat", "Rooted in Calm."],
      lede: [
        "A thoughtfully designed private stay",
        "surrounded by greenery, comfort and quiet.",
      ],
      ctaLabel: "View on Airbnb",
      imageWide: IMAGES.heroWide,
      imageTall: IMAGES.heroTall,
      imageAlt:
        "Bonaca villa glowing at blue hour, surrounded by a quiet garden and stone path",
      trustNote:
        "Reservations are completed securely through our listing partners.",
      quickLinks: [
        { id: "booking", label: "Booking.com", url: siteConfig.links.booking },
        { id: "agoda", label: "Agoda", url: siteConfig.links.agoda },
        { id: "google-maps", label: "Google Maps", url: siteConfig.links.googleMaps },
      ],
    },

    overview: {
      index: "01",
      eyebrow: "The premise",
      title: "A home made for slower days.",
      description: "",
      statement: overviewStatement,
      image: IMAGES.premise,
      imageAlt: "Bonaca's illuminated entrance and landscaped grounds at dusk",
      stats: propertyStats.map((stat) => ({
        id: stat.id,
        value: stat.value,
        suffix: stat.suffix,
        label: stat.label,
        note: stat.note,
        detail: stat.detail,
      })),
    },

    story: {
      index: "02",
      eyebrow: "The house",
      title: "Built slowly, on purpose.",
      description: "",
      image: IMAGES.story,
      imageAlt: "Bonaca's pool courtyard and warmly illuminated villa at blue hour",
      paragraphs: [...property.intro],
      specs: [
        { id: "walls", label: "Walls", value: "Lime-washed, 18 inches deep" },
        { id: "floors", label: "Floors", value: "Local limestone, honed" },
        { id: "frames", label: "Frames", value: "Solid teak, oiled" },
      ],
      note: "The quiet is the amenity.",
    },

    rooms: {
      index: "03",
      eyebrow: "Spaces",
      title: "Four rooms to lose an afternoon in.",
      description: "Move through the house before you arrive.",
      items: rooms.map((room) => ({ ...room, facts: [...room.facts] })),
    },

    gallery: {
      index: "04",
      eyebrow: "Gallery",
      title: "Spaces that photograph honestly.",
      description:
        "Every picture here is the house as it stands. Nothing staged elsewhere, nothing borrowed.",
      items: galleryItems.map((item) => ({
        id: item.id,
        src: item.src ?? "",
        alt: item.alt,
        category: item.category,
        width: item.width,
        height: item.height,
      })),
    },

    showcase: {
      index: "05",
      eyebrow: "In detail",
      title: "One frame at a time.",
      description: "The same house, taken slowly. Hover a panel to open it.",
      frames: showcaseFrames.map((frame) => ({
        id: frame.id,
        label: frame.label ?? "",
        image: frame.image,
        alt: frame.alt ?? "",
      })),
    },

    moments: {
      index: "06",
      eyebrow: "A day here",
      title: "Sunrise to properly dark.",
      description: "",
      items: moments.map((moment) => ({ ...moment })),
    },

    amenities: {
      index: "07",
      eyebrow: "Amenities",
      title: "Everything, quietly handled.",
      description: "The list is short because everything on it actually works.",
    },

    reviews: {
      index: "08",
      eyebrow: "Guests",
      title: "In their words.",
      description:
        "Every quote below is left exactly as the guest wrote it, on the platform they booked through.",
      items: reviews.map((review) => ({ ...review })),
    },
  },

  accommodation: {
    meta: {
      title: "Accommodation",
      description:
        "Rates, rooms, amenities and the full booking terms for Bonaca — a three-bedroom private villa let to one group at a time.",
    },
    hero: {
      index: "01",
      eyebrow: "Accommodation",
      title: "The whole house, one group at a time.",
      lede: "Three en-suite bedrooms, two acres, and a caretaker who stays out of the way. Everything it costs and everything it does not is set out below.",
    },
    featuredImages: featuredImages.map((image) => ({
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
    })),
    rates: {
      index: "02",
      eyebrow: "Price",
      title: "One rate, for the entire villa.",
      description:
        "You are never quoted per room. The number below buys the house, the grounds and the gate closing behind you.",
      currency: CURRENCY,
      leadPrefix: "From",
      leadAmount: leadRate.amount,
      leadUnit: leadRate.unit,
      leadNote: leadRate.note,
      minimumStayLabel: "Minimum stay",
      minimumStay,
      primaryCtaLabel: "Book now",
      callCtaLabel: "Call us",
      ctaNote:
        "Booked direct on Airbnb, or on the phone with us — the rate is the same either way.",
      tableTitle: "Pricing",
      rows: rateRows.map((row) => ({ ...row })),
      inclusionsTitle: "What the rate covers",
      inclusions: [...rateInclusions],
      exclusionsTitle: "What it does not",
      exclusions: [...rateExclusions],
      exclusionsNote:
        "Pricing excludes transport charges, taxes and anything eaten — those are quoted separately and at cost, so nothing lands on you at check-out.",
    },
    about: {
      index: "03",
      eyebrow: "About the villa",
      title: "What you are actually booking.",
      description: "",
      paragraphs: [...aboutTheVilla],
    },
    rooms: {
      index: "04",
      eyebrow: "Rooms",
      title: "Three bedrooms, each with its own bathroom.",
      description: "Take whichever you like — nobody is assigned a room here.",
      items: bedrooms.map((room) => ({ ...room, features: [...room.features] })),
    },
    amenities: {
      index: "05",
      eyebrow: "Amenities",
      title: "Everything, quietly handled.",
      description: "The list is short because everything on it actually works.",
    },
    gallery: {
      index: "06",
      eyebrow: "The rest of it",
      title: "The rest of the house, nothing staged.",
      description:
        "Every picture here is the house as it stands, shot at the hour the lighting was built for.",
      images: villaImages.map((image) => ({
        src: image.src,
        alt: image.alt,
        width: image.width,
        height: image.height,
      })),
    },
    policies: {
      index: "07",
      eyebrow: "The fine print",
      title: "Times, cancellations and refunds.",
      description: "All of it stated here rather than buried in a confirmation email.",
      timesTitle: "Check-in & check-out",
      checkInLabel: "Check-in",
      checkIn: stayTimes.checkIn,
      checkInNote: stayTimes.checkInNote,
      checkOutLabel: "Check-out",
      checkOut: stayTimes.checkOut,
      checkOutNote: stayTimes.checkOutNote,
      earlyCheckIn: stayTimes.earlyCheckIn,
      cancellationTitle: "Cancellation policy",
      cancellation: cancellationPolicy.map((clause) => ({ ...clause })),
      refundTitle: "Refund policy",
      refund: [...refundPolicy],
      ctaText: "Dates in mind? The calendar is live on Airbnb.",
      primaryCtaLabel: "Book now",
      callCtaLabel: "Call us",
    },
  },

  experiences: {
    meta: {
      title: "Experiences",
      description:
        "Sunrise over the fields, the long lunch table, bonfires in the courtyard — the nine things guests actually do at Bonaca, and which of them the rate already covers.",
    },
    hero: {
      index: "01",
      eyebrow: "Experiences",
      title: "Days here are shaped, not scheduled.",
      lede: "Nothing on this page has to be booked in advance or paid for at a desk. It is simply what the house is good at, hour by hour.",
    },
    items: experiences.map((experience) => ({ ...experience })),
    cta: {
      title: "Pick a date and the rest arranges itself.",
      primaryCtaLabel: "Book now",
      callCtaLabel: "Call us",
    },
  },

  knowBeforeYouBook: {
    meta: {
      title: "Know Before You Book",
      description:
        "Check-in times, what the rate leaves out, house rules, cancellations and refunds — every question guests ask about Bonaca, answered in full and nothing hidden behind a toggle.",
    },
    hero: {
      index: "01",
      eyebrow: "Know before you book",
      title: "Nothing here is in the small print.",
      lede: "Everything guests write in to ask, answered in full. No toggles, no scrolling to find the catch — if it affects what you pay or what you can do, it is on this page.",
    },
    items: faqs.map((faq) => ({ ...faq })),
    cta: {
      title: "Still not answered?",
      body: "Call and ask. The person who picks up is the person who runs the house — and the full tariff and policy schedule sits on the accommodation page.",
      primaryCtaLabel: "Call us",
      secondaryCtaLabel: "Book now",
    },
  },

  footer: {
    contactTitle: "Contact",
    showMap: true,
    mapLinkLabel: "Open in Google Maps",
    watermark: "bonaca",
    copyright: "All rights reserved.",
  },
};
