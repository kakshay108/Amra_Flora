import { type BouquetConfig, DEFAULT_CONFIG } from "./catalog";

export type Preset = {
  slug: string;
  name: string;
  tagline: string;
  occasion: string;
  /** picsum seed for the catalog photo until real photography is shot */
  imageSeed: string;
  config: BouquetConfig;
};

const make = (over: Partial<BouquetConfig>): BouquetConfig => ({
  ...DEFAULT_CONFIG,
  ...over,
});

export const PRESETS: Preset[] = [
  {
    slug: "crimson-romance",
    name: "Crimson Romance",
    tagline: "Two dozen velvet roses, hand-tied",
    occasion: "Anniversary",
    imageSeed: "amra-crimson-roses",
    config: make({
      flower: "rose",
      shade: "crimson",
      size: "grand",
      shape: "dome",
      greenery: "eucalyptus",
      wrap: "korean",
      wrapColor: "ivory",
      ribbon: "gold",
      cardShape: "heart",
    }),
  },
  {
    slug: "sunlit-morning",
    name: "Sunlit Morning",
    tagline: "Sunflowers and gerberas, full of cheer",
    occasion: "Birthday",
    imageSeed: "amra-sunflowers",
    config: make({
      flower: "sunflower",
      shade: "classic",
      accentFlower: "gerbera",
      accentShade: "tangerine",
      size: "classic",
      shape: "sheaf",
      greenery: "fern",
      wrap: "kraft",
      wrapColor: "natural",
      ribbon: "forest",
      cardShape: "rectangle",
    }),
  },
  {
    slug: "blush-whisper",
    name: "Blush Whisper",
    tagline: "Soft pink roses with baby's breath",
    occasion: "Just because",
    imageSeed: "amra-blush-roses",
    config: make({
      flower: "rose",
      shade: "blush",
      accentFlower: "carnation",
      accentShade: "candy",
      size: "classic",
      shape: "posy",
      greenery: "babys-breath",
      wrap: "satin",
      wrapColor: "pearl",
      ribbon: "blush",
      cardShape: "scalloped",
    }),
  },
  {
    slug: "lily-grace",
    name: "Lily Grace",
    tagline: "Stargazer lilies, tall and fragrant",
    occasion: "Congratulations",
    imageSeed: "amra-lilies",
    config: make({
      flower: "lily",
      shade: "stargazer",
      size: "classic",
      stemLength: "long",
      shape: "cascade",
      greenery: "eucalyptus",
      wrap: "korean",
      wrapColor: "dove",
      ribbon: "slate",
      cardShape: "rectangle",
    }),
  },
  {
    slug: "orchid-noir",
    name: "Orchid Noir",
    tagline: "Purple orchids in a luxury box",
    occasion: "Luxury gift",
    imageSeed: "amra-orchids",
    config: make({
      flower: "orchid",
      shade: "orchid-purple",
      size: "classic",
      shape: "dome",
      greenery: "eucalyptus",
      wrap: "box",
      wrapColor: "noir",
      ribbon: "gold",
      cardShape: "rectangle",
    }),
  },
  {
    slug: "marigold-festival",
    name: "Festival Glow",
    tagline: "Marigold-warm gerberas and tulips",
    occasion: "Celebration",
    imageSeed: "amra-festival",
    config: make({
      flower: "gerbera",
      shade: "sunny",
      accentFlower: "tulip",
      accentShade: "saffron",
      size: "grand",
      shape: "dome",
      greenery: "fern",
      wrap: "jute",
      wrapColor: "raw",
      ribbon: "crimson",
      cardShape: "circle",
    }),
  },
];

export const presetBySlug = (slug: string) =>
  PRESETS.find((p) => p.slug === slug);
