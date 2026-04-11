import { getDashboardData } from "./actions";
import { DashboardClient } from "./dashboard-client";

export default async function AnalyticsPage() {
  const data = await getDashboardData("month");
  return <DashboardClient initialData={data} />;
}
