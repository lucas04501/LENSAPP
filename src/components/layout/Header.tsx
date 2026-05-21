"use client";

import { motion } from "framer-motion";
import { Search, Zap, Bell } from "lucide-react";
import { useUIStore } from "@/store";
import { getRankByXP, getXPProgress, getLevelByXP } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getNotifications } from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NotificationPanel } from "./NotificationPanel";

export function Header({ initialNotifications = [] }: { initialNotifications?: any[] }) {
  const { data: session } = useSession();
  const { openCommandPalette } = useUIStore();
  const [notifications, setNotifications] = useState<any[]>(initialNotifications);

  const user = session?.user as any;
  const xp = user?.xp || 0;
  const rank = getRankByXP(xp);
  const level = getLevelByXP(xp);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    if (user?.id) {
      getNotifications(user.id).then(setNotifications);
    }
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!user) return <header className="h-[48px] bg-[#09090B] border-b border-[#111118] shrink-0" />;

  return (
    <header className="h-[48px] bg-[#09090B] border-b border-[#111118] flex items-center justify-between px-4 shrink-0 relative z-50">
      
      {/* Logo (Left) */}
      <div className="w-[120px] shrink-0">
        <span className="font-mono text-[14px] font-medium tracking-[0.15em] text-white">LENS</span>
      </div>

      {/* Search / Command (Center) */}
      <button
        onClick={openCommandPalette}
        className="flex items-center gap-2 px-3 h-8 rounded-md bg-[#111113]/50 border border-[#1E1E2E] hover:border-[#374151] text-[#6B7280] transition-all group w-full max-w-[320px]"
      >
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span className="text-[12px]">Search or jump to...</span>
        <div className="ml-auto flex items-center gap-1 opacity-60">
          <kbd className="text-[10px] font-sans">⌘</kbd>
          <kbd className="text-[10px] font-sans">K</kbd>
        </div>
      </button>

      {/* Right side items */}
      <div className="flex items-center gap-4 w-[280px] justify-end">
        
        {/* XP */}
        <span className="font-mono text-[11px] text-purple font-medium">
          {xp.toLocaleString()} XP
        </span>

        {/* Level Badge */}
        <div className="w-7 h-7 rounded-sm border border-purple flex items-center justify-center shrink-0">
          <span className="text-white text-[12px] font-bold">{level}</span>
        </div>

        {/* Rank */}
        <span className="text-[11px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: rank.color }}>
          {rank.name}
        </span>

        {/* Bell */}
        <div className="relative">
          <NotificationPanel 
            userId={user.id} 
            notifications={notifications} 
            trigger={
              <button className="p-1 text-[#4B5563] hover:text-white transition-colors relative">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-1 h-1 bg-red-600 rounded-full" />
                )}
              </button>
            }
          />
        </div>

        {/* Avatar */}
        <Link 
          href="/dashboard/profile" 
          className="w-8 h-8 rounded-[6px] border border-[#1E1E2E] hover:border-purple transition-all overflow-hidden shrink-0 group relative"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white uppercase bg-[#1E1E2E]"
            >
              {(user.username || user.name || "U")[0]}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
