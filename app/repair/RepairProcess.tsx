"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { repairProcess } from "@/lib/data/repair";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { ArrowRight } from "lucide-react";

export function RepairProcess() {
  return (
    <section className="container py-16 md:py-24">
      <SectionHeading
        eyebrow="How It Works"
        title={
          <>
            From dropoff to delivery —{" "}
            <span className="gradient-text">5 simple steps</span>
          </>
        }
        subtitle="Transparent, tracked, and trustworthy at every stage."
      />

      <div className="mt-14 relative">
        {/* Vertical connecting line */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-electric-500/30 to-transparent hidden md:block" />

        <div className="space-y-8 md:space-y-16">
          {repairProcess.map((step, i) => {
            const Icon = (Icons as any)[step.icon] || Icons.Wrench;
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`md:grid md:grid-cols-[1fr,auto,1fr] md:gap-8 items-center`}
              >
                {/* Card on left or right */}
                <div
                  className={`${
                    isEven ? "md:text-right md:order-1" : "md:order-3"
                  }`}
                >
                  <div className="rounded-2xl glass border border-white/5 hover:border-electric-500/30 transition-colors p-7 group">
                    <div className="flex items-center gap-3 mb-3 md:flex-row-reverse md:[&>*:last-child]:ml-auto">
                      {!isEven && (
                        <div className="md:hidden flex h-12 w-12 items-center justify-center rounded-xl bg-electric-500/15 border border-electric-500/30">
                          <Icon className="h-6 w-6 text-electric-300" />
                        </div>
                      )}
                      <span className="font-display text-3xl md:text-4xl font-bold gradient-text">
                        {step.step}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center icon - md+ */}
                <div className="hidden md:flex md:order-2 items-center justify-center">
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-electric-500 to-electric-700 shadow-glow-blue">
                    <Icon className="h-7 w-7 text-white" strokeWidth={2.2} />
                    <span className="absolute inset-0 -z-10 rounded-2xl bg-electric-500 blur-2xl opacity-50" />
                  </div>
                </div>

                {/* Empty spacer */}
                <div
                  className={`hidden md:block ${
                    isEven ? "md:order-3" : "md:order-1"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <Button asChild size="lg" variant="whatsapp">
          <a
            href={buildWhatsAppLink(
              waMessages.repairRequest("Schedule a free pickup for repair"),
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            Schedule Free Pickup
            <ArrowRight className="h-5 w-5" />
          </a>
        </Button>
      </div>
    </section>
  );
}
