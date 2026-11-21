import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Client from "@/models/Client";
import Site from "@/models/Site";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const query: any = {};
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { contactPerson: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { clientCode: { $regex: search, $options: "i" } },
      ];
    }

    const clients = await Client.find(query).sort({ createdAt: -1 });
    const sites = await Site.find();

    const clientDataWithSites = clients.map((client) => {
      const clientSites = sites.filter((s) => s.clientId?.toString() === client._id.toString());
      return {
        ...client.toObject(),
        sites: clientSites,
      };
    });

    return NextResponse.json({ success: true, data: clientDataWithSites });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.clientCode) {
      const count = await Client.countDocuments();
      body.clientCode = `CL-BD-${String(count + 1).padStart(3, "0")}`;
    }

    const newClient = await Client.create(body);
    return NextResponse.json({ success: true, data: newClient });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
