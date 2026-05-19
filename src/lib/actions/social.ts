"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPosts(userId: string) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            level: true,
            rank: {
              select: {
                name: true,
                color: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        likes: {
          where: {
            userId: userId,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    return posts.map((post) => ({
      ...post,
      isLiked: post.likes.length > 0,
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

export async function createPost(
  userId: string,
  content: string,
  tags: string[],
  type: any
) {
  try {
    await prisma.$transaction([
      prisma.post.create({
        data: {
          userId,
          content,
          tags,
          type,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          xp: { increment: 15 },
        },
      }),
    ]);

    revalidatePath("/dashboard/social");
    return { success: true, message: "Post publicado! +15 XP" };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, message: "Erro ao publicar post" };
  }
}

export async function toggleLike(postId: string, userId: string) {
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }

    revalidatePath("/dashboard/social");
    return { success: true };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false };
  }
}

export async function deletePost(postId: string, userId: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      return { success: false, message: "Não autorizado" };
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    revalidatePath("/dashboard/social");
    return { success: true, message: "Post deletado" };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, message: "Erro ao deletar post" };
  }
}
