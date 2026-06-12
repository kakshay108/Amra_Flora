import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/orders";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { hasRazorpay } from "@/lib/env";
import { sendOrderConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.orderId) {
    return NextResponse.json({ error: "Missing order" }, { status: 400 });
  }

  const order = await getOrder(body.orderId);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Mock mode: confirm directly when Razorpay is not configured.
  if (!hasRazorpay || body.mock) {
    const updated = await updateOrder(order.id, { status: "placed" });
    if (updated) await sendOrderConfirmation(updated);
    return NextResponse.json({ ok: true, orderId: order.id });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
  }

  const valid = verifyPaymentSignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );
  if (!valid) {
    await updateOrder(order.id, { status: "payment_failed" });
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  const updated = await updateOrder(order.id, {
    status: "placed",
    razorpayPaymentId: razorpay_payment_id,
  });
  if (updated) await sendOrderConfirmation(updated);
  return NextResponse.json({ ok: true, orderId: order.id });
}
