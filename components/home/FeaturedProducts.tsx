"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/data/products";

export function FeaturedProducts() {
  const products = getFeaturedProducts();
  return (
    <section className="container py-20 md:py-28 relative">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <SectionHeading
          align="left"
          eyebrow="Featured Drops"
          title={
            <>
              Hand-picked{" "}
              <span className="gradient-text-orange">premium laptops</span>
            </>
          }
          subtitle="Tested. Inspected. Warrantied. Our top picks — refreshed weekly."
        />
        <Button asChild variant="outline" size="lg" className="self-start md:self-end">
          <Link href="/shop">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  );
}
