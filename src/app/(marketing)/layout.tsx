import {
  defaultApplyNowModal,
  defaultFooterColumns,
  defaultFooterMeta,
  defaultNavItems,
} from "@/data/site-defaults";
import { getSiteGlobalCached } from "@/lib/content/site-global";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import ApplyNowModal from "@/components/apply/ApplyNowModal";

export const dynamic = "force-dynamic";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const global = await getSiteGlobalCached();

  const navItems =
    (global?.navItems as typeof defaultNavItems) ?? defaultNavItems;
  const footerColumns =
    (global?.footerColumns as typeof defaultFooterColumns) ??
    defaultFooterColumns;
  const footerMeta =
    (global?.footerMeta as typeof defaultFooterMeta) ?? defaultFooterMeta;
  const applyNowModal = {
    ...defaultApplyNowModal,
    ...((global?.applyNowModal as Partial<typeof defaultApplyNowModal> | undefined) ?? {}),
  };
  return (
    <div className="owtc-app">
      <SiteHeader navItems={navItems} />
      <main>{children}</main>
      <ApplyNowModal content={applyNowModal} />
      <SiteFooter columns={footerColumns} meta={footerMeta} />
    </div>
  );
}
