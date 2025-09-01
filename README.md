# djsite-matthew (Sound Vibe)

Production-ready Next.js site with Admin CMS, dynamic navigation, large file uploads, and CI.

## Quickstart
1. Install Node.js 20+.
2. On Windows, double-click `run_dev.bat` (uses npm). Or run manually:
   ```bash
   npm install
   npm run dev
   ```
3. Visit http://localhost:3000

## Routes
- `/` (Landing with QR)
- `/services`
- `/testimonials`
- `/gallery`
- `/about`
- `/contact` (form -> POST /api/contact)
- `/admin` (Admin dashboard)

## Project Status

See the full checklist in [`docs/CHECKLIST.md`](docs/CHECKLIST.md).

| Item | Status |
|------|:-----:|
| Admin nav + pages edit stays in sync | ✅ |
| Direct-to-storage uploads (images/videos) | ✅ |
| Dynamic Navbar from records | ✅ |
| Admin content CRUD (JSON-backed) | ✅ |
| CI: lint, type-check, build, tests | ✅ |
| CI: audit required files from checklist | ✅ |

## Env
Copy `.env.example` to `.env.local`.

Required:

```
ADMIN_PASSWORD=your-strong-password
# Optional for production uploads; local falls back to /public/uploads
BLOB_READ_WRITE_TOKEN=vercel-blob-rw-token
```

## Deploy
- Vercel recommended. Set any env vars in dashboard (no secrets in repo!).

## Tests
- `npm test` (Vitest placeholder)
- `npm run test:ui` (Playwright placeholder)

## Development

```
npm install
npm run dev
```

Type-check only:

```
npm run type-check
```
