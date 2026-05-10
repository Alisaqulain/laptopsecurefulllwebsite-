"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMarketplace } from "@/components/providers/MarketplaceProvider";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { calculateDiscount, formatPrice } from "@/lib/utils";

export function QuickViewModal() {
  const { quickView, closeQuickView } = useMarketplace();

  return (
    <AnimatePresence>
      {quickView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl glass-strong border border-electric-500/30 shadow-premium"
          >
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close quick view"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-square lg:aspect-auto bg-gradient-to-br from-electric-500/15 via-transparent to-neon-500/10">
                <Image
                  src={quickView.thumbnail}
                  alt={quickView.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {quickView.isNew && <Badge variant="accent">NEW</Badge>}
                  {quickView.isBestseller && <Badge variant="glow">Bestseller</Badge>}
                </div>
              </div>

              {/* Info */}
              <div className="p-7 md:p-9 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">{quickView.brand}</Badge>
                  <Badge variant="outline">{quickView.condition}</Badge>
                </div>
                <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight leading-tight">
                  {quickView.name}
                </h3>

                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold">{quickView.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({quickView.reviewCount} reviews)
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {quickView.shortDescription}
                </p>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { l: "Processor", v: quickView.specs.processor },
                    { l: "RAM", v: quickView.specs.ram },
                    { l: "Storage", v: quickView.specs.storage },
                    { l: "Display", v: quickView.specs.display },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {s.l}
                      </div>
                      <div className="font-medium text-foreground mt-0.5 truncate">
                        {s.v}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 pt-2">
                  <span className="font-display text-3xl font-bold gradient-text">
                    {formatPrice(quickView.price)}
                  </span>
                  {quickView.originalPrice && (
                    <>
                      <span className="text-base text-muted-foreground line-through">
                        {formatPrice(quickView.originalPrice)}
                      </span>
                      <Badge variant="success">
                        {calculateDiscount(
                          quickView.originalPrice,
                          quickView.price,
                        )}
                        % off
                      </Badge>
                    </>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-2 pt-3">
                  <Button asChild variant="whatsapp" size="lg">
                    <a
                      href={buildWhatsAppLink(
                        waMessages.buyProduct(
                          quickView.name,
                          formatPrice(quickView.price),
                        ),
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Buy on WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg" onClick={closeQuickView}>
                    <Link href={`/shop/${quickView.slug}`}>
                      Full details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
