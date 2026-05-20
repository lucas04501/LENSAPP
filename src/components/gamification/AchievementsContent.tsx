"use client";

import { motion } from "framer-motion";
import { Trophy, Lock, Zap, Award, Calendar, CheckCircle2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AchievementsContentProps {
  achievements: any[];
}

const RARITY_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  COMMON:    { label: "Comum",     color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
  RARE:      { label: "Raro",      color: "#3B82F6", bg: "rgba(59,130,246,0.1)",  border: "rgba(59,130,246,0.2)" },
  EPIC:      { label: "Épico",     color: "#A855F7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.2)" },
  LEGENDARY: { label: "Lendário",  color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)" },
};

export function AchievementsContent({ achievements }: AchievementsContentProps) {
  const unlocked = achievements.filter(a => !a.locked);
  const totalXP = unlocked.reduce((acc, a) => acc + a.xpReward, 0);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* ── Header & Stats ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
            <Trophy className="w-8 h-8 text-gold" />
            Suas Conquistas
          </h1>
          <p className="text-text-muted text-sm mt-1 uppercase font-bold tracking-widest">A prova visual da sua evolução constante.</p>
        </div>

        <div className="flex gap-4">
          <div className="glass rounded-2xl border border-white/5 p-4 bg-[#050505] flex flex-col items-center min-w-[120px]">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Desbloqueadas</p>
            <p className="text-2xl font-black text-white italic tracking-tighter">
              {unlocked.length} <span className="text-sm opacity-40">/ {achievements.length}</span>
            </p>
          </div>
          <div className="glass rounded-2xl border border-white/5 p-4 bg-[#050505] flex flex-col items-center min-w-[120px]">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">XP de Conquistas</p>
            <p className="text-2xl font-black text-gold italic tracking-tighter">+{totalXP.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ── Achievements Grid ── */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {achievements.map((ach) => {
          const style = RARITY_STYLES[ach.rarity];
          return (
            <motion.div
              key={ach.id}
              variants={item}
              className={cn(
                "glass rounded-[2rem] border p-6 bg-[#050505] relative overflow-hidden transition-all duration-300 group",
                ach.locked 
                  ? "border-white/5 opacity-40 grayscale" 
                  : "border-white/10 hover:border-white/20 shadow-xl"
              )}
            >
              {!ach.locked && (
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold/5 blur-[40px] rounded-full" />
              )}

              <div className="flex items-start gap-4 mb-4 relative">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl relative shrink-0",
                  ach.locked ? "bg-surface-2 border border-white/5" : "bg-white/5 border border-white/10"
                )}>
                  {ach.locked ? <Lock className="w-6 h-6 text-text-muted opacity-20" /> : ach.icon}
                  
                  {!ach.locked && (
                    <motion.div 
                      layoutId={`glow-${ach.id}`}
                      className="absolute inset-0 rounded-2xl shadow-[0_0_20px_rgba(255,215,0,0.1)]"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span 
                      className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border shrink-0"
                      style={{ color: style.color, backgroundColor: style.bg, borderColor: style.border }}
                    >
                      {style.label}
                    </span>
                    {!ach.locked && (
                      <span className="text-[8px] font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">
                        {format(new Date(ach.unlockedAt), "dd/MM/yy", { locale: ptBR })}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-white italic tracking-tighter uppercase leading-tight group-hover:text-gold transition-colors">
                    {ach.title}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed mb-6 italic">
                &quot;{ach.description}&quot;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-purple/10 border border-purple/20">
                  <Zap className="w-3 h-3 text-purple" />
                  <span className="text-[10px] font-black text-purple uppercase">+{ach.xpReward} XP</span>
                </div>
                
                {ach.locked && (
                  <div className="flex items-center gap-1 opacity-20">
                    <span className="text-[10px] font-black uppercase tracking-widest">Bloqueada</span>
                  </div>
                )}
                {!ach.locked && (
                  <CheckCircle2 className="w-4 h-4 text-green shadow-[0_0_10px_rgba(34,197,94,0.3)]" />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

    </div>
  );
}
