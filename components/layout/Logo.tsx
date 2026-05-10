"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 group", className)}
      aria-label="LaptopSecure home"
    >
      <motion.div
        whileHover={{ rotate: 8, scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-electric-500 to-electric-700 shadow-glow-blue"
      >
        <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2.4} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-neon-500 shadow-[0_0_10px_#ff6b00] animate-pulse" />
      </motion.div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Laptop<span className="text-electric-400">Secure</span>
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
            Buy • Sell • Repair
          </span>
        </div>
      )}
    </Link>
  );
}
