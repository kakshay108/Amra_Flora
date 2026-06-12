// The single source of truth for every customization option.
// Prices are in INR. The 3D renderer, the studio UI, and the pricing
// engine all read from this file so they can never disagree.

export type FlowerId =
  | "rose"
  | "tulip"
  | "lily"
  | "sunflower"
  | "carnation"
  | "gerbera"
  | "orchid";

export type Shade = {
  id: string;
  name: string;
  hex: string;
};

export type Flower = {
  id: FlowerId;
  name: string;
  pricePerStem: number;
  shades: Shade[];
  /** approximate head radius in scene units, used by the layout algorithm */
  headRadius: number;
};

export const FLOWERS: Flower[] = [
  {
    id: "rose",
    name: "Rose",
    pricePerStem: 90,
    headRadius: 0.16,
    shades: [
      { id: "crimson", name: "Crimson", hex: "#a4243b" },
      { id: "blush", name: "Blush", hex: "#e8a0a8" },
      { id: "ivory", name: "Ivory", hex: "#f3ead7" },
      { id: "butter", name: "Butter yellow", hex: "#e8c34a" },
      { id: "lavender", name: "Lavender", hex: "#a98ec4" },
    ],
  },
  {
    id: "tulip",
    name: "Tulip",
    pricePerStem: 160,
    headRadius: 0.14,
    shades: [
      { id: "flame", name: "Flame red", hex: "#c03221" },
      { id: "rose-pink", name: "Rose pink", hex: "#dd6e8b" },
      { id: "white", name: "White", hex: "#f4f1e8" },
      { id: "saffron", name: "Saffron", hex: "#e0892f" },
      { id: "violet", name: "Violet", hex: "#7e5aa2" },
    ],
  },
  {
    id: "lily",
    name: "Lily",
    pricePerStem: 220,
    headRadius: 0.22,
    shades: [
      { id: "stargazer", name: "Stargazer pink", hex: "#d4537e" },
      { id: "white", name: "Pure white", hex: "#f5f3ea" },
      { id: "gold", name: "Golden", hex: "#dca73e" },
      { id: "peach", name: "Peach", hex: "#e89d72" },
    ],
  },
  {
    id: "sunflower",
    name: "Sunflower",
    pricePerStem: 110,
    headRadius: 0.24,
    shades: [
      { id: "classic", name: "Classic gold", hex: "#e3a51c" },
      { id: "amber", name: "Deep amber", hex: "#c47a16" },
      { id: "rust", name: "Velvet rust", hex: "#9c4a1e" },
    ],
  },
  {
    id: "carnation",
    name: "Carnation",
    pricePerStem: 55,
    headRadius: 0.14,
    shades: [
      { id: "scarlet", name: "Scarlet", hex: "#b62b3e" },
      { id: "candy", name: "Candy pink", hex: "#e088a9" },
      { id: "cream", name: "Cream", hex: "#f1ecdc" },
      { id: "coral", name: "Coral", hex: "#e0705a" },
      { id: "plum", name: "Plum", hex: "#8d4a78" },
    ],
  },
  {
    id: "gerbera",
    name: "Gerbera",
    pricePerStem: 60,
    headRadius: 0.2,
    shades: [
      { id: "tangerine", name: "Tangerine", hex: "#e07a2e" },
      { id: "fuchsia", name: "Fuchsia", hex: "#cf3d7c" },
      { id: "sunny", name: "Sunny yellow", hex: "#e6b32e" },
      { id: "ruby", name: "Ruby", hex: "#ad2c35" },
      { id: "snow", name: "Snow", hex: "#f2efe4" },
    ],
  },
  {
    id: "orchid",
    name: "Orchid",
    pricePerStem: 180,
    headRadius: 0.18,
    shades: [
      { id: "orchid-purple", name: "Orchid purple", hex: "#9b59a8" },
      { id: "white", name: "Moth white", hex: "#f2eee6" },
      { id: "magenta", name: "Magenta", hex: "#b83a76" },
      { id: "mint", name: "Mint green", hex: "#bcd1a0" },
    ],
  },
];

