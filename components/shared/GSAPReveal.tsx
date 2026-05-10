"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GSAPRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger child elements with these selectors */
  stagger?: string;
  /** Animation type */
  animation?: "fade-up" | "fade-in" | "scale" | "slide-left" | "slide-right";
}

export function GSAPReveal({
  children,
  className,
  stagger,
  animation = "fade-up",
}: GSAPRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const target = stagger ? ref.current!.querySelectorAll(stagger) : ref.current;
      if (!target) return;

      const fromVars: gsap.TweenVars = {
        opacity: 0,
        ...(animation === "fade-up" && { y: 50 }),
        ...(animation === "scale" && { scale: 0.85 }),
        ...(animation === "slide-left" && { x: -60 }),
        ...(animation === "slide-right" && { x: 60 }),
      };

      const toVars: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        ...(stagger && { stagger: 0.1 }),
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      };

      gsap.fromTo(target, fromVars, toVars);
    }, ref);

    return () => ctx.revert();
  }, [stagger, animation]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function GSAPParallax({
  children,
  speed = 0.4,
  className,
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -speed * 100,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
