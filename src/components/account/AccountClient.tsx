"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase/client";

export function AccountClient({ enabled }: { enabled: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const sb = supabaseBrowser();
    sb?.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
  }, [enabled]);

  if (!enabled) {
    return (
      <div className="rounded-2xl border border-line bg-surface-raised p-6">
        <p className="text-ink-soft">
          Accounts turn on once Supabase is connected. For now you can{" "}
          <Link href="/track" className="text-brand underline">
            track an order
          </Link>{" "}
          with its order number.
        </p>
      </div>
    );
  }

  if (userEmail) {
    return (
      <div className="rounded-2xl border border-line bg-surface-raised p-6">
        <p className="text-ink">
          Signed in as <strong>{userEmail}</strong>
        </p>
        <button
          type="button"
          onClick={async () => {
            await supabaseBrowser()?.auth.signOut();
            setUserEmail(null);
          }}
          className="mt-4 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-ink-faint"
        >
          Sign out
        </button>
      </div>
    );
  }

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const sb = supabaseBrowser();
    await sb?.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/account" },
    });
    setSent(true);
    setBusy(false);
  }

  return (
    <div className="rounded-2xl border border-line bg-surface-raised p-6">
      {sent ? (
        <p className="text-ink-soft">
          Check your inbox — we sent a sign-in link to <strong>{email}</strong>.
        </p>
      ) : (
        <form onSubmit={sendLink} className="flex flex-col gap-3">
          <p className="text-sm text-ink-soft">
            Sign in to save designs and see your order history. We&apos;ll email
            you a secure link, no password needed.
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="rounded-xl border border-line bg-surface px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-brand px-6 py-2.5 font-medium text-white hover:bg-brand-deep disabled:opacity-70"
          >
            {busy ? "Sending…" : "Email me a link"}
          </button>
        </form>
      )}
    </div>
  );
}
