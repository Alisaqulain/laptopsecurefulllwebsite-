"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/types";

const WISHLIST_KEY = "ls_wishlist_v1";
const COMPARE_KEY = "ls_compare_v1";
const VIEWED_KEY = "ls_viewed_v1";
const COMPARE_LIMIT = 3;

interface MarketplaceCtx {
  wishlist: string[];
  compare: string[];
  recentlyViewed: string[];
  toggleWishlist: (id: string) => void;
  toggleCompare: (id: string) => void;
  isWishlisted: (id: string) => boolean;
  isCompared: (id: string) => boolean;
  pushViewed: (product: Product) => void;
  clearCompare: () => void;
  quickView: Product | null;
  openQuickView: (p: Product) => void;
  closeQuickView: () => void;
}

const Ctx = createContext<MarketplaceCtx | null>(null);

function loadList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveList(key: string, list: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {}
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    setWishlist(loadList(WISHLIST_KEY));
    setCompare(loadList(COMPARE_KEY));
    setRecentlyViewed(loadList(VIEWED_KEY));
  }, []);

  useEffect(() => saveList(WISHLIST_KEY, wishlist), [wishlist]);
  useEffect(() => saveList(COMPARE_KEY, compare), [compare]);
  useEffect(() => saveList(VIEWED_KEY, recentlyViewed), [recentlyViewed]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev],
    );
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      const next = [id, ...prev];
      return next.slice(0, COMPARE_LIMIT);
    });
  }, []);

  const isWishlisted = useCallback(
    (id: string) => wishlist.includes(id),
    [wishlist],
  );
  const isCompared = useCallback(
    (id: string) => compare.includes(id),
    [compare],
  );

  const pushViewed = useCallback((p: Product) => {
    setRecentlyViewed((prev) => {
      const next = [p.id, ...prev.filter((x) => x !== p.id)].slice(0, 8);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => setCompare([]), []);

  const openQuickView = useCallback((p: Product) => setQuickView(p), []);
  const closeQuickView = useCallback(() => setQuickView(null), []);

  const value = useMemo(
    () => ({
      wishlist,
      compare,
      recentlyViewed,
      toggleWishlist,
      toggleCompare,
      isWishlisted,
      isCompared,
      pushViewed,
      clearCompare,
      quickView,
      openQuickView,
      closeQuickView,
    }),
    [
      wishlist,
      compare,
      recentlyViewed,
      toggleWishlist,
      toggleCompare,
      isWishlisted,
      isCompared,
      pushViewed,
      clearCompare,
      quickView,
      openQuickView,
      closeQuickView,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe default for SSR / outside provider — keeps components composable
    return {
      wishlist: [],
      compare: [],
      recentlyViewed: [],
      toggleWishlist: () => {},
      toggleCompare: () => {},
      isWishlisted: () => false,
      isCompared: () => false,
      pushViewed: () => {},
      clearCompare: () => {},
      quickView: null,
      openQuickView: () => {},
      closeQuickView: () => {},
    } as MarketplaceCtx;
  }
  return ctx;
}
