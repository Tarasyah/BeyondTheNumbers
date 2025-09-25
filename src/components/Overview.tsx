// src/components/Overview.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
    <Card className="bg-card/50 text-center">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-4xl font-bold text-primary">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        </CardContent>
    </Card>
);

export function Overview({ gazaData, westBankData }: { gazaData: any, westBankData: any }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            <StatCard title="Total Killed (Gaza)" value={gazaData?.killed_cum ?? 'N/A'} />
            <StatCard title="Total Injured (Gaza)" value={gazaData?.injured_cum ?? 'N/A'} />
            <StatCard title="Children Killed" value={gazaData?.killed_children_cum ?? 'N/A'} />
            <StatCard title="Women Killed" value={gazaData?.killed_women_cum ?? 'N/A'} />
            <StatCard title="Killed in West Bank" value={westBankData?.killed_cum ?? 'N/A'} />
        </div>
    );
}
