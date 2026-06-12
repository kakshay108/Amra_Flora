import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, hasSupabaseAdmin } from "@/lib/env";

// Server-only Supabase client using the service-role key. Used by API routes
// and server actions to read/write orders, bypassing RLS. Never import this
// into a client component.
let cached: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient | null {
  if (!hasSupabaseAdmin) return null;
  if (!cached) {
    cached = createClient(env.supabaseUrl, env.supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
