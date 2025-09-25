
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import type { GazaDailyCasualties } from "@/lib/types"

interface CasualtiesTimelineChartProps {
  data: GazaDailyCasualties[]
}

export function CasualtiesTimelineChart({ data }: CasualtiesTimelineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Casualties Over Time</CardTitle>
        <CardDescription>Total number of killed and injured since Oct 7, 2023.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
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
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
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
