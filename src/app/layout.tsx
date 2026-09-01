import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { siteConfig } from "@/lib/site-config";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    // PLACEHOLDER: add the real image at public/social/og-image.png (1200x630).
    images: [
      {
        url: "/social/og-image.png",
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — private retreat`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/social/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
