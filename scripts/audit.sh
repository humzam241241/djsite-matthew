#!/usr/bin/env bash
set -euo pipefail

ok=1
check() { for p in "$@"; do [ -e "$p" ] && return 0; done; return 1; }

echo "Running local audit..."

test -f cms.manifest.json || { echo "Missing cms.manifest.json"; exit 1; }
test -f docs/CHECKLIST.md || { echo "Missing docs/CHECKLIST.md"; exit 1; }

check app/page.tsx pages/index.tsx || { echo "Missing landing page"; ok=0; }
check app/contact/page.tsx pages/contact.tsx || { echo "Missing contact page"; ok=0; }
check app/services/page.tsx pages/services.tsx || { echo "Missing services page"; ok=0; }
check app/testimonials/page.tsx pages/testimonials.tsx || { echo "Missing testimonials page"; ok=0; }
check app/gallery/page.tsx pages/gallery.tsx || { echo "Missing gallery page"; ok=0; }
check app/about/page.tsx pages/about.tsx || { echo "Missing about page"; ok=0; }
check app/admin/page.tsx pages/admin/index.tsx app/admin/pages/page.tsx || { echo "Missing admin dashboard route"; ok=0; }
check app/api/contact/route.ts pages/api/contact.ts || { echo "Missing contact API route"; ok=0; }
check public/qr.png || { echo "Missing QR code at public/qr.png"; ok=0; }
check branding/logo_black.svg || { echo "Missing branding/logo_black.svg"; ok=0; }
check branding/logo_white.svg || { echo "Missing branding/logo_white.svg"; ok=0; }
check branding/logo_transparent.svg || { echo "Missing branding/logo_transparent.svg"; ok=0; }
check public/sitemap.xml || { echo "Missing public/sitemap.xml"; ok=0; }
check public/robots.txt || { echo "Missing public/robots.txt"; ok=0; }
check app/api/admin/health/route.ts || { echo "Missing admin health endpoint"; ok=0; }

if [ $ok -ne 1 ]; then
  echo "❌ Checklist audit failed. See docs/CHECKLIST.md"
  exit 1
fi
echo "✅ Checklist audit passed."

