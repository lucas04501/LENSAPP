'use client';

import { useEffect } from "react";
import { useUIStore } from "@/store";

export function DashboardClientWrapper() {
  const { openCommandPalette } = useUIStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [openCommandPalette]);

  return null;
}
