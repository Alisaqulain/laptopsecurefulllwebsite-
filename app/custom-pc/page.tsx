import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { PCBuildShowcase } from "./PCBuildShowcase";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Custom PC Builds — Gaming, Workstation & Streaming Rigs",
  description:
    "Pre-configured and fully custom PC builds. Gaming rigs, creator workstations, and streaming PCs by certified engineers in India.",
};

export default function CustomPCPage() {
  return (
    <>
      <PageHero
        eyebrow="Custom PC Builds"
        title={
          <>
            Built for{" "}
            <span className="gradient-text">peak performance.</span>
          </>
        }
        subtitle="Pre-configured rigs and 100% custom builds — gaming, streaming, creator, and AI/ML workstations. Designed by experts, assembled with passion."
        breadcrumbs={[{ name: "Custom PC" }]}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" variant="default">
            <Link href="#builds">
              Explore Builds
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="whatsapp">
            <a
              href={buildWhatsAppLink(
                waMessages.customPC("Custom build inquiry"),
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="h-5 w-5" />
              Talk to Build Expert
            </a>
          </Button>
        </div>
      </PageHero>

      <PCBuildShowcase />
    </>
  );
}
