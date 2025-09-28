// src/app/admin/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminDashboardClient } from './dashboard-client'; // Komponen UI
import { Button } from '@/components/ui/button';
import { logout } from './actions';

export const dynamic = 'force-dynamic'; // Selalu render ulang, jangan gunakan cache

export default async function AdminPage() {
    const cookieStore = cookies();
    const isLoggedIn = cookieStore.get('admin_logged_in')?.value === 'true';

    if (!isLoggedIn) {
        // Jika belum login, arahkan ke halaman login admin
        redirect('/admin/login');
    }

    return (
        <div className="container mx-auto p-4 md:p-8 relative">
            <div className="absolute top-4 right-4">
                <form action={logout}>
                    <Button type="submit" variant="outline">Logout</Button>
                </form>
            </div>
            {/* Komponen klien yang akan mengambil dan menampilkan data */}
            <AdminDashboardClient />
        </div>
    );
}
