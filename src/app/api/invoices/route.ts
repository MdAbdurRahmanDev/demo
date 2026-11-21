import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Invoice from "@/models/Invoice";
import Client from "@/models/Client";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const query: any = {};
    if (status && status !== "All") query.status = status;

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: invoices });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const client = await Client.findById(body.clientId);
    if (!client) {
      return NextResponse.json({ success: false, error: "Client not found" }, { status: 404 });
    }

    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-2026-${String(count + 1).padStart(3, "0")}`;

    const subtotal = body.guardQuantity * body.ratePerGuard;
    const additional = Number(body.additionalCharges) || 0;
    const vatRate = Number(body.vatRatePercentage) || 5;
    const vatAmount = Math.round(((subtotal + additional) * vatRate) / 100);
    const discount = Number(body.discountAmount) || 0;
    const totalAmount = subtotal + additional + vatAmount - discount;

    const invoice = await Invoice.create({
      invoiceNumber,
      clientId: client._id,
      clientName: client.companyName,
      billingPeriod: body.billingPeriod || "November 2026",
      issueDate: body.issueDate || new Date().toISOString().split("T")[0],
      dueDate: body.dueDate,
      siteName: body.siteName || "Company Premises",
      guardQuantity: body.guardQuantity,
      ratePerGuard: body.ratePerGuard,
      subtotal,
      additionalCharges: additional,
      additionalChargesDescription: body.additionalChargesDescription,
      vatRatePercentage: vatRate,
      vatAmount,
      discountAmount: discount,
      totalAmount,
      paidAmount: 0,
      dueAmount: totalAmount,
      status: "Sent",
      payments: [],
      notes: body.notes,
    });

    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { invoiceId, paymentAmount, method, referenceNumber, recordedBy } = body;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    }

    const newPayment = {
      paymentId: `PAY-${Date.now()}`,
      amount: Number(paymentAmount),
      paymentDate: new Date().toISOString().split("T")[0],
      method: method || "Bank Transfer",
      referenceNumber: referenceNumber || "REF-DIRECT",
      recordedBy: recordedBy || "Accounts Officer",
    };

    invoice.payments.push(newPayment);
    invoice.paidAmount += Number(paymentAmount);
    invoice.dueAmount = Math.max(0, invoice.totalAmount - invoice.paidAmount);

    if (invoice.dueAmount <= 0) {
      invoice.status = "Paid";
    } else {
      invoice.status = "Partial";
    }

    await invoice.save();
    return NextResponse.json({ success: true, data: invoice });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
