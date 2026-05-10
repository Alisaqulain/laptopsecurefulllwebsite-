"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { stats } from "@/lib/data/misc";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";

export function Stats() {
  return (
    <section className="container py-20 md:py-28">
      <div className="relative overflow-hidden rounded-3xl glass-strong border border-electric-500/20 p-10 md:p-14">
        {/* Animated bg */}
        <motion.div
          aria-hidden
          className="absolute -top-1/2 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(0,120,255,0.2), transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="absolute inset-0 bg-grid opacity-30" />

        <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = (Icons as any)[stat.icon] || Icons.Sparkles;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-electric-500/15 border border-electric-500/30 mb-4">
                  <Icon className="h-7 w-7 text-electric-300" />
                </div>
                <div className="font-display text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-electric-300">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="mt-2 text-sm md:text-base text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
