import { notFound } from "next/navigation";
import { getSiteGlobalCached } from "@/lib/content/site-global";
import { resolvePageForRequest } from "@/lib/content/pages";
import SectionRenderer from "@/components/sections/SectionRenderer";
import PreviewBanner from "./PreviewBanner";

export default async function MarketingPageView({ slug }: { slug: string }) {
  const [pageView, global] = await Promise.all([
    resolvePageForRequest(slug),
    getSiteGlobalCached(),
  ]);

  if (!pageView) {
    notFound();
  }

  const featureFlags = (global?.featureFlags as Record<string, boolean> | undefined) ?? {};
  const sorted = [...pageView.effectiveSections].sort((a, b) => a.order - b.order);

  console.log("sorted sections for pageView", sorted)


  return (
    <>
      {sorted.map((section) => (
        <SectionRenderer
          key={section.id}
          pageSlug={slug}
          section={section}
          featureFlags={featureFlags}
        />
      ))}
      {pageView.isPreview ? <PreviewBanner /> : null}
    </>
  );
}
