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
      address: "",
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

  comingSoon: {
    enabled: false,
    eyebrow: "Opening soon",
    title: "Bonaca is nearly ready.",
    image: IMAGES.heroWide,
    imageAlt: "The villa at dusk",
    showContact: true,
    showSocial: true,
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

    moments: {
      index: "05",
      eyebrow: "A day here",
      title: "From the first light to a properly dark night.",
      description:
        "At Bonaca, the day moves at your pace. Mornings with birds and unhurried breakfasts, days that can be spent by the pool or out exploring the Dooars, evenings that slow down with good food, and nights that are truly dark.",
      items: moments.map((moment) => ({ ...moment })),
      navLabel: "Explore the day",
      ctaLabel: "Plan Your Stay",
      ctaHref: "/accommodation",
    },

    amenities: {
      index: "06",
      eyebrow: "Amenities",
      title: "Everything, quietly handled.",
      description: "The list is short because everything on it actually works.",
    },

    region: {
      index: "07",
      eyebrow: "The Dooars",
      title: "A different side of North Bengal.",
      paragraphs: [
        "The Dooars takes its name from the gateways to Bhutan. Here, tea gardens give way to forests, rivers wind through the foothills, and life moves to a different rhythm.",
        "Bonaca is in Nagrakata, in the heart of this lesser-known corner of North Bengal. Head out to discover the region, or stay in and let the day unfold around you.",
      ],
      ctaLabel: "Discover the Dooars",
      ctaHref: "/experiences",
      image: IMAGES.galleryFieldsMorning,
      imageAlt: "Open green fields and a line of trees beyond Bonaca's walled garden in the early light",
      highlights: [
        { id: "tea-gardens", label: "Tea gardens", iconKey: "tea" },
        { id: "forests", label: "Forests", iconKey: "forest" },
        { id: "foothills", label: "Foothills", iconKey: "mountain" },
      ],
    },

    reviews: {
      visible: true,
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
      index: "02",
      eyebrow: "Rooms",
      title: "Three bedrooms, each with its own bathroom.",
      description: "Take whichever you like — nobody is assigned a room here.",
      items: bedrooms.map((room) => ({ ...room, features: [...room.features] })),
    },
    stays: {
      index: "03",
      eyebrow: "Choose your stay",
      title: "One duplex, or the whole of Bonaca.",
      description:
        "Both duplexes share the pool and the grounds. Book one for yourselves, or reserve both and keep the place to your group.",
      items: [
        {
          id: "one-duplex",
          tag: "Duplex villa",
          name: "One duplex",
          availability: "Two duplexes on the property",
          photos: [
            { id: "compound", src: IMAGES.galleryCompound, alt: "A duplex lit up at dusk across the lawn" },
            { id: "bedroom", src: IMAGES.galleryBedroomCourtyard, alt: "A bedroom opening onto the courtyard" },
            { id: "lounge", src: IMAGES.galleryLounge, alt: "The sunken lounge, lit for the evening" },
          ],
          facts: [
            { id: "guests", iconKey: "guests", label: "Up to 4 adults" },
            { id: "levels", iconKey: "stairs", label: "Two levels" },
            { id: "rooftop", iconKey: "home", label: "Private rooftop" },
          ],
          planTitle: "Breakfast, whenever",
          inclusions: [
            "Breakfast served when you are ready, not at a set hour",
            "High-speed Wi-Fi",
            "The cocktail pool, courtyard and grounds",
          ],
          note: "Lunch and dinner are cooked to order. Tell us what you would like when you book.",
          highlightLabel: "Best for",
          highlightValue: "Couples, friends or a small family",
        },
        {
          id: "both-duplexes",
          tag: "Whole property",
          name: "Both duplexes",
          availability: "All of Bonaca, for your group alone",
          photos: [
            { id: "aerial", src: IMAGES.galleryAerial, alt: "Both duplexes and the grounds from above at night" },
            { id: "pool", src: IMAGES.galleryPoolWalk, alt: "The pool beside the walk at blue hour" },
            { id: "lawn", src: IMAGES.galleryLawn, alt: "The lawn in front of the duplexes" },
          ],
          facts: [
            { id: "guests", iconKey: "guests", label: "Up to 8 adults" },
            { id: "duplexes", iconKey: "stairs", label: "Two duplexes" },
            { id: "pool", iconKey: "pool", label: "Pool to yourselves" },
          ],
          planTitle: "Breakfast, whenever",
          inclusions: [
            "Breakfast for everyone, whenever you are ready",
            "High-speed Wi-Fi throughout",
            "The pool and grounds with no other guests",
          ],
          note: "Lunch and dinner are cooked to order. Tell us what you would like when you book.",
          highlightLabel: "Best for",
          highlightValue: "Families and groups travelling together",
        },
      ],
      detailsLabel: "See the bedrooms",
      selectLabel: "Select",
      selectedLabel: "Selected",
      summaryTitle: "Your stay",
      emptyLabel: "Choose a stay to see it here.",
      summaryRows: [{ id: "minimum", label: "Minimum stay", value: minimumStay }],
      summaryNote: "Rates and availability are confirmed when you book or call us.",
      primaryCtaLabel: "Book now",
      callCtaLabel: "Call us",
    },
    amenitiesIndex: "04",
    meals: {
      index: "05",
      eyebrow: "Meals",
      title: "Good food, at your own pace.",
      description:
        "Everything is cooked in the house kitchen and served where you would like it — the courtyard, the rooftop or by the pool.",
      items: [
        {
          id: "breakfast",
          name: "Breakfast",
          time: "Whenever you're ready",
          tag: "Every morning",
          description:
            "No alarms and no fixed hour. A fresh, unhurried spread — fruit, eggs the way you like them, something regional, and good tea or coffee.",
          image: IMAGES.fields,
          imageAlt: "Green fields beyond the house in the morning light",
        },
        {
          id: "lunch",
          name: "Lunch",
          time: "Midday",
          tag: "On request",
          description: "Home-style regional cooking, or something lighter if you are heading out for the afternoon.",
          image: IMAGES.galleryPoolWalk,
          imageAlt: "The pool and the walk beside it",
        },
        {
          id: "evening-tea",
          name: "Evening tea",
          time: "Around sunset",
          tag: "On request",
          description: "Tea from the gardens around you, with something warm on the side as the light goes.",
          image: IMAGES.galleryCourtyardSunset,
          imageAlt: "The courtyard at sunset",
        },
        {
          id: "dinner",
          name: "Dinner",
          time: "When you sit down",
          tag: "On request",
          description: "Chef-cooked meals with regional flavours, served when you are ready and with time for conversation.",
          image: IMAGES.galleryLanterns,
          imageAlt: "Lanterns lit in the courtyard after dark",
        },
      ],
      note: "Vegetarian, Jain or an allergy to plan around? Tell us when you book and the kitchen will cook around you.",
    },
    wildlife: {
      index: "06",
      eyebrow: "Wildlife nearby",
      title: "The forests are closer than you think.",
      description:
        "Nagrakata sits among some of the best-known wildlife parks in North Bengal. Most are an easy morning drive for a jeep safari, with time to be back for lunch.",
      image: "",
      imageAlt: "",
      items: [
        {
          id: "chapramari",
          name: "Chapramari Wildlife Sanctuary",
          highlight: "Elephants, gaur and birdlife",
          distanceKm: 20,
          driveTime: "About 30 min",
        },
        {
          id: "gorumara",
          name: "Gorumara National Park",
          highlight: "One-horned rhino, gaur and elephants",
          distanceKm: 35,
          driveTime: "About 50 min",
        },
        {
          id: "neora-valley",
          name: "Neora Valley National Park",
          highlight: "Dense hill forest and red panda country",
          distanceKm: 40,
          driveTime: "About 1 hr 15 min",
        },
        {
          id: "jaldapara",
          name: "Jaldapara National Park",
          highlight: "Rhino, elephants and open grassland",
          distanceKm: 60,
          driveTime: "About 1 hr 30 min",
        },
        {
          id: "buxa",
          name: "Buxa Tiger Reserve",
          highlight: "Forest trails and the old Buxa fort",
          distanceKm: 95,
          driveTime: "About 2 hr 15 min",
        },
      ],
      note: "Distances are by road from Bonaca and approximate. Safari slots are limited and the parks close for the monsoon, from mid-June to mid-September — ask us and we will help you plan.",
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
