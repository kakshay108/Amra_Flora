import { type BouquetConfig } from "./catalog";

export type OrderStatus =
  | "pending" // created, awaiting payment
  | "placed" // paid, queued
  | "confirmed" // florist accepted
  | "arranging" // being hand-tied
  | "out_for_delivery"
  | "delivered"
  | "payment_failed";

export const STATUS_FLOW: OrderStatus[] = [
  "placed",
  "confirmed",
  "arranging",
  "out_for_delivery",
  "delivered",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Awaiting payment",
  placed: "Order placed",
  confirmed: "Confirmed",
  arranging: "Being arranged",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  payment_failed: "Payment failed",
};

export type DeliveryDetails = {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  deliveryDate: string; // ISO date
  deliverySlot: string;
  giftNote: string;
};

export type OrderItem = {
  name: string;
  config: BouquetConfig;
  qty: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  customer: DeliveryDetails;
  status: OrderStatus;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  userId: string | null;
  createdAt: string;
};

export const DELIVERY_SLOTS = [
  "09:00 – 12:00",
  "12:00 – 15:00",
  "15:00 – 18:00",
  "18:00 – 21:00",
];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Puducherry", "Chandigarh",
];
