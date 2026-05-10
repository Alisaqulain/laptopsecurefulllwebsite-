"use client";

import { useMarketplace } from "@/components/providers/MarketplaceProvider";
import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/shared/ProductCard";
import { History } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function RecentlyViewed({
  excludeId,
  limit = 4,
  className,
}: {
  excludeId?: string;
  limit?: number;
  className?: string;
}) {
  const { recentlyViewed } = useMarketplace();
  const items = recentlyViewed
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, limit) as typeof products;

  if (items.length === 0) return null;

  return (
    <section className={`container py-16 ${className || ""}`}>
      <SectionHeading
        align="left"
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <History className="h-3.5 w-3.5" />
            Just for you
          </span>
        }
        title={
          <>
            <span className="gradient-text">Recently viewed</span> by you
          </>
        }
      />
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} variant="compact" />
        ))}
      </div>
    </section>
  );
}
