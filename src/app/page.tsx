

import { HeartPulse, ShieldAlert, Users, Home, UserX, Stethoscope, Newspaper } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { getSummary, getGazaDailyCasualties, getInfrastructureDamaged } from "@/lib/api";
import { CasualtiesTimelineChart } from "@/components/dashboard/casualties-timeline-chart";
import { DemographicsChart } from "@/components/dashboard/demographics-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { InfrastructureDamaged } from "@/lib/types";

export default async function DashboardPage() {
  const summaryData = await getSummary();
  const dailyCasualtiesData = await getGazaDailyCasualties();
  const infrastructureResponse = await getInfrastructureDamaged();
  const infrastructureData = infrastructureResponse?.["infrastructure-damaged"] || [];


  const gazaSummary = summaryData.gaza || {};
  const westBankSummary = summaryData.west_bank || {};
  const killedAgeGroups = gazaSummary.killed_age_groups || { child: 0 };
  const killedGenders = gazaSummary.killed_genders || { male: 0, female: 0 };

  const latestStats = {
    killed: gazaSummary.killed?.total || 0,
    injured: gazaSummary.injured?.total || 0,
    children_killed: killedAgeGroups.child || 0,
    medical_killed: gazaSummary.medical_killed || 0,
    press_killed: gazaSummary.press_killed || 0,
    detained: westBankSummary.detained || 0,
  };
  
  const homesDestroyed = infrastructureData.find(item => item.type === "Housing Units" && !item.notes.includes("partially"))?.quantity || 0;
  
  const menKilled = (killedGenders.male || 0) - (killedAgeGroups.child || 0);
  const womenKilled = killedGenders.female || 0;
  const demographicsData = [
    { name: 'Children', value: killedAgeGroups.child || 0, fill: 'hsl(var(--chart-1))' },
    { name: 'Women', value: womenKilled, fill: 'hsl(var(--chart-2))' },
    { name: 'Men', value: menKilled > 0 ? menKilled : 0, fill: 'hsl(var(--chart-3))' },
  ];
  
  const mappedInfrastructureData = [
    { type: 'Housing Units', destroyed: homesDestroyed, damaged: infrastructureData.find(item => item.type === "Housing Units" && item.notes.includes("partially"))?.quantity || 0 },
    { type: 'Hospitals', destroyed: infrastructureData.find(item => item.type === "Hospitals" && !item.notes.includes("damaged"))?.quantity || 0, damaged: infrastructureData.find(item => item.type === "Hospitals" && item.notes.includes("damaged"))?.quantity || 0 },
    { type: 'Schools', destroyed: infrastructureData.find(item => item.type === "Educational facilities" && item.notes.includes("Destroyed"))?.quantity || 0, damaged: infrastructureData.find(item => item.type === "Educational facilities" && item.notes.includes("Damaged"))?.quantity || 0 },
    { type: 'Mosques', destroyed: infrastructureData.find(item => item.type === "Mosques" && item.notes.includes("destroyed"))?.quantity || 0, damaged: infrastructureData.find(item => item.type === "Mosques" && item.notes.includes("damaged"))?.quantity || 0 },
    { type: 'Churches', destroyed: infrastructureData.find(item => item.type === "Churches" && item.notes.includes("destroyed"))?.quantity || 0, damaged: 0 },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Last updated: {gazaSummary.latest_update_date ? new Date(gazaSummary.latest_update_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Killed" value={latestStats.killed} icon={HeartPulse} description="since Oct 7, 2023" />
        <StatCard title="Total Injured" value={latestStats.injured} icon={ShieldAlert} />
        <StatCard title="Children Killed" value={latestStats.children_killed} icon={Users} />
        <StatCard title="Homes Destroyed" value={homesDestroyed} icon={Home} />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <CasualtiesTimelineChart data={dailyCasualtiesData.gazadaily} />
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
            <InfrastructureTable data={mappedInfrastructureData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfrastructureTable({ data }: { data: {type: string, destroyed: number, damaged: number}[] }) {
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
              <TableCell className="text-right">{item.damaged > 0 ? item.damaged.toLocaleString() : '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
