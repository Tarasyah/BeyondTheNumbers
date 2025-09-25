'use client';
import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { format, differenceInDays, parseISO } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function CumulativeTimeline({ data }: { data: { date: string, killed_cum: number }[] | null }) {
  const [sliderValue, setSliderValue] = useState(data ? data.length - 1 : 0);

  const validData = useMemo(() => data?.filter(d => d.date && d.killed_cum != null) || [], [data]);

  const filteredData = useMemo(() => {
    if (!validData.length) return [];
    return validData.slice(0, sliderValue + 1);
  }, [validData, sliderValue]);

  if (!validData.length) return <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm"><CardHeader><CardTitle>Cumulative Casualties Over Time</CardTitle></CardHeader><CardContent><div className="text-center py-8">Loading timeline...</div></CardContent></Card>;

  const chartData = {
    labels: filteredData.map(d => format(parseISO(d.date), 'MMM d')),
    datasets: [{
      label: 'Killed',
      data: filteredData.map(d => d.killed_cum),
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
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
           maxTicksLimit: 6,
        },
         border: {
          display: false
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          display: false,
        },
        border: {
          display: false
        }
      },
    },
  };
  
  const currentCasualties = filteredData[filteredData.length - 1]?.killed_cum || 0;
  const startDate = validData.length > 0 ? parseISO(validData[0].date) : new Date();
  const currentDate = validData.length > 0 ? parseISO(validData[sliderValue].date) : new Date();
  const dayNumber = differenceInDays(currentDate, startDate) + 1;

  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm relative">
        <CardHeader>
            <CardTitle>Cumulative Casualties Over Time</CardTitle>
            <CardDescription>Total number of individuals killed in Gaza since the start of the conflict.</CardDescription>
        </CardHeader>
        <CardContent className="relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-7xl font-bold text-red-500">{currentCasualties.toLocaleString()}</div>
                <div className="text-muted-foreground">killed</div>
              </div>
            </div>
            <div className="h-[350px]">
                <Line options={options} data={chartData} />
            </div>
             <div className="mt-8 px-2">
                <Slider
                    min={0}
                    max={validData.length - 1}
                    step={1}
                    value={[sliderValue]}
                    onValueChange={(value) => setSliderValue(value[0])}
                    className="w-full"
                />
                <div className="text-center text-muted-foreground mt-2">
                  {format(currentDate, "MMM d, yyyy")} (Day {dayNumber})
                </div>
            </div>
        </CardContent>
    </Card>
  )
}
