"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackPage() {
  const router = useRouter();
  const [id, setId] = useState("");

  return (
    <div className="mx-auto max-w-lg px-5 py-20 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
        Track your order
      </h1>
      <p className="mt-2 text-ink-soft">
        Enter the order number from your confirmation email or page.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (id.trim()) router.push(`/orders/${id.trim()}`);
        }}
        className="mt-6 flex gap-3"
      >
        <input
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Order ID"
          className="flex-1 rounded-xl border border-line bg-surface-raised px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
        />
        <button
          type="submit"
          className="rounded-full bg-brand px-6 py-2.5 font-medium text-white hover:bg-brand-deep"
        >
          Track
        </button>
      </form>
    </div>
  );
}
