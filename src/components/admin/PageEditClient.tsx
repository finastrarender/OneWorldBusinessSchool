"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import HeroSectionForm from "@/components/admin/HeroSectionForm";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  AboutAdvantageSectionForm,
  AboutCtaSectionForm,
  AboutHeroSectionForm,
  AboutFrameworkSectionForm,
  AboutIntroSectionForm,
  AboutValuesSectionForm,
  AboutVisionMissionSectionForm,
  ClientLogosSectionForm,
  ContactSectionForm,
  CoursesCatalogSectionForm,
  ContactHeroSectionForm,
  ContactInquirySectionForm,
  CtaSectionForm,
  GlobalStandardsSectionForm,
  HomeIncubationHighlightSectionForm,
  IncubationSectionForm,
  IntroSectionForm,
  IndustriesCtaSectionForm,
  IndustriesGridSectionForm,
  IndustriesHeroSectionForm,
  InvestmentSectionForm,
  ServicesSectionForm,
  ServicesAccordionSectionForm,
  ServicesGridSectionForm,
  ServicesCtaSectionForm,
  ResearchHubSectionForm,
  WhyChooseSectionForm,
  ServicesHeroSectionForm,
} from "@/components/admin/SectionForms";

type SectionRow = { id: string; type: string; order: number; data: Record<string, unknown> };
type SectionSaveState = {
  sectionId: string;
  message: string;
  tone: "success" | "error";
} | null;

