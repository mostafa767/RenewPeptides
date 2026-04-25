export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(10, Number(searchParams.get("limit") ?? 50)));
  const offset = (page - 1) * limit;
  const batchId = searchParams.get("batchId");
  const search = (searchParams.get("search") ?? "").trim();

  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (batchId) {
    conditions.push(`s.batch_id = $${idx++}`);
    params.push(batchId);
  }
  if (search) {
    conditions.push(`s.serial ILIKE $${idx++}`);
    params.push(`%${search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const [rows, countRows] = await Promise.all([
    query<{
      id: string;
      serial: string;
      batch_id: string | null;
      batch_label: string | null;
      is_used: boolean;
      created_at: string;
      scans_count: number;
      last_scanned_at: string | null;
    }>(
      `SELECT s.id, s.serial, s.batch_id, b.label AS batch_label,
              s.is_used, s.created_at, s.scans_count, s.last_scanned_at
         FROM serials s
         LEFT JOIN batches b ON b.id = s.batch_id
         ${where}
         ORDER BY s.created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
      [...params, limit, offset]
    ),
    query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM serials s ${where}`,
      params
    ),
  ]);

  const total = Number(countRows[0]?.total ?? 0);

  return NextResponse.json({
    data: rows,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}
