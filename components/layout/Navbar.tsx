"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ShoppingCart, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/config";
import { buildWhatsAppLink, waMessages } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

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
        <div className="container flex h-16 md:h-18 items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
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
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
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
              variant="whatsapp"
              size="sm"
              className="hidden md:inline-flex"
            >
              <a href={waLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                Chat Now
              </a>
            </Button>

            <Button
              asChild
              size="sm"
              className="hidden md:inline-flex"
            >
              <Link href="/shop">
                <ShoppingCart className="h-4 w-4" />
                Shop
              </Link>
            </Button>

            {/* Mobile burger */}
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
                <Logo />
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
                {navLinks.map((link, i) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
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
                        <span className="text-electric-400 opacity-0 group-hover:opacity-100">
                          →
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="p-5 space-y-3 border-t border-white/5">
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
