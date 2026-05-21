import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FocusTimer } from "@/components/focus/FocusTimer";
import { getFocusToday } from "@/lib/actions/focus";
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
    <div className="min-h-screen bg-black text-white space-y-12 pb-20 selection:bg-purple-500/30">
      {/* ── Header Telemetry ── */}
      <div className="flex flex-col items-center justify-center pt-8 space-y-2">
        <p className="text-purple-500 font-mono text-[10px] tracking-[0.4em] uppercase">Neural focus protocol // active</p>
        <h1 className="text-2xl font-bold tracking-tight uppercase">Focus Environment</h1>
      </div>

      {/* ── Core Timer Interface ── */}
      <div className="max-w-4xl mx-auto px-6">
        <FocusTimer userId={userId} />
      </div>

      {/* ── Session Analytics (Tactical List) ── */}
      <div className="max-w-2xl mx-auto px-6 space-y-8">
        <div className="grid grid-cols-3 gap-8 pb-8 border-b border-[#1A1A1A]">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest">Cycles Today</p>
            <p className="text-xl font-mono font-semibold">{stats.totalSessions.toString().padStart(2, '0')}</p>
          </div>
          <div className="space-y-1 text-center">
            <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest">Total Focus</p>
            <p className="text-xl font-mono font-semibold">{stats.totalMinutes.toString().padStart(2, '0')}M</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-bold text-[#4B5563] uppercase tracking-widest">XP Yield</p>
            <p className="text-xl font-mono font-semibold text-purple-400">+{stats.totalXP}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold text-[#2D2D3A] uppercase tracking-[0.2em]">Previous Session Logs</h2>
            <span className="text-[9px] font-mono text-[#2D2D3A]">SYSTEM_STABLE</span>
          </div>

          <div className="space-y-1">
            {sessions.length === 0 ? (
              <div className="py-10 text-center border border-dashed border-[#1A1A1A] rounded-md">
                <p className="text-[10px] font-mono text-[#2D2D3A] uppercase tracking-widest">No session data indexed</p>
              </div>
            ) : (
              sessions.map((session) => (
                <div 
                  key={session.id}
                  className="grid grid-cols-12 gap-4 py-4 border-b border-[#1A1A1A] items-center hover:bg-white/[0.02] transition-all px-2"
                >
                  <div className="col-span-1 flex justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50 shadow-[0_0_8px_rgba(168,85,247,0.3)]" />
                  </div>
                  <div className="col-span-7">
                    <h3 className="text-[12px] font-semibold text-zinc-300 uppercase tracking-tight">
                      {session.title || session.type.replace('_', ' ')}
                    </h3>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-[10px] font-mono text-[#4B5563]">
                      {session.durationMin}M
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-[10px] font-mono font-bold text-purple-400/60">
                      +{session.xpEarned} XP
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
