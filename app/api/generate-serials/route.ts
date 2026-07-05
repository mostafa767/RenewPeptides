export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { query, getClient } from "@/lib/db";
import { generateSerials } from "@/lib/serial";

export async function POST(request: NextRequest) {
  // Protect this route (middleware also guards it)
  const token = getTokenFromRequest(request);
  if (!token || !(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: { count?: number; label?: string; productId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  const count = Number(body.count ?? 0);
  if (!Number.isInteger(count) || count < 1 || count > 10_000) {
    return NextResponse.json(
      { error: "Count must be an integer between 1 and 10,000." },
      { status: 400 }
    );
  }

  const label = (body.label ?? "").slice(0, 128);

  // Product is optional, but if provided it must exist.
  const productId = (body.productId ?? "").trim() || null;
  if (productId) {
    const found = await query<{ id: string }>(
      `SELECT id FROM products WHERE id = $1`,
      [productId]
    );
    if (found.length === 0) {
      return NextResponse.json({ error: "Selected product not found." }, { status: 400 });
    }
  }

  try {
    const client = await getClient();
    try {
      await client.query("BEGIN");

      // Create batch record
      const batchRows = await client.query<{ id: string }>(
        `INSERT INTO batches (label, count, product_id) VALUES ($1, $2, $3) RETURNING id`,
        [label || null, count, productId]
      );
      const batchId = batchRows.rows[0].id;

      // Generate unique serials (retry up to 3 times on collision)
      let serials: string[] = [];
      let attempts = 0;
      while (serials.length < count && attempts < 3) {
        const candidates = generateSerials(count - serials.length + 20);
        // Bulk check existing
        const existing = await client.query<{ serial: string }>(
          `SELECT serial FROM serials WHERE serial = ANY($1)`,
          [candidates]
        );
        const existingSet = new Set(existing.rows.map((r) => r.serial));
        const fresh = candidates.filter((s) => !existingSet.has(s));
        serials = [...serials, ...fresh].slice(0, count);
        attempts++;
      }

      if (serials.length < count) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Could not generate enough unique serials. Please retry." },
          { status: 500 }
        );
      }

      // Bulk insert — denormalize product_id onto each serial so /api/verify
      // can resolve the product in a single query.
      const placeholders = serials
        .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
        .join(", ");
      const values = serials.flatMap((s) => [s, batchId, productId]);
      await client.query(
        `INSERT INTO serials (serial, batch_id, product_id) VALUES ${placeholders}`,
        values
      );

      await client.query("COMMIT");

      return NextResponse.json(
        { ok: true, batchId, count: serials.length, serials },
        { status: 201 }
      );
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("[/api/generate-serials]", err);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
}
