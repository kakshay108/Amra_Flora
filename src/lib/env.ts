// Centralized environment detection. Every integration is optional so the app
// runs end-to-end locally with zero configuration ("mock mode"), then upgrades
// to the real service the moment its keys are present.

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",

  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET ?? "",
  razorpayWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET ?? "",

  resendApiKey: process.env.RESEND_API_KEY ?? "",
  fromEmail: process.env.AMRA_FROM_EMAIL ?? "Amra Flowers <orders@amraflowers.example>",

  adminPassword: process.env.ADMIN_PASSWORD ?? "amra-admin",
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const hasSupabaseAdmin = Boolean(env.supabaseUrl && env.supabaseServiceKey);
export const hasRazorpay = Boolean(env.razorpayKeyId && env.razorpayKeySecret);
export const hasResend = Boolean(env.resendApiKey);
