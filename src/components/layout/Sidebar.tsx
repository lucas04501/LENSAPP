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

  const sidebarWidth = sidebarOpen ? "220px" : "52px";

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
          "fixed lg:relative flex flex-col h-full bg-[#09090B] border-r border-[#18181B] overflow-hidden shrink-0 z-[70]",
          !sidebarOpen && "max-lg:-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="flex flex-col shrink-0">
          <div className="flex items-center px-3 h-14 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#A855F7] rounded-sm flex items-center justify-center shrink-0">
                <span className="text-white text-[14px] font-bold font-mono">L</span>
              </div>
              {sidebarOpen && (
                <span className="font-mono font-bold text-[14px] tracking-[0.2em] text-white">
                  ENS
                </span>
              )}
            </div>

            {/* Mobile Close Button */}
            {sidebarOpen && (
              <button 
                onClick={toggleSidebar}
                className="lg:hidden ml-auto p-1.5 rounded-md hover:bg-[#111113] text-[#52525B] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="mx-3 border-b border-[#18181B]" />

          {/* Streak Line */}
          <div className="px-4 py-3 shrink-0 min-h-[40px] flex items-center">
            <div className="flex items-center gap-2">
              <span className="text-[12px]">🔥</span>
              {sidebarOpen && (
                <span className="text-[11px] font-medium text-[#52525B] whitespace-nowrap">
                  {session?.user?.totalStreak ?? 0} dias
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-2 px-2 space-y-6 overflow-y-auto no-scrollbar">
          {["main", "community"].map((group) => (
            <div key={group} className="space-y-1">
              {sidebarOpen && (
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#3F3F46]">
                  {group === "main" ? "Core" : "Social"}
                </p>
              )}
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href as any} onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}>
                    <div
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative min-h-[36px]",
                        isActive
                          ? "bg-[#18181B] text-white"
                          : "text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#111113]"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#A855F7]" />
                      )}
                      <item.icon
                        className={cn(
                          "w-[18px] h-[18px] shrink-0 transition-colors",
                          isActive ? "text-[#A855F7]" : "text-[#52525B] group-hover:text-[#A1A1AA]"
                        )}
                      />
                      {sidebarOpen && (
                        <span className="text-[13px] font-medium truncate">
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

        {/* Bottom (Settings) */}
        <div className="px-2 py-4 shrink-0">
          <Link href="/dashboard/settings" onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}>
            <div className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group min-h-[36px]",
              pathname === "/dashboard/settings"
                ? "bg-[#18181B] text-white"
                : "text-[#52525B] hover:text-[#A1A1AA] hover:bg-[#111113]"
            )}>
              {pathname === "/dashboard/settings" && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-[2px] bg-[#A855F7]" />
              )}
              <Settings className={cn(
                "w-[18px] h-[18px] shrink-0",
                pathname === "/dashboard/settings" ? "text-[#A855F7]" : "text-[#52525B] group-hover:text-[#A1A1AA]"
              )} />
              {sidebarOpen && <span className="text-[13px] font-medium">Settings</span>}
            </div>
          </Link>
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute top-[60px] -right-3 w-6 h-6 rounded-full bg-[#09090B] border border-[#18181B] items-center justify-center hover:border-[#A855F7]/30 text-[#52525B] hover:text-[#A855F7] transition-all z-10"
        >
          <div style={{ 
            transform: sidebarOpen ? "rotate(0deg)" : "rotate(180deg)",
            transition: "transform 250ms ease"
          }}>
            <ChevronLeft className="w-3 h-3" />
          </div>
        </button>
      </aside>
    </>
  );
}
