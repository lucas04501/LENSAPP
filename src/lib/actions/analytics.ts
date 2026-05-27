"use server";

import { prisma } from "@/lib/prisma";
import { 
  startOfDay, endOfDay, subDays, format, startOfWeek, endOfWeek, 
  eachDayOfInterval, startOfMonth, endOfMonth, differenceInDays 
} from "date-fns";
import { ptBR } from "date-fns/locale";

export async function getAnalyticsData(userId: string) {
  try {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // 1. Stat Cards Data
    const monthLogs = await prisma.habitLog.findMany({
      where: { userId, completedAt: { gte: monthStart, lte: monthEnd } },
      select: { xpEarned: true }
    });

    const monthSessions = await prisma.focusSession.findMany({
      where: { userId, startedAt: { gte: monthStart, lte: monthEnd } },
      select: { xpEarned: true }
    });

    const totalXPMonth = monthLogs.reduce((acc, l) => acc + l.xpEarned, 0) + 
                        monthSessions.reduce((acc, s) => acc + s.xpEarned, 0);

    const weekSessions = await prisma.focusSession.findMany({
      where: { userId, startedAt: { gte: weekStart, lte: weekEnd } },
      select: { durationMin: true }
    });
    const totalFocusHoursWeek = Number((weekSessions.reduce((acc, s) => acc + s.durationMin, 0) / 60).toFixed(1));

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalStreak: true }
    });

    // Monthly Habit Rate
    const activeHabits = await prisma.habit.findMany({
      where: { userId, isArchived: false, isActive: true },
      include: {
        logs: { where: { completedAt: { gte: monthStart, lte: monthEnd } } }
      }
    });

    const daysPassedInMonth = Math.min(differenceInDays(now, monthStart) + 1, 31);
    let totalPossibleLogs = activeHabits.length * daysPassedInMonth;
    let actualLogs = activeHabits.reduce((acc, h) => acc + h.logs.length, 0);
    const habitRateMonth = totalPossibleLogs > 0 ? Math.round((actualLogs / totalPossibleLogs) * 100) : 0;

    // 2. XP Growth (12 weeks)
    const twelveWeeksAgo = subDays(weekStart, 11 * 7);
    const recentLogs = await prisma.habitLog.findMany({
      where: { userId, completedAt: { gte: twelveWeeksAgo } },
      select: { xpEarned: true, completedAt: true }
    });
    const recentSessions = await prisma.focusSession.findMany({
      where: { userId, startedAt: { gte: twelveWeeksAgo } },
      select: { xpEarned: true, startedAt: true }
    });

    const xpGrowth = Array.from({ length: 12 }).map((_, i) => {
      const wStart = subDays(weekStart, (11 - i) * 7);
      const wEnd = endOfWeek(wStart, { weekStartsOn: 1 });
      
      const xp = recentLogs
        .filter(l => l.completedAt >= wStart && l.completedAt <= wEnd)
        .reduce((acc, l) => acc + l.xpEarned, 0) +
        recentSessions
        .filter(s => s.startedAt >= wStart && s.startedAt <= wEnd)
        .reduce((acc, s) => acc + s.xpEarned, 0);

      return { week: `S${i + 1}`, xp };
    });

    // 3. Habit-specific rates (last 30 days)
    const thirtyDaysAgo = subDays(startOfDay(now), 30);
    const habitRates = activeHabits.map(h => {
      const logsLast30 = h.logs.filter(l => l.completedAt >= thirtyDaysAgo).length;
      return {
        name: h.title,
        rate: Math.min(Math.round((logsLast30 / 30) * 100), 100)
      };
    }).sort((a, b) => b.rate - a.rate);

    // 4. Focus Heatmap (8 weeks)
    const eightWeeksAgo = subDays(weekStart, 7 * 7);
    const heatmapSessions = await prisma.focusSession.findMany({
      where: { userId, startedAt: { gte: eightWeeksAgo } },
      select: { durationMin: true, startedAt: true }
    });

    const focusHeatmap = eachDayOfInterval({ start: eightWeeksAgo, end: now }).map(date => {
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      const focusMin = heatmapSessions
        .filter(s => s.startedAt >= dayStart && s.startedAt <= dayEnd)
        .reduce((acc, s) => acc + s.durationMin, 0);
      return { date, focusMin };
    });

    return {
      success: true,
      data: {
        totalXPMonth,
        habitRateMonth,
        totalFocusHoursWeek,
        currentStreak: user?.totalStreak || 0,
        xpGrowth,
        habitRates,
        focusHeatmap
      }
    };

  } catch (error) {
    console.error("Analytics Error:", error);
    return { success: false, error: "Falha ao carregar analytics" };
  }
}
