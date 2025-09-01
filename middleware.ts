import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/admin'];

function isProtectedPath(pathname: string) {
  return PROTECTED_PATHS.some((base) => pathname === base || pathname.startsWith(base + '/'));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow login API and login page
  if (pathname.startsWith('/api/login') || pathname === '/login') {
    return NextResponse.next();
  }

  // Protect admin pages
  if (isProtectedPath(pathname)) {
    const admin = req.cookies.get('admin')?.value;
    if (admin !== '1') {
      const url = new URL('/login', req.url);
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect write operations to APIs if not authenticated
  if (pathname.startsWith('/api/') && req.method !== 'GET') {
    const admin = req.cookies.get('admin')?.value;
    if (admin !== '1') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/login'
  ]
};


