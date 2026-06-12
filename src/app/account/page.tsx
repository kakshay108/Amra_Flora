import type { Metadata } from "next";
import { AccountClient } from "@/components/account/AccountClient";
import { hasSupabase } from "@/lib/env";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-lg px-5 py-16 sm:px-8">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
        Your account
      </h1>
      <p className="mt-2 text-ink-soft">
        Optional, and only if you want it. You can always order as a guest.
      </p>
      <div className="mt-7">
        <AccountClient enabled={hasSupabase} />
      </div>
    </div>
  );
}
