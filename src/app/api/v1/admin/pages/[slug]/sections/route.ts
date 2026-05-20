import { nanoid } from "nanoid";
import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { revalidatePage } from "@/lib/revalidate-content";
import { connectMongo } from "@/lib/mongoose";
import Page from "@/models/Page";
import { parseSectionData } from "@/schemas/sections";
import { z } from "zod";
import { SECTION_TYPES, type PageSection } from "@/types/section";

const postBodySchema = z.object({
  type: z.enum(SECTION_TYPES),
  data: z.unknown(),
  order: z.number().optional(),
});

type RouteContext = { params: Promise<{ slug: string }> };

export async function POST(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  const { slug } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("bad_request", "Invalid JSON", 400);
  }
  const parsed = postBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", "Invalid payload", 422, parsed.error.flatten());
  }
  let data: unknown;
  try {
    data = parseSectionData(parsed.data.type, parsed.data.data);
  } catch (e) {
    return jsonError(
      "validation_error",
      e instanceof Error ? e.message : "Invalid section data",
      422,
    );
  }

  await connectMongo();
  const page = await Page.findOne({ slug });
  if (!page) {
    return jsonError("not_found", "Page not found", 404);
  }
  const sections = [...(page.sections as PageSection[])];
  const maxOrder = sections.reduce((m, s) => Math.max(m, s.order), -1);
  const order = parsed.data.order ?? maxOrder + 1;
  const newSection: PageSection = {
    id: nanoid(),
    type: parsed.data.type,
    order,
    data: data as Record<string, unknown>,
  };
  sections.push(newSection);
  page.set("sections", JSON.parse(JSON.stringify(sections)));
  await page.save();
  revalidatePage(slug, sections);
  return jsonData({ page: page.toObject(), section: newSection });
}
