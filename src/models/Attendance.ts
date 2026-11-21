import mongoose, { Schema, Document } from "mongoose";

export interface IAttendance extends Document {
  _id: mongoose.Types.ObjectId;
  guardId: mongoose.Types.ObjectId;
  guardName: string;
  badgeNumber: string;
  siteId: mongoose.Types.ObjectId;
  siteName: string;
  date: string; // YYYY-MM-DD
  checkInTime?: string; // HH:mm
  checkOutTime?: string; // HH:mm
  status: "Present" | "Late" | "Half Day" | "Absent" | "On Leave" | "Overtime";
  lateMinutes: number;
  overtimeHours: number;
  approvedBy?: string;
  isApproved: boolean;
  checkInMethod: "Admin Entry" | "Supervisor Entry" | "Mobile GPS" | "QR Scanner";
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    guardId: { type: Schema.Types.ObjectId, ref: "Guard", required: true },
    guardName: { type: String, required: true },
    badgeNumber: { type: String, required: true },
    siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
    siteName: { type: String, required: true },
    date: { type: String, required: true },
    checkInTime: { type: String },
    checkOutTime: { type: String },
    status: {
      type: String,
      enum: ["Present", "Late", "Half Day", "Absent", "On Leave", "Overtime"],
      default: "Present",
    },
    lateMinutes: { type: Number, default: 0 },
    overtimeHours: { type: Number, default: 0 },
    approvedBy: { type: String, default: "Ops Manager" },
    isApproved: { type: Boolean, default: true },
    checkInMethod: {
      type: String,
      enum: ["Admin Entry", "Supervisor Entry", "Mobile GPS", "QR Scanner"],
      default: "Supervisor Entry",
    },
    remarks: { type: String },
  },
  { timestamps: true }
);

AttendanceSchema.index({ guardId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", AttendanceSchema);
