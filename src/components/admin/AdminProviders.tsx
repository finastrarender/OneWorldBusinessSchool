"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function AdminProviders({
  children,
  session,
}: {
  children: React.ReactNode;
  /** From server `auth()` — avoids an extra client round-trip and softens session fetch failures */
  session: Session | null;
}) {
  return (
    <SessionProvider session={session} basePath="/api/auth" refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
