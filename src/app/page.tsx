
// src/app/page.tsx
import { createClient } from '@/utils/supabase/server';
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { GenderDistribution } from '@/components/GenderDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';

export const revalidate = 0;

export default async function PalestineDataHub() {
  const supabase = createClient();

  try {
    const [
      // Query 1: Get the absolute latest row for total killed/injured
      latestGazaTotalsResult,
      // Query 2: Get the latest row with valid children/women data
      latestGazaDemographicsResult,
      westBankResult,
      ageDistributionResult,
      genderDistributionResult,
      infraResult,
      // FIX: Aggressively filter for valid data on the server to ensure the component receives clean data.
      timelineResult
    ] = await Promise.all([
      supabase.from('gaza_daily_casualties').select('killed_cum, injured_cum').order('date', { ascending: false }).limit(1).single(),
      supabase.from('gaza_daily_casualties').select('killed_children_cum, killed_women_cum').not('killed_children_cum', 'is', null).not('killed_women_cum', 'is', null).order('date', { ascending: false }).limit(1).single(),
      supabase.from('west_bank_daily_casualties').select('killed_cum').order('date', { ascending: false }).limit(1).single(),
      supabase.rpc('get_age_distribution'),
      supabase.rpc('get_gender_distribution'),
      supabase.from('infrastructure_damaged').select('*').order('date', { ascending: false }).limit(1).single(),
      supabase.from('gaza_daily_casualties').select('date, killed_cum').not('killed_cum', 'is', null).order('date', { ascending: true })
    ]);

    // Combine the results from the two Gaza queries
    const gazaData = {
      ...latestGazaTotalsResult.data,
      ...latestGazaDemographicsResult.data,
    };
    
    if (latestGazaTotalsResult.error) console.error('Error fetching Gaza totals:', latestGazaTotalsResult.error);
    if (latestGazaDemographicsResult.error) console.error('Error fetching Gaza demographics:', latestGazaDemographicsResult.error);
    if (timelineResult.error) console.error('Error fetching timeline data:', timelineResult.error);


    return (
      <main className="bg-[#111] text-white p-4 md:p-8 space-y-16">
        <header className="text-center space-y-2">
            <h1 className="text-5xl font-bold tracking-wider">PALESTINE DATA HUB</h1>
            <p className="text-gray-400">Real time data on the human cost of the conflict.</p>
        </header>

        <Overview gazaData={gazaData} westBankData={westBankResult.data} />
        <CumulativeTimeline data={timelineResult.data} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <AgeDistribution data={ageDistributionResult.data} />
            </div>
            <GenderDistribution data={genderDistributionResult.data} />
        </div>
        
        <InfrastructureStats data={infraResult.data} />
      </main>
    );

  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return <main className="bg-black text-white h-screen flex items-center justify-center"><h1 className="text-2xl text-red-500">Failed to load dashboard data.</h1></main>;
  }
}
