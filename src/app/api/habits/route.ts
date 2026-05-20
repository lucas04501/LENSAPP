import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, icon, userId } = body;

    if (!title || !userId) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 200 });
    }

    const habit = await prisma.habit.create({
      data: {
        title,
        icon,
        userId,
        category: "HEALTH", // Default category
      },
    });

    return NextResponse.json({ success: true, habit });
  } catch (error) {
    console.error("Error creating habit:", error);
    // Never fail the onboarding flow
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
