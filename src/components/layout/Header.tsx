"use client";

import { motion } from "framer-motion";
import { Bell, Search, Zap, ChevronUp } from "lucide-react";
import { useUIStore } from "@/store";
import { getRankByXP, getXPProgress, getLevelByXP } from "@/types";
import { cn } from "@/lib/utils";

// Mock user — replace with real auth
const MOCK_USER = {
  name: "Lucas",
  username: "lucasCEO",
  xp: 1620,
  avatarUrl: null,
};

export function Header() {
  const { openCommandPalette } = useUIStore();
  const rank = getRankByXP(MOCK_USER.xp);
  const level = getLevelByXP(MOCK_USER.xp);
  const xpProgress = getXPProgress(MOCK_USER.xp);

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center gap-4 px-6 shrink-0">

      {/* Search / Command */}
      <button
        onClick={openCommandPalette}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-border hover:border-purple/30 text-text-muted text-sm transition-all group flex-1 max-w-xs"
      >
        <Search className="w-4 h-4 group-hover:text-purple transition-colors" />
        <span className="text-xs">Buscar ou criar...</span>
        <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-surface-3 border border-border text-text-muted font-mono">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* XP + Level */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-purple" />
            <span className="text-xs font-semibold text-purple">
              {MOCK_USER.xp.toLocaleString('en-US')} XP
            </span>
            <span className="text-[10px] text-text-muted">
              · {xpProgress.current.toLocaleString('en-US')}/{xpProgress.next.toLocaleString('en-US')} para LVL {level + 1}
            </span>
          </div>
          <div className="w-32 h-1 rounded-full bg-surface-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-r from-purple to-red"
            />
          </div>
        </div>

        {/* Level badge */}
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple/10 border border-purple/30 text-purple font-bold text-xs">
          {level}
        </div>
      </div>

      {/* Rank badge */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold"
        style={{
          borderColor: `${rank.color}40`,
          backgroundColor: `${rank.color}10`,
          color: rank.color,
        }}
      >
        <span>{rank.name}</span>
      </div>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-2 border border-transparent hover:border-border transition-all">
        <Bell className="w-4.5 h-4.5 text-text-muted" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red" />
      </button>

      {/* Avatar */}
      <div className="flex items-center gap-2.5 cursor-pointer group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple to-red flex items-center justify-center text-sm font-bold text-white shrink-0">
          {MOCK_USER.username[0].toUpperCase()}
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-semibold text-text-primary leading-none">
            {MOCK_USER.username}
          </span>
          <span className="text-[10px] text-text-muted mt-0.5">LVL {level}</span>
        </div>
      </div>
    </header>
  );
}
