// src/app/martyrs/page.tsx
import { fetchMartyrs } from "./actions";
import { MartyrsPageWrapper } from "./martyrs-page-wrapper";

export const revalidate = 0; // Revalidate data on every request

export default async function MartyrsPage() {
    // Fetch only the first page of martyrs for the initial load with default sorting
    const initialMartyrs = await fetchMartyrs({ page: 1, sort: 'latest' });
    
    // Render the client-side wrapper and pass the initial data
    return <MartyrsPageWrapper initialMartyrs={initialMartyrs} />;
}
