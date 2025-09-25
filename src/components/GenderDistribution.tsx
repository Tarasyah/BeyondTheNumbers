// src/components/GenderDistribution.tsx
'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS = { 'Children': '#ef4444', 'Women': '#f97316', 'Men': '#eab308', 'Unknown': '#6b7280' };

export function GenderDistribution({ data }: { data: { category: string, count: number }[] | null }) {
    if (!data) return <div>Loading...</div>
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader><CardTitle>Gender Distribution of Martyrs</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={(entry) => `${((entry.count / total) * 100).toFixed(1)}%`}>
                            {data.map((entry) => <Cell key={`cell-${entry.category}`} fill={COLORS[entry.category]} />)}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}