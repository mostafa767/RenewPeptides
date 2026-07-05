import { put, del } from "@vercel/blob";

// Vercel Functions cap request bodies at 4.5 MB, so keep the image under that.
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB
export const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/** Returns an error message if the file is not an acceptable image, else null. */
export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Image must be PNG, JPEG, WEBP, or GIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5 MB or smaller.";
  }
  return null;
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "image";
}

/** Upload a product image to Vercel Blob and return its public URL. */
export async function uploadProductImage(file: File): Promise<string> {
  const blob = await put(`products/${sanitizeName(file.name)}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

/** Best-effort deletion of a previously uploaded Blob URL. Never throws. */
export async function deleteProductImage(url: string | null | undefined): Promise<void> {
  if (!url) return;
  try {
    await del(url);
  } catch (err) {
    console.error("[deleteProductImage]", err);
  }
}
