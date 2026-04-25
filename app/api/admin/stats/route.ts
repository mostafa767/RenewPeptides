export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const [totals, today, recentBatches] = await Promise.all([
    query<{ total_serials: string; total_scans: string; used_serials: string }>(
      `SELECT COUNT(*)                                        AS total_serials,
              COALESCE(SUM(scans_count), 0)                  AS total_scans,
              COUNT(*) FILTER (WHERE is_used = TRUE)         AS used_serials
         FROM serials`
    ),
    query<{ generated_today: string; scans_today: string }>(
      `SELECT COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '1 day')       AS generated_today,
              COALESCE(SUM(scans_count) FILTER (WHERE last_scanned_at >= NOW() - INTERVAL '1 day'), 0) AS scans_today
         FROM serials`
    ),
    query<{ id: string; label: string | null; count: number; created_at: string }>(
      `SELECT id, label, count, created_at
         FROM batches
         ORDER BY created_at DESC
         LIMIT 5`
    ),
  ]);

  return NextResponse.json({
    totalSerials: Number(totals[0]?.total_serials ?? 0),
    totalScans: Number(totals[0]?.total_scans ?? 0),
    usedSerials: Number(totals[0]?.used_serials ?? 0),
    generatedToday: Number(today[0]?.generated_today ?? 0),
    scansToday: Number(today[0]?.scans_today ?? 0),
    recentBatches,
  });
}
