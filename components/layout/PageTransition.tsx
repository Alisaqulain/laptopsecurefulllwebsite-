"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Cinematic per-route transition.
 * Renders a sweeping curtain over the page on route change,
 * then reveals the new page with a subtle scale/fade.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
        {/* Curtain sweep */}
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[100]"
          initial={{ scaleY: 1, originY: 0 }}
          animate={{ scaleY: 0, originY: 0 }}
          exit={{ scaleY: 0, originY: 1 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          style={{
            background:
              "linear-gradient(180deg, #020817 0%, #0b1320 60%, #020817 100%)",
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
