'use client';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function InfrastructureStats({ data }: { data: any | null }) {
    if (!data) return <Card className="bg-gray-900/50 border-gray-800"><CardHeader><CardTitle>Infrastructure Damage</CardTitle></CardHeader><CardContent><div className="text-center py-8">Loading infrastructure data...</div></CardContent></Card>;

    const infraData = {
        labels: ['Housing', 'Educational', 'Mosques', 'Churches', 'Government'],
        datasets: [
            {
                label: 'Units Damaged or Destroyed',
                data: [
                    data.residential_units,
                    data.educational_buildings,
                    data.mosques,
                    data.churches,
                    data.government_buildings,
                ].map(val => val || 0), // Ensure null/undefined values are treated as 0
                backgroundColor: 'rgba(220, 20, 60, 0.7)',
                borderColor: '#DC143C',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        indexAxis: 'y' as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: '#9ca3af',
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#d1d5db',
                },
            },
        },
    };

    return (
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Infrastructure Damage</CardTitle>
                <CardDescription>Key civilian infrastructure reported as damaged or destroyed.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <Bar options={options} data={infraData} />
                </div>
            </CardContent>
        </Card>
    );
}
