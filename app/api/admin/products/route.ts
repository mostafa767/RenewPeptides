export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { validateImage, uploadProductImage } from "@/lib/product-image";

// GET — list all products (newest first)
export async function GET() {
  const rows = await query<{
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    created_at: string;
    updated_at: string;
  }>(
    `SELECT id, name, description, image_url, created_at, updated_at
       FROM products
       ORDER BY created_at DESC`
  );
  return NextResponse.json({ data: rows });
}

// POST — create a product (multipart/form-data: name, description, image?)
export async function POST(request: NextRequest) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const name = String(form.get("name") ?? "").trim().slice(0, 200);
  const description = String(form.get("description") ?? "").trim() || null;
  const image = form.get("image");

  if (!name) {
    return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  }

  let imageUrl: string | null = null;
  if (image instanceof File && image.size > 0) {
    const err = validateImage(image);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    try {
      imageUrl = await uploadProductImage(image);
    } catch (err) {
      console.error("[/api/admin/products POST] blob upload", err);
      return NextResponse.json({ error: "Image upload failed." }, { status: 502 });
    }
  }

  const rows = await query<{ id: string }>(
    `INSERT INTO products (name, description, image_url)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [name, description, imageUrl]
  );

  return NextResponse.json({ ok: true, id: rows[0].id }, { status: 201 });
}
