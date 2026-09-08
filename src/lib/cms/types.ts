/**
 * ============================================================================
 *  The shape of the whole website.
 * ============================================================================
 *
 *  Every word, number, link and photograph the public site renders is a field
 *  on `SiteContent`. The pages read it through `getSiteContent()`; the CRM at
 *  /admin writes it back through `src/lib/cms/store.ts`.
 *
 *  Adding a field here means: give it a default in `defaults.ts`, describe it
 *  in `schema.ts` so the CRM can edit it, and read it in the component.
 */

/** A photograph with the alt text and intrinsic size the layout needs. */
export interface ImageField {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface LinkItem {
  id: string;
  label: string;
  href: string;
  shortLabel?: string;
}

export interface SocialLinkItem {
  id: string;
  label: string;
  url: string;
}

export interface BookingPlatformItem {
  id: string;
  name: string;
  url: string;
  description: string;
  primary: boolean;
}

export interface StatItem {
  id: string;
  value: number;
  suffix: string;
  label: string;
  note: string;
  detail: string;
}

export interface SpecItem {
  id: string;
  label: string;
  value: string;
}

export interface RoomItem {
  id: string;
  index: string;
  name: string;
  kind: string;
  description: string;
  image: string;
  /** CSS object-position, so one photograph can be framed per space. */
  focus: string;
  facts: string[];
}

export interface GalleryItemContent {
  id: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
}

export interface ShowcaseFrame {
  id: string;
  label: string;
  image: string;
  alt: string;
}

export interface MomentItem {
  id: string;
  time: string;
  title: string;
  body: string;
  image: string;
}

export interface AmenityItem {
  id: string;
  name: string;
  description: string;
  iconKey: string;
}

export interface ReviewItem {
  id: string;
  quote: string;
  author: string;
  origin: string;
  platform: string;
  rating: number;
}

export interface RateRowItem {
  id: string;
  label: string;
  detail: string;
  amount: number;
  unit: string;
}

export interface PolicyClauseItem {
  id: string;
  window: string;
  outcome: string;
}

export interface BedroomItem {
  id: string;
  index: string;
  name: string;
  kind: string;
  description: string;
  image: string;
  width: number;
  height: number;
  features: string[];
}

export interface ExperienceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  rating: number;
  tag: string;
}

export interface FaqItem {
  id: string;
  group: string;
  question: string;
  answer: string;
}

/** Heading block shared by nearly every band on the site. */
export interface SectionHeading {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
}

export interface PageMeta {
  title: string;
  description: string;
}

export interface SiteContent {
  site: {
    name: string;
    title: string;
    description: string;
    tagline: string;
    locale: string;
    language: string;
    contact: { email: string; phone: string; whatsapp: string };
    social: { instagram: string; facebook: string };
    links: { airbnb: string; booking: string; agoda: string; googleMaps: string };
    place: { locality: string; region: string; countryCode: string };
    branding: { logoLight: string; logoDark: string; ogImage: string };
    /**
     * "auto" keeps the launch-readiness guard: the site stays out of search
     * until every placeholder link, the contact details and the reviews are
     * real. "index" and "noindex" override it outright.
     */
    indexing: "auto" | "index" | "noindex";
  };

  /**
   * The holding page.
   *
   * While `enabled` is true every public page renders this instead of the
   * site, and the whole domain is closed to search engines — a half-finished
   * villa listing getting indexed is far harder to undo than to prevent.
   * /admin is unaffected, so the site can go on being built behind it.
   */
  comingSoon: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    image: string;
    imageAlt: string;
    showContact: boolean;
    showSocial: boolean;
  };

  navigation: {
    main: LinkItem[];
    social: SocialLinkItem[];
  };

  booking: {
    platforms: BookingPlatformItem[];
  };

  /** Shared by the homepage band and the accommodation page band. */
  amenities: {
    items: AmenityItem[];
  };

  home: {
    hero: {
      eyebrow: string;
      titleLines: string[];
      lede: string[];
      ctaLabel: string;
      imageWide: string;
      imageTall: string;
      imageAlt: string;
      trustNote: string;
      quickLinks: SocialLinkItem[];
    };
    overview: SectionHeading & {
      statement: string;
      image: string;
      imageAlt: string;
      stats: StatItem[];
    };
    story: SectionHeading & {
      image: string;
      imageAlt: string;
      paragraphs: string[];
      specs: SpecItem[];
      note: string;
    };
    rooms: SectionHeading & { items: RoomItem[] };
    gallery: SectionHeading & { items: GalleryItemContent[] };
    showcase: SectionHeading & { frames: ShowcaseFrame[] };
    moments: SectionHeading & { items: MomentItem[] };
    amenities: SectionHeading;
    reviews: SectionHeading & { items: ReviewItem[] };
  };

  accommodation: {
    meta: PageMeta;
    hero: { index: string; eyebrow: string; title: string; lede: string };
    featuredImages: ImageField[];
    rates: SectionHeading & {
      currency: string;
      leadPrefix: string;
      leadAmount: number;
      leadUnit: string;
      leadNote: string;
      minimumStayLabel: string;
      minimumStay: string;
      primaryCtaLabel: string;
      callCtaLabel: string;
      ctaNote: string;
      tableTitle: string;
      rows: RateRowItem[];
      inclusionsTitle: string;
      inclusions: string[];
      exclusionsTitle: string;
      exclusions: string[];
      exclusionsNote: string;
    };
    about: SectionHeading & { paragraphs: string[] };
    rooms: SectionHeading & { items: BedroomItem[] };
    amenities: SectionHeading;
    gallery: SectionHeading & { images: ImageField[] };
    policies: SectionHeading & {
      timesTitle: string;
      checkInLabel: string;
      checkIn: string;
      checkInNote: string;
      checkOutLabel: string;
      checkOut: string;
      checkOutNote: string;
      earlyCheckIn: string;
      cancellationTitle: string;
      cancellation: PolicyClauseItem[];
      refundTitle: string;
      refund: string[];
      ctaText: string;
      primaryCtaLabel: string;
      callCtaLabel: string;
    };
  };

  experiences: {
    meta: PageMeta;
    hero: { index: string; eyebrow: string; title: string; lede: string };
    items: ExperienceItem[];
    cta: { title: string; primaryCtaLabel: string; callCtaLabel: string };
  };

  knowBeforeYouBook: {
    meta: PageMeta;
    hero: { index: string; eyebrow: string; title: string; lede: string };
    items: FaqItem[];
    cta: { title: string; body: string; primaryCtaLabel: string; secondaryCtaLabel: string };
  };

  footer: {
    contactTitle: string;
    showMap: boolean;
    mapLinkLabel: string;
    watermark: string;
    copyright: string;
  };
}

/** What the store keeps alongside the content itself. */
export interface StoredContent {
  content: SiteContent;
  updatedAt: string;
  updatedBy: string;
}

/** A file in the media library. */
export interface MediaItem {
  key: string;
  url: string;
  size: number;
  uploadedAt: string;
  contentType: string;
}
