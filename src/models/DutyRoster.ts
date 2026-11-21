import mongoose, { Schema, Document } from "mongoose";

export interface IDutyRoster extends Document {
  _id: mongoose.Types.ObjectId;
  guardId: mongoose.Types.ObjectId;
  guardName: string;
  guardBadge: string;
  clientId: mongoose.Types.ObjectId;
  clientName: string;
  siteId: mongoose.Types.ObjectId;
  siteName: string;
  shift: "Morning (06:00 - 14:00)" | "Evening (14:00 - 22:00)" | "Night (22:00 - 06:00)" | "12H Day (08:00 - 20:00)" | "12H Night (20:00 - 08:00)";
  dutyDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  supervisorName: string;
  assignmentStatus: "Scheduled" | "On Duty" | "Completed" | "Replaced" | "Absent";
  replacementGuardName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DutyRosterSchema = new Schema<IDutyRoster>(
  {
    guardId: { type: Schema.Types.ObjectId, ref: "Guard", required: true },
    guardName: { type: String, required: true },
    guardBadge: { type: String, required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    clientName: { type: String, required: true },
    siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
    siteName: { type: String, required: true },
    shift: {
      type: String,
      enum: [
        "Morning (06:00 - 14:00)",
        "Evening (14:00 - 22:00)",
        "Night (22:00 - 06:00)",
        "12H Day (08:00 - 20:00)",
        "12H Night (20:00 - 08:00)",
      ],
      required: true,
    },
    dutyDate: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    supervisorName: { type: String, default: "Supervisor Kabir Hossain" },
    assignmentStatus: {
      type: String,
      enum: ["Scheduled", "On Duty", "Completed", "Replaced", "Absent"],
      default: "Scheduled",
    },
    replacementGuardName: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

DutyRosterSchema.index({ guardId: 1, dutyDate: 1, shift: 1 });
DutyRosterSchema.index({ siteId: 1, dutyDate: 1 });

export default mongoose.models.DutyRoster || mongoose.model<IDutyRoster>("DutyRoster", DutyRosterSchema);
