import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { revalidatePage } from "@/lib/revalidate-content";
import { connectMongo } from "@/lib/mongoose";
import Page from "@/models/Page";
import type { PageSection } from "@/types/section";

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  const { slug } = await context.params;
  await connectMongo();
  const page = await Page.findOne({ slug });
  if (!page) {
    return jsonError("not_found", "Page not found", 404);
  }
  const draft = page.sections as PageSection[];
  page.set("publishedSections", JSON.parse(JSON.stringify(draft)));
  page.status = "published";
  page.publishedAt = new Date();
  await page.save();
  const lean = page.toObject();
  revalidatePage(slug, draft);
  return jsonData(lean);
}
