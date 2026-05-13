import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Habit, DashboardStats, CommandItem } from "@/types";

// ─── UI Store ──────────────────────────────────────────────────────────────
interface UIState {
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  activeModal: string | null;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: true,
  commandPaletteOpen: false,
  activeModal: null,
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));

// ─── User Store ────────────────────────────────────────────────────────────
interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  addXP: (amount: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      addXP: (amount) =>
        set((s) => {
          if (!s.user) return s;
          return { user: { ...s.user, xp: s.user.xp + amount } };
        }),
    }),
    { name: "lens-user" }
  )
);

// ─── Habits Store ──────────────────────────────────────────────────────────
interface HabitsState {
  habits: Habit[];
  todayCompleted: string[]; // habit IDs completed today
  isLoading: boolean;
  setHabits: (habits: Habit[]) => void;
  markComplete: (habitId: string) => void;
  unmarkComplete: (habitId: string) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, data: Partial<Habit>) => void;
  removeHabit: (id: string) => void;
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set) => ({
      habits: [],
      todayCompleted: [],
      isLoading: false,
      setHabits: (habits) => set({ habits }),
      markComplete: (habitId) =>
        set((s) => ({
          todayCompleted: [...s.todayCompleted, habitId],
          habits: s.habits.map((h) =>
            h.id === habitId
              ? { ...h, currentStreak: h.currentStreak + 1, totalCompletions: h.totalCompletions + 1 }
              : h
          ),
        })),
      unmarkComplete: (habitId) =>
        set((s) => ({
          todayCompleted: s.todayCompleted.filter((id) => id !== habitId),
        })),
      addHabit: (habit) => set((s) => ({ habits: [habit, ...s.habits] })),
      updateHabit: (id, data) =>
        set((s) => ({
          habits: s.habits.map((h) => (h.id === id ? { ...h, ...data } : h)),
        })),
      removeHabit: (id) =>
        set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
    }),
    { name: "lens-habits" }
  )
);

// ─── Dashboard Store ───────────────────────────────────────────────────────
interface DashboardState {
  stats: DashboardStats | null;
  isLoading: boolean;
  setStats: (stats: DashboardStats) => void;
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  stats: null,
  isLoading: false,
  setStats: (stats) => set({ stats }),
}));
