import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  RefreshCcw,
  Truck,
  IndianRupee,
  Calculator,
  CheckCircle2,
  ShieldCheck,
  Clock,
  PackageCheck,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Trade-In Program — Upgrade Your Laptop, Pay Less",
  description:
    "Trade in your old laptop for instant credit toward your next device. Free pickup, fair valuation, and money or store credit on the spot.",
};

const steps = [
  {
    icon: Calculator,
    title: "Get an instant quote",
    desc: "Share your laptop details on WhatsApp — receive a fair quote in under 2 minutes.",
  },
  {
    icon: Truck,
    title: "Free doorstep pickup",
    desc: "Our partner picks up your device from anywhere in India. Insured. Tracked.",
  },
  {
    icon: PackageCheck,
    title: "Inspection & valuation",
    desc: "We verify in front of you (live video allowed). Final offer within 30 minutes.",
  },
  {
    icon: IndianRupee,
    title: "Pay or trade",
    desc: "Money in your account, OR get instant store credit (10% bonus) toward a new device.",
  },
];

const tiers = [
  {
    range: "Up to 6 months old",
    discount: "70-85% of MRP",
    color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30",
  },
  {
    range: "6-18 months old",
    discount: "55-70% of MRP",
    color: "from-electric-500/20 to-electric-500/5 border-electric-500/30",
  },
  {
    range: "18-36 months old",
    discount: "35-55% of MRP",
    color: "from-amber-500/20 to-amber-500/5 border-amber-500/30",
  },
  {
    range: "3+ years old",
    discount: "Custom quote",
    color: "from-rose-500/20 to-rose-500/5 border-rose-500/30",
  },
];

const benefits = [
  "Beat-the-quote: bring any written competitor offer, we'll beat it by 5%.",
  "Free pickup from anywhere in India.",
  "Money in your bank within 30 minutes after inspection.",
  "10% bonus on store credit if you trade up.",
  "Original bill not required for most models.",
  "We accept laptops with cracked screens, broken keyboards, or even dead batteries.",
];

export default function TradeInPage() {
  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <RefreshCcw className="h-3.5 w-3.5 text-neon-300" />
            Trade-In Program
          </span>
        }
        title={
          <>
            Trade in your old laptop.{" "}
            <span className="gradient-text-orange">Upgrade today.</span>
          </>
        }
        subtitle="Got an old laptop sitting in your drawer? Turn it into instant cash or get bonus store credit toward your next dream device."
        breadcrumbs={[{ name: "Trade-In Program" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="accent">
            <Link href="/sell">
              Get instant quote
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a
              href={buildWhatsAppLink(
                waMessages.getQuote("Trade-in for my old laptop"),
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Quote
            </a>
          </Button>
        </div>
      </PageHero>

      {/* Steps */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From quote to{" "}
              <span className="gradient-text">cash in 30 minutes.</span>
            </>
          }
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl glass border border-white/5 hover:border-neon-500/30 p-7 transition-all"
            >
              <div className="absolute top-5 right-5 font-display text-3xl font-black text-neon-500/30">
                0{i + 1}
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neon-500/15 border border-neon-500/30 mb-4">
                <s.icon className="h-6 w-6 text-neon-300" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="container py-12">
        <SectionHeading
          eyebrow="Valuation Bands"
          title={
            <>
              Transparent pricing.{" "}
              <span className="gradient-text">No tricks.</span>
            </>
          }
          subtitle="Indicative ranges based on age & condition. Actual quote may be higher for premium brands and pristine devices."
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t) => (
            <div
              key={t.range}
              className={`rounded-2xl bg-gradient-to-br ${t.color} border p-7 text-center backdrop-blur-md`}
            >
              <div className="text-xs uppercase tracking-widest text-foreground/70 mb-2">
                {t.range}
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold gradient-text">
                {t.discount}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Final quote on inspection
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="container py-12">
        <div className="rounded-3xl glass-strong border border-electric-500/20 p-8 md:p-12">
          <div className="grid md:grid-cols-[1fr,2fr] gap-7 items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-electric-300 mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                Why trade with us
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
                Best prices in India,{" "}
                <span className="gradient-text">guaranteed.</span>
              </h3>
            </div>
            <ul className="space-y-3 md:pt-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base text-foreground/85">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="rounded-3xl glass border border-neon-500/30 p-10 md:p-14 text-center">
          <Clock className="h-10 w-10 text-neon-400 mx-auto mb-4" />
          <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight">
            Why wait?{" "}
            <span className="gradient-text-orange">
              Your laptop is losing value every day.
            </span>
          </h3>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Quote in 2 min. Pickup tomorrow. Money same day.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Button asChild size="lg" variant="accent">
              <Link href="/sell">
                Start trade-in
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
