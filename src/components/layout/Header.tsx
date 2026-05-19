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
import Link from "next/link";

export function Header({ initialNotifications = [] }: { initialNotifications?: any[] }) {
  const { data: session } = useSession();
  const { openCommandPalette, toggleSidebar } = useUIStore();
  const [notifications, setNotifications] = useState<any[]>(initialNotifications);

  const user = session?.user as any;
  const xp = user?.xp || 0;
  const rank = getRankByXP(xp);
  const level = getLevelByXP(xp);
  const xpProgress = getXPProgress(xp);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    if (user?.id) {
      getNotifications(user.id).then(setNotifications);
    }
  }, [user?.id]);

  if (!user) return <header className="h-16 glass border-b border-white/5 shrink-0" />;

  return (
    <header className="h-16 glass border-b border-white/5 flex items-center gap-2 sm:gap-4 px-3 sm:px-6 shrink-0 relative z-50">
      
      {/* Mobile Menu Toggle */}
      <button 
        onClick={toggleSidebar}
        className="lg:hidden p-2 rounded-xl bg-surface-2 border border-white/5 hover:bg-surface-3 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <Menu className="w-5 h-5 text-text-muted" />
      </button>

      {/* Search / Command */}
      <button
        onClick={openCommandPalette}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border border-border hover:border-purple/30 text-text-muted text-sm transition-all group max-w-[44px] sm:max-w-xs overflow-hidden h-[44px] sm:h-auto"
      >
        <Search className="w-4.5 h-4.5 group-hover:text-purple transition-colors shrink-0" />
        <span className="text-xs hidden sm:inline truncate">Buscar ou criar...</span>
        <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-surface-3 border border-border text-text-muted font-mono hidden md:inline-block">
          ⌘K
        </kbd>
      </button>

      <div className="flex-1" />

      {/* XP + Level */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* XP Bar (Hidden on Mobile) */}
        <div className="hidden md:flex flex-col items-end gap-0.5">
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

        {/* Level badge (Always visible) */}
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-purple/10 border border-purple/30 text-purple font-black text-xs shrink-0">
          {level}
        </div>
      </div>

      {/* Rank badge (Hidden on mobile) */}
      <div
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
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
      <Link href="/dashboard/profile" className="flex items-center gap-2.5 cursor-pointer group shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple to-red p-[1px] shrink-0 overflow-hidden">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-[10px]" />
          ) : (
            <div className="w-full h-full bg-[#050505] rounded-[10px] flex items-center justify-center text-xs font-black text-white italic">
              {(user.username || user.name || "U")[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="hidden sm:flex flex-col max-w-[100px]">
          <span className="text-xs font-bold text-text-primary leading-none uppercase italic tracking-tighter truncate group-hover:text-purple transition-colors">
            {user.username || user.name}
          </span>
          <span className="text-[9px] font-bold text-text-muted mt-0.5 tracking-[0.2em] uppercase">LEVEL {level}</span>
        </div>
      </Link>
    </header>
  );
}
