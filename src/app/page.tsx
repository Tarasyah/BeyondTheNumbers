// src/app/page.tsx
"use client";

import { Suspense, useRef } from 'react';
import { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from './actions';
import { hadiths } from '@/lib/hadiths'; // Import hadis
import * as htmlToImage from 'html-to-image';
import { Camera } from 'lucide-react';

// Import your components
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';
import { createClient } from '@/utils/supabase/server';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// A simple loading component
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => <div className="text-center p-8 text-muted-foreground">{text}</div>;

export const revalidate = 0;

// NOTE: This component is now a client component to support the share-as-image functionality.
// Data fetching will happen on the client side. We will show loading spinners.
// This is a temporary solution to make the feature work.
// A better long-term solution would be to pass server-fetched data to a client component.
import { useState, useEffect } from 'react';

type OverviewData = Awaited<ReturnType<typeof getOverviewStats>>;
type TimelineData = Awaited<ReturnType<typeof getCumulativeCasualties>>;
type AgeData = Awaited<ReturnType<typeof getAgeDistribution>>;
type InfraData = { data: any | null, error: any };


export default function HomePage() {
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [ageData, setAgeData] = useState<AgeData | null>(null);
  const [infraResult, setInfraResult] = useState<InfraData | null>(null);
  const [randomHadith, setRandomHadith] = useState<typeof hadiths[0] | null>(null);
  const [loading, setLoading] = useState(true);

  const shareableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const [overview, timeline, age, infra] = await Promise.all([
        getOverviewStats(),
        getCumulativeCasualties(),
        getAgeDistribution(),
        supabase.from('infrastructure_damaged').select('*').order('date', { ascending: false }).limit(1).single(),
      ]);
      
      setOverviewData(overview);
      setTimelineData(timeline);
      setAgeData(age);
      setInfraResult(infra);
      setRandomHadith(hadiths[Math.floor(Math.random() * hadiths.length)]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleShare = () => {
    if (shareableRef.current === null) {
      return;
    }

    htmlToImage.toPng(shareableRef.current, { cacheBust: true, backgroundColor: '#0f1116' })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'palestine-data-hub.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('oops, something went wrong!', err);
      });
  };

  return (
    <main className="bg-background text-foreground p-4 md:p-8 space-y-16">
      <div ref={shareableRef} className="bg-background">
        <header className="text-center space-y-2 pt-8">
            <div className="flex justify-center items-center gap-4">
              <h1 className="text-5xl font-bold tracking-wider">PALESTINE DATA HUB</h1>
              <Button onClick={handleShare} variant="outline" size="icon" className="ml-4">
                  <Camera className="h-5 w-5" />
                  <span className="sr-only">Share as Image</span>
              </Button>
            </div>
            <p className="text-muted-foreground">Real time data on the human cost of the conflict.</p>
        </header>

        {/* Overview Section */}
        <Suspense fallback={<LoadingSpinner text="Loading stats..." />}>
          <div className="p-4 md:p-8">
            <Overview stats={overviewData} />
          </div>
        </Suspense>

        {/* Cumulative Casualties Section */}
        <Suspense fallback={<LoadingSpinner text="Loading timeline..." />}>
          <div className="p-4 md:p-8">
            <CumulativeTimeline data={timelineData} />
          </div>
        </Suspense>

        {/* Random Hadith Section (No Box) */}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Suspense fallback={<LoadingSpinner text="Loading age distribution..." />}>
            <AgeDistribution data={ageData} />
        </Suspense>
      </div>

      {/* Static Hadith Section (No Box) */}
       <div className="p-6 md:p-8">
          <blockquote className="text-center font-cabin-sketch text-foreground/90 space-y-4">
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
      
      <Suspense fallback={<LoadingSpinner text="Loading infrastructure data..." />}>
        <InfrastructureStats data={infraResult?.data} />
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
