"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { formatINR, deliveryFee } from "@/lib/pricing";
import { DELIVERY_SLOTS, INDIAN_STATES, type DeliveryDetails } from "@/lib/order-types";

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const EMPTY: DeliveryDetails = {
  fullName: "",
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
  deliveryDate: "",
  deliverySlot: DELIVERY_SLOTS[0],
  giftNote: "",
};

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-sm font-medium text-ink">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "rounded-xl border border-line bg-surface-raised px-3.5 py-2.5 text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotal = useCart((s) => s.items.reduce((t, i) => t + i.unitPrice * i.qty, 0));

  const [form, setForm] = useState<DeliveryDetails>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const set = <K extends keyof DeliveryDetails>(k: K, v: DeliveryDetails[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const delivery = deliveryFee(subtotal);
  const total = subtotal + delivery;
  const minDate = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  async function finishOrder(orderId: string, extra?: Partial<RazorpayResponse> & { mock?: boolean }) {
    const res = await fetch("/api/payment/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, ...extra }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Payment could not be confirmed.");
    }
    clear();
    router.push(`/orders/${orderId}`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ name: i.name, config: i.config, qty: i.qty })),
          customer: form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed.");

      if (data.mock) {
        await finishOrder(data.orderId, { mock: true });
        return;
      }

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) throw new Error("Could not load the payment window.");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Amra Flowers",
        description: "Custom bouquet order",
        order_id: data.razorpayOrderId,
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        theme: { color: "#1d3a2a" },
        handler: async (response: RazorpayResponse) => {
          try {
            await finishOrder(data.orderId, response);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment failed.");
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  }

  if (mounted && items.length === 0) {
    return (
      <div className="mx-auto max-w-[700px] px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Nothing to check out
        </h1>
        <p className="mt-2 text-ink-soft">Your cart is empty.</p>
        <Link
          href="/studio"
          className="mt-6 inline-flex rounded-full bg-brand px-6 py-3.5 font-medium text-white hover:bg-brand-deep"
        >
          Design a bouquet
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto grid max-w-[1100px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.5fr_1fr]"
    >
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Checkout
        </h1>

        <h2 className="mt-8 font-display text-lg font-medium text-ink">
          Who is it for &amp; where?
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Full name" className="col-span-2">
            <input
              className={inputCls}
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Recipient or your name"
              required
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputCls}
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="you@email.com"
              required
            />
          </Field>
          <Field label="Mobile number">
            <input
              inputMode="numeric"
              className={inputCls}
              value={form.phone}
              onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile"
              required
            />
          </Field>
          <Field label="Address" className="col-span-2">
            <input
              className={inputCls}
              value={form.addressLine1}
              onChange={(e) => set("addressLine1", e.target.value)}
              placeholder="House / flat, street"
              required
            />
          </Field>
          <Field label="Landmark / area (optional)" className="col-span-2">
            <input
              className={inputCls}
              value={form.addressLine2}
              onChange={(e) => set("addressLine2", e.target.value)}
              placeholder="Apartment, landmark"
            />
          </Field>
          <Field label="City">
            <input
              className={inputCls}
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              required
            />
          </Field>
          <Field label="State">
            <select
              className={inputCls}
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
              required
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="PIN code">
            <input
              inputMode="numeric"
              className={inputCls}
              value={form.pincode}
              onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="6-digit PIN"
              required
            />
          </Field>
        </div>

        <h2 className="mt-9 font-display text-lg font-medium text-ink">
          When should we deliver?
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Delivery date">
            <input
              type="date"
              min={minDate}
              className={inputCls}
              value={form.deliveryDate}
              onChange={(e) => set("deliveryDate", e.target.value)}
              required
            />
          </Field>
          <Field label="Time slot">
            <select
              className={inputCls}
              value={form.deliverySlot}
              onChange={(e) => set("deliverySlot", e.target.value)}
            >
              {DELIVERY_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Gift note for the courier (optional)" className="col-span-2">
            <input
              className={inputCls}
              value={form.giftNote}
              onChange={(e) => set("giftNote", e.target.value)}
              placeholder="e.g. Leave with the security desk"
            />
          </Field>
        </div>
      </div>

      {/* Summary */}
      <div className="h-fit rounded-2xl border border-line bg-surface-raised p-6 lg:sticky lg:top-[88px]">
        <h2 className="font-display text-lg font-medium text-ink">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {mounted &&
            items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3 text-sm">
                <span className="text-ink-soft">
                  {i.qty} × {i.name}
                </span>
                <span className="text-ink">{formatINR(i.unitPrice * i.qty)}</span>
              </li>
            ))}
        </ul>
        <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
          <div className="flex justify-between text-ink-soft">
            <dt>Subtotal</dt>
            <dd className="text-ink">{formatINR(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-ink-soft">
            <dt>Delivery</dt>
            <dd className="text-ink">{delivery === 0 ? "Free" : formatINR(delivery)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-2.5 text-base font-medium text-ink">
            <dt>Total</dt>
            <dd>{formatINR(total)}</dd>
          </div>
        </dl>

        {error && (
          <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-5 flex w-full items-center justify-center rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-transform hover:bg-brand-deep active:scale-[0.98] disabled:opacity-70"
        >
          {busy ? "Processing…" : `Pay ${formatINR(total)}`}
        </button>
        <p className="mt-3 text-center text-xs text-ink-faint">
          Secure payment via Razorpay · UPI, cards, netbanking
        </p>
      </div>
    </form>
  );
}
