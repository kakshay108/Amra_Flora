"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Incorrect password.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col px-5 py-24">
      <h1 className="font-display text-2xl font-semibold text-ink">Florist sign-in</h1>
      <p className="mt-1 text-sm text-ink-soft">Amra Flowers order management</p>
      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          className="rounded-xl border border-line bg-surface-raised px-3.5 py-2.5 text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          required
        />
        {error && <p className="text-sm text-danger">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-brand px-6 py-3 font-medium text-white hover:bg-brand-deep disabled:opacity-70"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
