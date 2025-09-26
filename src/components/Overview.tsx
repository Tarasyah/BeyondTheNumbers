// src/components/Overview.tsx
'use client';

import { Card, CardContent, CardTitle } from '@/components/ui/card';

// Define a type for the props for better code safety
type OverviewStats = {
  totalKilled: number;
  totalInjured: number;
  childrenKilled: number;
  womenKilled: number;
  killedInWestBank: number;
  childFamine: number;
} | null;


const StatCard = ({ title, value }: { title: string; value: number | undefined | null }) => {
    const displayValue = (value === null || value === undefined) ? 'N/A' : value.toLocaleString();
    return (
        <Card className="bg-card">
            <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-4xl font-bold text-primary">{displayValue}</div>
                <div className="text-sm font-medium text-muted-foreground text-center">{title}</div>
            </CardContent>
        </Card>
    );
};

export function Overview({ stats }: { stats: OverviewStats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
      <StatCard title="Total Killed (Gaza)" value={stats?.totalKilled} />
      <StatCard title="Total Injured (Gaza)" value={stats?.totalInjured} />
      <StatCard title="Children Killed" value={stats?.childrenKilled} />
      <StatCard title="Women Killed" value={stats?.womenKilled} />
      <StatCard title="Child Famine Deaths" value={stats?.childFamine} />
      <StatCard title="Killed in West Bank" value={stats?.killedInWestBank} />
    </div>
  );
}
