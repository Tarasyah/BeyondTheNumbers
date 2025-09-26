// src/app/chronology/page.tsx
import { ChronologyClientPage } from "./chronology-client-page";
import { timelineData, type RawEvent } from "@/lib/timeline-data";

export default async function ChronologyPage() {
    // For now, we are using static data.
    // This could be fetched from a database in the future.
    const events: RawEvent[] = timelineData.timeline;
    return <ChronologyClientPage events={events} />;
}
