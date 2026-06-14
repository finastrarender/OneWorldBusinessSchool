import { z } from "zod";

const NAME_REGEX = /^[A-Za-z ]+$/;
const CONTACT_MESSAGE_REGEX = /^[A-Za-z0-9\s]+$/;
const FACILITY_REGEX = /^[A-Za-z0-9\s&.\-/()]+$/;
const PHONE_REGEX = /^\+[0-9]{8,15}$/;

export function sanitizePhoneInput(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, "");
  const hasLeadingPlus = cleaned.startsWith("+");
  const digits = cleaned.replace(/\+/g, "");
  return hasLeadingPlus ? `+${digits}` : digits;
}

export function validatePhone(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "Please enter a phone number with country code.";
  }
  if (!/^\+?[0-9]+$/.test(trimmed)) {
    return "Only numbers and a leading \"+\" are allowed.";
  }
  if (!trimmed.startsWith("+")) {
    return "Please enter a valid international phone number.";
  }
  const digits = trimmed.slice(1);
  if (digits.length < 8 || digits.length > 15) {
    return "Phone number must contain 8–15 digits.";
  }
  if (!PHONE_REGEX.test(trimmed)) {
    return "Please enter a valid international phone number.";
  }
  return null;
}

export const nameFieldSchema = z
  .string()
  .trim()
  .min(1, "Please enter your name.")
  .min(2, "Name must be at least 2 characters long.")
  .max(50, "Name cannot exceed 50 characters.")
  .regex(NAME_REGEX, "Name can only contain letters and spaces.");

export const alphabeticNameFieldSchema = z
  .string()
  .trim()
  .min(1, "Please enter your name.")
  .min(2, "Name must be at least 2 characters long.")
  .max(100, "Name cannot exceed 100 characters.")
  .regex(NAME_REGEX, "Name can only contain letters and spaces.");

export const startupNameFieldSchema = z
  .string()
  .trim()
  .min(1, "Please enter your startup name.")
  .min(2, "Startup name must be at least 2 characters long.")
  .max(100, "Startup name cannot exceed 100 characters.")
  .regex(NAME_REGEX, "Startup name can only contain letters and spaces.");

export const requirementTypeFieldSchema = z
  .string()
  .trim()
  .min(1, "Please select a requirement type.");

export const emailFieldSchema = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .max(255, "Please enter a valid email address.")
  .email("Please enter a valid email address.");

export const phoneFieldSchema = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    const error = validatePhone(value);
    if (error) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: error });
    }
  });

export const facilityNameFieldSchema = z
  .string()
  .trim()
  .min(1, "Please enter your clinic or hospital name.")
  .min(2, "Please enter a valid clinic or hospital name.")
  .max(100, "Facility name cannot exceed 150 characters.")
  .regex(FACILITY_REGEX, "Please enter a valid clinic or hospital name.");

export const organizationNameFieldSchema = z
  .string()
  .trim()
  .min(1, "Please enter your organization or company name.")
  .min(2, "Organization name must be at least 2 characters long.")
  .max(100, "Organization name cannot exceed 100 characters.")
  .regex(NAME_REGEX, "Organization name can only contain letters and spaces.");

export const primaryInterestFieldSchema = z
  .string()
  .trim()
  .min(1, "Please select any interest.");

export const contactMessageFieldSchema = z
  .string()
  .trim()
  .min(1, "Please enter your message.")
  .min(20, "Message must be at least 20 characters long.")
  .max(1000, "Message cannot exceed 1000 characters.")
  .regex(CONTACT_MESSAGE_REGEX, "Message cannot contain special characters.");

export const messageFieldSchema = z
  .string()
  .trim()
  .min(1, "Please enter your requirements.")
  .min(10, "Message must be at least 10 characters long.")
  .max(1000, "Message cannot exceed 1000 characters.");

export const serviceTypeFieldSchema = primaryInterestFieldSchema;

export const pitchDeckUrlFieldSchema = z
  .string()
  .trim()
  .min(1, "Please enter your pitch deck URL.")
  .max(500, "URL cannot exceed 500 characters.")
  .url("Please enter a valid URL.");

export const enrollNowFormSchema = z.object({
  fullName: nameFieldSchema,
  email: emailFieldSchema,
  phone: phoneFieldSchema,
  city: z.string().trim().min(1, "Please select a city."),
  experience: z.string().trim().min(1, "Please select your experience level."),
  message: messageFieldSchema,
  acceptedTerms: z.boolean().refine((value) => value === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const contactInquiryFormSchema = z.object({
  name: alphabeticNameFieldSchema,
  email: emailFieldSchema,
  phone: phoneFieldSchema,
  company: organizationNameFieldSchema,
  inquiryType: primaryInterestFieldSchema,
  message: contactMessageFieldSchema,
});

export const contactBlockFormSchema = z.object({
  name: nameFieldSchema,
  email: emailFieldSchema,
  message: messageFieldSchema,
});

export function zodErrorsToRecord(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString();
    if (key && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}

function normalizeLabel(label: string): string {
  return label.toLowerCase().trim();
}

export function validateIncubationField(label: string, value: string): string | null {
  const key = normalizeLabel(label);

  if (key.includes("email")) {
    return emailFieldSchema.safeParse(value).error?.issues[0]?.message ?? null;
  }

  if (key.includes("requirement") && key.includes("type")) {
    return requirementTypeFieldSchema.safeParse(value).error?.issues[0]?.message ?? null;
  }

  if (key.includes("phone")) {
    return validatePhone(value.trim());
  }

  if (key.includes("startup")) {
    return startupNameFieldSchema.safeParse(value).error?.issues[0]?.message ?? null;
  }

  if (key.includes("full name") || (key === "name" || (key.includes("name") && !key.includes("startup") && !key.includes("company")))) {
    return alphabeticNameFieldSchema.safeParse(value).error?.issues[0]?.message ?? null;
  }

  if (key.includes("company") || key.includes("organization")) {
    return organizationNameFieldSchema.safeParse(value).error?.issues[0]?.message ?? null;
  }

  if (key.includes("url") || key.includes("pitch") || key.includes("deck")) {
    return pitchDeckUrlFieldSchema.safeParse(value).error?.issues[0]?.message ?? null;
  }

  if (key.includes("message")) {
    return messageFieldSchema.safeParse(value).error?.issues[0]?.message ?? null;
  }

  if (key.includes("type") || key.includes("select")) {
    return requirementTypeFieldSchema.safeParse(value).error?.issues[0]?.message ?? null;
  }

  if (!value.trim()) {
    return `Please enter ${label.toLowerCase()}.`;
  }

  return null;
}

export function validateIncubationFields(
  fields: Array<{ label: string; value: string }>,
): Record<string, string> {
  const errors: Record<string, string> = {};
  fields.forEach((field, index) => {
    const error = validateIncubationField(field.label, field.value);
    if (error) {
      errors[`field-${index}`] = error;
    }
  });
  return errors;
}
