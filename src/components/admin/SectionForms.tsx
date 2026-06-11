"use client";

import {
  useEffect,
  useMemo,
  useRef,
  type FormHTMLAttributes,
  type RefObject,
} from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";
import IconPicker from "./IconPicker";

type SectionRow = {
  id: string;
  type: string;
  order: number;
  data: Record<string, unknown>;
};

type SectionFormProps = {
  section: SectionRow;
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
};

function SectionHeading({ section }: { section: SectionRow }) {
  return (
    <h3>
      {section.type}{" "}
      <span className="admin-muted" style={{ fontWeight: 400 }}>
        (order {section.order}, id {section.id})
      </span>
    </h3>
  );
}

function FieldHint({ children }: { children: string }) {
  return <p className="admin-field-hint">{children}</p>;
}

function getFieldHintFromLabel(labelText: string) {
  const key = labelText.toLowerCase().replace(/\s+/g, " ").trim();
  if (!key) return null;

  if (key.includes("eyebrow"))
    return "Short intro text shown above the main heading.";
  if (key.includes("badge")) return "A compact tag line shown above the title.";
  if (key.includes("title lines") || key.includes("heading lines")) {
    return "Add one line per row. Each line renders as a separate heading line.";
  }
  if (key.includes("title")) return "Main title text shown for this block.";
  if (key.includes("description lines"))
    return "Use one line per row for multiple description points.";
  if (key.includes("description"))
    return "Write a concise supporting paragraph for this section.";
  if (
    key.includes("subheading") ||
    key.includes("subtitle") ||
    key.includes("subtext")
  ) {
    return "Supporting text shown under the main heading.";
  }
  if (
    key.includes("highlights") ||
    key.includes("points") ||
    key.includes("features")
  ) {
    return "Add one item per line for a clean bullet-style layout.";
  }
  if (key.includes("filter"))
    return "Add one filter label per line (include an All option if needed).";
  if (key.includes("category"))
    return "Use a category that matches one of your filter labels.";
  if (key.includes("stat"))
    return "Short metric text, like 120+ clients or 15 years.";
  if (key.includes("icon"))
    return "Choose an icon that best matches this content item.";
  if (key.includes("caption"))
    return "Small text shown near or under the image.";
  if (
    key.includes("action label") ||
    key.includes("cta label") ||
    key === "label"
  ) {
    return "Button text users will see and click.";
  }
  if (key.includes("href") || key.includes("url")) {
    return "Use a valid route like /contact or a full URL like https://example.com.";
  }
  if (key.includes("image"))
    return "Upload or paste a clear image URL for this section.";
  if (key.includes("form title"))
    return "Heading shown above the contact form.";
  if (key.includes("form description"))
    return "Short helper text shown before form fields.";
  if (key.includes("submit label")) return "Text shown on the submit button.";
  if (key.includes("office"))
    return "Office details shown in the contact information block.";
  if (key.includes("map"))
    return "Map image or label shown near the location details.";
  if (key.includes("quote")) return "Quote content shown as testimonial text.";

  return "Enter a clear value that matches this field's purpose.";
}

function useAutoFieldHints(formRef: RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    const formEl = formRef.current;
    if (!formEl) return;

    const applyHints = () => {
      const labels = formEl.querySelectorAll("label");
      labels.forEach((label) => {
        if (label.querySelector(".admin-field-hint")) return;
        if (!label.querySelector("input, textarea, select, .admin-icon-picker"))
          return;

        const ownText = Array.from(label.childNodes)
          .filter((node) => node.nodeType === Node.TEXT_NODE)
          .map((node) => node.textContent ?? "")
          .join(" ")
          .trim();
        const normalizedLabel = (ownText || label.textContent || "")
          .replace(/\s+/g, " ")
          .trim();
        const hintText = getFieldHintFromLabel(normalizedLabel);
        if (!hintText) return;

        const hint = document.createElement("p");
        hint.className = "admin-field-hint";
        hint.dataset.autoHint = "true";
        hint.textContent = hintText;

        const error = label.querySelector(".admin-field-error");
        if (error) {
          label.insertBefore(hint, error);
          return;
        }
        label.appendChild(hint);
      });
    };

    applyHints();
    const observer = new MutationObserver(() => applyHints());
    observer.observe(formEl, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [formRef]);
}

function SectionForm(props: FormHTMLAttributes<HTMLFormElement>) {
  const formRef = useRef<HTMLFormElement>(null);
  useAutoFieldHints(formRef);
  return <form ref={formRef} {...props} />;
}

type IntroFormValues = {
  eyebrow: string;
  titleLines: string;
  description: string;
  image: string;
  expcount: number;
  // exptext: string;
};

function toIntroDefaultValues(data: Record<string, unknown>): IntroFormValues {
  return {
    eyebrow: (data.eyebrow as string) ?? "",
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    image: (data.image as string) ?? "",
    expcount: (data.expcount as number) ?? 0,
    // exptext: (data.exptext as string) ?? "",
  };
}

export function IntroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIntroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IntroFormValues>({ defaultValues });
  const image = watch("image");

  function handleValid(values: IntroFormValues) {
    onSave({
      eyebrow: values.eyebrow,
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      highlights: [],
      image: values.image,
      more: "",
      icon: "",
      href: "#",
      expcount: values.expcount,
      // exptext: values.exptext,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Eyebrow
        <input
          {...register("eyebrow", { required: "Eyebrow is required" })}
          placeholder="Small intro text above the main heading"
        />
        <FieldHint>Use 2-6 words to introduce this section.</FieldHint>
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
          placeholder={"Trusted Growth Partner\nAcross Borders"}
        />
        <FieldHint>
          Each line becomes a separate heading line on the page.
        </FieldHint>
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
          placeholder="Short paragraph that explains what this section is about."
        />
        <FieldHint>Keep this concise, around 1-3 sentences.</FieldHint>
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <label>
          Years of Experience
          <input
            {...register("expcount", {
              required: "Experience count is required",
              valueAsNumber: true,
            })}
            type="number"
            placeholder="Number of years of experience"
          />
        </label>
        {/* <label>
          Experience Text
          <input
            {...register("exptext", { required: "Experience text is required" })}
            placeholder="Description of your experience"
          />
        </label> */}
      </div>

      <input
        type="hidden"
        {...register("image", { required: "Image path is required" })}
      />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) =>
          setValue("image", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
        placeholder="/sections/intro/cover-image.webp"
      />
      <FieldHint>Upload or paste a clear section image URL.</FieldHint>
      {errors.image ? (
        <p className="admin-field-error">{errors.image.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ServiceCardFormValue = {
  title: string;
  description: string;
  category: string;
  iconImage: string;
};

type ServicesFormValues = {
  title: string;
  description: string;
  backgroundImage: string;
  cards: ServiceCardFormValue[];
};

function toServicesDefaultValues(
  data: Record<string, unknown>,
): ServicesFormValues {
  const rawCards = Array.isArray(data.cards)
    ? (data.cards as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    backgroundImage: (data.backgroundImage as string) ?? "",
    cards:
      rawCards.length > 0
        ? rawCards.map((card) => ({
            title: (card.title as string) ?? "",
            description: (card.description as string) ?? "",
            category: (card.category as string) ?? "",
            iconImage: (card.iconImage as string) ?? "",
          }))
        : [{ title: "", description: "", category: "", iconImage: "" }],
  };
}

export function ServicesSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });
  const cards = watch("cards");

  function handleValid(values: ServicesFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      backgroundImage: values.backgroundImage,
      cards: values.cards.map((card) => ({
        title: card.title,
        description: card.description,
        category: card.category,
        iconImage: card.iconImage,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Services built for global businesses"
        />
        <FieldHint>Main heading for this services block.</FieldHint>
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
          placeholder="Briefly describe your service offering and value."
        />
        <FieldHint>Use a short summary that supports the heading.</FieldHint>
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div className="admin-section-group">
        <h4>Service cards</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              Card title
              <input
                {...register(`cards.${index}.title`, {
                  required: "Card title is required",
                })}
                placeholder="Business Setup"
              />
              <FieldHint>Short name of this service card.</FieldHint>
            </label>
            <label>
              Card description
              <textarea
                rows={3}
                {...register(`cards.${index}.description`, {
                  required: "Card description is required",
                })}
                placeholder="Describe what this service includes."
              />
              <FieldHint>1-2 lines explaining this service.</FieldHint>
            </label>
            <label>
              Category
              <input
                {...register(`cards.${index}.category`, {
                  required: "Category is required",
                })}
                placeholder="MANAGEMENT"
              />
              <FieldHint>Text shown inside the badge on the card.</FieldHint>
            </label>
            <label>
              Card image
              <input type="hidden" {...register(`cards.${index}.iconImage`)} />
              <ImageUploadField
                label="Card image URL"
                value={cards?.[index]?.iconImage ?? ""}
                onChange={(value) =>
                  setValue(`cards.${index}.iconImage`, value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                folder={`sections/${section.type}/cards`}
                placeholder="/home/card-image.jpg"
              />
              <FieldHint>Upload or paste an image URL shown on this card.</FieldHint>
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              title: "",
              description: "",
              category: "",
              iconImage: "",
            })
          }
        >
          Add card
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ServicesAccordionCardFormValue = {
  title: string;
  description: string;
  category: string;
  icon: string;
  iconImage: string;
  pointsLines: string;
};

type ServicesAccordionFormValues = {
  cards: ServicesAccordionCardFormValue[];
};

function toServicesAccordionDefaultValues(
  data: Record<string, unknown>,
): ServicesAccordionFormValues {
  const rawCards = Array.isArray(data.cards)
    ? (data.cards as Record<string, unknown>[])
    : [];

  return {
    cards:
      rawCards.length > 0
        ? rawCards.map((card) => ({
            title: (card.title as string) ?? "",
            description: (card.description as string) ?? "",
            category: (card.category as string) ?? "",
            icon: (card.icon as string) ?? "",
            iconImage: (card.iconImage as string) ?? "",
            pointsLines: Array.isArray(card.points)
              ? (card.points as string[]).join("\n")
              : "",
          }))
        : [{ title: "", description: "", category: "", icon: "", iconImage: "", pointsLines: "" }],
  };
}

export function ServicesAccordionSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesAccordionDefaultValues(section.data),
    [section.data],
  );
  const {
    control,
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesAccordionFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });
  const cards = watch("cards");

  function handleValid(values: ServicesAccordionFormValues) {
    onSave({
      cards: values.cards.map((card) => ({
        title: card.title,
        description: card.description,
        category: card.category,
        icon: card.icon || undefined,
        iconImage: card.iconImage,
        points: card.pointsLines
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <div className="admin-section-group">
        <h4>Accordion items</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              Item title
              <input
                {...register(`cards.${index}.title`, {
                  required: "Item title is required",
                })}
              />
            </label>
            <label>
              Item description
              <textarea
                rows={4}
                {...register(`cards.${index}.description`, {
                  required: "Item description is required",
                })}
              />
            </label>
            <label>
              Category
              <input {...register(`cards.${index}.category`)} />
            </label>
            <label>
              Icon
              <Controller
                control={control}
                name={`cards.${index}.icon`}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) => field.onChange(typeof val === "string" ? val : "")}
                  />
                )}
              />
            </label>
            <label>
              Bullet points (one per line)
              <textarea rows={4} {...register(`cards.${index}.pointsLines`)} />
            </label>
            <label>
              Item image
              <input type="hidden" {...register(`cards.${index}.iconImage`)} />
              <ImageUploadField
                label="Item image URL"
                value={cards?.[index]?.iconImage ?? ""}
                onChange={(value) =>
                  setValue(`cards.${index}.iconImage`, value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                folder={`sections/${section.type}/cards`}
                placeholder="/home/hero-bg.jpg"
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove item
            </button>
            {errors.cards?.[index]?.title ? (
              <p className="admin-field-error">{errors.cards[index]?.title?.message}</p>
            ) : null}
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              title: "",
              description: "",
              category: "",
              icon: "",
              iconImage: "",
              pointsLines: "",
            })
          }
        >
          Add item
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ServicesGridCardFormValue = {
  category: string;
  title: string;
  description: string;
  featuresLines: string;
  cta: string;
};

type ServicesGridFormValues = {
  title: string;
  description: string;
  filtersLines: string;
  cards: ServicesGridCardFormValue[];
};

function toServicesGridDefaultValues(
  data: Record<string, unknown>,
): ServicesGridFormValues {
  const rawCards = Array.isArray(data.cards)
    ? (data.cards as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    filtersLines: Array.isArray(data.filters)
      ? (data.filters as string[]).join("\n")
      : "",
    cards:
      rawCards.length > 0
        ? rawCards.map((card) => ({
            category: (card.category as string) ?? "",
            title: (card.title as string) ?? "",
            description: (card.description as string) ?? "",
            featuresLines: Array.isArray(card.features)
              ? (card.features as string[]).join("\n")
              : "",
            cta: (card.cta as string) ?? "",
          }))
        : [
            {
              category: "",
              title: "",
              description: "",
              featuresLines: "",
              cta: "Learn More",
            },
          ],
  };
}

export function ServicesGridSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesGridDefaultValues(section.data),
    [section.data],
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesGridFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "cards" });

  function handleValid(values: ServicesGridFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      filters: values.filtersLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      cards: values.cards.map((card) => ({
        category: card.category,
        title: card.title,
        description: card.description,
        features: card.featuresLines
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        cta: card.cta,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section title
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Explore Our Core Services"
        />
        <FieldHint>Primary heading shown above the service filters.</FieldHint>
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Section description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
          placeholder="Introduce the full list of service categories."
        />
        <FieldHint>Keep this as a short supporting paragraph.</FieldHint>
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Filter labels (one per line)
        <textarea
          rows={4}
          {...register("filtersLines", {
            required: "At least one filter is required",
          })}
          placeholder={"All\nAdvisory\nIncorporation\nCompliance"}
        />
        <FieldHint>
          One filter label per line (first line is usually All).
        </FieldHint>
        {errors.filtersLines ? (
          <p className="admin-field-error">{errors.filtersLines.message}</p>
        ) : null}
      </label>

      <div className="admin-section-group">
        <h4>Service cards</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              Category
              <input
                {...register(`cards.${index}.category`, {
                  required: "Category is required",
                })}
                placeholder="Advisory"
              />
              <FieldHint>Must match one of your filter labels.</FieldHint>
            </label>
            <label>
              Title
              <input
                {...register(`cards.${index}.title`, {
                  required: "Title is required",
                })}
                placeholder="Market Entry Strategy"
              />
              <FieldHint>Service card title shown in the grid.</FieldHint>
            </label>
            <label>
              Description
              <textarea
                rows={4}
                {...register(`cards.${index}.description`, {
                  required: "Description is required",
                })}
                placeholder="Brief overview of this service card."
              />
              <FieldHint>
                Use a compact summary for better readability.
              </FieldHint>
            </label>
            <label>
              Features (one per line)
              <textarea
                rows={4}
                {...register(`cards.${index}.featuresLines`, {
                  required: "At least one feature is required",
                })}
                placeholder={"Feature one\nFeature two\nFeature three"}
              />
              <FieldHint>Enter one feature per line.</FieldHint>
            </label>
            <label>
              CTA label
              <input
                {...register(`cards.${index}.cta`, {
                  required: "CTA label is required",
                })}
                placeholder="Learn More"
              />
              <FieldHint>Button text users will click on this card.</FieldHint>
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove card
            </button>
          </div>
        ))}

        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              category: "",
              title: "",
              description: "",
              featuresLines: "",
              cta: "Learn More",
            })
          }
        >
          Add card
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type WhyChooseItemFormValue = {
  title: string;
  icon: string;
  description: string;
};

type WhyChooseFormValues = {
  title: string;
  subheading: string;
  items: WhyChooseItemFormValue[];
};

function toWhyChooseDefaultValues(
  data: Record<string, unknown>,
): WhyChooseFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    subheading: (data.subheading as string) ?? "",
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            icon: typeof item.icon === "string" ? item.icon : "",
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
          }))
        : [{ icon: "", title: "", description: "" }],
  };
}

