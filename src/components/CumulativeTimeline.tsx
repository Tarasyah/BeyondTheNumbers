// src/components/CumulativeTimeline.tsx
'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

type TimelineDataPoint = { date: string; killed_cum: number | null };

export function CumulativeTimeline({ data }: { data: TimelineDataPoint[] | null }) {

  const chartData = useMemo(() => {
    if (!data) return [];
    return data
      .filter(d => d.date && d.killed_cum != null)
      .map(d => ({
        date: format(parseISO(d.date), 'MMM d, yy'),
        Killed: d.killed_cum,
      }));
  }, [data]);
  
  if (!chartData || chartData.length === 0) {
    return (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Cumulative Casualties Over Time</CardTitle>
                <CardDescription>Total number of individuals killed in Gaza since the start of the conflict.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                    <p>Loading timeline data or no data available...</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Cumulative Casualties Over Time</CardTitle>
        <CardDescription>Total number of individuals killed in Gaza since the start of the conflict.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background) / 0.8)',
                    borderColor: 'hsl(var(--border) / 0.5)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="Killed" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorKilled)" />
              </AreaChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}