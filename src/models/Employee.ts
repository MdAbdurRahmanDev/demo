import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: string;
  fullName: string;
  profilePhoto?: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: "Male" | "Female" | "Other";
  nidNumber: string;
  mobileNumber: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  bloodGroup: string;
  presentAddress: string;
  permanentAddress: string;
  designation: string;
  department: string;
  branch: string;
  joiningDate: string;
  employmentStatus: "Active" | "Probation" | "Resigned" | "Terminated" | "On Leave";
  salaryStructure: {
    basic: number;
    houseRent: number;
    medical: number;
    transport: number;
    foodAllowance?: number;
    grossSalary: number;
  };
  paymentMethod: "Bank" | "bKash" | "Nagad" | "Cash";
  accountDetails: {
    bankName?: string;
    branchName?: string;
    accountNumber?: string;
    routingNumber?: string;
    mobileBankingNumber?: string;
  };
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    profilePhoto: { type: String },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: "Male" },
    nidNumber: { type: String, required: true, unique: true },
    mobileNumber: { type: String, required: true },
    emergencyContact: {
      name: { type: String, default: "" },
      relation: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    bloodGroup: { type: String, default: "B+" },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    designation: { type: String, required: true, default: "Security Guard" },
    department: { type: String, required: true, default: "Operations" },
    branch: { type: String, default: "Dhaka Head Office" },
    joiningDate: { type: String, required: true },
    employmentStatus: {
      type: String,
      enum: ["Active", "Probation", "Resigned", "Terminated", "On Leave"],
      default: "Active",
    },
    salaryStructure: {
      basic: { type: Number, default: 12000 },
      houseRent: { type: Number, default: 4000 },
      medical: { type: Number, default: 1500 },
      transport: { type: Number, default: 1500 },
      foodAllowance: { type: Number, default: 1000 },
      grossSalary: { type: Number, default: 20000 },
    },
    paymentMethod: { type: String, enum: ["Bank", "bKash", "Nagad", "Cash"], default: "Bank" },
    accountDetails: {
      bankName: { type: String, default: "BRAC Bank Ltd." },
      branchName: { type: String, default: "Gulshan Branch" },
      accountNumber: { type: String, default: "" },
      routingNumber: { type: String, default: "" },
      mobileBankingNumber: { type: String, default: "" },
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Employee || mongoose.model<IEmployee>("Employee", EmployeeSchema);
