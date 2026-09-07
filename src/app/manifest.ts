import type { MetadataRoute } from "next";

import { getSiteContent } from "@/lib/cms/content";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { site } = await getSiteContent();

  return {
    name: site.title,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#262b13",
    theme_color: "#262b13",
    icons: [
      {
        src: "/images/bonaca/branding/symbol-dark.png",
        sizes: "900x900",
        type: "image/png",
      },
    ],
  };
}
