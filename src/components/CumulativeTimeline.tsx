// src/components/CumulativeTimeline.tsx
'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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

// Custom hook for count-up animation when value changes
const useAnimatedValue = (endValue: number, duration = 300) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    const valueRef = useRef(0);

    useEffect(() => {
        const startValue = valueRef.current;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const currentValue = Math.floor(startValue + (endValue - startValue) * progress);
            setAnimatedValue(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setAnimatedValue(endValue);
                valueRef.current = endValue;
            }
        };

        requestAnimationFrame(animate);

        return () => { valueRef.current = endValue; };

    }, [endValue, duration]);

    return animatedValue;
}


export function CumulativeTimeline({ data }: { data: TimelineDataPoint[] | null }) {
  const [sliderValue, setSliderValue] = useState<number[]>([100]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('hsl(348 83% 47%)'); // Default primary color

  useEffect(() => {
    // This ensures the chart only renders on the client, triggering the animation.
    setIsClient(true);
    
    // On the client, read the CSS variable for the primary color
    if (typeof window !== 'undefined') {
        const computedStyle = getComputedStyle(document.documentElement);
        const hslValue = computedStyle.getPropertyValue('--primary').trim();
        // The value might be in the format '348 83% 47%', so we wrap it in hsl()
        if (hslValue) {
            setPrimaryColor(`hsl(${hslValue})`);
        }
    }
  }, []);
  
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
  const animatedKilledCount = useAnimatedValue(activeDataPoint?.Killed ?? 0, 300);
  
  const linePositionPercentage = useMemo(() => {
    if (chartData.length <= 1) return 0;
    return (activeDataIndex / (chartData.length - 1)) * 100;
  }, [activeDataIndex, chartData.length]);


  if (!chartData || chartData.length === 0 || !isClient) {
    return (
        <div className="p-4 md:p-8">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">Cumulative Casualties Over Time</h2>
            <p className="text-xs text-muted-foreground mt-2">*Official reports only tell a small part of this story. A study by Dr. Gideon Polya and Dr. Richard Hill projects a potential 680,000 Palestinian deaths by April 2025—a figure that reveals the death toll from the humanitarian crisis is far greater than we know.</p>
            <div className="h-[450px] flex items-center justify-center text-muted-foreground mt-4">
                <p>Loading timeline data or no data available...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="overflow-hidden">
        <div className="p-4 md:p-8 space-y-2">
            <h2 className="text-2xl font-semibold leading-none tracking-tight">Cumulative Casualties Over Time</h2>
            <p className="text-xs text-muted-foreground mt-2">*Official reports only tell a small part of this story. A study by Dr. Gideon Polya and Dr. Richard Hill projects a potential 680,000 Palestinian deaths by April 2025—a figure that reveals the death toll from the humanitarian crisis is far greater than we know.</p>
        </div>
      <div className="relative px-4 md:px-8">
        <div className="h-[350px] pr-4 relative" ref={chartContainerRef}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0.1}/>
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
                    cursor={{ stroke: primaryColor, strokeWidth: 1, strokeDasharray: '3 3' }} 
                    content={<CustomTooltip />} 
                    />
                <Area type="monotone" dataKey="Killed" stroke={primaryColor} strokeWidth={2} fillOpacity={1} fill="url(#colorKilled)" isAnimationActive={true} animationDuration={2500} />
              </AreaChart>
            </ResponsiveContainer>
             {activeDataPoint && (
                <>
                 <div 
                    className="absolute top-0 bottom-0 w-px bg-primary/80 pointer-events-none"
                    style={{ 
                      left: `calc(${linePositionPercentage}% - 1px)`,
                      transform: 'translateX(0)', 
                      borderColor: primaryColor,
                      borderStyle: 'dashed'
                    }}
                 ></div>
                 <div className="absolute top-2/3 -translate-y-1/2 text-right pointer-events-none" style={{right: '4rem'}}>
                     <div className="text-[3rem] md:text-6xl font-bold text-primary">{animatedKilledCount.toLocaleString()}</div>
                     <div className="text-xl text-muted-foreground mt-1">killed</div>
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
      </div>
    </div>
  );
}
