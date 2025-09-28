// src/app/admin/page.tsx
import { AdminDashboardClient } from './dashboard-client';

export const revalidate = 0; // Pastikan halaman ini tidak di-cache

export default async function AdminPage() {
    // TIDAK PERLU CEK COOKIE LAGI DI SINI KARENA SUDAH DIAMANKAN OLEH MIDDLEWARE
    
    // Langsung tampilkan komponen dashboard
    return <AdminDashboardClient />;
}
