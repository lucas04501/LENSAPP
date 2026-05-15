import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding LENS database...");

  // Ranks
  const ranks = await Promise.all([
    prisma.rank.upsert({
      where: { id: "rank_1" },
      update: {},
      create: { id: "rank_1", name: "INITIATE",          minXP: 0,     maxXP: 499,   color: "#6B7280", icon: "Sprout" },
    }),
    prisma.rank.upsert({
      where: { id: "rank_2" },
      update: {},
      create: { id: "rank_2", name: "BUILDER",           minXP: 500,   maxXP: 1499,  color: "#3B82F6", icon: "Hammer" },
    }),
    prisma.rank.upsert({
      where: { id: "rank_3" },
      update: {},
      create: { id: "rank_3", name: "ARCHITECT OF FLOW", minXP: 1500,  maxXP: 3999,  color: "#A855F7", icon: "Layers" },
    }),
    prisma.rank.upsert({
      where: { id: "rank_4" },
      update: {},
      create: { id: "rank_4", name: "DEEP WORKER",       minXP: 4000,  maxXP: 7999,  color: "#F59E0B", icon: "Brain"  },
    }),
    prisma.rank.upsert({
      where: { id: "rank_5" },
      update: {},
      create: { id: "rank_5", name: "GHOST MODE",        minXP: 8000,  maxXP: 14999, color: "#06B6D4", icon: "Ghost"  },
    }),
    prisma.rank.upsert({
      where: { id: "rank_6" },
      update: {},
      create: { id: "rank_6", name: "NEURAL MASTER",     minXP: 15000, maxXP: 29999, color: "#EF4444", icon: "Zap"    },
    }),
    prisma.rank.upsert({
      where: { id: "rank_7" },
      update: {},
      create: { id: "rank_7", name: "TRANSCENDENT",      minXP: 30000, maxXP: 999999,color: "#F8F8F8", icon: "Crown"  },
    }),
  ]);

  // Achievements
  const achievementsData = [
    { key: "first_habit",   title: "Primeiro Passo",    description: "Criou seu primeiro hábito no sistema.", icon: "🌱", xpReward: 25, rarity: "COMMON" },
    { key: "streak_7",     title: "Uma Semana Sólida", description: "Manteve uma sequência de 7 dias.",      icon: "🔥", xpReward: 50, rarity: "COMMON" },
    { key: "streak_30",    title: "Mês Implacável",    description: "Manteve uma sequência de 30 dias.",     icon: "⚡", xpReward: 200, rarity: "RARE" },
    { key: "streak_66",    title: "Hábito Gravado",    description: "Manteve uma sequência de 66 dias.",     icon: "🧠", xpReward: 500, rarity: "EPIC" },
    { key: "xp_500",       title: "Builder",           description: "Atingiu a marca de 500 XP total.",      icon: "🏗️", xpReward: 30, rarity: "COMMON" },
    { key: "xp_1500",      title: "Architect",         description: "Atingiu a marca de 1500 XP total.",     icon: "🏛️", xpReward: 75, rarity: "RARE" },
    { key: "xp_4000",      title: "Deep Worker",       description: "Atingiu a marca de 4000 XP total.",     icon: "💎", xpReward: 150, rarity: "EPIC" },
    { key: "first_post",   title: "Voz da Tribo",      description: "Fez seu primeiro post no Gym Rats.",    icon: "📣", xpReward: 20, rarity: "COMMON" },
    { key: "focus_60",     title: "Foco Real",         description: "Focou por 60 minutos em um único dia.", icon: "⏱️", xpReward: 40, rarity: "COMMON" },
    { key: "perfect_week", title: "Semana Perfeita",   description: "Completou todos os hábitos por 7 dias.",icon: "🏆", xpReward: 150, rarity: "RARE" },
    { key: "habits_5",     title: "Sistema Montado",   description: "Tem 5 hábitos ativos simultâneos.",     icon: "⚙️", xpReward: 50, rarity: "COMMON" },
    { key: "goal_complete",title: "Meta Batida",       description: "Completou 1 meta dos 90 dias.",         icon: "🎯", xpReward: 100, rarity: "RARE" },
  ];

  for (const ach of achievementsData) {
    await prisma.achievement.upsert({
      where: { key: ach.key },
      update: ach,
      create: ach,
    });
  }

  // Demo user
  const hash = await bcrypt.hash("lens123", 12);
  const user = await prisma.user.upsert({
    where: { email: "lucas@lens.app" },
    update: {},
    create: {
      name:     "Lucas",
      username: "lucasCEO",
      email:    "lucas@lens.app",
      password: hash,
      xp:       1620,
      level:    4,
      totalStreak:   12,
      longestStreak: 30,
      rankId:   "rank_3",
    },
  });

  // Habits (Only if none exist for this user to avoid duplicates on multiple runs)
  const existingHabits = await prisma.habit.count({ where: { userId: user.id } });
  if (existingHabits === 0) {
    const habitsData = [
      { title: "Meditação 10min",     icon: "🧘", color: "#A855F7", category: "MIND" as const,    xpReward: 10 },
      { title: "Exercício",           icon: "🏋️", color: "#EF4444", category: "HEALTH" as const,  xpReward: 20 },
      { title: "Leitura 30min",       icon: "📚", color: "#3B82F6", category: "MIND" as const,    xpReward: 15 },
      { title: "Sem redes sociais",   icon: "🧠", color: "#22C55E", category: "MIND" as const,    xpReward: 25 },
      { title: "Água 2L",             icon: "💧", color: "#06B6D4", category: "HEALTH" as const,  xpReward: 10 },
      { title: "Planejamento noturno",icon: "📝", color: "#F59E0B", category: "WORK" as const,    xpReward: 10 },
    ];

    for (const h of habitsData) {
      await prisma.habit.create({
        data: { userId: user.id, ...h },
      });
    }
  }

  console.log("✅ Seed completo!");
  console.log(`   → Usuário: lucas@lens.app / senha: lens123`);
  console.log(`   → ${ranks.length} ranks criados`);
  console.log(`   → ${achievementsData.length} conquistas criadas`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
