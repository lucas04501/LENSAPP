"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Zap, Menu, X } from "lucide-react";
import { useUIStore } from "@/store";
import { getRankByXP, getXPProgress, getLevelByXP } from "@/types";
import { NotificationPanel } from "./NotificationPanel";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getNotifications } from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const { openCommandPalette, toggleSidebar } = useUIStore();
  const [notifications, setNotifications] = useState<any[]>([]);

  const user = session?.user as any;
  const xp = user?.xp || 0;
  const rank = getRankByXP(xp);
  const level = getLevelByXP(xp);
  const xpProgress = getXPProgress(xp);

  useEffect(() => {
    if (user?.id) {
      getNotifications(user.id).then(setNotifications);
    }
  }, [user?.id]);

  if (!user) return <header className="h-16 glass border-b border-white/5 shrink-0" />;

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center gap-4 px-4 sm:px-6 shrink-0 relative z-50">
      
      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-xl bg-surface-2 border border-white/5 hover:bg-surface-3 transition-colors"
      >
        <Menu className="w-5 h-5 text-text-muted" />
      </button>

      {/* Search / Command */}
      <button
        onClick={openCommandPalette}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-border hover:border-purple/30 text-text-muted text-sm transition-all group flex-1 max-w-[40px] sm:max-w-xs overflow-hidden"
      >
        <Search className="w-4 h-4 group-hover:text-purple transition-colors shrink-0" />
        <span className="text-xs hidden sm:inline">Buscar ou criar...</span>
        <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-surface-3 border border-border text-text-muted font-mono hidden md:inline-block">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* XP + Level */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden xs:flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-purple" />
            <span className="text-xs font-semibold text-purple">
              {xp.toLocaleString()} XP
            </span>
          </div>
          <div className="w-24 sm:w-32 h-1 rounded-full bg-surface-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-purple to-red"
            />
          </div>
        </div>

        {/* Level badge */}
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple/10 border border-purple/30 text-purple font-black text-[10px] sm:text-xs">
          {level}
        </div>
      </div>

      {/* Rank badge (Hidden on mobile) */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider"
        style={{
          borderColor: `${rank.color}40`,
          backgroundColor: `${rank.color}10`,
          color: rank.color,
        }}
      >
        <span>{rank.name}</span>
      </div>

      {/* Notification Panel */}
      <NotificationPanel userId={user.id} notifications={notifications} />

      {/* Avatar */}
      <div className="flex items-center gap-2.5 cursor-pointer group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple to-red p-0.5 shrink-0">
          <div className="w-full h-full bg-[#050505] rounded-[8px] flex items-center justify-center text-xs font-black text-white italic">
            {(user.username || user.name || "U")[0].toUpperCase()}
          </div>
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-bold text-text-primary leading-none uppercase italic tracking-tighter">
            {user.username || user.name}
          </span>
          <span className="text-[9px] font-bold text-text-muted mt-0.5 tracking-[0.2em] uppercase">LEVEL {level}</span>
        </div>
      </div>
    </header>
  );
}
