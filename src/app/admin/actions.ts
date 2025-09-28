// src/app/admin/actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import type { GuestbookEntry } from '@/lib/types';

// Fungsi untuk membuat client Supabase dengan hak akses penuh (kunci master)
async function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Supabase URL or Service Role Key is missing.');
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    }
  });
}

// Action untuk login
export async function login(formData: FormData) {
  const password = formData.get('password');
  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_logged_in', 'true', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        maxAge: 60 * 60 * 24, // 24 jam
        path: '/' 
    });
    redirect('/admin'); // Arahkan ke halaman admin utama
  } else {
    redirect('/admin/login?error=InvalidPassword');
  }
}

// Action untuk logout
export async function logout() {
  cookies().set('admin_logged_in', '', { maxAge: -1, path: '/' });
  redirect('/admin/login');
}

// Action untuk mengambil semua entri
export async function getAllEntries(): Promise<GuestbookEntry[]> {
    const supabaseAdmin = await createSupabaseAdminClient();
    const { data, error } = await supabaseAdmin
        .from('guestbook_entries')
        .select('*')
        .order('is_approved', { ascending: true })
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching all entries:", error.message);
        return [];
    }
    return data;
}

// Action untuk menyetujui entri
export async function approveEntry(id: number) {
  const supabaseAdmin = await createSupabaseAdminClient();
  const { error } = await supabaseAdmin.from('guestbook_entries').update({ is_approved: true }).eq('id', id);
  if (error) return { success: false, message: error.message };
  
  revalidatePath('/feed');   
  return { success: true };
}

// Action untuk membatalkan persetujuan entri
export async function unapproveEntry(id: number) {
  const supabaseAdmin = await createSupabaseAdminClient();
  const { error } = await supabaseAdmin.from('guestbook_entries').update({ is_approved: false }).eq('id', id);
  if (error) return { success: false, message: error.message };

  revalidatePath('/feed');
  return { success: true };
}

// Action untuk menghapus entri
export async function deleteEntry(id: number) {
  const supabaseAdmin = await createSupabaseAdminClient();
  const { error } = await supabaseAdmin.from('guestbook_entries').delete().eq('id', id);
  if (error) return { success: false, message: error.message };

  revalidatePath('/feed');   
  return { success: true };
}
