import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { updateOrder } from "@/lib/orders";
import { STATUS_FLOW, type OrderStatus } from "@/lib/order-types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { status } = await req.json().catch(() => ({ status: null }));
  if (!STATUS_FLOW.includes(status as OrderStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const updated = await updateOrder(id, { status: status as OrderStatus });
  if (!updated) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, status: updated.status });
}
