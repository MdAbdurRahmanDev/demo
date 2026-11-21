import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import LeaveRequest from "@/models/LeaveRequest";

export async function GET() {
  try {
    await connectDB();
    const leaves = await LeaveRequest.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: leaves });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const newLeave = await LeaveRequest.create(body);
    return NextResponse.json({ success: true, data: newLeave });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, status, approvedBy, approvalRemarks } = body;

    const updated = await LeaveRequest.findByIdAndUpdate(
      id,
      { status, approvedBy, approvalRemarks },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
