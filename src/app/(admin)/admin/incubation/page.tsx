import Link from "next/link";
import { redirect } from "next/navigation";
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

function formatDate(value?: Date) {
  return value
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(value)
    : "-";
}

export default async function AdminIncubationPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await connectMongo();
  const applications = (await IncubationApplication.find({})
    .sort({ createdAt: -1 })
    .lean()) as IncubationApplicationListItem[];

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
          {applications.map((application) => (
            <article key={String(application._id)} className="admin-section-card">
              <h3 style={{ marginTop: 0 }}>Application</h3>
              <p className="admin-muted">{formatDate(application.createdAt)}</p>
              {application.fields.map((field, index) => (
                <p key={`${field.label}-${index}`}>
                  <strong>{field.label}:</strong> {field.value || "-"}
                </p>
              ))}
            </article>
          ))}
          {applications.length === 0 ? (
            <p className="admin-muted">No applications submitted yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
