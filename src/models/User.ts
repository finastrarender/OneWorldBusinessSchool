import mongoose, { Schema, type Model, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof userSchema> & { _id: mongoose.Types.ObjectId };

const User: Model<UserDoc> = mongoose.models.User ?? mongoose.model<UserDoc>("User", userSchema);

export default User;
