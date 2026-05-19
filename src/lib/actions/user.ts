"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { format, subDays } from "date-fns";
import { getRankByXP } from "@/types";

export async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "Erro ao buscar usuário" };
  }
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Error updating avatar:", error);
    return { success: false, error: "Falha ao atualizar foto de perfil" };
  }
}

export async function updateProfile(userId: string, data: { name: string; username: string; bio: string }) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        username: data.username,
        bio: data.bio,
      },
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar perfil" };
  }
}

export async function getFullProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        rank: true,
      },
    });

    if (!user) return { success: false, error: "Usuário não encontrado" };

    const habits = await prisma.habit.findMany({
      where: { userId, isArchived: false },
    });

    const totalHabitLogs = await prisma.habitLog.count({
      where: { userId },
    });

    // Dias ativos (com algum log de hábito ou sessão de foco)
    const habitLogs = await prisma.habitLog.findMany({
      where: { userId },
      select: { completedAt: true },
    });

    const focusSessions = await prisma.focusSession.findMany({
      where: { userId },
      select: { startedAt: true },
    });

    const activeDaysSet = new Set([
      ...habitLogs.map(l => format(l.completedAt, "yyyy-MM-dd")),
      ...focusSessions.map(s => format(s.startedAt, "yyyy-MM-dd"))
    ]);

    const activeDays = activeDaysSet.size;

    const recentPosts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        _count: {
          select: { likes: true }
        }
      }
    });

    // Heatmap data
    const oneYearAgo = subDays(new Date(), 365);
    const recentLogs = await prisma.habitLog.findMany({
      where: {
        userId,
        completedAt: { gte: oneYearAgo }
      },
      select: { completedAt: true }
    });

    const heatmap: Record<string, number> = {};
    recentLogs.forEach(log => {
      const dateStr = format(log.completedAt, "yyyy-MM-dd");
      heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
    });

    return {
      success: true,
      data: {
        user: {
          ...user,
          rank: user.rank || getRankByXP(user.xp),
        },
        habits,
        totalHabitLogs,
        activeDays,
        recentPosts: recentPosts.map(p => ({
          ...p,
          likesCount: p._count.likes
        })),
        heatmap
      }
    };
  } catch (error) {
    console.error("getFullProfile error:", error);
    return { success: false, error: "Erro ao carregar perfil completo" };
  }
}
