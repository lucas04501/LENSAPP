"use server";

import { prisma } from "@/lib/prisma";
import { 
  startOfDay, endOfDay, subDays, format, eachDayOfInterval, 
  startOfWeek, endOfWeek, isSameDay, isFuture 
} from "date-fns";
import { ptBR } from "date-fns/locale";

// ... (getRankByXP remains the same)

export async function getWeeklyData(userId: string) {
  try {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    
    const daysInWeek = eachDayOfInterval({
      start: weekStart,
      end: weekEnd,
    });

    const [habitLogs, focusSessions] = await Promise.all([
      prisma.habitLog.findMany({
        where: {
          userId,
          completedAt: { gte: weekStart, lte: weekEnd },
        },
      }),
      prisma.focusSession.findMany({
        where: {
          userId,
          startedAt: { gte: weekStart, lte: weekEnd },
        },
      }),
    ]);

    const weeklyData = daysInWeek.map((date) => {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const dayHabitLogs = habitLogs.filter(
        (log) => log.completedAt >= dayStart && log.completedAt <= dayEnd
      );
      
      const dayFocusSessions = focusSessions.filter(
        (s) => s.startedAt >= dayStart && s.startedAt <= dayEnd
      );

      return {
        day: format(date, "EEE", { locale: ptBR }).replace(".", ""),
        fullDate: date,
        habits: dayHabitLogs.length,
        focusMin: dayFocusSessions.reduce((acc, s) => acc + s.durationMin, 0),
        isToday: isSameDay(date, today),
        isFuture: isFuture(date) && !isSameDay(date, today),
      };
    });

    return { success: true, data: weeklyData };
  } catch (error) {
    console.error("Error fetching weekly data:", error);
    return { success: false, error: "Falha ao buscar dados semanais" };
  }
}

export async function getDashboardStats(userId: string) {
  try {
    const today = new Date();
    const resWeekly = await getWeeklyData(userId);
    const weeklyData = resWeekly.success ? resWeekly.data : [];

    // 1. User Data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { rank: true },
    });

    if (!user) return { success: false, error: "Usuário não encontrado" };

    const rank = await getRankByXP(user.xp);

    // 2. Habits Stats
    const habits = await prisma.habit.findMany({
      where: { userId, isActive: true, isArchived: false },
      include: {
        logs: {
          where: {
            completedAt: {
              gte: subDays(today, 6),
            },
          },
        },
      },
    });

    const habitsToday = habits.length;
    const habitsCompleted = habits.filter(h => 
      h.logs.some(log => isSameDay(log.completedAt, today))
    ).length;

    // 5. XP Progress
    const currentLevel = user.level;
    const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 100;
    const xpForNextLevel = Math.pow(currentLevel, 2) * 100;
    
    const progressInLevel = user.xp - xpForCurrentLevel;
    const totalForLevel = xpForNextLevel - xpForCurrentLevel;
    const percentage = Math.min(Math.round((progressInLevel / totalForLevel) * 100), 100);

    return {
      success: true,
      data: {
        xp: user.xp,
        level: user.level,
        rank: rank || { name: "INICIANTE", color: "#94a3b8" },
        currentStreak: user.totalStreak,
        habitsToday,
        habitsCompleted,
        weeklyData,
        xpProgress: {
          current: progressInLevel,
          next: totalForLevel,
          percentage: percentage >= 0 ? percentage : 0,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Falha ao carregar estatísticas" };
  }
}
