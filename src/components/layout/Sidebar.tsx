"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard, Flame, Users, BarChart3,
  Settings, ChevronLeft, Zap, Timer, Brain,
  Target, Trophy, User, X, BookOpen, CalendarDays
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
  { href: "/dashboard/social",    icon: Users,           label: "Gym Rats",    group: "community" },
  { href: "/dashboard/profile",   icon: User,            label: "Perfil",      group: "community" },
  { href: "/dashboard/achievements", icon: Trophy,       label: "Conquistas",  group: "community" },
  { href: "/dashboard/ranks",     icon: Trophy,          label: "Ranks",       group: "community" },
  { href: "/dashboard/settings",  icon: Settings,        label: "Settings",    group: "bottom" },
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

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

      <motion.aside
        initial={false}
        animate={{ 
          width: sidebarOpen ? 240 : 72,
          x: 0,
          left: 0
        }}
        transition={{ type: "spring", damping: 20, stiffness: 150 }}
        className={cn(
          "fixed lg:relative flex flex-col h-full glass border-r border-white/5 overflow-hidden shrink-0 z-[70] transition-all duration-300",
          !sidebarOpen && "max-lg:-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-purple to-red shrink-0">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-lg tracking-wider text-gradient"
              >
                LENS
              </motion.span>
            )}
          </AnimatePresence>

          {/* Mobile Close Button */}
          {sidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="lg:hidden ml-auto p-2 rounded-xl bg-surface-2 border border-white/5 text-text-muted active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Streak Indicator */}
        <div className="px-4 py-4 shrink-0">
          <div className={cn(
            "flex items-center gap-3 p-3 rounded-2xl transition-all duration-300",
            sidebarOpen ? "bg-surface-2 border border-white/5 shadow-xl" : "justify-center"
          )}>
            <div className="relative">
              <Flame className={cn(
                "w-5 h-5 transition-colors",
                session?.user?.totalStreak > 0 ? "text-red animate-pulse" : "text-text-muted opacity-20"
              )} />
              {session?.user?.totalStreak > 0 && (
                <div className="absolute inset-0 bg-red/40 blur-lg rounded-full animate-pulse" />
              )}
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Streak</span>
                <span className="text-sm font-black text-white italic tracking-tighter">
                  {session?.user?.totalStreak || 0} DIAS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto no-scrollbar">
          {["main", "community"].map((group) => (
            <div key={group} className="mb-4">
              {sidebarOpen && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
                  {group === "main" ? "Core" : "Social"}
                </p>
              )}
              {NAV_ITEMS.filter((i) => i.group === group).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href as any} onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative min-h-[44px]",
                        isActive
                          ? "bg-purple/10 text-purple border border-purple/20"
                          : "text-text-muted hover:text-text-primary hover:bg-surface-2"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-xl bg-purple/10 border border-purple/20"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                        />
                      )}
                      <item.icon
                        className={cn(
                          "w-5 h-5 lg:w-4.5 lg:h-4.5 shrink-0 relative z-10",
                          isActive ? "text-purple" : "text-text-muted group-hover:text-text-primary"
                        )}
                      />
                      <AnimatePresence>
                        {sidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6 }}
                            className="relative z-10 truncate"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-2 border-t border-white/5 shrink-0">
          <Link href={"/dashboard/settings" as any} onClick={() => { if(window.innerWidth < 1024) toggleSidebar() }}>
            <div className="flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-surface-2 transition-all min-h-[44px]">
              <Settings className="w-5 h-5 lg:w-4.5 lg:h-4.5 shrink-0" />
              {sidebarOpen && <span>Settings</span>}
            </div>
          </Link>
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute top-[72px] -right-3 w-6 h-6 rounded-full glass border border-white/10 items-center justify-center hover:border-purple/30 hover:text-purple transition-all z-10"
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }}>
            <ChevronLeft className="w-3 h-3 text-text-muted" />
          </motion.div>
        </button>
      </motion.aside>
    </>
  );
}
