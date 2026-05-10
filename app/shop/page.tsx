import type { Metadata } from "next";
import { ShopGrid } from "./ShopGrid";
import { PageHero } from "@/components/shared/PageHero";

export const metadata: Metadata = {
  title: "Shop Premium Laptops, Gaming PCs & Accessories",
  description:
    "Browse our curated catalog of new, refurbished, and second-hand laptops. Filter by brand, RAM, SSD, and price. Free shipping & 12-month warranty.",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Marketplace"
        title={
          <>
            <span className="gradient-text">Shop Laptops</span> & PCs
          </>
        }
        subtitle="Premium new, refurbished, and second-hand laptops — all backed by our 12-month warranty and 50-point inspection."
        breadcrumbs={[{ name: "Shop" }]}
      />
      <ShopGrid />
    </>
  );
}
