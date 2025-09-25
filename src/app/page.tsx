// src/app/page.tsx

import { createClient } from '@/utils/supabase/server';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

// This tells Next.js to always fetch the latest data on each visit
export const revalidate = 0;

export default async function PalestineDataHub() {
  const supabase = createClient();

  try {
    const [
      gazaResult,
      westBankResult,
      martyrsResult,
      infraResult,
      timelineResult
    ] = await Promise.all([
      supabase.from('gaza_daily_casualties').select('killed_cum, injured_cum, killed_children_cum, killed_women_cum').order('date', { ascending: false }).limit(1).single(),
      supabase.from('west_bank_daily_casualties').select('killed_cum').order('date', { ascending: false }).limit(1).single(),
      supabase.from('martyrs').select('age'),
      supabase.from('infrastructure_damaged').select('*').order('date', { ascending: false }).limit(1).single(),
      supabase.from('gaza_daily_casualties').select('date, killed_cum').order('date', { ascending: true })
    ]);

    // Error checking for each query
    if (gazaResult.error) throw new Error(`Gaza Error: ${gazaResult.error.message}`);
    if (westBankResult.error) throw new Error(`West Bank Error: ${westBankResult.error.message}`);
    if (martyrsResult.error) throw new Error(`Martyrs Error: ${martyrsResult.error.message}`);
    if (infraResult.error) throw new Error(`Infrastructure Error: ${infraResult.error.message}`);
    if (timelineResult.error) throw new Error(`Timeline Error: ${timelineResult.error.message}`);
    
    // Pass all data to a single client component
    return (
      <DashboardClient
        gazaData={gazaResult.data}
        westBankData={westBankResult.data}
        martyrsData={martyrsResult.data}
        infraData={infraResult.data}
        timelineData={timelineResult.data}
      />
    );

  } catch (error) {
    console.error("Critical error fetching dashboard data:", error);
    return (
      <main className="bg-black text-white h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl text-red-500">Failed to Load Dashboard Data</h1>
        <p className="text-gray-400 mt-2">Could not fetch the necessary data from the database.</p>
        <p className="text-gray-500 text-sm mt-4">{(error as Error).message}</p>
      </main>
    );
  }
}
