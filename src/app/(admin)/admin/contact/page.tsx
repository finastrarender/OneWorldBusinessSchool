import Link from "next/link";
import { redirect } from "next/navigation";
import ContactInquiriesList from "@/components/admin/ContactInquiriesList";
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

export default async function AdminContactPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await connectMongo();
  const inquiries = (await ContactLead.find({})
    .sort({ createdAt: -1 })
    .lean()) as ContactLeadListItem[];

  const serialized = inquiries.map((inquiry) => ({
    _id: String(inquiry._id),
    name: inquiry.name,
    email: inquiry.email,
    phone: inquiry.phone,
    company: inquiry.company,
    inquiryType: inquiry.inquiryType,
    message: inquiry.message,
    createdAt: inquiry.createdAt?.toISOString(),
  }));

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin">Dashboard</Link>
        <Link href="/contact">View contact page</Link>
      </nav>
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Contact Submissions</h1>
        <p className="admin-muted">Submitted from the public contact page form.</p>

        <div className="admin-section-group">
          <ContactInquiriesList inquiries={serialized} />
        </div>
      </div>
    </div>
  );
}
