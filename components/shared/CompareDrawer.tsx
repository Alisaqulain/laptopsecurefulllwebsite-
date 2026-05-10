"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMarketplace } from "@/components/providers/MarketplaceProvider";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

export function CompareDrawer() {
  const { compare, toggleCompare, clearCompare } = useMarketplace();
  const [open, setOpen] = useState(true);

  if (compare.length === 0) return null;

  const items = compare
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 200, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 250 }}
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]"
      >
        <div className="glass-strong rounded-2xl border border-electric-500/30 shadow-premium overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-electric-500/20 border border-electric-500/30">
                <GitCompare className="h-4 w-4 text-electric-300" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  Comparing
                </div>
                <div className="font-display font-bold text-sm">
                  {items.length} laptop{items.length > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle"
              >
                <ChevronUp
                  className={`h-4 w-4 transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearCompare}
                aria-label="Clear all"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                key="content"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="relative rounded-xl border border-white/10 bg-white/5 p-3"
                    >
                      <button
                        onClick={() => toggleCompare(p.id)}
                        className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-rose-500/40 transition-colors"
                        aria-label="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <div className="relative aspect-[4/3] rounded-md overflow-hidden mb-2">
                        <Image
                          src={p.thumbnail}
                          alt={p.name}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-xs font-bold line-clamp-1">
                        {p.name}
                      </div>
                      <div className="text-xs text-electric-300 font-bold mt-1">
                        {formatPrice(p.price)}
                      </div>
                    </div>
                  ))}
                  {items.length < 3 &&
                    Array.from({ length: 3 - items.length }).map((_, i) => (
                      <div
                        key={`empty-${i}`}
                        className="aspect-[5/4] rounded-xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center text-xs text-muted-foreground"
                      >
                        Add another
                      </div>
                    ))}
                </div>
                <div className="px-5 pb-5">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/compare">View detailed comparison →</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
