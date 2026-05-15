"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAndUnlockAchievements } from "./achievements";

export async function getHabitsWithTodayStatus(userId: string) {
  try {
    const today = new Date();
    const habits = await prisma.habit.findMany({
      where: {
        userId,
        isArchived: false,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: habits.map((habit) => ({
        ...habit,
        todayDone: habit.logs.length > 0,
      })),
    };
  } catch (error) {
    console.error("Error fetching habits:", error);
    return { success: false, error: "Falha ao buscar hábitos" };
  }
}

export async function completeHabit(habitId: string, userId: string) {
  try {
    const today = new Date();

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) return { success: false, error: "Hábito não encontrado" };

    // 1. Create HabitLog
    await prisma.habitLog.create({
      data: {
        habitId,
        userId,
        xpEarned: habit.xpReward,
        completedAt: today,
      },
    });

    // 2. Update Habit Streak
    const newStreak = habit.currentStreak + 1;
    const newLongestStreak = Math.max(newStreak, habit.longestStreak);

    await prisma.habit.update({
      where: { id: habitId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        totalCompletions: { increment: 1 },
      },
    });

    // 3. Update User XP and Level
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true },
    });

    if (user) {
      const newXP = user.xp + habit.xpReward;
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: newXP,
          level: newLevel,
        },
      });
    }

    revalidatePath("/dashboard");
    const unlockedAchievements = await checkAndUnlockAchievements(userId);
    return { success: true, unlockedAchievements };
  } catch (error) {
    console.error("Error completing habit:", error);
    return { success: false, error: "Falha ao completar hábito" };
  }
}

export async function uncompleteHabit(habitId: string, userId: string) {
  try {
    const today = new Date();

    const log = await prisma.habitLog.findFirst({
      where: {
        habitId,
        userId,
        completedAt: {
          gte: startOfDay(today),
          lte: endOfDay(today),
        },
      },
    });

    if (!log) return { success: false, error: "Log não encontrado" };

    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
    });

    if (!habit) return { success: false, error: "Hábito não encontrado" };

    // 1. Delete Log
    await prisma.habitLog.delete({
      where: { id: log.id },
    });

    // 2. Update Habit Streak (Decrement)
    await prisma.habit.update({
      where: { id: habitId },
      data: {
        currentStreak: { decrement: 1 },
        totalCompletions: { decrement: 1 },
      },
    });

    // 3. Update User XP
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { decrement: habit.xpReward },
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error uncompleting habit:", error);
    return { success: false, error: "Falha ao desmarcar hábito" };
  }
}

export async function createHabit(data: {
  title: string;
  icon?: string;
  color?: string;
  category?: any;
  xpReward: number;
}, userId: string) {
  try {
    const habit = await prisma.habit.create({
      data: {
        ...data,
        userId,
      },
    });

    revalidatePath("/dashboard/habits");
    revalidatePath("/dashboard");
    const unlockedAchievements = await checkAndUnlockAchievements(userId);
    return { success: true, data: habit, unlockedAchievements };
  } catch (error) {
    console.error("Error creating habit:", error);
    return { success: false, error: "Falha ao criar hábito" };
  }
}

export async function deleteHabit(habitId: string, userId: string) {
  try {
    await prisma.habit.update({
      where: { id: habitId, userId },
      data: { isArchived: true },
    });

    revalidatePath("/dashboard/habits");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting habit:", error);
    return { success: false, error: "Falha ao excluir hábito" };
  }
}

export async function getHeatmapData(userId: string) {
  try {
    const oneYearAgo = subDays(new Date(), 366);

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

    const heatmap: Record<string, number> = {};
    logs.forEach((log) => {
      const dateStr = format(log.completedAt, "yyyy-MM-dd");
      heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
    });

    return { success: true, data: heatmap };
  } catch (error) {
    console.error("Error fetching heatmap data:", error);
    return { success: false, error: "Falha ao buscar dados do heatmap" };
  }
}
