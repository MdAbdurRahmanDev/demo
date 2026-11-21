import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Equipment from "@/models/Equipment";

export async function GET() {
  try {
    await connectDB();
    const equipmentList = await Equipment.find().sort({ category: 1 });
    return NextResponse.json({ success: true, data: equipmentList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { equipmentId, guardBadge, guardName, action, condition, notes } = body;

    const eq = await Equipment.findById(equipmentId);
    if (!eq) {
      return NextResponse.json({ success: false, error: "Equipment not found" }, { status: 404 });
    }

    if (action === "issue") {
      if (eq.availableCount <= 0) {
        return NextResponse.json({ success: false, error: "Out of stock" }, { status: 400 });
      }

      eq.assignedCount += 1;
      eq.availableCount -= 1;
      eq.assignments.push({
        guardBadge,
        guardName,
        assignedDate: new Date().toISOString().split("T")[0],
        condition: condition || "Good",
        notes,
      });

      if (eq.availableCount === 0) eq.status = "Out of Stock";
      else if (eq.availableCount <= 5) eq.status = "Low Stock";

      await eq.save();
    } else if (action === "return") {
      eq.assignedCount = Math.max(0, eq.assignedCount - 1);
      eq.availableCount += 1;
      if (eq.availableCount > 5) eq.status = "In Stock";

      const assignment = eq.assignments.find((a: any) => a.guardBadge === guardBadge && !a.returnedDate);
      if (assignment) {
        assignment.returnedDate = new Date().toISOString().split("T")[0];
        assignment.condition = condition || assignment.condition;
      }

      await eq.save();
    }

    return NextResponse.json({ success: true, data: eq });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
