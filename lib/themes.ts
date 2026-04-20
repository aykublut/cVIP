// lib/themes.ts

// Tema metadata'larını burada tutacağız. Yeni bir tema kodladığında listeye eklemen yeterli.
export const THEMES = [
  {
    id: "modern-split",
    name: "Modern Çift Kolon",
    description:
      "Sol tarafta koyu bir sütun ile şık ve profesyonel bir görünüm.",
  },
  {
    id: "minimalist-center",
    name: "Minimalist Merkez",
    description: "Zarif tipografi ile tek sütunlu, ferah ve temiz bir yapı.",
  },
  {
    id: "default-theme",
    name: "vip kalite",
    description: "vip",
  },
];

export type ThemeId = (typeof THEMES)[number]["id"];
