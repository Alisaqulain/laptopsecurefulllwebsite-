"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Cpu, Gauge, Wifi, MemoryStick, HardDrive } from "lucide-react";

/**
 * Premium open-laptop hero showpiece.
 * Pure CSS — no WebGL, no 3D engines, almost no JS animation.
 *
 * Composition:
 *   ┌──────────────┐
 *   │   SCREEN     │   ← static rectangle with animated UI inside
 *   ├──────────────┤
 *   │   KEYBOARD   │   ← perspective trapezoid (single transform)
 *   └──────────────┘
 *
 * The previous version used hinged CSS 3D rotations that broke on
 * narrow heroes (lid collapsed to a thin strip) and ran 56 keyboard-key
 * keyframe animations simultaneously. This rewrite keeps the visual
 * identity but renders as a fixed, beautiful, performant tableau.
 */
export function Laptop3D() {
  const reduce = useReducedMotion();

  return (
    <div className="relative h-full w-full select-none flex items-center justify-center">
      {/* Soft ambient under-glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[78%] h-32 w-[70%] -translate-x-1/2 rounded-[50%] blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(closest-side, rgba(0,120,255,0.45), rgba(255,107,0,0.18) 55%, transparent 75%)",
        }}
      />

      <motion.div
        className="relative w-[min(560px,92%)]"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* === SCREEN === */}
        <div
          className="relative w-full rounded-[14px] border border-white/10 overflow-hidden"
          style={{
            aspectRatio: "16 / 10",
            background:
              "linear-gradient(135deg, #0b1322 0%, #0a1020 50%, #060a14 100%)",
            boxShadow:
              "inset 0 0 0 1px rgba(255,255,255,0.04), 0 14px 40px -10px rgba(0,0,0,0.8)",
          }}
        >
          {/* Bezel */}
          <div className="absolute inset-[3.5%] rounded-[9px] bg-black border border-white/5">
            {/* Screen content */}
            <div className="absolute inset-[3px] overflow-hidden rounded-[6px] bg-gradient-to-br from-[#020a1a] via-[#031032] to-[#0b1d40]">
              {/* Single subtle radial glow (no animation) */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-70"
                style={{
                  background:
                    "radial-gradient(ellipse at 30% 20%, rgba(0,120,255,0.45), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(255,107,0,0.30), transparent 55%)",
                }}
              />

              {/* Grid overlay */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-15"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* OS UI */}
              <div className="relative h-full w-full flex flex-col text-white">
                {/* Title bar */}
                <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-black/30">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-[10px] font-mono text-electric-300 truncate">
                    laptopsecure ~ benchmark.exe
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[9px] font-mono text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    LIVE
                  </span>
                </div>

                {/* Main content */}
                <div className="flex-1 p-3 grid grid-cols-3 gap-2">
                  {/* GPU panel */}
                  <div className="col-span-2 rounded-md border border-electric-500/30 bg-electric-500/5 p-2.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="h-3 w-3 text-electric-300" />
                        <span className="text-[9px] uppercase tracking-widest text-electric-300">
                          GPU · RTX 4090
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-electric-400">
                        92%
                      </span>
                    </div>
                    <div
                      className="font-display font-bold leading-none my-1.5"
                      style={{ fontSize: "clamp(18px, 3.2vw, 30px)" }}
                    >
                      240 FPS
                    </div>
                    <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-electric-500 via-electric-400 to-neon-500"
                        style={{ width: "92%" }}
                      />
                    </div>
                  </div>

                  {/* Temp panel */}
                  <div className="rounded-md border border-neon-500/30 bg-neon-500/5 p-2.5 flex flex-col justify-between">
                    <div className="flex items-center gap-1.5">
                      <Gauge className="h-3 w-3 text-neon-300" />
                      <span className="text-[9px] uppercase tracking-widest text-neon-300">
                        Temp
                      </span>
                    </div>
                    <div
                      className="font-display font-bold text-neon-300 leading-none"
                      style={{ fontSize: "clamp(18px, 3vw, 28px)" }}
                    >
                      58°
                    </div>
                    <div className="text-[9px] font-mono text-white/50">
                      Optimal
                    </div>
                  </div>

                  {/* Spec chips row */}
                  <div className="col-span-3 grid grid-cols-3 gap-2 mt-0.5">
                    <SpecChip icon={MemoryStick} label="RAM 32GB" />
                    <SpecChip icon={HardDrive} label="SSD 2TB" />
                    <SpecChip icon={Wifi} label="WiFi 7" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Camera notch */}
          <div className="absolute left-1/2 top-[1.5%] h-1 w-10 -translate-x-1/2 rounded-full bg-black/80 border border-white/5">
            <span className="absolute left-1/2 top-1/2 h-[3px] w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-400/80 shadow-[0_0_4px_#0078ff]" />
          </div>
        </div>

        {/* === BASE / KEYBOARD === (perspective trapezoid) */}
        <div className="relative" style={{ perspective: "1100px" }}>
          <div
            className="relative w-full mx-auto rounded-b-[14px] border border-white/10"
            style={{
              transform: "rotateX(58deg)",
              transformOrigin: "50% 0%",
              aspectRatio: "16 / 4.4",
              background:
                "linear-gradient(180deg, #0e1422 0%, #0b1120 60%, #060a14 100%)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.06), 0 24px 50px -10px rgba(0,0,0,0.8)",
            }}
          >
            {/* Keyboard well */}
            <div
              className="absolute inset-x-[5%] top-[10%] bottom-[40%] rounded-[6px] bg-[#070b14] border border-white/5 p-[1.2%]"
              style={{
                display: "grid",
                gridTemplateRows: "repeat(4, 1fr)",
                gap: "2.5%",
              }}
            >
              {Array.from({ length: 4 }).map((_, r) => (
                <div
                  key={r}
                  className="grid"
                  style={{
                    gridTemplateColumns: "repeat(14, minmax(0, 1fr))",
                    gap: "2%",
                  }}
                >
                  {Array.from({ length: 14 }).map((_, c) => (
                    <div
                      key={c}
                      className="rounded-[2px] border border-white/5"
                      style={{
                        background:
                          "linear-gradient(180deg, #1a2230 0%, #121826 100%)",
                        boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.5)",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Trackpad */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[6%] w-[42%] h-[26%] rounded-[6px] border border-white/10"
              style={{
                background:
                  "linear-gradient(180deg, #1a2230 0%, rgba(17,23,38,0.5) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            />
          </div>

          {/* Front lip */}
          <div
            className="absolute left-[2%] right-[2%] -bottom-[6px] h-[6px] rounded-b-[10px]"
            style={{
              background: "linear-gradient(180deg, #060a14, #02050a)",
              boxShadow: "0 6px 12px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function SpecChip({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1.5">
      <Icon className="h-3 w-3 text-electric-300 shrink-0" />
      <span className="text-[9px] md:text-[10px] font-mono text-white/80 truncate">
        {label}
      </span>
    </div>
  );
}
