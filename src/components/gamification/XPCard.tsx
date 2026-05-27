"use client";

import { motion } from "framer-motion";
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
    <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/[0.04] transition-all duration-300">
      <div className="relative flex items-center gap-8">
        
        {/* Left: Level circle */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin-slow opacity-40" />
            <span className="text-xl font-black text-white italic">{level} LVL</span>
          </div>
        </div>

        {/* Info & Progress */}
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-8">
          
          <div className="flex flex-col min-w-[120px]">
            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-purple-500">{rank.name}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-white tabular-nums">{xp.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">XP TOTAL</span>
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {nextRank && (
            <div className="text-right min-w-[150px]">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-tight">
                Next: <span className="text-zinc-300 font-black italic">{nextRank.name.split(" ")[0]}</span>
              </p>
              <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-tighter mt-0.5">
                {(nextRank.minXP - xp).toLocaleString()} XP away
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}


