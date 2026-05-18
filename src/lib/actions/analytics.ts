"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function getAnalyticsData(userId: string) {
  try {
    const now = new Date();
    const last7Days = eachDayOfInterval({
      start: subDays(now, 6),
      end: now,
    });

    // 1. Weekly Data (last 7 days)
    const [focusSessions, habitLogs] = await Promise.all([
      prisma.focusSession.findMany({
        where: {
          userId,
          startedAt: { gte: subDays(startOfDay(now), 7) },
        },
      }),
      prisma.habitLog.findMany({
        where: {
          userId,
          completedAt: { gte: subDays(startOfDay(now), 7) },
        },
      }),
    ]);

    const weeklyData = last7Days.map(date => {
      const dayStr = format(date, "EEE", { locale: ptBR });
      const dayStart = startOfDay(date);
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const focus = focusSessions
        .filter(s => s.startedAt >= dayStart && s.startedAt <= dayEnd)
        .reduce((acc, s) => acc + s.durationMin, 0);

      const habitCount = habitLogs
        .filter(l => l.completedAt >= dayStart && l.completedAt <= dayEnd)
        .length;

      const xpFromFocus = focusSessions
        .filter(s => s.startedAt >= dayStart && s.startedAt <= dayEnd)
        .reduce((acc, s) => acc + s.xpEarned, 0);

      const xpFromHabits = habitLogs
        .filter(l => l.completedAt >= dayStart && l.completedAt <= dayEnd)
        .reduce((acc, l) => acc + l.xpEarned, 0);

      return {
        day: dayStr.toUpperCase(),
        foco: focus,
        habitos: habitCount,
        xp: xpFromFocus + xpFromHabits,
      };
    });

    // 2. Habit Rates (last 30 days)
    const thirtyDaysAgo = subDays(startOfDay(now), 30);
    const habits = await prisma.habit.findMany({
      where: { userId, isArchived: false, isActive: true },
      include: {
        _count: {
          积极: {
            where: { completedAt: { gte: thirtyDaysAgo } }
          }
        }
      }
    });

    // Note: The above _count in Prisma doesn't directly work as 'logs' check. 
    // Let's do it properly.
    const habitsWithLogs = await prisma.habit.findMany({
      where: { userId, isArchived: false, isActive: true },
      include: {
        logs: {
          where: { completedAt: { gte: thirtyDaysAgo } }
        }
      }
    });

    const habitRates = habitsWithLogs.map(h => ({
      name: h.title,
      rate: Math.min(Math.round((h.logs.length / 30) * 100), 100)
    })).sort((a, b) => b.rate - a.rate);

    // 3. XP Growth (last 12 weeks)
    const twelveWeeksAgo = subDays(startOfWeek(now), 12 * 7);
    const allRecentLogs = await prisma.habitLog.findMany({
      where: { userId, completedAt: { gte: twelveWeeksAgo } },
      select: { xpEarned: true, completedAt: true }
    });
    const allRecentSessions = await prisma.focusSession.findMany({
      where: { userId, startedAt: { gte: twelveWeeksAgo } },
      select: { xpEarned: true, startedAt: true }
    });

    const xpGrowth = Array.from({ length: 12 }).map((_, i) => {
      const weekStart = subDays(startOfWeek(now), (11 - i) * 7);
      const weekEnd = endOfWeek(weekStart);
      
      const xpLogs = allRecentLogs
        .filter(l => l.completedAt >= weekStart && l.completedAt <= weekEnd)
        .reduce((acc, l) => acc + l.xpEarned, 0);
      
      const xpSessions = allRecentSessions
        .filter(s => s.startedAt >= weekStart && s.startedAt <= weekEnd)
        .reduce((acc, s) => acc + s.xpEarned, 0);

      return {
        week: `S${12 - (11 - i)}`,
        xp: xpLogs + xpSessions
      };
    });

    // 4. Totals
    const totalFocusWeek = weeklyData.reduce((acc, d) => acc + d.foco, 0);
    const xpThisWeek = weeklyData.reduce((acc, d) => acc + d.xp, 0);
    const avgHabitRate = habitRates.length > 0 
      ? Math.round(habitRates.reduce((acc, h) => acc + h.rate, 0) / habitRates.length)
      : 0;

    return {
      success: true,
      data: {
        weeklyData,
        habitRates,
        xpGrowth,
        totalFocusWeek,
        avgHabitRate,
        xpThisWeek
      }
    };

  } catch (error) {
    console.error("Analytics Error:", error);
    return { success: false, error: "Falha ao carregar analytics" };
  }
}
