import { NextResponse } from "next/server";
import { runDatabaseSeed } from "@/lib/seed";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const force = Boolean(body.force);
    const result = await runDatabaseSeed(force);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const result = await runDatabaseSeed(false);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
