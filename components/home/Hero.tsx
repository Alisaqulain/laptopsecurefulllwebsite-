"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/shared/ParticleBackground";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden pt-24 md:pt-28">
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid" />
        <ParticleBackground density={60} />
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
            <span className="flex h-2 w-2 rounded-full bg-electric-400 shadow-[0_0_10px_#0078ff]">
              <span className="absolute h-2 w-2 rounded-full bg-electric-400 animate-ping" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-neon-400" />
            India's Most Trusted Premium Laptop Marketplace
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
            Premium new, refurbished & second-hand laptops, gaming PCs,
            accessories, and certified repair services. Trade in your old
            device today and upgrade with confidence — backed by a 12-month
            LaptopSecure warranty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Button asChild size="xl">
              <Link href="/shop">
                Shop Laptops
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="accent" size="xl">
              <Link href="/sell">
                <Zap className="h-5 w-5" />
                Sell Yours
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl">
              <a
                href={buildWhatsAppLink(waMessages.generic())}
                target="_blank"
                rel="noopener noreferrer"
              >
                Talk to Expert
              </a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-x-8 gap-y-3 pt-4"
          >
            <TrustItem
              value="25,000+"
              label="Happy customers"
              icon={<ShieldCheck className="h-4 w-4 text-electric-400" />}
            />
            <TrustItem
              value="4.9/5"
              label="Avg rating"
              icon={<Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
            />
            <TrustItem
              value="12-Month"
              label="LaptopSecure warranty"
              icon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
            />
          </motion.div>
        </div>

        {/* Right showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-5 relative"
        >
          <HeroShowcase />
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
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10">
        {icon}
      </div>
      <div>
        <div className="font-bold text-sm text-foreground">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function HeroShowcase() {
  return (
    <div className="relative aspect-[5/6] max-w-md mx-auto perspective-1000">
      {/* Glowing ring */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[2rem] -z-10"
        style={{
          background:
            "conic-gradient(from 0deg, #0078ff, #ff6b00, #0078ff, #3aa4ff, #ff851a, #0078ff)",
          filter: "blur(40px)",
          opacity: 0.4,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Main laptop card */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full rounded-[2rem] overflow-hidden glass-strong border border-electric-500/20 shadow-premium"
      >
        <Image
          src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=85"
          alt="Premium gaming laptop"
          fill
          priority
          sizes="(max-width: 1024px) 80vw, 40vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-70" />

        {/* Floating spec chips */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          className="absolute top-5 left-5 glass-strong rounded-xl px-3 py-2 border border-electric-500/30 text-xs font-bold tracking-wider"
        >
          <span className="text-electric-300">RTX 4070</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute top-5 right-5 glass-strong rounded-xl px-3 py-2 border border-neon-500/30 text-xs font-bold tracking-wider"
        >
          <span className="text-neon-300">240Hz</span>
        </motion.div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
          className="absolute bottom-24 right-5 glass-strong rounded-xl px-3 py-2 border border-emerald-500/30 text-xs font-bold tracking-wider"
        >
          <span className="text-emerald-300">12-Month Warranty</span>
        </motion.div>

        {/* Bottom info pill */}
        <div className="absolute bottom-5 left-5 right-5 glass-strong rounded-xl p-4 border border-white/10">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Featured today
          </div>
          <div className="font-display font-bold text-base mt-1">
            ASUS ROG Strix G16
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-electric-400 font-bold">₹1,34,999</span>
            <span className="text-xs text-muted-foreground line-through">
              ₹1,69,999
            </span>
            <span className="ml-auto text-[10px] font-bold text-emerald-400">
              SAVE 20%
            </span>
          </div>
        </div>
      </motion.div>

      {/* Floating chip cards */}
      <motion.div
        animate={{
          y: [0, 12, 0],
          rotate: [-3, 3, -3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -bottom-6 -left-6 hidden md:block glass-strong rounded-2xl p-4 border border-electric-500/30 shadow-glow-soft"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              50-Point QC
            </div>
            <div className="text-sm font-bold">Tested & Certified</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
