"use server";

import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, format, eachDayOfInterval } from "date-fns";

export async function getCalendarData(userId: string, year: number, month: number) {
  try {
    const startDate = startOfMonth(new Date(year, month));
    const endDate = endOfMonth(startDate);

    // 1. Get user habits
    const habits = await prisma.habit.findMany({
      where: { userId, isArchived: false },
    });

    // 2. Get logs for the month
    const logs = await prisma.habitLog.findMany({
      where: {
        userId,
        completedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        habitId: true,
        completedAt: true,
        xpEarned: true,
      },
    });

    // 3. Group logs by date
    const logsByDate: Record<string, string[]> = {};
    logs.forEach((log) => {
      const dateStr = format(log.completedAt, "yyyy-MM-dd");
      if (!logsByDate[dateStr]) logsByDate[dateStr] = [];
      logsByDate[dateStr].push(log.habitId);
    });

    // 4. Calculate Stats
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
    let perfectDays = 0;
    let totalXP = 0;
    let maxStreak = 0;
    let currentStreak = 0;

    daysInMonth.forEach((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const completedIds = logsByDate[dateStr] || [];
      
      // Perfect Day: all currently active habits completed
      if (habits.length > 0 && completedIds.length >= habits.length) {
        perfectDays++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }

      // Sum XP
      const dayLogs = logs.filter(l => format(l.completedAt, "yyyy-MM-dd") === dateStr);
      totalXP += dayLogs.reduce((acc, l) => acc + l.xpEarned, 0);
    });

    const totalExpected = habits.length * daysInMonth.length;
    const completionRate = totalExpected > 0 ? Math.round((logs.length / totalExpected) * 100) : 0;

    return {
      success: true,
      data: {
        habits,
        logsByDate,
        stats: {
          perfectDays,
          completionRate,
          bestStreak: maxStreak,
          totalXP,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return { success: false, error: "Falha ao carregar dados do calendário" };
  }
}
