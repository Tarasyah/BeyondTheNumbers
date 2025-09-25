'use client';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(ArcElement, Tooltip, Legend);

function StatCard({ title, value }: { title: string, value: number | string }) {
    return (
        <div className="bg-gray-900/50 p-4 rounded-lg text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
          <p className="text-3xl font-bold text-red-500">{value}</p>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
    );
}

export function Overview({ gazaData, westBankData }: { gazaData: any, westBankData: any }) {
  if (!gazaData) return (
      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>Casualties Overview</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-center py-8">Loading overview...</div>
        </CardContent>
      </Card>
  );

  const { killed_cum, killed_children_cum, killed_women_cum, injured_cum } = gazaData;
  const menKilled = killed_cum - (killed_children_cum + killed_women_cum);

  const doughnutData = {
    labels: ['Children', 'Women', 'Men'],
    datasets: [{
      data: [killed_children_cum, killed_women_cum, menKilled],
      backgroundColor: ['#DC143C', '#b91c1c', '#7f1d1d'],
      borderColor: '#000000',
      borderWidth: 2,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom' as const,
            labels: {
                color: '#d1d5db',
                font: {
                    size: 14,
                }
            }
        }
    },
    cutout: '70%',
  }
  
  return (
    <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
            <CardTitle>Casualties Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="grid grid-cols-2 gap-4 lg:col-span-2">
                <StatCard title="Total Killed (Gaza)" value={killed_cum?.toLocaleString() || 'N/A'} />
                <StatCard title="Total Injured (Gaza)" value={injured_cum?.toLocaleString() || 'N/A'} />
                <StatCard title="Children Killed" value={killed_children_cum?.toLocaleString() || 'N/A'} />
                <StatCard title="Women Killed" value={killed_women_cum?.toLocaleString() || 'N/A'} />
                <StatCard title="Killed in West Bank" value={westBankData?.killed_cum?.toLocaleString() || 'N/A'} />
            </div>
            <div className="w-full h-64 lg:h-80 mx-auto">
                <Doughnut data={doughnutData} options={doughnutOptions}/>
            </div>
        </CardContent>
    </Card>
  );
}
