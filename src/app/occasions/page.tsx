import type { Metadata } from "next";
import { BouquetCard } from "@/components/shop/BouquetCard";
import { PRESETS } from "@/lib/presets";

export const metadata: Metadata = {
  title: "Occasions",
  description: "Find the right bouquet for every moment, from anniversaries to congratulations.",
};

export default async function OccasionsPage({
  searchParams,
}: {
  searchParams: Promise<{ for?: string }>;
}) {
  const { for: filter } = await searchParams;
  const occasions = [...new Set(PRESETS.map((p) => p.occasion))];

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Flowers for every occasion
      </h1>
      <p className="mt-3 max-w-xl text-lg text-ink-soft">
        A bouquet for the moment, ready to send or to make your own in the studio.
      </p>

      {occasions.map((occ) => {
        const list = PRESETS.filter((p) => p.occasion === occ);
        const dim = filter && occ.toLowerCase() !== filter.toLowerCase();
        return (
          <section key={occ} className={`mt-12 ${dim ? "opacity-50" : ""}`}>
            <h2 className="font-display text-2xl font-medium text-ink">{occ}</h2>
            <div className="mt-5 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
              {list.map((preset) => (
                <BouquetCard key={preset.slug} preset={preset} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
