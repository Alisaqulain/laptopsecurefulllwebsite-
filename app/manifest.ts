import type { MetadataRoute } from "next";
import { mimeTypeForPublicImage, siteConfig } from "@/lib/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#020817",
    theme_color: "#020817",
    icons: [
      {
        src: siteConfig.logo,
        sizes: "any",
        type: mimeTypeForPublicImage(siteConfig.logo),
      },
    ],
  };
}
