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

    // Increment the scan counter and resolve the linked product (if any) in a
    // single round-trip. Serials created before the product feature — or whose
    // product was deleted — have product_id = NULL and return no product.
    const rows = await query<{
      id: string;
      serial: string;
      scans_count: number;
      product_id: string | null;
      product_name: string | null;
      product_description: string | null;
      product_image_url: string | null;
    }>(
      `WITH updated AS (
         UPDATE serials
            SET scans_count     = scans_count + 1,
                last_scanned_at = NOW(),
                is_used         = TRUE
          WHERE serial = $1
        RETURNING id, serial, scans_count, product_id
       )
       SELECT u.id, u.serial, u.scans_count,
              p.id          AS product_id,
              p.name        AS product_name,
              p.description  AS product_description,
              p.image_url    AS product_image_url
         FROM updated u
         LEFT JOIN products p ON p.id = u.product_id`,
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

    const row = rows[0];
    const product =
      row.product_id && row.product_image_url
        ? {
            name: row.product_name,
            description: row.product_description,
            imageUrl: row.product_image_url,
          }
        : null;

    return NextResponse.json(
      {
        valid: true,
        message: "This is an authentic RenewPeptides product.",
        scansCount: row.scans_count,
        product,
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
