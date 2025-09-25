'use client'; // This component uses client-side interactivity
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function CumulativeTimeline({ data }: { data: any[] | null }) {
  if (!data) return <Card className="bg-gray-900 border-gray-800"><CardHeader><CardTitle>Timeline</CardTitle></CardHeader><CardContent><div className="text-center py-8">Loading timeline...</div></CardContent></Card>;

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [{
      label: 'Killed',
      data: data.map(d => d.killed_cum),
      borderColor: '#DC143C',
      backgroundColor: 'rgba(220, 20, 60, 0.5)',
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 5,
    }],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: '#212121',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#DC143C',
        borderWidth: 1,
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
            <CardTitle>Cumulative Casualties Over Time</CardTitle>
            <CardDescription>Total number of individuals killed since the start of the conflict.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[350px]">
                <Line options={options} data={chartData} />
            </div>
        </CardContent>
    </Card>
  )
}
