/** Central tag naming for unstable_cache + revalidateTag */
export const cacheTags = {
  siteGlobal: "site-global",
  page: (slug: string) => `page:${slug}`,
  section: (sectionId: string) => `section:${sectionId}`,
} as const;
