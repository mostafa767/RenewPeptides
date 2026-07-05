-- Migration 001 — Product management for QR-code batches
-- Run this ONCE against your existing database (Neon SQL editor or psql).
-- Safe to re-run: every statement is IF NOT EXISTS / additive.

-- ─── Products table ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200) NOT NULL,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

-- ─── Link serials + batches to a product ──────────────────────────────────────
-- Nullable: existing serials/batches keep product_id = NULL, so codes generated
-- before this feature keep the old imageless verification screen.
-- ON DELETE SET NULL: deleting a product reverts its codes to that old behavior
-- instead of blocking the delete.
ALTER TABLE serials ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;
ALTER TABLE batches ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_serials_product_id ON serials (product_id);
CREATE INDEX IF NOT EXISTS idx_batches_product_id ON batches (product_id);
