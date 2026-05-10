"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  CreditCard,
  RefreshCcw,
  Code2,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { footerLinks, siteConfig } from "@/lib/config";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { useState } from "react";

const socials = [
  { icon: Instagram, href: siteConfig.social.instagram, label: "Instagram" },
  { icon: Facebook, href: siteConfig.social.facebook, label: "Facebook" },
  { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
  { icon: Youtube, href: siteConfig.social.youtube, label: "YouTube" },
  { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Secure & Verified" },
  { icon: Truck, label: "Pan-India Delivery" },
  { icon: CreditCard, label: "Easy EMI Options" },
  { icon: RefreshCcw, label: "Trade-in Welcome" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const link = buildWhatsAppLink(waMessages.newsletter(email));
    window.open(link, "_blank", "noopener,noreferrer");
    setEmail("");
  };

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-gradient-to-b from-background to-[#070b14] overflow-hidden">
      {/* Animated glow */}
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <motion.div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,120,255,0.18), transparent 80%)",
        }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Trust badges */}
      <div className="container border-b border-white/5 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {trustBadges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex items-center gap-3 rounded-xl glass border border-white/5 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-500/15 border border-electric-500/30">
                <badge.icon className="h-5 w-5 text-electric-400" />
              </div>
              <div className="text-sm font-medium text-foreground">
                {badge.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="container py-14 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-2 space-y-6">
          <Logo size={56} />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            India's premium marketplace for new, refurbished & second-hand laptops,
            gaming PCs, accessories, and expert repair services.
          </p>

          <div className="space-y-2.5 text-sm">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-electric-400 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {siteConfig.contact.email}
            </a>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-electric-400 transition-colors"
            >
              <Phone className="h-4 w-4" />
              {siteConfig.contact.phone}
            </a>
            <p className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{siteConfig.contact.address}</span>
            </p>
          </div>

          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-foreground/80 transition-all hover:border-electric-500/40 hover:bg-electric-500/10 hover:text-electric-300 hover:scale-110 hover:shadow-glow-soft"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <FooterColumn title="Shop" links={footerLinks.shop} />
        <FooterColumn title="Services" links={footerLinks.services} />
        <FooterColumn title="Company" links={footerLinks.company} />
        <FooterColumn title="Support" links={footerLinks.support} />
      </div>

      {/* Newsletter */}
      <div className="container pb-14">
        <div className="rounded-2xl glass border border-electric-500/20 p-6 md:p-10 relative overflow-hidden">
          <motion.div
            aria-hidden
            className="absolute -right-20 -top-20 h-64 w-64 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,107,0,0.3), transparent 80%)",
              filter: "blur(40px)",
            }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight">
                Get the best laptop deals,{" "}
                <span className="gradient-text">straight to your inbox.</span>
              </h3>
              <p className="text-muted-foreground mt-3 text-sm md:text-base">
                Exclusive offers, new arrivals, and tech tips. No spam, ever.
              </p>
            </div>
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
              />
              <Button type="submit" size="lg" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            Crafted with passion for tech.
          </p>
          <div className="flex gap-5">
            <Link
              href="/warranty"
              className="hover:text-electric-400 transition-colors"
            >
              Warranty
            </Link>
            <Link
              href="/faq"
              className="hover:text-electric-400 transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="hover:text-electric-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Designed & developed credit */}
      <div className="relative border-t border-white/5 bg-[#04060c]/60">
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,120,255,0.6), rgba(255,107,0,0.6), transparent)",
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs">
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Code2 className="h-3.5 w-3.5 text-electric-400" />
            Designed &amp; developed with
            <Heart
              className="h-3.5 w-3.5 text-neon-500 animate-pulse"
              fill="currentColor"
            />
            by
          </span>
          <a
            href="https://devspheresolutions.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-1 font-semibold tracking-wide"
          >
            <span className="bg-gradient-to-r from-electric-300 via-electric-400 to-neon-400 bg-clip-text text-transparent transition-all group-hover:from-neon-400 group-hover:via-electric-400 group-hover:to-electric-300">
              DevsSphere Solutions
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 text-electric-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-electric-400 to-neon-400 transition-all duration-300 group-hover:w-full"
            />
          </a>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="inline-flex items-center gap-1.5 text-muted-foreground">
            Developer
            <span className="font-semibold text-foreground/90">
              Syed Ali Zaidi
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-display text-sm font-bold uppercase tracking-widest text-electric-300">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.name}
              <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-electric-400" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
