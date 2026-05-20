import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { revalidateSiteGlobal } from "@/lib/revalidate-content";
import { connectMongo } from "@/lib/mongoose";
import { getSiteGlobalRaw } from "@/lib/content/site-global";
import SiteGlobal from "@/models/SiteGlobal";
import { siteGlobalPayloadSchema } from "@/schemas/sections";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  await connectMongo();
  const doc = await getSiteGlobalRaw();
  if (!doc) {
    return jsonError("not_found", "Site global not seeded", 404);
  }
  return jsonData(doc);
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("bad_request", "Invalid JSON", 400);
  }
  const parsed = siteGlobalPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", "Invalid payload", 422, parsed.error.flatten());
  }
  await connectMongo();
  const doc = await SiteGlobal.findOneAndUpdate(
    { key: "default" },
    {
      $set: {
        navItems: parsed.data.navItems,
        footerColumns: parsed.data.footerColumns,
        footerMeta: parsed.data.footerMeta,
        logoSrc: parsed.data.logoSrc,
        featureFlags: parsed.data.featureFlags ?? {},
        seoDefaults: parsed.data.seoDefaults,
        applyNowModal: parsed.data.applyNowModal,
      },
    },
    { new: true, upsert: true },
  ).lean();
  revalidateSiteGlobal();
  return jsonData(doc);
}
