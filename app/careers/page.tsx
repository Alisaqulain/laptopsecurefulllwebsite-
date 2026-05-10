import type { Metadata } from "next";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Heart,
  Trophy,
  Coffee,
  GraduationCap,
  Smile,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Careers — Build the Future of Tech Trading with Us",
  description:
    "Join LaptopSecure — India's premium laptop marketplace. We're hiring engineers, retail staff, and creators in Gurugram, Bengaluru, and Mumbai.",
};

const roles = [
  {
    title: "Senior Hardware Repair Engineer",
    location: "Gurugram, India",
    type: "Full-time",
    salary: "₹8 - 14 LPA",
    tag: "Engineering",
    desc: "Lead our motherboard chip-level repair lab. 5+ years on Apple / Lenovo / ASUS service.",
  },
  {
    title: "Frontend Engineer (Next.js)",
    location: "Bengaluru / Remote",
    type: "Full-time",
    salary: "₹14 - 24 LPA",
    tag: "Engineering",
    desc: "Build the next generation of LaptopSecure web experiences. Next.js, TypeScript, Framer Motion.",
  },
  {
    title: "Custom PC Build Specialist",
    location: "Gurugram, India",
    type: "Full-time",
    salary: "₹6 - 10 LPA",
    tag: "Engineering",
    desc: "Design and assemble custom gaming/workstation rigs. Stay current on every GPU launch.",
  },
  {
    title: "Customer Success Lead",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹7 - 12 LPA",
    tag: "Operations",
    desc: "Own the post-purchase journey for thousands of customers. Build trust, solve problems.",
  },
  {
    title: "Performance Marketing Manager",
    location: "Gurugram / Remote",
    type: "Full-time",
    salary: "₹10 - 18 LPA",
    tag: "Marketing",
    desc: "Scale paid acquisition across Meta, Google, and YouTube. Performance + brand mindset.",
  },
  {
    title: "Content Creator / Reviewer",
    location: "Anywhere in India",
    type: "Contract / Full-time",
    salary: "Negotiable",
    tag: "Marketing",
    desc: "Create gear reviews, build guides, and unboxings for our YouTube + Instagram channels.",
  },
];

const perks = [
  {
    icon: Heart,
    title: "Health for the family",
    desc: "Comprehensive health insurance for you, your spouse, and dependents.",
  },
  {
    icon: Trophy,
    title: "Generous ESOPs",
    desc: "Every full-timer gets equity. Build something — own a piece of it.",
  },
  {
    icon: Coffee,
    title: "Hybrid work",
    desc: "WFH 3 days a week, flexible hours, premium home-office allowance.",
  },
  {
    icon: GraduationCap,
    title: "Learning budget",
    desc: "₹50k/year for courses, books, conferences, or just a Kindle Unlimited.",
  },
  {
    icon: Smile,
    title: "Devices on us",
    desc: "Pick your dream laptop on day-one. Free upgrades every 2 years.",
  },
  {
    icon: Sparkles,
    title: "Friday demos",
    desc: "Show off your hobby project. Best demo wins a tech gift card.",
  },
];

export default function CareersPage() {
  const applyLink = (role: string) =>
    buildWhatsAppLink(
      `Hello LaptopSecure! 👋\n\nI'd like to apply for: *${role}*\n\nI'll share my resume and a brief intro here.`,
    );

  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5" />
            We're hiring
          </span>
        }
        title={
          <>
            Build the future of{" "}
            <span className="gradient-text">tech trading.</span>
          </>
        }
        subtitle="We're a fast-growing team obsessed with quality, customer trust, and craft. Come build with us."
        breadcrumbs={[{ name: "Careers" }]}
      />

      {/* Stats / why */}
      <section className="container py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { v: "200+", l: "Team members" },
            { v: "4.7★", l: "Glassdoor rating" },
            { v: "92%", l: "Retention rate" },
            { v: "5", l: "India offices" },
          ].map((s) => (
            <div
              key={s.l}
              className="rounded-2xl glass border border-white/5 p-6 text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-bold gradient-text">
                {s.v}
              </div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-2">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="container py-12">
        <SectionHeading
          align="left"
          eyebrow="Open Roles"
          title={
            <>
              Find your{" "}
              <span className="gradient-text">next move.</span>
            </>
          }
        />
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {roles.map((role) => (
            <article
              key={role.title}
              className="group rounded-2xl glass border border-white/5 hover:border-electric-500/30 transition-all p-6 md:p-7"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <Badge variant="default" className="mb-2">
                    {role.tag}
                  </Badge>
                  <h3 className="font-display text-lg md:text-xl font-bold tracking-tight leading-tight">
                    {role.title}
                  </h3>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {role.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {role.type}
                </span>
                <span className="text-electric-300 font-semibold">
                  {role.salary}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {role.desc}
              </p>
              <Button asChild size="sm" variant="whatsapp">
                <a
                  href={applyLink(role.title)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply on WhatsApp
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="Why LaptopSecure"
          title={
            <>
              Perks that{" "}
              <span className="gradient-text-orange">actually matter.</span>
            </>
          }
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {perks.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl glass border border-white/5 hover:border-neon-500/30 p-7 transition-colors"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neon-500/15 border border-neon-500/30 mb-4">
                <p.icon className="h-6 w-6 text-neon-300" />
              </div>
              <h3 className="font-display text-lg font-bold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Don't see your role */}
      <section className="container py-12">
        <div className="rounded-3xl glass-strong border border-electric-500/20 p-10 md:p-14 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Don't see your role?{" "}
            <span className="gradient-text">Reach out anyway.</span>
          </h3>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            We hire for talent and grit. If you can change the game — we'll
            invent the role.
          </p>
          <Button asChild size="lg" variant="whatsapp" className="mt-6">
            <a
              href={buildWhatsAppLink(
                "Hi LaptopSecure! 👋\n\nI don't see a fitting role, but I'd love to chat about joining your team.\n\nMy background: ",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Send open application
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
