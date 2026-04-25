import { query } from "./db";

const WINDOW_MINUTES = 15;

/**
 * DB-backed rate limiter safe for serverless environments.
 * Returns { allowed: boolean, remaining: number }.
 */
export async function checkRateLimit(
  ip: string,
  endpoint: string,
  maxRequests = Number(process.env.RATE_LIMIT_MAX ?? 10)
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

  // Upsert: increment counter within the window, or reset it if expired
  const rows = await query<{ count: number; window_start: string }>(
    `
    INSERT INTO rate_limits (ip, endpoint, count, window_start)
    VALUES ($1, $2, 1, NOW())
    ON CONFLICT (ip, endpoint) DO UPDATE
      SET count        = CASE
                           WHEN rate_limits.window_start < $3
                           THEN 1
                           ELSE rate_limits.count + 1
                         END,
          window_start = CASE
                           WHEN rate_limits.window_start < $3
                           THEN NOW()
                           ELSE rate_limits.window_start
                         END
    RETURNING count, window_start
    `,
    [ip, endpoint, windowStart.toISOString()]
  );

  const count = rows[0]?.count ?? 1;
  const allowed = count <= maxRequests;
  const remaining = Math.max(0, maxRequests - count);

  return { allowed, remaining };
}
