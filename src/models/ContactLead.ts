import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const contactLeadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    inquiryType: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export type ContactLeadDoc = InferSchemaType<typeof contactLeadSchema> & {
  _id: mongoose.Types.ObjectId;
};

const ContactLead: Model<ContactLeadDoc> =
  mongoose.models.ContactLead ?? mongoose.model<ContactLeadDoc>("ContactLead", contactLeadSchema);

export default ContactLead;
