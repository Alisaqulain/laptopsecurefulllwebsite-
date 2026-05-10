"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/data/faq";

export function FAQSection() {
  const homeFaqs = faqs.slice(0, 8);
  return (
    <section className="container py-20 md:py-28">
      <SectionHeading
        eyebrow="Common Questions"
        title={
          <>
            Frequently asked{" "}
            <span className="gradient-text">questions</span>
          </>
        }
        subtitle="Quick answers about buying, selling, repairing, and warranty."
      />

      <div className="mt-12 max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {homeFaqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} className="border-0">
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="mt-10 flex justify-center">
        <Button asChild variant="outline" size="lg">
          <Link href="/faq">
            View all FAQs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
