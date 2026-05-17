'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notifications";

export async function toggleLike(postId: string, userId: string) {
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      revalidatePath("/dashboard/social");
      return { liked: false };
    } else {
      await prisma.like.create({
        data: { postId, userId },
      });

      // Get post author to notify
      const post = await prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true, user: { select: { username: true } } },
      });

      const likingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, name: true },
      });

      if (post && post.userId !== userId) {
        await createNotification(
          post.userId,
          "SOCIAL_LIKE",
          "Novo Like! ❤️",
          `@${likingUser?.username || likingUser?.name} curtiu seu post.`,
          "/dashboard/social"
        );
      }

      revalidatePath("/dashboard/social");
      return { liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { error: "Erro ao processar like" };
  }
}

export async function addComment(postId: string, userId: string, content: string) {
  try {
    const comment = await prisma.comment.create({
      data: { postId, userId, content },
    });

    // Get post author to notify
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    const commentingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { username: true, name: true },
    });

    if (post && post.userId !== userId) {
      await createNotification(
        post.userId,
        "SOCIAL_COMMENT",
        "Novo Comentário! 💬",
        `@${commentingUser?.username || commentingUser?.name} comentou no seu post.`,
        "/dashboard/social"
      );
    }

    revalidatePath("/dashboard/social");
    return { success: true, data: comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Erro ao adicionar comentário" };
  }
}
