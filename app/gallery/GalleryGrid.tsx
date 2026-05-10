"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import { galleryImages } from "@/lib/data/misc";
import { cn } from "@/lib/utils";

const filters = [
  { id: "all", label: "All" },
  { id: "products", label: "Products" },
  { id: "store", label: "Store" },
  { id: "repair", label: "Repair Lab" },
  { id: "team", label: "Team" },
];

export function GalleryGrid() {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "all") return galleryImages;
    return galleryImages.filter((img) => img.category === filter);
  }, [filter]);

  return (
    <section className="container pb-24">
      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-2 justify-center">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-all",
              filter === f.id
                ? "border-electric-500/60 bg-electric-500/15 text-electric-300 shadow-glow-soft"
                : "border-white/10 bg-white/5 hover:border-electric-500/30",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Masonry-ish grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {filtered.map((img, i) => (
          <motion.button
            key={img.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            onClick={() => setActive(i)}
            className={cn(
              "group relative overflow-hidden rounded-2xl glass border border-white/5 hover:border-electric-500/40 transition-all duration-500",
              i % 7 === 0 ? "row-span-2 aspect-[3/4]" : "aspect-square",
            )}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-electric-500/90 backdrop-blur-md shadow-glow-blue">
                <ZoomIn className="h-5 w-5 text-white" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-5"
          >
            <button
              className="absolute top-5 right-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setActive(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10"
            >
              <Image
                src={filtered[active].src}
                alt={filtered[active].alt}
                fill
                sizes="100vw"
                priority
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                <p className="font-medium text-white">
                  {filtered[active].alt}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
