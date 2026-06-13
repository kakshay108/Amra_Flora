import Link from "next/link";
import {
  Flower,
  PaintBrushBroad,
  Cube,
  Truck,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { HeroBouquet } from "@/components/home/HeroBouquet";
import { BouquetCard } from "@/components/shop/BouquetCard";
import { PRESETS } from "@/lib/presets";

const STEPS = [
  {
    icon: Flower,
    title: "Pick your flowers",
    body: "Roses, lilies, orchids, sunflowers and more, in every shade we grow.",
  },
  {
    icon: PaintBrushBroad,
    title: "Make it yours",
    body: "Choose the size, shape, wrapping, ribbon and a card in your own words.",
  },
  {
    icon: Cube,
    title: "See it in 3D",
    body: "Spin your bouquet around and tweak it until it is exactly right.",
  },
  {
    icon: Truck,
    title: "Delivered fresh",
    body: "Hand-tied the morning of delivery and brought to their door.",
  },
];

const OCCASIONS = [
  { label: "Anniversary", from: "#d2698a", to: "#ea9a6a" },
  { label: "Birthday", from: "#ea9a6a", to: "#e8c34a" },
  { label: "Sympathy", from: "#8fb39a", to: "#bcd1c4" },
  { label: "Congratulations", from: "#a98ec4", to: "#d2698a" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 pb-10 pt-10 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pt-16">
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-3 py-1 text-sm text-ink-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Same-day delivery in select cities
          </span>
          <h1 className="mt-5 font-display text-[2.7rem] font-semibold leading-[1.04] tracking-tight text-ink sm:text-6xl">
            A bouquet as personal as the person.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            Design your own arrangement, flower by flower, and watch it come to
            life in 3D before it is hand-tied and delivered across India.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-transform hover:bg-brand-deep active:scale-[0.98]"
            >
              Design your bouquet
              <ArrowRight size={18} weight="bold" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-raised px-6 py-3.5 font-medium text-ink transition-colors hover:border-ink-faint"
            >
              Browse signatures
            </Link>
          </div>
        </div>

        <div className="relative h-[380px] overflow-hidden rounded-3xl border border-line shadow-[0_30px_80px_-40px_rgba(20,40,30,0.45)] sm:h-[460px] lg:h-[560px]">
          <HeroBouquet />
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={step.title}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken text-accent">
                  <step.icon size={20} />
                </span>
                <span className="font-display text-sm text-ink-faint">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-medium text-ink">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Signature bouquets */}
      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Loved by our customers
          </h2>
          <Link
            href="/shop"
            className="hidden shrink-0 items-center gap-1.5 text-ink-soft transition-colors hover:text-ink sm:inline-flex"
          >
            See all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-4">
          {PRESETS.slice(0, 4).map((preset) => (
            <BouquetCard key={preset.slug} preset={preset} />
          ))}
        </div>
      </section>

      {/* Occasions */}
      <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Flowers for every moment
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {OCCASIONS.map((occ) => (
            <Link
              key={occ.label}
              href={`/occasions?for=${occ.label.toLowerCase()}`}
              className="group relative flex aspect-[5/4] items-end overflow-hidden rounded-3xl p-5"
              style={{
                background: `linear-gradient(150deg, ${occ.from} 0%, ${occ.to} 100%)`,
              }}
            >
              <Flower
                size={64}
                weight="fill"
                className="absolute right-3 top-3 text-white/30 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12"
              />
              <span className="relative font-display text-xl font-semibold text-white drop-shadow-sm">
                {occ.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-8 py-16 text-center sm:px-16 sm:py-20">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Your imagination, hand-tied and delivered.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/80">
            No two Amra bouquets are the same. Start with a blank vase and make
            something only you could have dreamt up.
          </p>
          <Link
            href="/studio"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-medium text-brand transition-transform hover:bg-surface active:scale-[0.98]"
          >
            Open the design studio
            <ArrowRight size={18} weight="bold" />
          </Link>
        </div>
      </section>
    </>
  );
}
