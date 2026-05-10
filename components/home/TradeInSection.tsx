"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  RefreshCcw,
  IndianRupee,
  PackageCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

const steps = [
  {
    icon: RefreshCcw,
    title: "Share laptop details",
    desc: "Brand, RAM, condition — takes 60 seconds.",
  },
  {
    icon: IndianRupee,
    title: "Get instant best-in-class quote",
    desc: "Beat-the-quote guarantee, transparent pricing.",
  },
  {
    icon: PackageCheck,
    title: "Free pickup & instant payment",
    desc: "Money in your bank in under 30 minutes.",
  },
];

export function TradeInSection() {
  return (
    <section className="container py-20 md:py-28 relative">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Image / visual */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-square max-w-md mx-auto lg:max-w-none lg:aspect-[4/3]"
        >
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-neon-500/20 via-electric-500/10 to-transparent blur-2xl"
          />
          <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=1200&q=85"
              alt="Trade-in your old laptop"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute bottom-6 left-6 right-6 glass-strong rounded-2xl p-5 border border-neon-500/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neon-500/20 border border-neon-500/30">
                  <Sparkles className="h-5 w-5 text-neon-300" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Avg payout
                  </div>
                  <div className="font-display text-lg font-bold">
                    Up to{" "}
                    <span className="gradient-text-orange">₹85,000</span>{" "}
                    per device
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-neon-500/30 bg-neon-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-neon-300 mb-5"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            Trade-In Program
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight"
          >
            Got an old laptop?{" "}
            <span className="gradient-text-orange">
              Turn it into instant cash
            </span>{" "}
            today.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            Our trade-in program offers India's most competitive prices for
            used laptops. Free pickup, on-the-spot inspection, and money in
            your bank in under 30 minutes.
          </motion.p>

          <ul className="mt-8 space-y-4">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-500/15 border border-neon-500/30 shrink-0">
                  <step.icon className="h-5 w-5 text-neon-300" />
                </div>
                <div>
                  <div className="font-display font-bold">{step.title}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {step.desc}
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/sell">
                Get Instant Quote
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href={buildWhatsAppLink(
                  waMessages.getQuote("Trade-in for my old laptop"),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
