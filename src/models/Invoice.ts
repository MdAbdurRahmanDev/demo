import mongoose, { Schema, Document } from "mongoose";

export interface IInvoicePayment {
  paymentId: string;
  amount: number;
  paymentDate: string;
  method: "Bank Transfer" | "Cheque" | "bKash" | "Nagad" | "Cash";
  referenceNumber: string;
  recordedBy: string;
}

export interface IInvoice extends Document {
  _id: mongoose.Types.ObjectId;
  invoiceNumber: string;
  clientId: mongoose.Types.ObjectId;
  clientName: string;
  billingPeriod: string; // e.g. "November 2026"
  issueDate: string;
  dueDate: string;
  siteName: string;
  guardQuantity: number;
  ratePerGuard: number;
  subtotal: number;
  additionalCharges: number;
  additionalChargesDescription?: string;
  vatRatePercentage: number;
  vatAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: "Draft" | "Sent" | "Paid" | "Partial" | "Overdue";
  payments: IInvoicePayment[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoicePaymentSchema = new Schema<IInvoicePayment>({
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: String, required: true },
  method: {
    type: String,
    enum: ["Bank Transfer", "Cheque", "bKash", "Nagad", "Cash"],
    default: "Bank Transfer",
  },
  referenceNumber: { type: String, default: "" },
  recordedBy: { type: String, default: "Accounts Officer" },
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    clientId: { type: Schema.Types.ObjectId, ref: "Client", required: true },
    clientName: { type: String, required: true },
    billingPeriod: { type: String, required: true },
    issueDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    siteName: { type: String, required: true },
    guardQuantity: { type: Number, required: true },
    ratePerGuard: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    additionalCharges: { type: Number, default: 0 },
    additionalChargesDescription: { type: String },
    vatRatePercentage: { type: Number, default: 5 },
    vatAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    dueAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Paid", "Partial", "Overdue"],
      default: "Sent",
    },
    payments: [InvoicePaymentSchema],
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
