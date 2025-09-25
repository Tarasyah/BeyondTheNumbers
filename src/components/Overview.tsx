// src/components/Overview.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const StatCard = ({ title, value }: { title: string; value: number | null | undefined }) => {
    // Display N/A only if value is truly null or undefined. Show 0 if the value is 0.
    const displayValue = (value === null || value === undefined) ? 'N/A' : value.toLocaleString();
    return (
        <Card className="bg-card/50 text-center">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-4xl font-bold text-primary">{displayValue}</div>
            </CardContent>
        </Card>
    );
};

export function Overview({ gazaData, westBankData }: { gazaData: any, westBankData: any }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            <StatCard title="Total Killed (Gaza)" value={gazaData?.killed_cum} />
            <StatCard title="Total Injured (Gaza)" value={gazaData?.injured_cum} />
            <StatCard title="Children Killed" value={gazaData?.killed_children_cum} />
            <StatCard title="Women Killed" value={gazaData?.killed_women_cum} />
            <StatCard title="Killed in West Bank" value={westBankData?.killed_cum} />
        </div>
    );
}
