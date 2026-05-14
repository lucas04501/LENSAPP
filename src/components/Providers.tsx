"use client";

import { SessionProvider } from "next-auth/react";
import { LevelUpConfetti } from "./gamification/LevelUpConfetti";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LevelUpConfetti />
      {children}
    </SessionProvider>
  );
}
