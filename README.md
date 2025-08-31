# djsite-matthew (Sound Vibe)

Starter implementing the legal + technical deliverables.

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
- `/admin` (placeholder)

## Env
Copy `.env.example` to `.env.local` and set values as needed for email provider later.
No secrets are required to run locally.

## Deploy
- Vercel recommended. Set any env vars in dashboard (no secrets in repo!).

## Tests
- `npm test` (Vitest placeholder)
- `npm run test:ui` (Playwright placeholder)
