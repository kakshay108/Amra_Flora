"use client";

import { useState } from "react";
import { formatINR } from "@/lib/pricing";
import {
  STATUS_FLOW,
  STATUS_LABEL,
  type Order,
  type OrderStatus,
} from "@/lib/order-types";

function OrderRow({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [saving, setSaving] = useState(false);

  async function change(next: OrderStatus) {
    setSaving(true);
    const res = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) setStatus(next);
    setSaving(false);
  }

  return (
    <tr className="border-t border-line align-top">
      <td className="py-3 pr-4">
        <p className="font-mono text-sm text-ink">#{order.id.slice(0, 8)}</p>
        <p className="text-xs text-ink-faint">
          {new Date(order.createdAt).toLocaleDateString("en-IN")}
        </p>
      </td>
      <td className="py-3 pr-4">
        <p className="text-ink">{order.customer.fullName}</p>
        <p className="text-xs text-ink-faint">
          {order.customer.city}, {order.customer.state} · {order.customer.pincode}
        </p>
        <p className="text-xs text-ink-faint">{order.customer.phone}</p>
      </td>
      <td className="py-3 pr-4 text-sm text-ink-soft">
        {order.items.map((i, idx) => (
          <div key={idx}>
            {i.qty} × {i.name}
          </div>
        ))}
        <p className="mt-1 text-xs text-ink-faint">
          Deliver {order.customer.deliveryDate} · {order.customer.deliverySlot}
        </p>
      </td>
      <td className="py-3 pr-4 font-medium text-ink">{formatINR(order.total)}</td>
      <td className="py-3">
        {order.status === "pending" || order.status === "payment_failed" ? (
          <span className="text-sm text-ink-faint">{STATUS_LABEL[order.status]}</span>
        ) : (
          <select
            value={status}
            disabled={saving}
            onChange={(e) => change(e.target.value as OrderStatus)}
            className="rounded-lg border border-line bg-surface-raised px-2.5 py-1.5 text-sm text-ink focus:border-brand focus:outline-none"
          >
            {STATUS_FLOW.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        )}
      </td>
    </tr>
  );
}

export function AdminOrders({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <p className="mt-10 rounded-xl bg-surface-sunken px-5 py-8 text-center text-ink-soft">
        No orders yet. They will appear here the moment a customer checks out.
      </p>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[720px] text-left">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-ink-faint">
            <th className="pb-2 pr-4 font-medium">Order</th>
            <th className="pb-2 pr-4 font-medium">Customer</th>
            <th className="pb-2 pr-4 font-medium">Items</th>
            <th className="pb-2 pr-4 font-medium">Total</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
