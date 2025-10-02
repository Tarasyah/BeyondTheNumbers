// src/app/page.tsx
import { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from './actions';
import { hadiths } from '@/lib/hadiths';
import { createClient } from '@/utils/supabase/server'; // Use server client
import { DashboardClient } from '@/components/dashboard-client'; // Import the new client component

// The main page is now a Server Component
export default async function HomePage() {
  // Fetch all data on the server
  const supabase = createClient();
  const [overviewData, timelineData, ageData, infraResult] = await Promise.all([
    getOverviewStats(),
    getCumulativeCasualties(),
    getAgeDistribution(),
    supabase.from('infrastructure_damaged').select('*').order('date', { ascending: false }).limit(1).single(),
  ]);

  // Pass the fetched data as props to the client component
  // Pass all hadiths to the client to handle random selection there
  return (
    <DashboardClient
      overviewData={overviewData}
      timelineData={timelineData}
      ageData={ageData}
      infraResult={infraResult}
      allHadiths={hadiths}
    />
  );
}
