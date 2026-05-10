"use client";

import { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  density?: number;
  className?: string;
}

export function ParticleBackground({
  density = 18,
  className = "",
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respect reduced-motion preference: don't animate at all.
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let animationId: number;
    let particles: Particle[] = [];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      opacity: number;
    }

    const colors = ["#0078ff", "#ff6b00", "#3aa4ff"];

    const resize = () => {
      // Cap DPR at 1.5 to avoid expensive renders on hi-DPI screens.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      // Halve density on small screens.
      const count =
        canvas.offsetWidth < 768 ? Math.round(density * 0.5) : density;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        size: Math.random() * 1.6 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.45 + 0.2,
      }));
    };

    // Throttle to ~30fps – plenty for ambient particles, half the cost.
    const FRAME_MS = 1000 / 30;
    let last = 0;

    const draw = (now: number) => {
      animationId = requestAnimationFrame(draw);
      if (now - last < FRAME_MS) return;
      last = now;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // No shadowBlur (very expensive). No O(N²) line connections.
      // Just clean glowing dots.
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.floor(p.opacity * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();
      }
    };

    resize();
    init();
    if (!reduceMotion) animationId = requestAnimationFrame(draw);
    else {
      // Render one static frame for accessibility users.
      draw(performance.now());
    }

    const handleResize = () => {
      resize();
      init();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`absolute inset-0 h-full w-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
}
