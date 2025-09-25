'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function AgeDistribution({ data }: { data: { age: number }[] | null }) {
    if (!data) return <Card className="bg-gray-900 border-gray-800"><CardHeader><CardTitle>Age Distribution of Martyrs</CardTitle></CardHeader><CardContent><div className="text-center py-8">Loading age data...</div></CardContent></Card>;

    const ageGroups = {
        '0-10': 0,
        '11-20': 0,
        '21-30': 0,
        '31-40': 0,
        '41-50': 0,
        '51-60': 0,
        '61+': 0,
    };

    data.forEach(martyr => {
        if (martyr.age <= 10) ageGroups['0-10']++;
        else if (martyr.age <= 20) ageGroups['11-20']++;
        else if (martyr.age <= 30) ageGroups['21-30']++;
        else if (martyr.age <= 40) ageGroups['31-40']++;
        else if (martyr.age <= 50) ageGroups['41-50']++;
        else if (martyr.age <= 60) ageGroups['51-60']++;
        else ageGroups['61+']++;
    });

    const chartData = {
        labels: Object.keys(ageGroups),
        datasets: [
            {
                label: 'Number of Martyrs',
                data: Object.values(ageGroups),
                backgroundColor: 'rgba(220, 20, 60, 0.7)',
                borderColor: '#DC143C',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#9ca3af',
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#9ca3af',
                },
            },
        },
    };

    return (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Age Distribution of Martyrs</CardTitle>
                <CardDescription>Breakdown of martyrs by age group.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <Bar options={options} data={chartData} />
                </div>
            </CardContent>
        </Card>
    );
}