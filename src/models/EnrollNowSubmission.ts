import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const enrollNowSubmissionSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    city: { type: String, trim: true },
    experience: { type: String, trim: true },
    message: { type: String, trim: true },
    customFields: {
      type: [
        {
          label: { type: String, required: true, trim: true },
          value: { type: String, trim: true },
        },
      ],
      default: [],
    },
    acceptedTerms: { type: Boolean, default: false },
    marketingConsent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export type EnrollNowSubmissionDoc = InferSchemaType<
  typeof enrollNowSubmissionSchema
> & {
  _id: mongoose.Types.ObjectId;
};

const EnrollNowSubmission: Model<EnrollNowSubmissionDoc> =
  mongoose.models.EnrollNowSubmission ??
  mongoose.model<EnrollNowSubmissionDoc>(
    "EnrollNowSubmission",
    enrollNowSubmissionSchema,
  );

export default EnrollNowSubmission;
