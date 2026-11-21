import mongoose, { Schema, Document } from "mongoose";

export interface ISite extends Document {
  _id: mongoose.Types.ObjectId;
  siteName: string;
  clientId: mongoose.Types.ObjectId;
  clientName: string;
  siteCode: string;
  address: string;
  city: string;
  siteManagerName: string;
  siteManagerPhone: string;
  requiredGuards: number;
  requiredSupervisors: number;
  shiftsOffered: string[]; // ["Morning", "Evening", "Night", "12H Day", "12H Night"]
  billingRatePerGuard: number;
  specialInstructions?: string;
  status: "Active" | "Inactive" | "Under Maintenance";
  createdAt: Date;
  updatedAt: Date;
}

const SiteSchema = new Schema<ISite>(
  {
    siteName: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    clientName: { type: String, required: true },
    siteCode: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    city: { type: String, default: "Dhaka" },
    siteManagerName: { type: String, required: true },
    siteManagerPhone: { type: String, required: true },
    requiredGuards: { type: Number, default: 4 },
    requiredSupervisors: { type: Number, default: 1 },
    shiftsOffered: { type: [String], default: ["Morning", "Evening", "Night"] },
    billingRatePerGuard: { type: Number, default: 22000 },
    specialInstructions: { type: String },
    status: { type: String, enum: ["Active", "Inactive", "Under Maintenance"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.Site || mongoose.model<ISite>("Site", SiteSchema);
