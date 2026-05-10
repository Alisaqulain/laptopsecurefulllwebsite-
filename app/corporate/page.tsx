import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Receipt,
  Truck,
  Shield,
  Headphones,
  Settings,
  ArrowRight,
  CheckCircle2,
  Briefcase,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { CorporateInquiryForm } from "./CorporateInquiryForm";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Corporate / Bulk Orders — IT Procurement for Indian Businesses",
  description:
    "B2B laptop procurement for businesses, startups, and enterprises. GST invoicing, bulk discounts, custom imaging, and dedicated account managers.",
};

const services = [
  {
    icon: Receipt,
    title: "GST Invoicing & Compliance",
    desc: "Full GST B2B invoices, eligible for input tax credit. PAN-India compliance.",
  },
  {
    icon: Truck,
    title: "Pan-India Doorstep Delivery",
    desc: "Bulk shipments to multiple offices across 120+ cities — single dashboard.",
  },
  {
    icon: Settings,
    title: "Custom Imaging & Setup",
    desc: "Pre-installed OS, joined to your domain, and ready-to-deploy out of the box.",
  },
  {
    icon: Shield,
    title: "Extended Enterprise Warranty",
    desc: "Up to 3-year onsite warranty. Same-day swap for critical roles.",
  },
  {
    icon: Headphones,
    title: "Dedicated Account Manager",
    desc: "Single point of contact, quarterly health reports, asset tracking.",
  },
  {
    icon: Briefcase,
    title: "Lease & Buy-Back Programs",
    desc: "Flexible leasing for predictable opex. Or sell back at the end of the lifecycle.",
  },
];

const clients = [
  "Series-A Startups",
  "Mid-size IT Firms",
  "Design Agencies",
  "EdTech Schools",
  "GCC / Tech Centers",
  "Hospitality Groups",
];

const tiers = [
  { qty: "10-49 units", discount: "Up to 12% off MRP" },
  { qty: "50-99 units", discount: "Up to 18% off MRP" },
  { qty: "100-499 units", discount: "Up to 22% off + free imaging" },
  { qty: "500+ units", discount: "Custom enterprise pricing" },
];

export default function CorporatePage() {
  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Building2 className="h-3.5 w-3.5" />
            B2B Procurement
          </span>
        }
        title={
          <>
            IT procurement,{" "}
            <span className="gradient-text">simplified.</span>
          </>
        }
        subtitle="From a 10-laptop refresh for your design team to a 500-unit roll-out for your global capability center — we deliver, image, and service every device."
        breadcrumbs={[{ name: "Corporate / Bulk" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="#inquiry">
              Get bulk quote
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a
              href={buildWhatsAppLink(
                "Hello LaptopSecure! 🏢\n\nI'd like a corporate / bulk order quote.\n\nCompany name: \nNumber of units: \nUse-case: ",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Talk to sales
            </a>
          </Button>
        </div>
      </PageHero>

      {/* Services */}
      <section className="container py-16">
        <SectionHeading
          eyebrow="What's included"
          title={
            <>
              Built for{" "}
              <span className="gradient-text">enterprise IT teams.</span>
            </>
          }
          subtitle="Everything your CIO needs — billing, security, and service — handled by a single partner."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl glass border border-white/5 hover:border-electric-500/30 transition-colors p-7"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-electric-500/15 border border-electric-500/30 mb-5">
                <s.icon className="h-6 w-6 text-electric-300" />
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
          eyebrow="Volume Pricing"
          title={
            <>
              The more you buy,{" "}
              <span className="gradient-text-orange">the more you save.</span>
            </>
          }
        />
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t, i) => (
            <div
              key={t.qty}
              className="rounded-2xl glass border border-white/5 hover:border-electric-500/30 p-6 transition-all relative overflow-hidden"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Tier {i + 1}
              </div>
              <div className="font-display text-xl md:text-2xl font-bold mb-2">
                {t.qty}
              </div>
              <div className="font-display text-base font-bold gradient-text">
                {t.discount}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clients */}
      <section className="container py-12">
        <div className="rounded-3xl glass-strong border border-white/10 p-8 md:p-12 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">
            Trusted by <span className="gradient-text">200+ businesses</span>
          </h3>
          <p className="text-muted-foreground mb-7">
            From bootstrapped startups to publicly listed enterprises.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {clients.map((c) => (
              <span
                key={c}
                className="rounded-full border border-electric-500/30 bg-electric-500/10 px-4 py-1.5 text-xs md:text-sm font-medium text-electric-200"
              >
                <CheckCircle2 className="inline-block h-3.5 w-3.5 mr-1.5 text-emerald-400" />
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry" className="container py-16">
        <CorporateInquiryForm />
      </section>
    </>
  );
}
