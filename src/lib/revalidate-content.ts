import { revalidateTag } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import type { PageSection } from "@/types/section";

export function revalidateSiteGlobal() {
  revalidateTag(cacheTags.siteGlobal);
}

export function revalidatePage(slug: string, sections?: PageSection[]) {
  revalidateTag(cacheTags.page(slug));
  if (sections) {
    for (const s of sections) {
      revalidateTag(cacheTags.section(s.id));
    }
  }
}
