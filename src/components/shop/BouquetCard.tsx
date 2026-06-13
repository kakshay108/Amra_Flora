import Link from "next/link";
import { Flower } from "@phosphor-icons/react/dist/ssr";
import { type Preset } from "@/lib/presets";
import { priceBouquet, formatINR } from "@/lib/pricing";
import { shadeHex, wrapColorHex } from "@/lib/catalog";

/** A soft, on-brand gradient swatch built from the bouquet's real colours,
 *  so every card previews the actual palette instead of a random photo. */
export function BouquetCard({ preset }: { preset: Preset }) {
  const c = preset.config;
  const price = priceBouquet(c).total;
  const bloom = shadeHex(c.flower, c.shade);
  const wrap = wrapColorHex(c.wrap, c.wrapColor);

  return (
    <Link href={`/shop/${preset.slug}`} className="group block">
      <div
        className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-3xl"
        style={{
          background: `radial-gradient(120% 100% at 50% 18%, ${bloom}33 0%, ${bloom}1f 38%, ${wrap}26 100%)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-70 transition-transform duration-500 group-hover:scale-105"
          style={{
            background: `radial-gradient(60% 45% at 50% 38%, ${bloom}66 0%, transparent 70%)`,
          }}
        />
        <Flower
          size={88}
          weight="fill"
          className="relative drop-shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
          style={{ color: bloom }}
        />
        <span className="absolute left-3 top-3 rounded-full bg-surface-raised/85 px-2.5 py-1 text-xs font-semibold text-ink-soft backdrop-blur">
          {preset.occasion}
        </span>
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight text-ink">
            {preset.name}
          </h3>
          <p className="mt-0.5 text-sm text-ink-soft">{preset.tagline}</p>
        </div>
        <span className="shrink-0 pt-0.5 font-semibold text-ink">
          {formatINR(price)}
        </span>
      </div>
    </Link>
  );
}
