"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay, subDays } from "date-fns";

export async function getHabitsToday(userId: string) {
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // 1=Mon...7=Sun

  const habits = await prisma.habit.findMany({
    where: {
      userId,
      isActive: true,
      isArchived: false,
      targetDays: {
        has: dayOfWeek,
      },
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

  return habits.map((habit) => ({
    ...habit,
    isCompleted: habit.logs.length >= habit.targetCount,
  }));
}

export async function completeHabit(habitId: string, userId: string) {
  const today = new Date();

  // 1. Create Log
  const habit = await prisma.habit.findUnique({
    where: { id: habitId },
  });

  if (!habit) throw new Error("Habit not found");

  await prisma.habitLog.create({
    data: {
      habitId,
      userId,
      xpEarned: habit.xpReward,
      completedAt: today,
    },
  });

  // 2. Update User XP
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: {
        increment: habit.xpReward,
      },
    },
  });

  // 3. Update Habit Stats (Simplified streak for now)
  await prisma.habit.update({
    where: { id: habitId },
    data: {
      totalCompletions: {
        increment: 1,
      },
      currentStreak: {
        increment: 1,
      },
    },
  });

  revalidatePath("/dashboard");
}

export async function createHabit(data: any, userId: string) {
  const habit = await prisma.habit.create({
    data: {
      ...data,
      userId,
    },
  });

  revalidatePath("/dashboard");
  return habit;
}

export async function getHeatmapData(userId: string) {
  const oneYearAgo = subDays(new Date(), 365);

  const logs = await prisma.habitLog.findMany({
    where: {
      userId,
      completedAt: {
        gte: oneYearAgo,
      },
    },
    select: {
      completedAt: true,
    },
  });

  // Group by date
  const counts: Record<string, number> = {};
  logs.forEach((log) => {
    const dateStr = log.completedAt.toISOString().split("T")[0];
    counts[dateStr] = (counts[dateStr] || 0) + 1;
  });

  return Object.entries(counts).map(([date, count]) => ({
    date,
    count,
  }));
}
