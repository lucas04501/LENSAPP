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

const HexagonBadge = ({ icon: Icon, locked, rarityColor }: { icon: any, locked: boolean, rarityColor: string }) => (
  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-2xl">
      <path
        d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z"
        fill="transparent"
        stroke={locked ? "#222" : rarityColor}
        strokeWidth="1.5"
        className={cn(locked ? "" : "shadow-[inset_0_0_15px_rgba(168,85,247,0.2)]")}
      />
    </svg>
    {locked ? (
      <Lock strokeWidth={1.5} className="w-5 h-5 text-[#222]" />
    ) : (
      <Icon strokeWidth={1.5} className="w-6 h-6 text-white relative z-10" />
    )}
  </div>
);

export function AchievementsContent({ achievements }: AchievementsContentProps) {
  const unlocked = achievements.filter(a => !a.locked);
  const totalXP = unlocked.reduce((acc, a) => acc + a.xpReward, 0);

  return (
    <div className="space-y-12 pb-20 max-w-5xl mx-auto selection:bg-purple-500/30">
      
      {/* ── Header & Stats ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#1A1A1A]">
        <div>
          <p className="text-purple-500 font-mono text-[10px] tracking-[0.4em] uppercase mb-2">Registry // Performance Milestones</p>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Active Achievements</h1>
        </div>

        <div className="flex gap-10">
          <div className="flex flex-col items-center">
            <p className="text-[9px] font-bold text-[#4B5563] uppercase tracking-[0.2em] mb-1">Index</p>
            <p className="text-xl font-mono font-semibold text-white">
              {unlocked.length.toString().padStart(2, '0')} <span className="text-[#2D2D3A]">/ {achievements.length.toString().padStart(2, '0')}</span>
            </p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-[9px] font-bold text-[#4B5563] uppercase tracking-[0.2em] mb-1">XP Yield</p>
            <p className="text-xl font-mono font-semibold text-purple-400">+{totalXP.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ── Achievements Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((ach) => {
          const style = RARITY_STYLES[ach.rarity];
          // Simple fallback icon mapping if ach.icon is an emoji
          const Icon = ach.locked ? Lock : Award; 

          return (
            <div
              key={ach.id}
              className={cn(
                "flex items-center gap-6 p-5 border transition-all duration-500 group relative overflow-hidden bg-black/20 backdrop-blur-sm",
                ach.locked 
                  ? "border-[#1A1A1A] opacity-30 grayscale" 
                  : "border-[#1A1A1A] hover:border-purple-500/40 shadow-[inset_0_0_20px_rgba(168,85,247,0.02)]"
              )}
            >
              <HexagonBadge 
                icon={Icon} 
                locked={ach.locked} 
                rarityColor={style.color} 
              />

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-[#2D2D3A] uppercase tracking-widest">{ach.rarity} MODULE</span>
                  {!ach.locked && (
                    <span className="text-[9px] font-mono text-purple-500/60 uppercase tracking-widest">
                      {format(new Date(ach.unlockedAt), "dd.MM.yy")}
                    </span>
                  )}
                </div>
                
                <h3 className="text-[13px] font-bold text-white uppercase tracking-tight group-hover:text-purple-400 transition-colors">
                  {ach.title}
                </h3>
                
                <p className="text-[11px] text-[#4B5563] font-mono uppercase tracking-tight leading-relaxed">
                  {ach.description}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[9px] font-mono font-bold text-purple-400/80 bg-purple-500/5 px-1.5 py-0.5 rounded border border-purple-500/10">
                    +{ach.xpReward} XP
                  </span>
                </div>
              </div>

              {!ach.locked && (
                <div className="absolute top-2 right-2">
                  <div className="w-1 h-1 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
