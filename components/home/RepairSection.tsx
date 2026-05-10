"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowRight, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { repairServices } from "@/lib/data/repair";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

export function RepairSection() {
  return (
    <section className="container py-20 md:py-28 relative">
      <SectionHeading
        eyebrow="Expert Repair"
        title={
          <>
            Laptop broken?{" "}
            <span className="gradient-text">We fix everything.</span>
          </>
        }
        subtitle="Apple, Lenovo & MSI certified engineers. Component-level repair, free pickup, and 90-day warranty on every fix."
      />

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {repairServices.slice(0, 8).map((service, i) => {
          const Icon = (Icons as any)[service.icon] || Wrench;
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl glass border border-white/5 hover:border-electric-500/30 p-6 transition-all duration-500"
            >
              <div
                aria-hidden
                className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-electric-500/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-electric-500/15 border border-electric-500/30 mb-4 group-hover:rotate-6 transition-transform">
                  <Icon className="h-6 w-6 text-electric-300" />
                </div>
                <h3 className="font-display text-base md:text-lg font-bold tracking-tight mb-1.5">
                  {service.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                  {service.shortDesc}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-electric-300 font-semibold">
                    From {formatPrice(service.startingPrice)}
                  </span>
                  <a
                    href={buildWhatsAppLink(
                      waMessages.repairRequest(service.name),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground hover:text-electric-300 inline-flex items-center gap-1 transition-colors"
                  >
                    Book now
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center gap-3 flex-wrap">
        <Button asChild size="lg" variant="default">
          <Link href="/repair">
            Explore All Services
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="whatsapp">
          <a
            href={buildWhatsAppLink(
              waMessages.repairRequest("General laptop repair inquiry"),
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Talk to a Technician
          </a>
        </Button>
      </div>
    </section>
  );
}
