# Master Build & Delivery Checklist — djsite-matthew

## Core Pages (Required)
- [ ] Landing page with clear CTA (`/app/page.tsx` or `/pages/index.tsx`)
- [ ] Contact page with working form (`/app/contact/page.tsx` or `/pages/contact.tsx`)
- [ ] Services page: Weddings, Corporate Parties, Photo Booth, Sports (`/app/services/page.tsx` or `/pages/services.tsx`)
- [ ] Testimonials page (`/app/testimonials/page.tsx` or `/pages/testimonials.tsx`)
- [ ] Media Gallery page (`/app/gallery/page.tsx` or `/pages/gallery.tsx`)
- [ ] About / Referrals page (`/app/about/page.tsx` or `/pages/about.tsx`)
- [ ] Admin dashboard for content CRUD (`/app/admin/page.tsx` or `/pages/admin/index.tsx`)

## Features & Functionality
- [ ] QR code linking to landing page (`/public/qr.png`)
- [ ] Branding: colors & typography in Tailwind config
- [ ] Social links in header/footer (`/content/social.json`)
- [ ] Responsive/mobile-friendly (360, 768, 1024, 1440)

## Contact Form
- [ ] API endpoint (`/app/api/contact/route.ts` or `/pages/api/contact.ts`)
- [ ] Validates name, email, message
- [ ] Rate-limits submissions; optional captcha
- [ ] Sends email via provider (Resend/SendGrid/SES)
- [ ] UI success/failure states
- [ ] Logs submissions to file or DB

## Content Model
- [ ] `/content/services.json` with 4 categories
- [ ] `/content/testimonials.json`
- [ ] `/content/gallery.json` (image/video items)
- [ ] `/content/about.json`
- [ ] `/content/social.json`
- [ ] Admin reads/writes JSON or DB

## Logo Deliverables
- [ ] `/branding/logo_black.svg`
- [ ] `/branding/logo_white.svg`
- [ ] `/branding/logo_transparent.svg`
- [ ] PNG previews in `/public/branding/`

## SEO & Accessibility
- [ ] Metadata (title/meta/OG) on all pages
- [ ] `/public/sitemap.xml`
- [ ] `/public/robots.txt`
- [ ] Alt text for images; labels & ARIA
- [ ] Keyboard navigation support

## Testing
- [ ] Unit tests (Jest/Vitest)
- [ ] E2E contact form (Playwright)
- [ ] Optional visual regression baseline

## CI/CD & Repo Hygiene
- [ ] GitHub Action workflow: `.github/workflows/ci.yml`
- [ ] ESLint + Prettier configs
- [ ] TypeScript `strict` enabled
- [ ] `.env.example` committed (no secrets)
- [ ] `README.md` with setup/run/test/deploy + checklist link

## Deployment
- [ ] Production deploy target documented (Vercel)
- [ ] Env vars set in hosting provider
- [ ] Domain mapped to deploy
- [ ] QR code points to domain root

## QA Script (Manual)
- [ ] Click all nav links; verify active state
- [ ] Submit contact form valid/invalid; confirm email
- [ ] Gallery lazy-load + responsiveness
- [ ] Verify admin CRUD for services/testimonials/gallery/about

---
