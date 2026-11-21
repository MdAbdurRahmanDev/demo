import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Site from "@/models/Site";
import Client from "@/models/Client";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    const query: any = {};
    if (clientId) query.clientId = clientId;

    const sites = await Site.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: sites });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.siteCode) {
      const count = await Site.countDocuments();
      body.siteCode = `SITE-BD-${String(count + 1).padStart(2, "0")}`;
    }

    const client = await Client.findById(body.clientId);
    if (client) {
      body.clientName = client.companyName;
    }

    const newSite = await Site.create(body);
    return NextResponse.json({ success: true, data: newSite });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
