// src/app/admin/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// This function will use the Master Key (Service Role) to bypass RLS
async function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error('Server configuration error: Missing Supabase environment variables.');
  }
  return createClient(supabaseUrl, serviceKey);
}

export async function approveEntry(id: number) {
  const supabaseAdmin = await createSupabaseAdminClient();
  const { error } = await supabaseAdmin.from('guestbook_entries').update({ is_approved: true }).eq('id', id);
  if (error) return { success: false, message: error.message };
  
  // Revalidate the public feed page so the new message appears
  revalidatePath('/feed');
  return { success: true, message: 'Message approved!' };
}

export async function unapproveEntry(id: number) {
  const supabaseAdmin = await createSupabaseAdminClient();
  const { error } = await supabaseAdmin.from('guestbook_entries').update({ is_approved: false }).eq('id', id);
  if (error) return { success: false, message: error.message };
  // Revalidate the public feed page so the message is removed
  revalidatePath('/feed');
  return { success: true, message: 'Message un-approved!' };
}

export async function deleteEntry(id: number) {
  const supabaseAdmin = await createSupabaseAdminClient();
  const { error } = await supabaseAdmin.from('guestbook_entries').delete().eq('id', id);
  if (error) return { success: false, message: error.message };

  // Revalidate the public feed page to remove the deleted message
  revalidatePath('/feed');
  return { success: true, message: 'Message deleted!' };
}

export async function login(formData: FormData) {
  const password = formData.get('password')

  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    redirect('/admin')
  } else {
    redirect('/feed?error=InvalidPassword')
  }
}

export async function logout() {
  cookies().set('admin_logged_in', 'false', { path: '/', maxAge: -1 })
  redirect('/')
}
