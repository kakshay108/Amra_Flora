import "server-only";
import { Resend } from "resend";
import { env, hasResend } from "./env";
import { type Order } from "./order-types";
import { formatINR } from "./pricing";

// Sends the order confirmation. Without a Resend key it logs and returns so the
// checkout flow never breaks in development.
export async function sendOrderConfirmation(order: Order): Promise<void> {
  if (!hasResend) {
    console.log(`[email:stub] Confirmation for order ${order.id} -> ${order.customer.email}`);
    return;
  }
  try {
    const resend = new Resend(env.resendApiKey);
    const lines = order.items
      .map((i) => `<li>${i.qty} × ${i.name} — ${formatINR(i.unitPrice * i.qty)}</li>`)
      .join("");
    await resend.emails.send({
      from: env.fromEmail,
      to: order.customer.email,
      subject: `Your Amra Flowers order is confirmed 🌸`,
      html: `
        <h2>Thank you, ${order.customer.fullName}!</h2>
        <p>Your bouquet is in good hands. We'll hand-tie it fresh and deliver it on
        ${order.customer.deliveryDate} (${order.customer.deliverySlot}).</p>
        <ul>${lines}</ul>
        <p><strong>Total paid: ${formatINR(order.total)}</strong></p>
        <p>Track your order any time: /orders/${order.id}</p>
      `,
    });
  } catch (err) {
    console.error("[email] failed to send confirmation:", err);
  }
}
