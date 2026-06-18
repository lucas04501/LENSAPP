"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type Preset = "blur" | "fade" | "slide" | "scale";
type Per = "word" | "char" | "line";

interface TextEffectProps {
  children: string;
  className?: string;
  per?: Per;
  preset?: Preset;
  delay?: number;
}

const presets: Record<Preset, Variants> = {
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
  },
};

export function TextEffect({
  children,
  className,
  per = "word",
  preset = "fade",
  delay = 0,
}: TextEffectProps) {
  const segments = React.useMemo(() => {
    if (per === "line") return children.split("\n");
    if (per === "word") return children.split(/(\s+)/);
    return children.split("");
  }, [children, per]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: per === "char" ? 0.01 : 0.05,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.span
      className={cn("inline-block", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {segments.map((segment, i) => (
        <motion.span
          key={`${segment}-${i}`}
          className={cn(
            "inline-block whitespace-pre",
            preset === "blur" && "will-change-[filter,opacity]"
          )}
          variants={presets[preset]}
        >
          {segment}
        </motion.span>
      ))}
    </motion.span>
  );
}
