export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(
  _request: NextRequest,
  { params }: { params: { serial: string } }
) {
  const serial = decodeURIComponent(params.serial).toUpperCase().trim();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
    "https://renewpeptides-us.com";

  const url = `${baseUrl}/verify?serial=${encodeURIComponent(serial)}`;

  try {
    const buffer = await QRCode.toBuffer(url, {
      type: "png",
      width: 400,
      margin: 2,
      color: {
        dark: "#0A1628",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="RenewPeptides-${serial}.png"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[/api/admin/qr/[serial]]", err);
    return NextResponse.json({ error: "QR generation failed." }, { status: 500 });
  }
}
