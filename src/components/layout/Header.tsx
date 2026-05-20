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
  const xpProgress = getXPProgress(xp);

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  useEffect(() => {
    if (user?.id) {
      getNotifications(user.id).then(setNotifications);
    }
  }, [user?.id]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Simple string-to-color hash for avatar background
  const getAvatarBg = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 60%, 40%)`;
  };

  if (!user) return <header className="h-[52px] bg-[#09090B] border-b border-[#18181B] shrink-0" />;

  return (
    <header className="h-[52px] bg-[#09090B] border-b border-[#18181B] flex items-center justify-between px-6 shrink-0 relative z-50">
      
      {/* Search / Command (Left) */}
      <button
        onClick={openCommandPalette}
        className="flex items-center gap-3 px-3 py-1.5 rounded-[6px] bg-[#111113] border border-[#27272A] hover:border-[#3F3F46] text-[#52525B] text-sm transition-all group w-full max-w-[280px]"
      >
        <Search className="w-4 h-4 shrink-0" />
        <span className="text-[13px] font-sans">Search or jump to...</span>
        <kbd className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-[#52525B] font-mono">
          ⌘K
        </kbd>
      </button>

      {/* Right side items */}
      <div className="flex items-center gap-6">
        
        {/* XP Display */}
        <div 
          className="group relative flex items-center gap-1.5 cursor-help"
          title={`${xpProgress.current} / ${xpProgress.next} XP para o próximo nível`}
        >
          <Zap className="w-3.5 h-3.5 text-[#A855F7]" />
          <span className="font-mono text-[13px] text-[#A855F7] font-medium tracking-tight">
            {xp.toLocaleString()} XP
          </span>
          
          {/* Tooltip implementation if title is not enough */}
          <div className="absolute top-full right-0 mt-2 p-2 bg-[#111113] border border-[#27272A] rounded-md text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-2xl">
            {xpProgress.percentage}% para o nível {level + 1}
          </div>
        </div>

        {/* Level Badge */}
        <div className="w-7 h-7 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center">
          <span className="text-white text-[12px] font-bold">{level}</span>
        </div>

        {/* Rank Badge */}
        <div
          className="px-3 py-1 rounded-[6px] border text-[11px] font-bold tracking-tight whitespace-nowrap uppercase italic"
          style={{
            borderColor: `${rank.color}33`, // 0.2 opacity
            backgroundColor: `${rank.color}1A`, // 0.1 opacity
            color: rank.color,
          }}
        >
          {rank.name}
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <NotificationPanel 
            userId={user.id} 
            notifications={notifications} 
            trigger={
              <button className="p-1 text-[#71717A] hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-[6px] h-[6px] bg-red-600 rounded-full" />
                )}
              </button>
            }
          />
        </div>

        {/* Avatar */}
        <Link 
          href="/dashboard/profile" 
          className="w-8 h-8 rounded-[6px] border border-transparent hover:border-[#A855F7] transition-all overflow-hidden shrink-0 group relative"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center text-xs font-bold text-white uppercase"
              style={{ backgroundColor: getAvatarBg(user.username || user.name || "U") }}
            >
              {(user.username || user.name || "U")[0]}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
