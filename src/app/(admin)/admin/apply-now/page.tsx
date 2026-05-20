import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ApplyNowModalEditClient from "@/components/admin/ApplyNowModalEditClient";

export default async function AdminApplyNowPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  return <ApplyNowModalEditClient />;
}
