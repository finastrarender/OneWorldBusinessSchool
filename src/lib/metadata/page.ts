import type { Metadata } from "next";
import { getSiteGlobalCached } from "@/lib/content/site-global";
import { resolvePageForRequest } from "@/lib/content/pages";

type SeoDefaults = { defaultTitle?: string; defaultDescription?: string };

export async function buildPageMetadata(slug: string): Promise<Metadata> {
  const [page, global] = await Promise.all([resolvePageForRequest(slug), getSiteGlobalCached()]);
  if (!page) {
    return { title: "Not found" };
  }
  const d = (global?.seoDefaults as SeoDefaults | undefined) ?? {};
  return {
    title: page.seoTitle || d.defaultTitle || page.title,
    description: page.seoDescription || d.defaultDescription,
    alternates: page.canonicalPath
      ? { canonical: page.canonicalPath }
      : undefined,
    openGraph: page.ogImage
      ? {
          images: [{ url: page.ogImage }],
        }
      : undefined,
  };
}
