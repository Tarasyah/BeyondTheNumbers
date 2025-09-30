// src/app/chronology/page.tsx
import { timelineData, type RawEvent } from "@/lib/timeline-data";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";

const ChronologyClientPage = dynamic(
    () => import('./chronology-client-page').then(mod => mod.ChronologyClientPage),
    { 
        ssr: false,
        loading: () => <div className="p-4 md:p-8 space-y-8">
            <Skeleton className="h-12 w-1/2 mx-auto" />
            <Skeleton className="h-8 w-1/4 mx-auto" />
            <div className="space-y-4 mt-8">
                <Skeleton className="h-48 w-full md:w-1/2 mx-auto" />
                <Skeleton className="h-48 w-full md:w-1/2 mx-auto" />
                <Skeleton className="h-48 w-full md:w-1/2 mx-auto" />
            </div>
        </div>
    }
);

export default async function ChronologyPage() {
    // For now, we are using static data.
    // This could be fetched from a database in the future.
    const events: RawEvent[] = timelineData.timeline;
    return <ChronologyClientPage events={events} />;
}
