import Link from "next/link";
import Image from "next/image";
import { type Preset } from "@/lib/presets";
import { priceBouquet, formatINR } from "@/lib/pricing";

export function BouquetCard({ preset }: { preset: Preset }) {
  const price = priceBouquet(preset.config).total;

  return (
    <Link href={`/shop/${preset.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-sunken">
        <Image
          src={`https://picsum.photos/seed/${preset.imageSeed}/640/800`}
          alt={preset.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-surface/85 px-2.5 py-1 text-xs font-medium text-ink-soft backdrop-blur">
          {preset.occasion}
        </span>
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-medium leading-tight text-ink">
            {preset.name}
          </h3>
          <p className="mt-0.5 text-sm text-ink-soft">{preset.tagline}</p>
        </div>
        <span className="shrink-0 pt-0.5 font-medium text-ink">
          {formatINR(price)}
        </span>
      </div>
    </Link>
  );
}
