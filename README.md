# RenewPeptides Pharmaceuticals — Web App

Production-ready Next.js 14 application for RenewPeptides Pharmaceuticals, featuring:
- Public website (Home, Products, About, Contact)
- QR-based product verification system
- Admin portal for generating and managing serial numbers
- Batch QR code generation and ZIP download

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Database | PostgreSQL (any provider) |
| Auth | JWT (jose) + bcrypt |
| QR Generation | `qrcode` + `jszip` |
| Deployment | Vercel |

---

## Quick Start (Local Development)

### 1. Clone and install

```bash
cd /path/to/RenewPeptides
npm install
```

### 2. Set up PostgreSQL

You can use any of these free PostgreSQL providers:

- **Neon** (recommended): https://neon.tech — free tier, instant setup
- **Supabase**: https://supabase.com — free tier
- **Railway**: https://railway.app

After creating a database, copy the connection string (it looks like `postgresql://user:pass@host/db?sslmode=require`).

### 3. Create the database schema

Run the SQL schema against your database:

```bash
# Using psql
psql "postgresql://..." -f schema.sql

# Or paste the contents of schema.sql into your provider's SQL editor
```

### 4. Create your admin password hash

```bash
node scripts/hash-password.mjs "YourChosenPassword"
```

Copy the output hash — you'll need it in the next step.

### 5. Configure environment variables

Create a `.env.local` file in the project root:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:5432/renewpeptides?sslmode=require"

# JWT secret — generate with: openssl rand -base64 64
JWT_SECRET="your-very-long-random-secret-minimum-32-characters-long"

# Admin login credentials
ADMIN_EMAIL="admin@renewpeptides-us.com"
ADMIN_PASSWORD_HASH="$2b$12$..."   # from step 4

# Base URL for QR codes (use http://localhost:3000 locally)
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Optional: max verify attempts per IP per 15 min (default: 10)
RATE_LIMIT_MAX="10"
```

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin portal: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deploying to Vercel (renewpeptides-us.com)

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Initial RenewPeptides application"
git push origin main
```

### Step 2 — Create a Vercel project

1. Go to https://vercel.com and sign in
2. Click **Add New → Project**
3. Import your GitHub repo `mostafa767/RenewPeptides`
4. Framework preset will auto-detect **Next.js**
5. Click **Deploy** (it will fail on the first deploy without env vars — that's fine)

### Step 3 — Add environment variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add all variables from your `.env.local`:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your PostgreSQL connection string |
| `JWT_SECRET` | Your random secret (min 32 chars) |
| `ADMIN_EMAIL` | admin@renewpeptides-us.com |
| `ADMIN_PASSWORD_HASH` | Your bcrypt hash |
| `NEXT_PUBLIC_BASE_URL` | `https://renewpeptides-us.com` |
| `RATE_LIMIT_MAX` | `10` |

> **Tip**: Set environment for **Production**, **Preview**, and **Development** all at once.

### Step 4 — Redeploy

Go to **Deployments** and click **Redeploy** on the latest deployment.

### Step 5 — Connect your domain (renewpeptides-us.com)

1. In Vercel project → **Settings → Domains**
2. Add `renewpeptides-us.com` and `www.renewpeptides-us.com`
3. Vercel will show you DNS records to add
4. Log into your domain registrar (wherever you bought renewpeptides-us.com)
5. Add the DNS records Vercel specifies — typically:
   - **A record**: `@` → `76.76.21.21`
   - **CNAME**: `www` → `cname.vercel-dns.com`
6. DNS propagation takes 5–60 minutes

### Step 6 — Run the schema on your production database

If you haven't already, run `schema.sql` against your production PostgreSQL database.

---

## How the QR Verification Flow Works

```
Physical product
      │
      │  QR Code label printed on product
      │  Contains: https://renewpeptides-us.com/verify?serial=XXXX-XXXX-XXXX
      ▼
Customer scans with phone camera
      │
      ▼
Browser opens /verify?serial=XXXX-XXXX-XXXX
      │
      │  Serial auto-populated, verification auto-triggered
      ▼
POST /api/verify { serial: "XXXX-XXXX-XXXX" }
      │
      ▼
PostgreSQL lookup + increment scan_count
      │
      ├── Found ──► { valid: true }  → Green "Authentic Product" screen
      └── Not found ► { valid: false } → Red "Not Verified" screen
```

---

## Admin Workflow

1. Log in at `/admin/login`
2. Click **"+ New Batch"** — enter the number of products in the batch (e.g. 1000)
3. Optionally label the batch (e.g. "Testosterone Enanthate Batch #5 — April 2025")
4. Click **Generate** — serials are created and stored in PostgreSQL instantly
5. Click **Download All QR Codes (.zip)** — receives a ZIP with one PNG per serial
6. Hand the ZIP to your print team — one QR code is printed on each product label
7. Monitor scan counts and last-scanned dates in the dashboard

---

## API Reference

### `POST /api/verify` — Public
```json
// Request
{ "serial": "ABCD-EFGH-JKLM" }

// Response (valid)
{ "valid": true, "message": "This is an authentic RenewPeptides product.", "scansCount": 1 }

// Response (invalid)
{ "valid": false, "message": "This serial number was not found." }
```

### `POST /api/generate-serials` — Admin only
```json
// Request
{ "count": 100, "label": "Batch description" }

// Response
{ "ok": true, "batchId": "uuid", "count": 100, "serials": ["XXXX-XXXX-XXXX", ...] }
```

### `GET /api/admin/qr/:serial` — Admin only
Returns a PNG image of the QR code for a single serial.

### `POST /api/admin/qr/batch` — Admin only
```json
// Option A: by batch ID
{ "batchId": "uuid" }

// Option B: specific serials
{ "serials": ["XXXX-XXXX-XXXX", ...] }
```
Returns a ZIP file containing all QR code PNGs.

---

## Security Notes

- Admin JWT stored as httpOnly, Secure, SameSite=Lax cookie (24h expiry)
- Passwords hashed with bcrypt (cost factor 12)
- Serial generation uses `crypto.randomBytes` — unpredictable, non-sequential
- Rate limiting: 10 verification attempts per IP per 15-minute window (DB-backed, safe for serverless)
- All admin routes protected by Next.js middleware JWT verification

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Min 32-char random secret for JWT signing |
| `ADMIN_EMAIL` | ✅ | Admin login email |
| `ADMIN_PASSWORD_HASH` | ✅ | bcrypt hash of admin password |
| `NEXT_PUBLIC_BASE_URL` | ✅ | Base URL for QR code links |
| `RATE_LIMIT_MAX` | ❌ | Max verify attempts/IP/15min (default: 10) |
