// src/app/page.tsx
import { Suspense } from 'react';
import { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from './actions';
import { hadiths } from '@/lib/hadiths';
import * as htmlToImage from 'html-to-image';
import { Download } from 'lucide-react';
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';
import { createClient } from '@/utils/supabase/server'; // Use server client
import { Button } from '@/components/ui/button';
import { DashboardClient } from '@/components/dashboard-client'; // Import the new client component

// A simple loading component
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => <div className="text-center p-8 text-muted-foreground">{text}</div>;

// The main page is now a Server Component
export default async function HomePage() {
  // Fetch all data on the server
  const supabase = createClient();
  const [overviewData, timelineData, ageData, infraResult, randomHadith] = await Promise.all([
    getOverviewStats(),
    getCumulativeCasualties(),
    getAgeDistribution(),
    supabase.from('infrastructure_damaged').select('*').order('date', { ascending: false }).limit(1).single(),
    Promise.resolve(hadiths[Math.floor(Math.random() * hadiths.length)]) // Keep hadith random
  ]);

  // Pass the fetched data as props to the client component
  return (
    <DashboardClient
      overviewData={overviewData}
      timelineData={timelineData}
      ageData={ageData}
      infraResult={infraResult}
      randomHadith={randomHadith}
    />
  );
}
