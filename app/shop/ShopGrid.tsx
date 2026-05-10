"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  PackageX,
} from "lucide-react";
import { products, getAllBrands } from "@/lib/data/products";
import { ProductCard } from "@/components/shared/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";

const ramOptions = ["8GB", "16GB", "32GB", "64GB"];
const ssdOptions = ["256GB", "512GB", "1TB", "2TB"];
const categoryOptions = [
  { id: "gaming", label: "Gaming" },
  { id: "business", label: "Business" },
  { id: "student", label: "Student" },
  { id: "refurbished", label: "Refurbished" },
];
const conditionOptions = [
  "Brand New",
  "Like New",
  "Excellent",
  "Refurbished",
];

export function ShopGrid() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [ram, setRam] = useState<string | null>(null);
  const [ssd, setSsd] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [showFilters, setShowFilters] = useState(false);

  const allBrands = useMemo(() => getAllBrands(), []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.brand.toLowerCase().includes(q) &&
          !p.tags.some((t) => t.toLowerCase().includes(q))
        )
          return false;
      }
      if (brand && p.brand !== brand) return false;
      if (category && p.category !== category) return false;
      if (ram && !p.specs.ram.includes(ram)) return false;
      if (ssd && !p.specs.storage.includes(ssd)) return false;
      if (condition && p.condition !== condition) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
  }, [search, brand, category, ram, ssd, condition, maxPrice]);

  const clearAll = () => {
    setSearch("");
    setBrand(null);
    setCategory(null);
    setRam(null);
    setSsd(null);
    setCondition(null);
    setMaxPrice(300000);
  };

  const activeFilters = [
    brand && { label: `Brand: ${brand}`, clear: () => setBrand(null) },
    category && { label: `Category: ${category}`, clear: () => setCategory(null) },
    ram && { label: `RAM: ${ram}`, clear: () => setRam(null) },
    ssd && { label: `SSD: ${ssd}`, clear: () => setSsd(null) },
    condition && { label: condition, clear: () => setCondition(null) },
    maxPrice < 300000 && {
      label: `Up to ${formatPrice(maxPrice)}`,
      clear: () => setMaxPrice(300000),
    },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <section className="container pb-24">
      {/* Top bar */}
      <div className="mb-8 grid md:grid-cols-[1fr,auto] gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by brand, model, RAM, GPU..."
            className="pl-11 h-12 text-base"
          />
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilters.length > 0 && (
            <Badge variant="default" className="ml-1">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </div>

      <div className="grid lg:grid-cols-[260px,1fr] gap-8">
        {/* Filters panel */}
        <AnimatePresence initial={false}>
          {(showFilters || typeof window === "undefined") && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "lg:block",
                !showFilters && "hidden lg:block",
              )}
            >
              <div className="sticky top-24 space-y-6 glass rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg">Filters</h3>
                  {activeFilters.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                <FilterGroup label="Category">
                  {categoryOptions.map((c) => (
                    <FilterChip
                      key={c.id}
                      active={category === c.id}
                      onClick={() => setCategory(category === c.id ? null : c.id)}
                    >
                      {c.label}
                    </FilterChip>
                  ))}
                </FilterGroup>

                <FilterGroup label="Brand">
                  {allBrands.map((b) => (
                    <FilterChip
                      key={b}
                      active={brand === b}
                      onClick={() => setBrand(brand === b ? null : b)}
                    >
                      {b}
                    </FilterChip>
                  ))}
                </FilterGroup>

                <FilterGroup label="RAM">
                  {ramOptions.map((r) => (
                    <FilterChip
                      key={r}
                      active={ram === r}
                      onClick={() => setRam(ram === r ? null : r)}
                    >
                      {r}
                    </FilterChip>
                  ))}
                </FilterGroup>

                <FilterGroup label="SSD">
                  {ssdOptions.map((s) => (
                    <FilterChip
                      key={s}
                      active={ssd === s}
                      onClick={() => setSsd(ssd === s ? null : s)}
                    >
                      {s}
                    </FilterChip>
                  ))}
                </FilterGroup>

                <FilterGroup label="Condition">
                  {conditionOptions.map((c) => (
                    <FilterChip
                      key={c}
                      active={condition === c}
                      onClick={() => setCondition(condition === c ? null : c)}
                    >
                      {c}
                    </FilterChip>
                  ))}
                </FilterGroup>

                <div>
                  <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
                    Max Price
                  </h4>
                  <input
                    type="range"
                    min={20000}
                    max={300000}
                    step={5000}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-electric-500"
                  />
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>₹20K</span>
                    <span className="font-bold text-electric-300">
                      {formatPrice(maxPrice)}
                    </span>
                    <span>₹3L</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div>
          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {activeFilters.map((f, i) => (
                <button
                  key={i}
                  onClick={f.clear}
                  className="inline-flex items-center gap-1.5 rounded-full bg-electric-500/15 border border-electric-500/30 px-3 py-1 text-xs text-electric-300 hover:bg-electric-500/25 transition-colors"
                >
                  {f.label}
                  <X className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}

          <div className="mb-5 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing{" "}
              <span className="text-foreground font-bold">{filtered.length}</span>{" "}
              of{" "}
              <span className="text-foreground font-bold">{products.length}</span>{" "}
              products
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center glass rounded-2xl border border-white/5 p-16">
              <PackageX className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-display text-xl font-bold">
                No products match your filters
              </h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-sm">
                Try adjusting your search or removing some filters to see more.
              </p>
              <Button onClick={clearAll} className="mt-6">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">
        {label}
      </h4>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-electric-500/60 bg-electric-500/15 text-electric-300 shadow-glow-soft"
          : "border-white/10 bg-white/5 text-foreground/80 hover:border-electric-500/30 hover:bg-electric-500/10",
      )}
    >
      {children}
    </button>
  );
}
