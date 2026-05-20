"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import ImageUploadField from "@/components/admin/ImageUploadField";
import SectionSaveFooter from "@/components/admin/SectionSaveFooter";

type HeroFormValues = {
  badge: string;
  titleLines: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  backgroundImage: string;
};

type HeroSectionFormProps = {
  section: { id: string; type: string; order: number; data: Record<string, unknown> };
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
};

function toDefaultValues(data: Record<string, unknown>): HeroFormValues {
  const badge = (data.badge as string) ?? "";
  const title = Array.isArray(data.title) ? (data.title as string[]) : [];
  const description = (data.description as string) ?? "";
  const primary = (data.primaryAction as Record<string, unknown>) ?? {};
  const secondary = (data.secondaryAction as Record<string, unknown>) ?? {};
  const backgroundImage = (data.backgroundImage as string) ?? "";

  return {
    badge,
    titleLines: title.join("\n"),
    description,
    primaryLabel: (primary.label as string) ?? "",
    primaryHref: (primary.href as string) ?? "",
    secondaryLabel: (secondary.label as string) ?? "",
    secondaryHref: (secondary.href as string) ?? "",
    backgroundImage,
  };
}

export default function HeroSectionForm({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: HeroSectionFormProps) {
  const defaultValues = useMemo(() => toDefaultValues(section.data), [section.data]);

  const {
    register,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormValues>({
    defaultValues,
  });
  const backgroundImage = watch("backgroundImage");

  function handleValid(values: HeroFormValues) {
    const titleArray = values.titleLines
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload: Record<string, unknown> = {
      badge: values.badge,
      title: titleArray,
      description: values.description,
      primaryAction: {
        label: values.primaryLabel,
        href: values.primaryHref,
      },
      secondaryAction: {
        label: values.secondaryLabel,
        href: values.secondaryHref,
      },
      backgroundImage: values.backgroundImage,
    };

    onSave(payload);
  }

  function handleInvalid() {
    // We still allow submit (per requirements), backend will validate too.
  }

  return (
    <form
      className="admin-form hero-section-form"
      onSubmit={handleSubmit(handleValid, handleInvalid)}
      style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}
    >
      <h3>
        hero{" "}
        <span className="admin-muted" style={{ fontWeight: 400 }}>
          (order {section.order}, id {section.id})
        </span>
      </h3>

      <label>
        Badge (optional)
        <input
          {...register("badge")}
          placeholder="Optional small label above title"
        />
      </label>

      <label>
        Title lines (one per line, last line appears in accent color)
        <textarea
          rows={3}
          {...register("titleLines", { required: "At least one title line is required" })}
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

      <div className="hero-section-form__actions">
        <div>
          <h4>Primary action</h4>
          <label>
            Label
            <input
              {...register("primaryLabel", { required: "Primary label is required" })}
              placeholder="Explore Courses"
            />
            {errors.primaryLabel ? (
              <p className="admin-field-error">{errors.primaryLabel.message}</p>
            ) : null}
          </label>
          <label>
            Href
            <input
              {...register("primaryHref", { required: "Primary href is required" })}
              placeholder="/contact"
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
                required: "Secondary label is required",
              })}
              placeholder="Book Consultancy"
            />
            {errors.secondaryLabel ? (
              <p className="admin-field-error">{errors.secondaryLabel.message}</p>
            ) : null}
          </label>
          <label>
            Href
            <input
              {...register("secondaryHref", {
                required: "Secondary href is required",
              })}
              placeholder="/contact"
            />
            {errors.secondaryHref ? (
              <p className="admin-field-error">{errors.secondaryHref.message}</p>
            ) : null}
          </label>
        </div>
      </div>

      <input type="hidden" {...register("backgroundImage", { required: "Background image is required" })} />
      <ImageUploadField
        label="Background image URL"
        value={backgroundImage}
        onChange={(value) => setValue("backgroundImage", value, { shouldDirty: true, shouldValidate: true })}
        folder={`sections/${section.type}`}
        placeholder="/home/hero-bg.jpg"
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
    </form>
  );
}
