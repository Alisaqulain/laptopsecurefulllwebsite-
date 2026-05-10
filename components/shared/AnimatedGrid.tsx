"use client";

import { motion } from "framer-motion";

/**
 * Animated tech grid background — radial gradient pulses
 * sliding across a scan-line grid.
 */
export function AnimatedGrid({
  className = "",
  intensity = 1,
}: {
  className?: string;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {/* Static grid */}
      <div
        className="absolute inset-0 bg-grid"
        style={{ opacity: 0.5 * intensity }}
      />

      {/* Sweeping gradient */}
      <motion.div
        className="absolute -inset-[20%]"
        style={{
          background:
            "radial-gradient(ellipse 35% 50% at 50% 50%, rgba(0,120,255,0.18), transparent 70%)",
        }}
        animate={{ x: ["-15%", "15%", "-15%"], y: ["-10%", "10%", "-10%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Horizontal scan line */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-electric-400/60 to-transparent"
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        style={{ filter: "blur(0.5px)" }}
      />

      {/* Vertical scan line */}
      <motion.div
        className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-neon-400/40 to-transparent"
        animate={{ left: ["0%", "100%", "0%"] }}
        transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        style={{ filter: "blur(0.5px)" }}
      />

      {/* Mask vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
    </div>
  );
}
