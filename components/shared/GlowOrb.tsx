"use client";

import { cn } from "@/lib/utils";

interface GlowOrbProps {
  className?: string;
  color?: "blue" | "orange" | "purple";
  size?: "sm" | "md" | "lg";
  /** kept for backwards compatibility; ignored. */
  blur?: number;
}

// Strong-falloff radial gradients (no `filter: blur` — that triggers
// GPU-heavy paints per frame). The gradient itself produces the glow.
const bgMap = {
  blue:
    "radial-gradient(circle, rgba(0,120,255,0.55), rgba(0,120,255,0.18) 35%, transparent 70%)",
  orange:
    "radial-gradient(circle, rgba(255,107,0,0.45), rgba(255,107,0,0.15) 35%, transparent 70%)",
  purple:
    "radial-gradient(circle, rgba(139,92,246,0.45), rgba(139,92,246,0.15) 35%, transparent 70%)",
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
}: GlowOrbProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "absolute rounded-full pointer-events-none opacity-60",
        sizeMap[size],
        className,
      )}
      style={{ background: bgMap[color] }}
    />
  );
}
