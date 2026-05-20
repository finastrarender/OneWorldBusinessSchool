import { auth } from "@/auth";
import { jsonError } from "@/lib/api-response";
import { type NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }

  const { slug } = await context.params;
  const redirectUrl = new URL(request.url);
  redirectUrl.pathname = slug === "home" ? "/preview" : `/preview/${slug}`;
  redirectUrl.search = "";

  return NextResponse.redirect(redirectUrl);
}


