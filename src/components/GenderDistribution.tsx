// src/components/GenderDistribution.tsx
'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS: { [key: string]: string } = {
    'Men': 'hsl(var(--primary))',
    'Women': 'hsl(var(--primary) / 0.7)',
    'Children': 'hsl(var(--primary) / 0.4)',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent * 100 < 5) return null; // Don't render label for small slices

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export function GenderDistribution({ data }: { data: { category: string, count: number }[] | null }) {
    if (!data) return <div>Loading gender data...</div>;

    return (
        <Card className="bg-card/50 h-full">
            <CardHeader><CardTitle>Gender Distribution of Martyrs</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            labelLine={false}
                            label={renderCustomizedLabel}
                        >
                            {data.map((entry) => <Cell key={`cell-${entry.category}`} fill={COLORS[entry.category] || '#6b7280'} />)}
                        </Pie>
                        <Tooltip
                            contentStyle={{ 
                                backgroundColor: 'hsl(var(--background) / 0.8)',
                                borderColor: 'hsl(var(--border) / 0.5)',
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
