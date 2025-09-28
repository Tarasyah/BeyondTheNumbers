// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // --- LOGIKA PROTEKSI ADMIN BARU ---
  const adminCookie = request.cookies.get('admin_logged_in');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  // Jika user mencoba akses halaman admin (selain halaman login itu sendiri)
  if (isAdminPage && request.nextUrl.pathname !== '/admin/login') {
    // Dan jika cookie tidak ada atau tidak valid
    if (!adminCookie || adminCookie.value !== 'true') {
      // Alihkan (redirect) ke halaman login admin
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  // --- AKHIR LOGIKA PROTEKSI ADMIN ---

  // Jika tidak ada kondisi di atas yang terpenuhi, lanjutkan seperti biasa.
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
