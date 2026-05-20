import { draftMode } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const redirectPath = request.nextUrl.searchParams.get("redirect") ?? "/";

  if (!env.PREVIEW_SECRET || secret !== env.PREVIEW_SECRET) {
    return NextResponse.json(
      { error: { code: "unauthorized", message: "Invalid preview secret" } },
      { status: 401 },
    );
  }

  (await draftMode()).enable();
  return NextResponse.redirect(new URL(redirectPath, request.url));
}
