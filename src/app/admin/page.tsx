// src/app/admin/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminDashboardClient } from './dashboard-client';
import { logout } from './actions';
import { createClient } from '@/utils/supabase/server';
import type { Post } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default async function AdminPage() {
    const cookieStore = cookies();
    const isLoggedIn = cookieStore.get('admin_logged_in')?.value === 'true';

    if (!isLoggedIn) {
        // Redirect to the login form at the bottom of the feed page
        redirect('/feed#admin-login');
    }

    const supabase = createClient();
    const { data, error } = await supabase
        .from('posts')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });

    const posts: Post[] = data || [];

    return (
        <div className="container mx-auto p-4 md:p-8 relative">
            <div className="absolute top-4 right-4">
                <form action={logout}>
                    <Button type="submit" variant="outline">Logout</Button>
                </form>
            </div>
            <AdminDashboardClient initialPosts={posts} />
        </div>
    );
}
