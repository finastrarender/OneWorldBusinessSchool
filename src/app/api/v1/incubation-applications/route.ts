import { z } from "zod";
import { jsonData, jsonError } from "@/lib/api-response";
import { validateIncubationField } from "@/lib/form-validation";
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
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("bad_request", "Invalid JSON payload", 400);
    }

    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return jsonError("validation_error", "Invalid form data", 422, parsed.error.flatten());
    }

    const normalizedFields = parsed.data.fields.map((field) => ({
      label: field.label.trim(),
      value: field.value.trim(),
    }));

    const fieldErrors = normalizedFields
      .map((field, index) => ({
        index,
        error: validateIncubationField(field.label, field.value),
      }))
      .filter((item): item is { index: number; error: string } => item.error !== null);

    if (fieldErrors.length > 0) {
      return jsonError("validation_error", fieldErrors[0].error, 422, {
        fieldErrors: Object.fromEntries(
          fieldErrors.map((item) => [`field-${item.index}`, item.error]),
        ),
      });
    }

    await connectMongo();
    await IncubationApplication.create({
      fields: normalizedFields,
    });

    return jsonData({ received: true });
  } catch (err: unknown) {
    console.error("Incubation application error:", err);
    return jsonError(
      "internal_error",
      "Failed to submit application. This may be due to database limits (500/500 collections used). Please check your MongoDB Atlas dashboard.",
      500,
    );
  }
}
