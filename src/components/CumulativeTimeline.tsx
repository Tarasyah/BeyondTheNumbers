// src/components/CumulativeTimeline.tsx
'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { format, parseISO, differenceInDays } from 'date-fns';

type TimelineDataPoint = { date: string; killed_cum: number | null };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 p-2 border border-border/50 rounded-md shadow-lg">
        <p className="label text-sm text-foreground">{`${format(parseISO(payload[0].payload.isoDate), 'MMM d, yyyy')}`}</p>
        <p className="intro text-sm text-primary">{`Killed: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};


export function CumulativeTimeline({ data }: { data: TimelineDataPoint[] | null }) {
  const [sliderValue, setSliderValue] = useState<number[]>([100]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  const { chartData, startDate } = useMemo(() => {
    if (!data) return { chartData: [], startDate: null };
    
    const filteredData = data
      .filter(d => d.date && d.killed_cum != null)
      .map(d => ({
        fullDate: parseISO(d.date),
        date: format(parseISO(d.date), 'MMM d'),
        Killed: d.killed_cum as number,
        isoDate: d.date,
      }));

    if (filteredData.length < 2) return { chartData: [], startDate: null };

    const start = filteredData[0].fullDate;

    return {
      chartData: filteredData,
      startDate: start,
    };
  }, [data]);
  
  const handleSliderChange = (value: number[]) => {
      setSliderValue(value);
  };

  const activeDataIndex = useMemo(() => {
    if (chartData.length === 0) return 0;
    const percentage = sliderValue[0] / 100;
    return Math.floor((chartData.length -1) * percentage);
  }, [chartData, sliderValue]);

  const activeDataPoint = useMemo(() => chartData[activeDataIndex], [chartData, activeDataIndex]);
  const activeDate = activeDataPoint?.fullDate;
  const dayNumber = startDate && activeDate ? differenceInDays(activeDate, startDate) + 1 : 0;
  
  const linePositionPercentage = useMemo(() => {
    if (chartData.length <= 1) return 0;
    return (activeDataIndex / (chartData.length - 1)) * 100;
  }, [activeDataIndex, chartData.length]);


  if (!chartData || chartData.length === 0) {
    return (
        <Card className="bg-card">
            <CardHeader>
                <CardTitle>Cumulative Casualties Over Time</CardTitle>
                <CardDescription>Total number of individuals killed in Gaza since the start of the conflict.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[450px] flex items-center justify-center text-muted-foreground">
                    <p>Loading timeline data or no data available...</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-card overflow-hidden">
      <CardHeader>
        <CardTitle>Cumulative Casualties Over Time</CardTitle>
        <CardDescription>Total number of individuals killed in Gaza since the start of the conflict.</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="h-[350px] pr-4 relative" ref={chartContainerRef}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false}
                  tick={false}
                  />
                <YAxis 
                    hide={true}
                    domain={['dataMin', 'auto']}
                 />
                <Tooltip 
                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '3 3' }} 
                    content={<CustomTooltip />} 
                    />
                <Area type="monotone" dataKey="Killed" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorKilled)" />
              </AreaChart>
            </ResponsiveContainer>
             {activeDataPoint && (
                <>
                 <div 
                    className="absolute top-0 bottom-0 w-px bg-primary/80 border-dashed border-2 border-primary pointer-events-none"
                    style={{ 
                      left: `calc(${linePositionPercentage}% - 1px)`,
                      transform: 'translateX(0)', 
                      borderColor: 'hsl(var(--primary))',
                      borderStyle: 'dashed'
                    }}
                 ></div>
                 <div className="absolute top-1/2 text-right pointer-events-none" style={{right: '4rem'}}>
                     <div className="text-4xl font-bold text-primary">{activeDataPoint.Killed.toLocaleString()}</div>
                     <div className="text-lg text-muted-foreground mt-1">killed</div>
                 </div>
                </>
             )}
        </div>
        <div className="mt-8 px-4 pb-4">
            <div className="w-full mx-auto">
              <Slider
                value={sliderValue}
                onValueChange={handleSliderChange}
                max={100}
                step={0.1}
              />
            </div>
            {activeDate && (
              <div className="text-center mt-4 text-muted-foreground">
                {format(activeDate, 'MMM d, yyyy')} (Day {dayNumber})
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
