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

type SortKey = "featured" | "price_asc" | "price_desc" | "rating_desc";

export function ShopGrid() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [ram, setRam] = useState<string | null>(null);
  const [ssd, setSsd] = useState<string | null>(null);
  const [condition, setCondition] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState(300000);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");

  const allBrands = useMemo(() => getAllBrands(), []);

  const filtered = useMemo(() => {
    const base = products.filter((p) => {
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

    const sorted = [...base];
    if (sort === "price_asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating_desc") sorted.sort((a, b) => b.rating - a.rating);
    if (sort === "featured") {
      sorted.sort((a, b) => Number(!!b.isBestseller) - Number(!!a.isBestseller));
    }
    return sorted;
  }, [search, brand, category, ram, ssd, condition, maxPrice, sort]);

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
      <div className="mb-6 grid gap-3 lg:grid-cols-[1fr,auto,auto]">
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
        <div className="flex gap-2">
          <div className="flex h-12 items-center rounded-xl border border-white/10 bg-white/5 px-3 text-sm">
            <span className="mr-2 text-xs uppercase tracking-widest text-muted-foreground">
              Sort
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="bg-transparent text-sm outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price_asc">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="rating_desc">Rating</option>
            </select>
          </div>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowFilters((v) => !v)}
          className="lg:hidden"
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
        {/* Desktop filters (always visible on lg+) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6 glass rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg">Filters</h3>
              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-xs">
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
                <FilterChip key={b} active={brand === b} onClick={() => setBrand(brand === b ? null : b)}>
                  {b}
                </FilterChip>
              ))}
            </FilterGroup>

            <FilterGroup label="RAM">
              {ramOptions.map((r) => (
                <FilterChip key={r} active={ram === r} onClick={() => setRam(ram === r ? null : r)}>
                  {r}
                </FilterChip>
              ))}
            </FilterGroup>

            <FilterGroup label="SSD">
              {ssdOptions.map((s) => (
                <FilterChip key={s} active={ssd === s} onClick={() => setSsd(ssd === s ? null : s)}>
                  {s}
                </FilterChip>
              ))}
            </FilterGroup>

            <FilterGroup label="Condition">
              {conditionOptions.map((c) => (
                <FilterChip key={c} active={condition === c} onClick={() => setCondition(condition === c ? null : c)}>
                  {c}
                </FilterChip>
              ))}
            </FilterGroup>

            <div>
              <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-semibold">Max Price</h4>
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
                <span className="font-bold text-electric-300">{formatPrice(maxPrice)}</span>
                <span>₹3L</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile filter drawer */}
        <AnimatePresence>
          {showFilters ? (
            <motion.div
              className="fixed inset-0 z-50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button
                aria-label="Close filters"
                onClick={() => setShowFilters(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute left-0 top-0 h-full w-[88%] max-w-sm overflow-auto glass-strong border-r border-white/10 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="font-display text-lg font-bold">Filters</div>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {activeFilters.length > 0 ? (
                  <div className="mt-2">
                    <Button variant="secondary" size="sm" onClick={clearAll} className="w-full">
                      Clear all
                    </Button>
                  </div>
                ) : null}

                <div className="mt-6 space-y-6">
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
                      <FilterChip key={b} active={brand === b} onClick={() => setBrand(brand === b ? null : b)}>
                        {b}
                      </FilterChip>
                    ))}
                  </FilterGroup>

                  <FilterGroup label="RAM">
                    {ramOptions.map((r) => (
                      <FilterChip key={r} active={ram === r} onClick={() => setRam(ram === r ? null : r)}>
                        {r}
                      </FilterChip>
                    ))}
                  </FilterGroup>

                  <FilterGroup label="SSD">
                    {ssdOptions.map((s) => (
                      <FilterChip key={s} active={ssd === s} onClick={() => setSsd(ssd === s ? null : s)}>
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
                      <span className="font-bold text-electric-300">{formatPrice(maxPrice)}</span>
                      <span>₹3L</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button onClick={() => setShowFilters(false)} className="w-full">
                    Apply filters
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
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

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
            <span>
              Showing{" "}
              <span className="text-foreground font-bold">{filtered.length}</span>{" "}
              of{" "}
              <span className="text-foreground font-bold">{products.length}</span>{" "}
              products
            </span>
            <span className="text-xs text-muted-foreground">
              Tip: use filters to quickly find your perfect machine.
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
