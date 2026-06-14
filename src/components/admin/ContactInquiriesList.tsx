"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ContactInquiryItem = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType?: string;
  message: string;
  createdAt?: string;
};

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ContactInquiriesList({
  inquiries,
}: {
  inquiries: ContactInquiryItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(inquiries);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this contact inquiry? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(`/api/v1/admin/contact-leads/${id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error?.message ?? "Failed to delete inquiry.");
        return;
      }
      setItems((current) => current.filter((item) => item._id !== id));
      router.refresh();
    } catch {
      setError("Network error while deleting inquiry.");
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return <p className="admin-muted">No inquiries submitted yet.</p>;
  }

  return (
    <>
      {error ? <p className="admin-field-error">{error}</p> : null}
      {items.map((inquiry) => (
        <article key={inquiry._id} className="admin-section-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div>
              <h3 style={{ marginTop: 0 }}>{inquiry.name}</h3>
              <p className="admin-muted">{formatDate(inquiry.createdAt)}</p>
            </div>
            <button
              type="button"
              className="admin-button-secondary"
              disabled={deletingId === inquiry._id}
              onClick={() => handleDelete(inquiry._id)}
            >
              {deletingId === inquiry._id ? "Deleting..." : "Delete"}
            </button>
          </div>
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
            <strong>Primary interest:</strong> {inquiry.inquiryType || "-"}
          </p>
          <p style={{ whiteSpace: "pre-wrap" }}>
            <strong>Message:</strong> {inquiry.message}
          </p>
        </article>
      ))}
    </>
  );
}
