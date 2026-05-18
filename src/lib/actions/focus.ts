"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { checkAndUnlockAchievements } from "./achievements";
import { XP_REWARDS } from "@/types";

export async function saveFocusSession(data: {
  userId: string;
  durationMin: number;
  type: "DEEP_WORK" | "POMODORO" | "FLOW" | "STUDY";
  title?: string;
  startedAt: Date;
  endedAt: Date;
}) {
  const xpEarned = data.durationMin * XP_REWARDS.FOCUS_PER_MIN;

  const session = await prisma.focusSession.create({
    data: {
      userId: data.userId,
      durationMin: data.durationMin,
      type: data.type,
      title: data.title,
      xpEarned,
      startedAt: data.startedAt,
      endedAt: data.endedAt,
    },
  });

  // Update User XP
  await prisma.user.update({
    where: { id: data.userId },
    data: {
      xp: {
        increment: xpEarned,
      },
    },
  });

  revalidatePath("/dashboard");
  const unlockedAchievements = await checkAndUnlockAchievements(data.userId);
  return { session, unlockedAchievements };
}

export async function getFocusToday(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessions = await prisma.focusSession.findMany({
    where: {
      userId,
      startedAt: {
        gte: today,
      },
    },
    orderBy: {
      startedAt: "desc",
    },
  });

  const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMin, 0);
  const totalXP = sessions.reduce((acc, s) => acc + s.xpEarned, 0);

  return {
    sessions,
    stats: {
      totalMinutes,
      totalSessions: sessions.length,
      totalXP,
    },
  };
}
