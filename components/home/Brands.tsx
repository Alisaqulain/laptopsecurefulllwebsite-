"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { brands } from "@/lib/data/misc";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function Brands() {
  // Duplicate for seamless infinite marquee
  const all = [...brands, ...brands];

  return (
    <section className="container py-20 md:py-28">
      <SectionHeading
        eyebrow="Premium Brands"
        title={
          <>
            We sell & service{" "}
            <span className="gradient-text">every major brand</span>
          </>
        }
        subtitle="From Apple and Dell to ROG and Alienware — find the brands you love at LaptopSecure."
      />

      <div className="mt-14 relative overflow-hidden">
        {/* Edge fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {all.map((brand, i) => {
            const Icon = (Icons as any)[brand.logo] || Icons.Laptop;
            return (
              <div
                key={`${brand.name}-${i}`}
                className="group flex items-center gap-3 rounded-2xl glass border border-white/5 px-7 py-5 transition-all duration-300 hover:border-electric-500/40 hover:shadow-glow-soft hover:scale-105 shrink-0"
              >
                <Icon className="h-6 w-6 text-electric-400 group-hover:text-electric-300 transition-colors" />
                <span className="font-display text-lg font-bold tracking-wide text-foreground/90 group-hover:text-foreground transition-colors">
                  {brand.name}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
