"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gamepad2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Headphones,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

const categories = [
  {
    title: "Gaming Laptops",
    description: "RTX 4060–4090 powered beasts.",
    icon: Gamepad2,
    href: "/shop?category=gaming",
    gradient: "from-rose-500/20 via-rose-500/5 to-transparent",
    accent: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    shadow: "hover:shadow-[0_25px_60px_-12px_rgba(244,63,94,0.4)]",
  },
  {
    title: "Business / ThinkPad",
    description: "Built to last, built to lead.",
    icon: Briefcase,
    href: "/shop?category=business",
    gradient: "from-electric-500/20 via-electric-500/5 to-transparent",
    accent: "bg-electric-500/15 text-electric-300 border-electric-500/30",
    shadow: "hover:shadow-[0_25px_60px_-12px_rgba(0,120,255,0.4)]",
  },
  {
    title: "Student Picks",
    description: "Affordable, reliable, college-ready.",
    icon: GraduationCap,
    href: "/shop?category=student",
    gradient: "from-amber-500/20 via-amber-500/5 to-transparent",
    accent: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    shadow: "hover:shadow-[0_25px_60px_-12px_rgba(245,158,11,0.4)]",
  },
  {
    title: "Refurbished MacBooks",
    description: "Like-new Apple silicon, half the price.",
    icon: Sparkles,
    href: "/shop?category=refurbished",
    gradient: "from-violet-500/20 via-violet-500/5 to-transparent",
    accent: "bg-violet-500/15 text-violet-300 border-violet-500/30",
    shadow: "hover:shadow-[0_25px_60px_-12px_rgba(139,92,246,0.4)]",
  },
  {
    title: "Custom PC Builds",
    description: "Designed by experts, built for you.",
    icon: Cpu,
    href: "/custom-pc",
    gradient: "from-neon-500/20 via-neon-500/5 to-transparent",
    accent: "bg-neon-500/15 text-neon-300 border-neon-500/30",
    shadow: "hover:shadow-[0_25px_60px_-12px_rgba(255,107,0,0.4)]",
  },
  {
    title: "Accessories",
    description: "RGB, audio, storage & more.",
    icon: Headphones,
    href: "/accessories",
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    accent: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    shadow: "hover:shadow-[0_25px_60px_-12px_rgba(16,185,129,0.4)]",
  },
];

export function Categories() {
  return (
    <section className="container py-20 md:py-28">
      <SectionHeading
        eyebrow="Shop by Category"
        title={
          <>
            Find the perfect{" "}
            <span className="gradient-text">tech for your needs</span>
          </>
        }
        subtitle="Curated collections of premium laptops, gaming rigs, and accessories — handpicked by our expert team."
      />

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
          >
            <Link
              href={cat.href}
              className={`group relative block overflow-hidden rounded-2xl glass border border-white/5 hover:border-white/15 p-7 h-full transition-all duration-500 hover:-translate-y-1 ${cat.shadow}`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
              />
              <div className="relative z-10">
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-xl border ${cat.accent} mb-5 group-hover:scale-110 transition-transform`}
                >
                  <cat.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight">
                  {cat.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {cat.description}
                </p>
                <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-electric-300">
                  Browse
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
