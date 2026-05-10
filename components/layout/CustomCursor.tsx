"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Premium custom cursor with two layers:
 *   1) A small dot that snaps to the pointer
 *   2) A larger "halo" ring that lags slightly via spring
 *
 * On hoverable elements ([data-cursor="hover"], anchors, buttons),
 * the halo grows + glows. On text inputs, it morphs into an I-beam.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [variant, setVariant] = useState<"default" | "hover" | "text">(
    "default",
  );
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 800, damping: 40, mass: 0.4 });
  const dotY = useSpring(y, { stiffness: 800, damping: 40, mass: 0.4 });
  const haloX = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 });
  const haloY = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const onLeave = () => setHidden(true);
    const onEnter = () => setHidden(false);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive =
        target.closest(
          'a, button, [role="button"], [data-cursor="hover"]',
        ) !== null;
      const isText =
        target.closest('input, textarea, [contenteditable="true"]') !== null;
      setVariant(isText ? "text" : interactive ? "hover" : "default");
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.style.cursor = "";
    };
  }, [x, y]);

  if (!enabled) return null;

  const haloSize =
    variant === "hover" ? 64 : variant === "text" ? 6 : 36;
  const haloHeight = variant === "text" ? 30 : haloSize;

  return (
    <>
      {/* Inner dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hidden ? 0 : 1,
        }}
      >
        <motion.span
          className="block rounded-full bg-white"
          animate={{
            width: variant === "hover" ? 6 : 8,
            height: variant === "hover" ? 6 : 8,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Halo ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[9998]"
        style={{
          x: haloX,
          y: haloY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: hidden ? 0 : 1,
        }}
      >
        <motion.span
          className="block rounded-full"
          animate={{
            width: haloSize,
            height: haloHeight,
            borderRadius: variant === "text" ? 4 : 999,
            background:
              variant === "hover"
                ? "radial-gradient(circle, rgba(0,120,255,0.35), rgba(255,107,0,0.2) 60%, transparent 80%)"
                : "transparent",
            borderColor:
              variant === "hover"
                ? "rgba(0,120,255,0.6)"
                : "rgba(255,255,255,0.4)",
            boxShadow:
              variant === "hover"
                ? "0 0 30px rgba(0,120,255,0.45), 0 0 60px rgba(255,107,0,0.25)"
                : "0 0 0 rgba(0,0,0,0)",
          }}
          transition={{ type: "spring", stiffness: 250, damping: 26 }}
          style={{
            border: "1.5px solid",
            backdropFilter: variant === "hover" ? "blur(2px)" : "none",
          }}
        />
      </motion.div>
    </>
  );
}
