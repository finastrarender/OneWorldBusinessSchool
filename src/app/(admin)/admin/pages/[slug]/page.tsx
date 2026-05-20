import { auth } from "@/auth";
import { redirect } from "next/navigation";
import PageEditClient from "@/components/admin/PageEditClient";

type Props = { params: Promise<{ slug: string }> };

export default async function AdminPageEditorPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  const { slug } = await params;
  return <PageEditClient slug={slug} />;
}
