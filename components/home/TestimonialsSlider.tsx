"use client";

import Image from "next/image";
import { Star, Quote, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { testimonials } from "@/lib/data/testimonials";

export function TestimonialsSlider() {
  return (
    <section className="container py-20 md:py-28 relative overflow-hidden">
      <SectionHeading
        eyebrow="Customer Stories"
        title={
          <>
            Loved by{" "}
            <span className="gradient-text">25,000+ tech enthusiasts</span>
          </>
        }
        subtitle="Real reviews from real customers across India."
      />

      <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.slice(0, 6).map((t, i) => (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-2xl glass border border-white/5 hover:border-electric-500/30 p-7 transition-all duration-500 hover:shadow-glow-soft"
          >
            <Quote className="absolute top-5 right-5 h-8 w-8 text-electric-500/20 group-hover:text-electric-500/40 transition-colors" />

            <div className="flex gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-4 w-4 ${
                    idx < Math.round(t.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>

            <p className="text-foreground/90 leading-relaxed text-sm md:text-base">
              "{t.comment}"
            </p>

            <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-3">
              <div className="relative h-11 w-11 rounded-full overflow-hidden border-2 border-electric-500/30">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm truncate">{t.name}</span>
                  {t.verified && (
                    <BadgeCheck className="h-4 w-4 text-electric-400 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {t.role} · {t.city}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
