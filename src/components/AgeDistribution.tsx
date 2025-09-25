// src/components/AgeDistribution.tsx
'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

type AgePoint = { age_group: string, count: number };

export function AgeDistribution({ data }: { data: AgePoint[] | null }) {
    
    const sortedData = useMemo(() => {
        if (!data) return null;

        const ageOrder = ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81-90", "91-100", "101+", "Unknown"];
        
        return [...data].sort((a, b) => {
            const indexA = ageOrder.indexOf(a.age_group);
            const indexB = ageOrder.indexOf(b.age_group);
            
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            
            return indexA - indexB;
        });
    }, [data]);

    if (!sortedData || sortedData.length === 0) {
      return (
        <Card className="bg-card/50 h-full">
            <CardHeader><CardTitle>Age Distribution of Martyrs</CardTitle></CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>Loading age distribution or no data available...</p>
            </CardContent>
        </Card>
      )
    }
    
    return (
        <Card className="bg-card/50 h-full">
            <CardHeader><CardTitle>Age Distribution of Martyrs</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis dataKey="age_group" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                            contentStyle={{ 
                                backgroundColor: 'hsl(var(--background) / 0.8)',
                                borderColor: 'hsl(var(--border) / 0.5)',
                            }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Number of Casualties"/>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}