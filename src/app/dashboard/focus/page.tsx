import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { FocusTimer } from "@/components/focus/FocusTimer";
import { getFocusToday } from "@/lib/actions/focus";
import { Timer, Zap, Trophy, History, Clock } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function FocusPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;
  const { sessions, stats } = await getFocusToday(userId);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2 italic uppercase">
          Zona de <span className="text-purple">Foco</span>
        </h1>
        <p className="text-text-muted text-sm uppercase tracking-[0.2em]">
          Silencie o mundo. Ative seu potencial.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Tempo total hoje", value: `${stats.totalMinutes} min`, icon: Clock, color: "#A855F7" },
          { label: "Sessões completas", value: stats.totalSessions, icon: Trophy, color: "#EF4444" },
          { label: "XP ganho no foco", value: `+${stats.totalXP} XP`, icon: Zap, color: "#F59E0B" },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl border border-white/5 p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-surface-2 border border-white/5">
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Timer Section */}
      <div className="glass rounded-[32px] border border-white/5 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Timer className="w-64 h-64 text-purple" />
        </div>
        <FocusTimer userId={userId} />
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <History className="w-4 h-4 text-purple" />
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Sessões de Hoje</h2>
        </div>

        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="glass rounded-2xl border border-white/5 p-8 text-center">
              <p className="text-sm text-text-muted italic">Nenhuma sessão registrada hoje. Comece agora!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div 
                key={session.id}
                className="glass rounded-2xl border border-white/5 p-4 flex items-center justify-between group hover:border-purple/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface-2 border border-white/5 flex items-center justify-center">
                    <span className="text-lg">
                      {session.type === "DEEP_WORK" ? "🧠" : session.type === "POMODORO" ? "🍅" : session.type === "FLOW" ? "⚡" : "☕"}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {session.title || (session.type === "DEEP_WORK" ? "Deep Work" : session.type === "POMODORO" ? "Pomodoro" : session.type === "FLOW" ? "Flow Mode" : "Estudo")}
                    </h3>
                    <p className="text-[10px] text-text-muted uppercase tracking-tighter">
                      {format(new Date(session.startedAt), "HH:mm")} • {session.durationMin} minutos
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-purple">+{session.xpEarned} XP</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
