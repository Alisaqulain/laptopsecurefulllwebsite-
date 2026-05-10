"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  MessageCircle,
  Heart,
  GitCompare,
  ChevronDown,
} from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { useMarketplace } from "@/components/providers/MarketplaceProvider";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Repair", href: "/repair" },
  { name: "Sell", href: "/sell" },
  { name: "Custom PC", href: "/custom-pc" },
];

const moreLinks = [
  { name: "Gaming Laptops", href: "/gaming-laptops" },
  { name: "Refurbished", href: "/refurbished" },
  { name: "Accessories", href: "/accessories" },
  { name: "Trade-In Program", href: "/trade-in" },
  { name: "Corporate / Bulk", href: "/corporate" },
  { name: "Student Deals", href: "/student-deals" },
  { name: "Blog", href: "/blog" },
  { name: "Gallery", href: "/gallery" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "About", href: "/about" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
];

const allLinks = [...primaryLinks, ...moreLinks];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const { wishlist, compare } = useMarketplace();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  const waLink = buildWhatsAppLink(waMessages.generic());

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "bg-transparent",
        )}
      >
        <div className="container flex h-16 md:h-18 items-center justify-between gap-4">
          <Logo size={48} priority />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {primaryLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-electric-300"
                      : "text-foreground/80 hover:text-foreground",
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-lg bg-electric-500/15 border border-electric-500/30"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* More menu */}
            <div
              className="relative"
              onMouseEnter={() => setMoreOpen(true)}
              onMouseLeave={() => setMoreOpen(false)}
            >
              <button
                className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                aria-haspopup="true"
                aria-expanded={moreOpen}
              >
                More
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    moreOpen && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full pt-2"
                  >
                    <div className="w-64 rounded-2xl glass-strong border border-white/10 p-2 shadow-premium">
                      <div className="grid grid-cols-1 gap-0.5">
                        {moreLinks.map((l) => (
                          <Link
                            key={l.href}
                            href={l.href}
                            className="rounded-lg px-3 py-2 text-sm text-foreground/85 hover:text-foreground hover:bg-electric-500/10 transition-colors"
                          >
                            {l.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              aria-label="Search"
              asChild
            >
              <Link href="/shop">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex relative"
              aria-label="Compare"
            >
              <Link href="/compare">
                <GitCompare className="h-5 w-5" />
                {compare.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-electric-500 text-[10px] font-bold text-white">
                    {compare.length}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex relative"
              aria-label="Wishlist"
            >
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </Button>

            <Button
              asChild
              variant="whatsapp"
              size="sm"
              className="hidden xl:inline-flex ml-1"
            >
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Chat
              </a>
            </Button>

            <Button asChild size="sm" className="hidden md:inline-flex ml-1">
              <Link href="/shop">
                <ShoppingCart className="h-4 w-4" />
                Shop
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="fixed right-0 top-0 z-[70] h-screen w-[88%] max-w-sm glass-strong border-l border-white/10 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <Logo size={44} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
                {allLinks.map((link, i) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.025, 0.5) }}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          isActive
                            ? "bg-electric-500/15 text-electric-300 border border-electric-500/30"
                            : "hover:bg-white/5 text-foreground/90",
                        )}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-5 space-y-3 border-t border-white/5">
                <div className="grid grid-cols-2 gap-2">
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/wishlist">
                      <Heart className="h-4 w-4" />
                      Wishlist
                      {wishlist.length > 0 && ` (${wishlist.length})`}
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full">
                    <Link href="/compare">
                      <GitCompare className="h-4 w-4" />
                      Compare
                      {compare.length > 0 && ` (${compare.length})`}
                    </Link>
                  </Button>
                </div>
                <Button asChild variant="whatsapp" className="w-full" size="lg">
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-5 w-5" />
                    Chat on WhatsApp
                  </a>
                </Button>
                <Button asChild className="w-full" size="lg">
                  <Link href="/shop">
                    <ShoppingCart className="h-5 w-5" />
                    Shop Laptops
                  </Link>
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
