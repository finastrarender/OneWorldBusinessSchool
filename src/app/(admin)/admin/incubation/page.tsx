import Link from "next/link";
import { redirect } from "next/navigation";
import IncubationApplicationsList from "@/components/admin/IncubationApplicationsList";
import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongoose";
import IncubationApplication from "@/models/IncubationApplication";

type ApplicationField = {
  label: string;
  value?: string;
};

type IncubationApplicationListItem = {
  _id: unknown;
  fields: ApplicationField[];
  createdAt?: Date;
};

export default async function AdminIncubationPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await connectMongo();
  const applications = (await IncubationApplication.find({})
    .sort({ createdAt: -1 })
    .lean()) as IncubationApplicationListItem[];

  const serialized = applications.map((application) => ({
    _id: String(application._id),
    fields: application.fields,
    createdAt: application.createdAt?.toISOString(),
  }));

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin">Dashboard</Link>
        <Link href="/incubation">View incubation page</Link>
      </nav>
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Incubation Applications</h1>
        <p className="admin-muted">Submitted from the incubation page application form.</p>

        <div className="admin-section-group">
          <IncubationApplicationsList applications={serialized} />
        </div>
      </div>
    </div>
  );
}
