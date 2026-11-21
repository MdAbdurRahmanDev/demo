import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
  _id: mongoose.Types.ObjectId;
  companyName: string;
  clientCode: string;
  logo?: string;
  contactPerson: string;
  designation: string;
  phone: string;
  email: string;
  address: string;
  billingAddress: string;
  tradeLicenseNumber?: string;
  binVatNumber?: string;
  paymentTerms: "Net 15" | "Net 30" | "Net 45" | "Advance";
  status: "Active" | "Inactive" | "Suspended";
  totalGuardsDeployed: number;
  monthlyBillingAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    companyName: { type: String, required: true },
    clientCode: { type: String, required: true, unique: true },
    logo: { type: String },
    contactPerson: { type: String, required: true },
    designation: { type: String, default: "Admin Manager" },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    billingAddress: { type: String, required: true },
    tradeLicenseNumber: { type: String },
    binVatNumber: { type: String },
    paymentTerms: {
      type: String,
      enum: ["Net 15", "Net 30", "Net 45", "Advance"],
      default: "Net 30",
    },
    status: { type: String, enum: ["Active", "Inactive", "Suspended"], default: "Active" },
    totalGuardsDeployed: { type: Number, default: 0 },
    monthlyBillingAmount: { type: Number, default: 0 },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
