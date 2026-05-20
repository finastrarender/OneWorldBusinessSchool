import { unstable_cache } from "next/cache";
import { cacheTags } from "@/lib/cache-tags";
import { connectMongo } from "@/lib/mongoose";
import SiteGlobal from "@/models/SiteGlobal";

async function fetchSiteGlobal() {
  await connectMongo();
  return SiteGlobal.findOne({ key: "default" }).lean();
}

export function getSiteGlobalCached() {
  return unstable_cache(fetchSiteGlobal, ["site-global-doc"], {
    tags: [cacheTags.siteGlobal],
  })();
}

/** Uncached read (admin, seed checks) */
export async function getSiteGlobalRaw() {
  await connectMongo();
  return SiteGlobal.findOne({ key: "default" }).lean();
}
