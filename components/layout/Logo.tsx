"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** When false, only the square shield-icon area is shown (compact). */
  showText?: boolean;
  /** Visual height in pixels. Width scales to preserve aspect ratio. */
  size?: number;
  priority?: boolean;
}

// Native asset is 1536×1024 (3:2). The shield icon sits in the
// horizontal-center-left region, the wordmark to its right.
const FULL_ASPECT = 1536 / 1024; // 1.5

export function Logo({
  className,
  showText = true,
  size = 44,
  priority = false,
}: LogoProps) {
  const width = showText ? Math.round(size * FULL_ASPECT) : size;

  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center", className)}
      aria-label="LaptopSecure home"
    >
      <motion.span
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="relative inline-block"
        style={{
          height: size,
          width,
        }}
      >
        <Image
          src="/logo.jpg"
          alt="LaptopSecure"
          fill
          priority={priority}
          sizes={`${width}px`}
          // mix-blend-mode: screen → black pixels become transparent
          // against any dark background (works great for our dark theme).
          style={{ mixBlendMode: "screen" }}
          className={cn(
            "select-none",
            showText
              ? "object-contain"
              : "object-cover scale-[1.7] -translate-x-[18%]",
          )}
        />
      </motion.span>
    </Link>
  );
}
