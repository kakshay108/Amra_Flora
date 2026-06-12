import { NextResponse } from "next/server";
import { priceCart, validateCustomer, type IncomingItem } from "@/lib/checkout";
import { createOrder, updateOrder } from "@/lib/orders";
import { razorpay } from "@/lib/razorpay";
import { env, hasRazorpay } from "@/lib/env";
import { type DeliveryDetails } from "@/lib/order-types";

export async function POST(req: Request) {
  let body: { items?: IncomingItem[]; customer?: Partial<DeliveryDetails> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = body.items ?? [];
  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }

  const errors = validateCustomer(body.customer ?? {});
  if (errors.length) {
    return NextResponse.json({ error: errors[0], errors }, { status: 400 });
  }

  // Authoritative server-side pricing. The client total is never trusted.
  let priced;
  try {
    priced = priceCart(items);
  } catch {
    return NextResponse.json(
      { error: "One of your bouquets is no longer valid." },
      { status: 400 }
    );
  }

  const order = await createOrder({
    items: priced.items,
    subtotal: priced.subtotal,
    delivery: priced.delivery,
    total: priced.total,
    customer: body.customer as DeliveryDetails,
  });

  const rzp = razorpay();
  if (rzp && hasRazorpay) {
    try {
      const rzpOrder = await rzp.orders.create({
        amount: priced.total * 100, // paise
        currency: "INR",
        receipt: order.id,
        notes: { orderId: order.id },
      });
      await updateOrder(order.id, { razorpayOrderId: rzpOrder.id });
      return NextResponse.json({
        orderId: order.id,
        mock: false,
        razorpayOrderId: rzpOrder.id,
        amount: priced.total * 100,
        currency: "INR",
        keyId: env.razorpayKeyId,
      });
    } catch (err) {
      console.error("[checkout] Razorpay order failed:", err);
      return NextResponse.json(
        { error: "Could not start payment. Please try again." },
        { status: 502 }
      );
    }
  }

  // Mock mode: no Razorpay keys configured. The client confirms directly.
  return NextResponse.json({ orderId: order.id, mock: true, amount: priced.total * 100 });
}
