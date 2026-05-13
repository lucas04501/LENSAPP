"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Flame, Users, BarChart3,
  Settings, ChevronLeft, Zap, Timer, Brain,
  Target, Trophy
} from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Dashboard",   group: "main" },
  { href: "/dashboard/habits",    icon: Flame,           label: "Hábitos",     group: "main" },
  { href: "/dashboard/focus",     icon: Timer,           label: "Foco",        group: "main" },
  { href: "/dashboard/analytics", icon: BarChart3,       label: "Analytics",   group: "main" },
  { href: "/dashboard/social",    icon: Users,           label: "Gym Rats",    group: "community" },
  { href: "/dashboard/ranks",     icon: Trophy,          label: "Ranks",       group: "community" },
  { href: "/dashboard/settings",  icon: Settings,        label: "Settings",    group: "bottom" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <AnimatePresence initial={false}>
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex flex-col h-full glass border-r border-white/5 overflow-hidden shrink-0"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
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
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 2 }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
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
                          "w-4.5 h-4.5 shrink-0 relative z-10",
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
        <div className="p-2 border-t border-white/5">
          <Link href="/dashboard/settings">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-surface-2 transition-all">
              <Settings className="w-4.5 h-4.5 shrink-0" />
              {sidebarOpen && <span>Settings</span>}
            </div>
          </Link>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="absolute top-[72px] -right-3 w-6 h-6 rounded-full glass border border-white/10 flex items-center justify-center hover:border-purple/30 hover:text-purple transition-all z-10"
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }}>
            <ChevronLeft className="w-3 h-3 text-text-muted" />
          </motion.div>
        </button>
      </motion.aside>
    </AnimatePresence>
  );
}
