# Master Checklist — Sound Vibe

Status reference: [x] = complete, [ ] = pending

## Core Product
- [x] Admin dashboard available at `/admin`
- [x] Admin can edit navigation items (labels, visibility, order)
- [x] Admin can edit page content stored in JSON files
- [x] Navbar renders dynamically from records (no hardcoding)
- [x] Editing a page title updates Admin list and Navbar
- [x] Uploads: images saved, videos support >10MB via direct-to-storage (Vercel Blob) with local fallback

## Content & Pages
- [x] Landing hero supports image/video
- [x] Gallery supports uploads
- [x] Contact page content editable in Admin
- [x] Custom pages with navigationName reflected in Navbar

## Engineering Quality
- [x] Environment variables documented in README
- [x] Type checking and linting pass
- [x] Build succeeds
- [x] Tests scaffolded

## CI/CD
- [x] GitHub Action: lint, type-check, build, test
- [x] CI validates presence of critical files/routes:
  - `docs/CHECKLIST.md`
  - `README.md`
  - `app/api/pages/route.ts`
  - `app/api/pages/[id]/route.ts`
  - `app/components/DynamicNavigation.tsx`
  - `app/admin/page.tsx`
  - `app/api/upload/route.ts`

## Notes
- JSON-backed CMS chosen for simplicity and portability. Can be upgraded to Prisma/SQLite later without changing UI.
- Upload route uses Vercel Blob when token configured; otherwise falls back to `/public/uploads` for local dev.
