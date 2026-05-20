import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { connectMongo } from "@/lib/mongoose";
import Page from "@/models/Page";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }
  await connectMongo();
  const pages = await Page.find({}).sort({ slug: 1 }).lean();
  return jsonData(pages);
}
