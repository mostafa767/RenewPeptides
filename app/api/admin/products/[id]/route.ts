export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import {
  validateImage,
  uploadProductImage,
  deleteProductImage,
} from "@/lib/product-image";

// PUT — update a product (multipart/form-data: name, description, image?)
// A new image replaces the old one; omitting the image keeps the current one.
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const existing = await query<{ image_url: string | null }>(
    `SELECT image_url FROM products WHERE id = $1`,
    [id]
  );
  if (existing.length === 0) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

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

  let imageUrl = existing[0].image_url;
  let oldImageToDelete: string | null = null;

  if (image instanceof File && image.size > 0) {
    const err = validateImage(image);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    try {
      imageUrl = await uploadProductImage(image);
      oldImageToDelete = existing[0].image_url;
    } catch (err) {
      console.error("[/api/admin/products/[id] PUT] blob upload", err);
      return NextResponse.json({ error: "Image upload failed." }, { status: 502 });
    }
  }

  await query(
    `UPDATE products
        SET name = $1, description = $2, image_url = $3, updated_at = NOW()
      WHERE id = $4`,
    [name, description, imageUrl, id]
  );

  // Remove the replaced image only after the row is safely updated.
  await deleteProductImage(oldImageToDelete);

  return NextResponse.json({ ok: true });
}

// DELETE — remove a product. Its serials/batches keep working via ON DELETE
// SET NULL (product_id becomes NULL → old imageless verification screen).
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const rows = await query<{ image_url: string | null }>(
    `DELETE FROM products WHERE id = $1 RETURNING image_url`,
    [id]
  );

  if (rows.length === 0) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await deleteProductImage(rows[0].image_url);

  return NextResponse.json({ ok: true });
}
