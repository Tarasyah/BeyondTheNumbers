// src/app/page.tsx

// Corrected import paths to work from within the 'src' directory
import { createClient } from '@/utils/supabase/server';
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';

// This tells Next.js to always fetch the latest data on each visit
export const revalidate = 0;

export default async function PalestineDataHub() {
  const supabase = createClient();

  // It's good practice to wrap data fetching in a try...catch block
  try {
    // Fetch all data needed for the dashboard in parallel
    const [
      gazaResult,
      westBankResult,
      martyrsResult,
      infraResult,
      timelineResult
    ] = await Promise.all([
      // Query for Overview
      supabase
        .from('gaza_daily_casualties')
        .select('killed_cum, injured_cum, killed_children_cum, killed_women_cum')
        .order('date', { ascending: false })
        .limit(1)
        .single(),
      // Query for West Bank in Overview
      supabase
        .from('west_bank_daily_casualties')
        .select('killed_cum')
        .order('date', { ascending: false })
        .limit(1)
        .single(),
      // Query for Age Chart
      supabase.from('martyrs').select('age'),
      // Query for Infrastructure
      supabase.from('infrastructure_damaged').select('*').order('date', { ascending: false }).limit(1).single(),
      // Query for Timeline Chart
      supabase.from('gaza_daily_casualties').select('date, killed_cum').order('date', { ascending: true })
    ]);

    // Check for errors after fetching
    if (gazaResult.error || westBankResult.error || martyrsResult.error || infraResult.error || timelineResult.error) {
      console.error("Error fetching data from Supabase:", {
        gazaError: gazaResult.error,
        westBankError: westBankResult.error,
        martyrsError: martyrsResult.error,
        infraError: infraResult.error,
        timelineError: timelineResult.error
      });
      throw new Error("Failed to fetch dashboard data.");
    }
    
    return (
      <main className="bg-black text-white p-4 md:p-8 space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold">GAZA</h1>
          <p className="text-gray-400">Watching. Recording. Remembering.</p>
        </header>
        
        <div className="space-y-8">
          <Overview gazaData={gazaResult.data} westBankData={westBankResult.data} />
          <CumulativeTimeline data={timelineResult.data} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InfrastructureStats data={infraResult.data} />
            <AgeDistribution data={martyrsResult.data} />
          </div>
        </div>
      </main>
    );

  } catch (error) {
    console.error(error);
    // Return a user-friendly error message if data fetching fails
    return (
      <main className="bg-black text-white h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl text-red-500">Failed to load data</h1>
        <p className="text-gray-400">Could not connect to the database. Please try again later.</p>
      </main>
    );
  }
}
