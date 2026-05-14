import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, email, password } = body;

    if (!name || !username || !email || !password) {
      return new NextResponse("Campos obrigatórios ausentes", { status: 400 });
    }

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (userExists) {
      const message = userExists.email === email 
        ? "Este email já está em uso" 
        : "Este nome de usuário já está em uso";
      return new NextResponse(message, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name
    });
  } catch (error: any) {
    console.error("REGISTRATION_ERROR:", error);
    return new NextResponse(
      `Erro no servidor: ${error.message || "Erro desconhecido"}`, 
      { status: 500 }
    );
  }
}
