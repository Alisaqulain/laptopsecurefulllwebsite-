"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden">
      {/* Pulsing glow behind the logo */}
      <motion.div
        aria-hidden
        className="absolute h-[420px] w-[420px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,120,255,0.25), rgba(255,107,0,0.12), transparent 75%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="flex flex-col items-center gap-7 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Logo size={96} priority />
        </motion.div>

        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full bg-electric-500 shadow-[0_0_10px_#0078ff]"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        <p className="text-xs md:text-sm text-muted-foreground tracking-[0.4em] uppercase">
          Loading premium tech
        </p>
      </div>
    </div>
  );
}
