// src/components/dashboard/dashboard-client.tsx
"use client";

import { Overview } from '@/components/Overview';
import { CumulativeTimeline } from '@/components/CumulativeTimeline';
import { AgeDistribution } from '@/components/AgeDistribution';
import { InfrastructureStats } from '@/components/InfrastructureStats';

type DashboardClientProps = {
  gazaData: any;
  westBankData: any;
  martyrsData: { age: number | null }[] | null;
  infraData: any;
  timelineData: { date: string, killed_cum: number }[] | null;
};

export function DashboardClient({
  gazaData,
  westBankData,
  martyrsData,
  infraData,
  timelineData,
}: DashboardClientProps) {
  return (
    <main className="bg-black text-white p-4 md:p-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold">GAZA</h1>
        <p className="text-gray-400">Watching. Recording. Remembering.</p>
      </header>
      
      <div className="space-y-8">
        <Overview gazaData={gazaData} westBankData={westBankData} />
        <CumulativeTimeline data={timelineData} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InfrastructureStats data={infraData} />
          <AgeDistribution data={martyrsData} />
        </div>
      </div>
    </main>
  );
}
