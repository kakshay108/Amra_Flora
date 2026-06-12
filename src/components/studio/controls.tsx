"use client";

import { Check } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

/** A titled section of the option panel. */
export function Section({
  step,
  title,
  hint,
  children,
}: {
  step: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <div className="mb-3.5 flex items-baseline gap-2.5">
        <span className="font-display text-xs text-ink-faint">0{step}</span>
        <h3 className="font-display text-base font-medium text-ink">{title}</h3>
        {hint && <span className="text-xs text-ink-faint">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

/** A row of selectable pills. */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  columns = 2,
}: {
  options: { id: T; label: string; sub?: string }[];
  value: T;
  onChange: (id: T) => void;
  columns?: 2 | 3 | 4;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 2 && "grid-cols-2",
        columns === 3 && "grid-cols-3",
        columns === 4 && "grid-cols-2 sm:grid-cols-4"
      )}
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            className={cn(
              "rounded-xl border px-3 py-2.5 text-left transition-colors",
              active
                ? "border-brand bg-brand/5 ring-1 ring-brand"
                : "border-line bg-surface-raised hover:border-ink-faint"
            )}
          >
            <span className="block text-sm font-medium text-ink">{opt.label}</span>
            {opt.sub && (
              <span className="mt-0.5 block text-xs text-ink-soft">{opt.sub}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** A row of color swatches. */
export function SwatchGroup({
  options,
  value,
  onChange,
}: {
  options: { id: string; name: string; hex: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            title={opt.name}
            aria-label={opt.name}
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={cn(
              "relative h-9 w-9 rounded-full transition-transform hover:scale-110",
              active
                ? "ring-2 ring-ink ring-offset-2 ring-offset-surface"
                : "ring-1 ring-line ring-offset-1 ring-offset-surface"
            )}
            style={{ backgroundColor: opt.hex }}
          >
            {active && (
              <Check
                size={16}
                weight="bold"
                className="absolute inset-0 m-auto text-white mix-blend-difference"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
