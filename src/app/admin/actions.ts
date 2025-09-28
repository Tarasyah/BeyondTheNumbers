// src/app/admin/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const password = formData.get('password')

  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    revalidatePath('/admin')
    redirect('/admin')
  } else {
    redirect('/feed?error=InvalidPassword')
  }
}

export async function logout() {
  cookies().set('admin_logged_in', 'false', { path: '/', maxAge: -1 })
  revalidatePath('/admin')
  revalidatePath('/')
  redirect('/')
}

export async function approveEntry(id: number) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('guestbook_entries')
    .update({ is_approved: true })
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin')
  revalidatePath('/feed')
  return { success: true, message: 'Message approved!' }
}

export async function unapproveEntry(id: number) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('guestbook_entries')
    .update({ is_approved: false })
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath('/admin')
  // revalidatePath('/feed') // Dihapus untuk mencegah refresh yang tidak perlu
  return { success: true, message: 'Message un-approved!' }
}


export async function deleteEntry(id: number) {
  const supabase = createClient()

  const { error } = await supabase
    .from('guestbook_entries')
    .delete()
    .eq('id', id)

  if (error) {
    return { success: false, message: error.message }
  }
  
  revalidatePath('/admin')
  revalidatePath('/feed')
  return { success: true, message: 'Message deleted!' }
}
