import MarketingPageView from "@/components/marketing/MarketingPageView";
import { buildPageMetadata } from "@/lib/metadata/page";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: PageProps) {
  const params = await props.params;
  return buildPageMetadata(params.slug);
}

export default async function DynamicMarketingPage(props: PageProps) {
  const params = await props.params;
  return <MarketingPageView slug={params.slug} />;
}
