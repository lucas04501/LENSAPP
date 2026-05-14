import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { RANKS, getRankByXP } from "@/types";
import { RanksContent } from "@/components/dashboard/RanksContent";

export default async function RanksPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, name: true }
  });

  if (!user) redirect("/login");

  const currentRank = getRankByXP(user.xp);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic uppercase">
          Hierarquia de <span className="text-purple">Poder</span>
        </h1>
        <p className="text-text-muted text-sm uppercase tracking-[0.2em]">
          Evolua seu foco, transcenda seus limites.
        </p>
      </div>

      <RanksContent 
        userXp={user.xp} 
        currentRankId={currentRank.id} 
      />
    </div>
  );
}
