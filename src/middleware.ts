import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const adminCookie = request.cookies.get('admin_logged_in');
  const { pathname } = request.nextUrl;

  // Jika mencoba akses rute /admin (selain /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Dan jika cookie tidak ada atau tidak valid
    if (!adminCookie || adminCookie.value !== 'true') {
      // Alihkan ke halaman login admin
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Jika sudah login di admin dan mencoba akses halaman login, arahkan ke dashboard
  if (pathname === '/admin/login' && adminCookie?.value === 'true') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Hanya jalankan middleware ini untuk rute admin
  matcher: ['/admin', '/admin/:path*'],
};
