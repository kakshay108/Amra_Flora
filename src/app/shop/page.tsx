import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { BouquetCard } from "@/components/shop/BouquetCard";
import { PRESETS } from "@/lib/presets";

export const metadata: Metadata = {
  title: "Signature bouquets",
  description:
    "Browse Amra's signature hand-tied bouquets. Order as-is or open any design in the studio and make it your own.",
};

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Signature bouquets
        </h1>
        <p className="mt-3 text-lg text-ink-soft">
          A starting point, not a limit. Order any of these as they are, or open
          one in the studio and change a single stem or the whole thing.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 lg:grid-cols-3 xl:grid-cols-4">
        {PRESETS.map((preset) => (
          <BouquetCard key={preset.slug} preset={preset} />
        ))}
      </div>

      <div className="mt-14 flex flex-col items-start gap-4 rounded-3xl bg-surface-sunken px-7 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Nothing quite right?
          </h2>
          <p className="mt-1 text-ink-soft">
            Start from scratch and build exactly what you have in mind.
          </p>
        </div>
        <Link
          href="/studio"
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-transform hover:bg-brand-deep active:scale-[0.98]"
        >
          Design your own
          <ArrowRight size={18} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
