'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, X, Check, Flame, Trophy, Star, Heart, MessageCircle, Target, Zap, Trash2 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { markAsRead, markAllAsRead, deleteNotification } from "@/lib/actions/notifications";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { NotificationType } from "@prisma/client";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  actionUrl?: string | null;
}

interface NotificationPanelProps {
  userId: string;
  notifications: Notification[];
}

const TYPE_CONFIG: Record<NotificationType, { icon: any, color: string, bg: string }> = {
  HABIT_REMINDER: { icon: Bell,          color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  RANK_UP:        { icon: Trophy,        color: "#A855F7", bg: "rgba(168, 85, 247, 0.1)" },
  STREAK_RISK:    { icon: Flame,         color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
  ACHIEVEMENT:    { icon: Star,          color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  SOCIAL_LIKE:    { icon: Heart,         color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
  SOCIAL_COMMENT: { icon: MessageCircle, color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)" },
  GOAL_DEADLINE:  { icon: Target,        color: "#F97316", bg: "rgba(249, 115, 22, 0.1)" },
  LEVEL_UP:       { icon: Zap,           color: "#A855F7", bg: "rgba(168, 85, 247, 0.1)" },
};

export function NotificationPanel({ userId, notifications: initialNotifications }: NotificationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const router = useRouter();

  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
      setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    }
    
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    await markAllAsRead(userId);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    await deleteNotification(id);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-surface-2 border border-white/5 hover:border-white/10 transition-all group h-[44px] w-[44px] flex items-center justify-center"
      >
        <Bell className="w-5 h-5 text-text-muted group-hover:text-white transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red rounded-full border-2 border-[#050505] text-[9px] font-black flex items-center justify-center text-white animate-in zoom-in">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-[320px] bg-[#050505] border-l border-white/10 shadow-2xl z-[101] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                    Notificações
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-text-muted"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-[10px] font-bold text-purple uppercase tracking-widest hover:text-purple/80 transition-colors flex items-center gap-2 w-fit"
                  >
                    <Check className="w-3 h-3" />
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mb-4">
                      <Bell className="w-8 h-8 text-text-muted opacity-20" />
                    </div>
                    <p className="text-sm font-bold text-white uppercase tracking-widest italic">Tudo em dia por aqui</p>
                    <p className="text-xs text-text-muted mt-2">Nenhuma nova notificação.</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {notifications.map((notif) => {
                      const Config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.HABIT_REMINDER;
                      const Icon = Config.icon;
                      
                      return (
                        <motion.div
                          key={notif.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                          onClick={() => handleNotificationClick(notif)}
                          className={cn(
                            "glass rounded-2xl border p-4 relative group cursor-pointer transition-all",
                            notif.isRead 
                              ? "bg-transparent border-white/5 opacity-60" 
                              : "bg-white/[0.03] border-white/10 shadow-lg"
                          )}
                        >
                          {!notif.isRead && (
                            <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-purple rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                          )}
                          
                          <div className="flex gap-4">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ backgroundColor: Config.bg }}
                            >
                              <Icon className="w-5 h-5" style={{ color: Config.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={cn(
                                "text-xs font-black uppercase tracking-tight truncate",
                                notif.isRead ? "text-text-muted" : "text-white"
                              )}>
                                {notif.title}
                              </h3>
                              <p className="text-[11px] text-text-muted leading-relaxed mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                              <p className="text-[9px] font-bold text-text-muted/50 uppercase tracking-tighter mt-2">
                                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR })}
                              </p>
                            </div>
                            
                            <button
                              onClick={(e) => handleDelete(e, notif.id)}
                              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red/10 rounded-lg transition-all text-text-muted hover:text-red shrink-0 self-start"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
