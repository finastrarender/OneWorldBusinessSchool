export function slugifySegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizePageSlug(value: string) {
  const normalized = slugifySegment(value);
  return normalized === "" ? "page" : normalized;
}

export function slugToHref(slug: string) {
  return slug === "home" ? "/" : `/${slug}`;
}
