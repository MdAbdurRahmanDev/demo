import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import Guard from "@/models/Guard";
import Attendance from "@/models/Attendance";
import DutyRoster from "@/models/DutyRoster";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json({ success: false, error: "Employee not found" }, { status: 404 });
    }

    const guardProfile = await Guard.findOne({ employeeId: employee.employeeId });
    const attendanceHistory = await Attendance.find({ badgeNumber: guardProfile?.badgeNumber }).sort({ date: -1 }).limit(10);
    const dutyHistory = await DutyRoster.find({ guardBadge: guardProfile?.badgeNumber }).sort({ dutyDate: -1 }).limit(10);

    return NextResponse.json({
      success: true,
      data: {
        employee,
        guardProfile,
        attendanceHistory,
        dutyHistory,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const updated = await Employee.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const employee = await Employee.findById(id);
    if (employee) {
      await Guard.deleteOne({ employeeId: employee.employeeId });
      await Employee.findByIdAndDelete(id);
    }
    return NextResponse.json({ success: true, message: "Employee removed successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
