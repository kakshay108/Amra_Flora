import "server-only";
import crypto from "crypto";
import Razorpay from "razorpay";
import { env, hasRazorpay } from "./env";

let cached: Razorpay | null = null;

export function razorpay(): Razorpay | null {
  if (!hasRazorpay) return null;
  if (!cached) {
    cached = new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret,
    });
  }
  return cached;
}

/** Verifies the signature returned by Razorpay Checkout after a payment. */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const expected = crypto
    .createHmac("sha256", env.razorpayKeySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return timingSafeEqual(expected, signature);
}

/** Verifies a Razorpay webhook payload against the webhook secret. */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!env.razorpayWebhookSecret) return false;
  const expected = crypto
    .createHmac("sha256", env.razorpayWebhookSecret)
    .update(body)
    .digest("hex");
  return timingSafeEqual(expected, signature);
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
