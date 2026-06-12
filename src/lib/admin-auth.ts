import "server-only";
import { cookies } from "next/headers";
import { env } from "./env";

export const ADMIN_COOKIE = "amra_admin";

/** True when the request carries a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === env.adminPassword;
}
