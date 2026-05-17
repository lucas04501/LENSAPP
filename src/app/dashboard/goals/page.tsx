import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getGoals } from "@/lib/actions/goals";
import { GoalsContent } from "@/components/dashboard/goals/GoalsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metas | LENS",
};

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const res = await getGoals(userId);

  if (!res.success || !res.data) {
    return (
      <div className="p-8 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">Erro ao carregar metas</h1>
        <p className="text-text-muted mt-2">Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  return <GoalsContent goals={res.data} userId={userId} />;
}
