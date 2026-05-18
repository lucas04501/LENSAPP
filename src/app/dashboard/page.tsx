import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardStats } from "@/lib/actions/stats";
import { getHabitsWithTodayStatus, getHeatmapData } from "@/lib/actions/habits";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | LENS",
  description: "Gerencie sua performance e hábitos.",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  // Fetch data in parallel
  const [statsRes, habitsRes, heatmapRes] = await Promise.all([
    getDashboardStats(userId),
    getHabitsWithTodayStatus(userId),
    getHeatmapData(userId),
  ]);

  if (!statsRes.success || !habitsRes.success || !heatmapRes.success) {
    // Basic error handling - could be improved with Error Boundaries
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-red-500">Erro ao carregar dashboard</h1>
        <p className="text-text-muted mt-2">Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  // ONBOARDING REDIRECT
  if (habitsRes.data.length === 0) {
    redirect("/onboarding");
  }

  return (
    <DashboardContent 
      user={session.user as any}
      stats={statsRes.data}
      habitsToday={habitsRes.data}
      heatmapData={heatmapRes.data}
    />
  );
}
