-- RenewPeptides Product Verification System — PostgreSQL Schema
-- Run this once against your database before first deployment.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Serials ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS serials (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  serial         VARCHAR(32) UNIQUE NOT NULL,
  batch_id       UUID,
  is_used        BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scans_count    INTEGER     NOT NULL DEFAULT 0,
  last_scanned_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_serials_serial      ON serials (serial);
CREATE INDEX IF NOT EXISTS idx_serials_batch_id    ON serials (batch_id);
CREATE INDEX IF NOT EXISTS idx_serials_created_at  ON serials (created_at DESC);

-- ─── Batches ──────────────────────────────────────────────────────────────────
-- Optional: group generated serials so admin can manage them
CREATE TABLE IF NOT EXISTS batches (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  label       VARCHAR(128),
  count       INTEGER     NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Rate Limit ───────────────────────────────────────────────────────────────
-- Simple DB-backed rate limiter for the public /api/verify endpoint
CREATE TABLE IF NOT EXISTS rate_limits (
  ip           VARCHAR(45)  NOT NULL,
  endpoint     VARCHAR(64)  NOT NULL,
  count        INTEGER      NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  PRIMARY KEY (ip, endpoint)
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits (window_start);
