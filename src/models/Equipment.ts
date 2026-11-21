import mongoose, { Schema, Document } from "mongoose";

export interface IEquipmentAssignment {
  guardBadge: string;
  guardName: string;
  assignedDate: string;
  returnedDate?: string;
  condition: "New" | "Good" | "Fair" | "Damaged";
  notes?: string;
}

export interface IEquipment extends Document {
  _id: mongoose.Types.ObjectId;
  itemName: string;
  itemCode: string;
  category: "Uniform" | "Radio / Walkie-Talkie" | "Metal Detector" | "Flashlight" | "Badge / ID" | "Baton / Belt" | "Other";
  totalStock: number;
  assignedCount: number;
  availableCount: number;
  unitPrice: number;
  assignments: IEquipmentAssignment[];
  status: "In Stock" | "Low Stock" | "Out of Stock";
  createdAt: Date;
  updatedAt: Date;
}

const EquipmentAssignmentSchema = new Schema<IEquipmentAssignment>({
  guardBadge: { type: String, required: true },
  guardName: { type: String, required: true },
  assignedDate: { type: String, required: true },
  returnedDate: { type: String },
  condition: { type: String, enum: ["New", "Good", "Fair", "Damaged"], default: "Good" },
  notes: { type: String },
});

const EquipmentSchema = new Schema<IEquipment>(
  {
    itemName: { type: String, required: true },
    itemCode: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: [
        "Uniform",
        "Radio / Walkie-Talkie",
        "Metal Detector",
        "Flashlight",
        "Badge / ID",
        "Baton / Belt",
        "Other",
      ],
      required: true,
    },
    totalStock: { type: Number, required: true },
    assignedCount: { type: Number, default: 0 },
    availableCount: { type: Number, required: true },
    unitPrice: { type: Number, default: 0 },
    assignments: [EquipmentAssignmentSchema],
    status: { type: String, enum: ["In Stock", "Low Stock", "Out of Stock"], default: "In Stock" },
  },
  { timestamps: true }
);

export default mongoose.models.Equipment || mongoose.model<IEquipment>("Equipment", EquipmentSchema);