export function WhyChooseSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toWhyChooseDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<WhyChooseFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  function handleValid(values: WhyChooseFormValues) {
    onSave({
      title: values.title,
      subheading: values.subheading,
      items: values.items,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />
      <label>
        Title
        <input {...register("title", { required: true })} />
      </label>
      <label>
        Subheading
        <input {...register("subheading")} />
      </label>

      <div>
        <h4>Items</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Icon
              <Controller
                control={control}
                name={`items.${index}.icon`}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
              />
            </label>
            {/* <label>
              Icon
              <input
                {...register(`items.${index}.icon`, { required: true })}
                placeholder="star / rocket /etch"
              />
            </label> */}
            {/* <label>
              Description
              <textarea rows={3} {...register(`items.${index}.description`, { required: true })} />
            </label> */}
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ icon: "", title: "", description: "" })}
        >
          Add item
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type InvestmentItemFormValue = {
  icon: string;
  title: string;
  description: string;
};

type InvestmentFormValues = {
  id: string;
  headingLines: string;
  items: InvestmentItemFormValue[];
  quoteText: string;
  quoteAuthor: string;
  quoteRole: string;
};

function toInvestmentDefaultValues(
  data: Record<string, unknown>,
): InvestmentFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];
  const legacyStats = Array.isArray(data.stats)
    ? (data.stats as Record<string, unknown>[])
    : [];
  const legacyDescription = (data.description as string) ?? "";

  const items =
    rawItems.length > 0
      ? rawItems.map((item) => ({
          icon: (item.icon as string) ?? "",
          title: (item.title as string) ?? "",
          description: (item.description as string) ?? "",
        }))
      : legacyStats.length > 0
        ? legacyStats.map((stat) => ({
            icon: "✓",
            title: (stat.label as string) ?? "",
            description: legacyDescription,
          }))
        : [
            { icon: "✓", title: "Global Expertise", description: "" },
            { icon: "✓", title: "Strategic Advisory", description: "" },
            { icon: "✓", title: "Risk Management", description: "" },
          ];

  const headingLines = Array.isArray(data.heading)
    ? (data.heading as string[])
    : typeof data.title === "string"
      ? [data.title]
      : [];

  return {
    id: (data.id as string) ?? "",
    headingLines: headingLines.join("\n"),
    items,
    quoteText: (data.quoteText as string) ?? "",
    quoteAuthor: (data.quoteAuthor as string) ?? "",
    quoteRole: (data.quoteRole as string) ?? "",
  };
}

