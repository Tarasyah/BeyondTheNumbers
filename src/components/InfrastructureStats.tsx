// src/components/InfrastructureStats.tsx
'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function InfrastructureStats({ data }: { data: any | null }) {
    if (!data) return <div>Loading...</div>;
    const chartData = [
        { name: 'Housing', value: data.residential_units },
        { name: 'Educational', value: data.educational_buildings },
        { name: 'Mosques', value: data.mosques },
        { name: 'Churches', value: data.churches },
        { name: 'Government', value: data.government_buildings },
    ];
    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader><CardTitle>Infrastructure Damage</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={80} stroke="#9ca3af" axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{ backgroundColor: '#1f2937' }} />
                        <Bar dataKey="value" fill="#ef4444" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}