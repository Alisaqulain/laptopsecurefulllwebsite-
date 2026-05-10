"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { SectionHeading } from "@/components/shared/SectionHeading";

const items = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat instantly",
    href: buildWhatsAppLink(waMessages.generic()),
    external: true,
    color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30",
  },
  {
    icon: Phone,
    label: "Call us",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone}`,
    color: "text-electric-300 bg-electric-500/15 border-electric-500/30",
  },
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    color: "text-neon-300 bg-neon-500/15 border-neon-500/30",
  },
  {
    icon: MapPin,
    label: "Visit our store",
    value: siteConfig.contact.address.split(",").slice(0, 2).join(",") + " ...",
    href: "/contact",
    color: "text-violet-300 bg-violet-500/15 border-violet-500/30",
  },
];

export function ContactStrip() {
  return (
    <section className="container py-20 md:py-28">
      <SectionHeading
        eyebrow="Get in touch"
        title={
          <>
            We're here to{" "}
            <span className="gradient-text">help — 7 days a week</span>
          </>
        }
        subtitle="Pick the channel you prefer. Our team responds in under 5 minutes during business hours."
      />

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <motion.a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-2xl glass border border-white/5 hover:border-white/15 p-6 transition-all duration-500"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${item.color}`}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300" />
            </div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {item.label}
            </div>
            <div className="mt-1 font-display text-base font-bold leading-tight">
              {item.value}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
