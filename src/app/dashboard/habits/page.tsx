import { Metadata } from "next";
import { HabitsContent } from "@/components/dashboard/habits/HabitsContent";

export const metadata: Metadata = {
  title: "Hábitos | LENS",
};

export default function HabitsPage() {
  return <HabitsContent />;
}
