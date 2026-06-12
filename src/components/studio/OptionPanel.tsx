"use client";

import { useConfigurator } from "@/store/configurator";
import {
  FLOWERS,
  SIZES,
  STEM_LENGTHS,
  SHAPES,
  GREENERY,
  WRAPS,
  RIBBONS,
  CARD_SHAPES,
  MESSAGE_MAX_LENGTH,
  flowerById,
  wrapById,
  type FlowerId,
} from "@/lib/catalog";
import { Section, ChipGroup, SwatchGroup } from "./controls";

export function OptionPanel() {
  const config = useConfigurator((s) => s.config);
  const set = useConfigurator((s) => s.set);

  const flower = flowerById(config.flower);
  const wrap = wrapById(config.wrap);
  const accentOptions: { id: FlowerId | "none"; label: string }[] = [
    { id: "none", label: "None" },
    ...FLOWERS.filter((f) => f.id !== config.flower).map((f) => ({
      id: f.id,
      label: f.name,
    })),
  ];

  return (
    <div className="px-5 sm:px-7">
      <Section step={1} title="Flower" hint="the star of the bouquet">
        <ChipGroup
          columns={3}
          value={config.flower}
          onChange={(id) => set("flower", id)}
          options={FLOWERS.map((f) => ({ id: f.id, label: f.name }))}
        />
        <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wide text-ink-faint">
          Shade
        </p>
        <SwatchGroup
          value={config.shade}
          onChange={(id) => set("shade", id)}
          options={flower.shades}
        />
      </Section>

      <Section step={2} title="Accent flower" hint="optional second bloom">
        <ChipGroup
          columns={4}
          value={config.accentFlower ?? "none"}
          onChange={(id) => set("accentFlower", id === "none" ? null : id)}
          options={accentOptions}
        />
        {config.accentFlower && config.accentShade && (
          <>
            <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wide text-ink-faint">
              Accent shade
            </p>
            <SwatchGroup
              value={config.accentShade}
              onChange={(id) => set("accentShade", id)}
              options={flowerById(config.accentFlower).shades}
            />
          </>
        )}
      </Section>

      <Section step={3} title="Size">
        <ChipGroup
          columns={4}
          value={config.size}
          onChange={(id) => set("size", id)}
          options={SIZES.map((s) => ({
            id: s.id,
            label: s.name,
            sub: `${s.stems} stems`,
          }))}
        />
      </Section>

      <Section step={4} title="Stem length">
        <ChipGroup
          columns={3}
          value={config.stemLength}
          onChange={(id) => set("stemLength", id)}
          options={STEM_LENGTHS.map((s) => ({
            id: s.id,
            label: s.name,
            sub: `${s.cm} cm`,
          }))}
        />
      </Section>

      <Section step={5} title="Shape">
        <ChipGroup
          columns={2}
          value={config.shape}
          onChange={(id) => set("shape", id)}
          options={SHAPES.map((s) => ({ id: s.id, label: s.name, sub: s.blurb }))}
        />
      </Section>

      <Section step={6} title="Greenery">
        <ChipGroup
          columns={4}
          value={config.greenery}
          onChange={(id) => set("greenery", id)}
          options={GREENERY.map((g) => ({ id: g.id, label: g.name }))}
        />
      </Section>

      <Section step={7} title="Wrapping">
        <ChipGroup
          columns={3}
          value={config.wrap}
          onChange={(id) => set("wrap", id)}
          options={WRAPS.map((w) => ({ id: w.id, label: w.name }))}
        />
        <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wide text-ink-faint">
          Wrap colour
        </p>
        <SwatchGroup
          value={config.wrapColor}
          onChange={(id) => set("wrapColor", id)}
          options={wrap.colors}
        />
      </Section>

      {config.wrap !== "box" && (
        <Section step={8} title="Ribbon">
          <SwatchGroup
            value={config.ribbon}
            onChange={(id) => set("ribbon", id)}
            options={RIBBONS}
          />
        </Section>
      )}

      <Section step={config.wrap !== "box" ? 9 : 8} title="Message card">
        <ChipGroup
          columns={4}
          value={config.cardShape ?? "none"}
          onChange={(id) =>
            set("cardShape", id === "none" ? null : (id as typeof config.cardShape))
          }
          options={[
            { id: "none", label: "No card" },
            ...CARD_SHAPES.map((c) => ({ id: c.id, label: c.name })),
          ]}
        />
        {config.cardShape && (
          <div className="mt-4">
            <textarea
              value={config.message}
              maxLength={MESSAGE_MAX_LENGTH}
              onChange={(e) => set("message", e.target.value)}
              rows={3}
              placeholder="Write your note… it appears on the card in 3D."
              className="w-full resize-none rounded-xl border border-line bg-surface-raised px-3.5 py-3 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            />
            <p className="mt-1.5 text-right text-xs text-ink-faint">
              {config.message.length}/{MESSAGE_MAX_LENGTH}
            </p>
          </div>
        )}
      </Section>
    </div>
  );
}
