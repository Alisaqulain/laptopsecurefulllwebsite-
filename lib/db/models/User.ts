import mongoose, { Schema, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, required: true, index: true },
    phone: { type: String, default: "", index: true },
    profileImage: { type: String, default: "" },
    isActive: { type: Boolean, default: true, index: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

// unique index already declared on the email field

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

