"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type AnnotationPos =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export default function Act4Detail() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0.18, 0.7], reduce ? [1.8, 1.8] : [1, 3.0]);
  const x = useTransform(scrollYProgress, [0.18, 0.7], reduce ? [0, 0] : [0, -70]);
  const y = useTransform(scrollYProgress, [0.18, 0.7], reduce ? [0, 0] : [0, 36]);

  const eyebrowOp = useTransform(scrollYProgress, [0.05, 0.18, 0.5, 0.62], [0, 1, 1, 0]);
  const annotationsOp = useTransform(scrollYProgress, [0.45, 0.62, 0.92, 1], [0, 1, 1, 0]);
  const sectionOp = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative h-[260vh] bg-ink">
      <motion.div
        style={{ opacity: sectionOp }}
        className="sticky top-0 h-screen overflow-hidden"
      >
        {/* center stage: title + the component */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <motion.div style={{ opacity: eyebrowOp }} className="text-center mb-12 relative z-10">
            <p className="text-ember text-[10px] tracking-[0.35em] uppercase mb-3 font-medium">
              ▸ Detail
            </p>
            <h2 className="text-white text-3xl sm:text-5xl font-light tracking-tight">
              Look closer.
            </h2>
          </motion.div>

          <div style={{ perspective: 1200 }}>
            <motion.div
              style={{ scale, x, y, transformOrigin: "55% 45%" }}
              className="relative"
            >
              <CommandPalette />
            </motion.div>
          </div>
        </div>

        {/* annotations layered over the sticky viewport */}
        <motion.div
          style={{ opacity: annotationsOp }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <Annotation pos="top-left" text="1px hairline border" />
          <Annotation pos="top-right" text="Tabular numerics" />
          <Annotation pos="bottom-left" text="Inset shadow / 0 1 0 0.4" />
          <Annotation pos="bottom-right" text="Ember focus ring" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function Annotation({ pos, text }: { pos: AnnotationPos; text: string }) {
  const isTop = pos.startsWith("top");
  const isLeft = pos.endsWith("left");
  return (
    <div
      className="absolute text-ember/75 text-[10px] tracking-[0.25em] uppercase whitespace-nowrap flex items-center gap-3"
      style={{
        top: isTop ? "16%" : undefined,
        bottom: !isTop ? "18%" : undefined,
        left: isLeft ? "6%" : undefined,
        right: !isLeft ? "6%" : undefined,
        flexDirection: isLeft ? "row" : "row-reverse",
      }}
    >
      <span
        className="h-px bg-ember/40"
        style={{ width: 48 }}
      />
      <span>{text}</span>
    </div>
  );
}

function CommandPalette() {
  return (
    <div
      className="w-[440px] max-w-[88vw] rounded-xl border border-white/10 bg-ink-elev/90 backdrop-blur-md overflow-hidden"
      style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" }}
    >
      {/* search row */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06]">
        <span className="w-1.5 h-1.5 rounded-full bg-ember" />
        <span className="text-white/35 text-[11px] flex-1">Search the studio…</span>
        <span className="text-white/20 text-[9px] tracking-widest uppercase tabular-nums px-1.5 py-0.5 rounded border border-white/10">
          ⌘K
        </span>
      </div>

      {/* items */}
      <div className="py-2">
        {[
          { glyph: "▸", label: "New project", shortcut: "⇧N", focus: false },
          { glyph: "◆", label: "Polish existing site", shortcut: "⇧P", focus: true },
          { glyph: "▦", label: "Browse practices", shortcut: "⇧B", focus: false },
          { glyph: "✕", label: "Close palette", shortcut: "esc", focus: false },
        ].map((item, i) => (
          <div
            key={i}
            className={
              "relative flex items-center gap-3 px-4 py-2.5 " +
              (item.focus
                ? "bg-ember/[0.07]"
                : "")
            }
            style={
              item.focus
                ? { boxShadow: "inset 0 0 0 1px rgba(255,107,26,0.22), inset 3px 0 0 0 #ff6b1a" }
                : undefined
            }
          >
            <span className={item.focus ? "text-ember text-xs" : "text-white/35 text-xs"}>
              {item.glyph}
            </span>
            <span
              className={
                (item.focus ? "text-white" : "text-white/60") +
                " text-[11px] flex-1 tracking-tight"
              }
            >
              {item.label}
            </span>
            <span className="text-white/20 text-[9px] tracking-widest uppercase tabular-nums px-1.5 py-0.5 rounded border border-white/10">
              {item.shortcut}
            </span>
          </div>
        ))}
      </div>

      {/* footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.05] text-white/25 text-[9px] tracking-widest uppercase">
        <span>Navigate ↑↓</span>
        <span>Select ↵</span>
      </div>
    </div>
  );
}
