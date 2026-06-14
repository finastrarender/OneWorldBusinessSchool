import { z } from "zod";
import { jsonData, jsonError } from "@/lib/api-response";
import { enrollNowFormSchema } from "@/lib/form-validation";
import { connectMongo } from "@/lib/mongoose";
import EnrollNowSubmission from "@/models/EnrollNowSubmission";

const customFieldSchema = z.object({
  label: z.string().min(1).max(200),
  value: z.string().max(2000).optional().default(""),
});

const bodySchema = enrollNowFormSchema.extend({
  customFields: z.array(customFieldSchema).max(20).optional().default([]),
  marketingConsent: z.boolean().optional().default(false),
});

export async function POST(request: Request) {
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

  await connectMongo();
  await EnrollNowSubmission.create({
    ...parsed.data,
    customFields: parsed.data.customFields.map((field) => ({
      label: field.label.trim(),
      value: field.value.trim(),
    })),
  });

  return jsonData({ received: true });
}
