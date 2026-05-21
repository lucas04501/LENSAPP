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
    <div className="bg-[#0F0F14] border border-[#111118] rounded-md p-5 sm:p-6 relative overflow-hidden">
      <div className="relative flex items-center gap-6">
        {/* Level circle */}
        <div className="relative shrink-0 flex justify-center">
          <svg width="64" height="64" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="30" fill="none" stroke="#111118" strokeWidth="6" />
            <motion.circle
              cx="36" cy="36" r="30"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress.percentage / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - progress.percentage / 100) }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              transform="rotate(-90 36 36)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold text-white leading-none">{level}</span>
            <span className="text-[8px] text-[#4B5563] uppercase font-semibold tracking-widest mt-0.5">lvl</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex flex-col">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-purple mb-0.5">
                {rank.name}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-white tracking-tight">{xp.toLocaleString()}</span>
                <span className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-wider">XP TOTAL</span>
              </div>
            </div>
            {nextRank && (
              <span className="text-[11px] text-[#4B5563]">
                Next: <span className="text-white font-medium">{nextRank.name.split(" ")[0]}</span> — {(nextRank.minXP - xp).toLocaleString()} XP away
              </span>
            )}
          </div>

          {/* XP bar */}
          <div className="h-1 w-full bg-[#111118] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#7C3AED] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.percentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
