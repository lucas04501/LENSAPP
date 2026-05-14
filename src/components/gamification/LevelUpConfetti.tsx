"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import confetti from "canvas-confetti";
import { getLevelByXP } from "@/types";

export function LevelUpConfetti() {
  const { data: session } = useSession();
  const lastLevel = useRef<number | null>(null);

  useEffect(() => {
    if (session?.user) {
      const currentXP = (session.user as any).xp || 0;
      const currentLevel = getLevelByXP(currentXP);

      if (lastLevel.current !== null && currentLevel > lastLevel.current) {
        // Trigger confetti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function() {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      }

      lastLevel.current = currentLevel;
    }
  }, [session]);

  return null;
}
