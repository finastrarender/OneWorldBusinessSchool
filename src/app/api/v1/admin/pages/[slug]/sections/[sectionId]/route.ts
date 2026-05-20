import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { revalidatePage } from "@/lib/revalidate-content";
import { connectMongo } from "@/lib/mongoose";
import Page from "@/models/Page";
import { parseSectionData } from "@/schemas/sections";
import { z } from "zod";
import type { PageSection } from "@/types/section";

const patchBodySchema = z.object({
  order: z.number().optional(),
  data: z.unknown().optional(),
  type: z.string().optional(),
});

function normalizeType(value: string) {
  if (value === "industrieshero") return "industriesHero";
  if (value === "industriesgrid") return "industriesGrid";
  if (value === "industriescta") return "industriesCta";
  if (value === "servicesaccordion") return "servicesAccordion";
  if (value === "servicescta") return "servicesCTA";
  if (value === "aboutIntro") return "aboutOverview";
  return value;
}

type RouteContext = { params: Promise<{ slug: string; sectionId: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  const { slug, sectionId } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("bad_request", "Invalid JSON", 400);
  }
  const parsed = patchBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", "Invalid payload", 422, parsed.error.flatten());
  }

  await connectMongo();
  const page = await Page.findOne({ slug });
  if (!page) {
    return jsonError("not_found", "Page not found", 404);
  }
  const sections = [...(page.sections as PageSection[])];
  let idx = sections.findIndex((s) => s.id === sectionId);
  if (idx === -1 && (parsed.data.type || parsed.data.order !== undefined)) {
    const requestedType = parsed.data.type ? normalizeType(parsed.data.type) : undefined;
    idx = sections.findIndex((s) => {
      const typeMatches = requestedType
        ? normalizeType(String(s.type)) === requestedType
        : true;
      const orderMatches =
        parsed.data.order !== undefined ? s.order === parsed.data.order : true;
      return typeMatches && orderMatches;
    });
  }
  if (idx === -1) {
    return jsonError("not_found", "Section not found", 404);
  }
  const current = sections[idx];
  const incomingType = parsed.data.type ?? current.type;
  const type = normalizeType(String(incomingType));
  if (parsed.data.data !== undefined) {
    try {
      const data = parseSectionData(type, parsed.data.data);
      sections[idx] = {
        ...current,
        type: type as PageSection["type"],
        data: data as Record<string, unknown>,
        order: parsed.data.order ?? current.order,
      };
    } catch (e) {
      return jsonError(
        "validation_error",
        e instanceof Error ? e.message : "Invalid data",
        422,
      );
    }
  } else {
    sections[idx] = {
      ...current,
      type: type as PageSection["type"],
      order: parsed.data.order ?? current.order,
    };
  }
  page.set("sections", JSON.parse(JSON.stringify(sections)));
  await page.save();
  revalidatePage(slug, sections);
  return jsonData({ page: page.toObject(), section: sections[idx] });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  const { slug, sectionId } = await context.params;
  await connectMongo();
  const page = await Page.findOne({ slug });
  if (!page) {
    return jsonError("not_found", "Page not found", 404);
  }
  const sections = (page.sections as PageSection[]).filter((s) => s.id !== sectionId);
  if (sections.length === (page.sections as PageSection[]).length) {
    return jsonError("not_found", "Section not found", 404);
  }
  page.set("sections", JSON.parse(JSON.stringify(sections)));
  await page.save();
  revalidatePage(slug, sections);
  return jsonData({ page: page.toObject() });
}
