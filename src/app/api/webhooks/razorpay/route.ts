import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { getOrder, updateOrder } from "@/lib/orders";
import { sendOrderConfirmation } from "@/lib/email";

// Server-to-server confirmation from Razorpay. This is the source of truth for
// payment capture; the client verify endpoint is a convenience for redirecting.
export async function POST(req: Request) {
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const raw = await req.text();

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(raw);
  if (event.event === "payment.captured" || event.event === "order.paid") {
    const entity = event.payload?.payment?.entity ?? {};
    const orderId = entity.notes?.orderId as string | undefined;
    if (orderId) {
      const order = await getOrder(orderId);
      if (order && order.status === "pending") {
        const updated = await updateOrder(orderId, {
          status: "placed",
          razorpayPaymentId: entity.id ?? null,
        });
        if (updated) await sendOrderConfirmation(updated);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
