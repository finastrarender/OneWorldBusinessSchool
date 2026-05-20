import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getSiteGlobalCached } from "@/lib/content/site-global";
import { getPageDraftView } from "@/lib/content/pages";
import SectionRenderer from "@/components/sections/SectionRenderer";
import PreviewBanner from "@/components/marketing/PreviewBanner";

type PageProps = { params: Promise<{ slug: string }> };

export default async function PreviewPage(props: PageProps) {
  const params = await props.params;
  const slug = params.slug;

  const session = await auth();
  if (!session?.user?.id) {
    redirect("/admin/login");
  }

  const [pageView, global] = await Promise.all([
    getPageDraftView(slug),
    getSiteGlobalCached(),
  ]);

  if (!pageView) {
    notFound();
  }

  const featureFlags = (global?.featureFlags as Record<string, boolean> | undefined) ?? {};
  const sorted = [...pageView.effectiveSections].sort((a, b) => a.order - b.order);

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
      <PreviewBanner />
    </>
  );
}

