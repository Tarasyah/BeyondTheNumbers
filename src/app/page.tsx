// src/app/page.tsx
import { Suspense } from 'react';
import { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from './actions';

// Import your components
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent } from '@/components/ui/card';

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

      {/* Hadith Section */}
      <Card className="border-primary/20 bg-card/50">
        <CardContent className="p-6 md:p-8">
            <blockquote className="text-center font-cabin-sketch text-foreground/90 space-y-4">
                <p className="text-lg md:text-xl">
                    The Prophet ﷺ said: "The people will soon summon one another to attack you as people when eating invite others to share their dish."
                </p>
                <p className="text-lg md:text-xl">
                    Someone asked: "Will that be because of our small numbers at that time?"
                </p>
                <p className="text-lg md:text-xl">
                    He replied: "No, you will be numerous at that time: but you will be scum and rubbish like that carried down by a torrent, and Allah will take fear of you from the breasts of your enemy and cast <span className="text-primary font-bold">wahn</span> into your hearts."
                </p>
                <p className="text-lg md:text-xl">
                    Someone asked: "What is <span className="text-primary font-bold">wahn</span> (enervation), Messenger of Allah ﷺ?"
                </p>
                <p className="text-2xl md:text-3xl text-primary font-bold">
                    He replied: "Love of the world and dislike of death."
                </p>
            </blockquote>
            <footer className="text-center text-muted-foreground mt-6 text-sm font-sans">
                (Narrated by Abu Dawud no. 4297)
            </footer>
        </CardContent>
      </Card>
      
      <Suspense fallback={<LoadingSpinner text="Loading infrastructure data..." />}>
        <InfrastructureStats data={infraResult.data} />
      </Suspense>
    </main>
  );
}
