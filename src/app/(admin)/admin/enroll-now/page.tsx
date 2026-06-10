import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectMongo } from "@/lib/mongoose";
import EnrollNowSubmission from "@/models/EnrollNowSubmission";

type CustomField = {
  label: string;
  value?: string;
};

type EnrollNowListItem = {
  _id: unknown;
  fullName: string;
  phone?: string;
  email: string;
  city?: string;
  experience?: string;
  message?: string;
  customFields?: CustomField[];
  acceptedTerms?: boolean;
  marketingConsent?: boolean;
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

export default async function AdminEnrollNowPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  await connectMongo();
  const submissions = (await EnrollNowSubmission.find({})
    .sort({ createdAt: -1 })
    .lean()) as EnrollNowListItem[];

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin">Dashboard</Link>
        <Link href="/?apply=1">Open enroll now form</Link>
      </nav>
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Enroll Now Submissions</h1>
        <p className="admin-muted">Submitted from the Apply Now / Enroll Now form.</p>

        <div className="admin-section-group">
          {submissions.map((submission) => (
            <article key={String(submission._id)} className="admin-section-card">
              <h3 style={{ marginTop: 0 }}>{submission.fullName}</h3>
              <p className="admin-muted">{formatDate(submission.createdAt)}</p>
              <p>
                <strong>Email:</strong> {submission.email}
              </p>
              <p>
                <strong>Phone:</strong> {submission.phone || "-"}
              </p>
              <p>
                <strong>City:</strong> {submission.city || "-"}
              </p>
              <p>
                <strong>Experience:</strong> {submission.experience || "-"}
              </p>
              <p style={{ whiteSpace: "pre-wrap" }}>
                <strong>Message:</strong> {submission.message || "-"}
              </p>
              {(submission.customFields ?? []).map((field, index) => (
                <p key={`${field.label}-${index}`}>
                  <strong>{field.label}:</strong> {field.value || "-"}
                </p>
              ))}
              <p>
                <strong>Terms accepted:</strong> {submission.acceptedTerms ? "Yes" : "No"}
              </p>
              <p>
                <strong>Marketing consent:</strong> {submission.marketingConsent ? "Yes" : "No"}
              </p>
            </article>
          ))}
          {submissions.length === 0 ? (
            <p className="admin-muted">No enroll now submissions yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
