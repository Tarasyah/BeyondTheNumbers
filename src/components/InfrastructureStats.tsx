// src/components/InfrastructureStats.tsx
'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/80 backdrop-blur-sm border border-border/50 p-2 rounded-md shadow-lg text-sm">
                <p className="label font-bold text-foreground">{label}</p>
                <p style={{ color: payload[0].fill }}>{`Damaged: ${payload[0].value.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
};

export function InfrastructureStats({ data }: { data: any | null }) {
    if (!data) return <div>Loading infrastructure data...</div>;

    const chartData = [
        { name: 'Housing', value: data.residential_units },
        { name: 'Educational', value: data.educational_buildings },
        { name: 'Mosques', value: data.mosques },
        { name: 'Churches', value: data.churches },
        { name: 'Government', value: data.government_buildings },
    ].filter(item => item.value > 0).sort((a, b) => a.value - b.value);

    return (
        <Card className="bg-card/50">
            <CardHeader><CardTitle>Infrastructure Damage</CardTitle></CardHeader>
            <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => val.toLocaleString()} />
                        <YAxis type="category" dataKey="name" width={80} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'hsl(var(--primary) / 0.1)'}} content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
