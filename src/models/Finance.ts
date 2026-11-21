import mongoose, { Schema, Document } from "mongoose";

export interface IAccount extends Document {
  _id: mongoose.Types.ObjectId;
  accountName: string;
  accountNumber?: string;
  accountType: "Cash" | "Bank" | "Mobile Banking";
  bankName?: string;
  branch?: string;
  balance: number;
  currency: string;
  status: "Active" | "Inactive";
}

const AccountSchema = new Schema<IAccount>(
  {
    accountName: { type: String, required: true },
    accountNumber: { type: String },
    accountType: { type: String, enum: ["Cash", "Bank", "Mobile Banking"], required: true },
    bankName: { type: String },
    branch: { type: String },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "BDT" },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  transactionId: string;
  date: string;
  type: "Income" | "Expense" | "Transfer";
  category: string;
  accountName: string;
  amount: number;
  reference?: string;
  voucherNo: string;
  description: string;
  performedBy: string;
  approvalStatus: "Approved" | "Pending" | "Rejected";
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: { type: String, required: true, unique: true },
    date: { type: String, required: true },
    type: { type: String, enum: ["Income", "Expense", "Transfer"], required: true },
    category: { type: String, required: true },
    accountName: { type: String, required: true },
    amount: { type: Number, required: true },
    reference: { type: String },
    voucherNo: { type: String, required: true },
    description: { type: String, required: true },
    performedBy: { type: String, default: "Finance Officer" },
    approvalStatus: { type: String, enum: ["Approved", "Pending", "Rejected"], default: "Approved" },
  },
  { timestamps: true }
);

export const Account = mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
