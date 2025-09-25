// src/app/martyrs/page.tsx
import { MartyrsClientPage } from "./martyrs-client-page";
import { fetchMartyrs } from "./actions";

export const revalidate = 0; // Revalidate data on every request

export default async function MartyrsPageWrapper() {
    // Fetch only the first page of martyrs for the initial load with default sorting
    const initialMartyrs = await fetchMartyrs({ page: 1, sort: 'latest' });
    return <MartyrsClientPage initialMartyrs={initialMartyrs} />;
}
