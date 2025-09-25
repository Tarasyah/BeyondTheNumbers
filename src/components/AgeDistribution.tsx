// src/components/AgeDistribution.tsx
'use client';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type AgeDistributionProps = {
  data: { age: number | null }[] | null;
};

export function AgeDistribution({ data }: AgeDistributionProps) {
  const ageGroupData = useMemo(() => {
    if (!data) return null;

    const ageGroups: { [key: string]: number } = {
      '0-10': 0,
      '11-20': 0,
      '21-30': 0,
      '31-40': 0,
      '41-50': 0,
      '51-60': 0,
      '61-70': 0,
      '71+': 0,
      'Unknown': 0,
    };

    for (const martyr of data) {
      const age = martyr.age;
      if (age === null || age === undefined) {
        ageGroups['Unknown']++;
      } else if (age >= 0 && age <= 10) {
        ageGroups['0-10']++;
      } else if (age >= 11 && age <= 20) {
        ageGroups['11-20']++;
      } else if (age >= 21 && age <= 30) {
        ageGroups['21-30']++;
      } else if (age >= 31 && age <= 40) {
        ageGroups['31-40']++;
      } else if (age >= 41 && age <= 50) {
        ageGroups['41-50']++;
      } else if (age >= 51 && age <= 60) {
        ageGroups['51-60']++;
      } else if (age >= 61 && age <= 70) {
        ageGroups['61-70']++;
      } else if (age >= 71) {
        ageGroups['71+']++;
      }
    }
    
    return Object.entries(ageGroups).map(([age_group, count]) => ({ age_group, count }));
    
  }, [data]);

  // Loading state
  if (!ageGroupData || ageGroupData.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Age Distribution of Martyrs</CardTitle>
          <CardDescription>Breakdown of all martyrs by age group.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-gray-400">Loading age data...</div>
        </CardContent>
      </Card>
    );
  }

  const chartData = {
    labels: ageGroupData.map(item => item.age_group),
    datasets: [{
      label: 'Number of Martyrs',
      data: ageGroupData.map(item => item.count),
      backgroundColor: 'rgba(239, 68, 68, 0.7)',
      borderColor: '#ef4444',
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: '#9ca3af' },
      },
    },
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Age Distribution of Martyrs</CardTitle>
        <CardDescription>Breakdown of all martyrs by age group.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <Bar options={options} data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
}
