"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  className?: string;
  once?: boolean;
}

const variants: Variants = {
  hidden: ({ x = 0, y = 30 }: { x?: number; y?: number }) => ({
    opacity: 0,
    x,
    y,
  }),
  show: { opacity: 1, x: 0, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  duration = 0.6,
  y = 30,
  x = 0,
  className,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      custom={{ x, y }}
      viewport={{ once, margin: "-50px" }}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
