"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash, Flower } from "@phosphor-icons/react";
import { useCart } from "@/store/cart";
import { formatINR, deliveryFee } from "@/lib/pricing";

export function CartView() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.items.reduce((t, i) => t + i.unitPrice * i.qty, 0));

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1100px] px-5 py-20 text-center sm:px-8">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-sunken text-accent">
          <Flower size={28} />
        </span>
        <h1 className="mt-5 font-display text-3xl font-semibold text-ink">
          Your cart is empty
        </h1>
        <p className="mt-2 text-ink-soft">
          Let&apos;s make something beautiful to fill it.
        </p>
        <Link
          href="/studio"
          className="mt-7 inline-flex rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-transform hover:bg-brand-deep active:scale-[0.98]"
        >
          Design a bouquet
        </Link>
      </div>
    );
  }

  const delivery = deliveryFee(subtotal);
  const total = subtotal + delivery;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Your cart
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <ul className="divide-y divide-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface-sunken">
                {item.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-accent">
                    <Flower size={26} />
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-medium text-ink">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 text-sm capitalize text-ink-soft">
                      {item.config.size} · {item.config.shape} · {item.config.wrap}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Remove"
                    onClick={() => remove(item.id)}
                    className="text-ink-faint transition-colors hover:text-danger"
                  >
                    <Trash size={18} />
                  </button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="inline-flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() => setQty(item.id, item.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-ink"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      onClick={() => setQty(item.id, item.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center text-ink-soft hover:text-ink"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-medium text-ink">
                    {formatINR(item.unitPrice * item.qty)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-line bg-surface-raised p-6 lg:sticky lg:top-[88px]">
          <h2 className="font-display text-lg font-medium text-ink">
            Order summary
          </h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-ink-soft">
              <dt>Subtotal</dt>
              <dd className="text-ink">{formatINR(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-soft">
              <dt>Delivery</dt>
              <dd className="text-ink">
                {delivery === 0 ? "Free" : formatINR(delivery)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base font-medium text-ink">
              <dt>Total</dt>
              <dd>{formatINR(total)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-transform hover:bg-brand-deep active:scale-[0.98]"
          >
            Checkout
          </Link>
          <Link
            href="/studio"
            className="mt-3 flex w-full items-center justify-center text-sm text-ink-soft hover:text-ink"
          >
            Add another bouquet
          </Link>
        </div>
      </div>
    </div>
  );
}
