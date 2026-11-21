import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Account, Transaction } from "@/models/Finance";

export async function GET() {
  try {
    await connectDB();
    const accounts = await Account.find();
    const transactions = await Transaction.find().sort({ date: -1, createdAt: -1 });

    const totalIncome = transactions
      .filter((t) => t.type === "Income")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "Expense")
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    return NextResponse.json({
      success: true,
      data: {
        accounts,
        transactions,
        totalIncome,
        totalExpense,
        netCashFlow: totalIncome - totalExpense,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const count = await Transaction.countDocuments();
    const transactionId = `TXN-2026-${String(count + 1).padStart(3, "0")}`;
    const voucherPrefix = body.type === "Income" ? "RV" : "PV";
    const voucherNo = `${voucherPrefix}-2026-${String(count + 1).padStart(3, "0")}`;

    const newTxn = await Transaction.create({
      transactionId,
      date: body.date || new Date().toISOString().split("T")[0],
      type: body.type,
      category: body.category,
      accountName: body.accountName,
      amount: Number(body.amount),
      reference: body.reference,
      voucherNo,
      description: body.description,
      performedBy: body.performedBy || "Finance Officer",
      approvalStatus: "Approved",
    });

    // Update account balance
    const multiplier = body.type === "Income" ? 1 : -1;
    await Account.findOneAndUpdate(
      { accountName: body.accountName },
      { $inc: { balance: Number(body.amount) * multiplier } }
    );

    return NextResponse.json({ success: true, data: newTxn });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
