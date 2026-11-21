import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Guard from "@/models/Guard";
import Site from "@/models/Site";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const rank = searchParams.get("rank");
    const search = searchParams.get("search");

    const query: any = {};
    if (status && status !== "All") query.deploymentStatus = status;
    if (rank && rank !== "All") query.rank = rank;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { badgeNumber: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { currentSiteName: { $regex: search, $options: "i" } },
      ];
    }

    const guards = await Guard.find(query).sort({ badgeNumber: 1 });
    return NextResponse.json({ success: true, data: guards });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { guardId, action, siteId, shift, status } = body;

    const guard = await Guard.findById(guardId);
    if (!guard) {
      return NextResponse.json({ success: false, error: "Guard not found" }, { status: 404 });
    }

    if (action === "transfer" || action === "deploy") {
      const site = await Site.findById(siteId);
      guard.currentSiteId = site?._id;
      guard.currentSiteName = site?.siteName;
      guard.currentShift = shift || "Morning (06:00 - 14:00)";
      guard.deploymentStatus = "On Duty";
      await guard.save();
    } else if (action === "status_change") {
      guard.deploymentStatus = status || guard.deploymentStatus;
      if (status === "Available" || status === "Suspended") {
        guard.currentSiteId = undefined;
        guard.currentSiteName = undefined;
        guard.currentShift = undefined;
      }
      await guard.save();
    }

    return NextResponse.json({ success: true, data: guard });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
