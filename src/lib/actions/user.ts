"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
