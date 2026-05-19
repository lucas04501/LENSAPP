import { Metadata } from "next";
import { HabitsContent } from "@/components/dashboard/habits/HabitsContent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHabitsWithTodayStatus } from "@/lib/actions/habits";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Hábitos | LENS",
};

export default async function HabitsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const res = await getHabitsWithTodayStatus(session.user.id);

  return <HabitsContent initialHabits={res.data || []} userId={session.user.id} />;
}
