"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

export function CTABanner() {
  return (
    <section className="container py-12">
      <div className="relative overflow-hidden rounded-3xl glass-strong border border-electric-500/30 p-10 md:p-16">
        {/* Animated bg */}
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(120deg, rgba(0,120,255,0.2), rgba(255,107,0,0.2))",
            backgroundSize: "200% 200%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 -z-10 bg-grid opacity-20" />

        <div className="grid md:grid-cols-2 gap-10 items-center relative">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-electric-300 mb-5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Limited-Time Offer
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight"
            >
              Upgrade now,{" "}
              <span className="gradient-text-orange">pay later.</span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-base md:text-lg text-muted-foreground"
            >
              No-cost EMI on all laptops above ₹30,000. Free doorstep delivery
              and trade-in welcome. Get the device of your dreams today.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-3 md:justify-end"
          >
            <Button asChild size="xl">
              <Link href="/shop">
                Browse Catalog
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="whatsapp">
              <a
                href={buildWhatsAppLink(waMessages.generic())}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
