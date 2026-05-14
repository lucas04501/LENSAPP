import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/lib/actions/stats";
import { getHabitsToday, getHeatmapData } from "@/lib/actions/habits";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch data in parallel
  const [stats, habitsToday, heatmapData] = await Promise.all([
    getDashboardStats(userId),
    getHabitsToday(userId),
    getHeatmapData(userId),
  ]);

  return (
    <DashboardContent 
      user={session.user as any}
      stats={stats}
      habitsToday={habitsToday}
      heatmapData={heatmapData}
    />
  );
}
