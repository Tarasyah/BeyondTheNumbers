"use client"

import { useState, useMemo } from 'react';
import { addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { DailyCasualties } from "@/lib/types"
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface CasualtiesTimelineChartProps {
  data: DailyCasualties[]
}

export function CasualtiesTimelineChart({ data: allCasualtiesData }: CasualtiesTimelineChartProps) {
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const today = new Date();
    if (allCasualtiesData.length > 0) {
      const firstDate = new Date(allCasualtiesData[0].date);
      const lastDate = new Date(allCasualtiesData[allCasualtiesData.length - 1].date);
      return {
        from: firstDate,
        to: lastDate,
      };
    }
    return {
      from: addDays(today, -30),
      to: today,
    };
  });
  
  const filteredCasualties = useMemo(() => {
    if (!date?.from || !date?.to) {
      return allCasualtiesData;
    }
    return allCasualtiesData.filter(d => {
      const eventDate = new Date(d.date);
      return eventDate >= date.from! && eventDate <= date.to!;
    });
  }, [allCasualtiesData, date]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Casualties Over Time</CardTitle>
          <CardDescription>Total killed and injured since Oct 7, 2023.</CardDescription>
        </div>
        <DateRangePicker date={date} onDateChange={setDate} />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredCasualties}
                margin={{
                  top: 5,
                  right: 10,
                  left: 10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => (value / 1000) + 'k'}
                  width={40}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent) / 0.1)" }}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                  name="Killed"
                  type="monotone"
                  dataKey="cumulative_killed"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  name="Injured"
                  type="monotone"
                  dataKey="cumulative_injured"
                  stroke="hsl(var(--muted-foreground))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
