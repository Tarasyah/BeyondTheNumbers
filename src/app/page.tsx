// src/app/page.tsx
"use client";

import { Suspense, useRef } from 'react';
import { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from './actions';
import { hadiths } from '@/lib/hadiths'; // Import hadis
import * as htmlToImage from 'html-to-image';
import { Share2 } from 'lucide-react';

// Import your components
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';

// A simple loading component
const LoadingSpinner = ({ text = "Loading..." }: { text?: string }) => <div className="text-center p-8 text-muted-foreground">{text}</div>;

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

  // Ref for the new, hidden shareable element
  const shareableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
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

  const handleShare = async () => {
      const node = shareableRef.current;
      if (!node || !overviewData || !timelineData) {
        console.error("Data or shareable element not ready.");
        return;
      }

      try {
          // The node is already styled and positioned off-screen
          const dataUrl = await htmlToImage.toPng(node, {
              width: 768,
              height: 1200,
              cacheBust: true, // Avoid using cached images
              pixelRatio: 2, // Increase resolution
          });
          
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], "palestine-data-hub.png", { type: "image/png" });

          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                  files: [file],
                  title: 'Beyond the Numbers: Palestine Data Hub',
                  text: 'The latest data on the situation in Palestine.',
              });
          } else {
              // Fallback for desktop browsers
              const link = document.createElement('a');
              link.download = 'palestine-data-hub.png';
              link.href = dataUrl;
              link.click();
          }
      } catch (err) {
          console.error('Oops, something went wrong!', err);
      }
  };


  return (
    <main className="space-y-16 p-4 md:p-8">
      {/* This is the new hidden element for image generation */}
      <div 
        ref={shareableRef} 
        className="absolute left-[-9999px] top-0 overflow-hidden" 
        style={{ width: '768px', height: '1200px', background: '#0f1116', fontFamily: 'Inter, sans-serif', color: 'white', padding: '32px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '-0.025em' }}>BEYOND THE NUMBERS</h1>
          <p style={{ color: '#A1A1AA', maxWidth: '42rem', margin: '0 auto' }}>
            We created the Palestine Data & Memorial Project to ensure that every voice is heard and every number is understood.
          </p>
        </div>
        
        {overviewData && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '48px' }}>
            <StatImageCard title="Killed in Gaza" value={overviewData.totalKilled} />
            <StatImageCard title="Injured in Gaza" value={overviewData.totalInjured} />
            <StatImageCard title="Children Killed" value={overviewData.childrenKilled} />
            <StatImageCard title="Women Killed" value={overviewData.womenKilled} />
            <StatImageCard title="Child Famine Deaths" value={overviewData.childFamine} />
            <StatImageCard title="Killed in West Bank" value={overviewData.killedInWestBank} isPurple={true} />
          </div>
        )}

        {timelineData && timelineData.length > 0 && (
          <>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>Cumulative Casualties Over Time</h2>
            <p style={{ fontSize: '12px', color: '#A1A1AA', marginBottom: '16px' }}>
              *Official reports only tell a small part of this story...
            </p>
            <div style={{ height: '350px', width: '100%' }}>
              <CumulativeChartSVG data={timelineData} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'hsl(348 83% 47%)' }}>{timelineData[timelineData.length - 1].killed_cum?.toLocaleString()}</div>
                <div style={{ fontSize: '18px', color: '#A1A1AA' }}>killed</div>
            </div>
          </>
        )}
      </div>

      <header className="space-y-2 pt-4 text-center">
        <h1 className="text-5xl font-bold tracking-wider md:text-7xl">
          BEYOND THE <span className="text-primary">NUMBERS</span>
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          We created the Palestine Data & Memorial Project to ensure that every
          voice is heard and every number is understood.
        </p>
      </header>

      {/* Overview Section */}
      <Suspense fallback={<LoadingSpinner text="Loading stats..." />}>
        <div className="p-4 md:p-8">
          <Overview stats={overviewData} />
        </div>
      </Suspense>

      {/* Cumulative Casualties Section */}
      <Suspense fallback={<LoadingSpinner text="Loading timeline..." />}>
        <CumulativeTimeline data={timelineData} />
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
    
      <div className="flex justify-center">
        <Button onClick={handleShare} variant="outline" size="lg" className="gap-2">
            <Share2 className="h-5 w-5" />
            <span className="hidden md:inline">Download & Share Summary as Image</span>
            <span className="md:hidden">Share Summary</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <Suspense fallback={<LoadingSpinner text="Loading age distribution..." />}>
            <AgeDistribution data={ageData} />
        </Suspense>
      </div>

      {/* Static Hadith Section (No Box) */}
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
      
      <Suspense fallback={<LoadingSpinner text="Loading infrastructure data..." />}>
        <InfrastructureStats data={infraResult?.data} />
      </Suspense>

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

// --- Helper Components for Image Generation ---

const StatImageCard = ({ title, value, isPurple = false }: { title: string; value: number | undefined | null; isPurple?: boolean }) => {
    const borderColor = isPurple ? '#8A2BE2' : 'hsl(348 83% 47%)';
    return (
        <div style={{ border: `1px solid ${borderColor}`, background: '#18181B', borderRadius: '8px', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: borderColor, lineHeight: '1' }}>
                {(value ?? 0).toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#A1A1AA', marginTop: '8px' }}>{title}</div>
        </div>
    );
};

const CumulativeChartSVG = ({ data }: { data: TimelineData }) => {
    if (!data || data.length === 0) return null;

    const width = 704; // 768 - 32 - 32
    const height = 350;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const maxKilled = Math.max(...data.map(d => d.killed_cum || 0));

    const getX = (index: number) => margin.left + (index / (data.length - 1)) * (width - margin.left - margin.right);
    const getY = (killed: number) => height - margin.bottom - (killed / maxKilled) * (height - margin.top - margin.bottom);

    const pathD = "M" + data.map((d, i) => `${getX(i)},${getY(d.killed_cum || 0)}`).join(" L");

    const areaPathD = pathD + ` L${getX(data.length - 1)},${height - margin.bottom} L${getX(0)},${height - margin.bottom} Z`;

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
          <defs>
              <linearGradient id="shareGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(348 83% 47%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(348 83% 47%)" stopOpacity={0.1} />
              </linearGradient>
          </defs>
          <path d={areaPathD} fill="url(#shareGradient)" />
          <path d={pathD} stroke="hsl(348 83% 47%)" strokeWidth="2" fill="none" />
      </svg>
    );
};
