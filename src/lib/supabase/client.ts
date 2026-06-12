"use client";

import { createBrowserClient } from "@supabase/ssr";
import { env, hasSupabase } from "@/lib/env";
import type { SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/** Browser Supabase client, or null when Supabase is not configured. */
export function supabaseBrowser(): SupabaseClient | null {
  if (!hasSupabase) return null;
  if (!cached) {
    cached = createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
  }
  return cached;
}
