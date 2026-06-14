import { z } from "zod";
import { Resend } from "resend";
import { jsonData, jsonError } from "@/lib/api-response";
import {
  alphabeticNameFieldSchema,
  contactBlockFormSchema,
  contactInquiryFormSchema,
  emailFieldSchema,
  messageFieldSchema,
} from "@/lib/form-validation";
import { connectMongo } from "@/lib/mongoose";
import ContactLead from "@/models/ContactLead";
import { env } from "@/env";

const fullContactSchema = contactInquiryFormSchema;

const simpleContactSchema = contactBlockFormSchema.extend({
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  inquiryType: z.string().optional().default(""),
});

function parseContactBody(body: unknown) {
  const full = fullContactSchema.safeParse(body);
  if (full.success) {
    return full;
  }

  const simple = simpleContactSchema.safeParse(body);
  if (simple.success) {
    const nameCheck = alphabeticNameFieldSchema.safeParse(simple.data.name);
    const emailCheck = emailFieldSchema.safeParse(simple.data.email);
    const messageCheck = messageFieldSchema.safeParse(simple.data.message);
    if (nameCheck.success && emailCheck.success && messageCheck.success) {
      return {
        success: true as const,
        data: {
          name: nameCheck.data,
          email: emailCheck.data,
          phone: simple.data.phone,
          company: simple.data.company,
          inquiryType: simple.data.inquiryType,
          message: messageCheck.data,
        },
      };
    }
  }

  return full;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("bad_request", "Invalid JSON", 400);
  }
  const parsed = parseContactBody(body);
  if (!parsed.success) {
    return jsonError("validation_error", "Invalid payload", 422, parsed.error.flatten());
  }

  await connectMongo();
  await ContactLead.create({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? "",
    company: parsed.data.company ?? "",
    inquiryType: parsed.data.inquiryType ?? "",
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
          <p><strong>Primary Interest:</strong> ${parsed.data.inquiryType || "-"}</p>
          <p>${parsed.data.message.replace(/</g, "&lt;")}</p>
        `,
      });
    } catch (e) {
      console.error("Resend error", e);
    }
  }

  return jsonData({ received: true });
}
