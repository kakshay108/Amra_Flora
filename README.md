# 🌸 Amra Flowers

A custom-bouquet e-commerce store for India. Customers design a bouquet flower
by flower, watch it come together in an **interactive 3D preview** they can spin
and zoom, then check out and have it delivered.

The 3D configurator is the heart of the product: every choice — flower, shade,
size, stem length, bouquet shape, greenery, wrapping, ribbon, card shape and the
message itself — rebuilds the bouquet live.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** with a botanical design-token system
- **React Three Fiber** + **three.js** + **drei** for the parametric 3D bouquet
- **Zustand** for the configurator and cart state
- **Supabase** (Postgres + Auth) for persistent orders and saved designs
- **Razorpay** for payments (UPI / cards / netbanking — built for India)
- **Resend** for order-confirmation emails
- Deployed on **Vercel**

## Runs with zero configuration

The app boots and the full purchase flow works with **no environment variables**:

- payments are **simulated** (no real charge),
- orders are stored **in memory** (reset on restart).

Add keys (see below) to turn on real payments, persistence and email.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Configuration

Copy `.env.example` to `.env.local` and fill in any of the optional blocks:

| Service  | Enables | Where to get keys |
| -------- | ------- | ----------------- |
| Supabase | Persistent orders, accounts, saved designs | supabase.com → Project Settings → API |
| Razorpay | Real UPI / card payments | razorpay.com → Settings → API Keys (use **Test** keys first) |
| Resend   | Confirmation emails | resend.com → API Keys |

For Supabase, run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.

## Key routes

| Route | What it is |
| ----- | ---------- |
| `/` | Home with a live 3D hero |
| `/studio` | The 3D bouquet design studio |
| `/shop` · `/shop/[slug]` | Signature bouquets (open any in the studio) |
| `/cart` · `/checkout` | Cart and Razorpay checkout |
| `/orders/[id]` | Order confirmation + delivery-status timeline |
| `/admin` | Florist dashboard (orders + status). Password: `ADMIN_PASSWORD` |

## Architecture notes

- **Single source of truth** for every option lives in [`src/lib/catalog.ts`](src/lib/catalog.ts);
  the 3D renderer, the studio UI and the pricing engine all read from it so they
  can never disagree.
- **Pricing is recomputed on the server** at checkout
  ([`src/lib/checkout.ts`](src/lib/checkout.ts)); a tampered client price is ignored.
- The 3D bundle is **dynamically imported** so storefront pages stay light.
- The bouquet is **generated procedurally** (see `src/components/three/geometry/`),
  not from pre-baked models, which is what lets every option react instantly.

## Project structure

```
src/
  app/                 Routes (App Router) + API routes
  components/
    three/             3D bouquet: geometry builders, canvas, renderer
    studio/            Configurator UI
    shop/ cart/ checkout/ orders/ admin/ site/
  lib/                 catalog, pricing, orders, razorpay, supabase, email
  store/               Zustand stores (configurator, cart)
supabase/schema.sql    Database schema + RLS
```
