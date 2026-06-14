"use client";
 
import React, { useState } from "react";
import type { z } from "zod";
import {
  contactInquiryFormSchema,
  sanitizePhoneInput,
  zodErrorsToRecord,
} from "@/lib/form-validation";
import type { contactInquiryDataSchema } from "@/schemas/sections";
import SimpleIcon from "../SimpleIcon";

type ContactInquiryContent = z.infer<typeof contactInquiryDataSchema>;

export default function ContactInquirySection({ content }: { content: ContactInquiryContent }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const officeAddress =
    content.officeItems.find((item) => item.icon === "location")?.lines.join(", ") ??
    content.officeItems[0]?.lines.join(", ") ??
    "Nad Al Sheba, Dubai, United Arab Emirates";
  const mapEmbedUrl =
    content.mapImage.includes("google.com/maps") || content.mapImage.includes("google.com/maps/embed")
      ? content.mapImage
      : `https://www.google.com/maps?q=${encodeURIComponent(officeAddress)}&output=embed`;
  const departmentContacts =
    content.departmentContacts && content.departmentContacts.length > 0
      ? content.departmentContacts
      : content.officeItems.slice(0, 3).map((item) => ({
          title: item.title,
          subtitle: item.lines[0] ?? "",
          email: item.lines[1] ?? "",
        }));
  const formFields = content.formFields ?? {};
 
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    setErrors({});

    const form = e.currentTarget;
    const fd = new FormData(form);
    const formData = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      company: String(fd.get("company") ?? ""),
      inquiryType: String(fd.get("inquiryType") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    const validation = contactInquiryFormSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(zodErrorsToRecord(validation.error));
      setStatus("idle");
      return;
    }

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("err");
        setMessage(json?.error?.message ?? "Something went wrong");
        return;
      }
      setStatus("ok");
      setMessage(formFields.successMessage ?? "Thank you — our consultants will be in touch shortly.");
      form.reset();
    } catch {
      setStatus("err");
      setMessage(formFields.errorMessage ?? "Network error");
    }
  }
 
  return (
    <section className="contact-inquiry">
      <div className="section-shell contact-inquiry__grid">
        <div className="contact-inquiry__details">
          <h2 className="contact-inquiry__office-title">{content.officeHeading}</h2>
 
          <div className="contact-inquiry__details-list">
            {content.officeItems.map((item) => (
              <article key={item.title} className="contact-inquiry__detail-item">
                <div className="contact-inquiry__detail-icon">
                  <SimpleIcon name={item.icon} className="contact-inquiry__detail-icon-svg" />
                </div>
                <div className="contact-inquiry__detail-copy">
                  <h3>{item.title.toUpperCase()}</h3>
                  {item.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
 
          <div className="contact-inquiry__departments">
            <h3>{formFields.departmentHeading ?? "Departmental Contacts"}</h3>
            <div className="contact-inquiry__departments-grid">
              {departmentContacts.map((item) => (
                <article key={`dept-${item.title}`} className="contact-inquiry__department-card">
                  <h4>{item.title}</h4>
                  <p>{item.subtitle}</p>
                  <span>{item.email}</span>
                </article>
              ))}
            </div>
          </div>
 
          <div className="contact-inquiry__map">
            <iframe
              title="Office location map"
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="contact-inquiry__map-frame"
            />
          </div>
        </div>
 
        <div className="contact-inquiry__card">
          <h2 className="contact-inquiry__form-title">{content.formTitle}</h2>
          {content.formDescription ? (
            <p className="contact-inquiry__form-description">{content.formDescription}</p>
          ) : null}
 
          <form className="contact-inquiry__form" onSubmit={onSubmit} noValidate>
            <div className="contact-inquiry__row">
              <label className="contact-inquiry__field">
                <span>{formFields.fullNameLabel ?? "Full Name"} *</span>
                <input
                  suppressHydrationWarning
                  name="name"
                  type="text"
                  className={`contact-inquiry__input${errors.name ? " input-invalid" : ""}`}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </label>
              <label className="contact-inquiry__field">
                <span>{formFields.companyLabel ?? "Organization / Company"} *</span>
                <input
                  suppressHydrationWarning
                  name="company"
                  type="text"
                  className={`contact-inquiry__input${errors.company ? " input-invalid" : ""}`}
                />
                {errors.company && <span className="field-error">{errors.company}</span>}
              </label>
            </div>
 
            <div className="contact-inquiry__row">
              <label className="contact-inquiry__field">
                <span>{formFields.workEmailLabel ?? "Work Email"} *</span>
                <input
                  suppressHydrationWarning
                  name="email"
                  type="email"
                  className={`contact-inquiry__input${errors.email ? " input-invalid" : ""}`}
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </label>
              <label className="contact-inquiry__field">
                <span>{formFields.phoneLabel ?? "Phone Number"} *</span>
                <input
                  suppressHydrationWarning
                  name="phone"
                  type="text"
                  className={`contact-inquiry__input${errors.phone ? " input-invalid" : ""}`}
                  placeholder={formFields.phonePlaceholder ?? "+971501234567"}
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    target.value = sanitizePhoneInput(target.value);
                  }}
                />
                {errors.phone && <span className="field-error">{errors.phone}</span>}
              </label>
            </div>
 
            <label className="contact-inquiry__field">
              <span>{formFields.interestLabel ?? "Primary Interest"} *</span>
              <select
                suppressHydrationWarning
                name="inquiryType"
                className={`contact-inquiry__input contact-inquiry__select${errors.inquiryType ? " input-invalid" : ""}`}
              >
                <option value="">{formFields.interestPlaceholder ?? "Select primary interest"}</option>
                {content.inquiryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.inquiryType && <span className="field-error">{errors.inquiryType}</span>}
            </label>
            <label className="contact-inquiry__field">
              <span>{formFields.messageLabel ?? "Your Message"} *</span>
              <textarea
                suppressHydrationWarning
                name="message"
                rows={5}
                className={`contact-inquiry__input contact-inquiry__textarea${errors.message ? " input-invalid" : ""}`}
                placeholder={formFields.messagePlaceholder ?? "How can we help you?"}
              />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </label>
 
            <button
              suppressHydrationWarning
              type="submit"
              className="contact-inquiry__submit"
              disabled={status === "loading"}
            >
              <span>{status === "loading" ? "SENDING..." : content.submitLabel.toUpperCase()}</span>
            </button>
            <p className="contact-inquiry__disclaimer">
              {formFields.disclaimerText ??
                "By submitting this form, you agree to our privacy policy and data handling terms."}
            </p>
 
            {message ? (
              <p className={status === "ok" ? "contact-form__ok" : "contact-form__err"}>{message}</p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
