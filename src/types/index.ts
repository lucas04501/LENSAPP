// LENS — Global Types

export type RankTier =
  | "INITIATE"
  | "BUILDER"
  | "ARCHITECT OF FLOW"
  | "DEEP WORKER"
  | "GHOST MODE"
  | "NEURAL MASTER"
  | "TRANSCENDENT";

export interface Rank {
  id: string;
  name: RankTier;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  xp: number;
  level: number;
  totalStreak: number;
  longestStreak: number;
  rank?: Rank;
  createdAt: Date;
}

export type HabitCategory =
  | "HEALTH"
  | "MIND"
  | "WORK"
  | "SOCIAL"
  | "FINANCE"
  | "CREATIVE"
  | "OTHER";

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description?: string;
  icon?: string;
  color: string;
  category: HabitCategory;
  frequency: "DAILY" | "WEEKLY" | "CUSTOM";
  targetDays: number[];
  targetCount: number;
  xpReward: number;
  isActive: boolean;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  createdAt: Date;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date;
  note?: string;
  xpEarned: number;
}

export interface HabitWithLogs extends Habit {
  logs: HabitLog[];
}

export interface FocusSession {
  id: string;
  userId: string;
  title?: string;
  durationMin: number;
  type: "DEEP_WORK" | "POMODORO" | "FLOW" | "STUDY";
  xpEarned: number;
  startedAt: Date;
  endedAt: Date;
}

export interface Post {
  id: string;
  userId: string;
  user: Pick<User, "id" | "name" | "username" | "avatarUrl" | "rank" | "level">;
  content: string;
  imageUrls: string[];
  tags: string[];
  type: "PROGRESS" | "MILESTONE" | "CHALLENGE" | "REFLECTION";
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: Pick<User, "id" | "name" | "username" | "avatarUrl">;
  content: string;
  createdAt: Date;
}

// ─── Dashboard / Analytics ─────────────────────────────────────────────────
export interface DashboardStats {
  totalXP: number;
  level: number;
  rank: Rank;
  xpToNextLevel: number;
  xpProgress: number; // 0-100 percentage
  currentStreak: number;
  habitsToday: number;
  habitsCompleted: number;
  focusMinutesToday: number;
  weeklyFocusData: WeeklyData[];
  radarData: RadarDataPoint[];
}

export interface WeeklyData {
  day: string;
  focus: number;
  habits: number;
  xp: number;
}

export interface RadarDataPoint {
  subject: string;
  value: number;
  fullMark: number;
}

export interface HeatmapData {
  date: string;
  count: number; // 0-4 intensity
}

// ─── Command Palette ───────────────────────────────────────────────────────
export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  shortcut?: string[];
  action: () => void;
  category: "navigation" | "habit" | "focus" | "social" | "settings";
}

// ─── Gamification ──────────────────────────────────────────────────────────
export const RANKS: Rank[] = [
  { id: "1", name: "INITIATE",          minXP: 0,     maxXP: 499,   color: "#6B7280", icon: "Sprout" },
  { id: "2", name: "BUILDER",           minXP: 500,   maxXP: 1499,  color: "#3B82F6", icon: "Hammer" },
  { id: "3", name: "ARCHITECT OF FLOW", minXP: 1500,  maxXP: 3999,  color: "#A855F7", icon: "Layers" },
  { id: "4", name: "DEEP WORKER",       minXP: 4000,  maxXP: 7999,  color: "#F59E0B", icon: "Brain" },
  { id: "5", name: "GHOST MODE",        minXP: 8000,  maxXP: 14999, color: "#06B6D4", icon: "Ghost" },
  { id: "6", name: "NEURAL MASTER",     minXP: 15000, maxXP: 29999, color: "#EF4444", icon: "Zap" },
  { id: "7", name: "TRANSCENDENT",      minXP: 30000, maxXP: 999999,color: "#F8F8F8", icon: "Crown" },
];

export function getRankByXP(xp: number): Rank {
  return RANKS.find(r => xp >= r.minXP && xp <= r.maxXP) ?? RANKS[0];
}

export function getLevelByXP(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 100;
}

export function getXPProgress(xp: number): { current: number; next: number; percentage: number } {
  const level = getLevelByXP(xp);
  const currentLevelXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const percentage = Math.round(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);
  return { current: xp - currentLevelXP, next: nextLevelXP - currentLevelXP, percentage };
}

export const XP_REWARDS = {
  HABIT_COMPLETE: 10,
  HABIT_STREAK_BONUS: 5,  // per day of streak
  FOCUS_PER_MIN: 1,
  POST_CREATE: 15,
  MILESTONE: 50,
  FIRST_HABIT: 25,
  WEEK_PERFECT: 100,
};
