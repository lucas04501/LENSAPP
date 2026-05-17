import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { subDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const formatType = searchParams.get("format") || "csv";
  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        habits: { where: { isArchived: false } },
        focusSessions: { orderBy: { startedAt: "desc" }, take: 100 },
        goals: { orderBy: { createdAt: "desc" } },
        journalEntries: { orderBy: { date: "desc" }, take: 50 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const logs = await prisma.habitLog.findMany({
      where: {
        userId,
        completedAt: { gte: subDays(new Date(), 90) },
      },
      include: { habit: true },
      orderBy: { completedAt: "desc" },
    });

    const today = format(new Date(), "yyyy-MM-dd");

    if (formatType === "csv") {
      let csvContent = "\ufeff"; // BOM for UTF-8 in Excel

      // Habits Section
      csvContent += "--- HABITOS ---\n";
      csvContent += "Nome,Categoria,Streak,Total Completado\n";
      user.habits.forEach(h => {
        csvContent += `"${h.title}","${h.category}","${h.currentStreak}","${h.totalCompletions}"\n`;
      });
      csvContent += "\n";

      // Logs Section
      csvContent += "--- LOGS (ULTIMOS 90 DIAS) ---\n";
      csvContent += "Data,Habito,XP Ganho\n";
      logs.forEach(l => {
        csvContent += `"${format(l.completedAt, "yyyy-MM-dd HH:mm")}","${l.habit.title}","${l.xpEarned}"\n`;
      });
      csvContent += "\n";

      // Focus Sessions
      csvContent += "--- SESSOES DE FOCO ---\n";
      csvContent += "Data,Tipo,Duracao (min),XP Ganho\n";
      user.focusSessions.forEach(s => {
        csvContent += `"${format(s.startedAt, "yyyy-MM-dd HH:mm")}","${s.type}","${s.durationMin}","${s.xpEarned}"\n`;
      });
      csvContent += "\n";

      // Goals
      csvContent += "--- METAS ---\n";
      csvContent += "Titulo,Descricao,Status,Progresso\n";
      user.goals.forEach(g => {
        csvContent += `"${g.title}","${g.description || ""}","${g.isCompleted ? "Completa" : "Em Progresso"}","${g.progress}%"\n`;
      });

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="lens-export-${today}.csv"`,
        },
      });
    }

    if (formatType === "pdf") {
      // Return HTML for browser printing
      const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Exportação LENS - ${today}</title>
          <style>
            body { font-family: sans-serif; color: #333; line-height: 1.6; padding: 40px; }
            h1 { color: #000; border-bottom: 2px solid #EEE; padding-bottom: 10px; }
            h2 { color: #555; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #EEE; padding: 10px; text-align: left; font-size: 12px; }
            th { background: #F9F9F9; }
            .logo { font-weight: 900; font-size: 24px; letter-spacing: -1px; }
            .date { font-size: 12px; color: #999; }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="logo">LENS</div>
            <div class="date">Exportado em ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}</div>
          </div>
          <h1>Relatório de Evolução Pessoal</h1>
          <p>Dados de <strong>${user.name || user.username}</strong> (${user.email})</p>

          <h2>Hábitos Ativos</h2>
          <table>
            <thead><tr><th>Título</th><th>Categoria</th><th>Streak</th><th>Total</th></tr></thead>
            <tbody>
              ${user.habits.map(h => `<tr><td>${h.title}</td><td>${h.category}</td><td>${h.currentStreak}</td><td>${h.totalCompletions}</td></tr>`).join("")}
            </tbody>
          </table>

          <h2>Últimas Sessões de Foco</h2>
          <table>
            <thead><tr><th>Data</th><th>Tipo</th><th>Duração</th><th>XP</th></tr></thead>
            <tbody>
              ${user.focusSessions.map(s => `<tr><td>${format(s.startedAt, "dd/MM/yyyy HH:mm")}</td><td>${s.type}</td><td>${s.durationMin} min</td><td>${s.xpEarned}</td></tr>`).join("")}
            </tbody>
          </table>

          <h2>Metas e Objetivos</h2>
          <table>
            <thead><tr><th>Título</th><th>Status</th><th>Progresso</th></tr></thead>
            <tbody>
              ${user.goals.map(g => `<tr><td>${g.title}</td><td>${g.isCompleted ? "Completa" : "Em Progresso"}</td><td>${g.progress}%</td></tr>`).join("")}
            </tbody>
          </table>

          <div class="no-print" style="margin-top: 50px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #000; color: #FFF; border: none; border-radius: 5px; cursor: pointer;">
              Imprimir / Salvar PDF
            </button>
          </div>
        </body>
        </html>
      `;

      return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Erro interno ao exportar dados" }, { status: 500 });
  }
}
