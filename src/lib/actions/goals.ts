"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAndUnlockAchievements } from "./achievements";

export async function getGoals(userId: string) {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { targetDate: "asc" },
    });
    return { success: true, data: goals };
  } catch (error) {
    console.error("Error fetching goals:", error);
    return { success: false, error: "Falha ao buscar metas" };
  }
}

export async function createGoal(data: {
  title: string;
  description?: string;
  category: any;
  targetDate: Date;
  xpReward: number;
}, userId: string) {
  try {
    const goal = await prisma.goal.create({
      data: {
        ...data,
        userId,
      },
    });
    revalidatePath("/dashboard/goals");
    return { success: true, data: goal };
  } catch (error) {
    console.error("Error creating goal:", error);
    return { success: false, error: "Falha ao criar meta" };
  }
}

export async function updateProgress(goalId: string, progress: number, userId: string) {
  try {
    const isCompleted = progress >= 100;
    const goal = await prisma.goal.findUnique({
      where: { id: goalId },
    });

    if (!goal) return { success: false, error: "Meta não encontrada" };

    const updatedGoal = await prisma.goal.update({
      where: { id: goalId },
      data: {
        progress: Math.min(progress, 100),
        isCompleted: isCompleted || goal.isCompleted, // Once completed, stay completed? Or can it be uncompleted?
        // Let's stick to the prompt: "se 100% marca como completed"
      },
    });

    if (isCompleted && !goal.isCompleted) {
      // Award XP and Recalculate Level
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { xp: true },
      });

      if (user) {
        const newXP = user.xp + goal.xpReward;
        const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

        await prisma.user.update({
          where: { id: userId },
          data: {
            xp: newXP,
            level: newLevel,
          },
        });
      }
    }

    revalidatePath("/dashboard/goals");
    revalidatePath("/dashboard");
    const unlockedAchievements = await checkAndUnlockAchievements(userId);
    return { success: true, data: updatedGoal, unlockedAchievements };
  } catch (error) {
    console.error("Error updating goal progress:", error);
    return { success: false, error: "Falha ao atualizar progresso" };
  }
}

export async function deleteGoal(goalId: string, userId: string) {
  try {
    await prisma.goal.delete({
      where: { id: goalId, userId },
    });
    revalidatePath("/dashboard/goals");
    return { success: true };
  } catch (error) {
    console.error("Error deleting goal:", error);
    return { success: false, error: "Falha ao deletar meta" };
  }
}
