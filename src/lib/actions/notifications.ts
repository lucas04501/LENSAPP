"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string) {
  try {
    return await prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("GET_NOTIFICATIONS_ERROR:", error);
    return [];
  }
}

export async function markAsRead(notificationId: string) {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("MARK_AS_READ_ERROR:", error);
  }
}

export async function markAllAsRead(userId: string) {
  try {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("MARK_ALL_AS_READ_ERROR:", error);
  }
}
