"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subDays, format, eachDayOfInterval } from "date-fns";

async function getRankByXP(xp: number) {
  const rank = await prisma.rank.findFirst({
    where: {
      minXP: { lte: xp },
      maxXP: { gte: xp },
    },
  });
  return rank;
}

export async function getDashboardStats(userId: string) {
  try {
    const today = new Date();
    const last7Days = eachDayOfInterval({
      start: subDays(today, 6),
      end: today,
    });

    // 1. User Data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { rank: true },
    });

    if (!user) return { success: false, error: "Usuário não encontrado" };

    const rank = await getRankByXP(user.xp);

    // 2. Habits Stats
    const habitsToday = await prisma.habit.count({
      where: { userId, isActive: true, isArchived: false },
    });

    const habitsCompleted = await prisma.habitLog.count({
      where: {
        userId,
        completedAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    // 3. Focus Stats
    const focusSessionsToday = await prisma.focusSession.findMany({
      where: {
        userId,
        startedAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
      select: { durationMin: true },
    });

    const focusMinutesToday = focusSessionsToday.reduce((acc, s) => acc + s.durationMin, 0);

    // 4. Weekly Data
    const weeklyData = await Promise.all(
      last7Days.map(async (date) => {
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        const habitsCount = await prisma.habitLog.count({
          where: { userId, completedAt: { gte: dayStart, lte: dayEnd } },
        });

        const focusSessions = await prisma.focusSession.findMany({
          where: { userId, startedAt: { gte: dayStart, lte: dayEnd } },
          select: { durationMin: true, xpEarned: true },
        });

        const focusMins = focusSessions.reduce((acc, s) => acc + s.durationMin, 0);
        const xpGained = focusSessions.reduce((acc, s) => acc + s.xpEarned, 0);

        // Also get habit XP for that day
        const habitsXP = await prisma.habitLog.aggregate({
          where: { userId, completedAt: { gte: dayStart, lte: dayEnd } },
          _sum: { xpEarned: true },
        });

        return {
          day: format(date, "EEE"),
          focus: focusMins,
          habits: habitsCount,
          xp: xpGained + (habitsXP._sum.xpEarned || 0),
        };
      })
    );

    // 5. XP Progress
    // Level L needs (L-1)^2 * 100 XP. Next Level L+1 needs L^2 * 100 XP.
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
        focusMinutesToday,
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
