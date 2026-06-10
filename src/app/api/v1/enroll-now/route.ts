import { z } from "zod";
import { jsonData, jsonError } from "@/lib/api-response";
import { connectMongo } from "@/lib/mongoose";
import EnrollNowSubmission from "@/models/EnrollNowSubmission";

const customFieldSchema = z.object({
  label: z.string().min(1).max(200),
  value: z.string().max(2000).optional().default(""),
});

const bodySchema = z.object({
  fullName: z.string().min(1).max(200),
  phone: z.string().max(120).optional().default(""),
  email: z.string().email().max(320),
  city: z.string().max(200).optional().default(""),
  experience: z.string().max(200).optional().default(""),
  message: z.string().max(8000).optional().default(""),
  customFields: z.array(customFieldSchema).max(20).optional().default([]),
  acceptedTerms: z.boolean().optional().default(false),
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
