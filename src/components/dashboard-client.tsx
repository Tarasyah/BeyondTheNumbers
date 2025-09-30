// src/components/dashboard-client.tsx
"use client";

import { useRef } from 'react';
import type { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from '@/app/actions';
import type { hadiths } from '@/lib/hadiths';

// Import your components
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';

type OverviewData = Awaited<ReturnType<typeof getOverviewStats>>;
type TimelineData = Awaited<ReturnType<typeof getCumulativeCasualties>>;
type AgeData = Awaited<ReturnType<typeof getAgeDistribution>>;
type InfraResult = { data: any | null, error: any }; // Simplified type for infra result


// The new client component that receives all data as props
export function DashboardClient({
  overviewData,
  timelineData,
  ageData,
  infraResult,
  randomHadith,
}: {
  overviewData: OverviewData;
  timelineData: TimelineData;
  ageData: AgeData;
  infraResult: InfraResult;
  randomHadith: typeof hadiths[0];
}) {

  return (
    <main className="space-y-16 p-4 md:p-8">
      
      <header className="text-center">
        <h1 className="text-4xl font-bold tracking-wider md:text-7xl">
          BEYOND THE <span className="text-primary">NUMBERS</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          We created the Palestine Data & Memorial Project to ensure that every
          voice is heard and every number is understood.
        </p>
      </header>

      {/* Overview Section */}
      <Overview stats={overviewData} />

      {/* Cumulative Casualties Section */}
      <CumulativeTimeline data={timelineData} />

      {/* Random Hadith Section */}
      {randomHadith && (
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
      )}
    
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <AgeDistribution data={ageData} />
      </div>

      {/* Static Hadith Section */}
       <div className="p-6 md:p-8">
          <blockquote className="text-justify font-cabin-sketch text-foreground/90 space-y-4">
              <p className="text-xl md:text-2xl text-primary">
                  The Prophet ﷺ said: The people will soon summon one another to attack you as people when eating invite others to share their dish.
              </p>
              <p className="text-xl md:text-2xl text-foreground">
                  Someone asked: Will that be because of our small numbers at that time?
              </p>
              <p className="text-xl md:text-2xl text-foreground">
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
      
      <InfrastructureStats data={infraResult?.data} />

      {/* Quran Verse Section */}
      <div className="pb-8">
          <blockquote className="text-center font-fredericka-the-great text-2xl md:text-3xl text-primary">
             "And We said to the wrongdoers: 'Taste the punishment of hell which you previously denied'"
          </blockquote>
           <footer className="text-center text-muted-foreground mt-4 text-sm font-sans">
              (QS. Saba: 42)
           </footer>
      </div>

      {/* Data Source Section */}
      <div className="pt-12 pb-4 text-center">
        <p className="font-lato text-xs text-muted-foreground">
          All data on dashboard is sourced from the Palestine Datasets project by Tech For Palestine, compiled from various official sources including the Gaza Ministry of Health and UN OCHA. 
          <a href="https://data.techforpalestine.org/docs/killed-in-gaza/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">
            View the full methodology
          </a>.
        </p>
      </div>
    </main>
  );
}
