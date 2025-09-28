// src/app/admin/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminDashboardClient } from './dashboard-client';
import { createClient } from '@/utils/supabase/server';
import type { GuestbookEntry } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { logout } from './actions';

export const revalidate = 0; // Disable caching for the admin page

export default async function AdminPage() {
    const cookieStore = cookies();
    const isLoggedIn = cookieStore.get('admin_logged_in')?.value === 'true';

    // TAMBAHKAN BARIS INI UNTUK DEBUG
    console.log("ADMIN LOGGED IN (COOKIE):", isLoggedIn);

    if (!isLoggedIn) {
        // Redirect to the feed page where the login form is
        redirect('/feed');
    }

    // Since the user is logged in, we can just render the client component.
    // The client component will be responsible for fetching its own data.
    return (
        <div className="container mx-auto p-4 md:p-8 relative">
            <div className="absolute top-4 right-4">
                <form action={logout}>
                    <Button type="submit" variant="outline">Logout</Button>
                </form>
            </div>
            {/* The client component now fetches its own data */}
            <AdminDashboardClient />
        </div>
    );
}
