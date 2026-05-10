import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, FlaskConical, RefreshCcw, Leaf, Sparkles } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Refurbished Laptops — Like-New, Half the Price, Full Warranty",
  description:
    "Certified refurbished laptops with 50-point inspection, new batteries, and 12-month LaptopSecure warranty. MacBooks, ThinkPads, XPS, and more.",
};

const steps = [
  {
    n: "01",
    icon: FlaskConical,
    title: "50-Point Inspection",
    desc: "Motherboard, GPU, RAM, SSD health, screen uniformity, hinge integrity, port functionality — every checkpoint logged.",
  },
  {
    n: "02",
    icon: RefreshCcw,
    title: "Refresh & Replace",
    desc: "New batteries (where needed), SSD upgrades, deep cleaning, fresh thermal paste, and OS reinstall on every device.",
  },
  {
    n: "03",
    icon: ShieldCheck,
    title: "Stress Test & Certify",
    desc: "Each unit endures 24-hour burn-in tests, gaming/creative loops, and final QA before getting the LaptopSecure seal.",
  },
];

export default function RefurbishedPage() {
  const refurbished = products.filter((p) => p.category === "refurbished");

  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            Certified Refurbished
          </span>
        }
        title={
          <>
            Like new.{" "}
            <span className="gradient-text">Half the price.</span>{" "}
            Better for the planet.
          </>
        }
        subtitle="MacBooks, ThinkPads, XPS, and more — restored to factory condition, fitted with new batteries, and shipped with a full 12-month warranty."
        breadcrumbs={[{ name: "Refurbished" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/shop?category=refurbished">
              Shop refurbished
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/warranty">Read warranty</Link>
          </Button>
        </div>
      </PageHero>

      {/* Process */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="Our Process"
          title={
            <>
              How we make a used laptop{" "}
              <span className="gradient-text">feel brand new.</span>
            </>
          }
          subtitle="No corner cuts. No surprises. Just an obsessive QA process that's earned the trust of 25,000+ customers."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-2xl glass border border-violet-500/20 hover:border-violet-500/40 p-7 transition-all"
            >
              <div className="absolute -top-5 left-7 font-display text-5xl font-black gradient-text-orange opacity-30">
                {s.n}
              </div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/30 mb-5 mt-3">
                <s.icon className="h-6 w-6 text-violet-300" />
              </div>
              <h3 className="font-display text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Eco message */}
      <section className="container py-12">
        <div className="rounded-3xl glass-strong border border-emerald-500/20 p-8 md:p-12 grid md:grid-cols-[auto,1fr] gap-7 items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 shrink-0">
            <Leaf className="h-10 w-10 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Choosing refurbished{" "}
              <span className="gradient-text">saves the planet</span>
            </h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Every refurbished laptop avoids ~316 kg of CO₂ emissions and 1,200 L of water that would have gone into manufacturing a new device. We've collectively saved over 5,000 tonnes of CO₂ since 2018.
            </p>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="container py-16">
        <SectionHeading
          align="left"
          eyebrow="In Stock"
          title={
            <>
              Fresh refurbished{" "}
              <span className="gradient-text">arrivals</span>
            </>
          }
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {refurbished.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
