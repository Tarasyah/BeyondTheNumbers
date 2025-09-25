"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface DemographicsChartProps {
  data: { name: string; value: number; fill: string }[]
}

export function DemographicsChart({ data }: DemographicsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Victim Demographics</CardTitle>
        <CardDescription>Breakdown of killed civilians.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={{}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                  width={60}
                />
                <Tooltip cursor={{ fill: "hsl(var(--accent) / 0.1)" }} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
