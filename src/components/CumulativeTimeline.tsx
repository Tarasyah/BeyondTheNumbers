// src/components/CumulativeTimeline.tsx
'use client';
import { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { format, parseISO, differenceInDays } from 'date-fns';

type TimelineDataPoint = {
  date: string;
  killed_cum: number;
};

type TimelineProps = {
  data: TimelineDataPoint[] | null;
};

export function CumulativeTimeline({ data }: TimelineProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    const validData = data?.filter(d => d.date && d.killed_cum != null) || [];
    return validData.map((d, index) => ({
      index: index,
      date: parseISO(d.date),
      killed: d.killed_cum,
    }));
  }, [data]);

  useEffect(() => {
    if (chartData.length > 0 && activeIndex === null) {
      setActiveIndex(chartData.length - 1);
    }
  }, [chartData, activeIndex]);

  const handleSliderChange = (value: number[]) => {
    setActiveIndex(value[0]);
  };
  
  const activeData = activeIndex !== null && chartData[activeIndex] ? chartData[activeIndex] : null;
  const firstDate = chartData.length > 0 ? chartData[0].date : null;
  const daysSince = activeData && firstDate ? differenceInDays(activeData.date, firstDate) : 0;


  if (!chartData || chartData.length === 0) {
    return (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Cumulative Casualties Over Time</CardTitle>
                <CardDescription>Total number of individuals killed in Gaza since the start of the conflict.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-[350px] text-gray-400">
                    <p>Loading timeline data or no data available...</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-0 relative h-[450px]">
        <ResponsiveContainer width="100%" height="75%">
          <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="killed"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorKilled)"
              isAnimationActive={false}
            />
            {activeData && (
              <ReferenceLine x={activeData.index} stroke="hsl(var(--primary))" strokeWidth={1} />
            )}
          </AreaChart>
        </ResponsiveContainer>
        
        {activeData && (
          <div className="absolute top-0 left-0 right-0 pointer-events-none p-6">
            <p className="text-sm text-muted-foreground">Cumulative Casualties</p>
            <p className="text-8xl font-black tracking-tighter text-primary">
              {activeData.killed.toLocaleString()}
            </p>
            <p className="text-2xl font-bold text-foreground -mt-2">KILLED</p>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
            <Slider
                min={0}
                max={chartData.length - 1}
                step={1}
                value={[activeIndex ?? chartData.length - 1]}
                onValueChange={handleSliderChange}
                className="w-full"
            />
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-mono text-muted-foreground">
                    {activeData ? format(activeData.date, 'MMMM d, yyyy') : '--'}
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                    Day {daysSince}
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
