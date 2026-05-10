"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/layout/Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <Logo showText={false} />
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
        <p className="text-sm text-muted-foreground tracking-widest uppercase">
          Loading premium tech...
        </p>
      </div>
    </div>
  );
}
