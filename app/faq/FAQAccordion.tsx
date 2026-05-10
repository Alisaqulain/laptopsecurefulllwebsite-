"use client";

import { useState, useMemo } from "react";
import { Search, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { faqs, faqCategories } from "@/lib/data/faq";
import { cn } from "@/lib/utils";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

export function FAQAccordion() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      if (category && f.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, category]);

  return (
    <section className="container pb-24 max-w-4xl">
      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search FAQs..."
          className="pl-11 h-12 text-base"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory(null)}
          className={cn(
            "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
            !category
              ? "border-electric-500/60 bg-electric-500/15 text-electric-300 shadow-glow-soft"
              : "border-white/10 bg-white/5 hover:border-electric-500/30",
          )}
        >
          All
        </button>
        {faqCategories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
              category === c
                ? "border-electric-500/60 bg-electric-500/15 text-electric-300 shadow-glow-soft"
                : "border-white/10 bg-white/5 hover:border-electric-500/30",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {filtered.map((f) => (
          <AccordionItem key={f.id} value={f.id} className="border-0">
            <AccordionTrigger>
              <span className="flex items-start gap-3 text-left">
                <span className="text-xs font-bold uppercase tracking-widest text-electric-400 mt-0.5 shrink-0">
                  {f.category}
                </span>
                <span>{f.question}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No questions match your search.
        </div>
      )}

      {/* Still need help */}
      <div className="mt-14 rounded-3xl glass-strong border border-electric-500/20 p-8 md:p-12 text-center">
        <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
          Still have <span className="gradient-text">questions?</span>
        </h3>
        <p className="mt-3 text-muted-foreground">
          We're online 7 days a week and reply within 5 minutes on WhatsApp.
        </p>
        <Button asChild size="lg" variant="whatsapp" className="mt-6">
          <a
            href={buildWhatsAppLink(waMessages.generic())}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-5 w-5" />
            Message us on WhatsApp
          </a>
        </Button>
      </div>
    </section>
  );
}
