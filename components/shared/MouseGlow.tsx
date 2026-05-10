"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function MouseGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springX = useSpring(cursorX, { stiffness: 200, damping: 30 });
  const springY = useSpring(cursorY, { stiffness: 200, damping: 30 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) {
      setIsCoarse(true);
      return;
    }
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 200);
      cursorY.set(e.clientY - 200);
      setIsVisible(true);
    };
    const onLeave = () => setIsVisible(false);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [cursorX, cursorY]);

  if (isCoarse) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[1] h-[400px] w-[400px] rounded-full"
      style={{
        x: springX,
        y: springY,
        background:
          "radial-gradient(closest-side, rgba(0,120,255,0.18), rgba(255,107,0,0.08), transparent 75%)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.4s ease",
        mixBlendMode: "screen",
      }}
    />
  );
}
