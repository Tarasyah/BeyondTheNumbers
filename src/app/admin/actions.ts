// src/app/admin/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = formData.get('password');

  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    redirect('/admin'); 
  } else {
    // Redirect back to the feed page with an error
    redirect('/feed?error=InvalidPassword');
  }
}

export async function logout() {
  cookies().set('admin_logged_in', 'false', { path: '/', maxAge: -1 });
  redirect('/');
}
