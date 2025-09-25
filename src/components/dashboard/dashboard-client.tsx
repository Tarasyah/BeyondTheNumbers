// src/components/dashboard/dashboard-client.tsx
"use client";

import type { Martyr } from "@/lib/types";
import { useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';

// --- Reusable Components ---
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm border border-border/50 p-2 rounded-md shadow-lg text-sm">
        <p className="label font-bold text-foreground">{label}</p>
        {payload.map((pld: any, index: number) => (
           <p key={index} style={{ color: pld.color }}>{`${pld.name}: ${pld.value.toLocaleString()}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, subValue }: { title: string; value: string | number; subValue?: string }) => (
  <Card className="bg-card/50">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-4xl font-bold text-primary">{typeof value === 'number' ? value.toLocaleString() : value}</div>
      {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
    </CardContent>
  </Card>
);

// --- Main Dashboard Client Component ---
type DashboardClientProps = {
  gazaData: any;
  westBankData: any;
  martyrsData: Martyr[];
  infraData: any;
  timelineData: { date: string, killed_cum: number }[] | null;
};

export function DashboardClient({
  gazaData,
  westBankData,
  martyrsData,
  infraData,
  timelineData,
}: DashboardClientProps) {

  // --- Data Processing Memos ---

  const processedTimelineData = useMemo(() => {
    if (!timelineData) return [];
    return timelineData.map(d => ({
      date: format(new Date(d.date), 'MMM d'),
      Killed: d.killed_cum,
    }));
  }, [timelineData]);

  const demographicData = useMemo(() => {
    if (!martyrsData) return { age: [], gender: [] };
    
    const ageGroups: { [key: string]: number } = {
      '0-10': 0, '11-20': 0, '21-30': 0, '31-40': 0, '41-50': 0, '51-60': 0, '61-70': 0, '71+': 0, 'Unknown': 0,
    };
    const genderCount = { male: 0, female: 0, unknown: 0 };

    martyrsData.forEach(martyr => {
      // Gender
      if (martyr.sex === 'm') genderCount.male++;
      else if (martyr.sex === 'f') genderCount.female++;
      else genderCount.unknown++;

      // Age
      const age = martyr.age;
      if (age === null || age === undefined) ageGroups['Unknown']++;
      else if (age <= 10) ageGroups['0-10']++;
      else if (age <= 20) ageGroups['11-20']++;
      else if (age <= 30) ageGroups['21-30']++;
      else if (age <= 40) ageGroups['31-40']++;
      else if (age <= 50) ageGroups['41-50']++;
      else if (age <= 60) ageGroups['51-60']++;
      else if (age <= 70) ageGroups['61-70']++;
      else ageGroups['71+']++;
    });
    
    const sortedAgeData = Object.entries(ageGroups)
      .map(([name, value]) => ({ name, Count: value }))
      .sort((a, b) => {
        if (a.name === 'Unknown') return 1;
        if (b.name === 'Unknown') return -1;
        const aMin = parseInt(a.name.split('-')[0].replace('+', ''));
        const bMin = parseInt(b.name.split('-')[0].replace('+', ''));
        return aMin - bMin;
      });

    return {
      age: sortedAgeData,
      gender: [
          { name: 'Men', value: genderCount.male },
          { name: 'Women', value: genderCount.female },
      ]
    };
  }, [martyrsData]);
  
  const COLORS = ['#DC143C', '#b91c1c'];

  const processedInfraData = useMemo(() => {
      if (!infraData) return [];
      return [
        { name: 'Residential', value: infraData.residential_units || 0 },
        { name: 'Educational', value: infraData.educational_buildings || 0 },
        { name: 'Mosques', value: infraData.mosques || 0 },
        { name: 'Churches', value: infraData.churches || 0 },
        { name: 'Government', value: infraData.government_buildings || 0 },
      ].sort((a,b) => b.value - a.value);
  }, [infraData]);

  // --- Render ---

  return (
    <main className="bg-black text-white p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter">PALESTINE DATA HUB</h1>
        <p className="text-muted-foreground mt-2">Real-time data on the human cost of the conflict.</p>
      </header>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
        <StatCard title="Total Killed (Gaza)" value={gazaData?.killed_cum ?? 'N/A'} />
        <StatCard title="Total Injured (Gaza)" value={gazaData?.injured_cum ?? 'N/A'} />
        <StatCard title="Children Killed" value={gazaData?.killed_children_cum ?? 'N/A'} />
        <StatCard title="Women Killed" value={gazaData?.killed_women_cum ?? 'N/A'} />
        <StatCard title="Killed in West Bank" value={westBankData?.killed_cum ?? 'N/A'} />
      </div>

      {/* --- Charts Grid --- */}
      <div className="space-y-8">
        {/* Timeline Chart */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle>Cumulative Casualties Over Time (Gaza)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] w-full">
            <ResponsiveContainer>
              <AreaChart data={processedTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Killed" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Demographics Charts */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            <Card className="bg-card/50 flex-grow">
              <CardHeader>
                <CardTitle>Age Distribution of Martyrs</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer>
                  <BarChart data={demographicData.age}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="Count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-8">
             <Card className="bg-card/50 flex-grow">
              <CardHeader>
                <CardTitle>Gender Distribution of Martyrs</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] w-full">
                <ResponsiveContainer>
                   <PieChart>
                      <Pie
                        data={demographicData.gender}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                            return (
                              <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                            );
                        }}
                      >
                        {demographicData.gender.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{fontSize: "14px"}} />
                    </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Infrastructure Chart */}
        <Card className="bg-card/50">
            <CardHeader>
                <CardTitle>Infrastructure Damage</CardTitle>
            </CardHeader>
            <CardContent className="h-[350px] w-full">
                <ResponsiveContainer>
                    <BarChart data={processedInfraData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={100} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} background={{ fill: 'hsl(var(--card))' }} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

      </div>
    </main>
  );
}