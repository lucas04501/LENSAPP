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

    if (token?.id) return token.id as string;

    const session = await getServerSession(authOptions);
    if (session?.user?.id) return session.user.id;

    return null;
  } catch (error) {
    console.error("SERVER_AUTH_FATAL_KANBAN: Error in authentication check", error);
    return null;
  }
}

export async function getBoard() {
  try {
    const userId = await getUserId();
    if (!userId) {
      console.error("SERVER_KANBAN_ERROR: Unauthorized access attempt");
      throw new Error("Unauthorized");
    }

    let board = await prisma.kanbanBoard.findFirst({
      where: { userId },
      include: {
        columns: {
          orderBy: { order: "asc" },
          include: {
            cards: {
              where: { isArchived: false },
              orderBy: { order: "asc" },
              include: {
                checklist: {
                  orderBy: { order: "asc" }
                }
              }
            },
          },
        },
      },
    });

    if (!board) {
      board = await prisma.kanbanBoard.create({
        data: {
          userId,
          name: "Meu Board",
          columns: {
            create: [
              { name: "Backlog", order: 1, color: "#6B7280" },
              { name: "Em andamento", order: 2, color: "#3B82F6" },
              { name: "Revisão", order: 3, color: "#F59E0B" },
              { name: "Concluído", order: 4, color: "#22C55E" },
            ],
          },
        },
        include: {
          columns: {
            orderBy: { order: "asc" },
            include: {
              cards: {
                where: { isArchived: false },
                orderBy: { order: "asc" },
                include: {
                  checklist: {
                    orderBy: { order: "asc" }
                  }
                }
              },
            },
          },
        },
      });
    }

    return board;
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [getBoard]:", error);
    throw error;
  }
}

export async function createCard(columnId: string, data: {
  title: string;
  description?: string;
  tag?: string;
  tagColor?: string;
  priority?: string;
  dueDate?: Date;
}) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const lastCard = await prisma.kanbanCard.findFirst({
      where: { columnId, isArchived: false },
      orderBy: { order: "desc" },
    });

    const order = lastCard ? lastCard.order + 1 : 1;

    const card = await prisma.kanbanCard.create({
      data: {
        columnId,
        userId,
        order,
        ...data,
      },
    });

    revalidatePath("/dashboard/kanban");
    return card;
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [createCard]:", error);
    throw error;
  }
}

export async function updateCard(cardId: string, data: any) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const card = await prisma.kanbanCard.update({
      where: { id: cardId, userId },
      data,
    });

    revalidatePath("/dashboard/kanban");
    return card;
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [updateCard]:", error);
    throw error;
  }
}

export async function moveCard(
  cardId: string, 
  targetColumnId: string, 
  newOrder: number
) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const card = await prisma.kanbanCard.findUnique({
      where: { id: cardId, userId },
    });

    if (!card) throw new Error("Card not found");

    const sourceColumnId = card.columnId;

    if (sourceColumnId === targetColumnId) {
      // Moving within the same column
      if (newOrder > card.order) {
        await prisma.kanbanCard.updateMany({
          where: {
            columnId: sourceColumnId,
            order: { gt: card.order, lte: newOrder },
            isArchived: false,
          },
          data: { order: { decrement: 1 } },
        });
      } else if (newOrder < card.order) {
        await prisma.kanbanCard.updateMany({
          where: {
            columnId: sourceColumnId,
            order: { lt: card.order, gte: newOrder },
            isArchived: false,
          },
          data: { order: { increment: 1 } },
        });
      }
    } else {
      // Moving to a different column
      await prisma.kanbanCard.updateMany({
        where: {
          columnId: sourceColumnId,
          order: { gt: card.order },
          isArchived: false,
        },
        data: { order: { decrement: 1 } },
      });

      await prisma.kanbanCard.updateMany({
        where: {
          columnId: targetColumnId,
          order: { gte: newOrder },
          isArchived: false,
        },
        data: { order: { increment: 1 } },
      });
    }

    await prisma.kanbanCard.update({
      where: { id: cardId },
      data: {
        columnId: targetColumnId,
        order: newOrder,
      },
    });

    revalidatePath("/dashboard/kanban");
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [moveCard]:", error);
    throw error;
  }
}

