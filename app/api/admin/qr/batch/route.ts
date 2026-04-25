export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import JSZip from "jszip";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  let body: { serials?: string[]; batchId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }

  let serials: string[] = [];

  if (body.batchId) {
    const rows = await query<{ serial: string }>(
      `SELECT serial FROM serials WHERE batch_id = $1 ORDER BY created_at ASC`,
      [body.batchId]
    );
    serials = rows.map((r) => r.serial);
  } else if (Array.isArray(body.serials)) {
    serials = body.serials
      .slice(0, 500)
      .map((s) => String(s).toUpperCase().trim());
  }

  if (serials.length === 0) {
    return NextResponse.json({ error: "No serials provided." }, { status: 400 });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
    "https://renewpeptides-us.com";

  const zip = new JSZip();
  const folder = zip.folder("RenewPeptides-QR-Codes")!;

  // Generate QR codes in parallel (batches of 20 to limit memory usage)
  const BATCH = 20;
  for (let i = 0; i < serials.length; i += BATCH) {
    const chunk = serials.slice(i, i + BATCH);
    const buffers = await Promise.all(
      chunk.map((serial) =>
        QRCode.toBuffer(`${baseUrl}/verify?serial=${encodeURIComponent(serial)}`, {
          type: "png",
          width: 400,
          margin: 2,
          color: { dark: "#0A1628", light: "#FFFFFF" },
          errorCorrectionLevel: "H",
        })
      )
    );
    chunk.forEach((serial, j) => {
      folder.file(`RenewPeptides-${serial}.png`, buffers[j]);
    });
  }

  const zipBuffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return new NextResponse(new Uint8Array(zipBuffer as Buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="RenewPeptides-QR-Batch-${Date.now()}.zip"`,
    },
  });
}
