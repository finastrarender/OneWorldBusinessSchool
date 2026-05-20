import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const sectionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    order: { type: Number, required: true },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false },
);

const pageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    sections: { type: [sectionSchema], default: [] },
    publishedSections: { type: [sectionSchema], default: [] },
    publishedAt: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String },
    ogImage: { type: String },
    canonicalPath: { type: String },
  },
  { timestamps: true },
);

export type PageDoc = InferSchemaType<typeof pageSchema> & { _id: mongoose.Types.ObjectId };

const Page: Model<PageDoc> = mongoose.models.Page ?? mongoose.model<PageDoc>("Page", pageSchema);

export default Page;