function normalizeSlugForPath(value: string | undefined | null) {
  return String(value ?? "")
    .trim()
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

function slugPathSegment(value: string | undefined | null) {
  return encodeURIComponent(normalizeSlugForPath(value));
}

function idPathSegment(value: string | undefined | null) {
  return encodeURIComponent(String(value ?? "").trim());
}

function normalizeSectionType(value: string) {
  const trimmed = String(value).trim();
  if (trimmed === "aboutIntro") return "aboutOverview";
  if (trimmed === "industrieshero") return "industriesHero";
  if (trimmed === "industriesgrid") return "industriesGrid";
  if (trimmed === "industriescta") return "industriesCta";
  if (trimmed === "servicesgrid") return "servicesGrid";
  if (trimmed === "servicesaccordion") return "servicesAccordion";
  if (trimmed === "servicescta") return "servicesCTA";
  return trimmed;
}

export default function PageEditClient({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<{
    slug: string;
    title: string;
    seoTitle?: string;
    seoDescription?: string;
    ogImage?: string;
    canonicalPath?: string;
    status: string;
    sections: SectionRow[];
  } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [sectionSaveState, setSectionSaveState] = useState<SectionSaveState>(null);
  const [publishing, setPublishing] = useState(false);

  async function parseJsonResponse(res: Response) {
    const contentType = res.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    const text = await res.text();
    return {
      error: {
        message: `HTTP ${res.status}: ${text.slice(0, 140) || "Non-JSON response"}`,
      },
    };
  }

  async function fetchWithFallback(
    paths: string[],
    init?: RequestInit,
  ): Promise<{ res: Response; json: any }> {
    let lastRes: Response | null = null;
    let lastJson: any = null;

    for (const path of paths) {
      const res = await fetch(path, init);
      const json = await parseJsonResponse(res);
      if (res.status !== 404) {
        return { res, json };
      }
      lastRes = res;
      lastJson = json;
    }

    return {
      res: lastRes ?? new Response(null, { status: 404 }),
      json: lastJson ?? { error: { message: "HTTP 404: Not Found" } },
    };
  }

  const reload = useCallback(async () => {
    const { res, json } = await fetchWithFallback([
      `/api/v1/admin/pages/${slugPathSegment(slug)}`,
      `/api/admin/pages/${slugPathSegment(slug)}`,
    ]);
    if (!res.ok) throw new Error(json?.error?.message ?? "Load failed");
    setPage(json.data);
  }, [slug]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await reload();
      } catch (e) {
        if (!cancelled) setMessage(e instanceof Error ? e.message : "Error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  async function saveMeta(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!page) return;
    setSectionSaveState(null);
    const fd = new FormData(e.currentTarget);
    const nextSlug = normalizeSlugForPath(String(fd.get("slug") ?? ""));
    const { res, json } = await fetchWithFallback(
      [
        `/api/v1/admin/pages/${slugPathSegment(slug)}`,
        `/api/admin/pages/${slugPathSegment(slug)}`,
      ],
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: nextSlug,
          title: fd.get("title"),
          seoTitle: fd.get("seoTitle") || undefined,
          seoDescription: fd.get("seoDescription") || undefined,
          ogImage: fd.get("ogImage") || undefined,
          canonicalPath: fd.get("canonicalPath") || undefined,
        }),
      },
    );
    if (!res.ok) {
      setMessage(json?.error?.message ?? "Save failed");
      return;
    }
    setPage(json.data);
    setMessage("Meta saved.");
    if (json.data.slug && json.data.slug !== slug) {
      router.replace(`/admin/pages/${json.data.slug}`);
    }
  }

  async function saveSection(section: SectionRow, data: Record<string, unknown>) {
    const targetSlug = normalizeSlugForPath(page?.slug ?? slug);
    const patchSection = async (sectionId: string) =>
      fetchWithFallback(
        [
          `/api/v1/admin/sections/${idPathSegment(sectionId)}`,
          `/api/v1/admin/pages/${slugPathSegment(targetSlug)}/sections/${idPathSegment(sectionId)}`,
          `/api/admin/pages/${slugPathSegment(targetSlug)}/sections/${idPathSegment(sectionId)}`,
        ],
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, type: section.type, order: section.order }),
        },
      );

    let { res, json } = await patchSection(section.id);

    if (!res.ok && res.status === 404) {
      await reload();
      const { res: latestRes, json: latestJson } = await fetchWithFallback([
        `/api/v1/admin/pages/${slugPathSegment(targetSlug)}`,
        `/api/admin/pages/${slugPathSegment(targetSlug)}`,
      ]);
      const latestPage = latestJson?.data as { sections?: SectionRow[] } | undefined;
      const targetType = normalizeSectionType(section.type);
      const replacement = latestPage?.sections?.find(
        (s) =>
          normalizeSectionType(s.type) === targetType &&
          (s.order === section.order || s.id === section.id),
      );
      if (replacement) {
        const retry = await patchSection(replacement.id);
        res = retry.res;
        json = retry.json;
      }
    }

    if (!res.ok) {
      setSectionSaveState({
        sectionId: section.id,
        message:
          json?.error?.message ??
          "Section save failed. Refresh this page once and try again.",
        tone: "error",
      });
      return;
    }
    setPage(json.data.page);
    setMessage(null);
    setSectionSaveState({
      sectionId: section.id,
      message: `Section ${section.type} saved.`,
      tone: "success",
    });
  }

  async function publish() {
    setPublishing(true);
    setMessage(null);
    setSectionSaveState(null);
    try {
      const targetSlug = normalizeSlugForPath(page?.slug ?? slug);
      const res = await fetch(`/api/v1/admin/pages/${slugPathSegment(targetSlug)}/publish`, {
        method: "POST",
      });
      const json = await parseJsonResponse(res);
      if (!res.ok) throw new Error(json?.error?.message ?? "Publish failed");
      setPage(json.data);
      setMessage("Published.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Publish error");
    } finally {
      setPublishing(false);
    }
  }

  if (loading) return <p className="admin-muted">Loading…</p>;
  if (!page) return <p className="contact-form__err">Page not found</p>;

  const currentSlug = page.slug;
  const currentSlugSegment = slugPathSegment(currentSlug);
  const sorted = [...page.sections].sort((a, b) => a.order - b.order);

  return (
    <div className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin">← Dashboard</Link>
        <div style={{ display: "flex", gap: 8 }}>
          <a
            href={`/api/v1/admin/pages/${currentSlugSegment}/preview`}
            target="_blank"
            rel="noreferrer"
            className="admin-button-secondary"
          >
            Preview draft
          </a>
          <button type="button" onClick={() => publish()} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish draft to live"}
          </button>
        </div>
      </nav>
      <div className="admin-card">
        <h1 style={{ marginTop: 0 }}>Edit page: {currentSlug}</h1>
        <p className="admin-muted">
          Status: <strong>{page.status}</strong>. Editing <strong>draft</strong> sections; visitors see
          published content until you publish.
        </p>
        {message ? <p className="contact-form__ok">{message}</p> : null}

        <form className="admin-form" onSubmit={saveMeta}>
          <h2>Page & SEO</h2>
          <label>
            Title
            <input name="title" key={page.title} defaultValue={page.title} required />
          </label>
          <label>
            SEO title
            <input name="seoTitle" key={page.seoTitle} defaultValue={page.seoTitle ?? ""} />
          </label>
          <label>
            SEO description
            <textarea
              name="seoDescription"
              key={page.seoDescription}
              defaultValue={page.seoDescription ?? ""}
              rows={3}
            />
          </label>
          <label>
            Slug (page url)
            <input
              name="slug"
              key={page.slug}
              defaultValue={page.slug}
              required
              disabled={page.slug === "home"}
              placeholder="about-us"
            />
          </label>
          {page.slug === "home" ? (
            <p className="admin-muted" style={{ margin: 0 }}>
              Home stays on the root route `/`.
            </p>
          ) : null}
          <ImageUploadField
            label="Open Graph image URL"
            name="ogImage"
            value={page.ogImage ?? ""}
            onChange={(value) =>
              setPage((current) => (current ? { ...current, ogImage: value } : current))
            }
            folder={`pages/${page.slug}/seo`}
          />
          <label>
            Canonical path
            <input
              name="canonicalPath"
              value={page.canonicalPath ?? ""}
              onChange={(e) =>
                setPage((current) =>
                  current ? { ...current, canonicalPath: e.target.value } : current,
                )
              }
              placeholder="https://example.com/about"
            />
          </label>
          <button type="submit">Save meta</button>
        </form>

        <h2>Sections (draft)</h2>
        {sorted.map((section) => (
          <SectionEditor
            key={section.id}
            section={section}
            onSave={(data) => saveSection(section, data)}
            previewHref={`/api/v1/admin/pages/${currentSlugSegment}/preview`}
            saveMessage={sectionSaveState?.sectionId === section.id ? sectionSaveState.message : null}
            saveMessageTone={sectionSaveState?.sectionId === section.id ? sectionSaveState.tone : "success"}
          />
        ))}
      </div>
    </div>
  );
}

