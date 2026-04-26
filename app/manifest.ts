import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "cVIP — Executive CV Builder",
    short_name: "cVIP",
    description: "ATS-uyumlu profesyonel CV oluşturucu",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#0A1930",
    theme_color: "#0052CC",
    orientation: "portrait-primary",
    categories: ["productivity", "business"],
    lang: "tr",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
