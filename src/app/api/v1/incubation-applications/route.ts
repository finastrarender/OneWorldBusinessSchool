import { z } from "zod";
import { jsonData, jsonError } from "@/lib/api-response";
import { connectMongo } from "@/lib/mongoose";
import IncubationApplication from "@/models/IncubationApplication";

const fieldSchema = z.object({
  label: z.string().min(1).max(200),
  value: z.string().max(2000).optional().default(""),
});

const bodySchema = z.object({
  fields: z.array(fieldSchema).min(1).max(20),
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

  const hasValue = parsed.data.fields.some((field) => field.value.trim().length > 0);
  if (!hasValue) {
    return jsonError("validation_error", "Please complete the application form", 422);
  }

  await connectMongo();
  await IncubationApplication.create({
    fields: parsed.data.fields.map((field) => ({
      label: field.label.trim(),
      value: field.value.trim(),
    })),
  });

  return jsonData({ received: true });
}
