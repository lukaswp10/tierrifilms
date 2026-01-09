import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Proteger rotas do admin (exceto login)
  if (pathname.startsWith('/admin') && pathname !== '/admin') {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie?.value) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      const parts = sessionCookie.value.split('.');
      if (parts.length !== 2) {
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.delete('admin_session');
        return response;
      }

      const sessionData = JSON.parse(
        Buffer.from(parts[0], 'base64').toString('utf-8')
      );

      if (sessionData.exp < Date.now()) {
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.delete('admin_session');
        return response;
      }
    } catch {
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // Proteger APIs do admin
  if (pathname.startsWith('/api/admin') && !pathname.includes('/login')) {
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const parts = sessionCookie.value.split('.');
      if (parts.length !== 2) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }

      const sessionData = JSON.parse(
        Buffer.from(parts[0], 'base64').toString('utf-8')
      );

      if (sessionData.exp < Date.now()) {
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
