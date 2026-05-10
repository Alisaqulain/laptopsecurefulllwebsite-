"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { whyChooseUs } from "@/lib/data/misc";

export function WhyChooseUs() {
  return (
    <section className="container py-20 md:py-28">
      <SectionHeading
        eyebrow="Why LaptopSecure"
        title={
          <>
            6 reasons we're <span className="gradient-text">trusted by 25k+</span>
          </>
        }
        subtitle="Honest pricing, real warranties, expert engineers, and customer-first service across India."
      />

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {whyChooseUs.map((item, i) => {
          const Icon = (Icons as any)[item.icon] || Icons.Sparkles;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl glass border border-white/5 hover:border-electric-500/30 p-7 transition-all duration-500 hover:shadow-glow-soft"
            >
              {/* Hover glow */}
              <div
                aria-hidden
                className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-electric-500/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="relative">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-electric-500/15 to-neon-500/10 border border-electric-500/30 mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                  <Icon className="h-7 w-7 text-electric-300" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2.5 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
