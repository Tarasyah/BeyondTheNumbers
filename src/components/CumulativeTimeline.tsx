// src/components/CumulativeTimeline.tsx

'use client';
import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

// Define the expected data structure for each item in the data array
type TimelineDataPoint = {
  date: string;
  killed_cum: number;
};

// Define the props for the component
type TimelineProps = {
  data: TimelineDataPoint[] | null;
};

export function CumulativeTimeline({ data }: TimelineProps) {
  // Use useMemo to filter data only when the 'data' prop changes, improving performance.
  const validData = useMemo(() => data?.filter(d => d.date && d.killed_cum != null) || [], [data]);

  // This is the data formatted specifically for the Recharts component
  const chartData = validData.map(d => ({
    date: format(parseISO(d.date), 'MMM d, yy'), // Format the date for display
    Killed: d.killed_cum, // Assign the cumulative killed number
  }));
  
  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Cumulative Casualties Over Time</CardTitle>
        <CardDescription>Total number of individuals killed in Gaza since the start of the conflict.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          {/* Check if there is data to display */}
          {validData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  {/* Creates the red gradient for the area fill */}
                  <linearGradient id="colorKilled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#d1d5db' }}
                />
                <Area type="monotone" dataKey="Killed" stroke="#ef4444" fillOpacity={1} fill="url(#colorKilled)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            // If no data, display the loading/error message
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Loading timeline data or no data available...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}