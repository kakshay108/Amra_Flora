import {
  type BouquetConfig,
  flowerById,
  sizeById,
  stemLengthById,
  greeneryById,
  wrapById,
  cardShapeById,
  DELIVERY_FEE,
  FREE_DELIVERY_ABOVE,
} from "./catalog";

export type PriceBreakdown = {
  flowers: number;
  accentFlowers: number;
  greenery: number;
  wrap: number;
  card: number;
  total: number;
};

/**
 * Pure pricing function shared by the studio (live display) and the
 * checkout server action (authoritative recalculation). Never trust a
 * client-supplied price; always recompute from the config.
 */
export function priceBouquet(config: BouquetConfig): PriceBreakdown {
  const size = sizeById(config.size);
  const lengthFactor = stemLengthById(config.stemLength).priceFactor;

  // When an accent flower is chosen, roughly a third of the stems are accents.
  const accentStems = config.accentFlower ? Math.round(size.stems / 3) : 0;
  const primaryStems = size.stems - accentStems;

  const flowers = Math.round(
    flowerById(config.flower).pricePerStem * primaryStems * lengthFactor
  );
  const accentFlowers = config.accentFlower
    ? Math.round(
        flowerById(config.accentFlower).pricePerStem * accentStems * lengthFactor
      )
    : 0;

  const greenery = greeneryById(config.greenery).price;
  const wrap = wrapById(config.wrap).price;
  const card = config.cardShape ? cardShapeById(config.cardShape).price : 0;

  const total = flowers + accentFlowers + greenery + wrap + card;
  return { flowers, accentFlowers, greenery, wrap, card, total };
}

export function deliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
