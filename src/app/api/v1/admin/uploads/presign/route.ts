import { z } from "zod";
import { auth } from "@/auth";
import { jsonData, jsonError } from "@/lib/api-response";
import { buildS3ObjectKey, createPresignedUpload } from "@/lib/s3";

const bodySchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  folder: z.string().min(1),
});

export async function POST(request: Request) {
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

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("validation_error", "Invalid payload", 422, parsed.error.flatten());
  }

  try {
    const key = buildS3ObjectKey(parsed.data.folder, parsed.data.fileName);
    const upload = await createPresignedUpload({
      key,
      contentType: parsed.data.contentType,
    });

    return jsonData({
      key,
      uploadUrl: upload.uploadUrl,
      assetUrl: upload.assetUrl,
    });
  } catch (error) {
    return jsonError(
      "s3_config_error",
      error instanceof Error ? error.message : "Upload configuration error",
      500,
    );
  }
}
