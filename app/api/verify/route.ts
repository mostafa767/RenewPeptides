export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { checkRateLimit } from "@/lib/ratelimit";

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    // Rate limiting
    const { allowed, remaining } = await checkRateLimit(ip, "verify");
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait 15 minutes and try again." },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": "0" },
        }
      );
    }

    // Parse body
    let body: { serial?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const serial = (body.serial ?? "").trim().toUpperCase();

    if (!serial) {
      return NextResponse.json(
        { error: "Serial number is required." },
        { status: 400 }
      );
    }

    // Validate format  XXXX-XXXX-XXXX
    if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(serial)) {
      return NextResponse.json(
        { valid: false, message: "Invalid serial number format." },
        { status: 200 }
      );
    }

    // Check DB
    const rows = await query<{
      id: string;
      serial: string;
      scans_count: number;
    }>(
      `UPDATE serials
          SET scans_count     = scans_count + 1,
              last_scanned_at = NOW(),
              is_used         = TRUE
        WHERE serial = $1
       RETURNING id, serial, scans_count`,
      [serial]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        {
          valid: false,
          message:
            "This serial number was not found. The product may be counterfeit.",
        },
        {
          status: 200,
          headers: { "X-RateLimit-Remaining": String(remaining) },
        }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        message: "This is an authentic RenewPeptides product.",
        scansCount: rows[0].scans_count,
      },
      {
        status: 200,
        headers: { "X-RateLimit-Remaining": String(remaining) },
      }
    );
  } catch (err) {
    console.error("[/api/verify]", err);
    return NextResponse.json(
      { error: "Verification service unavailable. Please try again shortly." },
      { status: 503 }
    );
  }
}
