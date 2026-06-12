import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { listOrders } from "@/lib/orders";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminLogout } from "@/components/admin/AdminLogout";
import { formatINR } from "@/lib/pricing";
import { hasSupabaseAdmin } from "@/lib/env";

export const metadata: Metadata = { title: "Order management", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");

  const orders = await listOrders();
  const paid = orders.filter((o) => o.status !== "pending" && o.status !== "payment_failed");
  const revenue = paid.reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
            Orders
          </h1>
          <p className="mt-1 text-ink-soft">
            {paid.length} paid orders · {formatINR(revenue)} revenue
          </p>
        </div>
        <AdminLogout />
      </div>

      {!hasSupabaseAdmin && (
        <p className="mt-5 rounded-xl bg-accent/10 px-4 py-3 text-sm text-accent-strong">
          Demo mode: orders are stored in memory and reset when the server
          restarts. Add Supabase keys to persist them.
        </p>
      )}

      <AdminOrders orders={orders} />
    </div>
  );
}