export async function deleteCard(cardId: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const card = await prisma.kanbanCard.update({
      where: { id: cardId, userId },
      data: { isArchived: true },
    });

    revalidatePath("/dashboard/kanban");
    return card;
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [deleteCard]:", error);
    throw error;
  }
}

export async function createColumn(boardId: string, name: string, color?: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const lastColumn = await prisma.kanbanColumn.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
    });

    const order = lastColumn ? lastColumn.order + 1 : 1;

    const column = await prisma.kanbanColumn.create({
      data: {
        boardId,
        name,
        order,
        color,
      },
    });

    revalidatePath("/dashboard/kanban");
    return column;
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [createColumn]:", error);
    throw error;
  }
}

export async function deleteColumn(columnId: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const column = await prisma.kanbanColumn.findUnique({
      where: { id: columnId },
      include: { board: true },
    });

    if (!column || column.board.userId !== userId) throw new Error("Unauthorized");

    await prisma.kanbanColumn.delete({
      where: { id: columnId },
    });

    revalidatePath("/dashboard/kanban");
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [deleteColumn]:", error);
    throw error;
  }
}

export async function renameColumn(columnId: string, name: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const column = await prisma.kanbanColumn.findUnique({
      where: { id: columnId },
      include: { board: true },
    });

    if (!column || column.board.userId !== userId) throw new Error("Unauthorized");

    await prisma.kanbanColumn.update({
      where: { id: columnId },
      data: { name },
    });

    revalidatePath("/dashboard/kanban");
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [renameColumn]:", error);
    throw error;
  }
}

// ─── CHECKLIST ACTIONS ────────────────────────────────────────────────────────

export async function getChecklist(cardId: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    return await prisma.checklistItem.findMany({
      where: { cardId },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [getChecklist]:", error);
    throw error;
  }
}

export async function addChecklistItem(cardId: string, text: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const lastItem = await prisma.checklistItem.findFirst({
      where: { cardId },
      orderBy: { order: "desc" },
    });

    const order = lastItem ? lastItem.order + 1 : 0;

    const item = await prisma.checklistItem.create({
      data: {
        cardId,
        text,
        order,
      },
    });

    revalidatePath("/dashboard/kanban");
    return item;
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [addChecklistItem]:", error);
    throw error;
  }
}

export async function toggleChecklistItem(itemId: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const item = await prisma.checklistItem.findUnique({
      where: { id: itemId },
    });

    if (!item) throw new Error("Item not found");

    const updated = await prisma.checklistItem.update({
      where: { id: itemId },
      data: { isChecked: !item.isChecked },
    });

    revalidatePath("/dashboard/kanban");
    return updated;
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [toggleChecklistItem]:", error);
    throw error;
  }
}

export async function updateChecklistItem(itemId: string, text: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const item = await prisma.checklistItem.update({
      where: { id: itemId },
      data: { text },
    });

    revalidatePath("/dashboard/kanban");
    return item;
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [updateChecklistItem]:", error);
    throw error;
  }
}

export async function deleteChecklistItem(itemId: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    await prisma.checklistItem.delete({
      where: { id: itemId },
    });

    revalidatePath("/dashboard/kanban");
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [deleteChecklistItem]:", error);
    throw error;
  }
}

export async function reorderChecklist(cardId: string, orderedIds: string[]) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Unauthorized");

    const updates = orderedIds.map((id, index) => 
      prisma.checklistItem.update({
        where: { id },
        data: { order: index },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath("/dashboard/kanban");
  } catch (error) {
    console.error("SERVER_KANBAN_ERROR [reorderChecklist]:", error);
    throw error;
  }
}