export type SizeId = "petite" | "classic" | "grand" | "lavish";

export type Size = {
  id: SizeId;
  name: string;
  stems: number;
};

export const SIZES: Size[] = [
  { id: "petite", name: "Petite", stems: 10 },
  { id: "classic", name: "Classic", stems: 20 },
  { id: "grand", name: "Grand", stems: 35 },
  { id: "lavish", name: "Lavish", stems: 50 },
];

export type StemLengthId = "short" | "standard" | "long";

export type StemLength = {
  id: StemLengthId;
  name: string;
  cm: number;
  /** scene-unit length used by the 3D renderer */
  sceneLength: number;
  priceFactor: number;
};

export const STEM_LENGTHS: StemLength[] = [
  { id: "short", name: "Short", cm: 30, sceneLength: 1.5, priceFactor: 0.9 },
  { id: "standard", name: "Standard", cm: 45, sceneLength: 2.0, priceFactor: 1 },
  { id: "long", name: "Long", cm: 60, sceneLength: 2.5, priceFactor: 1.15 },
];

export type ShapeId = "dome" | "posy" | "cascade" | "sheaf";

export type BouquetShape = {
  id: ShapeId;
  name: string;
  blurb: string;
};

export const SHAPES: BouquetShape[] = [
  { id: "dome", name: "Round dome", blurb: "The classic full, rounded arrangement" },
  { id: "posy", name: "Hand-tied posy", blurb: "Compact and dense, gathered tight" },
  { id: "cascade", name: "Cascade", blurb: "Flows forward and down, dramatic" },
  { id: "sheaf", name: "Presentation sheaf", blurb: "Flat-backed fan, carried in the arm" },
];

export type GreeneryId = "eucalyptus" | "fern" | "babys-breath" | "none";

export type Greenery = {
  id: GreeneryId;
  name: string;
  price: number;
};

export const GREENERY: Greenery[] = [
  { id: "eucalyptus", name: "Eucalyptus", price: 149 },
  { id: "fern", name: "Leather fern", price: 99 },
  { id: "babys-breath", name: "Baby's breath", price: 129 },
  { id: "none", name: "No greenery", price: 0 },
];

export type WrapId = "kraft" | "korean" | "satin" | "jute" | "box";

export type Wrap = {
  id: WrapId;
  name: string;
  price: number;
  colors: Shade[];
};

export const WRAPS: Wrap[] = [
  {
    id: "kraft",
    name: "Kraft paper",
    price: 99,
    colors: [
      { id: "natural", name: "Natural brown", hex: "#b08a5e" },
      { id: "black", name: "Charcoal", hex: "#33312d" },
      { id: "sage", name: "Sage", hex: "#9aa88a" },
      { id: "terracotta", name: "Terracotta", hex: "#b2603e" },
    ],
  },
  {
    id: "korean",
    name: "Korean wrap",
    price: 199,
    colors: [
      { id: "blush", name: "Blush", hex: "#ecc8cd" },
      { id: "ivory", name: "Ivory", hex: "#f0ebdd" },
      { id: "dove", name: "Dove grey", hex: "#c2c5c5" },
      { id: "lilac", name: "Lilac", hex: "#c5afd6" },
      { id: "forest", name: "Forest", hex: "#3c5a44" },
    ],
  },
  {
    id: "satin",
    name: "Satin",
    price: 249,
    colors: [
      { id: "champagne", name: "Champagne", hex: "#e6d3ae" },
      { id: "midnight", name: "Midnight blue", hex: "#27395c" },
      { id: "wine", name: "Wine", hex: "#6e2638" },
      { id: "pearl", name: "Pearl", hex: "#efece2" },
    ],
  },
  {
    id: "jute",
    name: "Jute",
    price: 129,
    colors: [
      { id: "raw", name: "Raw jute", hex: "#c0a06a" },
      { id: "olive", name: "Olive", hex: "#7e7a4c" },
      { id: "rust", name: "Rust", hex: "#a05a34" },
    ],
  },
  {
    id: "box",
    name: "Luxury box",
    price: 449,
    colors: [
      { id: "noir", name: "Noir", hex: "#26231f" },
      { id: "ivory", name: "Ivory", hex: "#ece6d6" },
      { id: "emerald", name: "Emerald", hex: "#1e4d38" },
      { id: "rose", name: "Rose", hex: "#c98b96" },
    ],
  },
];

