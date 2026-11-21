import mongoose, { Schema, Document } from "mongoose";

export interface IPayrollItem {
  employeeId: string;
  fullName: string;
  designation: string;
  branch: string;
  basicSalary: number;
  houseRent: number;
  medicalAllowance: number;
  transportAllowance: number;
  overtimeHours: number;
  overtimeAmount: number;
  bonus: number;
  attendanceBonus: number;
  advanceDeduction: number;
  absenceDeduction: number;
  totalGross: number;
  totalDeductions: number;
  netPayable: number;
  paymentMethod: "Bank" | "bKash" | "Nagad" | "Cash";
  paymentStatus: "Unpaid" | "Paid" | "Processing";
  paymentReference?: string;
  paidAt?: Date;
}

export interface IPayroll extends Document {
  _id: mongoose.Types.ObjectId;
  payrollMonth: string; // e.g. "November 2026"
  monthCode: string; // "2026-11"
  totalEmployees: number;
  totalGrossAmount: number;
  totalDeductionAmount: number;
  totalNetPayroll: number;
  status: "Draft" | "Approved" | "Paid";
  approvedBy?: string;
  approvedAt?: Date;
  items: IPayrollItem[];
  createdAt: Date;
  updatedAt: Date;
}

const PayrollItemSchema = new Schema<IPayrollItem>({
  employeeId: { type: String, required: true },
  fullName: { type: String, required: true },
  designation: { type: String, required: true },
  branch: { type: String, default: "Dhaka Head Office" },
  basicSalary: { type: Number, required: true },
  houseRent: { type: Number, default: 0 },
  medicalAllowance: { type: Number, default: 0 },
  transportAllowance: { type: Number, default: 0 },
  overtimeHours: { type: Number, default: 0 },
  overtimeAmount: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  attendanceBonus: { type: Number, default: 0 },
  advanceDeduction: { type: Number, default: 0 },
  absenceDeduction: { type: Number, default: 0 },
  totalGross: { type: Number, required: true },
  totalDeductions: { type: Number, default: 0 },
  netPayable: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Bank", "bKash", "Nagad", "Cash"], default: "Bank" },
  paymentStatus: { type: String, enum: ["Unpaid", "Paid", "Processing"], default: "Paid" },
  paymentReference: { type: String },
  paidAt: { type: Date },
});

const PayrollSchema = new Schema<IPayroll>(
  {
    payrollMonth: { type: String, required: true },
    monthCode: { type: String, required: true, unique: true },
    totalEmployees: { type: Number, default: 0 },
    totalGrossAmount: { type: Number, default: 0 },
    totalDeductionAmount: { type: Number, default: 0 },
    totalNetPayroll: { type: Number, default: 0 },
    status: { type: String, enum: ["Draft", "Approved", "Paid"], default: "Paid" },
    approvedBy: { type: String, default: "Managing Director" },
    approvedAt: { type: Date },
    items: [PayrollItemSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Payroll || mongoose.model<IPayroll>("Payroll", PayrollSchema);
