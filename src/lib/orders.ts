import "server-only";
import { randomUUID } from "crypto";
import { supabaseAdmin } from "./supabase/admin";
import {
  type Order,
  type OrderStatus,
  type OrderItem,
  type DeliveryDetails,
} from "./order-types";

// Orders persist to Supabase when configured. Without it, they live in an
// in-memory map (attached to globalThis so it survives dev hot-reloads). The
// memory store is for local demos only; production must set Supabase keys.

const g = globalThis as unknown as { __amraOrders?: Map<string, Order> };
if (!g.__amraOrders) g.__amraOrders = new Map();
const memory = g.__amraOrders;

type RowOrder = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  customer: DeliveryDetails;
  status: OrderStatus;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  user_id: string | null;
  created_at: string;
};

const toOrder = (r: RowOrder): Order => ({
  id: r.id,
  items: r.items,
  subtotal: r.subtotal,
  delivery: r.delivery,
  total: r.total,
  customer: r.customer,
  status: r.status,
  razorpayOrderId: r.razorpay_order_id,
  razorpayPaymentId: r.razorpay_payment_id,
  userId: r.user_id,
  createdAt: r.created_at,
});

export async function createOrder(input: {
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  customer: DeliveryDetails;
  userId?: string | null;
}): Promise<Order> {
  const order: Order = {
    id: randomUUID(),
    items: input.items,
    subtotal: input.subtotal,
    delivery: input.delivery,
    total: input.total,
    customer: input.customer,
    status: "pending",
    razorpayOrderId: null,
    razorpayPaymentId: null,
    userId: input.userId ?? null,
    createdAt: new Date().toISOString(),
  };

  const db = supabaseAdmin();
  if (db) {
    const { error } = await db.from("orders").insert({
      id: order.id,
      items: order.items,
      subtotal: order.subtotal,
      delivery: order.delivery,
      total: order.total,
      customer: order.customer,
      status: order.status,
      user_id: order.userId,
      created_at: order.createdAt,
    });
    if (error) throw new Error(`Failed to save order: ${error.message}`);
  } else {
    memory.set(order.id, order);
  }
  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  const db = supabaseAdmin();
  if (db) {
    const { data, error } = await db
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return toOrder(data as RowOrder);
  }
  return memory.get(id) ?? null;
}

export async function listOrders(): Promise<Order[]> {
  const db = supabaseAdmin();
  if (db) {
    const { data } = await db
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as RowOrder[] | null)?.map(toOrder) ?? [];
  }
  return [...memory.values()].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export async function updateOrder(
  id: string,
  patch: Partial<
    Pick<Order, "status" | "razorpayOrderId" | "razorpayPaymentId">
  >
): Promise<Order | null> {
  const db = supabaseAdmin();
  if (db) {
    const row: Record<string, unknown> = {};
    if (patch.status) row.status = patch.status;
    if (patch.razorpayOrderId !== undefined)
      row.razorpay_order_id = patch.razorpayOrderId;
    if (patch.razorpayPaymentId !== undefined)
      row.razorpay_payment_id = patch.razorpayPaymentId;
    const { data, error } = await db
      .from("orders")
      .update(row)
      .eq("id", id)
      .select("*")
      .maybeSingle();
    if (error || !data) return null;
    return toOrder(data as RowOrder);
  }
  const existing = memory.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  memory.set(id, updated);
  return updated;
}
