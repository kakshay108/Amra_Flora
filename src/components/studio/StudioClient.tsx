"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowsClockwise, Check, ShoppingBag } from "@phosphor-icons/react";
import { LazyBouquetCanvas } from "@/components/three/LazyBouquetCanvas";
import type { CaptureFn } from "@/components/three/BouquetCanvas";
import { OptionPanel } from "./OptionPanel";
import { useConfigurator } from "@/store/configurator";
import { useCart } from "@/store/cart";
import { priceBouquet, formatINR } from "@/lib/pricing";
import { flowerById, type BouquetConfig } from "@/lib/catalog";

function designName(config: BouquetConfig): string {
  return `Custom ${flowerById(config.flower).name.toLowerCase()} bouquet`;
}

export function StudioClient({ initialConfig }: { initialConfig?: BouquetConfig }) {
  const router = useRouter();
  const config = useConfigurator((s) => s.config);
  const load = useConfigurator((s) => s.load);
  const reset = useConfigurator((s) => s.reset);
  const addToCart = useCart((s) => s.add);

  const captureRef = useRef<CaptureFn | null>(null);
  const [added, setAdded] = useState(false);

  // Preload a preset if the studio was opened from a signature bouquet.
  useEffect(() => {
    if (initialConfig) load(initialConfig);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const price = priceBouquet(config);

  function handleAdd() {
    const thumbnail = captureRef.current?.() ?? null;
    addToCart({ name: designName(config), config, qty: 1, thumbnail });
    setAdded(true);
    setTimeout(() => {
      router.push("/cart");
    }, 600);
  }

  return (
    <div className="mx-auto max-w-[1400px] lg:grid lg:grid-cols-[1.15fr_1fr]">
      {/* 3D preview */}
      <div className="lg:sticky lg:top-[68px] lg:h-[calc(100dvh-68px)]">
        <div className="relative h-[44vh] w-full overflow-hidden bg-surface-sunken lg:h-full">
          <LazyBouquetCanvas
            config={config}
            autoRotate={false}
            captureRef={captureRef}
            className="!h-full !w-full"
          />
          <button
            type="button"
            onClick={reset}
            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-surface/85 px-3 py-1.5 text-sm text-ink-soft backdrop-blur transition-colors hover:text-ink"
          >
            <ArrowsClockwise size={15} />
            Reset
          </button>
          <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-surface/80 px-4 py-1.5 text-xs text-ink-soft backdrop-blur">
            Drag to spin · scroll to zoom
          </div>
        </div>
      </div>

      {/* Options + price */}
      <div className="relative">
        <div className="px-5 pb-40 pt-7 sm:px-7 lg:pb-32">
          <div className="px-5 sm:px-7">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
              Design your bouquet
            </h1>
            <p className="mt-1.5 text-ink-soft">
              Every choice updates the 3D preview instantly.
            </p>
          </div>
          <div className="mt-6">
            <OptionPanel />
          </div>
        </div>

        {/* Sticky price + add to cart */}
        <div className="sticky bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-7">
            <div>
              <p className="text-xs text-ink-faint">Your bouquet</p>
              <p className="font-display text-2xl font-semibold text-ink">
                {formatINR(price.total)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              disabled={added}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-transform hover:bg-brand-deep active:scale-[0.98] disabled:opacity-80"
            >
              {added ? (
                <>
                  <Check size={18} weight="bold" /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
