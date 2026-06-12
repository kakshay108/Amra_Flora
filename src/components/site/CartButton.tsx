"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Handbag } from "@phosphor-icons/react";
import { useCart } from "@/store/cart";

export function CartButton() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  // avoid hydration mismatch: cart is read from localStorage on the client
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <Link
      href="/cart"
      aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-sunken"
    >
      <Handbag size={20} weight="regular" />
      {mounted && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
