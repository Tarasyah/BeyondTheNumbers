// src/app/page.tsx
import { Suspense } from 'react';
import { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from './actions';

// Import your components
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';
import { createClient } from '@/utils/supabase/server';

// A simple loading component
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => <div className="text-center p-8 text-muted-foreground">{text}</div>;

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();
  // Fetch all data in parallel
  const [overviewData, timelineData, ageData, infraResult] = await Promise.all([
    getOverviewStats(),
    getCumulativeCasualties(),
    getAgeDistribution(),
    supabase.from('infrastructure_damaged').select('*').order('date', { ascending: false }).limit(1).single(),
  ]);

  return (
    <main className="bg-background text-foreground p-4 md:p-8 space-y-16">
        <header className="text-center space-y-2">
            <h1 className="text-5xl font-bold tracking-wider">PALESTINE DATA HUB</h1>
            <p className="text-muted-foreground">Real time data on the human cost of the conflict.</p>
        </header>

      {/* Overview Section */}
      <Suspense fallback={<LoadingSpinner text="Loading stats..." />}>
        <Overview stats={overviewData} />
      </Suspense>

      {/* Cumulative Casualties Section */}
      <Suspense fallback={<LoadingSpinner text="Loading timeline..." />}>
          <CumulativeTimeline data={timelineData} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Suspense fallback={<LoadingSpinner text="Loading age distribution..." />}>
            <AgeDistribution data={ageData} />
        </Suspense>
      </div>
      
      <Suspense fallback={<LoadingSpinner text="Loading infrastructure data..." />}>
        <InfrastructureStats data={infraResult.data} />
      </Suspense>
    </main>
  );
}
