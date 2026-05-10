"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Cpu,
  HardDrive,
  MemoryStick,
  ArrowUpRight,
  Heart,
  Eye,
  GitCompare,
} from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMarketplace } from "@/components/providers/MarketplaceProvider";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { calculateDiscount, cn, formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "compact";
}

export function ProductCard({
  product,
  index = 0,
  variant = "default",
}: ProductCardProps) {
  const {
    isWishlisted,
    isCompared,
    toggleWishlist,
    toggleCompare,
    openQuickView,
  } = useMarketplace();

  const discount =
    product.originalPrice &&
    calculateDiscount(product.originalPrice, product.price);

  const waLink = buildWhatsAppLink(
    waMessages.buyProduct(product.name, formatPrice(product.price)),
  );

  const liked = isWishlisted(product.id);
  const compared = isCompared(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl glass border border-white/5 hover:border-electric-500/40 transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),0_0_30px_rgba(0,120,255,0.2)]"
    >
      {/* Top-left badges */}
      <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        {product.isNew && <Badge variant="accent">NEW</Badge>}
        {product.isBestseller && <Badge variant="glow">Bestseller</Badge>}
        {!!discount && discount > 0 && (
          <Badge variant="success">-{discount}%</Badge>
        )}
      </div>

      {/* Top-right action buttons */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
        <IconBtn
          active={liked}
          ariaLabel={liked ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              liked && "fill-rose-500 text-rose-500",
            )}
          />
        </IconBtn>
        <IconBtn
          active={compared}
          ariaLabel={compared ? "Remove from compare" : "Add to compare"}
          onClick={(e) => {
            e.preventDefault();
            toggleCompare(product.id);
          }}
        >
          <GitCompare
            className={cn("h-4 w-4", compared && "text-electric-300")}
          />
        </IconBtn>
        <IconBtn
          ariaLabel="Quick view"
          onClick={(e) => {
            e.preventDefault();
            openQuickView(product);
          }}
        >
          <Eye className="h-4 w-4" />
        </IconBtn>
      </div>

      {/* Image */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-electric-500/10 via-transparent to-neon-500/10"
        data-cursor="hover"
      >
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-gradient-radial from-electric-500/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Condition tag (bottom-left over image) */}
        <div className="absolute bottom-3 left-3 z-10">
          <Badge variant="outline" className="bg-black/40 backdrop-blur-md">
            {product.condition}
          </Badge>
        </div>

        <div className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-electric-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 translate-x-2">
          <ArrowUpRight className="h-5 w-5 text-electric-400" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-2">
          <span className="font-medium uppercase tracking-wider text-electric-400">
            {product.brand}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-foreground">
              {product.rating}
            </span>
            <span>({product.reviewCount})</span>
          </span>
        </div>

        <Link
          href={`/shop/${product.slug}`}
          className="group/title"
          data-cursor="hover"
        >
          <h3 className="font-semibold text-base md:text-lg leading-tight line-clamp-2 group-hover/title:text-electric-300 transition-colors mb-3">
            {product.name}
          </h3>
        </Link>

        {variant !== "compact" && (
          <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
            <SpecPill
              icon={<Cpu className="h-3 w-3" />}
              label={shortSpec(product.specs.processor)}
            />
            <SpecPill
              icon={<MemoryStick className="h-3 w-3" />}
              label={product.specs.ram}
            />
            <SpecPill
              icon={<HardDrive className="h-3 w-3" />}
              label={product.specs.storage}
            />
          </div>
        )}

        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link href={`/shop/${product.slug}`}>Details</Link>
          </Button>
          <Button asChild size="sm" variant="whatsapp" className="w-full">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <ShoppingCart className="h-4 w-4" />
              Buy Now
            </a>
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

function IconBtn({
  children,
  onClick,
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300 hover:scale-110",
        active
          ? "bg-electric-500/20 border-electric-500/60 text-electric-300 shadow-glow-soft"
          : "bg-black/40 border-white/15 text-foreground/80 hover:border-electric-500/40 hover:text-electric-300",
      )}
    >
      {children}
    </button>
  );
}

function SpecPill({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-secondary/50 px-2 py-1.5 text-muted-foreground truncate">
      <span className="text-electric-400 shrink-0">{icon}</span>
      <span className="truncate text-[11px] font-medium text-foreground/90">
        {label}
      </span>
    </div>
  );
}

function shortSpec(processor: string) {
  const m = processor.match(/(i\d|Ryzen \d|M\d \w+|M\d)/i);
  return m ? m[0] : processor.slice(0, 8);
}
