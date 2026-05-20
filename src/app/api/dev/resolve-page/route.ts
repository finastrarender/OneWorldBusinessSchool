import { type NextRequest, NextResponse } from "next/server";
import { resolvePageForRequest } from "@/lib/content/pages";

/**
 * Development helper: see whether a slug resolves from MongoDB or static fallback.
 * Not available in production.
 */
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse("Not found", { status: 404 });
  }

  const slug = req.nextUrl.searchParams.get("slug") ?? "home";
  const view = await resolvePageForRequest(slug);

  if (!view) {
    return NextResponse.json({ slug, source: null, message: "not found" });
  }

  const firstId = view.effectiveSections[0]?.id ?? null;
  const fromDb = firstId != null && !String(firstId).startsWith("fb-");

  return NextResponse.json({
    slug,
    title: view.title,
    status: view.status,
    firstSectionId: firstId,
    sectionCount: view.effectiveSections.length,
    source: fromDb ? "database" : "fallback",
    isPreview: view.isPreview,
  });
}
