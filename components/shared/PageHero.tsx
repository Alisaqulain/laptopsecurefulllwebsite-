"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { GlowOrb } from "./GlowOrb";

interface PageHeroProps {
  eyebrow?: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: string;
  breadcrumbs?: { name: string; href?: string }[];
  children?: React.ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumbs = [],
  children,
}: PageHeroProps) {
  return (
    <section className="relative pt-32 md:pt-36 pb-12 md:pb-16 overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <GlowOrb className="left-1/4 top-1/2" color="blue" size="lg" />
        <GlowOrb className="right-1/4 top-1/4" color="orange" size="md" />
      </div>

      <div className="container">
        {breadcrumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground mb-6"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-electric-300 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                {b.href ? (
                  <Link
                    href={b.href}
                    className="hover:text-electric-300 transition-colors"
                  >
                    {b.name}
                  </Link>
                ) : (
                  <span className="text-foreground/90">{b.name}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}

        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-electric-300 mb-5"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-electric-400 shadow-[0_0_10px_#0078ff] animate-pulse" />
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-6xl font-bold tracking-tight text-balance leading-[1.05]"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-base md:text-lg text-muted-foreground max-w-3xl text-balance leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
