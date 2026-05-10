import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Stats } from "@/components/home/Stats";
import { Brands } from "@/components/home/Brands";
import { teamMembers, galleryImages } from "@/lib/data/misc";
import { Target, Eye, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About LaptopSecure — India's Premium Laptop Marketplace",
  description:
    "Founded in 2018, LaptopSecure is India's most trusted marketplace for new, refurbished, and second-hand laptops, gaming PCs, and expert repair services.",
};

const pillars = [
  {
    icon: Target,
    title: "Mission",
    body: "To make premium computing accessible, affordable, and trustworthy for every Indian — through verified products, fair pricing, and expert service.",
  },
  {
    icon: Eye,
    title: "Vision",
    body: "To be the most trusted name in India's electronics ecosystem — the first place every tech enthusiast thinks of for buying, selling, or fixing their device.",
  },
  {
    icon: Heart,
    title: "Values",
    body: "Honesty above margins. Quality above quantity. Customers above everything. We win when our customers do.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={
          <>
            Built by tech lovers,{" "}
            <span className="gradient-text">for tech lovers.</span>
          </>
        }
        subtitle="LaptopSecure started in 2018 with one mission — bring trust to India's used laptop market. Today, we're 25,000+ customers strong, with offices in 4 cities and a 200-engineer team."
        breadcrumbs={[{ name: "About" }]}
      />

      {/* Pillars */}
      <section className="container py-16">
        <div className="grid md:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl glass border border-white/5 hover:border-electric-500/30 transition-colors p-7"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-electric-500/15 border border-electric-500/30 mb-5">
                <p.icon className="h-6 w-6 text-electric-300" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Stats />

      {/* Team */}
      <section className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Meet The Team"
          title={
            <>
              Engineers, designers,{" "}
              <span className="gradient-text">tech enthusiasts.</span>
            </>
          }
          subtitle="The brains and hands behind every laptop that leaves our facility."
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((m, i) => (
            <article
              key={m.id}
              className="group rounded-2xl glass border border-white/5 hover:border-electric-500/30 transition-all duration-500 overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={m.avatar}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
              </div>
              <div className="p-5">
                <h4 className="font-display text-lg font-bold">{m.name}</h4>
                <p className="text-electric-300 text-xs font-semibold tracking-wider uppercase mt-0.5">
                  {m.role}
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {m.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Gallery preview */}
      <section className="container py-20 md:py-28">
        <SectionHeading
          eyebrow="Our Workspace"
          title={
            <>
              A peek inside{" "}
              <span className="gradient-text">our world.</span>
            </>
          }
          subtitle="From the showroom floor to the engineering lab, here's where the magic happens."
        />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {galleryImages.slice(0, 8).map((img) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-2xl glass border border-white/5 group hover:border-electric-500/30 transition-colors"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </section>

      <Brands />
    </>
  );
}
