import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { getFallbackPageView } from "@/data/fallback-pages";
import { cacheTags } from "@/lib/cache-tags";
import { connectMongo } from "@/lib/mongoose";
import Page from "@/models/Page";
import type { PageSection } from "@/types/section";

export type PublicPageView = {
  slug: string;
  title: string;
  status: string;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  canonicalPath?: string;
  effectiveSections: PageSection[];
  isPreview: boolean;
};

function toPlainSections(sections: unknown): PageSection[] {
  if (!Array.isArray(sections)) return [];
  return sections as PageSection[];
}

function pageToPublicView(
  page: {
    slug: string;
    title: string;
    status: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    ogImage?: string | null;
    canonicalPath?: string | null;
    publishedSections?: unknown;
    sections?: unknown;
  },
  opts: { published: boolean; isPreview: boolean },
): PublicPageView {
  const source =
    opts.published && Array.isArray(page.publishedSections) && page.publishedSections.length
      ? page.publishedSections
      : page.sections;
  return {
    slug: page.slug,
    title: page.title,
    status: page.status,
    seoTitle: page.seoTitle ?? undefined,
    seoDescription: page.seoDescription ?? undefined,
    ogImage: page.ogImage ?? undefined,
    canonicalPath: page.canonicalPath ?? undefined,
    effectiveSections: toPlainSections(source),
    isPreview: opts.isPreview,
  };
}

async function fetchPublishedPage(slug: string): Promise<PublicPageView | null> {
  await connectMongo();
  const page = await Page.findOne({ slug }).lean();
  if (!page) return null;

  const isDev = process.env.NODE_ENV === "development";

  if (page.status !== "published") {
    if (!isDev) return null;
    return pageToPublicView(page, { published: false, isPreview: true });
  }

  return pageToPublicView(page, { published: true, isPreview: false });
}

async function getBootFallbackPage(slug: string) {
  await connectMongo();
  const pageCount = await Page.countDocuments();
  if (pageCount > 0) {
    return null;
  }
  return getFallbackPageView(slug);
}

const getPublishedPageProduction = (slug: string) =>
  unstable_cache(() => fetchPublishedPage(slug), ["published-page", slug], {
    tags: [cacheTags.page(slug)],
  });

/** Production: cached. Development: always fresh DB read (avoids sticky `null` after `pnpm seed`). */
export async function getPublishedPageCached(slug: string): Promise<PublicPageView | null> {
  if (process.env.NODE_ENV === "development") {
    return fetchPublishedPage(slug);
  }
  return getPublishedPageProduction(slug)();
}

/** Preview / draft: bypass cache; only call when draftMode is enabled (or admin). */
export async function getPageDraftView(slug: string): Promise<PublicPageView | null> {
  await connectMongo();
  const page = await Page.findOne({ slug }).lean();
  if (!page) return null;
  return pageToPublicView(page, { published: false, isPreview: true });
}

export async function resolvePageForRequest(slug: string): Promise<PublicPageView | null> {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    const d = await getPageDraftView(slug);
    if (d) return d;
    return getBootFallbackPage(slug);
  }

  const live = await getPublishedPageCached(slug);
  if (live) return live;
  return getBootFallbackPage(slug);
}
