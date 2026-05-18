import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCalendarData } from "@/lib/actions/calendar";
import { CalendarContent } from "@/components/dashboard/calendar/CalendarContent";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const now = new Date();
  const res = await getCalendarData(userId, now.getFullYear(), now.getMonth());

  if (!res.success || !res.data) {
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">Erro ao carregar calendário</h1>
        <p className="text-text-muted mt-2">Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <CalendarContent 
      userId={userId} 
      initialData={res.data} 
    />
  );
}
