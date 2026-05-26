import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 2. Parse form data
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // 3. Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de arquivo não suportado. Use JPEG, PNG ou WebP." },
        { status: 400 }
      )
    }

    // 4. Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 2MB." },
        { status: 400 }
      )
    }

    // 5. Convert to base64 and store in database
    // (avoids filesystem issues in serverless/Vercel environments)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    // 6. Update user in database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: base64 },
    })

    return NextResponse.json({ avatarUrl: base64, success: true })
  } catch (error) {
    console.error("Avatar upload error:", error)
    return NextResponse.json(
      { error: "Erro interno ao processar o upload." },
      { status: 500 }
    )
  }
}
