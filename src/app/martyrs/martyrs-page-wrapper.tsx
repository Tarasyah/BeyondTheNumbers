// src/app/martyrs/martyrs-page-wrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { Martyr } from "@/lib/types";

// Dynamically import the client page with ssr disabled
const MartyrsClientPage = dynamic(
    () => import('./martyrs-client-page').then(mod => mod.MartyrsClientPage),
    {
        ssr: false,
        loading: () => (
            <div className="container mx-auto p-4 md:p-8">
                <div className="text-center my-12 space-y-4">
                    <Skeleton className="h-16 w-3/4 mx-auto" />
                    <Skeleton className="h-12 w-1/2 mx-auto" />
                    <Skeleton className="h-20 w-full max-w-3xl mx-auto" />
                </div>
                <div className="flex flex-col md:flex-row justify-center items-center mb-8 gap-4">
                    <Skeleton className="h-10 w-full max-w-xs" />
                    <Skeleton className="h-10 w-full max-w-xs md:w-[180px]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
            </div>
        )
    }
);

// This is a client component that receives server-fetched data
export function MartyrsPageWrapper({ initialMartyrs }: { initialMartyrs: Martyr[] }) {
    return <MartyrsClientPage initialMartyrs={initialMartyrs} />;
}
