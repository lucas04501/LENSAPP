"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { getRankByXP, getLevelByXP, getXPProgress, RANKS } from "@/types";

interface XPCardProps {
  xp: number;
}

export function XPCard({ xp }: XPCardProps) {
  const rank     = getRankByXP(xp);
  const level    = getLevelByXP(xp);
  const progress = getXPProgress(xp);
  const nextRank = RANKS.find(r => r.minXP > xp);

  return (
    <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-500">
      <div className="relative flex items-center gap-8">
        {/* Level indicator */}
        <div className="relative shrink-0 flex justify-center">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
            <motion.circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="#A855F7"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - progress.percentage / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 36 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 36 * (1 - progress.percentage / 100) }}
              transition={{ duration: 1.5, ease: "circOut" }}
              transform="rotate(-90 40 40)"
              className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-white leading-none italic">{level}</span>
            <span className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.2em] mt-1">LVL</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 mb-1">
                {rank.name}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tighter italic tabular-nums">{xp.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">XP ACUMULADO</span>
              </div>
            </div>
            {nextRank && (
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Próximo Objetivo</p>
                <p className="text-[11px] text-zinc-400">
                  <span className="text-white font-black italic">{nextRank.name.split(" ")[0]}</span> — <span className="tabular-nums">{(nextRank.minXP - xp).toLocaleString()}</span> XP
                </p>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full bg-white/[0.03] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1.5, ease: "circOut", delay: 0.2 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

