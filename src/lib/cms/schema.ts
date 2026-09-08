/**
 * ============================================================================
 *  What the CRM can edit, and how it draws each control.
 * ============================================================================
 *
 *  The admin has no hand-written forms. It walks this schema and renders a
 *  control per field, which is why "every section of every page is editable"
 *  stays true as the site grows: describe the field here, read it in the
 *  component, and the CRM picks it up.
 *
 *  `path` on a section, and `name` on a field, are dot paths into `SiteContent`
 *  — "home.hero" + "titleLines" resolves to `content.home.hero.titleLines`.
 */

export interface SelectOption {
  value: string;
  label: string;
}

interface FieldBase {
  name: string;
  label: string;
  help?: string;
  /** Lay the control out at half width where the grid allows it. */
  half?: boolean;
}

export type Field =
  | (FieldBase & { kind: "text"; placeholder?: string })
  | (FieldBase & { kind: "url"; placeholder?: string })
  | (FieldBase & { kind: "textarea"; rows?: number })
  | (FieldBase & { kind: "number"; min?: number; max?: number; step?: number })
  | (FieldBase & { kind: "boolean" })
  | (FieldBase & { kind: "select"; options: SelectOption[] })
  | (FieldBase & { kind: "image" })
  | (FieldBase & { kind: "stringList"; itemLabel?: string; multiline?: boolean })
  | (FieldBase & {
      kind: "objectList";
      itemLabel: string;
      /** Field whose value titles each row in the collapsed list. */
      titleKey: string;
      addLabel: string;
      fields: Field[];
      template: Record<string, unknown>;
      min?: number;
    });

export interface SectionSchema {
  id: string;
  label: string;
  description?: string;
  /** Dot path to the object this section's fields hang off. */
  path: string;
  /** Anchor on the public page, for the "view on site" link. */
  anchor?: string;
  fields: Field[];
}

export interface PageSchema {
  id: string;
  label: string;
  /** Public URL this page group maps to, or null for site-wide settings. */
  href: string | null;
  summary: string;
  sections: SectionSchema[];
}

const ICON_OPTIONS: SelectOption[] = [
  { value: "home", label: "House" },
  { value: "wifi", label: "Wi-Fi" },
  { value: "climate", label: "Air conditioning" },
  { value: "kitchen", label: "Kitchen" },
  { value: "parking", label: "Parking" },
  { value: "water", label: "Hot water" },
  { value: "leaf", label: "Garden" },
  { value: "bell", label: "Service" },
];

/** The four heading fields nearly every band on the site shares. */
const headingFields = (opts: { description?: boolean } = {}): Field[] => [
  {
    kind: "text",
    name: "index",
    label: "Chapter number",
    help: 'The small number beside the eyebrow, e.g. "03".',
    half: true,
  },
  { kind: "text", name: "eyebrow", label: "Eyebrow", half: true },
  { kind: "text", name: "title", label: "Heading" },
  ...(opts.description === false
    ? []
    : ([
        { kind: "textarea", name: "description", label: "Standfirst", rows: 2 },
      ] as Field[])),
];

const imageFields = (): Field[] => [
  { kind: "image", name: "src", label: "Photograph" },
  { kind: "text", name: "alt", label: "Alt text", help: "Describe the photograph for screen readers and search." },
  { kind: "number", name: "width", label: "Width (px)", half: true },
  { kind: "number", name: "height", label: "Height (px)", half: true },
];

