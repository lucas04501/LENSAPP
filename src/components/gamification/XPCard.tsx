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
    <div className="glass rounded-2xl border border-purple/20 p-5 relative overflow-hidden"
         style={{ boxShadow: "0 0 40px rgba(168,85,247,0.08)" }}>

      {/* Background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple/5 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">

        {/* Level circle */}
        <div className="relative shrink-0">
          <svg width="72" height="72" viewBox="0 0 72 72">
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
            <span className="text-xl font-bold text-text-primary leading-none">{level}</span>
            <span className="text-[9px] text-text-muted uppercase tracking-wider">nível</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: rank.color }}>
              {rank.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-3.5 h-3.5 text-purple" />
            <span className="text-2xl font-bold text-text-primary">{xp.toLocaleString()}</span>
            <span className="text-sm text-text-muted">XP total</span>
          </div>

          {/* XP bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-text-muted">
              <span>{progress.current.toLocaleString()} / {progress.next.toLocaleString()} XP</span>
              <span>{progress.percentage}% para LVL {level + 1}</span>
            </div>
            <div className="xp-bar">
              <motion.div
                className="xp-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress.percentage}%` }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* Next rank preview */}
        {nextRank && (
          <div className="hidden lg:flex flex-col items-center gap-2 px-5 border-l border-white/5">
            <TrendingUp className="w-4 h-4 text-text-muted" />
            <div className="text-center">
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Próximo rank</p>
              <p className="text-xs font-bold" style={{ color: nextRank.color }}>{nextRank.name}</p>
              <p className="text-[10px] text-text-muted mt-1">
                faltam {(nextRank.minXP - xp).toLocaleString()} XP
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rank milestones */}
      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar">
        {RANKS.map((r) => {
          const isActive  = r.id === rank.id;
          const isPassed  = xp >= r.minXP;
          return (
            <div
              key={r.id}
              className="flex flex-col items-center gap-1 shrink-0 px-3 py-1.5 rounded-xl transition-all"
              style={{
                backgroundColor: isActive ? `${r.color}15` : "transparent",
                border: isActive ? `1px solid ${r.color}40` : "1px solid transparent",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isPassed ? r.color : "#1A1A1A" }}
              />
              <span
                className="text-[9px] font-semibold whitespace-nowrap"
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
