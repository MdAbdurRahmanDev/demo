import mongoose, { Schema, Document } from "mongoose";

export interface ICompanySettings extends Document {
  _id: mongoose.Types.ObjectId;
  companyName: string;
  tagline: string;
  registrationNumber: string;
  tradeLicenseNumber: string;
  tinBinNumber: string;
  phone: string;
  email: string;
  headOfficeAddress: string;
  branches: Array<{
    name: string;
    city: string;
    address: string;
    managerName: string;
    phone: string;
  }>;
  currency: string;
  vatRatePercentage: number;
  overtimeHourlyRateMultiplier: number;
  defaultShifts: Array<{
    name: string;
    startTime: string;
    endTime: string;
    durationHours: number;
  }>;
}

const CompanySettingsSchema = new Schema<ICompanySettings>(
  {
    companyName: { type: String, default: "GuardPro Security Services Bangladesh Ltd." },
    tagline: { type: String, default: "Premier Corporate & Industrial Security Solutions" },
    registrationNumber: { type: String, default: "C-184920/2022" },
    tradeLicenseNumber: { type: String, default: "TRAD/DNCC/049281/2021" },
    tinBinNumber: { type: String, default: "BIN: 004928192-0101" },
    phone: { type: String, default: "+880 2 9887766, +880 1711-000000" },
    email: { type: String, default: "info@guardpro.com.bd" },
    headOfficeAddress: { type: String, default: "Level 7, GuardPro Tower, Plot 14, Road 11, Gulshan-2, Dhaka-1212" },
    branches: [
      {
        name: { type: String },
        city: { type: String },
        address: { type: String },
        managerName: { type: String },
        phone: { type: String },
      },
    ],
    currency: { type: String, default: "BDT" },
    vatRatePercentage: { type: Number, default: 5 },
    overtimeHourlyRateMultiplier: { type: Number, default: 1.5 },
    defaultShifts: [
      {
        name: { type: String },
        startTime: { type: String },
        endTime: { type: String },
        durationHours: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.CompanySettings || mongoose.model<ICompanySettings>("CompanySettings", CompanySettingsSchema);
