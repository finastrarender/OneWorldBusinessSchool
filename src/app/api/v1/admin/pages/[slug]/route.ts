import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { revalidatePage, revalidateSiteGlobal } from "@/lib/revalidate-content";
import { slugToHref, normalizePageSlug } from "@/lib/slugs";
import { connectMongo } from "@/lib/mongoose";
import Page from "@/models/Page";
import SiteGlobal from "@/models/SiteGlobal";
import { parseSectionData } from "@/schemas/sections";
import { z } from "zod";
import type { PageSection } from "@/types/section";

const patchBodySchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  status: z.enum(["draft", "published"]).optional(),
  sections: z
    .array(
      z.object({
        id: z.string(),
        type: z.string(),
        order: z.number(),
        data: z.unknown(),
      }),
    )
    .optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalPath: z.string().optional(),
});

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  const { slug } = await context.params;
  await connectMongo();
  const page = await Page.findOne({ slug }).lean();
  if (!page) {
    return jsonError("not_found", "Page not found", 404);
  }
  return jsonData(page);
}

export async function PATCH(request: Request, context: RouteContext) {
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
  const parsed = patchBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", "Invalid payload", 422, parsed.error.flatten());
  }

  let normalizedSections: PageSection[] | undefined;
  const normalizedSlug =
    parsed.data.slug !== undefined ? normalizePageSlug(parsed.data.slug) : undefined;

  if (slug === "home" && normalizedSlug !== undefined && normalizedSlug !== "home") {
    return jsonError("validation_error", "Home page slug cannot be changed", 422);
  }

  if (parsed.data.sections) {
    normalizedSections = [];
    for (const s of parsed.data.sections) {
      try {
        const data = parseSectionData(s.type, s.data);
        normalizedSections.push({
          id: s.id,
          type: s.type as PageSection["type"],
          order: s.order,
          data: data as Record<string, unknown>,
        });
      } catch (e) {
        return jsonError(
          "validation_error",
          `Section ${s.id}: ${e instanceof Error ? e.message : "invalid"}`,
          422,
        );
      }
    }
  }

  await connectMongo();
  const existingPage = await Page.findOne({ slug }).lean();
  if (!existingPage) {
    return jsonError("not_found", "Page not found", 404);
  }

  if (normalizedSlug !== undefined && normalizedSlug !== slug) {
    const conflictingPage = await Page.findOne({ slug: normalizedSlug }).lean();
    if (conflictingPage) {
      return jsonError("validation_error", "Slug is already in use", 422);
    }
  }

  const update: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) update.title = parsed.data.title;
  if (normalizedSlug !== undefined) update.slug = normalizedSlug;
  if (parsed.data.status !== undefined) update.status = parsed.data.status;
  if (normalizedSections !== undefined) update.sections = normalizedSections;
  if (parsed.data.seoTitle !== undefined) update.seoTitle = parsed.data.seoTitle;
  if (parsed.data.seoDescription !== undefined)
    update.seoDescription = parsed.data.seoDescription;
  if (parsed.data.ogImage !== undefined) update.ogImage = parsed.data.ogImage;
  if (parsed.data.canonicalPath !== undefined)
    update.canonicalPath = parsed.data.canonicalPath;

  const page = await Page.findOneAndUpdate({ slug }, { $set: update }, { new: true }).lean();
  if (!page) {
    return jsonError("not_found", "Page not found", 404);
  }

  const oldHref = slugToHref(existingPage.slug);
  const newHref = slugToHref(page.slug);
  const titleChanged =
    parsed.data.title !== undefined && parsed.data.title !== existingPage.title;
  const slugChanged = page.slug !== existingPage.slug;

  if (titleChanged || slugChanged) {
    const siteGlobal = await SiteGlobal.findOne({ key: "default" });
    if (siteGlobal && Array.isArray(siteGlobal.navItems)) {
      siteGlobal.navItems = siteGlobal.navItems.map((item: unknown) => {
        if (!item || typeof item !== "object") return item;

        const navItem = item as { label?: string; href?: string };
        if (navItem.href !== oldHref) {
          return item;
        }

        return {
          ...navItem,
          href: slugChanged ? newHref : navItem.href,
          label: titleChanged ? page.title : navItem.label,
        };
      });
      await siteGlobal.save();
    }
    revalidateSiteGlobal();
  }

  revalidatePage(slug, page.sections as PageSection[]);
  if (page.slug !== slug) {
    revalidatePage(page.slug, page.sections as PageSection[]);
  }
  return jsonData(page);
}
