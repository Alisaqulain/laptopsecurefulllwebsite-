import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { FAQAccordion } from "./FAQAccordion";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Everything you wanted to know about buying, selling, repairing, and warranty at LaptopSecure.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQs"
        title={
          <>
            Got questions?{" "}
            <span className="gradient-text">We have answers.</span>
          </>
        }
        subtitle="Quick, honest answers to the questions our customers ask the most."
        breadcrumbs={[{ name: "FAQ" }]}
      />
      <FAQAccordion />
    </>
  );
}