export const RIBBONS: Shade[] = [
  { id: "ivory", name: "Ivory", hex: "#ece5d3" },
  { id: "gold", name: "Gold", hex: "#c9a14e" },
  { id: "crimson", name: "Crimson", hex: "#8e2a35" },
  { id: "forest", name: "Forest", hex: "#2c4a36" },
  { id: "blush", name: "Blush", hex: "#dfb0b8" },
  { id: "slate", name: "Slate", hex: "#5b6770" },
];

export type CardShapeId = "rectangle" | "heart" | "circle" | "scalloped";

export type CardShape = {
  id: CardShapeId;
  name: string;
  price: number;
};

export const CARD_SHAPES: CardShape[] = [
  { id: "rectangle", name: "Classic rectangle", price: 49 },
  { id: "heart", name: "Heart", price: 79 },
  { id: "circle", name: "Circle", price: 59 },
  { id: "scalloped", name: "Scalloped", price: 69 },
];

export const MESSAGE_MAX_LENGTH = 180;

export const DELIVERY_FEE = 99;
export const FREE_DELIVERY_ABOVE = 1999;

/** A complete bouquet design. This object is what gets saved, priced and rendered. */
export type BouquetConfig = {
  flower: FlowerId;
  shade: string;
  /** optional second flower woven through the arrangement */
  accentFlower: FlowerId | null;
  accentShade: string | null;
  size: SizeId;
  stemLength: StemLengthId;
  shape: ShapeId;
  greenery: GreeneryId;
  wrap: WrapId;
  wrapColor: string;
  ribbon: string;
  cardShape: CardShapeId | null;
  message: string;
};

export const DEFAULT_CONFIG: BouquetConfig = {
  flower: "rose",
  shade: "crimson",
  accentFlower: null,
  accentShade: null,
  size: "classic",
  stemLength: "standard",
  shape: "dome",
  greenery: "eucalyptus",
  wrap: "kraft",
  wrapColor: "natural",
  ribbon: "ivory",
  cardShape: "rectangle",
  message: "",
};

// Lookup helpers used across the app
export const flowerById = (id: FlowerId) => FLOWERS.find((f) => f.id === id)!;
export const sizeById = (id: SizeId) => SIZES.find((s) => s.id === id)!;
export const stemLengthById = (id: StemLengthId) =>
  STEM_LENGTHS.find((s) => s.id === id)!;
export const shapeById = (id: ShapeId) => SHAPES.find((s) => s.id === id)!;
export const greeneryById = (id: GreeneryId) => GREENERY.find((g) => g.id === id)!;
export const wrapById = (id: WrapId) => WRAPS.find((w) => w.id === id)!;
export const cardShapeById = (id: CardShapeId) =>
  CARD_SHAPES.find((c) => c.id === id)!;

export const shadeHex = (flower: FlowerId, shadeId: string): string => {
  const f = flowerById(flower);
  return (f.shades.find((s) => s.id === shadeId) ?? f.shades[0]).hex;
};

export const wrapColorHex = (wrapId: WrapId, colorId: string): string => {
  const w = wrapById(wrapId);
  return (w.colors.find((c) => c.id === colorId) ?? w.colors[0]).hex;
};

export const ribbonHex = (ribbonId: string): string =>
  (RIBBONS.find((r) => r.id === ribbonId) ?? RIBBONS[0]).hex;
