import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { AccessoryGrid } from "./AccessoryGrid";

export const metadata: Metadata = {
  title: "Laptop & PC Accessories — Mice, Keyboards, SSDs, RAM",
  description:
    "Premium laptop accessories: mechanical keyboards, gaming mice, SSDs, RAM, chargers, headphones, monitors, and more.",
};

export default function AccessoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Accessories"
        title={
          <>
            Premium accessories.{" "}
            <span className="gradient-text">Premium experience.</span>
          </>
        }
        subtitle="Hand-picked mice, keyboards, SSDs, RAM, headphones, monitors and more from the brands that pros rely on."
        breadcrumbs={[{ name: "Accessories" }]}
      />

      <AccessoryGrid />
    </>
  );
}
