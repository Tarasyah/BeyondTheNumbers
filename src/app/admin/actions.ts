// src/app/admin/actions.ts
'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// This function will use the Master Key (Service Role) to bypass RLS
async function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // LOG 1: Check if environment variables are readable
  console.log('Attempting to create admin client...');
  if (!supabaseUrl || !serviceKey) {
    console.error('FATAL ERROR: Supabase URL or Service Role Key is MISSING in environment variables on the server.');
    throw new Error('Server configuration error: Missing environment variables.');
  }
  console.log('SUCCESS: Supabase URL and Service Key found.');

  return createClient(supabaseUrl, serviceKey);
}

export async function login(formData: FormData) {
  console.log('--- ACTION: login STARTED ---');
  const password = formData.get('password')

  if (password === process.env.ADMIN_PASSWORD) {
    console.log('SUCCESS: Password is correct. Setting cookie.');
    cookies().set('admin_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })
    revalidatePath('/admin')
    console.log('--- ACTION: login FINISHED, redirecting to /admin ---');
    redirect('/admin')
  } else {
    console.warn('FAILED: Invalid password attempt.');
    console.log('--- ACTION: login FINISHED, redirecting to /feed?error=InvalidPassword ---');
    redirect('/feed?error=InvalidPassword')
  }
}

export async function logout() {
  console.log('--- ACTION: logout STARTED ---');
  cookies().set('admin_logged_in', 'false', { path: '/', maxAge: -1 })
  revalidatePath('/admin')
  revalidatePath('/')
  console.log('--- ACTION: logout FINISHED, redirecting to / ---');
  redirect('/')
}

export async function approveEntry(id: number) {
  console.log(`--- ACTION: approveEntry STARTED for ID: ${id} ---`);
  
  try {
    const supabaseAdmin = await createSupabaseAdminClient();
    
    const { data, error } = await supabaseAdmin
      .from('guestbook_entries')
      .update({ is_approved: true })
      .eq('id', id)
      .select(); // Add .select() for feedback

    // LOG 2: Check for errors from Supabase
    if (error) {
      console.error('Supabase UPDATE Error:', error);
      return { success: false, message: `Database error: ${error.message}` };
    }

    // LOG 3: Check if the data was successfully changed
    console.log('Supabase UPDATE successful. Rows affected:', data);
    
    revalidatePath('/admin');
    revalidatePath('/feed');
    console.log('--- ACTION: approveEntry FINISHED ---');
    return { success: true, message: 'Message approved!' };

  } catch (e: any) {
    console.error('CRITICAL ERROR in approveEntry action:', e);
    return { success: false, message: `Critical action error: ${e.message}` };
  }
}

export async function unapproveEntry(id: number) {
  console.log(`--- ACTION: unapproveEntry STARTED for ID: ${id} ---`);
  
  try {
    const supabaseAdmin = await createSupabaseAdminClient();
    
    const { data, error } = await supabaseAdmin
      .from('guestbook_entries')
      .update({ is_approved: false })
      .eq('id', id)
      .select(); // Add .select() for feedback

    if (error) {
      console.error('Supabase UPDATE Error (Unapprove):', error);
      return { success: false, message: `Database error: ${error.message}` };
    }

    console.log('Supabase UPDATE (Unapprove) successful. Rows affected:', data);
    
    revalidatePath('/admin');
    // We don't revalidate /feed here to prevent the page from jumping
    console.log('--- ACTION: unapproveEntry FINISHED ---');
    return { success: true, message: 'Message un-approved!' };

  } catch (e: any) {
    console.error('CRITICAL ERROR in unapproveEntry action:', e);
    return { success: false, message: `Critical action error: ${e.message}` };
  }
}


export async function deleteEntry(id: number) {
    console.log(`--- ACTION: deleteEntry STARTED for ID: ${id} ---`);

    try {
        const supabaseAdmin = await createSupabaseAdminClient();

        const { error, data } = await supabaseAdmin
            .from('guestbook_entries')
            .delete()
            .eq('id', id)
            .select();

        if (error) {
            console.error('Supabase DELETE Error:', error);
            return { success: false, message: `Database error: ${error.message}` };
        }

        console.log('Supabase DELETE successful. Rows affected:', data);

        revalidatePath('/admin');
        revalidatePath('/feed');
        console.log('--- ACTION: deleteEntry FINISHED ---');
        return { success: true, message: 'Message deleted!' };

    } catch (e: any) {
        console.error('CRITICAL ERROR in deleteEntry action:', e);
        return { success: false, message: `Critical action error: ${e.message}` };
    }
}
