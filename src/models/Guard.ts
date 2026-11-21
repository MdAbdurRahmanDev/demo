import mongoose, { Schema, Document } from "mongoose";

export interface IGuard extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: string; // references Employee.employeeId
  fullName: string;
  badgeNumber: string;
  rank: "Junior Guard" | "Senior Guard" | "Head Guard" | "Gunman" | "Supervisor";
  heightFeet: number;
  heightInches: number;
  weightKg: number;
  policeVerificationStatus: "Verified" | "Pending" | "Rejected";
  policeVerificationNumber?: string;
  medicalFitnessStatus: "Fit" | "Unfit" | "Conditional";
  medicalCheckupDate?: string;
  trainingCompleted: string[]; // e.g. ["Basic Security", "Fire Fighting", "First Aid", "CCTV Monitoring"]
  weaponsLicense?: string;
  uniformIssued: boolean;
  deploymentStatus: "Available" | "Assigned" | "On Duty" | "On Leave" | "Absent" | "Suspended" | "Inactive";
  currentSiteId?: mongoose.Types.ObjectId;
  currentSiteName?: string;
  currentShift?: string;
  experienceYears: number;
  rating: number; // 1-5
  createdAt: Date;
  updatedAt: Date;
}

const GuardSchema = new Schema<IGuard>(
  {
    employeeId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    badgeNumber: { type: String, required: true, unique: true },
    rank: {
      type: String,
      enum: ["Junior Guard", "Senior Guard", "Head Guard", "Gunman", "Supervisor"],
      default: "Junior Guard",
    },
    heightFeet: { type: Number, default: 5 },
    heightInches: { type: Number, default: 8 },
    weightKg: { type: Number, default: 68 },
    policeVerificationStatus: {
      type: String,
      enum: ["Verified", "Pending", "Rejected"],
      default: "Pending",
    },
    policeVerificationNumber: { type: String },
    medicalFitnessStatus: {
      type: String,
      enum: ["Fit", "Unfit", "Conditional"],
      default: "Fit",
    },
    medicalCheckupDate: { type: String },
    trainingCompleted: { type: [String], default: ["Basic Security"] },
    weaponsLicense: { type: String },
    uniformIssued: { type: Boolean, default: true },
    deploymentStatus: {
      type: String,
      enum: ["Available", "Assigned", "On Duty", "On Leave", "Absent", "Suspended", "Inactive"],
      default: "Available",
    },
    currentSiteId: { type: Schema.Types.ObjectId, ref: "Site" },
    currentSiteName: { type: String },
    currentShift: { type: String },
    experienceYears: { type: Number, default: 2 },
    rating: { type: Number, default: 4.5 },
  },
  { timestamps: true }
);

export default mongoose.models.Guard || mongoose.model<IGuard>("Guard", GuardSchema);
