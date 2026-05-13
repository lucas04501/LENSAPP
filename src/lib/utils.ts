import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  if (isToday(d))     return "Hoje";
  if (isYesterday(d)) return "Ontem";
  return format(d, "dd 'de' MMM", { locale: ptBR });
}

export function formatRelativeTime(date: Date | string): string {
  const d   = new Date(date);
  const now = new Date();
  const diffMs  = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1)   return "agora";
  if (diffMin < 60)  return `há ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24)    return `há ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `há ${diffD}d`;
}

export function formatXP(xp: number): string {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return xp.toString();
}

export function getHabitColor(index: number): string {
  const COLORS = [
    "#A855F7", "#EF4444", "#3B82F6", "#22C55E",
    "#F59E0B", "#06B6D4", "#EC4899", "#8B5CF6",
  ];
  return COLORS[index % COLORS.length];
}
