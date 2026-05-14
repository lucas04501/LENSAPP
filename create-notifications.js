const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createTestNotifications() {
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found to notify.");
    return;
  }

  const notifications = [
    {
      userId: user.id,
      type: "RANK_UP",
      title: "Novo Rank Alcançado! 🏆",
      message: "Parabéns! Você agora é um BUILDER. Continue assim!",
    },
    {
      userId: user.id,
      type: "HABIT_REMINDER",
      title: "Hábito esquecido? 🧘",
      message: "Você ainda não completou 'Meditação matinal' hoje.",
    },
    {
      userId: user.id,
      type: "STREAK_RISK",
      title: "Streak em risco! 🔥",
      message: "Complete um hábito agora para não perder sua sequência de 12 dias.",
    },
    {
      userId: user.id,
      type: "ACHIEVEMENT",
      title: "Conquista Desbloqueada ⚡",
      message: "Você completou 10 sessões de Deep Work com sucesso.",
    },
  ];

  console.log("Creating test notifications...");
  for (const n of notifications) {
    await prisma.notification.create({ data: n });
  }
  console.log("Done!");
  await prisma.$disconnect();
}

createTestNotifications();
