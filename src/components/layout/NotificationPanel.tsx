"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check, Flame, Trophy, AlertTriangle, Sparkles } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { markAsRead, markAllAsRead } from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "HABIT_REMINDER" | "RANK_UP" | "STREAK_RISK" | "ACHIEVEMENT";
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
}

interface NotificationPanelProps {
  userId: string;
  notifications: Notification[];
}

const TYPE_CONFIG = {
  HABIT_REMINDER: { icon: Flame, color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
  RANK_UP:        { icon: Trophy, color: "#A855F7", bg: "rgba(168, 85, 247, 0.1)" },
  STREAK_RISK:    { icon: AlertTriangle, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  ACHIEVEMENT:    { icon: Sparkles, color: "#06B6D4", bg: "rgba(6, 182, 212, 0.1)" },
};

export function NotificationPanel({ userId, notifications: initialNotifications }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications([]);
    await markAllAsRead(userId);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-surface-2 border border-white/5 hover:border-white/10 transition-all group"
      >
        <Bell className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red rounded-full border-2 border-[#050505] text-[9px] font-black flex items-center justify-center text-white animate-in zoom-in">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Overlay Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0D0D0D] border-l border-white/10 shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                    Notificações
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-red/20 text-red px-2 py-0.5 rounded-full not-italic tracking-normal normal-case font-bold">
                        {unreadCount} novas
                      </span>
                    )}
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Actions */}
              {unreadCount > 0 && (
                <div className="px-6 py-3 border-b border-white/5 bg-white/[0.02]">
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-bold text-purple uppercase tracking-widest hover:text-purple/80 transition-colors flex items-center gap-2"
                  >
                    <Check className="w-3 h-3" />
                    Marcar todas como lidas
                  </button>
                </div>
              )}

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-text-muted opacity-20" />
                    </div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest italic">Nada por aqui</p>
                    <p className="text-xs text-text-muted mt-2">Você está em dia com todas as suas metas!</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Config = TYPE_CONFIG[notif.type];
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="glass rounded-2xl border border-white/5 p-4 relative group hover:border-white/10 transition-all"
                      >
                        <div className="flex gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: Config.bg }}
                          >
                            <Config.icon className="w-5 h-5" style={{ color: Config.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs font-black text-white uppercase tracking-tight truncate">
                              {notif.title}
                            </h3>
                            <p className="text-[11px] text-text-muted leading-relaxed mt-1">
                              {notif.message}
                            </p>
                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-tighter mt-2">
                              {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR })}
                            </p>
                          </div>
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white/5 rounded-lg transition-all text-text-muted hover:text-purple shrink-0 self-start"
                            title="Marcar como lida"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
