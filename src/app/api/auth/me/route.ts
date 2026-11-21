import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import User from "@/models/User";
import { runDatabaseSeed } from "@/lib/seed";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const session = getUserFromRequest(request);
    if (!session) {
      // If no session, return default admin demo user info for seamless experience
      const admin = await User.findOne({ email: "admin@guardpro.com.bd" });
      if (!admin) {
        await runDatabaseSeed(false);
      }
      return NextResponse.json({
        authenticated: false,
        user: {
          name: "Brig. Gen. (Retd.) Tariqul Islam",
          email: "admin@guardpro.com.bd",
          role: "Super Admin",
          branch: "Dhaka Head Office",
        },
      });
    }

    const user = await User.findById(session.userId).select("-passwordHash");
    return NextResponse.json({
      authenticated: true,
      user: user || session,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
