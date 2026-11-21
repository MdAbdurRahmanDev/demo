import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import DutyRoster from "@/models/DutyRoster";
import Guard from "@/models/Guard";
import Site from "@/models/Site";
import Client from "@/models/Client";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    const siteId = searchParams.get("siteId");

    const query: any = { dutyDate: date };
    if (siteId && siteId !== "All") query.siteId = siteId;

    const rosters = await DutyRoster.find(query).sort({ shift: 1 });
    return NextResponse.json({ success: true, data: rosters });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Prevent conflict: Guard already on duty on same date and overlapping shift
    const existing = await DutyRoster.findOne({
      guardId: body.guardId,
      dutyDate: body.dutyDate,
      shift: body.shift,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Conflict: Guard is already assigned to another site for this shift." },
        { status: 400 }
      );
    }

    const guard = await Guard.findById(body.guardId);
    const site = await Site.findById(body.siteId);
    const client = await Client.findById(site?.clientId);

    const newRoster = await DutyRoster.create({
      guardId: body.guardId,
      guardName: guard?.fullName || body.guardName,
      guardBadge: guard?.badgeNumber || body.guardBadge,
      clientId: client?._id || body.clientId,
      clientName: client?.companyName || body.clientName,
      siteId: site?._id || body.siteId,
      siteName: site?.siteName || body.siteName,
      shift: body.shift,
      dutyDate: body.dutyDate,
      startTime: body.startTime || "06:00",
      endTime: body.endTime || "14:00",
      supervisorName: body.supervisorName || "Supervisor Kabir Hossain",
      assignmentStatus: "Scheduled",
      notes: body.notes,
    });

    return NextResponse.json({ success: true, data: newRoster });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, assignmentStatus, replacementGuardName } = body;

    const updated = await DutyRoster.findByIdAndUpdate(
      id,
      {
        assignmentStatus,
        replacementGuardName,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
