"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, subDays, format, startOfWeek } from "date-fns";

export async function getDashboardStats(userId: string) {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday

  // 1. User XP and Streak
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      xp: true,
      totalStreak: true,
    },
  });

  // 2. Habits Today
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
  const habitsToday = await prisma.habit.findMany({
    where: {
      userId,
      isActive: true,
      targetDays: { has: dayOfWeek },
    },
    include: {
      logs: {
        where: {
          completedAt: {
            gte: startOfDay(today),
            lte: endOfDay(today),
          },
        },
      },
    },
  });

  const habitsDone = habitsToday.filter(h => h.logs.length >= h.targetCount).length;

  // 3. Focus Time Today
  const focusSessions = await prisma.focusSession.findMany({
    where: {
      userId,
      startedAt: {
        gte: startOfDay(today),
      },
    },
    select: {
      durationMin: true,
    },
  });

  const focusMinutes = focusSessions.reduce((acc, s) => acc + s.durationMin, 0);

  // 4. Weekly Data (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(today, 6 - i);
    return {
      date: d,
      dateStr: format(d, "yyyy-MM-dd"),
      label: format(d, "EEE"),
    };
  });

  const weeklyLogs = await prisma.habitLog.findMany({
    where: {
      userId,
      completedAt: {
        gte: startOfDay(last7Days[0].date),
      },
    },
  });

  const weeklyChartData = last7Days.map(day => {
    const count = weeklyLogs.filter(log => 
      format(log.completedAt, "yyyy-MM-dd") === day.dateStr
    ).length;
    return {
      name: day.label,
      value: count,
    };
  });

  return {
    totalXP: user?.xp || 0,
    currentStreak: user?.totalStreak || 0,
    habitsToday: {
      total: habitsToday.length,
      done: habitsDone,
    },
    focusMinutes,
    weeklyChartData,
  };
}
