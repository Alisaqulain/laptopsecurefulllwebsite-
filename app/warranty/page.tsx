import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { ShieldCheck, RefreshCcw, FlaskConical, Truck, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Warranty & Replacement Policy",
  description:
    "Every LaptopSecure laptop comes with a 12-month warranty plus 50-point QC inspection. Read our full warranty, shipping, and replacement policy.",
};

const pillars = [
  {
    icon: ShieldCheck,
    title: "12-Month Warranty",
    desc: "On every laptop — new or refurbished — covering motherboard, hardware, charging, and display issues.",
  },
  {
    icon: FlaskConical,
    title: "50-Point QC Inspection",
    desc: "Every device tested against 50+ checkpoints by our certified engineers before delivery.",
  },
  {
    icon: RefreshCcw,
    title: "7-Day Replacement",
    desc: "Not happy with your purchase? Free replacement within 7 days, no questions asked.",
  },
  {
    icon: Truck,
    title: "Free Pan-India Service",
    desc: "Free pickup, repair, and drop-off in major cities. Insured for the full sale price.",
  },
];

const policies = [
  {
    id: "p1",
    title: "What's covered under the 12-month warranty?",
    body: "Our warranty covers motherboard, hardware functionality, charging system, display panel, keyboard, ports, and built-in components. Defects discovered within the warranty window will be repaired free, or the device replaced.",
  },
  {
    id: "p2",
    title: "What's NOT covered?",
    body: "Physical damage (drops, dents, cracks), liquid damage, software issues caused by the user, and unauthorized repairs by third parties. Tampering with the LaptopSecure tamper-evident seal also voids the warranty.",
  },
  {
    id: "p3",
    title: "How do I claim warranty service?",
    body: "Simply send us a message on WhatsApp with your order ID. We'll arrange free pickup, diagnosis, and repair. If the issue is covered, repairs are free. If not, we'll send a transparent quote before any work is done.",
  },
  {
    id: "p4",
    title: "How does the 7-day replacement work?",
    body: "If your laptop has any factory defect or fails to perform as advertised within 7 days of delivery, we will replace it for free or refund 100% of the price — your choice. The device must be in original condition with all accessories and packaging.",
  },
  {
    id: "p5",
    title: "Shipping policy",
    body: "Free shipping on all orders above ₹15,000. Devices ship via Bluedart, DTDC, and Shadowfax with full insurance. Standard delivery: 2-4 business days. Express delivery available in metros for an additional fee.",
  },
  {
    id: "p6",
    title: "Returns & refunds",
    body: "Refunds are processed within 5-7 business days to the original payment method. Cash-on-delivery refunds are issued via UPI/bank transfer. The device must be returned in original condition with all accessories.",
  },
  {
    id: "p7",
    title: "How do you test refurbished laptops?",
    body: "Our 50-point inspection covers: motherboard, RAM, storage health, battery cycle count, screen for dead pixels and uniformity, keyboard for all keys, trackpad, ports (USB, HDMI, audio, etc.), camera, microphone, speakers, fans and cooling, hinges, and full thermal stress testing.",
  },
  {
    id: "p8",
    title: "Extended warranty options",
    body: "We offer extended warranty plans for 6, 12, or 24 additional months. Pricing varies by product and condition. Just message us on WhatsApp for a quote on your device.",
  },
];

export default function WarrantyPage() {
  return (
    <>
      <PageHero
        eyebrow="Warranty & Returns"
        title={
          <>
            Buy with{" "}
            <span className="gradient-text">total confidence.</span>
          </>
        }
        subtitle="A 12-month LaptopSecure warranty is included on every device. Free service, free pickup, and a 7-day replacement guarantee."
        breadcrumbs={[{ name: "Warranty" }]}
      />

      {/* Pillars */}
      <section className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl glass border border-white/5 hover:border-electric-500/30 transition-colors p-6"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-electric-500/15 border border-electric-500/30 mb-4">
                <p.icon className="h-6 w-6 text-electric-300" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed policies */}
      <section className="container py-12 max-w-4xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 tracking-tight">
          Policy <span className="gradient-text">details</span>
        </h2>
        <p className="text-muted-foreground mb-10">
          Crystal-clear answers to the most common warranty, shipping, and return questions.
        </p>
        <Accordion type="single" collapsible className="space-y-3">
          {policies.map((p) => (
            <AccordionItem key={p.id} value={p.id} className="border-0">
              <AccordionTrigger>{p.title}</AccordionTrigger>
              <AccordionContent>{p.body}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA */}
      <section className="container py-12 pb-24">
        <div className="rounded-3xl glass-strong border border-electric-500/20 p-10 md:p-14 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Need a warranty claim?{" "}
            <span className="gradient-text">We're on it.</span>
          </h3>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Send us your order ID on WhatsApp and we'll arrange free pickup right away.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" variant="whatsapp">
              <a
                href={buildWhatsAppLink(
                  waMessages.repairRequest("Warranty claim — order ID: "),
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                File warranty claim
                <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/faq">View FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
