"use client";

import { useEffect, useState } from "react";
import { LazyBouquetCanvas } from "@/components/three/LazyBouquetCanvas";
import { PRESETS } from "@/lib/presets";

// Slowly rotates through a few signature designs so the hero feels alive.
const SHOWCASE = [
  PRESETS[0].config,
  PRESETS[2].config,
  PRESETS[1].config,
  PRESETS[3].config,
];

export function HeroBouquet() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % SHOWCASE.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-full w-full">
      <LazyBouquetCanvas config={SHOWCASE[i]} autoRotate className="!h-full !w-full" />
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-surface/80 px-4 py-1.5 text-xs text-ink-soft backdrop-blur">
        Drag to spin · live 3D preview
      </div>
    </div>
  );
}
