import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CompanySettings from "@/models/Settings";

export async function GET() {
  try {
    await connectDB();
    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = await CompanySettings.create({});
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const updated = await CompanySettings.findOneAndUpdate({}, body, { upsert: true, new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
