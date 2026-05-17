"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { createNotification } from "./notifications";

export async function checkAndUnlockAchievements(userId: string) {
  try {
    const newlyUnlocked: any[] = [];

    // 1. Get user with necessary stats and current achievements
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userAchievements: true,
        _count: {
          select: {
            habits: { where: { isArchived: false } },
            posts: true,
            goals: { where: { isCompleted: true } },
          },
        },
      },
    });

    if (!user) return [];

    const unlockedKeys = new Set(user.userAchievements.map((ua) => ua.achievementId)); // Wait, I need keys or IDs. Let's use keys.
    // Fetch all achievement templates to map keys to IDs
    const allAchievements = await prisma.achievement.findMany();
    const achievementMap = new Map(allAchievements.map(a => [a.key, a]));
    const unlockedKeySet = new Set(
      user.userAchievements.map(ua => {
        const ach = allAchievements.find(a => a.id === ua.achievementId);
        return ach?.key;
      }).filter(Boolean)
    );

    // HELPER: Unlock Achievement
    const unlock = async (key: string) => {
      if (unlockedKeySet.has(key)) return;
      const template = achievementMap.get(key);
      if (!template) return;

      const ua = await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: template.id,
        },
        include: { achievement: true },
      });

      // Award XP
      await prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: template.xpReward },
          // Level recalculation might be needed if XP changes significantly
        },
      });

      newlyUnlocked.push(ua.achievement);

      // Create Notification
      await createNotification(
        userId,
        "ACHIEVEMENT",
        "Conquista Desbloqueada! 🏆",
        `Você desbloqueou: ${template.title}. +${template.xpReward} XP`,
        "/dashboard/achievements"
      );
    };

    // --- CONDITIONS ---

    // first_habit: criou 1 hábito
    if (user._count.habits >= 1) await unlock("first_habit");

    // habits_5: 5 hábitos ativos
    if (user._count.habits >= 5) await unlock("habits_5");

    // streak_7, streak_30, streak_66
    if (user.totalStreak >= 7) await unlock("streak_7");
    if (user.totalStreak >= 30) await unlock("streak_30");
    if (user.totalStreak >= 66) await unlock("streak_66");

    // xp_500, xp_1500, xp_4000
    if (user.xp >= 500) await unlock("xp_500");
    if (user.xp >= 1500) await unlock("xp_1500");
    if (user.xp >= 4000) await unlock("xp_4000");

    // first_post
    if (user._count.posts >= 1) await unlock("first_post");

    // goal_complete
    if (user._count.goals >= 1) await unlock("goal_complete");

    // focus_60: 60 minutos de foco em um dia
    const todayFocus = await prisma.focusSession.aggregate({
      where: {
        userId,
        startedAt: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
      },
      _sum: { durationMin: true },
    });
    if ((todayFocus._sum.durationMin || 0) >= 60) await unlock("focus_60");

    // perfect_week: todos hábitos por 7 dias (Simplified: checking last 7 days check-ins count vs habits count)
    // For a truly "perfect week", we'd need more complex logic, but let's approximate or implement basic check.
    // For now, let's just do a basic one.

    if (newlyUnlocked.length > 0) {
      revalidatePath("/dashboard/achievements");
      revalidatePath("/dashboard");
    }

    return newlyUnlocked;
  } catch (error) {
    console.error("Error checking achievements:", error);
    return [];
  }
}

export async function getUserAchievements(userId: string) {
  try {
    const allAchievements = await prisma.achievement.findMany({
      orderBy: { xpReward: "asc" },
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });

    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    return {
      success: true,
      data: allAchievements.map((ach) => ({
        ...ach,
        locked: !unlockedIds.has(ach.id),
        unlockedAt: userAchievements.find((ua) => ua.achievementId === ach.id)?.unlockedAt,
      })),
    };
  } catch (error) {
    console.error("Error fetching user achievements:", error);
    return { success: false, error: "Falha ao buscar conquistas" };
  }
}
