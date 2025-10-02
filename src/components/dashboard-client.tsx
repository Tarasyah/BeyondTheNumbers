// src/components/dashboard-client.tsx
"use client";

import { useRef } from 'react';
import type { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from '@/app/actions';
import type { hadiths } from '@/lib/hadiths';
import domtoimage from 'dom-to-image-more';

// Import your components
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

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
  const downloadableContentRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    const node = downloadableContentRef.current;
    if (!node) return;

    try {
        // Callback function to remove borders from all cloned elements
        const onClone = (clonedNode: any) => {
            const elements = clonedNode.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.boxShadow = 'none';
                elements[i].style.border = 'none';
            }
        };

        const dataUrl = await domtoimage.toPng(node, {
            quality: 0.98,
            bgcolor: '#000000', // Solid black background
            width: 960,
            height: node.scrollHeight,
            style: {
                margin: '0',
                padding: '2rem 2rem 6rem 2rem',
                height: '100%', // Ensure full height is captured
            },
            onclone: onClone, // Apply the clone callback
        });

        const link = document.createElement('a');
        link.download = 'palestine-data-hub.png';
        link.href = dataUrl;
        link.click();
    } catch (error) {
        console.error('oops, something went wrong!', error);
    }
  };


  return (
    <main className="space-y-16 p-4 md:p-8">
      
      <div ref={downloadableContentRef}>
        <header className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
                <h1 className="text-5xl font-bold tracking-wider md:text-8xl">
                BEYOND THE <span className="text-primary">NUMBERS</span>
                </h1>
            </div>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            We created the Palestine Data & Memorial Project to ensure that every
            voice is heard and every number is understood.
            </p>
        </header>

        {/* Overview Section */}
        <div className="mt-16">
          <Overview stats={overviewData} />
        </div>

        {/* Cumulative Casualties Section */}
        <div className="mt-16">
          <CumulativeTimeline data={timelineData} />
        </div>

        {/* Random Hadith Section */}
        {randomHadith && (
          <div className="mt-16 p-6 md:p-8">
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

      {/* Download Button Section */}
      <div className="flex justify-center -mt-8">
          <Button onClick={handleDownloadImage} variant="outline">
              <Download className="mr-2" />
              Download Summary
          </Button>
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <AgeDistribution data={ageData} />
      </div>

      {/* Static Hadith Section */}
       <div className="p-6 md:p-8">
          <blockquote className="text-justify font-cabin-sketch text-foreground/90 space-y-4">
              <p className="text-xl md:text-2xl text-primary">
                  The Messenger of Allah صلى الله عليه وسلم said: “Nations are about to unite (and call) each other to set upon you, just as diners are invited to a plate of food.”
              </p>
              <p className="text-xl md:text-2xl text-foreground">
                  A companion asked: “Will it be because of our lack of numbers that day ?”
              </p>
              <p className="text-xl md:text-2xl text-foreground">
                  He صلى الله عليه وسلم said: “Rather, you will be many on that day, but you will be like scum foam (that floats) on the river. Allah will remove the fear of you from the hearts of your enemies and put Wahn into your hearts.”
              </p>
              <p className="text-2xl md:text-3xl text-primary">
                   A companion asked: “O Messenger of Allah, what is Wahn?” <br /> He صلى الله عليه وسلم said: “Love for the dunya and hatred for death.”
              </p>
          </blockquote>
          <footer className="text-center text-muted-foreground mt-6 text-sm font-sans">
              (Narrated by Abu Dawud 4297)
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
