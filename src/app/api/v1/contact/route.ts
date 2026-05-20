import { z } from "zod";
import { Resend } from "resend";
import { jsonData, jsonError } from "@/lib/api-response";
import { connectMongo } from "@/lib/mongoose";
import ContactLead from "@/models/ContactLead";
import { env } from "@/env";

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().min(1).max(120).optional().default(""),
  company: z.string().max(200).optional().default(""),
  inquiryType: z.string().max(200).optional().default(""),
  message: z.string().min(1).max(8000),
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
  await ContactLead.create({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    company: parsed.data.company,
    inquiryType: parsed.data.inquiryType,
    message: parsed.data.message,
  });

  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL) {
    try {
      const resend = new Resend(env.RESEND_API_KEY);
      const from =
        process.env.CONTACT_FROM_EMAIL?.trim() || "OWTC Contact <onboarding@resend.dev>";
      await resend.emails.send({
        from,
        to: env.CONTACT_TO_EMAIL,
        subject: `Website contact from ${parsed.data.name}`,
        html: `
          <p><strong>From:</strong> ${parsed.data.name} &lt;${parsed.data.email}&gt;</p>
          <p><strong>Phone:</strong> ${parsed.data.phone || "-"}</p>
          <p><strong>Company:</strong> ${parsed.data.company || "-"}</p>
          <p><strong>Inquiry Type:</strong> ${parsed.data.inquiryType || "-"}</p>
          <p>${parsed.data.message.replace(/</g, "&lt;")}</p>
        `,
      });
    } catch (e) {
      console.error("Resend error", e);
    }
  }

  return jsonData({ received: true });
}
