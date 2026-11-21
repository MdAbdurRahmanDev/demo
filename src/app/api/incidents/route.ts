import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/Incident";

export async function GET() {
  try {
    await connectDB();
    const incidents = await Incident.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: incidents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const count = await Incident.countDocuments();
    const incidentNo = `INC-2026-${String(count + 1).padStart(3, "0")}`;

    const newIncident = await Incident.create({
      incidentNo,
      siteName: body.siteName,
      clientName: body.clientName,
      reportedBy: body.reportedBy,
      reportedDate: body.reportedDate || new Date().toISOString().split("T")[0],
      incidentDate: body.incidentDate || new Date().toISOString().replace("T", " ").slice(0, 16),
      category: body.category,
      severity: body.severity || "Medium",
      description: body.description,
      actionTaken: body.actionTaken,
      assignedInvestigator: body.assignedInvestigator || "Operations Manager",
      status: "Reported",
    });

    return NextResponse.json({ success: true, data: newIncident });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, status, investigationNotes, resolutionSummary } = body;

    const updated = await Incident.findByIdAndUpdate(
      id,
      { status, investigationNotes, resolutionSummary },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
