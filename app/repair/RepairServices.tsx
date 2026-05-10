"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { repairServices } from "@/lib/data/repair";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

export function RepairServices() {
  return (
    <section id="services" className="container py-16 md:py-24">
      <SectionHeading
        eyebrow="Our Services"
        title={
          <>
            Every laptop problem,{" "}
            <span className="gradient-text">solved.</span>
          </>
        }
        subtitle="From cracked screens to motherboard chip-level repair — our certified team handles it all with original parts."
      />

      <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {repairServices.map((service, i) => {
          const Icon = (Icons as any)[service.icon] || Icons.Wrench;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl glass border border-white/5 hover:border-electric-500/30 p-7 transition-all duration-500 flex flex-col"
            >
              <div
                aria-hidden
                className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-electric-500/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-electric-500/20 to-neon-500/10 border border-electric-500/30 mb-5 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-500">
                <Icon className="h-7 w-7 text-electric-300" />
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight mb-2">
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {service.description}
              </p>

              <ul className="space-y-2 mb-5">
                {service.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-xs text-foreground/85"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-electric-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4 border-t border-white/5 grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-electric-400" />
                  <span className="text-muted-foreground">{service.duration}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-muted-foreground">90-day warranty</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Starts at</div>
                  <div className="font-display text-lg font-bold gradient-text">
                    {formatPrice(service.startingPrice)}
                  </div>
                </div>
                <Button asChild size="sm" variant="whatsapp">
                  <a
                    href={buildWhatsAppLink(
                      waMessages.repairRequest(service.name),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
