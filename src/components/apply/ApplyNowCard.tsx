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

        <form className="apply-now-form">
          <label>
            <span>{content.fullNameLabel}</span>
            <input type="text" placeholder={content.fullNamePlaceholder} />
          </label>

          <div className="apply-now-form__row">
            <label>
              <span>{content.phoneLabel}</span>
              <input type="text" placeholder={content.phonePlaceholder} />
            </label>
            <label>
              <span>{content.emailLabel}</span>
              <input type="email" placeholder={content.emailPlaceholder} />
            </label>
          </div>

          <div className="apply-now-form__row">
            <label>
              <span>{content.cityLabel}</span>
              <select defaultValue="">
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
              <select defaultValue="">
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
            <textarea rows={4} placeholder={content.messagePlaceholder} />
          </label>
          {content.customFields.map((field, index) => (
            <label key={`${field.label}-${index}`}>
              <span>{field.label}</span>
              <input type={field.inputType} placeholder={field.placeholder} />
            </label>
          ))}

          <label className="apply-now-form__check">
            <input type="checkbox" />
            <span>{content.termsText}</span>
          </label>
          <label className="apply-now-form__check">
            <input type="checkbox" />
            <span>{content.marketingConsentText}</span>
          </label>

          <button type="submit">{content.submitLabel}</button>
        </form>
      </div>
    </div>
  );
}
