"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { startOfDay, endOfDay } from "date-fns";

export async function getTodayEntry(userId: string) {
  try {
    const today = startOfDay(new Date());
    const entry = await prisma.journalEntry.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });
    return { success: true, data: entry };
  } catch (error) {
    console.error("Error fetching today's entry:", error);
    return { success: false, error: "Falha ao buscar entrada de hoje" };
  }
}

export async function getEntries(userId: string, limit: number = 30) {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: { userId },
      take: limit,
      orderBy: { date: "desc" },
    });
    return { success: true, data: entries };
  } catch (error) {
    console.error("Error fetching entries:", error);
    return { success: false, error: "Falha ao buscar histórico do diário" };
  }
}

export async function saveEntry(userId: string, data: { content: string; mood: number; tags: string[] }) {
  try {
    const today = startOfDay(new Date());
    const entry = await prisma.journalEntry.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        content: data.content,
        mood: data.mood,
        tags: data.tags,
      },
      create: {
        userId,
        date: today,
        content: data.content,
        mood: data.mood,
        tags: data.tags,
      },
    });

    revalidatePath("/dashboard/journal");
    return { success: true, data: entry };
  } catch (error) {
    console.error("Error saving entry:", error);
    return { success: false, error: "Falha ao salvar entrada" };
  }
}

export async function deleteEntry(entryId: string, userId: string) {
  try {
    await prisma.journalEntry.delete({
      where: { id: entryId, userId },
    });
    revalidatePath("/dashboard/journal");
    return { success: true };
  } catch (error) {
    console.error("Error deleting entry:", error);
    return { success: false, error: "Falha ao excluir entrada" };
  }
}
