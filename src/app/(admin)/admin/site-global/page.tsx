import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SiteGlobalEditClient from "@/components/admin/SiteGlobalEditClient";

export default async function AdminSiteGlobalPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return <SiteGlobalEditClient />;
}
