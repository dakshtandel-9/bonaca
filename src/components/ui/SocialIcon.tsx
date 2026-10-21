import type { SocialLinkItem } from "@/lib/cms/types";

type Platform = "instagram" | "facebook" | "whatsapp" | "youtube" | "x" | "link";

/**
 * Social links are free-form rows in the CRM, so the platform is read from the
 * URL first and the name second — a WhatsApp row labelled "Message us" still
 * gets the WhatsApp mark, and an unknown network falls back to a plain link.
 */
export function platformOf(link: Pick<SocialLinkItem, "id" | "label" | "url">): Platform {
  const haystack = `${link.url} ${link.id} ${link.label}`.toLowerCase();
  if (haystack.includes("instagram")) return "instagram";
  if (haystack.includes("facebook") || haystack.includes("fb.com")) return "facebook";
  if (haystack.includes("whatsapp") || haystack.includes("wa.me")) return "whatsapp";
  if (haystack.includes("youtube") || haystack.includes("youtu.be")) return "youtube";
  if (haystack.includes("twitter") || /(^|[^a-z])x\.com/.test(haystack)) return "x";
  return "link";
}

const GLYPHS: Record<Platform, React.ReactNode> = {
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </g>
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M13.5 21v-7.7h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3Z"
    />
  ),
  whatsapp: (
    <g>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M20.4 11.9a8.4 8.4 0 0 1-12.5 7.3l-4.3 1.2 1.2-4.2a8.4 8.4 0 1 1 15.6-4.3Z"
      />
      <path
        fill="currentColor"
        d="M9.2 7.9c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.4l.8 1.8c.1.2.1.4 0 .6l-.5.7c-.1.2-.1.4 0 .5.6 1 1.5 1.8 2.5 2.4.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.7.8c.2.1.3.3.3.5 0 .5-.2 1.2-.8 1.6-.5.4-1.4.5-2.2.2-2.4-.8-4.3-2.6-5.2-4.9-.4-1-.2-2 .2-2.8Z"
      />
    </g>
  ),
  youtube: (
    <g>
      <rect x="2.8" y="5.6" width="18.4" height="12.8" rx="3.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path fill="currentColor" d="M10.2 9.2v5.6l4.8-2.8-4.8-2.8Z" />
    </g>
  ),
  x: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.6 4.2h4.1l10.7 15.6h-4.1Z" />
      <path d="M19.1 4.2l-6 6.7M10.9 13.2l-6 6.6" />
    </g>
  ),
  link: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M10.2 13.8a3.6 3.6 0 0 0 5.1 0l3.1-3.1a3.6 3.6 0 0 0-5.1-5.1l-1 1" />
      <path d="M13.8 10.2a3.6 3.6 0 0 0-5.1 0l-3.1 3.1a3.6 3.6 0 0 0 5.1 5.1l1-1" />
    </g>
  ),
};

/** The mark for a social link, sized by CSS and coloured by `currentColor`. */
export default function SocialIcon({ link }: { link: Pick<SocialLinkItem, "id" | "label" | "url"> }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {GLYPHS[platformOf(link)]}
    </svg>
  );
}
