import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  phone?: string;
  avatar?: string;
  branch?: string;
  status: "Active" | "Inactive" | "Suspended";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [
        "Super Admin",
        "Company Admin",
        "HR Manager",
        "Operations Manager",
        "Supervisor",
        "Accountant",
        "Client",
        "Security Guard",
      ],
      default: "Security Guard",
    },
    phone: { type: String },
    avatar: { type: String },
    branch: { type: String, default: "Dhaka Head Office" },
    status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
