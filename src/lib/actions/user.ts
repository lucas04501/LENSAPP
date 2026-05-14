"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    return { success: true, user };
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error("Este nome de usuário já está em uso.");
    }
    throw new Error("Erro ao atualizar perfil.");
  }
}
