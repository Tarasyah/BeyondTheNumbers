// src/app/page.tsx
import { createClient } from '@/utils/supabase/server';
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { GenderDistribution } from '@/components/GenderDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';

// Selalu ambil data terbaru setiap kali halaman dikunjungi
export const revalidate = 0;

export default async function PalestineDataHub() {
  const supabase = createClient();

  try {
    // Ambil semua data yang dibutuhkan secara bersamaan untuk performa maksimal
    const [
      gazaPrimaryResult,
      gazaSecondaryResult,
      westBankResult,
      ageDistributionResult,
      genderDistributionResult,
      infraResult,
      timelineResult
    ] = await Promise.all([
      // Query 1: Get the absolute latest row for primary stats
      supabase.from('gaza_daily_casualties').select('killed_cum, injured_cum').order('date', { ascending: false }).limit(1).single(),
      // Query 2: Get the latest row that has valid data for children and women
      supabase.from('gaza_daily_casualties').select('killed_children_cum, killed_women_cum').not('killed_children_cum', 'is', null).not('killed_women_cum', 'is', null).order('date', { ascending: false }).limit(1).single(),
      supabase.from('west_bank_daily_casualties').select('killed_cum').order('date', { ascending: false }).limit(1).single(),
      supabase.rpc('get_age_distribution'),
      supabase.rpc('get_gender_distribution'),
      supabase.from('infrastructure_damaged').select('*').order('date', { ascending: false }).limit(1).single(),
      supabase.from('gaza_daily_casualties').select('date, killed_cum').not('killed_cum', 'is', null).order('date', { ascending: true })
    ]);
    
    // Smartly merge the two Gaza data results
    const gazaData = {
      ...gazaPrimaryResult.data,
      ...gazaSecondaryResult.data,
    };

    return (
      <main className="bg-[#111] text-white p-4 md:p-8 space-y-16">
        <header className="text-center space-y-2">
            <h1 className="text-5xl font-bold tracking-wider">PALESTINE DATA HUB</h1>
            <p className="text-gray-400">Real time data on the human cost of the conflict.</p>
        </header>

        <Overview gazaData={gazaData} westBankData={westBankResult.data} />
        <CumulativeTimeline data={timelineResult.data} />

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
             <AgeDistribution data={ageDistributionResult.data} />
        </div>
        
        <InfrastructureStats data={infraResult.data} />
      </main>
    );

  } catch (error) {
    console.error(error);
    return <main className="bg-black text-white h-screen flex items-center justify-center"><h1 className="text-2xl text-red-500">Gagal memuat data dashboard.</h1></main>;
  }
}
