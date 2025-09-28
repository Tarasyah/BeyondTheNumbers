// src/app/admin/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = formData.get('password');

  // Compare the input password with the one in .env.local
  if (password === process.env.ADMIN_PASSWORD) {
    // If it matches, create a cookie to mark the user as logged in
    cookies().set('admin_logged_in', 'true', {
      httpOnly: true, // The cookie can't be accessed by client-side JS
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      maxAge: 60 * 60 * 24, // Cookie is valid for 24 hours
      path: '/',
    });
    // Redirect to the main admin page
    redirect('/admin'); 
  } else {
    // If it fails, redirect back to the feed page with an error
    redirect('/feed?error=InvalidPassword#admin-login');
  }
}

export async function logout() {
  // Delete the cookie on logout
  cookies().set('admin_logged_in', 'false', { maxAge: -1, path: '/' });
  redirect('/feed');
}
