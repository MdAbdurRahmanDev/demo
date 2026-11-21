import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Employee from "@/models/Employee";
import Guard from "@/models/Guard";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const department = searchParams.get("department");
    const status = searchParams.get("status");

    const query: any = {};
    if (department && department !== "All") query.department = department;
    if (status && status !== "All") query.employmentStatus = status;
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { nidNumber: { $regex: search, $options: "i" } },
        { mobileNumber: { $regex: search, $options: "i" } },
      ];
    }

    const employees = await Employee.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: employees });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Auto-generate Employee ID if not provided
    if (!body.employeeId) {
      const count = await Employee.countDocuments();
      body.employeeId = `EMP-2024-${String(count + 1).padStart(3, "0")}`;
    }

    const newEmployee = await Employee.create(body);

    // If designation is Security Guard or Gunman or Supervisor, also create Guard record
    if (body.designation?.toLowerCase().includes("guard") || body.designation?.toLowerCase().includes("gunman") || body.designation?.toLowerCase().includes("supervisor")) {
      const badgeCount = await Guard.countDocuments();
      await Guard.create({
        employeeId: newEmployee.employeeId,
        fullName: newEmployee.fullName,
        badgeNumber: `GP-G-${100 + badgeCount + 1}`,
        rank: body.designation.includes("Senior") ? "Senior Guard" : body.designation.includes("Supervisor") ? "Supervisor" : body.designation.includes("Gunman") ? "Gunman" : "Junior Guard",
        policeVerificationStatus: "Pending",
        medicalFitnessStatus: "Fit",
        trainingCompleted: ["Basic Security"],
        deploymentStatus: "Available",
      });
    }

    return NextResponse.json({ success: true, data: newEmployee });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
