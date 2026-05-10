import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { SellLaptopForm } from "./SellLaptopForm";
import { ShieldCheck, Truck, IndianRupee, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Sell Your Laptop — Best Price Guaranteed",
  description:
    "Sell your old laptop for the best price in India. Free pickup, instant payment, and a beat-the-quote guarantee.",
};

const benefits = [
  {
    icon: IndianRupee,
    title: "Best price guaranteed",
    desc: "We'll beat any competitor quote by 5%.",
  },
  {
    icon: Truck,
    title: "Free doorstep pickup",
    desc: "No need to leave home. Available pan-India.",
  },
  {
    icon: Clock,
    title: "30-min payment",
    desc: "Cash, UPI, or bank transfer in 30 minutes.",
  },
  {
    icon: ShieldCheck,
    title: "Data wiped securely",
    desc: "We delete your data with military-grade software.",
  },
];

export default function SellPage() {
  return (
    <>
      <PageHero
        eyebrow="Sell Your Laptop"
        title={
          <>
            Got an old laptop?{" "}
            <span className="gradient-text-orange">Sell it in minutes.</span>
          </>
        }
        subtitle="Get an instant quote, free pickup, and money in your bank in under 30 minutes. India's most trusted laptop buyback service."
        breadcrumbs={[{ name: "Sell Laptop" }]}
      />

      <section className="container py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="rounded-2xl glass border border-white/5 hover:border-neon-500/30 p-5 transition-colors text-center sm:text-left"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neon-500/15 border border-neon-500/30 mb-3 mx-auto sm:mx-0">
                <b.icon className="h-5 w-5 text-neon-300" />
              </div>
              <h3 className="font-display font-bold mb-1">{b.title}</h3>
              <p className="text-xs text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <SellLaptopForm />
    </>
  );
}
