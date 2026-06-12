"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, PaintBrush, ShoppingBag } from "@phosphor-icons/react";
import { LazyBouquetCanvas } from "@/components/three/LazyBouquetCanvas";
import type { CaptureFn } from "@/components/three/BouquetCanvas";
import type { Preset } from "@/lib/presets";
import { useCart } from "@/store/cart";
import { priceBouquet, formatINR } from "@/lib/pricing";
import {
  flowerById,
  sizeById,
  shapeById,
  wrapById,
} from "@/lib/catalog";

export function PresetDetail({ preset }: { preset: Preset }) {
  const router = useRouter();
  const addToCart = useCart((s) => s.add);
  const captureRef = useRef<CaptureFn | null>(null);
  const [added, setAdded] = useState(false);

  const c = preset.config;
  const price = priceBouquet(c);

  const facts = [
    { label: "Flower", value: flowerById(c.flower).name },
    { label: "Size", value: `${sizeById(c.size).name} · ${sizeById(c.size).stems} stems` },
    { label: "Shape", value: shapeById(c.shape).name },
    { label: "Wrapping", value: wrapById(c.wrap).name },
  ];

  function handleAdd() {
    const thumbnail = captureRef.current?.() ?? null;
    addToCart({ name: preset.name, config: c, qty: 1, thumbnail });
    setAdded(true);
    setTimeout(() => router.push("/cart"), 600);
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8">
      <Link href="/shop" className="text-sm text-ink-soft hover:text-ink">
        ← Back to bouquets
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative h-[52vh] overflow-hidden rounded-3xl border border-line bg-surface-sunken lg:h-[600px]">
          <LazyBouquetCanvas
            config={c}
            autoRotate
            captureRef={captureRef}
            className="!h-full !w-full"
          />
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-surface/80 px-4 py-1.5 text-xs text-ink-soft backdrop-blur">
            Drag to spin · scroll to zoom
          </div>
        </div>

        <div className="lg:py-6">
          <span className="text-sm text-accent">{preset.occasion}</span>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-ink">
            {preset.name}
          </h1>
          <p className="mt-2 text-lg text-ink-soft">{preset.tagline}</p>
          <p className="mt-5 font-display text-3xl font-semibold text-ink">
            {formatINR(price.total)}
          </p>

          <dl className="mt-7 grid grid-cols-2 gap-y-4 border-t border-line pt-6">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-xs uppercase tracking-wide text-ink-faint">
                  {f.label}
                </dt>
                <dd className="mt-1 text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleAdd}
              disabled={added}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-transform hover:bg-brand-deep active:scale-[0.98] disabled:opacity-80"
            >
              {added ? (
                <>
                  <Check size={18} weight="bold" /> Added to cart
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to cart
                </>
              )}
            </button>
            <Link
              href={`/studio?preset=${preset.slug}`}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line bg-surface-raised px-6 py-3.5 font-medium text-ink transition-colors hover:border-ink-faint"
            >
              <PaintBrush size={18} /> Customise this
            </Link>
          </div>

          <p className="mt-5 text-sm text-ink-soft">
            Free delivery on orders over {formatINR(1999)}. Hand-tied fresh on the
            day of delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
