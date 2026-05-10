"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  ChevronDown,
  ShoppingCart,
  Wrench,
  IndianRupee,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import { AnimatedGrid } from "@/components/shared/AnimatedGrid";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

// Lazy-load 3D scene; bypasses SSR (R3F is browser-only)
const Laptop3D = dynamic(
  () => import("@/components/shared/Laptop3D").then((m) => m.Laptop3D),
  { ssr: false, loading: () => null },
);

const ctas = [
  {
    icon: ShoppingCart,
    label: "Shop Laptops",
    href: "/shop",
    variant: "default" as const,
  },
  {
    icon: IndianRupee,
    label: "Sell Device",
    href: "/sell",
    variant: "accent" as const,
  },
  {
    icon: Wrench,
    label: "Book Repair",
    href: "/repair",
    variant: "outline" as const,
  },
];

export function Hero() {
  const waHero = buildWhatsAppLink(waMessages.generic());

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 md:pt-28">
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <AnimatedGrid />
        <ParticleBackground density={20} />
        <GlowOrb className="left-[5%] top-[15%]" color="blue" size="lg" />
        <GlowOrb className="right-[5%] bottom-[10%]" color="orange" size="md" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      <div className="container grid lg:grid-cols-12 gap-12 items-center">
        {/* Left content */}
        <div className="lg:col-span-7 space-y-7 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-2 text-xs md:text-sm font-medium backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2 rounded-full bg-electric-400 shadow-[0_0_10px_#0078ff]">
              <span className="absolute inset-0 rounded-full bg-electric-400 animate-ping" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-neon-400" />
            India's Premium Laptop Marketplace
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.05] text-balance"
          >
            <span className="block">
              <span className="gradient-text">Buy</span> •{" "}
              <span className="gradient-text-orange">Sell</span> •
            </span>
            <span className="block">
              <span className="gradient-text">Upgrade</span> •{" "}
              <span className="gradient-text-orange">Repair</span>
            </span>
            <span className="block text-foreground/95 text-2xl sm:text-3xl md:text-4xl lg:text-5xl mt-3 font-semibold tracking-tight">
              The future of laptop trading.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed"
          >
            Premium new, refurbished & second-hand laptops, gaming PCs, custom
            workstations, accessories, and certified repair services. Trade in,
            upgrade, and shop with confidence — backed by a 12-month warranty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3"
          >
            {ctas.map((c) => (
              <Button asChild key={c.label} size="xl" variant={c.variant}>
                <Link href={c.href}>
                  <c.icon className="h-5 w-5" />
                  {c.label}
                </Link>
              </Button>
            ))}
            <Button asChild size="xl" variant="whatsapp">
              <a href={waHero} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                WhatsApp Order
              </a>
            </Button>
          </motion.div>

          {/* Live Stats counters */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="grid grid-cols-3 gap-3 max-w-xl pt-3"
          >
            {[
              { value: 25000, suffix: "+", label: "Customers" },
              { value: 32000, suffix: "+", label: "Repairs done" },
              { value: 4.9, suffix: "/5", label: "Avg rating", decimal: true },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-xl glass border border-white/5 px-4 py-3 hover:border-electric-500/30 transition-colors"
              >
                <div className="font-display text-xl md:text-2xl font-bold gradient-text">
                  {s.decimal ? (
                    <>{s.value}{s.suffix}</>
                  ) : (
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-widest mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="flex flex-wrap gap-x-6 gap-y-3 pt-2"
          >
            <TrustItem
              text="50-pt QC inspection"
              icon={<ShieldCheck className="h-4 w-4 text-electric-400" />}
            />
            <TrustItem
              text="Free Pan-India delivery"
              icon={<Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
            />
            <TrustItem
              text="12-month warranty"
              icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
            />
          </motion.div>
        </div>

        {/* Right showcase — 3D laptop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-square max-w-[560px] mx-auto">
            {/* Static glow halo behind laptop (cheap, no animation/blur churn) */}
            <div
              aria-hidden
              className="absolute inset-10 rounded-full -z-10 opacity-50"
              style={{
                background:
                  "radial-gradient(closest-side, rgba(0,120,255,0.55), rgba(255,107,0,0.25) 55%, transparent 75%)",
              }}
            />
            <div className="relative h-full w-full">
              <Laptop3D />
            </div>

            {/* Floating spec chips */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-8 left-2 md:left-0 glass-strong rounded-xl px-3 py-2 border border-electric-500/30 text-xs font-bold tracking-wider hidden sm:block"
            >
              <span className="text-electric-300">RTX 4090</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.4, repeat: Infinity, delay: 0.6 }}
              className="absolute top-8 right-2 md:right-0 glass-strong rounded-xl px-3 py-2 border border-neon-500/30 text-xs font-bold tracking-wider hidden sm:block"
            >
              <span className="text-neon-300">240Hz QHD</span>
            </motion.div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1.2 }}
              className="absolute bottom-12 right-0 glass-strong rounded-xl px-3 py-2 border border-emerald-500/30 text-xs font-bold tracking-wider hidden sm:block"
            >
              <span className="text-emerald-300">12-Mo Warranty</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1 text-xs text-muted-foreground"
      >
        <span className="uppercase tracking-widest">Scroll</span>
        <ChevronDown className="h-4 w-4 text-electric-400" />
      </motion.div>
    </section>
  );
}

function TrustItem({
  text,
  icon,
}: {
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10">
        {icon}
      </div>
      <span className="text-xs md:text-sm font-medium text-foreground/85">
        {text}
      </span>
    </div>
  );
}
