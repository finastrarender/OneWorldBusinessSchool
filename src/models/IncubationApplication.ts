import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const incubationApplicationSchema = new Schema(
  {
    fields: {
      type: [
        {
          label: { type: String, required: true, trim: true },
          value: { type: String, trim: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export type IncubationApplicationDoc = InferSchemaType<
  typeof incubationApplicationSchema
> & {
  _id: mongoose.Types.ObjectId;
};

const IncubationApplication: Model<IncubationApplicationDoc> =
  mongoose.models.IncubationApplication ??
  mongoose.model<IncubationApplicationDoc>(
    "IncubationApplication",
    incubationApplicationSchema,
  );

export default IncubationApplication;
