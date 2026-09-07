import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { getSiteContent } from "@/lib/cms/content";
import { isIndexable } from "@/lib/cms/derive";
import { absoluteUrl } from "@/lib/seo";

import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * The shell only. Everything the public site wears — header, footer, loader,
 * structured data — moved into `(site)/layout.tsx` when the CRM arrived, so
 * /admin renders on a bare page rather than inside the villa's chrome.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSiteContent();
  const content = await getSiteContent();
  const indexable = isIndexable(content);

  return {
    metadataBase: new URL(absoluteUrl("/")),
    title: {
      default: site.title,
      template: `%s — ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    category: "travel",
    referrer: "origin-when-cross-origin",
    alternates: { canonical: "/" },
    formatDetection: { email: false, address: false, telephone: false },
    manifest: "/manifest.webmanifest",
    robots: {
      index: indexable,
      follow: true,
      googleBot: {
        index: indexable,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: site.title,
      description: site.description,
      url: absoluteUrl("/"),
      locale: site.locale,
      images: [
        {
          url: absoluteUrl(site.branding.ogImage),
          width: 1200,
          height: 630,
          type: "image/png",
          alt: `${site.name} — private retreat`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
      images: [absoluteUrl(site.branding.ogImage)],
    },
  };
}

/** themeColor belongs to the viewport export in Next 16, not to metadata. */
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7f0" },
    { media: "(prefers-color-scheme: dark)", color: "#262b13" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { site } = await getSiteContent();

  return (
    <html lang={site.language} className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
