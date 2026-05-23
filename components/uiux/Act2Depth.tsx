"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";

type Surface = { label: string; accent: boolean };

const SURFACES: Surface[] = [
  { label: "Button", accent: false },
  { label: "Card", accent: false },
  { label: "Modal", accent: true },
  { label: "Toast", accent: false },
  { label: "Menu", accent: false },
  { label: "Sheet", accent: true },
];

export default function Act2Depth() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const eyebrowOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.18, 0.85, 0.95],
    [0, 1, 1, 0]
  );
  const stackRotateX = useTransform(
    scrollYProgress,
    [0.2, 0.65],
    reduce ? [-22, -22] : [-2, -28]
  );

  return (
    <section ref={ref} className="relative h-[300vh] bg-ink">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: eyebrowOpacity }} className="text-center mb-14 px-6">
          <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">
            ▸ Depth
          </p>
          <h2 className="text-white text-3xl sm:text-5xl font-light tracking-tight">
            Z-axis is hierarchy.
          </h2>
        </motion.div>

        <div className="relative" style={{ perspective: 1400 }}>
          <motion.div
            style={{ rotateX: stackRotateX, transformStyle: "preserve-3d" }}
            className="relative w-[min(640px,86vw)] h-[320px] flex items-center justify-center"
          >
            {SURFACES.map((s, i) => (
              <DepthCard
                key={s.label}
                surface={s}
                index={i}
                total={SURFACES.length}
                progress={scrollYProgress}
                reduce={!!reduce}
              />
            ))}
          </motion.div>
        </div>

        <motion.p
          style={{ opacity: eyebrowOpacity }}
          className="mt-16 text-white/40 text-sm max-w-md text-center px-6 font-light leading-relaxed"
        >
          Real interfaces have layers. We design every layer to know its place.
        </motion.p>
      </div>
    </section>
  );
}

function DepthCard({
  surface,
  index,
  total,
  progress,
  reduce,
}: {
  surface: Surface;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
}) {
  const start = 0.2;
  const end = 0.65;

  // Y: tight peeking stack → fanned vertical layout
  const stackedY = index * 4 - (total * 4) / 2;
  const spreadY = index * 36 - (total * 36) / 2 + 18;
  const y = useTransform(progress, [start, end], reduce ? [spreadY, spreadY] : [stackedY, spreadY]);

  // Z: depth offset deepens as scroll progresses
  const startZ = index * 6;
  const endZ = index * 26;
  const z = useTransform(progress, [start, end], reduce ? [endZ, endZ] : [startZ, endZ]);

  const opacity = useTransform(
    progress,
    [start - 0.15, start, 0.95, 1],
    [0.55, 1, 1, 0.4]
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        y,
        translateZ: z,
        opacity,
        transformStyle: "preserve-3d",
      }}
      className="rounded-2xl border border-white/[0.08] bg-ink-elev/70 backdrop-blur-sm"
    >
      <div className="flex items-center px-6 py-4 gap-5">
        <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase tabular-nums w-5">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={
            (surface.accent ? "text-ember" : "text-white/75") +
            " text-sm tracking-tight font-medium"
          }
        >
          {surface.label}
        </span>
        <span
          className="ml-auto h-1 rounded-full"
          style={{
            width: 40 + index * 8,
            background: surface.accent
              ? "rgba(255,107,26,0.5)"
              : "rgba(255,255,255,0.12)",
          }}
        />
      </div>
      {surface.accent && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,107,26,0.18)" }}
        />
      )}
    </motion.div>
  );
}
