"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard, Flame, Users, BarChart3,
  Settings, ChevronLeft, Timer,
  Target, User, X, BookOpen, CalendarDays, Trophy
} from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Dashboard",   group: "main" },
  { href: "/dashboard/habits",    icon: Flame,           label: "Hábitos",     group: "main" },
  { href: "/dashboard/goals",     icon: Target,          label: "Metas",       group: "main" },
  { href: "/dashboard/journal",   icon: BookOpen,        label: "Diário",      group: "main" },
  { href: "/dashboard/calendar",  icon: CalendarDays,    label: "Calendário",  group: "main" },
  { href: "/dashboard/focus",     icon: Timer,           label: "Foco",        group: "main" },
  { href: "/dashboard/analytics", icon: BarChart3,       label: "Analytics",   group: "main" },
  { href: "/dashboard/social",    icon: Users,           label: "Feed",        group: "community" },
  { href: "/dashboard/profile",   icon: User,            label: "Perfil",      group: "community" },
  { href: "/dashboard/achievements", icon: Trophy,       label: "Conquistas",  group: "community" },
  { href: "/dashboard/ranks",     icon: Trophy,          label: "Ranks",       group: "community" },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const sidebarWidth = sidebarOpen ? "200px" : "48px";
  const user = session?.user as any;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        style={{ 
          width: sidebarWidth,
          transition: "width 250ms ease, transform 250ms ease"
        }}
        className={cn(
          "fixed lg:relative flex flex-col h-full bg-black/40 backdrop-blur-xl border-r border-[#151515] overflow-hidden shrink-0 z-[70]",
          !sidebarOpen && "max-lg:-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="flex flex-col shrink-0">
          <div className="flex items-center px-4 h-12 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              {sidebarOpen && (
                <span className="font-mono font-medium text-[14px] tracking-[0.15em] text-white">
                  LENS
                </span>
              )}
            </div>

            {/* Mobile Close Button */}
            {sidebarOpen && (
              <button 
                onClick={toggleSidebar}
                className="lg:hidden ml-auto p-1.5 rounded-md hover:bg-white/5 text-[#4B5563] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Streak Line */}
          <div className="px-4 py-2 shrink-0 min-h-[32px] flex items-center">
            {sidebarOpen && (
              <span className="text-[11px] text-[#4B5563] font-mono tracking-wider">
                — {user?.totalStreak ?? 0} DAY STREAK
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-8 overflow-y-auto no-scrollbar">
          {["main", "community"].map((group) => (
            <div key={group} className="space-y-1">
              {sidebarOpen && (
                <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D2D3A]">
                  {group === "main" ? "Core" : "Social"}
                </p>
              )}
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href as any} onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-4 py-2 transition-all duration-300 group relative min-h-[32px]",
                        isActive
                          ? "text-white border-l-2 border-purple-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                          : "text-[#4B5563] hover:text-zinc-300 border-l-2 border-transparent"
                      )}
                    >
                      <item.icon
                        strokeWidth={1.5}
                        className={cn(
                          "w-4 h-4 shrink-0 transition-all",
                          isActive ? "text-white" : "text-[#4B5563] group-hover:text-zinc-300"
                        )}
                      />
                      {sidebarOpen && (
                        <span className="text-[13px] font-medium truncate tracking-tight">
                          {item.label}
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom Section: Profile & Settings */}
        <div className="mt-auto border-t border-[#151515] py-4 px-3 space-y-1">
          <Link href="/dashboard/settings" onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}>
            <div className={cn(
              "flex items-center gap-3 px-3 py-2 transition-all duration-300 group relative min-h-[32px] rounded-md",
              pathname === "/dashboard/settings"
                ? "text-white border-l-2 border-purple-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                : "text-[#4B5563] hover:text-zinc-300 border-l-2 border-transparent"
            )}>
              <Settings strokeWidth={1.5} className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span className="text-[13px] font-medium tracking-tight">Settings</span>}
            </div>
          </Link>

          {user && sidebarOpen && (
            <div className="flex items-center gap-3 px-3 py-4 mt-2">
              <div className="w-8 h-8 rounded-md bg-[#151515] border border-white/5 overflow-hidden shrink-0">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#4B5563] uppercase">
                    {(user.username || user.name || "U")[0]}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-zinc-200 truncate">
                  {user.name || user.username}
                </span>
                <span className="text-[10px] text-[#4B5563] font-mono uppercase tracking-widest">
                  Active Session
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute bottom-4 right-4 w-6 h-6 items-center justify-center text-[#4B5563] hover:text-white transition-all z-10"
        >
          <div style={{ 
            transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 250ms ease"
          }}>
            <ChevronLeft strokeWidth={1.5} className="w-4 h-4" />
          </div>
        </button>
      </aside>
    </>
  );
}
