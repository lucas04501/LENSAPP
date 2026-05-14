import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getRankByXP, getXPProgress, getLevelByXP } from "@/types";
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap";
import { getHeatmapData } from "@/lib/actions/habits";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";
import { Flame, Trophy, Zap, Calendar, Target, Award } from "lucide-react";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const userId = (session.user as any).id;

  const [user, heatmapData] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        habits: {
          where: { isArchived: false },
          orderBy: { createdAt: "desc" }
        },
        _count: {
          select: {
            habitLogs: true,
            habits: true,
          }
        }
      }
    }),
    getHeatmapData(userId),
  ]);

  if (!user) redirect("/login");

  const rank = getRankByXP(user.xp);
  const level = getLevelByXP(user.xp);
  const xpProgress = getXPProgress(user.xp);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      {/* ── Header Section ── */}
      <div className="glass rounded-[32px] border border-white/5 p-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple/10 blur-[100px] rounded-full" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-purple to-red p-1 shadow-2xl shadow-purple/20">
            <div className="w-full h-full bg-[#050505] rounded-[22px] flex items-center justify-center">
              <span className="text-4xl font-black text-white italic tracking-tighter">
                {initials}
              </span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                  {user.name}
                </h1>
                <p className="text-text-muted text-sm font-medium">@{user.username}</p>
              </div>
              <EditProfileModal user={user} />
            </div>

            {user.bio && (
              <p className="text-sm text-text-muted max-w-xl leading-relaxed">
                {user.bio}
              </p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <div className="px-3 py-1 rounded-full bg-surface-2 border border-white/5 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-purple" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">{rank.name}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-surface-2 border border-white/5 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-red" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Level {level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-10 space-y-2">
          <div className="flex justify-between text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            <span>Progresso do Nível</span>
            <span>{user.xp} / {xpProgress.next + (user.xp - xpProgress.current)} XP</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple to-red rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-1000"
              style={{ width: `${xpProgress.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total XP", value: user.xp, icon: Zap, color: "#F59E0B" },
          { label: "Maior Streak", value: `${user.longestStreak} d`, icon: Flame, color: "#EF4444" },
          { label: "Hábitos Concluídos", value: user._count.habitLogs, icon: Trophy, color: "#A855F7" },
          { label: "Hábitos Ativos", value: user._count.habits, icon: Calendar, color: "#3B82F6" },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl border border-white/5 p-5">
            <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
            <p className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Habits List ── */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] px-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple" />
            Seus Hábitos
          </h2>
          <div className="space-y-3">
            {user.habits.length === 0 ? (
              <div className="glass rounded-2xl border border-white/5 p-8 text-center">
                <p className="text-xs text-text-muted italic">Nenhum hábito cadastrado.</p>
              </div>
            ) : (
              user.habits.map((habit) => (
                <div key={habit.id} className="glass rounded-xl border border-white/5 p-4 flex items-center gap-4">
                  <span className="text-xl">{habit.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-white uppercase tracking-tight">{habit.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                      <span className="text-[9px] font-bold text-text-muted uppercase">{habit.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-white italic">{habit.currentStreak}d streak</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Heatmap ── */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] px-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple" />
            Consistência
          </h2>
          <div className="glass rounded-3xl border border-white/5 p-6">
            <HabitHeatmap data={heatmapData} />
          </div>
        </div>
      </div>
    </div>
  );
}
