"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowOrbProps {
  className?: string;
  color?: "blue" | "orange" | "purple";
  size?: "sm" | "md" | "lg";
  blur?: number;
}

const colorMap = {
  blue: "rgba(0, 120, 255, 0.5)",
  orange: "rgba(255, 107, 0, 0.4)",
  purple: "rgba(139, 92, 246, 0.4)",
};

const sizeMap = {
  sm: "h-64 w-64",
  md: "h-96 w-96",
  lg: "h-[600px] w-[600px]",
};

export function GlowOrb({
  className,
  color = "blue",
  size = "md",
  blur = 100,
}: GlowOrbProps) {
  return (
    <motion.div
      aria-hidden
      className={cn(
        "absolute rounded-full pointer-events-none",
        sizeMap[size],
        className,
      )}
      style={{
        background: `radial-gradient(circle, ${colorMap[color]}, transparent 70%)`,
        filter: `blur(${blur}px)`,
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
