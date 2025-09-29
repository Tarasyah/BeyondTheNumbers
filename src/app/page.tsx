// src/app/page.tsx
import { Suspense } from 'react';
import { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from './actions';
import { hadiths } from '@/lib/hadiths'; // Import hadis

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

  // Select a random hadith on the server
  const randomHadith = hadiths[Math.floor(Math.random() * hadiths.length)];

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

      {/* Random Hadith Section (No Box) */}
      <div className="p-6 md:p-8">
          <blockquote className="text-center font-im-fell text-foreground/90 space-y-4">
              <p className="text-xl md:text-2xl">
                  "{randomHadith.text}"
              </p>
          </blockquote>
          <footer className="text-center text-muted-foreground mt-6 text-sm font-sans">
              ({randomHadith.narrator})
          </footer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Suspense fallback={<LoadingSpinner text="Loading age distribution..." />}>
            <AgeDistribution data={ageData} />
        </Suspense>
      </div>

      {/* Static Hadith Section (No Box) */}
       <div className="p-6 md:p-8">
          <blockquote className="text-center font-cabin-sketch text-foreground/90 space-y-4">
              <p className="text-lg md:text-xl text-primary">
                  The Prophet ﷺ said: The people will soon summon one another to attack you as people when eating invite others to share their dish.
              </p>
              <p className="text-lg md:text-xl text-foreground">
                  Someone asked: Will that be because of our small numbers at that time?
              </p>
              <p className="text-lg md:text-xl text-foreground">
                  He replied: No, you will be numerous at that time: but you will be scum and rubbish like that carried down by a torrent, and Allah will take fear of you from the breasts of your enemy and last enervation into your hearts.
              </p>
              <p className="text-2xl md:text-3xl text-primary">
                   Someone asked: What is wahn (enervation). <br /> Messenger of Allah ﷺ: He replied: Love of the world and dislike of death.
              </p>
          </blockquote>
          <footer className="text-center text-muted-foreground mt-6 text-sm font-sans">
              (Narrated by Abu Dawud no. 4297)
          </footer>
      </div>
      
      <Suspense fallback={<LoadingSpinner text="Loading infrastructure data..." />}>
        <InfrastructureStats data={infraResult.data} />
      </Suspense>

      {/* Quran Verse Section */}
      <div className="pt-16 pb-8">
          <blockquote className="text-center font-fredericka-the-great text-2xl md:text-3xl text-primary">
             "And We said to the wrongdoers: 'Taste the punishment of hell which you previously denied'"
          </blockquote>
           <footer className="text-center text-muted-foreground mt-4 text-sm font-sans">
              (QS. Saba: 42)
          </footer>
      </div>
    </main>
  );
}
