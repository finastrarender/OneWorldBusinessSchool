"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ApplicationField = {
  label: string;
  value?: string;
};

type IncubationApplicationItem = {
  _id: string;
  fields: ApplicationField[];
  createdAt?: string;
};

function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function IncubationApplicationsList({
  applications,
}: {
  applications: IncubationApplicationItem[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(applications);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this incubation application? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const res = await fetch(`/api/v1/admin/incubation-applications/${id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error?.message ?? "Failed to delete application.");
        return;
      }
      setItems((current) => current.filter((item) => item._id !== id));
      router.refresh();
    } catch {
      setError("Network error while deleting application.");
    } finally {
      setDeletingId(null);
    }
  }

  if (items.length === 0) {
    return <p className="admin-muted">No applications submitted yet.</p>;
  }

  return (
    <>
      {error ? <p className="admin-field-error">{error}</p> : null}
      {items.map((application) => {
        const fullName =
          application.fields.find((field) => field.label.toLowerCase().includes("full name"))
            ?.value ?? "Application";

        return (
          <article key={application._id} className="admin-section-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <div>
                <h3 style={{ marginTop: 0 }}>{fullName}</h3>
                <p className="admin-muted">{formatDate(application.createdAt)}</p>
              </div>
              <button
                type="button"
                className="admin-button-secondary"
                disabled={deletingId === application._id}
                onClick={() => handleDelete(application._id)}
              >
                {deletingId === application._id ? "Deleting..." : "Delete"}
              </button>
            </div>
            {application.fields.map((field, index) => (
              <p key={`${field.label}-${index}`}>
                <strong>{field.label}:</strong> {field.value || "-"}
              </p>
            ))}
          </article>
        );
      })}
    </>
  );
}
