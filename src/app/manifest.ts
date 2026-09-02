import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
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
