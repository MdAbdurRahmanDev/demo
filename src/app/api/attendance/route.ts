import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Guard from "@/models/Guard";
import Site from "@/models/Site";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const status = searchParams.get("status");

    const query: any = { date };
    if (status && status !== "All") query.status = status;

    const attendanceRecords = await Attendance.find(query).sort({ checkInTime: -1 });
    return NextResponse.json({ success: true, data: attendanceRecords });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const guard = await Guard.findById(body.guardId);
    const site = await Site.findById(body.siteId);

    // Calculate late minutes and overtime server-side
    let status = body.status || "Present";
    let lateMinutes = 0;
    if (body.checkInTime && body.checkInTime > "06:10" && body.shift?.includes("Morning")) {
      status = "Late";
      lateMinutes = 15;
    }

    const record = await Attendance.findOneAndUpdate(
      { guardId: body.guardId, date: body.date },
      {
        guardId: body.guardId,
        guardName: guard?.fullName || body.guardName,
        badgeNumber: guard?.badgeNumber || body.badgeNumber,
        siteId: site?._id || body.siteId,
        siteName: site?.siteName || body.siteName,
        date: body.date,
        checkInTime: body.checkInTime,
        checkOutTime: body.checkOutTime,
        status,
        lateMinutes,
        overtimeHours: Number(body.overtimeHours) || 0,
        approvedBy: "Supervisor Kabir Hossain",
        isApproved: true,
        checkInMethod: body.checkInMethod || "Supervisor Entry",
        remarks: body.remarks,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, isApproved, approvedBy, remarks } = body;

    const updated = await Attendance.findByIdAndUpdate(
      id,
      { isApproved, approvedBy, remarks },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
