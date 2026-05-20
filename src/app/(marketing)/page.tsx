import MarketingPageView from "@/components/marketing/MarketingPageView";
import { buildPageMetadata } from "@/lib/metadata/page";

export async function generateMetadata() {
  return buildPageMetadata("home");
}

export default function HomePage() {
  return <MarketingPageView slug="home" />;
}
