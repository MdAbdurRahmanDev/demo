import mongoose, { Schema, Document } from "mongoose";

export interface IIncident extends Document {
  _id: mongoose.Types.ObjectId;
  incidentNo: string;
  siteName: string;
  clientName: string;
  reportedBy: string;
  reportedDate: string;
  incidentDate: string;
  category: "Theft / Loss" | "Trespassing" | "Guard Misconduct" | "Fire / Safety Hazard" | "Client Complaint" | "Equipment Damage" | "Other";
  severity: "Low" | "Medium" | "High" | "Critical";
  description: string;
  actionTaken: string;
  assignedInvestigator: string;
  investigationNotes?: string;
  resolutionSummary?: string;
  status: "Reported" | "Under Investigation" | "Resolved" | "Closed";
  createdAt: Date;
  updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>(
  {
    incidentNo: { type: String, required: true, unique: true },
    siteName: { type: String, required: true },
    clientName: { type: String, required: true },
    reportedBy: { type: String, required: true },
    reportedDate: { type: String, required: true },
    incidentDate: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Theft / Loss",
        "Trespassing",
        "Guard Misconduct",
        "Fire / Safety Hazard",
        "Client Complaint",
        "Equipment Damage",
        "Other",
      ],
      default: "Client Complaint",
    },
    severity: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    description: { type: String, required: true },
    actionTaken: { type: String, required: true },
    assignedInvestigator: { type: String, default: "Operations Manager" },
    investigationNotes: { type: String },
    resolutionSummary: { type: String },
    status: {
      type: String,
      enum: ["Reported", "Under Investigation", "Resolved", "Closed"],
      default: "Reported",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Incident || mongoose.model<IIncident>("Incident", IncidentSchema);
