import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { getOrder } from "@/lib/orders";
import { formatINR } from "@/lib/pricing";
import { STATUS_LABEL } from "@/lib/order-types";
import { StatusTimeline } from "@/components/orders/StatusTimeline";
import { flowerById, sizeById } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Your order",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const justPaid = order.status === "placed";

  return (
    <div className="mx-auto max-w-[820px] px-5 py-10 sm:px-8">
      {justPaid && (
        <div className="mb-7 flex items-center gap-3 rounded-2xl bg-success/10 px-5 py-4 text-success">
          <CheckCircle size={26} weight="fill" />
          <div>
            <p className="font-medium">Order confirmed. Thank you!</p>
            <p className="text-sm text-success/80">
              A confirmation has been sent to {order.customer.email}.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Order #{order.id.slice(0, 8)}
        </h1>
        <span className="rounded-full bg-surface-sunken px-3 py-1 text-sm text-ink-soft">
          {STATUS_LABEL[order.status]}
        </span>
      </div>
      <p className="mt-1 text-ink-soft">
        Placed {new Date(order.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      <div className="mt-9 grid gap-10 sm:grid-cols-[1fr_1.2fr]">
        <div>
          <h2 className="font-display text-lg font-medium text-ink">Progress</h2>
          <div className="mt-5">
            <StatusTimeline status={order.status} />
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-medium text-ink">
            Your bouquets
          </h2>
          <ul className="mt-4 divide-y divide-line">
            {order.items.map((item, i) => (
              <li key={i} className="py-3.5">
                <div className="flex justify-between gap-3">
                  <p className="font-medium text-ink">
                    {item.qty} × {item.name}
                  </p>
                  <p className="text-ink">{formatINR(item.unitPrice * item.qty)}</p>
                </div>
                <p className="mt-0.5 text-sm capitalize text-ink-soft">
                  {flowerById(item.config.flower).name} ·{" "}
                  {sizeById(item.config.size).name} · {item.config.shape} ·{" "}
                  {item.config.wrap}
                </p>
                {item.config.message && (
                  <p className="mt-1 text-sm italic text-ink-soft">
                    “{item.config.message}”
                  </p>
                )}
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <dt>Subtotal</dt>
              <dd className="text-ink">{formatINR(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink-soft">
              <dt>Delivery</dt>
              <dd className="text-ink">
                {order.delivery === 0 ? "Free" : formatINR(order.delivery)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-base font-medium text-ink">
              <dt>Total</dt>
              <dd>{formatINR(order.total)}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-xl bg-surface-sunken p-4 text-sm text-ink-soft">
            <p className="font-medium text-ink">Delivering to</p>
            <p className="mt-1">{order.customer.fullName}</p>
            <p>
              {order.customer.addressLine1}
              {order.customer.addressLine2 && `, ${order.customer.addressLine2}`}
            </p>
            <p>
              {order.customer.city}, {order.customer.state} {order.customer.pincode}
            </p>
            <p className="mt-2">
              {order.customer.deliveryDate} · {order.customer.deliverySlot}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Link href="/studio" className="text-ink-soft hover:text-ink">
          ← Design another bouquet
        </Link>
      </div>
    </div>
  );
}
