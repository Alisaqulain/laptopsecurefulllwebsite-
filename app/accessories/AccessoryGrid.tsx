"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Mouse,
  Keyboard,
  Wind,
  Plug,
  HardDrive,
  MemoryStick,
  Backpack,
  Headphones,
  Monitor,
  ShoppingCart,
  Star,
  Layers,
} from "lucide-react";
import { accessories } from "@/lib/data/accessories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { calculateDiscount, cn, formatPrice } from "@/lib/utils";

const categories = [
  { id: "all", label: "All", icon: Layers },
  { id: "mouse", label: "Mice", icon: Mouse },
  { id: "keyboard", label: "Keyboards", icon: Keyboard },
  { id: "cooling-pad", label: "Cooling Pads", icon: Wind },
  { id: "charger", label: "Chargers", icon: Plug },
  { id: "ssd", label: "SSDs", icon: HardDrive },
  { id: "ram", label: "RAM", icon: MemoryStick },
  { id: "bag", label: "Bags", icon: Backpack },
  { id: "headphones", label: "Audio", icon: Headphones },
  { id: "monitor", label: "Monitors", icon: Monitor },
];

export function AccessoryGrid() {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return accessories;
    return accessories.filter((a) => a.category === active);
  }, [active]);

  return (
    <section className="container pb-24">
      {/* Category pills */}
      <div className="mb-10 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all whitespace-nowrap shrink-0",
              active === c.id
                ? "border-electric-500/60 bg-electric-500/15 text-electric-300 shadow-glow-soft"
                : "border-white/10 bg-white/5 hover:border-electric-500/30 hover:bg-electric-500/10",
            )}
          >
            <c.icon className="h-4 w-4" />
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((acc, i) => {
          const discount =
            acc.originalPrice &&
            calculateDiscount(acc.originalPrice, acc.price);
          const waLink = buildWhatsAppLink(
            waMessages.buyProduct(acc.name, formatPrice(acc.price)),
          );

          return (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: Math.min(i * 0.04, 0.3),
              }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl glass border border-white/5 hover:border-electric-500/30 transition-all duration-500 flex flex-col"
            >
              {!!discount && discount > 0 && (
                <Badge
                  variant="success"
                  className="absolute top-3 left-3 z-10"
                >
                  -{discount}%
                </Badge>
              )}
              <div className="relative aspect-square bg-gradient-to-br from-electric-500/5 to-neon-500/5 overflow-hidden">
                <Image
                  src={acc.image}
                  alt={acc.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="text-xs font-semibold uppercase tracking-widest text-electric-400 mb-1">
                  {acc.brand}
                </div>
                <h3 className="font-bold text-sm leading-tight line-clamp-2 mb-2 group-hover:text-electric-300 transition-colors">
                  {acc.name}
                </h3>
                <div className="flex items-center gap-1 text-xs mb-3">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{acc.rating}</span>
                  <span className="text-muted-foreground">/ 5</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                  {acc.description}
                </p>
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-bold text-base">
                      {formatPrice(acc.price)}
                    </span>
                    {acc.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(acc.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button asChild size="sm" variant="whatsapp" className="w-full">
                    <a href={waLink} target="_blank" rel="noopener noreferrer">
                      <ShoppingCart className="h-4 w-4" />
                      Buy Now
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
