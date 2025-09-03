# Sound Vibe DJ Site

[![CI](https://github.com/yourusername/djsite-matthew/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/djsite-matthew/actions/workflows/ci.yml)

Production-ready Next.js site with Admin CMS, dynamic navigation, large file uploads, and CI.

## Features

- **Next.js App Router** with TypeScript and Tailwind CSS
- **Admin CMS** for managing pages, content, and media
- **Dynamic Navigation** from single source of truth (pages.json)
- **Cloudinary Integration** for reliable image and video uploads
- **Email Contact Form** with Resend integration and rate limiting
- **SEO Optimized** with metadata, sitemap, and robots.txt
- **Accessibility Features** including skip-to-content and proper focus styles
- **QR Code Generation** at build time based on SITE_URL
- **Comprehensive Tests** with Vitest and Playwright
- **CI/CD Pipeline** with GitHub Actions

## Quickstart

1. Install Node.js 20+.
2. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/djsite-matthew.git
   cd djsite-matthew
   ```
3. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```
4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```
5. Start the development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
6. Visit http://localhost:3000

## Routes

- `/` (Landing with QR)
- `/services`
- `/gallery`
- `/testimonials`
- `/about`
- `/contact` (form → POST /api/contact)
- `/admin` (Admin dashboard)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```
# Site
SITE_URL=https://soundvibe.ca
ADMIN_PASSWORD=your-strong-password

# Email
RESEND_API_KEY=__set_in_hosting__
CONTACT_TO_EMAIL=owner@example.com
CONTACT_FROM_EMAIL=SoundVibe <no-reply@soundvibe.site>

# Cloudinary
CLOUDINARY_CLOUD_NAME=__set_in_hosting__
CLOUDINARY_API_KEY=__set_in_hosting__
CLOUDINARY_API_SECRET=__set_in_hosting__
CLOUDINARY_UPLOAD_FOLDER=soundvibe
MAX_VIDEO_MB=100

# Vercel Blob (optional alternative to Cloudinary)
BLOB_READ_WRITE_TOKEN=vercel-blob-rw-token-goes-here-for-local-dev
```

## Development

```bash
# Start development server
pnpm dev

# Type checking only
pnpm type-check

# Linting
pnpm lint
```

## Testing

```bash
# Run unit tests
pnpm test

# Run E2E tests
pnpm dlx playwright install
pnpm test:ui
```

## Building and Deployment

```bash
# Build the project
pnpm build

# Start production server
pnpm start
```

### Deployment to Vercel

1. Connect your GitHub repository to Vercel
2. Set the environment variables from `.env.example` in the Vercel dashboard
3. Deploy!

The QR code will be automatically generated during the build process based on the `SITE_URL` environment variable.

## Media Uploads

Media uploads use Cloudinary for reliable storage and delivery:

1. Set up a Cloudinary account and get your credentials
2. Add the credentials to your environment variables
3. Upload images and videos through the admin interface

## Logo Usage

The site includes three logo variants:

- `logo_black.svg` - For light backgrounds
- `logo_white.svg` - For dark backgrounds
- `logo_transparent.svg` - For any background

These are available in the `/branding` directory and as PNG files in `/public/branding`.

## Content Management

All content is stored in JSON files in the `/content` directory:

- `pages.json` - Page metadata and navigation settings
- `gallery.json` - Gallery images and videos
- `social.json` - Social media links

These files are edited through the admin interface or can be edited directly in development.

## License

This project is proprietary and confidential.