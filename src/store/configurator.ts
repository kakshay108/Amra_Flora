"use client";

import { create } from "zustand";
import {
  type BouquetConfig,
  DEFAULT_CONFIG,
  flowerById,
  wrapById,
} from "@/lib/catalog";

type ConfiguratorState = {
  config: BouquetConfig;
  set: <K extends keyof BouquetConfig>(key: K, value: BouquetConfig[K]) => void;
  load: (config: BouquetConfig) => void;
  reset: () => void;
};

export const useConfigurator = create<ConfiguratorState>((set) => ({
  config: DEFAULT_CONFIG,

  set: (key, value) =>
    set((state) => {
      const next = { ...state.config, [key]: value };

      // Keep dependent choices valid: changing the flower resets the shade
      // if the new flower doesn't carry it, same for wrap colors.
      if (key === "flower") {
        const f = flowerById(next.flower);
        if (!f.shades.some((s) => s.id === next.shade)) {
          next.shade = f.shades[0].id;
        }
      }
      if (key === "accentFlower" && next.accentFlower) {
        const f = flowerById(next.accentFlower);
        if (!next.accentShade || !f.shades.some((s) => s.id === next.accentShade)) {
          next.accentShade = f.shades[0].id;
        }
      }
      if (key === "accentFlower" && !next.accentFlower) {
        next.accentShade = null;
      }
      if (key === "wrap") {
        const w = wrapById(next.wrap);
        if (!w.colors.some((c) => c.id === next.wrapColor)) {
          next.wrapColor = w.colors[0].id;
        }
      }

      return { config: next };
    }),

  load: (config) => set({ config }),
  reset: () => set({ config: DEFAULT_CONFIG }),
}));
