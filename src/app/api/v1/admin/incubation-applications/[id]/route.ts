import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { connectMongo } from "@/lib/mongoose";
import IncubationApplication from "@/models/IncubationApplication";
import mongoose from "mongoose";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonError("unauthorized", "Sign in required", 401);
  }

  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return jsonError("bad_request", "Invalid application id", 400);
  }

  await connectMongo();
  const deleted = await IncubationApplication.findByIdAndDelete(id);
  if (!deleted) {
    return jsonError("not_found", "Application not found", 404);
  }

  return jsonData({ deleted: true });
}
