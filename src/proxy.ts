import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

/** NextAuth edge handler; wrapped so the default export is named `proxy` (Next.js 16+ file convention). */
const auth = NextAuth(authConfig).auth;

export default function proxy(...args: Parameters<typeof auth>) {
  return auth(...args);
}

/** API routes perform their own `auth()` checks and return JSON 401 (no HTML redirect). */
export const config = {
  matcher: ["/admin/:path*"],
};
