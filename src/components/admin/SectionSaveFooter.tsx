"use client";

type SectionSaveFooterProps = {
  isSubmitting: boolean;
  message?: string | null;
  messageTone?: "success" | "error";
  previewHref: string;
};

export default function SectionSaveFooter({
  isSubmitting,
  message,
  messageTone = "success",
  previewHref,
}: SectionSaveFooterProps) {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save section"}
      </button>

      <div style={{ display: "grid", gap: 8 }}>
        <a href={previewHref} target="_blank" rel="noreferrer" className="admin-button-secondary">
          Preview draft
        </a>
        {message ? (
          <p className={messageTone === "error" ? "contact-form__err" : "contact-form__ok"} style={{ margin: 0 }}>
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
