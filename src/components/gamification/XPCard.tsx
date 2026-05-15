"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Star } from "lucide-react";
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
    <div className="glass rounded-2xl sm:rounded-3xl border border-purple/20 p-5 sm:p-8 relative overflow-hidden"
         style={{ boxShadow: "0 0 40px rgba(168,85,247,0.08)" }}>

      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple/5 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">

        {/* Level circle */}
        <div className="relative shrink-0 flex justify-center">
          <svg width="84" height="84" viewBox="0 0 72 72" className="sm:w-24 sm:h-24">
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="6" />
            <motion.circle
              cx="36" cy="36" r="30"
              fill="none"
              stroke="url(#xpGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - progress.percentage / 100)}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - progress.percentage / 100) }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              transform="rotate(-90 36 36)"
            />
            <defs>
              <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter leading-none">{level}</span>
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-0.5">nível</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase" style={{ color: rank.color }}>
              {rank.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-purple" />
            <span className="text-3xl sm:text-4xl font-black text-white italic tracking-tighter">{xp.toLocaleString()}</span>
            <span className="text-xs sm:text-sm font-bold text-text-muted uppercase tracking-widest">XP total</span>
          </div>

          {/* XP bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-wider">
              <span>{progress.current.toLocaleString()} / {progress.next.toLocaleString()} XP</span>
              <span>{progress.percentage}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple to-red rounded-full shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Next rank preview (Desktop only) */}
        {nextRank && (
          <div className="hidden lg:flex flex-col items-center gap-2 px-8 border-l border-white/5 shrink-0">
            <TrendingUp className="w-5 h-5 text-text-muted" />
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-1">Próximo rank</p>
              <p className="text-sm font-black italic tracking-tighter uppercase" style={{ color: nextRank.color }}>{nextRank.name}</p>
              <p className="text-[10px] text-text-muted mt-1 font-bold">
                faltam {(nextRank.minXP - xp).toLocaleString()} XP
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rank milestones (Hidden on small mobile) */}
      <div className="mt-8 pt-6 border-t border-white/5 hidden sm:flex gap-4 overflow-x-auto no-scrollbar">
        {RANKS.map((r) => {
          const isActive  = r.id === rank.id;
          const isPassed  = xp >= r.minXP;
          return (
            <div
              key={r.id}
              className="flex flex-col items-center gap-2 shrink-0 px-4 py-2 rounded-2xl transition-all"
              style={{
                backgroundColor: isActive ? `${r.color}15` : "transparent",
                border: isActive ? `1px solid ${r.color}40` : "1px solid transparent",
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ 
                  backgroundColor: isPassed ? r.color : "#1A1A1A",
                  boxShadow: isPassed ? `0 0 10px ${r.color}` : 'none'
                }}
              />
              <span
                className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
                style={{ color: isPassed ? r.color : "#303030" }}
              >
                {r.name.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
