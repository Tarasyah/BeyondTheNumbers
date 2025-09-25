import { HeartPulse, ShieldAlert, Users, Home, UserX, Stethoscope, Newspaper } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { latestStats, historicalData, demographicsData, infrastructureData } from "@/lib/data";
import { CasualtiesTimelineChart } from "@/components/dashboard/casualties-timeline-chart";
import { DemographicsChart } from "@/components/dashboard/demographics-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InfrastructureStats } from "@/lib/types";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date(historicalData[historicalData.length - 1].date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Killed" value={latestStats.killed} icon={HeartPulse} description="since Oct 7, 2023" />
        <StatCard title="Total Injured" value={latestStats.injured} icon={ShieldAlert} />
        <StatCard title="Children Killed" value={latestStats.children_killed} icon={Users} />
        <StatCard title="Homes Destroyed" value={latestStats.homes_destroyed} icon={Home} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <CasualtiesTimelineChart data={historicalData} />
        </div>
        <div className="lg:col-span-3">
          <DemographicsChart data={demographicsData} />
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
         <Card>
           <CardHeader>
             <CardTitle>Targeted Personnel</CardTitle>
             <CardDescription>Non-combatant essential personnel killed.</CardDescription>
           </CardHeader>
           <CardContent className="grid gap-6">
              <div className="flex items-center">
                <Stethoscope className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <p className="font-bold text-xl">{latestStats.medical_killed.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Medical Staff Killed</p>
                </div>
              </div>
              <div className="flex items-center">
                <Newspaper className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <p className="font-bold text-xl">{latestStats.press_killed.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Press Members Killed</p>
                </div>
              </div>
              <div className="flex items-center">
                <UserX className="h-6 w-6 mr-4 text-primary" />
                <div>
                  <p className="font-bold text-xl">{latestStats.detained.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Detained in West Bank</p>
                </div>
              </div>
           </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Infrastructure Damage</CardTitle>
            <CardDescription>Key civilian infrastructure destroyed or damaged.</CardDescription>
          </CardHeader>
          <CardContent>
            <InfrastructureTable data={infrastructureData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfrastructureTable({ data }: { data: InfrastructureStats[] }) {
  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Destroyed</TableHead>
            <TableHead className="text-right">Damaged</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.type}>
              <TableCell className="font-medium">{item.type}</TableCell>
              <TableCell className="text-right text-destructive">{item.destroyed.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.damaged.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
