import { randomBytes } from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no O, 0, I, 1 to avoid confusion

/**
 * Generate a cryptographically secure, human-readable serial number.
 * Format: XXXX-XXXX-XXXX  (12 chars from a 32-char alphabet)
 * Possible combinations: 32^12 ≈ 1.15 × 10^18
 */
export function generateSerial(): string {
  const bytes = randomBytes(12);
  let code = "";
  for (let i = 0; i < 12; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return `${code.slice(0, 4)}-${code.slice(4, 8)}-${code.slice(8, 12)}`;
}

/**
 * Generate N unique serials.
 * Uses a Set to deduplicate on the fly (collision probability near zero,
 * but handled defensively).
 */
export function generateSerials(count: number): string[] {
  if (count < 1 || count > 10_000) {
    throw new RangeError("Count must be between 1 and 10,000");
  }
  const set = new Set<string>();
  while (set.size < count) {
    set.add(generateSerial());
  }
  return Array.from(set);
}
