import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Cpu, Gauge, Trophy, Zap, Flame } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Gaming Laptops — RTX 4060 to 4090, 240Hz Esports Rigs",
  description:
    "India's biggest collection of premium gaming laptops. ASUS ROG, Alienware, MSI, Lenovo Legion, Razer Blade. RTX 4060–4090 GPUs, 240Hz displays, certified.",
};

const perks = [
  {
    icon: Trophy,
    title: "Esports Tested",
    desc: "Every laptop benchmarked in Valorant, Cyberpunk, Apex, and CS2.",
  },
  {
    icon: Cpu,
    title: "Latest Silicon",
    desc: "Intel 14th Gen HX, AMD Ryzen 9, Apple M3 Pro/Max — the very best.",
  },
  {
    icon: Gauge,
    title: "240Hz Displays",
    desc: "QHD+, OLED, Mini-LED — color-accurate and stutter-free.",
  },
  {
    icon: Zap,
    title: "RTX 40-series",
    desc: "DLSS 3.5 + frame gen support across our entire gaming lineup.",
  },
];

export default function GamingLaptopsPage() {
  const gaming = products.filter((p) => p.category === "gaming");

  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Flame className="h-3.5 w-3.5 text-rose-400" />
            Gaming Lineup
          </span>
        }
        title={
          <>
            Built for{" "}
            <span className="gradient-text">apex predators.</span>
          </>
        }
        subtitle="The most powerful, RGB-loaded, frame-rate-obsessed gaming laptops on planet Earth — curated by gamers, for gamers."
        breadcrumbs={[{ name: "Gaming Laptops" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/shop?category=gaming">
              Shop all gaming laptops
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/custom-pc">Build a custom rig</Link>
          </Button>
        </div>
      </PageHero>

      {/* Perks */}
      <section className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perks.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl glass border border-rose-500/20 hover:border-rose-500/40 transition-colors p-6"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 mb-4">
                <p.icon className="h-6 w-6 text-rose-300" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="container py-12">
        <SectionHeading
          align="left"
          eyebrow="Featured Beasts"
          title={
            <>
              Performance, untamed.{" "}
              <span className="gradient-text-orange">Picked by pros.</span>
            </>
          }
        />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {gaming.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
