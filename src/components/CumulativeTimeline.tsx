// src/components/CumulativeTimeline.tsx
'use client';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/80 backdrop-blur-sm border border-border/50 p-2 rounded-md shadow-lg text-sm">
                <p className="label font-bold text-foreground">{label}</p>
                <p style={{ color: payload[0].stroke }}>{`Killed: ${payload[0].value.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
};

export function CumulativeTimeline({ data }: { data: { date: string, killed_cum: number }[] | null }) {
    if (!data) return <div>Loading timeline...</div>;
    
    const chartData = data.map(d => ({
        date: format(new Date(d.date), 'MMM d'),
        Killed: d.killed_cum
    }));

    return (
        <Card className="bg-card/50">
            <CardHeader><CardTitle>Cumulative Casualties Over Time (Gaza)</CardTitle></CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => val.toLocaleString()} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="Killed" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorKilled)" />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
