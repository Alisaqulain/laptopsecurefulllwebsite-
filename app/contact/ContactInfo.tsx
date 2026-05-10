"use client";

import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import { siteConfig } from "@/lib/config";
import { officeHours } from "@/lib/data/misc";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

export function ContactInfo() {
  const blocks = [
    {
      icon: MessageCircle,
      label: "WhatsApp Chat",
      value: "Tap to start chatting",
      href: buildWhatsAppLink(waMessages.generic()),
      color: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
      external: true,
    },
    {
      icon: Phone,
      label: "Call us directly",
      value: siteConfig.contact.phone,
      href: `tel:${siteConfig.contact.phone}`,
      color: "border-electric-500/30 bg-electric-500/15 text-electric-300",
    },
    {
      icon: Mail,
      label: "Email us",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
      color: "border-neon-500/30 bg-neon-500/15 text-neon-300",
    },
  ];

  const socials = [
    { icon: Instagram, href: siteConfig.social.instagram },
    { icon: Facebook, href: siteConfig.social.facebook },
    { icon: Twitter, href: siteConfig.social.twitter },
    { icon: Youtube, href: siteConfig.social.youtube },
    { icon: Linkedin, href: siteConfig.social.linkedin },
  ];

  return (
    <div className="space-y-5">
      {blocks.map((b, i) => (
        <motion.a
          key={b.label}
          href={b.href}
          target={b.external ? "_blank" : undefined}
          rel={b.external ? "noopener noreferrer" : undefined}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="flex items-center gap-4 rounded-2xl glass border border-white/5 hover:border-electric-500/30 p-5 transition-all duration-300 group hover:-translate-y-0.5"
        >
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${b.color}`}
          >
            <b.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">
              {b.label}
            </div>
            <div className="font-display font-bold mt-0.5 truncate">
              {b.value}
            </div>
          </div>
        </motion.a>
      ))}

      {/* Address */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl glass border border-white/5 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 border border-violet-500/30">
            <MapPin className="h-5 w-5 text-violet-300" />
          </div>
          <h3 className="font-display font-bold text-lg">Visit our store</h3>
        </div>
        <p className="text-sm text-foreground/90 leading-relaxed mb-4">
          {siteConfig.contact.address}
        </p>
        <div className="rounded-xl overflow-hidden border border-white/5 aspect-video">
          <iframe
            title="LaptopSecure store location"
            className="w-full h-full grayscale invert hue-rotate-180 contrast-110"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.241147479886!2d77.0856!3d28.4595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDI3JzM0LjIiTiA3N8KwMDUnMDguMiJF!5e0!3m2!1sen!2sin!4v1609459200000"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </motion.div>

      {/* Hours */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="rounded-2xl glass border border-white/5 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/30">
            <Clock className="h-5 w-5 text-amber-300" />
          </div>
          <h3 className="font-display font-bold text-lg">Business hours</h3>
        </div>
        <ul className="divide-y divide-white/5">
          {officeHours.map((h) => (
            <li
              key={h.day}
              className="flex justify-between py-2.5 text-sm"
            >
              <span className="text-muted-foreground">{h.day}</span>
              <span className="font-medium text-foreground">{h.time}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Social */}
      <div className="flex gap-2 justify-center">
        {socials.map((s, i) => (
          <a
            key={i}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground/80 transition-all hover:border-electric-500/40 hover:bg-electric-500/10 hover:text-electric-300 hover:scale-110"
          >
            <s.icon className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  );
}
