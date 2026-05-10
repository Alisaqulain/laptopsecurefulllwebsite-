"use client";

import Image from "next/image";
import Link from "next/link";
import {
  GitCompare,
  X,
  ShoppingCart,
  ArrowRight,
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Sparkles,
  Battery,
  Weight,
  ShieldCheck,
  Star,
} from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMarketplace } from "@/components/providers/MarketplaceProvider";
import { products } from "@/lib/data/products";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { calculateDiscount, formatPrice } from "@/lib/utils";

const rows: { label: string; key: keyof Pick<
  (typeof products)[number]["specs"],
  | "processor"
  | "ram"
  | "storage"
  | "display"
  | "graphics"
  | "battery"
  | "weight"
>; icon: any }[] = [
  { label: "Processor", key: "processor", icon: Cpu },
  { label: "RAM", key: "ram", icon: MemoryStick },
  { label: "Storage", key: "storage", icon: HardDrive },
  { label: "Display", key: "display", icon: Monitor },
  { label: "Graphics", key: "graphics", icon: Sparkles },
  { label: "Battery", key: "battery", icon: Battery },
  { label: "Weight", key: "weight", icon: Weight },
];

export default function ComparePage() {
  const { compare, toggleCompare } = useMarketplace();
  const items = compare
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <>
      <PageHero
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <GitCompare className="h-3.5 w-3.5 text-electric-300" />
            Side by Side
          </span>
        }
        title={
          <>
            Compare laptops,{" "}
            <span className="gradient-text">spec by spec.</span>
          </>
        }
        subtitle="Pick up to 3 laptops from the shop, and see exactly how they stack up."
        breadcrumbs={[{ name: "Compare" }]}
      />

      <section className="container pb-24">
        {items.length === 0 ? (
          <div className="rounded-3xl glass border border-white/5 p-14 text-center">
            <GitCompare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-display text-2xl font-bold mb-2">
              Nothing to compare yet
            </h3>
            <p className="text-muted-foreground mb-7 max-w-md mx-auto">
              Tap the compare icon on any product card to add it here.
            </p>
            <Button asChild size="lg">
              <Link href="/shop">
                Browse laptops
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `220px repeat(${items.length}, minmax(240px, 1fr))`,
              }}
            >
              {/* Header row */}
              <div />
              {items.map((p) => {
                const disc =
                  p.originalPrice &&
                  calculateDiscount(p.originalPrice, p.price);
                return (
                  <div
                    key={p.id}
                    className="rounded-2xl glass border border-white/10 p-5 relative"
                  >
                    <button
                      onClick={() => toggleCompare(p.id)}
                      className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/40 hover:bg-rose-500/30 transition-colors"
                      aria-label="Remove"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                      <Image
                        src={p.thumbnail}
                        alt={p.name}
                        fill
                        sizes="240px"
                        className="object-cover"
                      />
                    </div>
                    <Badge variant="default" className="mb-2">
                      {p.brand}
                    </Badge>
                    <h3 className="font-display text-base font-bold leading-tight line-clamp-2 mb-2">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs mb-2">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold">{p.rating}</span>
                      <span className="text-muted-foreground">({p.reviewCount})</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="font-display text-xl font-bold gradient-text">
                        {formatPrice(p.price)}
                      </span>
                      {!!disc && disc > 0 && (
                        <Badge variant="success">{disc}% off</Badge>
                      )}
                    </div>
                    <Button asChild size="sm" variant="whatsapp" className="w-full">
                      <a
                        href={buildWhatsAppLink(
                          waMessages.buyProduct(p.name, formatPrice(p.price)),
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Buy
                      </a>
                    </Button>
                  </div>
                );
              })}

              {/* Spec rows */}
              {rows.map((row) => (
                <div key={row.label} className="contents">
                  <div className="rounded-xl bg-white/5 border border-white/5 px-4 py-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                    <row.icon className="h-3.5 w-3.5 text-electric-400" />
                    {row.label}
                  </div>
                  {items.map((p) => (
                    <div
                      key={p.id + row.label}
                      className="rounded-xl glass border border-white/5 px-4 py-3 text-sm font-medium"
                    >
                      {p.specs[row.key]}
                    </div>
                  ))}
                </div>
              ))}

              {/* Warranty row */}
              <div className="rounded-xl bg-white/5 border border-white/5 px-4 py-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Warranty
              </div>
              {items.map((p) => (
                <div
                  key={p.id + "warranty"}
                  className="rounded-xl glass border border-white/5 px-4 py-3 text-sm font-medium"
                >
                  {p.warranty}
                </div>
              ))}

              {/* Condition row */}
              <div className="rounded-xl bg-white/5 border border-white/5 px-4 py-3 flex items-center text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Condition
              </div>
              {items.map((p) => (
                <div
                  key={p.id + "condition"}
                  className="rounded-xl glass border border-white/5 px-4 py-3 text-sm font-medium"
                >
                  {p.condition}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