export function InvestmentSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toInvestmentDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  function handleValid(values: InvestmentFormValues) {
    const heading = values.headingLines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    onSave({
      id: values.id || undefined,
      heading,
      items: values.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
      })),
      quoteText: values.quoteText,
      quoteAuthor: values.quoteAuthor,
      quoteRole: values.quoteRole,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section anchor id
        <input {...register("id")} placeholder="investment" />
      </label>

      <label>
        Heading lines (one per line)
        <textarea
          rows={3}
          {...register("headingLines", { required: "Heading is required" })}
        />
        {errors.headingLines ? (
          <p className="admin-field-error">{errors.headingLines.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Feature items</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Icon
              <Controller
                control={control}
                name={`items.${index}.icon`}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
                placeholder="Global Expertise"
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                {...register(`items.${index}.description`, { required: true })}
                placeholder="Navigating international markets with deep-rooted regulatory and cultural knowledge."
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove stat
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ icon: "✓", title: "", description: "" })}
        >
          Add item
        </button>
      </div>

      <div>
        <h4>Quote card</h4>
        <label>
          Quote text
          <textarea
            rows={4}
            {...register("quoteText", { required: "Quote text is required" })}
          />
          {errors.quoteText ? (
            <p className="admin-field-error">{errors.quoteText.message}</p>
          ) : null}
        </label>
        <label>
          Quote author
          <input
            {...register("quoteAuthor", {
              required: "Quote author is required",
            })}
          />
          {errors.quoteAuthor ? (
            <p className="admin-field-error">{errors.quoteAuthor.message}</p>
          ) : null}
        </label>
        <label>
          Quote role
          <input
            {...register("quoteRole", { required: "Quote role is required" })}
          />
          {errors.quoteRole ? (
            <p className="admin-field-error">{errors.quoteRole.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ClientLogosFormValues = {
  title: string;
  subtitle: string;
  actionLabel: string;
  actionHref: string;
};

function toClientLogosDefaultValues(
  data: Record<string, unknown>,
): ClientLogosFormValues {
  const action = ((data.action as Record<string, unknown>) ?? {}) as Record<
    string,
    unknown
  >;

  return {
    title:
      (data.title as string) ??
      ((data.heading as string) || "Ready to scale your vision?"),
    subtitle:
      (data.subtitle as string) ??
      "Connect with our strategic advisors for a confidential consultation.",
    actionLabel: (action.label as string) ?? "PARTNER WITH US",
    actionHref: (action.href as string) ?? "/contact",
  };
}

export function ClientLogosSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toClientLogosDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientLogosFormValues>({ defaultValues });

  function handleValid(values: ClientLogosFormValues) {
    onSave({
      title: values.title,
      subtitle: values.subtitle,
      action: {
        label: values.actionLabel,
        href: values.actionHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Ready to scale your vision?"
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Subtitle
        <textarea
          rows={3}
          {...register("subtitle", { required: "Subtitle is required" })}
          placeholder="Connect with our strategic advisors for a confidential consultation."
        />
        {errors.subtitle ? (
          <p className="admin-field-error">{errors.subtitle.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Action</h4>
        <label>
          Label
          <input
            {...register("actionLabel", {
              required: "Action label is required",
            })}
            placeholder="PARTNER WITH US"
          />
          {errors.actionLabel ? (
            <p className="admin-field-error">{errors.actionLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("actionHref", { required: "Action href is required" })}
            placeholder="/contact"
          />
          {errors.actionHref ? (
            <p className="admin-field-error">{errors.actionHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type CtaFormValues = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
};

function toCtaDefaultValues(data: Record<string, unknown>): CtaFormValues {
  const action = ((data.action as Record<string, unknown>) ?? {}) as Record<
    string,
    unknown
  >;

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    actionLabel: (action.label as string) ?? "",
    actionHref: (action.href as string) ?? "",
  };
}

export function CtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CtaFormValues>({ defaultValues });

  function handleValid(values: CtaFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      action: {
        label: values.actionLabel,
        href: values.actionHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <textarea
          rows={3}
          {...register("title", { required: "Title is required" })}
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Action</h4>
        <label>
          Label
          <input
            {...register("actionLabel", {
              required: "Action label is required",
            })}
          />
          {errors.actionLabel ? (
            <p className="admin-field-error">{errors.actionLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("actionHref", { required: "Action href is required" })}
          />
          {errors.actionHref ? (
            <p className="admin-field-error">{errors.actionHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutCtaFormValues = {
  titleLines: string;
  description: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
};

function toAboutCtaDefaultValues(
  data: Record<string, unknown>,
): AboutCtaFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    primaryActionLabel: (primaryAction.label as string) ?? "",
    primaryActionHref: (primaryAction.href as string) ?? "",
    secondaryActionLabel: (secondaryAction.label as string) ?? "",
    secondaryActionHref: (secondaryAction.href as string) ?? "",
  };
}

export function AboutCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutCtaFormValues>({ defaultValues });

  function handleValid(values: AboutCtaFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      primaryAction: {
        label: values.primaryActionLabel,
        href: values.primaryActionHref,
      },
      secondaryAction: {
        label: values.secondaryActionLabel,
        href: values.secondaryActionHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea
          rows={3}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryActionLabel", {
              required: "Primary action label is required",
            })}
          />
          {errors.primaryActionLabel ? (
            <p className="admin-field-error">
              {errors.primaryActionLabel.message}
            </p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryActionHref", {
              required: "Primary action href is required",
            })}
          />
          {errors.primaryActionHref ? (
            <p className="admin-field-error">
              {errors.primaryActionHref.message}
            </p>
          ) : null}
        </label>
      </div>

      <div>
        <h4>Secondary action</h4>
        <label>
          Label
          <input
            {...register("secondaryActionLabel", {
              required: "Secondary action label is required",
            })}
          />
          {errors.secondaryActionLabel ? (
            <p className="admin-field-error">
              {errors.secondaryActionLabel.message}
            </p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("secondaryActionHref", {
              required: "Secondary action href is required",
            })}
          />
          {errors.secondaryActionHref ? (
            <p className="admin-field-error">
              {errors.secondaryActionHref.message}
            </p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ContactFormValues = {
  headline: string;
  subtext: string;
};

function toContactDefaultValues(
  data: Record<string, unknown>,
): ContactFormValues {
  return {
    headline: (data.headline as string) ?? "",
    subtext: (data.subtext as string) ?? "",
  };
}

export function ContactSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toContactDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ defaultValues });

  function handleValid(values: ContactFormValues) {
    onSave({
      headline: values.headline,
      subtext: values.subtext,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Headline
        <input
          {...register("headline", { required: "Headline is required" })}
        />
        {errors.headline ? (
          <p className="admin-field-error">{errors.headline.message}</p>
        ) : null}
      </label>

      <label>
        Subtext
        <textarea
          rows={4}
          {...register("subtext", { required: "Subtext is required" })}
        />
        {errors.subtext ? (
          <p className="admin-field-error">{errors.subtext.message}</p>
        ) : null}
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ContactHeroFormValues = {
  titleLines: string;
  description: string;
  stat: string;
  backgroundImage: string;
};

function toContactHeroDefaultValues(
  data: Record<string, unknown>,
): ContactHeroFormValues {
  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    stat: (data.stat as string) ?? "",
    backgroundImage: (data.backgroundImage as string) ?? "",
  };
}

export function ContactHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toContactHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactHeroFormValues>({ defaultValues });
  const backgroundImage = useWatch({ control, name: "backgroundImage" });

  function handleValid(values: ContactHeroFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      stat: values.stat,
      backgroundImage: values.backgroundImage,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      {/* <label>
        Supporting stat
        <input {...register("stat", { required: "Stat is required" })} />
        {errors.stat ? (
          <p className="admin-field-error">{errors.stat.message}</p>
        ) : null}
      </label> */}

      <input
        type="hidden"
        {...register("backgroundImage", {
          required: "Background image is required",
        })}
      />
      <ImageUploadField
        label="Background image URL"
        value={backgroundImage}
        onChange={(value) =>
          setValue("backgroundImage", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        folder={`sections/${section.type}`}
      />
      {errors.backgroundImage ? (
        <p className="admin-field-error">{errors.backgroundImage.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IncubationStepFormValue = {
  number: number;
  title: string;
  description: string;
};

type HomeIncubationHighlightFormValues = {
  title: string;
  description: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  image: string;
  statValue: string;
  statLabel: string;
};

function toHomeIncubationHighlightDefaultValues(
  data: Record<string, unknown>,
): HomeIncubationHighlightFormValues {
  const steps = Array.isArray(data.steps) ? (data.steps as Record<string, unknown>[]) : [];
  const step1 = steps[0] ?? {};
  const step2 = steps[1] ?? {};
  const step3 = steps[2] ?? {};
  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    step1Title: (step1.title as string) ?? "",
    step1Description: (step1.description as string) ?? "",
    step2Title: (step2.title as string) ?? "",
    step2Description: (step2.description as string) ?? "",
    step3Title: (step3.title as string) ?? "",
    step3Description: (step3.description as string) ?? "",
    image: (data.image as string) ?? "",
    statValue: ((data.stat as Record<string, unknown>)?.value as string) ?? "",
    statLabel: ((data.stat as Record<string, unknown>)?.label as string) ?? "",
  };
}

export function HomeIncubationHighlightSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toHomeIncubationHighlightDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HomeIncubationHighlightFormValues>({ defaultValues });
  const image = useWatch({ control, name: "image" });

  function handleValid(values: HomeIncubationHighlightFormValues) {
    onSave({
      title: values.title.trim(),
      description: values.description.trim(),
      steps: [
        {
          number: 1,
          title: values.step1Title.trim(),
          description: values.step1Description.trim(),
        },
        {
          number: 2,
          title: values.step2Title.trim(),
          description: values.step2Description.trim(),
        },
        {
          number: 3,
          title: values.step3Title.trim(),
          description: values.step3Description.trim(),
        },
      ],
      image: values.image,
      stat: {
        value: values.statValue.trim(),
        label: values.statLabel.trim(),
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />
      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>
      <label>
        Description
        <textarea rows={4} {...register("description", { required: "Description is required" })} />
        {errors.description ? <p className="admin-field-error">{errors.description.message}</p> : null}
      </label>

      <div className="admin-section-group">
        <h4>Step 1</h4>
        <label>
          Title
          <input {...register("step1Title", { required: "Step 1 title is required" })} />
        </label>
        <label>
          Description
          <input {...register("step1Description", { required: "Step 1 description is required" })} />
        </label>
      </div>
      <div className="admin-section-group">
        <h4>Step 2</h4>
        <label>
          Title
          <input {...register("step2Title", { required: "Step 2 title is required" })} />
        </label>
        <label>
          Description
          <input {...register("step2Description", { required: "Step 2 description is required" })} />
        </label>
      </div>
      <div className="admin-section-group">
        <h4>Step 3</h4>
        <label>
          Title
          <input {...register("step3Title", { required: "Step 3 title is required" })} />
        </label>
        <label>
          Description
          <input {...register("step3Description", { required: "Step 3 description is required" })} />
        </label>
      </div>

      <input type="hidden" {...register("image", { required: "Image is required" })} />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) => setValue("image", value, { shouldDirty: true, shouldValidate: true })}
        folder={`sections/${section.type}`}
      />
      {errors.image ? <p className="admin-field-error">{errors.image.message}</p> : null}

      <label>
        Stat value
        <input {...register("statValue", { required: "Stat value is required" })} />
        {errors.statValue ? <p className="admin-field-error">{errors.statValue.message}</p> : null}
      </label>
      <label>
        Stat label
        <input {...register("statLabel", { required: "Stat label is required" })} />
        {errors.statLabel ? <p className="admin-field-error">{errors.statLabel.message}</p> : null}
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IncubationRoadmapItemFormValue = {
  title: string;
  description: string;
  pointsLines: string;
  image: string;
};

type IncubationPortfolioMetricFormValue = {
  value: string;
  label: string;
};

type IncubationPortfolioCardFormValue = {
  category: string;
  title: string;
  description: string;
  image: string;
  metrics: IncubationPortfolioMetricFormValue[];
};

type IncubationApplicationFieldFormValue = {
  label: string;
  placeholder: string;
};

type IncubationFormValues = {
  badge: string;
  heroTitleLines: string;
  heroDescription: string;
  primaryActionLabel: string;
  primaryActionHref: string;
  secondaryActionLabel: string;
  secondaryActionHref: string;
  roadmapTitle: string;
  roadmapSubtitle: string;
  roadmapItems: IncubationRoadmapItemFormValue[];
  portfolioTitle: string;
  portfolioDescription: string;
  portfolioActionLabel: string;
  portfolioActionHref: string;
  portfolioCards: IncubationPortfolioCardFormValue[];
  applicationTitle: string;
  applicationDescription: string;
  applicationFields: IncubationApplicationFieldFormValue[];
  applicationSubmitLabel: string;
  applicationNote: string;
  title: string;
  description: string;
  steps: IncubationStepFormValue[];
  image: string;
  statValue: string;
  statLabel: string;
};

function toIncubationDefaultValues(
  data: Record<string, unknown>,
): IncubationFormValues {
  const rawSteps = Array.isArray(data.steps) ? (data.steps as any[]) : [];
  const rawRoadmapItems = Array.isArray(data.roadmapItems)
    ? (data.roadmapItems as Record<string, unknown>[])
    : [];
  const rawPortfolioCards = Array.isArray(data.portfolioCards)
    ? (data.portfolioCards as Record<string, unknown>[])
    : [];
  const rawApplicationFields = Array.isArray(data.applicationFields)
    ? (data.applicationFields as Record<string, unknown>[])
    : [];
  const primaryAction = (data.primaryAction as Record<string, unknown>) ?? {};
  const secondaryAction = (data.secondaryAction as Record<string, unknown>) ?? {};
  const portfolioAction = (data.portfolioAction as Record<string, unknown>) ?? {};

  const defaultRoadmapItems =
    rawRoadmapItems.length > 0
      ? rawRoadmapItems
      : rawSteps.map((step) => ({
          title: (step.title as string) ?? "",
          description: (step.description as string) ?? "",
          points: [],
          image: (data.image as string) ?? "",
        }));

  return {
    badge: (data.badge as string) ?? "",
    heroTitleLines: Array.isArray(data.heroTitleLines)
      ? (data.heroTitleLines as string[]).join("\n")
      : (data.title as string) ?? "",
    heroDescription: (data.heroDescription as string) ?? (data.description as string) ?? "",
    primaryActionLabel: (primaryAction.label as string) ?? "",
    primaryActionHref: (primaryAction.href as string) ?? "",
    secondaryActionLabel: (secondaryAction.label as string) ?? "",
    secondaryActionHref: (secondaryAction.href as string) ?? "",
    roadmapTitle: (data.roadmapTitle as string) ?? "The Incubation Roadmap",
    roadmapSubtitle:
      (data.roadmapSubtitle as string) ?? "A structured transition from idea to global scale.",
    roadmapItems:
      defaultRoadmapItems.length > 0
        ? defaultRoadmapItems.map((item) => ({
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
            pointsLines: Array.isArray(item.points) ? (item.points as string[]).join("\n") : "",
            image: (item.image as string) ?? "",
          }))
        : [
            { title: "", description: "", pointsLines: "", image: "" },
            { title: "", description: "", pointsLines: "", image: "" },
            { title: "", description: "", pointsLines: "", image: "" },
          ],
    portfolioTitle: (data.portfolioTitle as string) ?? "Portfolio Highlights",
    portfolioDescription:
      (data.portfolioDescription as string) ??
      "See how we've helped disruptive startups navigate the complexities of international business growth.",
    portfolioActionLabel: (portfolioAction.label as string) ?? "View all stories ->",
    portfolioActionHref: (portfolioAction.href as string) ?? "/about",
    portfolioCards:
      rawPortfolioCards.length > 0
        ? rawPortfolioCards.map((card) => ({
            category: (card.category as string) ?? "",
            title: (card.title as string) ?? "",
            description: (card.description as string) ?? "",
            image: (card.image as string) ?? "",
            metrics: Array.isArray(card.metrics)
              ? (card.metrics as Record<string, unknown>[]).map((metric) => ({
                  value: (metric.value as string) ?? "",
                  label: (metric.label as string) ?? "",
                }))
              : [
                  { value: "", label: "" },
                  { value: "", label: "" },
                ],
          }))
        : [
            {
              category: "",
              title: "",
              description: "",
              image: "",
              metrics: [
                { value: "", label: "" },
                { value: "", label: "" },
              ],
            },
            {
              category: "",
              title: "",
              description: "",
              image: "",
              metrics: [
                { value: "", label: "" },
                { value: "", label: "" },
              ],
            },
          ],
    applicationTitle: (data.applicationTitle as string) ?? "Ready to Build Your Legacy?",
    applicationDescription:
      (data.applicationDescription as string) ??
      "We are looking for bold founders solving hard problems. Our next cohort application window is now open. Apply today and get access to the ecosystem you need to win.",
    applicationFields:
      rawApplicationFields.length > 0
        ? rawApplicationFields.map((field) => ({
            label: (field.label as string) ?? "",
            placeholder: (field.placeholder as string) ?? "",
          }))
        : [
            { label: "Full Name", placeholder: "Jane Doe" },
            { label: "Startup Name", placeholder: "Acme Inc." },
            { label: "Email Address", placeholder: "jane@startup.com" },
            {
              label: "Pitch Deck URL",
              placeholder: "https://dropbox.com/your-pitch-deck",
            },
          ],
    applicationSubmitLabel: (data.applicationSubmitLabel as string) ?? "Submit Application",
    applicationNote:
      (data.applicationNote as string) ??
      "Our team typically responds within 5-7 business days for initial screening.",
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    steps:
      rawSteps.length > 0
        ? rawSteps.map((step, index) => ({
            number: typeof step.number === "number" ? step.number : index + 1,
            title: (step.title as string) ?? "",
            description: (step.description as string) ?? "",
          }))
        : [
            { number: 1, title: "", description: "" },
            { number: 2, title: "", description: "" },
            { number: 3, title: "", description: "" },
          ],
    image: (data.image as string) ?? "",
    statValue: ((data.stat as Record<string, unknown>)?.value as string) ?? "",
    statLabel: ((data.stat as Record<string, unknown>)?.label as string) ?? "",
  };
}

export function IncubationSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIncubationDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IncubationFormValues>({ defaultValues });
  const image = useWatch({ control, name: "image" });
  const roadmapItems = useWatch({ control, name: "roadmapItems" });
  const portfolioCards = useWatch({ control, name: "portfolioCards" });

  function handleValid(values: IncubationFormValues) {
    const heroTitleLines = values.heroTitleLines
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    onSave({
      badge: values.badge,
      heroTitleLines,
      heroDescription: values.heroDescription,
      primaryAction: {
        label: values.primaryActionLabel,
        href: values.primaryActionHref,
      },
      secondaryAction: {
        label: values.secondaryActionLabel,
        href: values.secondaryActionHref,
      },
      roadmapTitle: values.roadmapTitle,
      roadmapSubtitle: values.roadmapSubtitle,
      roadmapItems: values.roadmapItems.map((item) => ({
        title: item.title,
        description: item.description,
        points: item.pointsLines
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        image: item.image,
      })),
      portfolioTitle: values.portfolioTitle,
      portfolioDescription: values.portfolioDescription,
      portfolioAction: {
        label: values.portfolioActionLabel,
        href: values.portfolioActionHref,
      },
      portfolioCards: values.portfolioCards.map((card) => ({
        category: card.category,
        title: card.title,
        description: card.description,
        image: card.image,
        metrics: card.metrics.map((metric) => ({
          value: metric.value,
          label: metric.label,
        })),
      })),
      applicationTitle: values.applicationTitle,
      applicationDescription: values.applicationDescription,
      applicationFields: (values.applicationFields ?? [])
        .filter(
          (field) =>
            Boolean(field) &&
            typeof field.label === "string" &&
            typeof field.placeholder === "string" &&
            field.label.trim().length > 0 &&
            field.placeholder.trim().length > 0,
        )
        .map((field) => ({
          label: field.label.trim(),
          placeholder: field.placeholder.trim(),
        })),
      applicationSubmitLabel: values.applicationSubmitLabel,
      applicationNote: values.applicationNote,
      title: values.title,
      description: values.description,
      steps: values.steps.map((step, index) => ({
        number: step.number ?? index + 1,
        title: step.title,
        description: step.description,
      })),
      image: values.image,
      stat: {
        value: values.statValue,
        label: values.statLabel,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Hero Badge
        <input {...register("badge")} placeholder="ONE WORLD BUSINESS SCHOOL & INCUBATION CENTRE FZE" />
      </label>

      <label>
        Hero title lines (one per line)
        <textarea rows={3} {...register("heroTitleLines", { required: "Hero title is required" })} />
      </label>

      <label>
        Hero description
        <textarea rows={3} {...register("heroDescription", { required: "Hero description is required" })} />
      </label>

      <div className="admin-section-group">
        <h4>Hero actions</h4>
        <label>
          Primary action label
          <input {...register("primaryActionLabel", { required: "Primary action label is required" })} />
        </label>
        <label>
          Primary action href
          <input {...register("primaryActionHref", { required: "Primary action href is required" })} />
        </label>
        <label>
          Secondary action label
          <input {...register("secondaryActionLabel", { required: "Secondary action label is required" })} />
        </label>
        <label>
          Secondary action href
          <input {...register("secondaryActionHref", { required: "Secondary action href is required" })} />
        </label>
      </div>

      <label>
        Roadmap heading
        <input {...register("roadmapTitle", { required: "Roadmap heading is required" })} />
      </label>

      <label>
        Roadmap subheading
        <input {...register("roadmapSubtitle", { required: "Roadmap subheading is required" })} />
      </label>

      <div className="admin-section-group">
        <h4>Roadmap items</h4>
        {roadmapItems?.map((_, index) => (
          <div key={index} className="admin-section-card">
            <label>
              Item title
              <input {...register(`roadmapItems.${index}.title` as const, { required: true })} />
            </label>
            <label>
              Item description
              <textarea rows={3} {...register(`roadmapItems.${index}.description` as const, { required: true })} />
            </label>
            <label>
              Bullet points (one per line)
              <textarea rows={3} {...register(`roadmapItems.${index}.pointsLines` as const)} />
            </label>
            <input type="hidden" {...register(`roadmapItems.${index}.image` as const, { required: true })} />
            <ImageUploadField
              label="Roadmap image URL"
              value={roadmapItems?.[index]?.image ?? ""}
              onChange={(value) =>
                setValue(`roadmapItems.${index}.image` as const, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/roadmap`}
            />
          </div>
        ))}
      </div>

      <label>
        Portfolio section title
        <input {...register("portfolioTitle", { required: "Portfolio title is required" })} />
      </label>

      <label>
        Portfolio section description
        <textarea rows={3} {...register("portfolioDescription", { required: "Portfolio description is required" })} />
      </label>

      <label>
        Portfolio action label
        <input {...register("portfolioActionLabel", { required: "Portfolio action label is required" })} />
      </label>

      <label>
        Portfolio action href
        <input {...register("portfolioActionHref", { required: "Portfolio action href is required" })} />
      </label>

      <div className="admin-section-group">
        <h4>Portfolio cards</h4>
        {portfolioCards?.map((_, cardIndex) => (
          <div key={cardIndex} className="admin-section-card">
            <label>
              Card category
              <input {...register(`portfolioCards.${cardIndex}.category` as const, { required: true })} />
            </label>
            <label>
              Card title
              <input {...register(`portfolioCards.${cardIndex}.title` as const, { required: true })} />
            </label>
            <label>
              Card description
              <textarea rows={3} {...register(`portfolioCards.${cardIndex}.description` as const, { required: true })} />
            </label>
            <input type="hidden" {...register(`portfolioCards.${cardIndex}.image` as const)} />
            <ImageUploadField
              label="Card background image URL"
              value={portfolioCards?.[cardIndex]?.image ?? ""}
              onChange={(value) =>
                setValue(`portfolioCards.${cardIndex}.image` as const, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/portfolio`}
            />
            <label>
              Metric 1 value
              <input {...register(`portfolioCards.${cardIndex}.metrics.0.value` as const, { required: true })} />
            </label>
            <label>
              Metric 1 label
              <input {...register(`portfolioCards.${cardIndex}.metrics.0.label` as const, { required: true })} />
            </label>
            <label>
              Metric 2 value
              <input {...register(`portfolioCards.${cardIndex}.metrics.1.value` as const, { required: true })} />
            </label>
            <label>
              Metric 2 label
              <input {...register(`portfolioCards.${cardIndex}.metrics.1.label` as const, { required: true })} />
            </label>
          </div>
        ))}
      </div>

      <div className="admin-section-group">
        <h4>Application block</h4>
        <label>
          Block title
          <input {...register("applicationTitle", { required: "Application title is required" })} />
        </label>
        <label>
          Block description
          <textarea
            rows={3}
            {...register("applicationDescription", {
              required: "Application description is required",
            })}
          />
        </label>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="admin-section-card">
            <label>
              Field {index + 1} label
              <input
                {...register(`applicationFields.${index}.label` as const, {
                  required: "Field label is required",
                })}
              />
            </label>
            <label>
              Field {index + 1} placeholder
              <input
                {...register(`applicationFields.${index}.placeholder` as const, {
                  required: "Field placeholder is required",
                })}
              />
            </label>
          </div>
        ))}
        <label>
          Submit button label
          <input
            {...register("applicationSubmitLabel", {
              required: "Submit button label is required",
            })}
          />
        </label>
        <label>
          Bottom note
          <input {...register("applicationNote", { required: "Bottom note is required" })} />
        </label>
      </div>

      <label>
        Title
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="From Idea to Global Scale"
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", {
            required: "Description is required",
          })}
          placeholder="Our Incubation Centre provides more than just desk space..."
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <input
        type="hidden"
        {...register("image", { required: "Image is required" })}
      />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) =>
          setValue("image", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image ? (
        <p className="admin-field-error">{errors.image.message}</p>
      ) : null}

      <label>
        Stat value
        <input
          {...register("statValue", { required: "Stat value is required" })}
          placeholder="50+"
        />
        {errors.statValue ? (
          <p className="admin-field-error">{errors.statValue.message}</p>
        ) : null}
      </label>

      <label>
        Stat label
        <input
          {...register("statLabel", { required: "Stat label is required" })}
          placeholder="Startups Accelerated"
        />
        {errors.statLabel ? (
          <p className="admin-field-error">{errors.statLabel.message}</p>
        ) : null}
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type GlobalStandardsPillarFormValue = {
  title: string;
  description: string;
};

type GlobalStandardsFormValues = {
  title: string;
  description: string;
  pillars: GlobalStandardsPillarFormValue[];
};

function toGlobalStandardsDefaultValues(
  data: Record<string, unknown>,
): GlobalStandardsFormValues {
  const rawPillars = Array.isArray(data.pillars) ? (data.pillars as any[]) : [];
  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    pillars:
      rawPillars.length > 0
        ? rawPillars.map((pillar) => ({
            title: (pillar.title as string) ?? "",
            description: (pillar.description as string) ?? "",
          }))
        : [
            { title: "Global Faculty", description: "" },
            { title: "Innovation Hub", description: "" },
            { title: "VC Network", description: "" },
          ],
  };
}

export function GlobalStandardsSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toGlobalStandardsDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GlobalStandardsFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "pillars" });

  function handleValid(values: GlobalStandardsFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      pillars: values.pillars.map((pillar) => ({
        title: pillar.title,
        description: pillar.description,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input
          {...register("title", { required: "Title is required" })}
          placeholder="Setting Global Standards"
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", {
            required: "Description is required",
          })}
          placeholder="We combine academic rigour with real-world venture expertise to deliver unmatched value."
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Pillars</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Pillar title
              <input
                {...register(`pillars.${index}.title` as const, {
                  required: "Pillar title is required",
                })}
                placeholder={field.title || `Pillar ${index + 1}`}
              />
            </label>

            <label>
              Pillar description
              <textarea
                rows={3}
                {...register(`pillars.${index}.description` as const, {
                  required: "Pillar description is required",
                })}
              />
            </label>
            <button type="button" onClick={() => remove(index)}>
              Remove pillar
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ title: "", description: "" })}
        >
          Add pillar
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ContactOfficeItemFormValue = {
  title: string;
  linesText: string;
  icon: string;
};

type ContactDepartmentFormValue = {
  title: string;
  subtitle: string;
  email: string;
};

type IndustriesHeroFormValues = {
  badge: string;
  titleLines: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

function toIndustriesHeroDefaultValues(
  data: Record<string, unknown>,
): IndustriesHeroFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    badge: (data.badge as string) ?? "",
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    primaryLabel: (primaryAction.label as string) ?? "",
    primaryHref: (primaryAction.href as string) ?? "",
    secondaryLabel: (secondaryAction.label as string) ?? "",
    secondaryHref: (secondaryAction.href as string) ?? "",
  };
}
type ServicesHeroFormValues = {
  titleLines: string;
  description: string;
  backgroundImage: string;
};
function toServicesHeroDefaultValues(
  data: Record<string, unknown>,
): ServicesHeroFormValues {
  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    backgroundImage: (data.backgroundImage as string) ?? "",
  };
}
export function ServicesHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesHeroFormValues>({ defaultValues });
  const backgroundImage = useWatch({ control, name: "backgroundImage" });

  function handleValid(values: ServicesHeroFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      backgroundImage: values.backgroundImage,
    });
  }
  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      {/* <label>
        Supporting stat
        <input {...register("stat", { required: "Stat is required" })} />
        {errors.stat ? (
          <p className="admin-field-error">{errors.stat.message}</p>
        ) : null}
      </label> */}

      <input
        type="hidden"
        {...register("backgroundImage", {
          required: "Background image is required",
        })}
      />
      <ImageUploadField
        label="Background image URL"
        value={backgroundImage}
        onChange={(value) =>
          setValue("backgroundImage", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        folder={`sections/${section.type}`}
      />
      {errors.backgroundImage ? (
        <p className="admin-field-error">{errors.backgroundImage.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

export function IndustriesHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIndustriesHeroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesHeroFormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: IndustriesHeroFormValues) {
    onSave({
      badge: values.badge,
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Badge
        <input {...register("badge", { required: "Badge is required" })} />
        {errors.badge ? (
          <p className="admin-field-error">{errors.badge.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", {
            required: "At least one title line is required",
          })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryLabel", {
              required: "Primary label is required",
            })}
          />
          {errors.primaryLabel ? (
            <p className="admin-field-error">{errors.primaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryHref", {
              required: "Primary href is required",
            })}
          />
          {errors.primaryHref ? (
            <p className="admin-field-error">{errors.primaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <div>
        <h4>Secondary action</h4>
        <label>
          Label
          <input
            {...register("secondaryLabel", {
              
            })}
          />
          {errors.secondaryLabel ? (
            <p className="admin-field-error">{errors.secondaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("secondaryHref", {
              
            })}
          />
          {errors.secondaryHref ? (
            <p className="admin-field-error">{errors.secondaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IndustriesGridItemFormValue = {
  icon: string;
  title: string;
  description: string;
};

type IndustriesGridFormValues = {
  title: string;
  description: string;
  items: IndustriesGridItemFormValue[];
  partnerTitle: string;
  partnerDescription: string;
  partnerHref: string;
};

function toIndustriesGridDefaultValues(
  data: Record<string, unknown>,
): IndustriesGridFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];
  const partnerCard = ((data.partnerCard as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            icon: (item.icon as string) ?? "SquareCode",
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
          }))
        : [
            {
              icon: "SquareCode",
              title: "",
              description: "",
            },
          ],
    partnerTitle: (partnerCard.title as string) ?? "",
    partnerDescription: (partnerCard.description as string) ?? "",
    partnerHref: (partnerCard.href as string) ?? "/contact",
  };
}

export function IndustriesGridSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIndustriesGridDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesGridFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: IndustriesGridFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      items: values.items.map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.description,
      })),
      partnerCard: {
        title: values.partnerTitle,
        description: values.partnerDescription,
        href: values.partnerHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Section title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Section description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Industry cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Icon
              <Controller
                control={control}
                name={`items.${index}.icon`}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                {...register(`items.${index}.description`, { required: true })}
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({ icon: "SquareCode", title: "", description: "" })
          }
        >
          Add card
        </button>
      </div>

      <div>
        <h4>Partner card</h4>
        <label>
          Title
          <input
            {...register("partnerTitle", {
              required: "Partner title is required",
            })}
          />
          {errors.partnerTitle ? (
            <p className="admin-field-error">{errors.partnerTitle.message}</p>
          ) : null}
        </label>
        <label>
          Description
          <textarea
            rows={3}
            {...register("partnerDescription", {
              required: "Partner description is required",
            })}
          />
          {errors.partnerDescription ? (
            <p className="admin-field-error">
              {errors.partnerDescription.message}
            </p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("partnerHref", {
              required: "Partner href is required",
            })}
          />
          {errors.partnerHref ? (
            <p className="admin-field-error">{errors.partnerHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type IndustriesCtaFormValues = {
  titleLines: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

type ServicesCtaFormValues = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

function toServicesCtaDefaultValues(
  data: Record<string, unknown>,
): ServicesCtaFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    primaryLabel: (primaryAction.label as string) ?? "",
    primaryHref: (primaryAction.href as string) ?? "",
    secondaryLabel: (secondaryAction.label as string) ?? "",
    secondaryHref: (secondaryAction.href as string) ?? "",
  };
}

export function ServicesCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toServicesCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServicesCtaFormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: ServicesCtaFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryLabel", {
              required: "Primary label is required",
            })}
          />
          {errors.primaryLabel ? (
            <p className="admin-field-error">{errors.primaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryHref", {
              required: "Primary href is required",
            })}
          />
          {errors.primaryHref ? (
            <p className="admin-field-error">{errors.primaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <div>
        <h4>Secondary action</h4>
        <label>
          Label
          <input
            {...register("secondaryLabel", {
              
            })}
          />
          {errors.secondaryLabel ? (
            <p className="admin-field-error">{errors.secondaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("secondaryHref", {
              
            })}
          />
          {errors.secondaryHref ? (
            <p className="admin-field-error">{errors.secondaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

function toIndustriesCtaDefaultValues(
  data: Record<string, unknown>,
): IndustriesCtaFormValues {
  const primaryAction = ((data.primaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;
  const secondaryAction = ((data.secondaryAction as Record<string, unknown>) ??
    {}) as Record<string, unknown>;

  return {
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    primaryLabel: (primaryAction.label as string) ?? "",
    primaryHref: (primaryAction.href as string) ?? "",
    secondaryLabel: (secondaryAction.label as string) ?? "",
    secondaryHref: (secondaryAction.href as string) ?? "",
  };
}

export function IndustriesCtaSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toIndustriesCtaDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IndustriesCtaFormValues>({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  function handleValid(values: IndustriesCtaFormValues) {
    onSave({
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title lines (one per line)
        <textarea
          rows={3}
          {...register("titleLines", {
            required: "At least one title line is required",
          })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Primary action</h4>
        <label>
          Label
          <input
            {...register("primaryLabel", {
              required: "Primary label is required",
            })}
          />
          {errors.primaryLabel ? (
            <p className="admin-field-error">{errors.primaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("primaryHref", {
              required: "Primary href is required",
            })}
          />
          {errors.primaryHref ? (
            <p className="admin-field-error">{errors.primaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <div>
        <h4>Secondary action</h4>
        <label>
          Label
          <input
            {...register("secondaryLabel", {
              
            })}
          />
          {errors.secondaryLabel ? (
            <p className="admin-field-error">{errors.secondaryLabel.message}</p>
          ) : null}
        </label>
        <label>
          Href
          <input
            {...register("secondaryHref", {
              
            })}
          />
          {errors.secondaryHref ? (
            <p className="admin-field-error">{errors.secondaryHref.message}</p>
          ) : null}
        </label>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ContactInquiryFormValues = {
  formTitle: string;
  formDescription: string;
  submitLabel: string;
  inquiryOptionsText: string;
  officeHeading: string;
  officeItems: ContactOfficeItemFormValue[];
  departmentContacts: ContactDepartmentFormValue[];
  departmentHeading: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  companyLabel: string;
  companyPlaceholder: string;
  workEmailLabel: string;
  workEmailPlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  interestLabel: string;
  interestPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  disclaimerText: string;
  successMessage: string;
  errorMessage: string;
  mapImage: string;
  mapLabelTitle: string;
  mapLabelSubtitle: string;
};

function toContactInquiryDefaultValues(
  data: Record<string, unknown>,
): ContactInquiryFormValues {
  const rawItems = Array.isArray(data.officeItems)
    ? (data.officeItems as Record<string, unknown>[])
    : [];
  const rawDepartments = Array.isArray(data.departmentContacts)
    ? (data.departmentContacts as Record<string, unknown>[])
    : [];
  const formFields = (data.formFields as Record<string, unknown>) ?? {};

  return {
    formTitle: (data.formTitle as string) ?? "",
    formDescription: (data.formDescription as string) ?? "",
    submitLabel: (data.submitLabel as string) ?? "",
    inquiryOptionsText: Array.isArray(data.inquiryOptions)
      ? (data.inquiryOptions as string[]).join("\n")
      : "",
    officeHeading: (data.officeHeading as string) ?? "",
    officeItems:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            title: (item.title as string) ?? "",
            linesText: Array.isArray(item.lines)
              ? (item.lines as string[]).join("\n")
              : "",
            icon: (item.icon as string) ?? "",
          }))
        : [{ title: "", linesText: "", icon: "location" }],
    departmentContacts:
      rawDepartments.length > 0
        ? rawDepartments.map((item) => ({
            title: (item.title as string) ?? "",
            subtitle: (item.subtitle as string) ?? "",
            email: (item.email as string) ?? "",
          }))
        : [
            { title: "", subtitle: "", email: "" },
            { title: "", subtitle: "", email: "" },
            { title: "", subtitle: "", email: "" },
          ],
    departmentHeading: (formFields.departmentHeading as string) ?? "Departmental Contacts",
    fullNameLabel: (formFields.fullNameLabel as string) ?? "Full Name",
    fullNamePlaceholder: (formFields.fullNamePlaceholder as string) ?? "John Doe",
    companyLabel: (formFields.companyLabel as string) ?? "Organization / Company",
    companyPlaceholder: (formFields.companyPlaceholder as string) ?? "One World Group",
    workEmailLabel: (formFields.workEmailLabel as string) ?? "Work Email",
    workEmailPlaceholder: (formFields.workEmailPlaceholder as string) ?? "name@company.com",
    phoneLabel: (formFields.phoneLabel as string) ?? "Phone Number",
    phonePlaceholder: (formFields.phonePlaceholder as string) ?? "+971",
    interestLabel: (formFields.interestLabel as string) ?? "Primary Interest",
    interestPlaceholder: (formFields.interestPlaceholder as string) ?? "Select a service",
    messageLabel: (formFields.messageLabel as string) ?? "Your Message",
    messagePlaceholder:
      (formFields.messagePlaceholder as string) ?? "How can we help you?",
    disclaimerText:
      (formFields.disclaimerText as string) ??
      "By submitting this form, you agree to our privacy policy and data handling terms.",
    successMessage:
      (formFields.successMessage as string) ??
      "Thank you — our consultants will be in touch shortly.",
    errorMessage: (formFields.errorMessage as string) ?? "Network error",
    mapImage: (data.mapImage as string) ?? "",
    mapLabelTitle: (data.mapLabelTitle as string) ?? "",
    mapLabelSubtitle: (data.mapLabelSubtitle as string) ?? "",
  };
}

export function ContactInquirySectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toContactInquiryDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInquiryFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "officeItems",
  });
  const {
    fields: departmentFields,
    append: appendDepartment,
    remove: removeDepartment,
  } = useFieldArray({
    control,
    name: "departmentContacts",
  });
  const mapImage = useWatch({ control, name: "mapImage" });

  function handleValid(values: ContactInquiryFormValues) {
    onSave({
      formTitle: values.formTitle,
      formDescription: values.formDescription,
      submitLabel: values.submitLabel,
      inquiryOptions: values.inquiryOptionsText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      officeHeading: values.officeHeading,
      officeItems: values.officeItems.map((item) => ({
        title: item.title,
        lines: item.linesText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        icon: item.icon,
      })),
      departmentContacts: values.departmentContacts
        .map((item) => ({
          title: item.title.trim(),
          subtitle: item.subtitle.trim(),
          email: item.email.trim(),
        }))
        .filter((item) => item.title && item.subtitle && item.email),
      formFields: {
        departmentHeading: values.departmentHeading.trim(),
        fullNameLabel: values.fullNameLabel.trim(),
        fullNamePlaceholder: values.fullNamePlaceholder.trim(),
        companyLabel: values.companyLabel.trim(),
        companyPlaceholder: values.companyPlaceholder.trim(),
        workEmailLabel: values.workEmailLabel.trim(),
        workEmailPlaceholder: values.workEmailPlaceholder.trim(),
        phoneLabel: values.phoneLabel.trim(),
        phonePlaceholder: values.phonePlaceholder.trim(),
        interestLabel: values.interestLabel.trim(),
        interestPlaceholder: values.interestPlaceholder.trim(),
        messageLabel: values.messageLabel.trim(),
        messagePlaceholder: values.messagePlaceholder.trim(),
        disclaimerText: values.disclaimerText.trim(),
        successMessage: values.successMessage.trim(),
        errorMessage: values.errorMessage.trim(),
      },
      mapImage: values.mapImage,
      mapLabelTitle: values.mapLabelTitle,
      mapLabelSubtitle: values.mapLabelSubtitle,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Form title
        <input
          {...register("formTitle", { required: "Form title is required" })}
        />
        {errors.formTitle ? (
          <p className="admin-field-error">{errors.formTitle.message}</p>
        ) : null}
      </label>

      <label>
        Form description
        <textarea
          rows={3}
          {...register("formDescription", {
            required: "Description is required",
          })}
        />
        {errors.formDescription ? (
          <p className="admin-field-error">{errors.formDescription.message}</p>
        ) : null}
      </label>

      <label>
        Submit label
        <input
          {...register("submitLabel", { required: "Submit label is required" })}
        />
        {errors.submitLabel ? (
          <p className="admin-field-error">{errors.submitLabel.message}</p>
        ) : null}
      </label>

      <label>
        Inquiry options (one per line)
        <textarea
          rows={5}
          {...register("inquiryOptionsText", {
            required: "At least one option is required",
          })}
        />
        {errors.inquiryOptionsText ? (
          <p className="admin-field-error">
            {errors.inquiryOptionsText.message}
          </p>
        ) : null}
      </label>

      <label>
        Office section heading
        <input
          {...register("officeHeading", { required: "Heading is required" })}
        />
        {errors.officeHeading ? (
          <p className="admin-field-error">{errors.officeHeading.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Office details</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Title
              <input
                {...register(`officeItems.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Lines (one per line)
              <textarea
                rows={4}
                {...register(`officeItems.${index}.linesText`, {
                  required: true,
                })}
              />
            </label>
            <label>
              choose an Icon
              <Controller
                control={control}
                name={`officeItems.${index}.icon`}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove item
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => append({ title: "", linesText: "", icon: "location" })}
        >
          Add office item
        </button>
      </div>

      <div>
        <h4>Departmental contacts</h4>
        {departmentFields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Department name
              <input
                {...register(`departmentContacts.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Subtitle
              <input
                {...register(`departmentContacts.${index}.subtitle`, { required: true })}
              />
            </label>
            <label>
              Email
              <input
                {...register(`departmentContacts.${index}.email`, { required: true })}
              />
            </label>
            <button
              type="button"
              onClick={() => removeDepartment(index)}
              disabled={departmentFields.length === 1}
            >
              Remove department
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() => appendDepartment({ title: "", subtitle: "", email: "" })}
        >
          Add department
        </button>
      </div>

      <div className="admin-section-group">
        <h4>Form field labels and placeholders</h4>
        <label>Department section heading<input {...register("departmentHeading", { required: true })} /></label>
        <label>Full name label<input {...register("fullNameLabel", { required: true })} /></label>
        <label>Full name placeholder<input {...register("fullNamePlaceholder", { required: true })} /></label>
        <label>Company label<input {...register("companyLabel", { required: true })} /></label>
        <label>Company placeholder<input {...register("companyPlaceholder", { required: true })} /></label>
        <label>Work email label<input {...register("workEmailLabel", { required: true })} /></label>
        <label>Work email placeholder<input {...register("workEmailPlaceholder", { required: true })} /></label>
        <label>Phone label<input {...register("phoneLabel", { required: true })} /></label>
        <label>Phone placeholder<input {...register("phonePlaceholder", { required: true })} /></label>
        <label>Primary interest label<input {...register("interestLabel", { required: true })} /></label>
        <label>Primary interest placeholder<input {...register("interestPlaceholder", { required: true })} /></label>
        <label>Message label<input {...register("messageLabel", { required: true })} /></label>
        <label>Message placeholder<input {...register("messagePlaceholder", { required: true })} /></label>
        <label>Disclaimer text<textarea rows={3} {...register("disclaimerText", { required: true })} /></label>
        <label>Success message<input {...register("successMessage", { required: true })} /></label>
        <label>Error message<input {...register("errorMessage", { required: true })} /></label>
      </div>

      <input
        type="hidden"
        {...register("mapImage", { required: "Map image is required" })}
      />
      <ImageUploadField
        label="Map image URL"
        value={mapImage}
        onChange={(value) =>
          setValue("mapImage", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        folder={`sections/${section.type}`}
      />
      {errors.mapImage ? (
        <p className="admin-field-error">{errors.mapImage.message}</p>
      ) : null}

      <label>
        Map label title
        <input
          {...register("mapLabelTitle", {
            required: "Map label title is required",
          })}
        />
        {errors.mapLabelTitle ? (
          <p className="admin-field-error">{errors.mapLabelTitle.message}</p>
        ) : null}
      </label>

      <label>
        Map label subtitle
        <input
          {...register("mapLabelSubtitle", {
            required: "Map label subtitle is required",
          })}
        />
        {errors.mapLabelSubtitle ? (
          <p className="admin-field-error">{errors.mapLabelSubtitle.message}</p>
        ) : null}
      </label>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutHeroFormValues = {
  titleAccent: string;
  titleMain: string;
  description: string;
  backgroundImage: string;
};

function toAboutHeroDefaultValues(
  data: Record<string, unknown>,
): AboutHeroFormValues {
  return {
    titleAccent: (data.titleAccent as string) ?? "",
    titleMain: (data.titleMain as string) ?? "",
    description: (data.description as string) ?? "",
    backgroundImage: (data.backgroundImage as string) ?? "",
  };
}

export function AboutHeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutHeroDefaultValues(section.data),
    [section.data],
  );

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutHeroFormValues>({ defaultValues });

  const backgroundImage = useWatch({ control, name: "backgroundImage" });

  function handleValid(values: AboutHeroFormValues) {
    onSave({
      titleAccent: values.titleAccent,
      titleMain: values.titleMain,
      description: values.description,
      backgroundImage: values.backgroundImage,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      {/* Title Accent */}
      <label>
        Title Accent
        <input
          {...register("titleAccent", {
            required: "Title accent is required",
          })}
        />
        {errors.titleAccent ? (
          <p className="admin-field-error">{errors.titleAccent.message}</p>
        ) : null}
      </label>

      {/* Title Main */}
      <label>
        Title Main
        <input
          {...register("titleMain", {
            required: "Title main is required",
          })}
        />
        {errors.titleMain ? (
          <p className="admin-field-error">{errors.titleMain.message}</p>
        ) : null}
      </label>

      {/* Description */}
      <label>
        Description
        <textarea
          rows={4}
          {...register("description", {
            required: "Description is required",
          })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      {/* Background Image */}
      <input
        type="hidden"
        {...register("backgroundImage", {
          required: "Background image is required",
        })}
      />

      <ImageUploadField
        label="Background image URL"
        value={backgroundImage}
        onChange={(value) =>
          setValue("backgroundImage", value, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
        folder={`sections/${section.type}`}
      />

      {errors.backgroundImage ? (
        <p className="admin-field-error">
          {errors.backgroundImage.message}
        </p>
      ) : null}

      {/* Footer */}
      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutIntroFormValues = {
  eyebrow: string;
  title: string;
  description: string;
  subDescription: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  image1: string;
  image2: string;
};

function toAboutIntroDefaultValues(
  data: Record<string, unknown>,
): AboutIntroFormValues {
  const stats = Array.isArray(data.stats) ? (data.stats as Record<string, unknown>[]) : [];
  const images = Array.isArray(data.images) ? (data.images as string[]) : [];

  return {
    eyebrow: (data.eyebrow as string) ?? "",
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    subDescription: (data.subDescription as string) ?? "",
    stat1Value: (stats[0]?.value as string) ?? "",
    stat1Label: (stats[0]?.label as string) ?? "",
    stat2Value: (stats[1]?.value as string) ?? "",
    stat2Label: (stats[1]?.label as string) ?? "",
    image1: (images[0] as string) ?? "",
    image2: (images[1] as string) ?? "",
  };
}

type CoursesCatalogCourseFormValue = {
  badge: string;
  category: string;
  level: string;
  title: string;
  description: string;
  skillsLines: string;
  weeks: string;
  image: string;
};

type CoursesCatalogFormValues = {
  title: string;
  description: string;
  categoriesLines: string;
  levelsLines: string;
  durationsLines: string;
  courses: CoursesCatalogCourseFormValue[];
};

function toCoursesCatalogDefaultValues(
  data: Record<string, unknown>,
): CoursesCatalogFormValues {
  const rawCourses = Array.isArray(data.courses)
    ? (data.courses as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    description: (data.description as string) ?? "",
    categoriesLines: Array.isArray(data.categories)
      ? (data.categories as string[]).join("\n")
      : "",
    levelsLines: Array.isArray(data.levels)
      ? (data.levels as string[]).join("\n")
      : "",
    durationsLines: Array.isArray(data.durations)
      ? (data.durations as string[]).join("\n")
      : "",
    courses:
      rawCourses.length > 0
        ? rawCourses.map((course) => ({
            badge: (course.badge as string) ?? "",
            category: (course.category as string) ?? "",
            level: (course.level as string) ?? "",
            title: (course.title as string) ?? "",
            description: (course.description as string) ?? "",
            skillsLines: Array.isArray(course.skills)
              ? (course.skills as string[]).join("\n")
              : "",
            weeks: (course.weeks as string) ?? "",
            image: ((course.image as string) ?? (course.iconImage as string) ?? "").trim(),
          }))
        : [
            {
              badge: "",
              category: "",
              level: "",
              title: "",
              description: "",
              skillsLines: "",
              weeks: "",
              image: "",
            },
          ],
  };
}

export function CoursesCatalogSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toCoursesCatalogDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CoursesCatalogFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "courses" });
  const courses = watch("courses");

  function handleValid(values: CoursesCatalogFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      categories: values.categoriesLines
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      levels: values.levelsLines
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      durations: values.durationsLines
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      courses: values.courses.map((course) => ({
        badge: course.badge,
        category: course.category,
        level: course.level,
        title: course.title,
        description: course.description,
        skills: course.skillsLines
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean),
        weeks: course.weeks,
        image: course.image,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? <p className="admin-field-error">{errors.title.message}</p> : null}
      </label>

      <label>
        Description
        <textarea rows={3} {...register("description", { required: "Description is required" })} />
        {errors.description ? <p className="admin-field-error">{errors.description.message}</p> : null}
      </label>

      <label>
        Categories (one per line)
        <textarea rows={4} {...register("categoriesLines", { required: "Categories are required" })} />
      </label>

      <label>
        Levels (one per line)
        <textarea rows={4} {...register("levelsLines", { required: "Levels are required" })} />
      </label>

      <label>
        Durations (one per line)
        <textarea rows={4} {...register("durationsLines", { required: "Durations are required" })} />
      </label>

      <div className="admin-section-group">
        <h4>Course cards</h4>
        {fields.map((field, index) => (
          <div key={field.id} className="admin-section-card">
            <label>
              Badge
              <input {...register(`courses.${index}.badge`, { required: true })} />
            </label>
            <label>
              Category
              <input {...register(`courses.${index}.category`, { required: true })} />
            </label>
            <label>
              Level
              <input {...register(`courses.${index}.level`, { required: true })} />
            </label>
            <label>
              Title
              <input {...register(`courses.${index}.title`, { required: true })} />
            </label>
            <label>
              Description
              <textarea rows={3} {...register(`courses.${index}.description`, { required: true })} />
            </label>
            <label>
              Skills (one per line)
              <textarea rows={4} {...register(`courses.${index}.skillsLines`, { required: true })} />
            </label>
            <label>
              Weeks
              <input {...register(`courses.${index}.weeks`, { required: true })} />
            </label>
            <input type="hidden" {...register(`courses.${index}.image`, { required: true })} />
            <ImageUploadField
              label="Course image URL"
              value={courses?.[index]?.image ?? ""}
              onChange={(value) =>
                setValue(`courses.${index}.image`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/courses`}
            />
            <button type="button" onClick={() => remove(index)} disabled={fields.length === 1}>
              Remove course
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({
              badge: "",
              category: "",
              level: "",
              title: "",
              description: "",
              skillsLines: "",
              weeks: "",
              image: "",
            })
          }
        >
          Add course
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

export function AboutIntroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutIntroDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutIntroFormValues>({ defaultValues });
  const image1 = useWatch({ control, name: "image1" });
  const image2 = useWatch({ control, name: "image2" });

  function handleValid(values: AboutIntroFormValues) {
    onSave({
      eyebrow: values.eyebrow,
      title: values.title,
      description: values.description,
      subDescription: values.subDescription,
      stats: [
        { value: values.stat1Value, label: values.stat1Label },
        { value: values.stat2Value, label: values.stat2Label },
      ],
      images: [values.image1, values.image2],
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Eyebrow
        <input {...register("eyebrow", { required: "Eyebrow is required" })} />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        Title
        <input
          {...register("title", { required: "Title is required" })}
        />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={3}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Sub Description
        <textarea
          rows={4}
          {...register("subDescription", {
            required: "Sub description is required",
          })}
        />
        {errors.subDescription ? (
          <p className="admin-field-error">{errors.subDescription.message}</p>
        ) : null}
      </label>

      <label>
        Stat 1 Value
        <input {...register("stat1Value", { required: "Stat 1 value is required" })} />
        {errors.stat1Value ? (
          <p className="admin-field-error">{errors.stat1Value.message}</p>
        ) : null}
      </label>

      <label>
        Stat 1 Label
        <input {...register("stat1Label", { required: "Stat 1 label is required" })} />
        {errors.stat1Label ? (
          <p className="admin-field-error">{errors.stat1Label.message}</p>
        ) : null}
      </label>

      <label>
        Stat 2 Value
        <input {...register("stat2Value", { required: "Stat 2 value is required" })} />
        {errors.stat2Value ? (
          <p className="admin-field-error">{errors.stat2Value.message}</p>
        ) : null}
      </label>

      <label>
        Stat 2 Label
        <input {...register("stat2Label", { required: "Stat 2 label is required" })} />
        {errors.stat2Label ? (
          <p className="admin-field-error">{errors.stat2Label.message}</p>
        ) : null}
      </label>

      <input type="hidden" {...register("image1", { required: "Primary image is required" })} />
      <ImageUploadField
        label="Primary image URL"
        value={image1}
        onChange={(value) =>
          setValue("image1", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image1 ? (
        <p className="admin-field-error">{errors.image1.message}</p>
      ) : null}

      <input type="hidden" {...register("image2", { required: "Secondary image is required" })} />
      <ImageUploadField
        label="Secondary image URL"
        value={image2}
        onChange={(value) =>
          setValue("image2", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image2 ? (
        <p className="admin-field-error">{errors.image2.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutVisionMissionCardFormValue = {
  title: string;
  description: string;
  icon: string;
  iconImage: string;
  accentColor: string;
};

type AboutVisionMissionFormValues = {
  items: AboutVisionMissionCardFormValue[];
};

function toAboutVisionMissionDefaultValues(
  data: Record<string, unknown>,
): AboutVisionMissionFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : Array.isArray(data.cards)
      ? (data.cards as Record<string, unknown>[])
      : [];

  return {
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
            icon: (item.icon as string) ?? "",
            iconImage: (item.iconImage as string) ?? "",
            accentColor: (item.accentColor as string) ?? "#0b3d91",
          }))
        : [
            {
              title: "Our Mission",
              description: "",
              icon: "Zap",
              iconImage: "",
              accentColor: "#0b3d91",
            },
            {
              title: "Our Vision",
              description: "",
              icon: "Eye",
              iconImage: "",
              accentColor: "#c8a96a",
            },
          ],
  };
}

export function AboutVisionMissionSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutVisionMissionDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AboutVisionMissionFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });

  function handleValid(values: AboutVisionMissionFormValues) {
    onSave({
      items: values.items.map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon || undefined,
        iconImage: item.iconImage || undefined,
        accentColor: item.accentColor,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <div>
        <h4>Mission and Vision Cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Card Title
              <input
                {...register(`items.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Description
              <textarea
                rows={4}
                {...register(`items.${index}.description`, { required: true })}
              />
            </label>
            <label>
              Choose Icon
              <Controller
                control={control}
                name={`items.${index}.icon`}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            {/* <input type="hidden" {...register(`cards.${index}.iconImage`)} />
            <ImageUploadField
              label="Custom icon image URL"
              value={cards?.[index]?.iconImage ?? ""}
              onChange={(value) =>
                setValue(`cards.${index}.iconImage`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/icons`}
            /> */}
            <label>
              Accent color
              <input
                {...register(`items.${index}.accentColor`, { required: true })}
                placeholder="#0b3d91"
              />
            </label>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length <= 2}
            >
              Remove card
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          disabled={fields.length >= 2}
          onClick={() =>
            append({
              title: "",
              description: "",
              icon: "",
              iconImage: "",
              accentColor: "#0b3d91",
            })
          }
        >
          Add card
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutFrameworkPillarFormValue = {
  letter: string;
  title: string;
  description: string;
};

type AboutFrameworkFormValues = {
  title: string;
  description: string;
  pillars: AboutFrameworkPillarFormValue[];
};

function toAboutFrameworkDefaultValues(
  data: Record<string, unknown>,
): AboutFrameworkFormValues {
  const rawPillars = Array.isArray(data.pillars)
    ? (data.pillars as Record<string, unknown>[])
    : [];

  const fallbackPillars: AboutFrameworkPillarFormValue[] = [
    { letter: "O", title: "Operational Excellence", description: "" },
    { letter: "N", title: "Next-Gen Learning", description: "" },
    { letter: "E", title: "Entrepreneurial Growth", description: "" },
  ];

  return {
    title: (data.title as string) ?? "The O.N.E Framework",
    description: (data.description as string) ?? "",
    pillars:
      rawPillars.length > 0
        ? rawPillars.map((item) => ({
            letter: (item.letter as string) ?? "",
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
          }))
        : fallbackPillars,
  };
}

export function AboutFrameworkSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutFrameworkDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AboutFrameworkFormValues>({ defaultValues });
  const { fields } = useFieldArray({ control, name: "pillars" });

  function handleValid(values: AboutFrameworkFormValues) {
    onSave({
      title: values.title,
      description: values.description,
      pillars: values.pillars.map((pillar) => ({
        letter: pillar.letter.trim(),
        title: pillar.title.trim(),
        description: pillar.description.trim(),
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Framework Title
        <input {...register("title", { required: true })} />
      </label>

      <label>
        Framework Description
        <textarea rows={3} {...register("description", { required: true })} />
      </label>

      <div>
        <h4>Framework Pillars (O, N, E)</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Letter
              <input {...register(`pillars.${index}.letter`, { required: true })} />
            </label>
            <label>
              Title
              <input {...register(`pillars.${index}.title`, { required: true })} />
            </label>
            <label>
              Description
              <textarea
                rows={4}
                {...register(`pillars.${index}.description`, { required: true })}
              />
            </label>
          </div>
        ))}
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutAdvantageFormValues = {
  eyebrow: string;
  titleLines: string;
  description: string;
  pointsLines: string;
  image: string;
};

function toAboutAdvantageDefaultValues(
  data: Record<string, unknown>,
): AboutAdvantageFormValues {
  return {
    eyebrow: (data.eyebrow as string) ?? "",
    titleLines: Array.isArray(data.title)
      ? (data.title as string[]).join("\n")
      : "",
    description: (data.description as string) ?? "",
    pointsLines: Array.isArray(data.points)
      ? (data.points as string[]).join("\n")
      : "",
    image: (data.image as string) ?? "",
  };
}

export function AboutAdvantageSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutAdvantageDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutAdvantageFormValues>({ defaultValues });
  const image = useWatch({ control, name: "image" });

  function handleValid(values: AboutAdvantageFormValues) {
    onSave({
      eyebrow: values.eyebrow,
      title: values.titleLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      description: values.description,
      points: values.pointsLines
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      image: values.image,
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Eyebrow
        <input {...register("eyebrow", { required: "Eyebrow is required" })} />
        {errors.eyebrow ? (
          <p className="admin-field-error">{errors.eyebrow.message}</p>
        ) : null}
      </label>

      <label>
        Title lines (one per line)
        <textarea
          rows={4}
          {...register("titleLines", { required: "Title is required" })}
        />
        {errors.titleLines ? (
          <p className="admin-field-error">{errors.titleLines.message}</p>
        ) : null}
      </label>

      <label>
        Description
        <textarea
          rows={4}
          {...register("description", { required: "Description is required" })}
        />
        {errors.description ? (
          <p className="admin-field-error">{errors.description.message}</p>
        ) : null}
      </label>

      <label>
        Bullet points (one per line)
        <textarea
          rows={4}
          {...register("pointsLines", {
            required: "At least one point is required",
          })}
        />
        {errors.pointsLines ? (
          <p className="admin-field-error">{errors.pointsLines.message}</p>
        ) : null}
      </label>

      <input
        type="hidden"
        {...register("image", { required: "Image is required" })}
      />
      <ImageUploadField
        label="Image URL"
        value={image}
        onChange={(value) =>
          setValue("image", value, { shouldDirty: true, shouldValidate: true })
        }
        folder={`sections/${section.type}`}
      />
      {errors.image ? (
        <p className="admin-field-error">{errors.image.message}</p>
      ) : null}

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type AboutValueItemFormValue = {
  title: string;
  description: string;
  icon: string;
  iconImage: string;
};

type AboutValuesFormValues = {
  title: string;
  items: AboutValueItemFormValue[];
};

function toAboutValuesDefaultValues(
  data: Record<string, unknown>,
): AboutValuesFormValues {
  const rawItems = Array.isArray(data.items)
    ? (data.items as Record<string, unknown>[])
    : [];

  return {
    title: (data.title as string) ?? "",
    items:
      rawItems.length > 0
        ? rawItems.map((item) => ({
            title: (item.title as string) ?? "",
            description: (item.description as string) ?? "",
            icon: (item.icon as string) ?? "",
            iconImage: (item.iconImage as string) ?? "",
          }))
        : [{ title: "", description: "", icon: "", iconImage: "" }],
  };
}

export function AboutValuesSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(
    () => toAboutValuesDefaultValues(section.data),
    [section.data],
  );
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutValuesFormValues>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = useWatch({ control, name: "items" });

  function handleValid(values: AboutValuesFormValues) {
    onSave({
      title: values.title,
      items: values.items.map((item) => ({
        title: item.title,
        description: item.description,
        icon: item.icon || undefined,
        iconImage: item.iconImage || undefined,
      })),
    });
  }

  return (
    <SectionForm
      className="admin-form admin-section-form"
      onSubmit={handleSubmit(handleValid)}
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <SectionHeading section={section} />

      <label>
        Title
        <input {...register("title", { required: "Title is required" })} />
        {errors.title ? (
          <p className="admin-field-error">{errors.title.message}</p>
        ) : null}
      </label>

      <div>
        <h4>Value cards</h4>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: 16,
              padding: 16,
              border: "1px solid #e2e8f0",
              borderRadius: 12,
            }}
          >
            <label>
              Title
              <input
                {...register(`items.${index}.title`, { required: true })}
              />
            </label>
            <label>
              Description
              <textarea
                rows={3}
                {...register(`items.${index}.description`, { required: true })}
              />
            </label>
            <label>
              Icon
              <Controller
                name={`items.${index}.icon`}
                control={control}
                render={({ field }) => (
                  <IconPicker
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={(val) =>
                      field.onChange(typeof val === "string" ? val : "")
                    }
                  />
                )}
              />
            </label>
            {/* <input type="hidden" {...register(`items.${index}.iconImage`)} />
            <ImageUploadField
              label="Custom icon image URL"
              value={items?.[index]?.iconImage ?? ""}
              onChange={(value) =>
                setValue(`items.${index}.iconImage`, value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              folder={`sections/${section.type}/icons`}
            /> */}
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              Remove value
            </button>
          </div>
        ))}
        <button
          type="button"
          className="admin-button-secondary"
          onClick={() =>
            append({ title: "", description: "", icon: "", iconImage: "" })
          }
        >
          Add value
        </button>
      </div>

      <SectionSaveFooter
        isSubmitting={isSubmitting}
        message={saveMessage}
        messageTone={saveMessageTone}
        previewHref={previewHref}
      />
    </SectionForm>
  );
}

type ResearchHubFormValues = {
  heroBadge: string;
  heroTitleLines: string;
  heroDescription: string;
  heroPrimaryActionLabel: string;
  heroPrimaryActionHref: string;
  heroSecondaryActionLabel: string;
  heroSecondaryActionHref: string;
  heroImage: string;
  overviewTitle: string;
  overviewDescription: string;
  overviewPointsLines: string;
  overviewImage: string;
  pillarsTitle: string;
  pillar1Icon: string;
  pillar1Title: string;
  pillar1Description: string;
  pillar1Project: string;
  pillar2Icon: string;
  pillar2Title: string;
  pillar2Description: string;
  pillar2Project: string;
  pillar3Icon: string;
  pillar3Title: string;
  pillar3Description: string;
  pillar3Project: string;
  metric1Value: string;
  metric1Label: string;
  metric2Value: string;
  metric2Label: string;
  metric3Value: string;
  metric3Label: string;
  metric4Value: string;
  metric4Label: string;
  simulationTitle: string;
  simulationDescription: string;
  accuracyLabel: string;
  accuracyValue: string;
  velocityLabel: string;
  velocityValue: string;
  simulationImage: string;
};

function toResearchHubDefaultValues(data: Record<string, unknown>): ResearchHubFormValues {
  const primary = (data.heroPrimaryAction as Record<string, unknown>) ?? {};
  const secondary = (data.heroSecondaryAction as Record<string, unknown>) ?? {};
  const pillars = Array.isArray(data.pillars) ? (data.pillars as Record<string, unknown>[]) : [];
  const metrics = Array.isArray(data.metrics) ? (data.metrics as Record<string, unknown>[]) : [];
  const pillar1 = pillars[0] ?? {};
  const pillar2 = pillars[1] ?? {};
  const pillar3 = pillars[2] ?? {};
  const metric1 = metrics[0] ?? {};
  const metric2 = metrics[1] ?? {};
  const metric3 = metrics[2] ?? {};
  const metric4 = metrics[3] ?? {};
  return {
    heroBadge: (data.heroBadge as string) ?? "",
    heroTitleLines: Array.isArray(data.heroTitleLines) ? (data.heroTitleLines as string[]).join("\n") : "",
    heroDescription: (data.heroDescription as string) ?? "",
    heroPrimaryActionLabel: (primary.label as string) ?? "",
    heroPrimaryActionHref: (primary.href as string) ?? "",
    heroSecondaryActionLabel: (secondary.label as string) ?? "",
    heroSecondaryActionHref: (secondary.href as string) ?? "",
    heroImage: (data.heroImage as string) ?? "",
    overviewTitle: (data.overviewTitle as string) ?? "",
    overviewDescription: (data.overviewDescription as string) ?? "",
    overviewPointsLines: Array.isArray(data.overviewPoints) ? (data.overviewPoints as string[]).join("\n") : "",
    overviewImage: (data.overviewImage as string) ?? "",
    pillarsTitle: (data.pillarsTitle as string) ?? "",
    pillar1Icon: (pillar1.icon as string) ?? "",
    pillar1Title: (pillar1.title as string) ?? "",
    pillar1Description: (pillar1.description as string) ?? "",
    pillar1Project: (pillar1.project as string) ?? "",
    pillar2Icon: (pillar2.icon as string) ?? "",
    pillar2Title: (pillar2.title as string) ?? "",
    pillar2Description: (pillar2.description as string) ?? "",
    pillar2Project: (pillar2.project as string) ?? "",
    pillar3Icon: (pillar3.icon as string) ?? "",
    pillar3Title: (pillar3.title as string) ?? "",
    pillar3Description: (pillar3.description as string) ?? "",
    pillar3Project: (pillar3.project as string) ?? "",
    metric1Value: (metric1.value as string) ?? "",
    metric1Label: (metric1.label as string) ?? "",
    metric2Value: (metric2.value as string) ?? "",
    metric2Label: (metric2.label as string) ?? "",
    metric3Value: (metric3.value as string) ?? "",
    metric3Label: (metric3.label as string) ?? "",
    metric4Value: (metric4.value as string) ?? "",
    metric4Label: (metric4.label as string) ?? "",
    simulationTitle: (data.simulationTitle as string) ?? "",
    simulationDescription: (data.simulationDescription as string) ?? "",
    accuracyLabel: (data.accuracyLabel as string) ?? "",
    accuracyValue: (data.accuracyValue as string) ?? "",
    velocityLabel: (data.velocityLabel as string) ?? "",
    velocityValue: (data.velocityValue as string) ?? "",
    simulationImage: (data.simulationImage as string) ?? "",
  };
}

export function ResearchHubSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: SectionFormProps) {
  const defaultValues = useMemo(() => toResearchHubDefaultValues(section.data), [section.data]);
  const { register, control, setValue, handleSubmit, formState: { isSubmitting } } =
    useForm<ResearchHubFormValues>({ defaultValues });
  const heroImage = useWatch({ control, name: "heroImage" });
  const overviewImage = useWatch({ control, name: "overviewImage" });
  const simulationImage = useWatch({ control, name: "simulationImage" });

  function handleValid(values: ResearchHubFormValues) {
    onSave({
      heroBadge: values.heroBadge,
      heroTitleLines: values.heroTitleLines.split("\n").map((x) => x.trim()).filter(Boolean),
      heroDescription: values.heroDescription,
      heroPrimaryAction: { label: values.heroPrimaryActionLabel, href: values.heroPrimaryActionHref },
      heroSecondaryAction: { label: values.heroSecondaryActionLabel, href: values.heroSecondaryActionHref },
      heroImage: values.heroImage,
      overviewTitle: values.overviewTitle,
      overviewDescription: values.overviewDescription,
      overviewPoints: values.overviewPointsLines.split("\n").map((x) => x.trim()).filter(Boolean),
      overviewImage: values.overviewImage,
      pillarsTitle: values.pillarsTitle,
      pillars: [
        {
          icon: values.pillar1Icon,
          title: values.pillar1Title,
          description: values.pillar1Description,
          project: values.pillar1Project,
        },
        {
          icon: values.pillar2Icon,
          title: values.pillar2Title,
          description: values.pillar2Description,
          project: values.pillar2Project,
        },
        {
          icon: values.pillar3Icon,
          title: values.pillar3Title,
          description: values.pillar3Description,
          project: values.pillar3Project,
        },
      ],
      metrics: [
        { value: values.metric1Value, label: values.metric1Label },
        { value: values.metric2Value, label: values.metric2Label },
        { value: values.metric3Value, label: values.metric3Label },
        { value: values.metric4Value, label: values.metric4Label },
      ],
      simulationTitle: values.simulationTitle,
      simulationDescription: values.simulationDescription,
      accuracyLabel: values.accuracyLabel,
      accuracyValue: values.accuracyValue,
      velocityLabel: values.velocityLabel,
      velocityValue: values.velocityValue,
      simulationImage: values.simulationImage,
    });
  }

  return (
    <SectionForm className="admin-form admin-section-form" onSubmit={handleSubmit(handleValid)}>
      <SectionHeading section={section} />
      <label>Hero Badge<input {...register("heroBadge")} /></label>
      <label>Hero Title lines<textarea rows={3} {...register("heroTitleLines")} /></label>
      <label>Hero Description<textarea rows={3} {...register("heroDescription")} /></label>
      <label>Hero Primary Label<input {...register("heroPrimaryActionLabel")} /></label>
      <label>Hero Primary Href<input {...register("heroPrimaryActionHref")} /></label>
      <label>Hero Secondary Label<input {...register("heroSecondaryActionLabel")} /></label>
      <label>Hero Secondary Href<input {...register("heroSecondaryActionHref")} /></label>
      <input type="hidden" {...register("heroImage")} />
      <ImageUploadField label="Hero image URL" value={heroImage} onChange={(value) => setValue("heroImage", value)} folder={`sections/${section.type}`} />

      <label>Overview Title<input {...register("overviewTitle")} /></label>
      <label>Overview Description<textarea rows={3} {...register("overviewDescription")} /></label>
      <label>Overview Points (one per line)<textarea rows={4} {...register("overviewPointsLines")} /></label>
      <input type="hidden" {...register("overviewImage")} />
      <ImageUploadField label="Overview image URL" value={overviewImage} onChange={(value) => setValue("overviewImage", value)} folder={`sections/${section.type}`} />

      <label>Pillars Title<input {...register("pillarsTitle")} /></label>
      <div className="admin-section-group">
        <h4>Core Research Pillars</h4>
        <div className="admin-section-card">
          <h5>Pillar 1</h5>
          <label>Icon<input {...register("pillar1Icon")} placeholder="innovation" /></label>
          <label>Title<input {...register("pillar1Title")} /></label>
          <label>Description<textarea rows={3} {...register("pillar1Description")} /></label>
          <label>Project label<input {...register("pillar1Project")} /></label>
        </div>
        <div className="admin-section-card">
          <h5>Pillar 2</h5>
          <label>Icon<input {...register("pillar2Icon")} placeholder="vision" /></label>
          <label>Title<input {...register("pillar2Title")} /></label>
          <label>Description<textarea rows={3} {...register("pillar2Description")} /></label>
          <label>Project label<input {...register("pillar2Project")} /></label>
        </div>
        <div className="admin-section-card">
          <h5>Pillar 3</h5>
          <label>Icon<input {...register("pillar3Icon")} placeholder="compliance" /></label>
          <label>Title<input {...register("pillar3Title")} /></label>
          <label>Description<textarea rows={3} {...register("pillar3Description")} /></label>
          <label>Project label<input {...register("pillar3Project")} /></label>
        </div>
      </div>

      <div className="admin-section-group">
        <h4>Metrics strip</h4>
        <div className="admin-section-card">
          <h5>Metric 1</h5>
          <label>Value<input {...register("metric1Value")} placeholder="124+" /></label>
          <label>Label<input {...register("metric1Label")} placeholder="WHITE PAPERS" /></label>
        </div>
        <div className="admin-section-card">
          <h5>Metric 2</h5>
          <label>Value<input {...register("metric2Value")} placeholder="42" /></label>
          <label>Label<input {...register("metric2Label")} placeholder="PATENTS FILED" /></label>
        </div>
        <div className="admin-section-card">
          <h5>Metric 3</h5>
          <label>Value<input {...register("metric3Value")} placeholder="15" /></label>
          <label>Label<input {...register("metric3Label")} placeholder="GLOBAL LABS" /></label>
        </div>
        <div className="admin-section-card">
          <h5>Metric 4</h5>
          <label>Value<input {...register("metric4Value")} placeholder="$12M" /></label>
          <label>Label<input {...register("metric4Label")} placeholder="GRANT FUNDING" /></label>
        </div>
      </div>

      <label>Simulation Title<input {...register("simulationTitle")} /></label>
      <label>Simulation Description<textarea rows={3} {...register("simulationDescription")} /></label>
      <label>Accuracy Label<input {...register("accuracyLabel")} /></label>
      <label>Accuracy Value<input {...register("accuracyValue")} /></label>
      <label>Velocity Label<input {...register("velocityLabel")} /></label>
      <label>Velocity Value<input {...register("velocityValue")} /></label>
      <input type="hidden" {...register("simulationImage")} />
      <ImageUploadField label="Simulation image URL" value={simulationImage} onChange={(value) => setValue("simulationImage", value)} folder={`sections/${section.type}`} />

      <SectionSaveFooter isSubmitting={isSubmitting} message={saveMessage} messageTone={saveMessageTone} previewHref={previewHref} />
    </SectionForm>
  );
}
