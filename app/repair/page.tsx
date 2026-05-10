import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { RepairServices } from "./RepairServices";
import { RepairProcess } from "./RepairProcess";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Laptop Repair Services — Expert Engineers, 90-Day Warranty",
  description:
    "Professional laptop repair: screen, battery, keyboard, motherboard, water damage, software install, and PC upgrades. Free pickup across India.",
};

export default function RepairPage() {
  const waLink = buildWhatsAppLink(
    waMessages.repairRequest("General laptop repair inquiry"),
  );

  return (
    <>
      <PageHero
        eyebrow="Certified Repair Lab"
        title={
          <>
            Laptop broken?{" "}
            <span className="gradient-text">We fix it. Fast.</span>
          </>
        }
        subtitle="Apple, Lenovo, ASUS & MSI certified engineers. Component-level board repair, original parts, and a 90-day service warranty on every fix."
        breadcrumbs={[{ name: "Repair Services" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="whatsapp">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              Book Repair on WhatsApp
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="#services">
              View services
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </PageHero>

      <RepairServices />
      <RepairProcess />
    </>
  );
}
