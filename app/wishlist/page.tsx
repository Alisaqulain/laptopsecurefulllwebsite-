"use client";

import Link from "next/link";
import { Heart, ArrowRight, ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/button";
import { useMarketplace } from "@/components/providers/MarketplaceProvider";
import { products } from "@/lib/data/products";

export default function WishlistPage() {
  const { wishlist } = useMarketplace();
  const items = wishlist
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-rose-400" />
            Saved for later
          </span>
        }
        title={
          <>
            Your{" "}
            <span className="gradient-text">wishlist</span>
          </>
        }
        subtitle="Devices you've saved. Ping us on WhatsApp when you're ready — we'll lock the price for 24 hours."
        breadcrumbs={[{ name: "Wishlist" }]}
      />

      <section className="container pb-24">
        {items.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl glass border border-white/5 p-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 mb-5">
              <Heart className="h-8 w-8 text-rose-400" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-muted-foreground mb-7 max-w-md mx-auto">
              Tap the heart on any laptop to save it for later. We'll keep it
              right here.
            </p>
            <Button asChild size="lg">
              <Link href="/shop">
                <ShoppingBag className="h-5 w-5" />
                Browse the shop
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        )}
      </section>
    </>
  );
}
