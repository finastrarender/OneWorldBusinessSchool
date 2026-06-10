import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongoose";
import ContactLead from "@/models/ContactLead";

type ContactLeadListItem = {
  _id: unknown;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType?: string;
  message: string;
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

export default async function AdminContactPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await connectMongo();
  const inquiries = (await ContactLead.find({})
    .sort({ createdAt: -1 })
    .lean()) as ContactLeadListItem[];

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin">Dashboard</Link>
        <Link href="/contact">View contact page</Link>
      </nav>
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Contact Inquiries</h1>
        <p className="admin-muted">Submitted from the public contact page inquiry form.</p>

        <div className="admin-section-group">
          {inquiries.map((inquiry) => (
            <article key={String(inquiry._id)} className="admin-section-card">
              <h3 style={{ marginTop: 0 }}>{inquiry.name}</h3>
              <p className="admin-muted">{formatDate(inquiry.createdAt)}</p>
              <p>
                <strong>Email:</strong> {inquiry.email}
              </p>
              <p>
                <strong>Phone:</strong> {inquiry.phone || "-"}
              </p>
              <p>
                <strong>Company:</strong> {inquiry.company || "-"}
              </p>
              <p>
                <strong>Inquiry type:</strong> {inquiry.inquiryType || "-"}
              </p>
              <p style={{ whiteSpace: "pre-wrap" }}>{inquiry.message}</p>
            </article>
          ))}
          {inquiries.length === 0 ? <p className="admin-muted">No inquiries submitted yet.</p> : null}
        </div>
      </div>
    </div>
  );
}
