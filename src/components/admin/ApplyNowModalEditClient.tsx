"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultApplyNowModal } from "@/data/site-defaults";

type CustomField = {
  label: string;
  placeholder: string;
  inputType: "text" | "email" | "number";
};

export default function ApplyNowModalEditClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [panelTitle, setPanelTitle] = useState(defaultApplyNowModal.panelTitle);
  const [panelDescription, setPanelDescription] = useState(defaultApplyNowModal.panelDescription);
  const [panelHighlights, setPanelHighlights] = useState(defaultApplyNowModal.panelHighlights.join("\n"));
  const [formTitle, setFormTitle] = useState(defaultApplyNowModal.formTitle);
  const [formDescription, setFormDescription] = useState(defaultApplyNowModal.formDescription);
  const [fullNameLabel, setFullNameLabel] = useState(defaultApplyNowModal.fullNameLabel);
  const [fullNamePlaceholder, setFullNamePlaceholder] = useState(defaultApplyNowModal.fullNamePlaceholder);
  const [phoneLabel, setPhoneLabel] = useState(defaultApplyNowModal.phoneLabel);
  const [phonePlaceholder, setPhonePlaceholder] = useState(defaultApplyNowModal.phonePlaceholder);
  const [emailLabel, setEmailLabel] = useState(defaultApplyNowModal.emailLabel);
  const [emailPlaceholder, setEmailPlaceholder] = useState(defaultApplyNowModal.emailPlaceholder);
  const [cityLabel, setCityLabel] = useState(defaultApplyNowModal.cityLabel);
  const [cityPlaceholder, setCityPlaceholder] = useState(defaultApplyNowModal.cityPlaceholder);
  const [cityOptions, setCityOptions] = useState(defaultApplyNowModal.cityOptions.join("\n"));
  const [experienceLabel, setExperienceLabel] = useState(defaultApplyNowModal.experienceLabel);
  const [experiencePlaceholder, setExperiencePlaceholder] = useState(defaultApplyNowModal.experiencePlaceholder);
  const [experienceOptions, setExperienceOptions] = useState(defaultApplyNowModal.experienceOptions.join("\n"));
  const [messageLabel, setMessageLabel] = useState(defaultApplyNowModal.messageLabel);
  const [messagePlaceholder, setMessagePlaceholder] = useState(defaultApplyNowModal.messagePlaceholder);
  const [customFields, setCustomFields] = useState<CustomField[]>(defaultApplyNowModal.customFields);
  const [termsText, setTermsText] = useState(defaultApplyNowModal.termsText);
  const [marketingConsentText, setMarketingConsentText] = useState(defaultApplyNowModal.marketingConsentText);
  const [submitLabel, setSubmitLabel] = useState(defaultApplyNowModal.submitLabel);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/admin/site-global");
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message ?? "Load failed");
        const content = json?.data?.applyNowModal ?? defaultApplyNowModal;
        if (cancelled) return;
        setPanelTitle(content.panelTitle ?? defaultApplyNowModal.panelTitle);
        setPanelDescription(content.panelDescription ?? defaultApplyNowModal.panelDescription);
        setPanelHighlights((content.panelHighlights ?? defaultApplyNowModal.panelHighlights).join("\n"));
        setFormTitle(content.formTitle ?? defaultApplyNowModal.formTitle);
        setFormDescription(content.formDescription ?? defaultApplyNowModal.formDescription);
        setFullNameLabel(content.fullNameLabel ?? defaultApplyNowModal.fullNameLabel);
        setFullNamePlaceholder(content.fullNamePlaceholder ?? defaultApplyNowModal.fullNamePlaceholder);
        setPhoneLabel(content.phoneLabel ?? defaultApplyNowModal.phoneLabel);
        setPhonePlaceholder(content.phonePlaceholder ?? defaultApplyNowModal.phonePlaceholder);
        setEmailLabel(content.emailLabel ?? defaultApplyNowModal.emailLabel);
        setEmailPlaceholder(content.emailPlaceholder ?? defaultApplyNowModal.emailPlaceholder);
        setCityLabel(content.cityLabel ?? defaultApplyNowModal.cityLabel);
        setCityPlaceholder(content.cityPlaceholder ?? defaultApplyNowModal.cityPlaceholder);
        setCityOptions((content.cityOptions ?? defaultApplyNowModal.cityOptions).join("\n"));
        setExperienceLabel(content.experienceLabel ?? defaultApplyNowModal.experienceLabel);
        setExperiencePlaceholder(content.experiencePlaceholder ?? defaultApplyNowModal.experiencePlaceholder);
        setExperienceOptions((content.experienceOptions ?? defaultApplyNowModal.experienceOptions).join("\n"));
        setMessageLabel(content.messageLabel ?? defaultApplyNowModal.messageLabel);
        setMessagePlaceholder(content.messagePlaceholder ?? defaultApplyNowModal.messagePlaceholder);
        setCustomFields(content.customFields ?? defaultApplyNowModal.customFields);
        setTermsText(content.termsText ?? defaultApplyNowModal.termsText);
        setMarketingConsentText(content.marketingConsentText ?? defaultApplyNowModal.marketingConsentText);
        setSubmitLabel(content.submitLabel ?? defaultApplyNowModal.submitLabel);
      } catch (err) {
        if (!cancelled) setMessage(err instanceof Error ? err.message : "Load error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const currentRes = await fetch("/api/v1/admin/site-global");
      const currentJson = await currentRes.json();
      if (!currentRes.ok) throw new Error(currentJson?.error?.message ?? "Load failed");

      const merged = {
        navItems: currentJson.data?.navItems ?? [],
        footerColumns: currentJson.data?.footerColumns ?? [],
        footerMeta: currentJson.data?.footerMeta ?? {
          brand: "",
          description: "",
          social: [],
          copyright: "",
          legal: [],
        },
        logoSrc: currentJson.data?.logoSrc,
        featureFlags: currentJson.data?.featureFlags,
        seoDefaults: currentJson.data?.seoDefaults,
        applyNowModal: {
          panelTitle: panelTitle.trim(),
          panelDescription: panelDescription.trim(),
          panelHighlights: panelHighlights
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          formTitle: formTitle.trim(),
          formDescription: formDescription.trim(),
          fullNameLabel: fullNameLabel.trim(),
          fullNamePlaceholder: fullNamePlaceholder.trim(),
          phoneLabel: phoneLabel.trim(),
          phonePlaceholder: phonePlaceholder.trim(),
          emailLabel: emailLabel.trim(),
          emailPlaceholder: emailPlaceholder.trim(),
          cityLabel: cityLabel.trim(),
          cityPlaceholder: cityPlaceholder.trim(),
          cityOptions: cityOptions
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          experienceLabel: experienceLabel.trim(),
          experiencePlaceholder: experiencePlaceholder.trim(),
          experienceOptions: experienceOptions
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
          messageLabel: messageLabel.trim(),
          messagePlaceholder: messagePlaceholder.trim(),
          customFields: customFields
            .map((field) => ({
              label: field.label.trim(),
              placeholder: field.placeholder.trim(),
              inputType: field.inputType,
            }))
            .filter((field) => field.label),
          termsText: termsText.trim(),
          marketingConsentText: marketingConsentText.trim(),
          submitLabel: submitLabel.trim(),
        },
      };

      const res = await fetch("/api/v1/admin/site-global", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message ?? "Save failed");
      setMessage("Saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="admin-muted">Loading...</p>;

  function addCustomField() {
    setCustomFields((prev) => [...prev, { label: "", placeholder: "", inputType: "text" }]);
  }

  function updateCustomField(index: number, field: keyof CustomField, value: string) {
    setCustomFields((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value } as CustomField;
      return next;
    });
  }

  function removeCustomField(index: number) {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin">Back to Dashboard</Link>
      </nav>
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Apply Now Modal</h1>
        <p className="admin-muted">Edit the content shown when users click the Apply Now button.</p>
        <form className="admin-form" onSubmit={onSave}>
          <label>
            Left panel title
            <input value={panelTitle} onChange={(e) => setPanelTitle(e.target.value)} />
          </label>
          <label>
            Left panel description
            <textarea
              rows={3}
              value={panelDescription}
              onChange={(e) => setPanelDescription(e.target.value)}
            />
          </label>
          <label>
            Left panel bullet points (one per line)
            <textarea
              rows={4}
              value={panelHighlights}
              onChange={(e) => setPanelHighlights(e.target.value)}
            />
          </label>
          <label>
            Form title
            <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
          </label>
          <label>
            Form description
            <textarea
              rows={3}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
            />
          </label>
          <label>
            Full name label
            <input value={fullNameLabel} onChange={(e) => setFullNameLabel(e.target.value)} />
          </label>
          <label>
            Full name placeholder
            <input
              value={fullNamePlaceholder}
              onChange={(e) => setFullNamePlaceholder(e.target.value)}
            />
          </label>
          <label>
            Phone label
            <input value={phoneLabel} onChange={(e) => setPhoneLabel(e.target.value)} />
          </label>
          <label>
            Phone placeholder
            <input value={phonePlaceholder} onChange={(e) => setPhonePlaceholder(e.target.value)} />
          </label>
          <label>
            Email label
            <input value={emailLabel} onChange={(e) => setEmailLabel(e.target.value)} />
          </label>
          <label>
            Email placeholder
            <input value={emailPlaceholder} onChange={(e) => setEmailPlaceholder(e.target.value)} />
          </label>
          <label>
            City label
            <input value={cityLabel} onChange={(e) => setCityLabel(e.target.value)} />
          </label>
          <label>
            City placeholder
            <input value={cityPlaceholder} onChange={(e) => setCityPlaceholder(e.target.value)} />
          </label>
          <label>
            City options (one per line)
            <textarea rows={4} value={cityOptions} onChange={(e) => setCityOptions(e.target.value)} />
          </label>
          <label>
            Experience label
            <input value={experienceLabel} onChange={(e) => setExperienceLabel(e.target.value)} />
          </label>
          <label>
            Experience placeholder
            <input
              value={experiencePlaceholder}
              onChange={(e) => setExperiencePlaceholder(e.target.value)}
            />
          </label>
          <label>
            Experience options (one per line)
            <textarea
              rows={4}
              value={experienceOptions}
              onChange={(e) => setExperienceOptions(e.target.value)}
            />
          </label>
          <label>
            Message label
            <input value={messageLabel} onChange={(e) => setMessageLabel(e.target.value)} />
          </label>
          <label>
            Message placeholder
            <input
              value={messagePlaceholder}
              onChange={(e) => setMessagePlaceholder(e.target.value)}
            />
          </label>
          <h3 style={{ marginBottom: 0 }}>Additional input fields</h3>
          <p className="admin-muted" style={{ marginTop: 0 }}>
            Add extra fields that should appear in the form.
          </p>
          {customFields.map((field, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gap: 8,
                padding: 12,
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                marginBottom: 8,
              }}
            >
              <input
                value={field.label}
                onChange={(e) => updateCustomField(index, "label", e.target.value)}
                placeholder="Field label"
              />
              <input
                value={field.placeholder}
                onChange={(e) => updateCustomField(index, "placeholder", e.target.value)}
                placeholder="Placeholder"
              />
              <select
                value={field.inputType}
                onChange={(e) => updateCustomField(index, "inputType", e.target.value)}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
              </select>
              <button
                type="button"
                className="admin-button-secondary"
                onClick={() => removeCustomField(index)}
              >
                Remove field
              </button>
            </div>
          ))}
          <button type="button" className="admin-button-secondary" onClick={addCustomField}>
            Add input field
          </button>
          <label>
            Terms checkbox text
            <textarea rows={2} value={termsText} onChange={(e) => setTermsText(e.target.value)} />
          </label>
          <label>
            Marketing consent checkbox text
            <textarea
              rows={2}
              value={marketingConsentText}
              onChange={(e) => setMarketingConsentText(e.target.value)}
            />
          </label>
          <label>
            Submit button label
            <input value={submitLabel} onChange={(e) => setSubmitLabel(e.target.value)} />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          {message ? <p className={message === "Saved." ? "contact-form__ok" : "contact-form__err"}>{message}</p> : null}
        </form>
      </div>
    </div>
  );
}
