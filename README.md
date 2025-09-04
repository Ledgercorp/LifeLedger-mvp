# LifeLedger MVP (Next.js + Supabase)

This folder contains a ready-to-run MVP of LifeLedger.

## Quick start

1. Install Node 18+
2. Run:
```bash
npm install
npm run dev
```
3. Create a Supabase project. Create a **bucket** named `credentials` (Private). Run the SQL from the guide you received.
4. Create a Resend account (or replace email with your SMTP).
5. Copy `.env.example` to `.env.local` and fill in values.

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM="LifeLedger <no-reply@yourdomain.com>"
APP_URL=http://localhost:3000
```

## What works

- Email login (magic link)
- Add credential (with file upload to Supabase Storage)
- Email to issuer with verification link (expires in 14 days)
- Approve/Reject updates status
- Create time-limited share link + QR
- Public viewer page with view counter

---

Generated 2025-09-04T21:31:35.355958Z
