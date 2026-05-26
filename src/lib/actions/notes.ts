"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

export async function getProjects(userId: string) {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId,
        isArchived: false,
      },
      include: {
        _count: {
          select: {
            notes: {
              where: { isArchived: false }
            }
          }
        }
      },
      orderBy: {
        order: "asc",
      },
    });

    return { success: true, data: projects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { success: false, error: "Falha ao buscar projetos" };
  }
}

export async function createProject(userId: string, name: string, color: string = "#7C3AED") {
  try {
    const project = await prisma.project.create({
      data: {
        userId,
        name,
        color,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Falha ao criar projeto" };
  }
}

export async function updateProject(id: string, userId: string, data: { name?: string; color?: string; order?: number }) {
  try {
    const project = await prisma.project.update({
      where: { id, userId },
      data,
    });

    revalidatePath("/dashboard");
    return { success: true, data: project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Falha ao atualizar projeto" };
  }
}

export async function deleteProject(id: string, userId: string) {
  try {
    await prisma.project.update({
      where: { id, userId },
      data: { isArchived: true },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Falha ao excluir projeto" };
  }
}

// ─── NOTES ────────────────────────────────────────────────────────────────────

export async function getNotes(userId: string, projectId?: string | null) {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        projectId: projectId === undefined ? undefined : projectId,
        isArchived: false,
      },
      orderBy: [
        { isPinned: "desc" },
        { updatedAt: "desc" },
      ],
    });

    return { success: true, data: notes };
  } catch (error) {
    console.error("Error fetching notes:", error);
    return { success: false, error: "Falha ao buscar notas" };
  }
}

export async function createNote(userId: string, projectId?: string | null) {
  try {
    const note = await prisma.note.create({
      data: {
        userId,
        projectId: projectId || null,
        title: "Sem título",
        content: "",
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: note };
  } catch (error) {
    console.error("Error creating note:", error);
    return { success: false, error: "Falha ao criar nota" };
  }
}

export async function updateNote(id: string, userId: string, data: { title?: string; content?: string }) {
  try {
    const note = await prisma.note.update({
      where: { id, userId },
      data,
    });

    revalidatePath("/dashboard");
    return { success: true, data: note };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, error: "Falha ao atualizar nota" };
  }
}

export async function deleteNote(id: string, userId: string) {
  try {
    await prisma.note.delete({
      where: { id, userId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: "Falha ao excluir nota" };
  }
}

export async function togglePin(id: string, userId: string) {
  try {
    const note = await prisma.note.findUnique({
      where: { id, userId },
      select: { isPinned: true },
    });

    if (!note) return { success: false, error: "Nota não encontrada" };

    await prisma.note.update({
      where: { id, userId },
      data: { isPinned: !note.isPinned },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error toggling pin:", error);
    return { success: false, error: "Falha ao fixar/desafixar nota" };
  }
}
