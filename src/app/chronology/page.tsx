// src/app/chronology/page.tsx
import { timelineData, type RawEvent } from "@/lib/timeline-data";
import { ChronologyPageWrapper } from "./chronology-page-wrapper";

export default async function ChronologyPage() {
    // For now, we are using static data.
    // This could be fetched from a database in the future.
    const events: RawEvent[] = timelineData.timeline;
    
    // Render the client-side wrapper and pass the events data
    return <ChronologyPageWrapper events={events} />;
}
