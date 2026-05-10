import type { Metadata } from "next";
import Link from "next/link";
import {
  GraduationCap,
  Tag,
  CreditCard,
  Headphones,
  Backpack,
  ArrowRight,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data/products";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Student Deals — Affordable Laptops with Free Accessories",
  description:
    "Special student pricing on laptops + free bag, mouse, and 1-year extended warranty. Valid student/college ID required.",
};

const perks = [
  {
    icon: Tag,
    title: "Up to 25% off",
    desc: "Exclusive prices for verified students on selected laptops.",
  },
  {
    icon: Backpack,
    title: "Free starter bundle",
    desc: "Premium backpack + wireless mouse + screen cleaner kit, on us.",
  },
  {
    icon: CreditCard,
    title: "0-cost EMI",
    desc: "0% interest EMI plans — pay over 6, 9, or 12 months.",
  },
  {
    icon: Headphones,
    title: "Free 24-hr support",
    desc: "Direct WhatsApp helpline for software setup, projects, and troubleshooting.",
  },
];

export default function StudentDealsPage() {
  const studentPicks = [
    ...products.filter((p) => p.category === "student"),
    ...products.filter((p) => p.category === "refurbished"),
  ].slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <GraduationCap className="h-3.5 w-3.5 text-amber-300" />
            Student Deals
          </span>
        }
        title={
          <>
            Built for{" "}
            <span className="gradient-text">classrooms, code &amp; coffee.</span>
          </>
        }
        subtitle="Special student pricing on premium laptops, with free accessories, no-cost EMI, and a dedicated support helpline."
        breadcrumbs={[{ name: "Student Deals" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/shop?category=student">
              Browse student laptops
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a
              href={buildWhatsAppLink(
                "Hi LaptopSecure! 🎓\n\nI'm a student. Please share the latest student deals + verification process.\n\nCollege/University: ",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Verify student ID
            </a>
          </Button>
        </div>
      </PageHero>

      {/* Perks */}
      <section className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl glass border border-amber-500/20 hover:border-amber-500/40 transition-colors p-6"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 mb-4">
                <p.icon className="h-6 w-6 text-amber-300" />
              </div>
              <h3 className="font-display text-lg font-bold mb-1.5">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Use-cases */}
      <section className="container py-12">
        <div className="rounded-3xl glass-strong border border-electric-500/20 p-8 md:p-12 grid lg:grid-cols-3 gap-7">
          <div>
            <BookOpen className="h-8 w-8 text-electric-300 mb-3" />
            <h3 className="font-display text-xl font-bold mb-2">For B.Tech / B.Sc</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              16GB RAM minimum, SSD-first storage, and a build that survives
              dorm life. Perfect for coding, CAD, and Linux.
            </p>
          </div>
          <div>
            <Sparkles className="h-8 w-8 text-neon-300 mb-3" />
            <h3 className="font-display text-xl font-bold mb-2">For Design / Media</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Color-accurate display, dGPU, ample storage for footage. MacBook
              Air M2 or XPS 15 OLED — both refurbished at student price.
            </p>
          </div>
          <div>
            <GraduationCap className="h-8 w-8 text-amber-300 mb-3" />
            <h3 className="font-display text-xl font-bold mb-2">For MBA / Management</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Lightweight, all-day battery, premium feel. ThinkPad X1 Carbon,
              MacBook Air M2 — built for case studies and presentations.
            </p>
          </div>
        </div>
      </section>

      {/* Picks */}
      <section className="container py-16">
        <SectionHeading
          align="left"
          eyebrow="Top Student Picks"
          title={
            <>
              Hand-picked{" "}
              <span className="gradient-text">just for you.</span>
            </>
          }
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {studentPicks.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Eligibility */}
      <section className="container py-12">
        <div className="rounded-3xl glass border border-amber-500/20 p-8 md:p-10">
          <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight">
            Eligibility — <span className="gradient-text">simple &amp; quick</span>
          </h3>
          <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
            <li>• Currently enrolled in any school, college, or university in India.</li>
            <li>• Valid student ID, admission letter, or fee receipt (not older than 6 months).</li>
            <li>• One device per academic year, per student.</li>
            <li>• Verification done over WhatsApp in under 5 minutes.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
