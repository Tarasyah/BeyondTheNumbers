// src/components/dashboard-client.tsx
"use client";

import { useRef, useState } from 'react';
import type { getOverviewStats, getCumulativeCasualties, getAgeDistribution } from '@/app/actions';
import type { hadiths } from '@/lib/hadiths';
import domtoimage from 'dom-to-image-more';

// Import your components
import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';
import { Button } from '@/components/ui/button';
import { Download, LoaderCircle } from 'lucide-react';

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
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadClick = () => {
    if (!downloadableContentRef.current || isDownloading) {
      return;
    }
    
    setIsDownloading(true);
    
    const node = downloadableContentRef.current;

    // Create a wrapper to enforce tablet width
    const wrapper = document.createElement('div');
    wrapper.style.width = '900px'; 
    // Use the specific dark background color from the body
    wrapper.style.backgroundColor = '#000000'; 
    
    // Clone the original node
    const clonedNode = node.cloneNode(true) as HTMLElement;
    wrapper.appendChild(clonedNode);
    
    // Position the wrapper off-screen
    wrapper.style.position = 'absolute';
    wrapper.style.top = '0';
    wrapper.style.left = '-9999px';
    document.body.appendChild(wrapper);

    // Give the chart a moment to re-render within the new dimensions
    setTimeout(() => {
        domtoimage.toPng(wrapper, {
          quality: 0.98,
          onclone: (clonedDoc: any) => {
            // Ensure no borders or shadows are cloned
            const elements = clonedDoc.getElementsByTagName('*');
            for (let i = 0; i < elements.length; i++) {
                elements[i].style.boxShadow = 'none';
                elements[i].style.border = 'none';
            }
          },
          height: wrapper.scrollHeight + 40 // Add a bit of padding at the bottom
        })
        .then((dataUrl) => {
            const link = document.createElement('a');
            link.download = 'palestine-data-hub.png';
            link.href = dataUrl;
            link.click();
        })
        .catch((error) => {
            console.error('oops, something went wrong!', error);
        })
        .finally(() => {
            // Clean up
            document.body.removeChild(wrapper);
            setIsDownloading(false);
        });
    }, 100); // 100ms delay for chart rendering
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
          <CumulativeTimeline data={timelineData} isDownloading={isDownloading} />
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
      <div className="hidden md:flex justify-center -mt-8 pb-12">
          <Button onClick={handleDownloadClick} variant="destructive" disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <LoaderCircle className="mr-2 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Download className="mr-2" />
                  Download Summary
                </>
              )}
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
