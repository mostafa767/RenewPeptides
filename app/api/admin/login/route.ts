export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    let body: { email?: string; password?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid body." }, { status: 400 });
    }

    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
    console.log("adminEmail", adminEmail);
    console.log("process.env.email", process.env.ADMIN_EMAIL);
    // Hash is stored base64-encoded to avoid $ interpolation in .env files
    const adminHash = process.env.ADMIN_PASSWORD_HASH_B64
      ? Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64, "base64").toString("utf-8")
      : (process.env.ADMIN_PASSWORD_HASH ?? "");
    console.log("adminHash", adminHash);
    console.log("password", password);

    if (email !== adminEmail) {
      // Constant-time-ish: still run bcrypt to avoid timing attacks
      await bcrypt.compare(password, "$2b$12$invalidhashpadding000000000000000000000000000000000000000");
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, adminHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials." },
        { status: 401 }
      );
    }

    const token = await signToken({ email: adminEmail });

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 h
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[/api/admin/login]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
