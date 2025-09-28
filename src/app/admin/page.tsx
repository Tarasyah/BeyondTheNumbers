import { AdminDashboardClient } from './dashboard-client';
import { Button } from '@/components/ui/button';
import { logout } from './actions';

export const dynamic = 'force-dynamic';

export default function AdminPage() {
    return (
        <div className="container mx-auto p-4 md:p-8 relative">
            {/* FORM LOGOUT DITEMPATKAN DI SINI, DI LUAR KOMPONEN KLIEN */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8">
                <form action={logout}>
                    <Button type="submit" variant="outline">Logout</Button>
                </form>
            </div>
            
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage all guestbook entries.</p>
            </div>
            
            {/* Komponen klien sekarang dipanggil di luar form logout */}
            <AdminDashboardClient />
        </div>
    );
}
