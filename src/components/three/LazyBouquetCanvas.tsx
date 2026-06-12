"use client";

import dynamic from "next/dynamic";
import { Flower } from "@phosphor-icons/react";
import type { ComponentProps } from "react";
import type { BouquetCanvas } from "./BouquetCanvas";

// The 3D bundle (three + drei) is heavy, so it is only loaded on the client and
// only when a canvas actually mounts. A styled loader holds the layout.
const Canvas = dynamic(
  () => import("./BouquetCanvas").then((m) => m.BouquetCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-surface-sunken">
        <div className="flex flex-col items-center gap-3 text-ink-faint">
          <Flower size={28} className="animate-pulse text-accent" />
          <span className="text-sm">Arranging your bouquet…</span>
        </div>
      </div>
    ),
  }
);

export function LazyBouquetCanvas(props: ComponentProps<typeof BouquetCanvas>) {
  return <Canvas {...props} />;
}
