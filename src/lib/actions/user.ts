"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { subDays, format } from "date-fns";

export async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        rank: true,
      },
    });

    if (!user) return { success: false, error: "Usuário não encontrado" };

    return { success: true, data: user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, error: "Falha ao buscar usuário" };
  }
}

export async function getFullProfile(userId: string) {
  try {
    const today = new Date();
    const oneYearAgo = subDays(today, 366);

    // 1. User with Rank
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        rank: true,
      },
    });

    if (!user) return { success: false, error: "Usuário não encontrado" };

    // 2. Habits (active)
    const habits = await prisma.habit.findMany({
      where: { userId, isArchived: false },
      orderBy: { createdAt: "desc" },
    });

    // 3. Stats
    const totalHabitLogs = await prisma.habitLog.count({
      where: { userId },
    });

    const logsForHeatmap = await prisma.habitLog.findMany({
      where: {
        userId,
        completedAt: { gte: oneYearAgo },
      },
      select: { completedAt: true },
    });

    const heatmap: Record<string, number> = {};
    const activeDaysSet = new Set<string>();
    
    logsForHeatmap.forEach((log) => {
      const dateStr = format(log.completedAt, "yyyy-MM-dd");
      heatmap[dateStr] = (heatmap[dateStr] || 0) + 1;
      activeDaysSet.add(dateStr);
    });

    // 4. Recent Posts
    const recentPosts = await prisma.post.findMany({
      where: { userId },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { likes: true },
        },
      },
    });

    return {
      success: true,
      data: {
        user,
        habits,
        totalHabitLogs,
        activeDays: activeDaysSet.size,
        recentPosts: recentPosts.map(post => ({
          ...post,
          likesCount: post._count.likes,
        })),
        heatmap,
      },
    };
  } catch (error) {
    console.error("Error fetching full profile:", error);
    return { success: false, error: "Falha ao buscar perfil completo" };
  }
}

export async function updateProfile(userId: string, data: { name?: string; username?: string; bio?: string }) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        username: data.username,
        bio: data.bio,
      },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return { success: true, data: user };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    if (error.code === 'P2002') {
      return { success: false, error: "Este nome de usuário já está em uso." };
    }
    return { success: false, error: "Erro ao atualizar perfil." };
  }
}
