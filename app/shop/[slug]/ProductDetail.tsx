"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  MessageCircle,
  ShieldCheck,
  Truck,
  RefreshCcw,
  PackageCheck,
  Cpu,
  MemoryStick,
  HardDrive,
  Monitor,
  Battery,
  Weight,
  Sparkles,
  ChevronRight,
  Home,
} from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/shared/ProductCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GlowOrb } from "@/components/shared/GlowOrb";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { calculateDiscount, formatPrice } from "@/lib/utils";

interface Props {
  product: Product;
  related: Product[];
}

export function ProductDetail({ product, related }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const discount =
    product.originalPrice && calculateDiscount(product.originalPrice, product.price);

  const buyLink = buildWhatsAppLink(
    waMessages.buyProduct(product.name, formatPrice(product.price)),
  );
  const sellerLink = buildWhatsAppLink(waMessages.contactSeller(product.name));

  const specsList = [
    { icon: Cpu, label: "Processor", value: product.specs.processor },
    { icon: MemoryStick, label: "RAM", value: product.specs.ram },
    { icon: HardDrive, label: "Storage", value: product.specs.storage },
    { icon: Monitor, label: "Display", value: product.specs.display },
    { icon: Sparkles, label: "Graphics", value: product.specs.graphics },
    { icon: Battery, label: "Battery", value: product.specs.battery },
    { icon: Weight, label: "Weight", value: product.specs.weight },
  ];

  return (
    <>
      <section className="relative pt-32 md:pt-36 pb-12 overflow-hidden">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <GlowOrb className="left-1/3 top-1/2" color="blue" size="lg" />
        </div>

        {/* Breadcrumbs */}
        <div className="container mb-6">
          <nav
            className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-electric-300 transition-colors"
            >
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <Link
              href="/shop"
              className="hover:text-electric-300 transition-colors"
            >
              Shop
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <span className="text-foreground/90 truncate">{product.name}</span>
          </nav>
        </div>

        <div className="container grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl glass border border-white/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              {!!discount && discount > 0 && (
                <Badge variant="success" className="absolute top-4 left-4 z-10">
                  Save {discount}%
                </Badge>
              )}
              <Badge
                variant="outline"
                className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur"
              >
                {product.condition}
              </Badge>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                    activeImage === i
                      ? "border-electric-500 shadow-glow-soft"
                      : "border-white/5 hover:border-white/20 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">{product.brand}</Badge>
              <Badge variant="accent">{product.category}</Badge>
              {product.isBestseller && <Badge variant="glow">Bestseller</Badge>}
              {product.isNew && <Badge variant="success">New Arrival</Badge>}
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} verified reviews)
              </span>
            </div>

            <p className="text-base text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Price card */}
            <div className="rounded-2xl glass-strong border border-electric-500/20 p-6">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-display text-4xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {!!discount && discount > 0 && (
                  <Badge variant="success">You save {discount}%</Badge>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Inclusive of all taxes • EMI from{" "}
                <span className="text-electric-300 font-bold">
                  {formatPrice(Math.round(product.price / 12))}
                </span>
                /mo
              </p>

              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                <Button asChild size="lg" variant="whatsapp" className="w-full">
                  <a href={buyLink} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="h-5 w-5" />
                    Buy on WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full">
                  <a href={sellerLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Contact Seller
                  </a>
                </Button>
              </div>
            </div>

            {/* Trust */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <TrustBadge icon={ShieldCheck} text={product.warranty} />
              <TrustBadge icon={Truck} text="Free Shipping" />
              <TrustBadge icon={RefreshCcw} text="7-Day Returns" />
              <TrustBadge icon={PackageCheck} text="50-pt QC" />
            </div>

            {/* Highlights */}
            <div className="rounded-2xl glass border border-white/5 p-6">
              <h3 className="font-display font-bold text-base mb-4">
                Highlights
              </h3>
              <ul className="grid sm:grid-cols-2 gap-2.5">
                {product.highlights.map((h) => (
                  <li
                    key={h}
                    className="flex items-start gap-2 text-sm text-foreground/90"
                  >
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-electric-400 shrink-0 shadow-[0_0_8px_#0078ff]" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Specs grid */}
      <section className="container py-16">
        <SectionHeading
          align="left"
          eyebrow="Specifications"
          title={
            <>
              Engineered for{" "}
              <span className="gradient-text">peak performance</span>
            </>
          }
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specsList.map((spec, i) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-2xl glass border border-white/5 p-5 hover:border-electric-500/30 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric-500/15 border border-electric-500/30">
                  <spec.icon className="h-4 w-4 text-electric-300" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {spec.label}
                </span>
              </div>
              <p className="font-display text-base font-bold leading-snug">
                {spec.value}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* What's in the box */}
      <section className="container py-12">
        <div className="rounded-2xl glass-strong border border-white/5 p-8 md:p-10">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-6">
            What's <span className="gradient-text">in the box</span>
          </h3>
          <ul className="grid sm:grid-cols-2 gap-3">
            {product.inBox.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/5 px-4 py-3"
              >
                <PackageCheck className="h-5 w-5 text-electric-400 shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Description */}
      <section className="container py-12">
        <div className="max-w-4xl">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
            About this product
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="container py-20">
          <SectionHeading
            align="left"
            eyebrow="You may also like"
            title={
              <>
                Similar{" "}
                <span className="gradient-text">picks for you</span>
              </>
            }
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function TrustBadge({
  icon: Icon,
  text,
}: {
  icon: any;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl glass border border-white/5 p-3 text-center">
      <Icon className="h-5 w-5 text-emerald-400" />
      <span className="text-[11px] font-semibold leading-tight">{text}</span>
    </div>
  );
}
