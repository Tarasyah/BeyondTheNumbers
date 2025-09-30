// src/app/chronology/chronology-page-wrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { RawEvent } from "@/lib/timeline-data";

// Dynamically import the client page with ssr disabled
const ChronologyClientPage = dynamic(
    () => import('./chronology-client-page').then(mod => mod.ChronologyClientPage),
    {
        ssr: false,
        loading: () => (
            <div className="p-4 md:p-8 space-y-8">
                <Skeleton className="h-12 w-1/2 mx-auto" />
                <Skeleton className="h-8 w-1/4 mx-auto" />
                <div className="space-y-4 mt-8">
                    <Skeleton className="h-48 w-full md:w-1/2 mx-auto" />
                    <Skeleton className="h-48 w-full md:w-1/2 mx-auto" />
                    <Skeleton className="h-48 w-full md:w-1/2 mx-auto" />
                </div>
            </div>
        )
    }
);

// This is a client component that receives server-fetched data and renders the dynamic component
export function ChronologyPageWrapper({ events }: { events: RawEvent[] }) {
    return <ChronologyClientPage events={events} />;
}
