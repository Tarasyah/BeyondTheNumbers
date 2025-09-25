import { getSummary, getDailyCasualties, getInfrastructureDamaged } from "@/lib/api";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export default async function DashboardPage() {
  const summaryData = await getSummary();
  const dailyCasualtiesData = await getDailyCasualties();
  const infrastructureData = await getInfrastructureDamaged();

  return (
    <DashboardClient 
      summaryData={summaryData} 
      dailyCasualtiesData={dailyCasualtiesData}
      infrastructureData={infrastructureData}
    />
  );
}
