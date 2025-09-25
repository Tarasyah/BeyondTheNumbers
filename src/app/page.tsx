// app/page.tsx
import { createClient } from '@/utils/supabase/server';
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';

// This tells Next.js to always fetch the latest data on each visit
export const revalidate = 0;

export default async function PalestineDataHub() {
  const supabase = createClient();

  // Fetch all data needed for the dashboard in parallel
  const [
    gazaResult,
    westBankResult,
    martyrsResult,
    infraResult,
    timelineResult
  ] = await Promise.all([
    // Query for Overview
    supabase.from('gaza_daily_casualties').select('*').order('date', { ascending: false }).limit(1).single(),
    supabase.from('west_bank_daily_casualties').select('killed_cum').order('date', { ascending: false }).limit(1).single(),
    // Query for Age Chart
    supabase.from('martyrs').select('age'),
    // Query for Infrastructure
    supabase.from('infrastructure_damaged').select('*').order('date', { ascending: false }).limit(1).single(),
    // Query for Timeline Chart
    supabase.from('gaza_daily_casualties').select('date, killed_cum').order('date', { ascending: true })
  ]);

  return (
    <main className="bg-black text-white p-4 md:p-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-center">GAZA</h1>
        <p className="text-center text-gray-400">Watching. Recording. Remembering.</p>
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
}