function SectionEditor({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: {
  section: SectionRow;
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
}) {
  const normalizedType =
    String(section.type).trim() === "industrieshero"
      ? "industriesHero"
      : String(section.type).trim() === "industriesgrid"
        ? "industriesGrid"
        : String(section.type).trim() === "industriescta"
          ? "industriesCta"
        : String(section.type).trim() === "servicesgrid"
            ? "servicesGrid"
          : String(section.type).trim() === "servicesaccordion"
            ? "servicesAccordion"
          : String(section.type).trim() === "servicescta"
            ? "servicesCTA"
      : String(section.type).trim();

  switch (normalizedType) {
    case "hero":
      return (
        <HeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "intro":
      return (
        <IntroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "services":
      return (
        <ServicesSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesGrid":
      return (
        <ServicesGridSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesCTA":
      return (
        <ServicesCtaSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "whyChoose":
      return (
        <WhyChooseSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "investment":
      return (
        <InvestmentSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "incubation":
      return (
        <IncubationSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "homeIncubationHighlight":
      return (
        <HomeIncubationHighlightSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "globalStandards":
      return (
        <GlobalStandardsSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "clientLogos":
      return (
        <ClientLogosSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "cta":
      return (
        <CtaSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "contact":
      return (
        <ContactSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "contactHero":
      return (
        <ContactHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "contactInquiry":
      return (
        <ContactInquirySectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutHero":
      return (
        <AboutHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutOverview":
      return (
        <AboutIntroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "coursesCatalog":
      return (
        <CoursesCatalogSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesAccordion":
      return (
        <ServicesAccordionSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutIntro":
      return (
        <AboutIntroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutVisionMission":
      return (
        <AboutVisionMissionSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutFramework":
      return (
        <AboutFrameworkSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutAdvantage":
      return (
        <AboutAdvantageSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutValues":
      return (
        <AboutValuesSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "aboutCTA":
      return (
        <AboutCtaSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "servicesHero":
      return (
        <ServicesHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "industriesHero":
      return (
        <IndustriesHeroSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "industriesGrid":
      return (
        <IndustriesGridSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "industriesCta":
      return (
        <IndustriesCtaSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    case "researchHub":
      return (
        <ResearchHubSectionForm
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
    default:
      return (
        <JsonSectionEditor
          section={section}
          onSave={onSave}
          previewHref={previewHref}
          saveMessage={saveMessage}
          saveMessageTone={saveMessageTone}
        />
      );
  }
}

function JsonSectionEditor({
  section,
  onSave,
  previewHref,
  saveMessage,
  saveMessageTone,
}: {
  section: SectionRow;
  onSave: (data: Record<string, unknown>) => void;
  previewHref: string;
  saveMessage?: string | null;
  saveMessageTone?: "success" | "error";
}) {
  const [text, setText] = useState(JSON.stringify(section.data, null, 2));

  return (
    <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid #e2e8f0" }}>
      <h3>
        {section.type}{" "}
        <span className="admin-muted" style={{ fontWeight: 400 }}>
          (order {section.order}, id {section.id})
        </span>
      </h3>
      <label>
        Section data (JSON)
        <textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <div style={{ display: "grid", gap: 12 }}>
        <button
          type="button"
          onClick={() => {
            try {
              onSave(JSON.parse(text));
            } catch {
              // Unknown section types keep a JSON fallback editor.
            }
          }}
        >
          Save section
        </button>
        <div style={{ display: "grid", gap: 8 }}>
          <a href={previewHref} target="_blank" rel="noreferrer" className="admin-button-secondary">
            Preview draft
          </a>
          {saveMessage ? (
            <p className={saveMessageTone === "error" ? "contact-form__err" : "contact-form__ok"} style={{ margin: 0 }}>
              {saveMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
