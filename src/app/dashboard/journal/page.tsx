import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getTodayEntry, getEntries } from "@/lib/actions/journal";
import { JournalContent } from "@/components/dashboard/journal/JournalContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diário | LENS",
};

export default async function JournalPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const [todayRes, historyRes] = await Promise.all([
    getTodayEntry(userId),
    getEntries(userId),
  ]);

  if (!todayRes.success || !historyRes.success) {
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">Erro ao carregar diário</h1>
        <p className="text-text-muted mt-2">Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <JournalContent 
      userId={userId} 
      initialToday={todayRes.data} 
      history={historyRes.data} 
    />
  );
}
