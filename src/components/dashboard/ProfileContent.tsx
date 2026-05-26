"use client";

import { motion } from "framer-motion";
import { 
  Zap, Flame, CheckCircle2, Calendar, 
  Target, Award, Clock, Heart, MessageSquare,
  ArrowUpRight
} from "lucide-react";
import { XPCard } from "@/components/gamification/XPCard";
import { HabitHeatmap } from "@/components/dashboard/HabitHeatmap";
import { EditProfileModal } from "@/components/dashboard/EditProfileModal";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface ProfileContentProps {
  data: any;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};
export function ProfileContent({ data }: ProfileContentProps) {
  const { user, habits, totalHabitLogs, activeDays, heatmap } = data;
  const { update } = useSession();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-6 pb-20"
    >
      {/* ── 1. MINIMALIST HEADER ── */}
      <motion.div variants={item} className="flex flex-col md:flex-row items-center justify-between gap-6 p-4">
        <div className="flex items-center gap-6">
          <AvatarUpload 
            currentAvatarUrl={user.avatarUrl} 
            username={user.username} 
            onUpdate={(newUrl) => update({ avatarUrl: newUrl })}
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
              {user.name || user.username}
            </h1>
            <p className="text-text-muted text-xs font-mono uppercase tracking-widest">@{user.username}</p>
            {user.bio && (
              <p className="text-xs text-text-muted max-w-md leading-relaxed mt-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <EditProfileModal user={user} />
        </div>
      </motion.div>

      {/* ── 2. QUICK STATS ── */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "XP Total", value: user.xp.toLocaleString(), color: "#A855F7" },
          { label: "Streak", value: `${user.longestStreak}d`, color: "#EF4444" },
          { label: "Concluídos", value: totalHabitLogs, color: "#22C55E" },
          { label: "Rank", value: user.rank?.name || "INICIANTE", color: "#F59E0B" },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-2/30 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
            <p className="text-lg font-black text-white italic tracking-tighter">{stat.value}</p>
            <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em] mt-0.5">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── 3. XP PROGRESS ── */}
      <motion.div variants={item} className="px-4">
        <XPCard xp={user.xp} />
      </motion.div>

      {/* ── 4. YEARLY CONSISTENCY ── */}
      <motion.div variants={item} className="bg-surface-2/20 border border-white/5 p-6 rounded-[2rem]">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-3.5 h-3.5 text-[#4B5563]" />
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Consistência</h2>
        </div>
        <HabitHeatmap data={heatmap} />
      </motion.div>

      {/* ── 5. ACTIVE HABITS ── */}
      <motion.div variants={item} className="space-y-4 px-4">
        <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
          <Target className="w-3.5 h-3.5" />
          Foco Atual
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {habits.length === 0 ? (
            <p className="text-[10px] text-text-muted italic uppercase tracking-widest">Nenhum hábito rastreado.</p>
          ) : (
            habits.slice(0, 6).map((habit: any) => (
              <div key={habit.id} className="bg-surface-2/40 border border-white/5 p-4 rounded-2xl hover:border-white/10 transition-all flex items-center gap-4">
                <span className="text-xl shrink-0">{habit.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-[11px] font-bold text-white uppercase truncate">{habit.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-mono text-zinc-500">{habit.currentStreak}d streak</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-[9px] font-mono text-zinc-500">{habit.totalCompletions} total</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
