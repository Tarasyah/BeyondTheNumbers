// src/app/admin/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
  const password = formData.get('password');

  // Bandingkan password yang diinput dengan yang ada di .env.local
  // Pastikan Anda sudah membuat file .env.local dan mengisi ADMIN_PASSWORD
  if (password === process.env.ADMIN_PASSWORD) {
    // Jika cocok, buat cookie sebagai penanda login
    cookies().set('admin_logged_in', 'true', {
      httpOnly: true, // Cookie tidak bisa diakses dari JavaScript di browser
      secure: process.env.NODE_ENV === 'production', // Hanya kirim via HTTPS di produksi
      maxAge: 60 * 60 * 24, // Cookie berlaku selama 24 jam
      path: '/',
    });
    // Arahkan ke halaman review
    redirect('/admin'); 
  } else {
    // Jika gagal, arahkan kembali ke halaman login dengan pesan error
    redirect('/admin/login?error=InvalidPassword');
  }
}

export async function logout() {
  // Hapus cookie saat logout
  cookies().set('admin_logged_in', 'false', { path: '/', maxAge: -1 });
  redirect('/admin/login');
}
