import AdminProviders from "@/components/admin/AdminProviders";
import { auth } from "@/auth";

export default async function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return <AdminProviders session={session}>{children}</AdminProviders>;
}
