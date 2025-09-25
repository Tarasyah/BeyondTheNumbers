
// src/components/CumulativeTimeline.tsx
'use client';
import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { format, differenceInDays, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export function CumulativeTimeline({ data }: { data: { date: string, killed_cum: number }[] | null }) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const chartData = useMemo(() => {
        if (!data) return [];
        // FIX: Filter out items with null date or killed_cum before processing
        const validData = data.filter(d => d.date && d.killed_cum != null);
        if (validData.length === 0) return [];
        
        const startDate = parseISO(validData[0].date);
        return validData.map((d) => ({
            ...d,
            day: differenceInDays(parseISO(d.date), startDate) + 1,
            formattedDate: format(parseISO(d.date), 'MMM dd'),
            fullDate: format(parseISO(d.date), 'MMM dd, yyyy'),
            year: format(parseISO(d.date), 'yyyy'),
        }));
    }, [data]);
    
    // FIX: Handle case where chartData is empty after filtering
    if (!chartData || chartData.length === 0) {
        return (
            <Card className="bg-transparent border-none shadow-none">
                <CardContent className="p-0 relative h-[450px] flex items-center justify-center">
                    <p className="text-muted-foreground">Loading timeline data or no data available...</p>
                </CardContent>
            </Card>
        );
    }
    
    const activeIndex = selectedIndex ?? chartData.length - 1;
    const activeData = chartData[activeIndex];

    const customTicks = useMemo(() => {
      if (chartData.length === 0) return [];
      const ticks = [chartData[0].formattedDate];
      const years = new Set<string>();
      chartData.forEach(d => years.add(d.year));
      
      const yearTicks = Array.from(years).sort();
      yearTicks.forEach(year => {
        const firstEntryOfYear = chartData.find(d => d.year === year);
        if (firstEntryOfYear && !ticks.includes(firstEntryOfYear.formattedDate)) {
           if (chartData.indexOf(firstEntryOfYear) > chartData.length * 0.1) {
             ticks.push(firstEntryOfYear.year);
           }
        }
      });

      if (chartData.length > 0 && !ticks.includes(chartData[chartData.length - 1].formattedDate)) {
          ticks.push('Today');
      }

      return ticks;
    }, [chartData]);

    const formatTick = (tick: any) => {
        if (tick === 'Today' || !isNaN(Number(tick))) return tick;
        const entry = chartData.find(d => d.formattedDate === tick);
        if(entry && entry.formattedDate === chartData[0].formattedDate) return format(parseISO(entry.date), 'MMM dd');
        return '';
    }

    return (
        <Card className="bg-transparent border-none shadow-none">
            <CardContent className="p-0 relative h-[450px]">
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart 
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="formattedDate" 
                            stroke="hsl(var(--muted-foreground))" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            interval="preserveStartEnd"
                            ticks={customTicks}
                            tickFormatter={formatTick}
                        />
                        <YAxis hide={true} domain={['dataMin', 'dataMax']} />
                        <CartesianGrid 
                            vertical={true} 
                            horizontal={false}
                            strokeDasharray="3 3" 
                            stroke="hsl(var(--border) / 0.5)" 
                        />
                         {activeData && (
                           <ReferenceLine 
                             x={activeData.formattedDate} 
                             stroke="hsl(var(--primary))" 
                             strokeDasharray="3 3" 
                           />
                         )}
                        <Area 
                            type="monotone" 
                            dataKey="killed_cum" 
                            stroke="hsl(var(--primary))" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorKilled)" 
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>

                {activeData && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <p className="text-6xl font-bold" style={{color: 'hsl(var(--primary))'}}>
                                {activeData.killed_cum.toLocaleString()}
                            </p>
                            <p className="text-muted-foreground text-lg">killed</p>
                        </div>
                    </div>
                )}
                
                <div className="mt-4 px-4 space-y-2">
                     <Slider
                        min={0}
                        max={chartData.length - 1}
                        step={1}
                        value={[activeIndex]}
                        onValueChange={(value) => setSelectedIndex(value[0])}
                        className="w-full"
                    />
                    {activeData && (
                         <p className="text-center text-muted-foreground text-sm">
                           {activeData.fullDate} (Day {activeData.day})
                         </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
