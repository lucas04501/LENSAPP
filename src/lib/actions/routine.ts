"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { headers } from "next/headers";

import { getToken } from "next-auth/jwt";

async function getUserId() {
  try {
    const req = {
      headers: Object.fromEntries(headers().entries()),
      cookies: Object.fromEntries(
        headers()
          .get("cookie")
          ?.split("; ")
          .map((c) => c.split("=")) || []
      ),
    } as any;

    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (token?.id) {
      console.log("SERVER_AUTH_SUCCESS: Found user ID in JWT token");
      return token.id as string;
    }

    // Fallback to getServerSession if getToken fails
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      console.log("SERVER_AUTH_SUCCESS: Found user ID in session");
      return session.user.id;
    }

    console.warn("SERVER_AUTH_FAIL: No authentication found in JWT or Session");
    return null;
  } catch (error) {
    console.error("SERVER_AUTH_FATAL: Error in authentication check", error);
    return null;
  }
}

export async function getRoutineBlocks(day: number) {
  try {
    const userId = await getUserId();
    if (!userId) {
      console.error("SERVER_ROUTINE_ERROR: Unauthorized access attempt");
      throw new Error("Unauthorized");
    }

    const blocks = await prisma.routineBlock.findMany({
      where: {
        userId,
        isActive: true,
        days: {
          has: day,
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
    return blocks;
  } catch (error) {
    console.error("SERVER_ROUTINE_ERROR [getRoutineBlocks]:", error);
    throw error;
  }
}

export async function getAllRoutineBlocks() {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const blocks = await prisma.routineBlock.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    const grouped: Record<number, any[]> = {
      1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: []
    };

    blocks.forEach(block => {
      block.days.forEach(day => {
        if (grouped[day]) {
          grouped[day].push(block);
        }
      });
    });

    return grouped;
  } catch (error) {
    console.error("SERVER_ROUTINE_ERROR [getAllRoutineBlocks]:", error);
    throw error;
  }
}

export async function createRoutineBlock(data: {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  days: number[];
  color?: string;
  category?: string;
}) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    // Strict parsing of days as an array of integers
    const parsedDays = Array.isArray(data.days)
      ? data.days.map(d => parseInt(String(d), 10)).filter(d => !isNaN(d))
      : [];

    const block = await prisma.routineBlock.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        days: parsedDays,
        color: data.color || "purple",
        category: data.category || "general",
      },
    });

    revalidatePath("/dashboard/routine");
    return block;
  } catch (error) {
    console.error("SERVER_ROUTINE_ERROR [createRoutineBlock]:", error);
    throw error;
  }
}

export async function updateRoutineBlock(id: string, data: any) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    // Strict parsing of days if present in data
    const updateData: any = { ...data };
    if (updateData.days) {
      updateData.days = Array.isArray(updateData.days)
        ? updateData.days.map((d: any) => parseInt(String(d), 10)).filter((d: number) => !isNaN(d))
        : [];
    }

    const block = await prisma.routineBlock.update({
      where: {
        id,
        userId,
      },
      data: updateData,
    });

    revalidatePath("/dashboard/routine");
    return block;
  } catch (error) {
    console.error("SERVER_ROUTINE_ERROR [updateRoutineBlock]:", error);
    throw error;
  }
}

export async function deleteRoutineBlock(id: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const block = await prisma.routineBlock.update({
      where: {
        id,
        userId,
      },
      data: {
        isActive: false,
      },
    });

    revalidatePath("/dashboard/routine");
    return block;
  } catch (error) {
    console.error("SERVER_ROUTINE_ERROR [deleteRoutineBlock]:", error);
    throw error;
  }
}

export async function duplicateDayToWeek(sourceDay: number) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const sourceBlocks = await prisma.routineBlock.findMany({
      where: {
        userId,
        isActive: true,
        days: {
          has: sourceDay,
        },
      },
    });

    for (const block of sourceBlocks) {
      await prisma.routineBlock.update({
        where: { id: block.id },
        data: {
          days: [1, 2, 3, 4, 5, 6, 7],
        },
      });
    }

    revalidatePath("/dashboard/routine");
  } catch (error) {
    console.error("SERVER_ROUTINE_ERROR [duplicateDayToWeek]:", error);
    throw error;
  }
}
