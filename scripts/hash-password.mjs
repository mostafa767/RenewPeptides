/**
 * Usage: node scripts/hash-password.mjs "YourPasswordHere"
 *
 * Outputs the bcrypt hash to paste into ADMIN_PASSWORD_HASH in your .env.local
 */

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-password.mjs \"YourPassword\"");
  process.exit(1);
}

if (password.length < 8) {
  console.error("Error: Password must be at least 8 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const b64 = Buffer.from(hash).toString("base64");
console.log("\nAdd this to .env.local (base64-encoded to avoid $ interpolation):\n");
console.log(`ADMIN_PASSWORD_HASH_B64=${b64}`);
