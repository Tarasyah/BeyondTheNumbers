// src/app/admin/page.tsx
import { AdminDashboardClient } from './dashboard-client';
import { Button } from '@/components/ui/button';
import { logout } from './actions';

export const revalidate = 0; // Pastikan halaman ini tidak di-cache

export default async function AdminPage() {
    // TIDAK PERLU CEK COOKIE LAGI DI SINI KARENA SUDAH DIAMANKAN OLEH MIDDLEWARE
    
    return (
        <div className="container mx-auto p-4 md:p-8 relative">
            <div className="absolute top-4 right-4">
                <form action={logout}>
                    <Button type="submit" variant="outline">Logout</Button>
                </form>
            </div>
            {/* Langsung tampilkan komponen dashboard */}
            <AdminDashboardClient />
        </div>
    );
}
