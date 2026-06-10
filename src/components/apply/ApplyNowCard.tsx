"use client";

import { useState } from "react";

export type ApplyNowModalContent = {
  panelTitle: string;
  panelDescription: string;
  panelHighlights: string[];
  formTitle: string;
  formDescription: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  cityLabel: string;
  cityPlaceholder: string;
  cityOptions: string[];
  experienceLabel: string;
  experiencePlaceholder: string;
  experienceOptions: string[];
  messageLabel: string;
  messagePlaceholder: string;
  customFields: Array<{
    label: string;
    placeholder: string;
    inputType: "text" | "email" | "number";
  }>;
  termsText: string;
  marketingConsentText: string;
  submitLabel: string;
};

export default function ApplyNowCard({ content }: { content: ApplyNowModalContent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    const customFields = content.customFields.map((field, index) => ({
      label: field.label,
      value: String(fd.get(`custom-${index}`) ?? ""),
    }));

    const body = {
      fullName: String(fd.get("fullName") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      city: String(fd.get("city") ?? ""),
      experience: String(fd.get("experience") ?? ""),
      message: String(fd.get("message") ?? ""),
      customFields,
      acceptedTerms: fd.get("acceptedTerms") === "on",
      marketingConsent: fd.get("marketingConsent") === "on",
    };

    try {
      const res = await fetch("/api/v1/enroll-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setMessage(json?.error?.message ?? "Something went wrong");
        return;
      }
      setStatus("ok");
      setMessage("Thank you - your enrollment inquiry has been submitted.");
      form.reset();
    } catch {
      setStatus("err");
      setMessage("Network error");
    }
  }

  return (
    <div className="apply-now-card">
      <aside className="apply-now-panel">
        <h1>{content.panelTitle}</h1>
        <p>{content.panelDescription}</p>
        <ul>
          {content.panelHighlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </aside>

      <div className="apply-now-form-wrap">
        <h2>{content.formTitle}</h2>
        <p>{content.formDescription}</p>

        <form className="apply-now-form" onSubmit={onSubmit}>
          <label>
            <span>{content.fullNameLabel}</span>
            <input name="fullName" type="text" placeholder={content.fullNamePlaceholder} required />
          </label>

          <div className="apply-now-form__row">
            <label>
              <span>{content.phoneLabel}</span>
              <input name="phone" type="text" placeholder={content.phonePlaceholder} />
            </label>
            <label>
              <span>{content.emailLabel}</span>
              <input name="email" type="email" placeholder={content.emailPlaceholder} required />
            </label>
          </div>

          <div className="apply-now-form__row">
            <label>
              <span>{content.cityLabel}</span>
              <select name="city" defaultValue="">
                <option value="" disabled>
                  {content.cityPlaceholder}
                </option>
                {content.cityOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              <span>{content.experienceLabel}</span>
              <select name="experience" defaultValue="">
                <option value="" disabled>
                  {content.experiencePlaceholder}
                </option>
                {content.experienceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            <span>{content.messageLabel}</span>
            <textarea name="message" rows={4} placeholder={content.messagePlaceholder} />
          </label>
          {content.customFields.map((field, index) => (
            <label key={`${field.label}-${index}`}>
              <span>{field.label}</span>
              <input name={`custom-${index}`} type={field.inputType} placeholder={field.placeholder} />
            </label>
          ))}

          <label className="apply-now-form__check">
            <input name="acceptedTerms" type="checkbox" />
            <span>{content.termsText}</span>
          </label>
          <label className="apply-now-form__check">
            <input name="marketingConsent" type="checkbox" />
            <span>{content.marketingConsentText}</span>
          </label>

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Submitting..." : content.submitLabel}
          </button>
          {message ? (
            <p className={status === "ok" ? "contact-form__ok" : "contact-form__err"}>
              {message}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
