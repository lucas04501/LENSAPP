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
  const { user, habits, totalHabitLogs, activeDays, recentPosts, heatmap } = data;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20"
    >
      {/* ── 1. HEADER DO PERFIL ── */}
      <motion.div variants={item} className="glass rounded-[32px] border border-white/5 p-8 relative overflow-hidden bg-[#050505]">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple/10 blur-[100px] rounded-full" />
        
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Avatar */}
          <AvatarUpload 
            currentAvatar={user.avatarUrl} 
            name={user.name || user.username} 
            size="lg"
          />

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                  {user.name || user.username}
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
                <Award className="w-3.5 h-3.5" style={{ color: user.rank?.color || "#A855F7" }} />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {user.rank?.name || "INICIANTE"}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full bg-surface-2 border border-white/5 flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-red" />
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Nível {user.level}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. STATS CARDS ── */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "XP Total", value: user.xp.toLocaleString(), icon: Zap, color: "#A855F7" },
          { label: "Maior Streak", value: `${user.longestStreak} dias`, icon: Flame, color: "#EF4444" },
          { label: "Habit Logs", value: totalHabitLogs, icon: CheckCircle2, color: "#22C55E" },
          { label: "Dias Ativos", value: activeDays, icon: Calendar, color: "#F59E0B" },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl border border-white/5 p-5 bg-[#050505]">
            <stat.icon className="w-5 h-5 mb-3" style={{ color: stat.color }} />
            <p className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── 3. BARRA DE XP E NÍVEL ── */}
      <motion.div variants={item}>
        <XPCard xp={user.xp} />
      </motion.div>

      {/* ── 4. HEATMAP ── */}
      <motion.div variants={item} className="glass rounded-3xl border border-white/5 p-6 bg-[#050505]">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-4 h-4 text-purple" />
          <h2 className="text-xs font-black text-white uppercase tracking-[0.2em]">Consistência Anual</h2>
        </div>
        <HabitHeatmap data={heatmap} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── 5. HÁBITOS DO USUÁRIO ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] px-1 flex items-center gap-2">
            <Target className="w-4 h-4 text-purple" />
            Hábitos Ativos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {habits.length === 0 ? (
              <div className="col-span-full glass rounded-2xl border border-white/5 p-8 text-center bg-[#050505]">
                <p className="text-xs text-text-muted italic">Nenhum hábito ativo encontrado.</p>
              </div>
            ) : (
              habits.map((habit: any) => (
                <div key={habit.id} className="glass rounded-2xl border border-white/5 p-4 bg-[#050505] hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{habit.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-xs font-bold text-white uppercase tracking-tight line-clamp-1">{habit.title}</h3>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{habit.category}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-surface-2 border border-white/5">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Streak</p>
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red" />
                        <span className="text-xs font-bold text-white">{habit.currentStreak}d</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-surface-2 border border-white/5">
                      <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider mb-1">Total</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green" />
                        <span className="text-xs font-bold text-white">{habit.totalCompletions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── 6. POSTS RECENTES ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] px-1 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple" />
            Posts Recentes
          </h2>
          <div className="space-y-3">
            {recentPosts.length === 0 ? (
              <div className="glass rounded-2xl border border-white/5 p-8 text-center bg-[#050505]">
                <p className="text-xs text-text-muted italic">Nenhum post recente.</p>
              </div>
            ) : (
              recentPosts.map((post: any) => (
                <div key={post.id} className="glass rounded-2xl border border-white/5 p-4 bg-[#050505] hover:border-white/10 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-text-muted" />
                      <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ptBR })}
                      </span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-purple/10 border border-purple/20 text-[9px] font-bold text-purple uppercase tracking-widest">
                      {post.type}
                    </div>
                  </div>
                  <p className="text-sm text-text-primary line-clamp-2 mb-4 leading-relaxed italic">
                    &quot;{post.content}&quot;
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-red" />
                        <span className="text-xs font-bold text-text-muted">{post.likesCount}</span>
                      </div>
                    </div>
                    <button className="text-[10px] font-bold text-purple uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                      Ver Post <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
