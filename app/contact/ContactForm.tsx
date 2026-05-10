"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const subjects = [
  "Buy a laptop",
  "Sell my laptop",
  "Repair service",
  "Custom PC build",
  "General inquiry",
];

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General inquiry",
    message: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hello LaptopSecure! 👋

Name: ${form.name}
Email: ${form.email}
Phone: ${form.phone}
Subject: *${form.subject}*

Message:
${form.message}`;
    const link = buildWhatsAppLink(msg);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl glass-strong border border-electric-500/20 p-6 md:p-8 space-y-5"
    >
      <div>
        <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
          Send us a <span className="gradient-text">message</span>
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          We'll continue the conversation on WhatsApp instantly.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold mb-2 block">Full name</label>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="text-sm font-semibold mb-2 block">Phone</label>
          <Input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+91 ..."
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">Email</label>
        <Input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">
          What can we help you with?
        </label>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => setForm({ ...form, subject: s })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                form.subject === s
                  ? "border-electric-500/60 bg-electric-500/15 text-electric-300 shadow-glow-soft"
                  : "border-white/10 bg-white/5 hover:border-electric-500/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold mb-2 block">Message</label>
        <Textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="Tell us how we can help..."
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" size="lg" className="flex-1">
          <Send className="h-5 w-5" />
          Send via WhatsApp
        </Button>
        <Button
          type="button"
          asChild
          size="lg"
          variant="whatsapp"
          className="flex-1"
        >
          <a
            href={buildWhatsAppLink("Hello LaptopSecure!")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-5 w-5" />
            Quick Chat
          </a>
        </Button>
      </div>
    </motion.form>
  );
}
