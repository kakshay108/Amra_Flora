import { priceBouquet, deliveryFee } from "./pricing";
import { type BouquetConfig } from "./catalog";
import { type OrderItem, type DeliveryDetails } from "./order-types";

export type IncomingItem = {
  name: string;
  config: BouquetConfig;
  qty: number;
};

/**
 * Authoritatively recomputes every line price from its config on the server.
 * Client-supplied prices are ignored entirely. Returns normalized order items
 * plus the order totals.
 */
export function priceCart(items: IncomingItem[]): {
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
} {
  const normalized: OrderItem[] = items.map((i) => {
    const qty = Math.max(1, Math.min(99, Math.floor(i.qty)));
    const unitPrice = priceBouquet(i.config).total;
    return { name: i.name, config: i.config, qty, unitPrice };
  });
  const subtotal = normalized.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const delivery = deliveryFee(subtotal);
  return { items: normalized, subtotal, delivery, total: subtotal + delivery };
}

const PIN_RE = /^[1-9][0-9]{5}$/;
const PHONE_RE = /^[6-9][0-9]{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates the delivery form server-side. Returns a list of field errors. */
export function validateCustomer(c: Partial<DeliveryDetails>): string[] {
  const errors: string[] = [];
  if (!c.fullName?.trim()) errors.push("Full name is required.");
  if (!c.email || !EMAIL_RE.test(c.email)) errors.push("A valid email is required.");
  if (!c.phone || !PHONE_RE.test(c.phone))
    errors.push("A valid 10-digit Indian mobile number is required.");
  if (!c.addressLine1?.trim()) errors.push("Address is required.");
  if (!c.city?.trim()) errors.push("City is required.");
  if (!c.state?.trim()) errors.push("State is required.");
  if (!c.pincode || !PIN_RE.test(c.pincode))
    errors.push("A valid 6-digit PIN code is required.");
  if (!c.deliveryDate) errors.push("Please choose a delivery date.");
  if (!c.deliverySlot) errors.push("Please choose a delivery slot.");
  return errors;
}
