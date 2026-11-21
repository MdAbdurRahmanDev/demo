import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveRequest extends Document {
  _id: mongoose.Types.ObjectId;
  employeeId: string;
  employeeName: string;
  leaveType: "Annual Leave" | "Sick Leave" | "Casual Leave" | "Unpaid Leave";
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
  approvedBy?: string;
  approvalRemarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveRequestSchema = new Schema<ILeaveRequest>(
  {
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ["Annual Leave", "Sick Leave", "Casual Leave", "Unpaid Leave"],
      required: true,
    },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    approvedBy: { type: String },
    approvalRemarks: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.LeaveRequest || mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);
