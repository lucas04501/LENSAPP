"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Command } from "cmdk";
import {
  LayoutDashboard, Flame, BarChart3, Users,
  Plus, Timer, Trophy, Settings, X, Zap
} from "lucide-react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";

const COMMANDS = [
  // Navigation
  { id: "dash",     label: "Ir para Dashboard",   icon: LayoutDashboard, href: "/dashboard",            category: "Navegar",   shortcut: ["G", "D"] },
  { id: "habits",   label: "Ir para Hábitos",      icon: Flame,           href: "/dashboard/habits",     category: "Navegar",   shortcut: ["G", "H"] },
  { id: "focus",    label: "Ir para Foco",          icon: Timer,           href: "/dashboard/focus",      category: "Navegar",   shortcut: ["G", "F"] },
  { id: "analytics",label: "Ir para Analytics",    icon: BarChart3,       href: "/dashboard/analytics",  category: "Navegar",   shortcut: ["G", "A"] },
  { id: "social",   label: "Ir para Gym Rats",     icon: Users,           href: "/dashboard/social",     category: "Navegar",   shortcut: ["G", "S"] },
  { id: "ranks",    label: "Ver Ranks",             icon: Trophy,          href: "/dashboard/ranks",      category: "Navegar",   shortcut: [] },

  // Actions
  { id: "new-habit",  label: "Criar novo hábito",     icon: Plus,   href: "/dashboard/habits?new=true",    category: "Ação",  shortcut: ["N", "H"] },
  { id: "new-focus",  label: "Iniciar sessão de foco", icon: Timer,  href: "/dashboard/focus?start=true",   category: "Ação",  shortcut: ["N", "F"] },
  { id: "new-post",   label: "Criar post",             icon: Plus,   href: "/dashboard/social?new=true",    category: "Ação",  shortcut: ["N", "P"] },
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, closeCommandPalette } = useUIStore();

  const handleSelect = useCallback((href: string) => {
    router.push(href);
    closeCommandPalette();
  }, [router, closeCommandPalette]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCommandPalette();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCommandPalette]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCommandPalette}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 px-4"
          >
            <Command
              className="glass border border-purple/20 rounded-2xl shadow-neon-purple overflow-hidden"
              style={{ boxShadow: "0 0 40px rgba(168,85,247,0.2), 0 20px 60px rgba(0,0,0,0.8)" }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5">
                <Zap className="w-4 h-4 text-purple shrink-0" />
                <Command.Input
                  placeholder="O que você quer fazer?"
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none"
                  autoFocus
                />
                <button onClick={closeCommandPalette} className="text-text-muted hover:text-text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <Command.List className="max-h-80 overflow-y-auto py-2 no-scrollbar">
                <Command.Empty className="py-8 text-center text-text-muted text-sm">
                  Nenhum resultado encontrado.
                </Command.Empty>

                {["Navegar", "Ação"].map((category) => {
                  const items = COMMANDS.filter((c) => c.category === category);
                  return (
                    <Command.Group
                      key={category}
                      heading={
                        <span className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted block">
                          {category}
                        </span>
                      }
                    >
                      {items.map((cmd) => (
                        <Command.Item
                          key={cmd.id}
                          value={cmd.label}
                          onSelect={() => handleSelect(cmd.href)}
                          className={cn(
                            "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl cursor-pointer",
                            "text-sm text-text-secondary",
                            "data-[selected=true]:bg-purple/10 data-[selected=true]:text-purple",
                            "transition-all duration-100"
                          )}
                        >
                          <cmd.icon className="w-4 h-4 shrink-0" />
                          <span className="flex-1">{cmd.label}</span>
                          {cmd.shortcut.length > 0 && (
                            <div className="flex gap-1">
                              {cmd.shortcut.map((k) => (
                                <kbd
                                  key={k}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-surface-3 border border-border font-mono text-text-muted"
                                >
                                  {k}
                                </kbd>
                              ))}
                            </div>
                          )}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  );
                })}
              </Command.List>

              <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-4 text-[10px] text-text-muted">
                <span>↵ selecionar</span>
                <span>↑↓ navegar</span>
                <span>esc fechar</span>
              </div>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
