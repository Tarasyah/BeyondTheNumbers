// src/components/CumulativeTimeline.tsx
'use client';

import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { format, parseISO, differenceInDays } from 'date-fns';

type TimelineDataPoint = { date: string; killed_cum: number | null };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 p-2 border border-border/50 rounded-md shadow-lg">
        <p className="label text-sm text-foreground">{`${label}`}</p>
        <p className="intro text-sm text-primary">{`Killed: ${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

export function CumulativeTimeline({ data }: { data: TimelineDataPoint[] | null }) {
  const [sliderValue, setSliderValue] = useState<number[]>([100]);

  const { chartData, startDate, endDate, totalDays } = useMemo(() => {
    if (!data) return { chartData: [], startDate: null, endDate: null, totalDays: 0 };
    
    const filteredData = data
      .filter(d => d.date && d.killed_cum != null)
      .map(d => ({
        fullDate: parseISO(d.date),
        date: format(parseISO(d.date), 'MMM d, yy'),
        Killed: d.killed_cum as number,
      }));

    if (filteredData.length === 0) return { chartData: [], startDate: null, endDate: null, totalDays: 0 };

    const start = filteredData[0].fullDate;
    const end = filteredData[filteredData.length - 1].fullDate;
    const days = differenceInDays(end, start);

    return {
      chartData: filteredData,
      startDate: start,
      endDate: end,
      totalDays: days,
    };
  }, [data]);
  
  const handleSliderChange = (value: number[]) => {
      setSliderValue(value);
  };

  const filteredChartData = useMemo(() => {
    const percentage = sliderValue[0] / 100;
    const endIndex = Math.floor(chartData.length * percentage);
    return chartData.slice(0, endIndex > 0 ? endIndex : 1);
  }, [chartData, sliderValue]);


  if (!chartData || chartData.length === 0) {
    return (
        <Card className="bg-card/50 border-border/20 backdrop-blur-sm">
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

  const activeDataPoint = filteredChartData[filteredChartData.length - 1];
  const sliderDate = activeDataPoint?.fullDate;
  const dayNumber = sliderDate && startDate ? differenceInDays(sliderDate, startDate) : 0;
  
  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden">
      <CardHeader>
        <CardTitle>Cumulative Casualties Over Time</CardTitle>
        <CardDescription>Total number of individuals killed in Gaza since the start of the conflict.</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <div className="h-[350px] pr-12">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredChartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground) / 0.5)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(str) => {
                      const date = parseISO(str);
                      if (isNaN(date.getTime())) return str;
                      if (format(date, 'MMM') === 'Jan') {
                          return format(date, 'yyyy');
                      }
                      return '';
                  }}
                  interval="preserveStartEnd"
                  domain={['dataMin', 'dataMax']}
                  type="category"
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
                
                {activeDataPoint && (
                   <ReferenceLine
                     x={activeDataPoint.date}
                     stroke="hsl(var(--primary))"
                     strokeDasharray="3 3"
                     strokeWidth={1}
                   />
                )}
              </AreaChart>
            </ResponsiveContainer>
             {activeDataPoint && (
                 <div className="absolute" style={{ top: '50%', right: '10px', transform: 'translateY(-50%)', textAlign: 'center' }}>
                     <div className="text-3xl font-bold text-primary">{activeDataPoint.Killed.toLocaleString()}</div>
                     <div className="text-sm text-muted-foreground">killed</div>
                 </div>
             )}
        </div>
        <div className="mt-8 px-4 pb-4">
            <Slider
              defaultValue={[100]}
              value={sliderValue}
              onValueChange={handleSliderChange}
              max={100}
              step={0.1}
            />
             <div className="text-center text-sm text-muted-foreground mt-2">
                {sliderDate ? `${format(sliderDate, 'MMM d, yyyy')} (Day ${dayNumber})` : 'Select a date'}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