export const CMS_SCHEMA: PageSchema[] = [
  /* ---------------------------------------------------------------- global */
  {
    id: "site",
    label: "Site & brand",
    href: null,
    summary: "Name, contact details, booking links and everything search engines read.",
    sections: [
      {
        id: "identity",
        label: "Identity",
        description: "The name and one-line pitch used across the site and in link previews.",
        path: "site",
        fields: [
          { kind: "text", name: "name", label: "Property name", half: true },
          { kind: "text", name: "tagline", label: "Tagline", half: true },
          { kind: "text", name: "title", label: "Browser & search title" },
          {
            kind: "textarea",
            name: "description",
            label: "Meta description",
            rows: 3,
            help: "Roughly 150–160 characters. This is the grey line under the title in Google.",
          },
          { kind: "text", name: "language", label: "Language tag", help: 'e.g. "en-IN"', half: true },
          { kind: "text", name: "locale", label: "Open Graph locale", help: 'e.g. "en_IN"', half: true },
        ],
      },
      {
        id: "contact",
        label: "Contact",
        description: "Shown in the footer and behind every “Call us” button.",
        path: "site.contact",
        fields: [
          { kind: "text", name: "phone", label: "Phone", half: true },
          { kind: "text", name: "email", label: "Email", half: true },
          { kind: "url", name: "whatsapp", label: "WhatsApp link", help: "Full wa.me link, e.g. https://wa.me/919000000000" },
        ],
      },
      {
        id: "links",
        label: "Booking & map links",
        description: "Where a guest actually completes a booking.",
        path: "site.links",
        fields: [
          { kind: "url", name: "airbnb", label: "Airbnb listing", half: true },
          { kind: "url", name: "booking", label: "Booking.com listing", half: true },
          { kind: "url", name: "agoda", label: "Agoda listing", half: true },
          { kind: "url", name: "googleMaps", label: "Google Maps place", half: true },
        ],
      },
      {
        id: "social",
        label: "Social profiles",
        path: "site.social",
        fields: [
          { kind: "url", name: "instagram", label: "Instagram", half: true },
          { kind: "url", name: "facebook", label: "Facebook", half: true },
        ],
      },
      {
        id: "place",
        label: "Location",
        description: "Printed in the footer and published as structured data.",
        path: "site.place",
        fields: [
          { kind: "text", name: "locality", label: "Locality", placeholder: "Alibaug, Maharashtra", half: true },
          { kind: "text", name: "region", label: "Region", half: true },
          { kind: "text", name: "countryCode", label: "Country code", placeholder: "IN", half: true },
        ],
      },
      {
        id: "branding",
        label: "Logos & share image",
        path: "site.branding",
        fields: [
          { kind: "image", name: "logoLight", label: "Logo — light (on dark backgrounds)" },
          { kind: "image", name: "logoDark", label: "Logo — dark (on light backgrounds)" },
          { kind: "image", name: "ogImage", label: "Social share image", help: "1200 × 630 works best." },
        ],
      },
      {
        id: "indexing",
        label: "Search engines",
        path: "site",
        fields: [
          {
            kind: "select",
            name: "indexing",
            label: "Indexing",
            help: "Automatic keeps the site out of search until the contact details, every booking link and the guest reviews are real.",
            options: [
              { value: "auto", label: "Automatic — index once everything is filled in" },
              { value: "index", label: "Always allow indexing" },
              { value: "noindex", label: "Never index (private / staging)" },
            ],
          },
        ],
      },
    ],
  },

  /* ---------------------------------------------------------- coming soon */
  {
    id: "comingSoon",
    label: "Coming soon",
    href: null,
    summary: "A holding page that replaces the whole site while you finish it.",
    sections: [
      {
        id: "switch",
        label: "The switch",
        description:
          "While this is on, every public page shows the holding page instead of the site, and search engines are turned away. The CRM keeps working as normal, so you can carry on editing behind it.",
        path: "comingSoon",
        fields: [
          {
            kind: "boolean",
            name: "enabled",
            label: "Show the coming soon page",
            help: "Takes effect the moment you publish.",
          },
        ],
      },
      {
        id: "words",
        label: "What it says",
        path: "comingSoon",
        fields: [
          { kind: "text", name: "eyebrow", label: "Eyebrow", half: true },
          { kind: "text", name: "title", label: "Heading" },
        ],
      },
      {
        id: "look",
        label: "Photograph & contact",
        path: "comingSoon",
        fields: [
          { kind: "image", name: "image", label: "Background photograph" },
          { kind: "text", name: "imageAlt", label: "Alt text" },
          {
            kind: "boolean",
            name: "showContact",
            label: "Show the email and phone number",
          },
          {
            kind: "boolean",
            name: "showSocial",
            label: "Show the Instagram and Facebook links",
          },
        ],
      },
    ],
  },

  {
    id: "navigation",
    label: "Menu & footer",
    href: null,
    summary: "The header links, the social row and the footer's fixed text.",
    sections: [
      {
        id: "main",
        label: "Header menu",
        path: "navigation",
        fields: [
          {
            kind: "objectList",
            name: "main",
            label: "Menu items",
            itemLabel: "Menu item",
            titleKey: "label",
            addLabel: "Add menu item",
            min: 1,
            template: { id: "new-link", label: "New page", href: "/", shortLabel: "" },
            fields: [
              { kind: "text", name: "label", label: "Label", half: true },
              { kind: "text", name: "href", label: "Link", help: 'A path like "/experiences", or "/#gallery" for a section.', half: true },
              { kind: "text", name: "shortLabel", label: "Short label", help: "Used on phones so the bar does not wrap.", half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
      {
        id: "social",
        label: "Footer social links",
        path: "navigation",
        fields: [
          {
            kind: "objectList",
            name: "social",
            label: "Links",
            itemLabel: "Link",
            titleKey: "label",
            addLabel: "Add link",
            template: { id: "new-social", label: "Instagram", url: "#" },
            fields: [
              { kind: "text", name: "label", label: "Label", half: true },
              { kind: "url", name: "url", label: "URL", half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
      {
        id: "footer",
        label: "Footer",
        path: "footer",
        fields: [
          { kind: "text", name: "contactTitle", label: "Contact heading", half: true },
          { kind: "text", name: "mapLinkLabel", label: "Map link label", half: true },
          { kind: "boolean", name: "showMap", label: "Show the Google map" },
          { kind: "text", name: "copyright", label: "Copyright line", help: "The year and property name are added automatically.", half: true },
          { kind: "text", name: "watermark", label: "Watermark word", help: "The oversized word behind the footer.", half: true },
        ],
      },
    ],
  },

  {
    id: "booking",
    label: "Booking platforms",
    href: null,
    summary: "Every place a guest can book, and which one the buttons point at.",
    sections: [
      {
        id: "platforms",
        label: "Platforms",
        description:
          "The platform marked primary is the one behind “Book Your Stay” in the header and every Book now button.",
        path: "booking",
        fields: [
          {
            kind: "objectList",
            name: "platforms",
            label: "Platforms",
            itemLabel: "Platform",
            titleKey: "name",
            addLabel: "Add platform",
            min: 1,
            template: {
              id: "new-platform",
              name: "Platform",
              url: "#",
              description: "",
              primary: false,
            },
            fields: [
              { kind: "text", name: "name", label: "Name", half: true },
              { kind: "url", name: "url", label: "URL", half: true },
              { kind: "text", name: "description", label: "One-line note" },
              { kind: "boolean", name: "primary", label: "Primary booking destination" },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
    ],
  },

  {
    id: "amenities",
    label: "Amenities",
    href: null,
    summary: "One list, shown on both the home page and the accommodation page.",
    sections: [
      {
        id: "items",
        label: "Amenity list",
        path: "amenities",
        fields: [
          {
            kind: "objectList",
            name: "items",
            label: "Amenities",
            itemLabel: "Amenity",
            titleKey: "name",
            addLabel: "Add amenity",
            template: {
              id: "new-amenity",
              name: "New amenity",
              description: "",
              iconKey: "home",
            },
            fields: [
              { kind: "text", name: "name", label: "Name", half: true },
              { kind: "select", name: "iconKey", label: "Icon", options: ICON_OPTIONS, half: true },
              { kind: "textarea", name: "description", label: "Description", rows: 2 },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
    ],
  },

  /* ------------------------------------------------------------------ home */
  {
    id: "home",
    label: "Home page",
    href: "/",
    summary: "Nine bands, from the full-bleed hero to the wall of guest quotes.",
    sections: [
      {
        id: "hero",
        label: "Hero",
        description: "The first screen: the photograph, the headline and the booking buttons.",
        path: "home.hero",
        anchor: "stay",
        fields: [
          { kind: "text", name: "eyebrow", label: "Eyebrow" },
          {
            kind: "stringList",
            name: "titleLines",
            label: "Headline",
            itemLabel: "Line",
            help: "One entry per line, so the break never lands mid-phrase.",
          },
          {
            kind: "stringList",
            name: "lede",
            label: "Supporting lines",
            itemLabel: "Line",
          },
          { kind: "text", name: "ctaLabel", label: "Primary button label", half: true },
          { kind: "textarea", name: "trustNote", label: "Reassurance note", rows: 2 },
          { kind: "image", name: "imageWide", label: "Hero photograph — landscape", help: "Shown from 760px up." },
          { kind: "image", name: "imageTall", label: "Hero photograph — portrait", help: "Shown on phones." },
          { kind: "text", name: "imageAlt", label: "Hero alt text" },
          {
            kind: "objectList",
            name: "quickLinks",
            label: "Secondary links",
            itemLabel: "Link",
            titleKey: "label",
            addLabel: "Add link",
            template: { id: "new-link", label: "Link", url: "#" },
            fields: [
              { kind: "text", name: "label", label: "Label", half: true },
              { kind: "url", name: "url", label: "URL", half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
      {
        id: "overview",
        label: "The premise",
        path: "home.overview",
        anchor: "overview",
        fields: [
          ...headingFields({ description: false }),
          { kind: "textarea", name: "statement", label: "Opening statement", rows: 4 },
          { kind: "image", name: "image", label: "Photograph" },
          { kind: "text", name: "imageAlt", label: "Alt text" },
          {
            kind: "objectList",
            name: "stats",
            label: "The ledger",
            itemLabel: "Fact",
            titleKey: "label",
            addLabel: "Add fact",
            template: { id: "new-stat", value: 0, suffix: "", label: "Label", note: "", detail: "" },
            fields: [
              { kind: "number", name: "value", label: "Number", half: true },
              { kind: "text", name: "suffix", label: "Suffix", help: 'e.g. "/7"', half: true },
              { kind: "text", name: "label", label: "Label", half: true },
              { kind: "text", name: "note", label: "Small note", half: true },
              { kind: "textarea", name: "detail", label: "Detail", rows: 2 },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
      {
        id: "story",
        label: "The house",
        path: "home.story",
        anchor: "story",
        fields: [
          ...headingFields({ description: false }),
          { kind: "image", name: "image", label: "Photograph" },
          { kind: "text", name: "imageAlt", label: "Alt text" },
          {
            kind: "stringList",
            name: "paragraphs",
            label: "Body copy",
            itemLabel: "Paragraph",
            multiline: true,
          },
          {
            kind: "objectList",
            name: "specs",
            label: "Materials",
            itemLabel: "Spec",
            titleKey: "label",
            addLabel: "Add spec",
            template: { id: "new-spec", label: "Label", value: "" },
            fields: [
              { kind: "text", name: "label", label: "Label", half: true },
              { kind: "text", name: "value", label: "Value", half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
          { kind: "text", name: "note", label: "Closing line" },
        ],
      },
      {
        id: "rooms",
        label: "Spaces",
        description: "The switcher: the list on the left drives the large frame on the right.",
        path: "home.rooms",
        anchor: "rooms",
        fields: [
          ...headingFields(),
          {
            kind: "objectList",
            name: "items",
            label: "Spaces",
            itemLabel: "Space",
            titleKey: "name",
            addLabel: "Add space",
            min: 1,
            template: {
              id: "new-space",
              index: "05",
              name: "New space",
              kind: "Interior",
              description: "",
              image: "",
              focus: "50% 50%",
              facts: [],
            },
            fields: [
              { kind: "text", name: "index", label: "Number", half: true },
              { kind: "text", name: "name", label: "Name", half: true },
              { kind: "text", name: "kind", label: "Kind", help: 'e.g. "Outdoor", "Sleeping"', half: true },
              { kind: "text", name: "focus", label: "Image focus", help: 'CSS object-position, e.g. "50% 52%".', half: true },
              { kind: "textarea", name: "description", label: "Description", rows: 3 },
              { kind: "image", name: "image", label: "Photograph" },
              { kind: "stringList", name: "facts", label: "Quick facts", itemLabel: "Fact" },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
      {
        id: "gallery",
        label: "Gallery",
        description: "The masonry grid and its lightbox. Categories become the filter chips.",
        path: "home.gallery",
        anchor: "gallery",
        fields: [
          ...headingFields(),
          {
            kind: "objectList",
            name: "items",
            label: "Photographs",
            itemLabel: "Photograph",
            titleKey: "alt",
            addLabel: "Add photograph",
            template: {
              id: "new-photo",
              src: "",
              alt: "",
              category: "exterior",
              width: 1448,
              height: 1086,
            },
            fields: [
              { kind: "image", name: "src", label: "Photograph" },
              { kind: "text", name: "alt", label: "Alt text" },
              {
                kind: "text",
                name: "category",
                label: "Category",
                help: "Becomes a filter chip. Reuse the same word across photographs.",
                half: true,
              },
              { kind: "text", name: "id", label: "Internal id", half: true },
              { kind: "number", name: "width", label: "Width (px)", half: true },
              { kind: "number", name: "height", label: "Height (px)", half: true },
            ],
          },
        ],
      },
      {
        id: "showcase",
        label: "In detail",
        description: "The hover accordion. Each panel opens under the pointer.",
        path: "home.showcase",
        anchor: "showcase",
        fields: [
          ...headingFields(),
          {
            kind: "objectList",
            name: "frames",
            label: "Panels",
            itemLabel: "Panel",
            titleKey: "label",
            addLabel: "Add panel",
            min: 1,
            template: { id: "new-frame", label: "New panel", image: "", alt: "" },
            fields: [
              { kind: "text", name: "label", label: "Caption", half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
              { kind: "image", name: "image", label: "Photograph" },
              { kind: "text", name: "alt", label: "Alt text" },
            ],
          },
        ],
      },
      {
        id: "moments",
        label: "A day here",
        description: "Four hours as full-width rows; hovering one pulls its photograph across.",
        path: "home.moments",
        anchor: "moments",
        fields: [
          ...headingFields({ description: false }),
          {
            kind: "objectList",
            name: "items",
            label: "Hours",
            itemLabel: "Hour",
            titleKey: "title",
            addLabel: "Add hour",
            min: 1,
            template: { id: "new-moment", time: "12:00", title: "", body: "", image: "" },
            fields: [
              { kind: "text", name: "time", label: "Time", half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
              { kind: "text", name: "title", label: "Title" },
              { kind: "textarea", name: "body", label: "Body", rows: 3 },
              { kind: "image", name: "image", label: "Photograph" },
            ],
          },
        ],
      },
      {
        id: "amenities",
        label: "Amenities band",
        description: "The headings only — the list itself is edited under Amenities.",
        path: "home.amenities",
        anchor: "amenities",
        fields: headingFields(),
      },
      {
        id: "reviews",
        label: "Guest reviews",
        description:
          "Three columns scrolling past each other. Remove every review and the whole band disappears from the page.",
        path: "home.reviews",
        anchor: "reviews",
        fields: [
          ...headingFields(),
          {
            kind: "objectList",
            name: "items",
            label: "Reviews",
            itemLabel: "Review",
            titleKey: "author",
            addLabel: "Add review",
            template: {
              id: "review-new",
              quote: "",
              author: "",
              origin: "",
              platform: "Airbnb",
              rating: 5,
            },
            fields: [
              { kind: "textarea", name: "quote", label: "Quote", rows: 4 },
              { kind: "text", name: "author", label: "Guest name", half: true },
              { kind: "text", name: "origin", label: "City", half: true },
              { kind: "text", name: "platform", label: "Platform", half: true },
              { kind: "number", name: "rating", label: "Rating out of 5", min: 1, max: 5, step: 1, half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
    ],
  },

  /* --------------------------------------------------------- accommodation */
  {
    id: "accommodation",
    label: "Accommodation page",
    href: "/accommodation",
    summary: "Rates, the bedrooms, the rest of the photography and the full booking terms.",
    sections: [
      {
        id: "meta",
        label: "Search listing",
        path: "accommodation.meta",
        fields: [
          { kind: "text", name: "title", label: "Page title" },
          { kind: "textarea", name: "description", label: "Meta description", rows: 3 },
        ],
      },
      {
        id: "hero",
        label: "Page hero",
        path: "accommodation.hero",
        fields: [
          { kind: "text", name: "index", label: "Chapter number", half: true },
          { kind: "text", name: "eyebrow", label: "Eyebrow", half: true },
          { kind: "text", name: "title", label: "Heading" },
          { kind: "textarea", name: "lede", label: "Standfirst", rows: 3 },
        ],
      },
      {
        id: "featured",
        label: "Opening photographs",
        description: "Three frames: the first is the large one, the other two stack beside it.",
        path: "accommodation",
        fields: [
          {
            kind: "objectList",
            name: "featuredImages",
            label: "Photographs",
            itemLabel: "Photograph",
            titleKey: "alt",
            addLabel: "Add photograph",
            min: 1,
            template: { src: "", alt: "", width: 1448, height: 1086 },
            fields: imageFields(),
          },
        ],
      },
      {
        id: "rates",
        label: "Price",
        path: "accommodation.rates",
        anchor: "rates",
        fields: [
          ...headingFields(),
          { kind: "text", name: "currency", label: "Currency code", help: 'ISO code, e.g. "INR".', half: true },
          { kind: "text", name: "leadPrefix", label: "Lead prefix", help: 'e.g. "From"', half: true },
          { kind: "number", name: "leadAmount", label: "Headline rate", half: true },
          { kind: "text", name: "leadUnit", label: "Headline unit", help: 'e.g. "per night"', half: true },
          { kind: "text", name: "leadNote", label: "Headline note" },
          { kind: "text", name: "minimumStayLabel", label: "Minimum-stay label", half: true },
          { kind: "text", name: "minimumStay", label: "Minimum stay", half: true },
          { kind: "text", name: "primaryCtaLabel", label: "Book button label", half: true },
          { kind: "text", name: "callCtaLabel", label: "Call button label", half: true },
          { kind: "textarea", name: "ctaNote", label: "Note under the buttons", rows: 2 },
          { kind: "text", name: "tableTitle", label: "Rate table heading" },
          {
            kind: "objectList",
            name: "rows",
            label: "Rate table",
            itemLabel: "Rate",
            titleKey: "label",
            addLabel: "Add rate",
            template: { id: "new-rate", label: "", detail: "", amount: 0, unit: "night" },
            fields: [
              { kind: "text", name: "label", label: "Rate", half: true },
              { kind: "number", name: "amount", label: "Amount", half: true },
              { kind: "text", name: "detail", label: "When it applies" },
              { kind: "text", name: "unit", label: "Per", help: 'e.g. "night", "guest, per night"', half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
          { kind: "text", name: "inclusionsTitle", label: "Inclusions heading" },
          { kind: "stringList", name: "inclusions", label: "What the rate covers", itemLabel: "Item" },
          { kind: "text", name: "exclusionsTitle", label: "Exclusions heading" },
          { kind: "stringList", name: "exclusions", label: "What it does not", itemLabel: "Item" },
          { kind: "textarea", name: "exclusionsNote", label: "Exclusions note", rows: 3 },
        ],
      },
      {
        id: "about",
        label: "About the villa",
        path: "accommodation.about",
        anchor: "about",
        fields: [
          ...headingFields({ description: false }),
          { kind: "stringList", name: "paragraphs", label: "Body copy", itemLabel: "Paragraph", multiline: true },
        ],
      },
      {
        id: "rooms",
        label: "Bedrooms",
        path: "accommodation.rooms",
        anchor: "rooms",
        fields: [
          ...headingFields(),
          {
            kind: "objectList",
            name: "items",
            label: "Bedrooms",
            itemLabel: "Bedroom",
            titleKey: "name",
            addLabel: "Add bedroom",
            template: {
              id: "new-bedroom",
              index: "04",
              name: "New room",
              kind: "En-suite · King bed · Sleeps 2",
              description: "",
              image: "",
              width: 1448,
              height: 1086,
              features: [],
            },
            fields: [
              { kind: "text", name: "index", label: "Number", half: true },
              { kind: "text", name: "name", label: "Name", half: true },
              { kind: "text", name: "kind", label: "Summary line", help: 'e.g. "En-suite · King bed · Sleeps 2"' },
              { kind: "textarea", name: "description", label: "Description", rows: 3 },
              { kind: "image", name: "image", label: "Photograph" },
              { kind: "number", name: "width", label: "Width (px)", half: true },
              { kind: "number", name: "height", label: "Height (px)", half: true },
              { kind: "stringList", name: "features", label: "Features", itemLabel: "Feature" },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
      {
        id: "amenities",
        label: "Amenities band",
        description: "Headings only — the list is edited under Amenities.",
        path: "accommodation.amenities",
        anchor: "amenities",
        fields: headingFields(),
      },
      {
        id: "gallery",
        label: "The rest of the house",
        path: "accommodation.gallery",
        anchor: "gallery",
        fields: [
          ...headingFields(),
          {
            kind: "objectList",
            name: "images",
            label: "Photographs",
            itemLabel: "Photograph",
            titleKey: "alt",
            addLabel: "Add photograph",
            template: { src: "", alt: "", width: 1448, height: 1086 },
            fields: imageFields(),
          },
        ],
      },
      {
        id: "policies",
        label: "The fine print",
        path: "accommodation.policies",
        anchor: "policies",
        fields: [
          ...headingFields(),
          { kind: "text", name: "timesTitle", label: "Times heading" },
          { kind: "text", name: "checkInLabel", label: "Check-in label", half: true },
          { kind: "text", name: "checkIn", label: "Check-in time", half: true },
          { kind: "textarea", name: "checkInNote", label: "Check-in note", rows: 2 },
          { kind: "text", name: "checkOutLabel", label: "Check-out label", half: true },
          { kind: "text", name: "checkOut", label: "Check-out time", half: true },
          { kind: "textarea", name: "checkOutNote", label: "Check-out note", rows: 2 },
          { kind: "text", name: "earlyCheckIn", label: "Early check-in note" },
          { kind: "text", name: "cancellationTitle", label: "Cancellation heading" },
          {
            kind: "objectList",
            name: "cancellation",
            label: "Cancellation schedule",
            itemLabel: "Clause",
            titleKey: "window",
            addLabel: "Add clause",
            template: { id: "new-clause", window: "", outcome: "" },
            fields: [
              { kind: "text", name: "window", label: "Window", help: 'e.g. "30 days or more before check-in"' },
              { kind: "textarea", name: "outcome", label: "What the guest gets back", rows: 2 },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
          { kind: "text", name: "refundTitle", label: "Refund heading" },
          { kind: "stringList", name: "refund", label: "Refund policy", itemLabel: "Point", multiline: true },
          { kind: "text", name: "ctaText", label: "Closing line" },
          { kind: "text", name: "primaryCtaLabel", label: "Book button label", half: true },
          { kind: "text", name: "callCtaLabel", label: "Call button label", half: true },
        ],
      },
    ],
  },

  /* ----------------------------------------------------------- experiences */
  {
    id: "experiences",
    label: "Experiences page",
    href: "/experiences",
    summary: "The card grid of what guests actually do, and the closing call to action.",
    sections: [
      {
        id: "meta",
        label: "Search listing",
        path: "experiences.meta",
        fields: [
          { kind: "text", name: "title", label: "Page title" },
          { kind: "textarea", name: "description", label: "Meta description", rows: 3 },
        ],
      },
      {
        id: "hero",
        label: "Page hero",
        path: "experiences.hero",
        fields: [
          { kind: "text", name: "index", label: "Chapter number", half: true },
          { kind: "text", name: "eyebrow", label: "Eyebrow", half: true },
          { kind: "text", name: "title", label: "Heading" },
          { kind: "textarea", name: "lede", label: "Standfirst", rows: 3 },
        ],
      },
      {
        id: "items",
        label: "Experience cards",
        path: "experiences",
        fields: [
          {
            kind: "objectList",
            name: "items",
            label: "Experiences",
            itemLabel: "Experience",
            titleKey: "title",
            addLabel: "Add experience",
            template: {
              id: "new-experience",
              title: "",
              description: "",
              image: "",
              width: 1448,
              height: 1086,
              alt: "",
              rating: 5,
              tag: "Included",
            },
            fields: [
              { kind: "text", name: "title", label: "Title" },
              { kind: "textarea", name: "description", label: "Description", rows: 3 },
              { kind: "image", name: "image", label: "Photograph" },
              { kind: "text", name: "alt", label: "Alt text" },
              { kind: "text", name: "tag", label: "Tag", help: 'e.g. "Included" or "On request"', half: true },
              { kind: "number", name: "rating", label: "Rating out of 5", min: 1, max: 5, step: 0.1, half: true },
              { kind: "number", name: "width", label: "Width (px)", half: true },
              { kind: "number", name: "height", label: "Height (px)", half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
            ],
          },
        ],
      },
      {
        id: "cta",
        label: "Closing band",
        path: "experiences.cta",
        fields: [
          { kind: "text", name: "title", label: "Heading" },
          { kind: "text", name: "primaryCtaLabel", label: "Book button label", half: true },
          { kind: "text", name: "callCtaLabel", label: "Call button label", half: true },
        ],
      },
    ],
  },

  /* -------------------------------------------------- know before you book */
  {
    id: "knowBeforeYouBook",
    label: "Know Before You Book",
    href: "/know-before-you-book",
    summary: "Every question a guest writes in to ask, grouped and answered in full.",
    sections: [
      {
        id: "meta",
        label: "Search listing",
        path: "knowBeforeYouBook.meta",
        fields: [
          { kind: "text", name: "title", label: "Page title" },
          { kind: "textarea", name: "description", label: "Meta description", rows: 3 },
        ],
      },
      {
        id: "hero",
        label: "Page hero",
        path: "knowBeforeYouBook.hero",
        fields: [
          { kind: "text", name: "index", label: "Chapter number", half: true },
          { kind: "text", name: "eyebrow", label: "Eyebrow", half: true },
          { kind: "text", name: "title", label: "Heading" },
          { kind: "textarea", name: "lede", label: "Standfirst", rows: 3 },
        ],
      },
      {
        id: "items",
        label: "Questions",
        description:
          "Questions are grouped by the Group field, in the order the groups first appear. The jump links at the top build themselves from it.",
        path: "knowBeforeYouBook",
        fields: [
          {
            kind: "objectList",
            name: "items",
            label: "Questions",
            itemLabel: "Question",
            titleKey: "question",
            addLabel: "Add question",
            template: { id: "new-question", group: "Booking", question: "", answer: "" },
            fields: [
              { kind: "text", name: "group", label: "Group", help: 'e.g. "Booking", "Your stay"', half: true },
              { kind: "text", name: "id", label: "Internal id", half: true },
              { kind: "text", name: "question", label: "Question" },
              { kind: "textarea", name: "answer", label: "Answer", rows: 4 },
            ],
          },
        ],
      },
      {
        id: "cta",
        label: "Closing band",
        path: "knowBeforeYouBook.cta",
        fields: [
          { kind: "text", name: "title", label: "Heading" },
          { kind: "textarea", name: "body", label: "Body", rows: 3 },
          { kind: "text", name: "primaryCtaLabel", label: "Call button label", half: true },
          { kind: "text", name: "secondaryCtaLabel", label: "Book button label", half: true },
        ],
      },
    ],
  },
];

export const findPageSchema = (id: string) => CMS_SCHEMA.find((page) => page.id === id);
