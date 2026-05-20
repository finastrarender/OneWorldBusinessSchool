import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const siteGlobalSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    navItems: { type: Schema.Types.Mixed, required: true },
    footerColumns: { type: Schema.Types.Mixed, required: true },
    footerMeta: { type: Schema.Types.Mixed, required: true },
    logoSrc: { type: String },
    featureFlags: { type: Schema.Types.Mixed, default: {} },
    seoDefaults: {
      type: {
        defaultTitle: String,
        defaultDescription: String,
      },
      required: false,
    },
    applyNowModal: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true },
);

export type SiteGlobalDoc = InferSchemaType<typeof siteGlobalSchema> & {
  _id: mongoose.Types.ObjectId;
};

const SiteGlobal: Model<SiteGlobalDoc> =
  mongoose.models.SiteGlobal ?? mongoose.model<SiteGlobalDoc>("SiteGlobal", siteGlobalSchema);

export default SiteGlobal;
