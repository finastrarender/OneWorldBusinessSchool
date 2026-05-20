"use client";

import type { z } from "zod";
import { useState } from "react";
import type { contactDataSchema } from "@/schemas/sections";

type ContactData = z.infer<typeof contactDataSchema>;

export default function ContactBlockSection({ content }: { content: ContactData }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    try {
      const res = await fetch("/api/v1/contact", {
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
      setMessage("Thank you — we will be in touch shortly.");
      form.reset();
    } catch {
      setStatus("err");
      setMessage("Network error");
    }
  }

  return (
    <section className="intro-section section-shell" id="contact-form">
      <div className="intro-section__content" style={{ gridTemplateColumns: "1fr" }}>
        <div className="intro-section__copy">
          <div className="section-accent"></div>
          <h2 className="section-title">{content.headline}</h2>
          <p className="intro-section__description">{content.subtext}</p>
          <form className="contact-form" onSubmit={onSubmit} style={{ marginTop: 24, maxWidth: 520 }}>
            <label className="contact-form__field">
              <span>Name</span>
              <input name="name" type="text" required className="contact-form__input" />
            </label>
            <label className="contact-form__field">
              <span>Email</span>
              <input name="email" type="email" required className="contact-form__input" />
            </label>
            <label className="contact-form__field">
              <span>Message</span>
              <textarea name="message" required rows={5} className="contact-form__input" />
            </label>
            <button type="submit" className="button button--gold" disabled={status === "loading"}>
              {status === "loading" ? "Sending…" : "Send message"}
            </button>
            {message ? (
              <p className={status === "ok" ? "contact-form__ok" : "contact-form__err"}>{message}</p>
            ) : null}
          </form>
        </div>
      </div>
    </section>
  );
}
