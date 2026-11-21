import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, signToken, COOKIE_NAME } from "@/lib/auth";
import { runDatabaseSeed } from "@/lib/seed";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Auto-seed if database is brand new
    const totalUsers = await User.countDocuments();
    if (totalUsers === 0) {
      await runDatabaseSeed(false);
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.status !== "Active") {
      return NextResponse.json({ error: "Account is inactive or suspended" }, { status: 403 });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      branch: user.branch,
    };

    const token = signToken(payload);

    const response = NextResponse.json({
      success: true,
      user: payload,
      message: "Login successful",
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
